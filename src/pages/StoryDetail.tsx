import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, BookOpen, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

// Map URL slugs back to DB kanda names
const slugToName: Record<string, string> = {
  bala: "Bala Kanda",
  ayodhya: "Ayodhya Kanda",
  aranya: "Aranya Kanda",
  kishkindha: "Kishkindha Kanda",
  sundara: "Sundara Kanda",
  yuddha: "Yuddha Kanda",
  uttara: "Uttara Kanda",
};

type Chapter = {
  id: string;
  chapter_number: number;
  title: string;
  sanskrit_text: string | null;
  telugu_text: string | null;
  hindi_text: string | null;
  tamil_text: string | null;
  kannada_text: string | null;
  malayalam_text: string | null;
  explanation: string | null;
  cinematic_version: string | null;
  image_url: string | null;
};

const ChapterCard = ({ chapter, index }: { chapter: Chapter; index: number }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-xl glass-card overflow-hidden"
    >
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
            {chapter.chapter_number}
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {chapter.title}
          </h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-4 pb-5">
              {/* Sanskrit */}
              {chapter.sanskrit_text && (
                <div className="rounded-lg bg-primary/5 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/60">
                    संस्कृत (Sanskrit)
                  </p>
                  <p className="font-display text-sm italic text-foreground/80">
                    {chapter.sanskrit_text}
                  </p>
                </div>
              )}

              {/* Telugu */}
              {chapter.telugu_text && (
                <div className="rounded-lg bg-accent/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground/60">
                    తెలుగు (Telugu)
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {chapter.telugu_text}
                  </p>
                </div>
              )}

              {/* Hindi */}
              {chapter.hindi_text && (
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-orange-600/70">
                    हिन्दी (Hindi)
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {chapter.hindi_text}
                  </p>
                </div>
              )}

              {/* Tamil */}
              {chapter.tamil_text && (
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600/70">
                    தமிழ் (Tamil)
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {chapter.tamil_text}
                  </p>
                </div>
              )}

              {/* Kannada */}
              {chapter.kannada_text && (
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600/70">
                    ಕನ್ನಡ (Kannada)
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {chapter.kannada_text}
                  </p>
                </div>
              )}

              {/* Malayalam */}
              {chapter.malayalam_text && (
                <div className="rounded-lg bg-rose-500/10 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-600/70">
                    മലയാളം (Malayalam)
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {chapter.malayalam_text}
                  </p>
                </div>
              )}

              {/* Explanation */}
              {chapter.explanation && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/60">
                    Modern Explanation
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {chapter.explanation}
                  </p>
                </div>
              )}

              {/* Cinematic */}
              {chapter.cinematic_version && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                      Cinematic Version
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed italic text-foreground/85">
                    {chapter.cinematic_version}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const kandaName = slugToName[id ?? ""] ?? "";

  // Fetch the kanda record
  const { data: kanda, isLoading: kandaLoading } = useQuery({
    queryKey: ["kanda", kandaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kandas")
        .select("*")
        .eq("name", kandaName)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!kandaName,
  });

  // Fetch chapters for this kanda
  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", kanda?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("kanda_id", kanda!.id)
        .order("chapter_number");
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!kanda?.id,
  });

  const isLoading = kandaLoading || chaptersLoading;

  if (!kandaName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Kanda not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-14">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <button
          onClick={() => navigate("/story-mode")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            {kandaName}
          </h1>
          {kanda && (
            <p className="text-xs text-muted-foreground">{kanda.description}</p>
          )}
        </div>
      </div>

      {kanda && (
        <p className="mb-6 text-xs text-muted-foreground">
          {chapters?.length ?? "—"} chapters available
        </p>
      )}

      {/* Skeleton loading */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!chapters || chapters.length === 0) && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No chapters available yet.
          </p>
        </div>
      )}

      {/* Chapter list */}
      {!isLoading && chapters && chapters.length > 0 && (
        <div className="flex flex-col gap-3">
          {chapters.map((chapter, index) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
