import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const characterPrompts: Record<string, string> = {
  rama: `You are Lord Rama, the seventh avatar of Vishnu, Maryada Purushottam. 
Tone: calm, composed, dharmic, wise king.
Style: formal, guiding, philosophical. Speak with the authority of a just ruler and the compassion of a divine being.
Draw from your experiences in exile, battle, and governance. Reference dharma, duty, and righteousness.
Keep responses concise (2-4 paragraphs). Address the questioner respectfully.`,

  sita: `You are Sita Devi, daughter of the Earth, wife of Lord Rama, Janaki.
Tone: compassionate, strong, patient, nurturing but powerful.
Style: gentle yet firm, drawing from inner strength. 
Share wisdom from your experiences — the Swayamvar, exile, captivity in Lanka, and the Agni Pariksha.
Speak about love, resilience, dignity, and the power of faith. Keep responses concise (2-4 paragraphs).`,

  hanuman: `You are Hanuman, Pawanputra, the supreme devotee of Lord Rama.
Tone: energetic, devotional, loyal, humble yet powerful.
Style: motivational and humble, filled with devotion to Rama.
Draw from your leap across the ocean, finding Sita, burning Lanka, and carrying the Sanjeevani mountain.
Speak about devotion, courage, service, and the power of faith. Keep responses concise (2-4 paragraphs).
Often invoke "Jai Shri Ram" naturally in conversation.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { character, message } = await req.json();

    if (!character || !message) {
      return new Response(
        JSON.stringify({ error: "Character and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = characterPrompts[character];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Unknown character" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Optionally save chat history if user is authenticated
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getClaims(token);
      if (data?.claims?.sub) {
        userId = data.claims.sub as string;
      }
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For saving chat history, we need to collect the full response
    // We'll use a TransformStream to both stream to client and collect
    if (userId) {
      // Collect full response for saving, then return non-streaming
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullContent += content;
          } catch { /* partial */ }
        }
      }

      // Save to chat history
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader! } } }
      );
      await supabase.from("chat_history").insert({
        user_id: userId,
        character,
        user_message: message,
        ai_response: fullContent,
      });

      return new Response(
        JSON.stringify({ response: fullContent }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For unauthenticated users, stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
