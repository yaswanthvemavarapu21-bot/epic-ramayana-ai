import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Crown, Wind, Flower2 } from "lucide-react";

const characters = [
  {
    id: "rama",
    name: "Lord Rama",
    title: "Maryada Purushottam",
    description: "The ideal man, embodiment of dharma, valor, and compassion. Seventh avatar of Vishnu.",
    icon: Crown,
  },
  {
    id: "hanuman",
    name: "Hanuman",
    title: "Pawanputra",
    description: "The supreme devotee, son of the wind god. Boundless strength guided by unwavering loyalty.",
    icon: Wind,
  },
  {
    id: "sita",
    name: "Sita Devi",
    title: "Janaki",
    description: "Daughter of the Earth, embodiment of purity, devotion, and inner strength.",
    icon: Flower2,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Characters = () => {
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
          Speak to Legends
        </h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Choose a character to converse with
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {characters.map((char) => (
          <motion.button
            key={char.id}
            variants={item}
            onClick={() => navigate(`/chat/${char.id}`)}
            className="group rounded-xl border border-gold/20 bg-card p-5 text-left shadow-card transition-all duration-300 hover:border-gold/40 hover:shadow-gold active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <char.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-foreground">
                  {char.name}
                </h3>
                <p className="text-xs font-display italic text-primary/70">
                  {char.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {char.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Characters;
