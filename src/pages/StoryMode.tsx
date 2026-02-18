import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Map DB kanda names to URL slugs
const nameToSlug: Record<string, string> = {
  "Bala Kanda": "bala",
  "Ayodhya Kanda": "ayodhya",
  "Aranya Kanda": "aranya",
  "Kishkindha Kanda": "kishkindha",
  "Sundara Kanda": "sundara",
  "Yuddha Kanda": "yuddha",
  "Uttara Kanda": "uttara",
};

const subtitles: Record<string, string> = {
  "Bala Kanda": "The Book of Youth",
  "Ayodhya Kanda": "The Book of Ayodhya",
  "Aranya Kanda": "The Book of the Forest",
  "Kishkindha Kanda": "The Book of Kishkindha",
  "Sundara Kanda": "The Beautiful Book",
  "Yuddha Kanda": "The Book of War",
  "Uttara Kanda": "The Final Book",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const StoryMode = () => {
  const navigate = useNavigate();

  const { data: kandas, isLoading } = useQuery({
    queryKey: ["kandas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kandas")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-14">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/home")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Story Mode
        </h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Explore the seven books of Valmiki Ramayana
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {kandas?.map((kanda, index) => {
            const slug = nameToSlug[kanda.name] ?? kanda.name.toLowerCase();
            const subtitle = subtitles[kanda.name] ?? "";
            return (
              <motion.button
                key={kanda.id}
                variants={item}
                onClick={() => navigate(`/story/${slug}`)}
                className="group flex items-center justify-between rounded-xl glass-card glass-card-hover p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {kanda.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {subtitle} · {kanda.chapter_count} chapters
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {!isLoading && !kandas?.length && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No kandas found.</p>
        </div>
      )}
    </div>
  );
};

export default StoryMode;
