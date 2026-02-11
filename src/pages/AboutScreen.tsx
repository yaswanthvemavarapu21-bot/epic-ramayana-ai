import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const AboutScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-14">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/settings")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          About
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-gradient-gold">
            Ramayana AI
          </h2>
          <p className="mt-1 text-sm font-display italic text-primary/70">
            The Living Epic
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Version 1.0.0</p>
        </div>

        <div className="rounded-xl border border-gold/15 bg-card p-5 shadow-card">
          <p className="text-sm leading-relaxed text-foreground/90">
            Ramayana AI brings the timeless wisdom of Valmiki Ramayana to life
            through modern technology. Explore the epic through immersive
            storytelling, converse with legendary characters, discover life
            lessons, and trace the sacred journey across ancient India.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Disclaimer
          </h3>
          <p className="text-xs leading-relaxed text-foreground/80">
            This app presents AI-assisted interpretations of the Valmiki
            Ramayana for educational and inspirational purposes. The content is
            not a substitute for scholarly study or religious guidance.
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Created with devotion by
          </p>
          <p className="mt-1 text-sm font-display font-semibold text-gradient-gold">
            Yaswanth Vemavarapu
          </p>
        </div>

        <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>
    </div>
  );
};

export default AboutScreen;
