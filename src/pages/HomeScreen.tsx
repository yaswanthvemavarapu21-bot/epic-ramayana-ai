import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Lightbulb, Map } from "lucide-react";

const menuItems = [
  {
    label: "Story Mode",
    description: "Explore the seven Kandas",
    icon: BookOpen,
    path: "/story-mode",
  },
  {
    label: "Speak to Legends",
    description: "Converse with epic characters",
    icon: MessageCircle,
    path: "/characters",
  },
  {
    label: "Life Lessons",
    description: "Timeless wisdom for today",
    icon: Lightbulb,
    path: "/life-lessons",
  },
  {
    label: "Journey Map",
    description: "Trace the sacred path",
    icon: Map,
    path: "/journey-map",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pb-24 pt-14">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-display font-bold text-gradient-gold tracking-wide">
          Ramayana AI
        </h1>
        <p className="mt-1 text-sm font-display text-primary/70 italic tracking-widest">
          The Living Epic
        </p>
        <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {menuItems.map((menuItem) => (
          <motion.button
            key={menuItem.label}
            variants={item}
            onClick={() => navigate(menuItem.path)}
            className="group flex items-center gap-4 rounded-xl border border-gold/20 bg-card p-5 text-left shadow-card transition-all duration-300 hover:border-gold/40 hover:shadow-gold active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <menuItem.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {menuItem.label}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {menuItem.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default HomeScreen;
