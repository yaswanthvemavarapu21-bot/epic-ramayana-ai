import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search, Sparkles } from "lucide-react";

const lessons = [
  { id: 1, topic: "Leadership", summary: "Rama's example teaches that true leadership is rooted in selflessness, duty, and compassion for all." },
  { id: 2, topic: "Betrayal", summary: "Kaikeyi's demand and Vibhishana's defection show that betrayal often stems from fear, manipulation, or moral awakening." },
  { id: 3, topic: "Patience", summary: "Fourteen years of exile demonstrate that patience in adversity is not passive — it is preparing for destiny." },
  { id: 4, topic: "Ego", summary: "Ravana's ten heads symbolize unchecked ego. His immense knowledge was rendered useless by arrogance." },
  { id: 5, topic: "Devotion", summary: "Hanuman embodies that devotion is the ultimate strength — when you serve a higher purpose, no obstacle is insurmountable." },
  { id: 6, topic: "Sacrifice", summary: "Lakshmana's sacrifice of comfort and Bharata's refusal of the throne teach the nobility of putting others first." },
  { id: 7, topic: "Courage", summary: "Sita's dignified resilience in captivity shows that courage is not the absence of fear but the presence of grace." },
  { id: 8, topic: "Friendship", summary: "The bond between Rama and Sugriva demonstrates that true friendship is born from mutual trust and honor." },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const LifeLessons = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = lessons.filter(
    (l) =>
      l.topic.toLowerCase().includes(search.toLowerCase()) ||
      l.summary.toLowerCase().includes(search.toLowerCase())
  );

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
          Life Lessons
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lessons..."
          className="w-full rounded-xl glass-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {filtered.map((lesson) => (
          <motion.div
            key={lesson.id}
            variants={item}
            className="rounded-xl glass-card p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-sm font-semibold text-primary">
                {lesson.topic}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">
              {lesson.summary}
            </p>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No lessons found
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LifeLessons;
