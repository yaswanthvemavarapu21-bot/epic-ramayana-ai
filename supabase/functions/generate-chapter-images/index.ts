import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { kanda_name, batch_size = 5 } = await req.json();

    // Get chapters that still need images
    let query = supabase
      .from("chapters")
      .select("id, title, chapter_number, kanda_id, kandas!inner(name)")
      .is("image_url", null)
      .order("chapter_number")
      .limit(batch_size);

    if (kanda_name) {
      query = query.eq("kandas.name", kanda_name);
    }

    const { data: chapters, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;
    if (!chapters || chapters.length === 0) {
      return new Response(
        JSON.stringify({ message: "All chapters already have images", generated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { id: string; title: string; status: string }[] = [];

    for (const chapter of chapters) {
      const kandaNameStr = (chapter as any).kandas?.name ?? "Ramayana";
      const prompt = `Ancient Indian epic Ramayana illustration in a rich, cinematic art style with warm golden lighting and vibrant colors. Scene: "${chapter.title}" from ${kandaNameStr}. Show the key moment of this chapter with mythological characters in traditional Indian attire, set against an ancient Indian landscape. Detailed, painterly, epic atmosphere. No text or watermarks.`;

      try {
        console.log(`Generating image for: ${chapter.title}`);
        const aiResp = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["image", "text"],
            }),
          }
        );

        if (!aiResp.ok) {
          const errText = await aiResp.text();
          console.error(`AI error for ${chapter.title}: ${aiResp.status} ${errText}`);
          results.push({ id: chapter.id, title: chapter.title, status: `ai_error_${aiResp.status}` });
          continue;
        }

        const aiData = await aiResp.json();
        const imageB64 =
          aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageB64) {
          console.error(`No image returned for ${chapter.title}`);
          results.push({ id: chapter.id, title: chapter.title, status: "no_image_returned" });
          continue;
        }

        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Data = imageB64.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = decode(base64Data);

        const filePath = `${chapter.id}.png`;

        // Upload to storage
        const { error: uploadErr } = await supabase.storage
          .from("chapter-images")
          .upload(filePath, imageBytes, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadErr) {
          console.error(`Upload error for ${chapter.title}:`, uploadErr);
          results.push({ id: chapter.id, title: chapter.title, status: "upload_error" });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("chapter-images")
          .getPublicUrl(filePath);

        // Update chapter row
        const { error: updateErr } = await supabase
          .from("chapters")
          .update({ image_url: urlData.publicUrl })
          .eq("id", chapter.id);

        if (updateErr) {
          console.error(`DB update error for ${chapter.title}:`, updateErr);
          results.push({ id: chapter.id, title: chapter.title, status: "db_update_error" });
          continue;
        }

        results.push({ id: chapter.id, title: chapter.title, status: "success" });
        console.log(`✅ Generated image for: ${chapter.title}`);
      } catch (e) {
        console.error(`Error generating for ${chapter.title}:`, e);
        results.push({ id: chapter.id, title: chapter.title, status: "exception" });
      }
    }

    return new Response(
      JSON.stringify({ generated: results.filter(r => r.status === "success").length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
