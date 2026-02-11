import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MapPin, X } from "lucide-react";
import mapImage from "@/assets/india-map.jpg";

const locations = [
  {
    id: "ayodhya",
    name: "Ayodhya",
    description: "Birthplace and kingdom of Lord Rama. The journey begins here.",
    top: "28%",
    left: "48%",
  },
  {
    id: "forest",
    name: "Dandaka Forest",
    description: "Where Rama, Sita, and Lakshmana spent their years of exile among sages.",
    top: "48%",
    left: "40%",
  },
  {
    id: "kishkindha",
    name: "Kishkindha",
    description: "Kingdom of the Vanaras. Here Rama formed his alliance with Sugriva and met Hanuman.",
    top: "58%",
    left: "38%",
  },
  {
    id: "rameshwaram",
    name: "Rameshwaram",
    description: "From this sacred shore, the bridge to Lanka was built by the Vanara army.",
    top: "72%",
    left: "42%",
  },
  {
    id: "lanka",
    name: "Lanka",
    description: "The golden fortress of Ravana. Site of the great battle and Sita's rescue.",
    top: "80%",
    left: "45%",
  },
];

// SVG path points matching location positions (percentage-based, mapped to viewBox 0-100)
const pathPoints = [
  { x: 48, y: 28 },  // Ayodhya
  { x: 40, y: 48 },  // Forest
  { x: 38, y: 58 },  // Kishkindha
  { x: 42, y: 72 },  // Rameshwaram
  { x: 45, y: 80 },  // Lanka
];

const pathD = pathPoints
  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
  .join(" ");

const JourneyMap = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedLoc = locations.find((l) => l.id === selected);

  return (
    <div className="min-h-screen bg-background pb-24 pt-14">
      <div className="mb-4 flex items-center gap-3 px-6">
        <button
          onClick={() => navigate("/home")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Journey Map
        </h1>
      </div>

      <p className="mb-4 px-6 text-sm text-muted-foreground">
        Trace Rama's sacred path across the land
      </p>

      <div className="relative mx-6 overflow-hidden rounded-xl glass-card">
        <img
          src={mapImage}
          alt="Journey Map of Ramayana"
          className="w-full object-cover opacity-60"
        />

        {/* Glowing golden path */}
        <svg
          className="absolute inset-0 h-full w-full glow-path animate-path-glow"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={pathD}
            stroke="hsl(43, 56%, 52%)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 1.5"
          />
        </svg>

        {/* Markers */}
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelected(loc.id)}
            className="absolute flex flex-col items-center"
            style={{ top: loc.top, left: loc.left, transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                selected === loc.id
                  ? "bg-primary shadow-gold"
                  : "bg-primary/70"
              }`}
            >
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </motion.div>
            <span className="mt-1 text-[10px] font-semibold text-foreground whitespace-nowrap">
              {loc.name}
            </span>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedLoc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mx-6 mt-4 rounded-xl glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-display font-bold text-gradient-gold">
                  {selectedLoc.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                  {selectedLoc.description}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyMap;
