import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const kandas = [
  {
    id: "bala",
    name: "Bala Kanda",
    subtitle: "The Book of Youth",
    description: "Birth and early life of Rama, his education and marriage to Sita.",
    chapters: 77,
  },
  {
    id: "ayodhya",
    name: "Ayodhya Kanda",
    subtitle: "The Book of Ayodhya",
    description: "Rama's exile from Ayodhya for fourteen years into the forest.",
    chapters: 119,
  },
  {
    id: "aranya",
    name: "Aranya Kanda",
    subtitle: "The Book of the Forest",
    description: "Life in the forest, encounters with sages, and Sita's abduction.",
    chapters: 75,
  },
  {
    id: "kishkindha",
    name: "Kishkindha Kanda",
    subtitle: "The Book of Kishkindha",
    description: "Alliance with Sugriva and the monkey kingdom, search for Sita.",
    chapters: 67,
  },
  {
    id: "sundara",
    name: "Sundara Kanda",
    subtitle: "The Beautiful Book",
    description: "Hanuman's journey to Lanka, finding Sita, and his heroic deeds.",
    chapters: 68,
  },
  {
    id: "yuddha",
    name: "Yuddha Kanda",
    subtitle: "The Book of War",
    description: "The great battle between Rama's forces and Ravana's army.",
    chapters: 131,
  },
];

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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {kandas.map((kanda, index) => (
          <motion.button
            key={kanda.id}
            variants={item}
            onClick={() => navigate(`/story/${kanda.id}`)}
            className="group flex items-center justify-between rounded-xl border border-gold/15 bg-card p-4 text-left shadow-card transition-all duration-300 hover:border-gold/30 active:scale-[0.98]"
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
                  {kanda.subtitle} · {kanda.chapters} chapters
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default StoryMode;
