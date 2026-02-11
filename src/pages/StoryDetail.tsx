import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";

const storyData: Record<string, {
  title: string;
  event: string;
  sanskrit: string;
  explanation: string;
  cinematic: string;
  lesson: string;
}> = {
  bala: {
    title: "Bala Kanda",
    event: "The Birth of Rama",
    sanskrit: "दशरथस्य पुत्रः रामः अयोध्यायां जातः।",
    explanation:
      "King Dasharatha of Ayodhya performed the sacred Putrakameshti Yajna, and from the divine fire emerged a celestial offering. His three queens — Kausalya, Sumitra, and Kaikeyi — were blessed with four sons: Rama, Lakshmana, Bharata, and Shatrughna.",
    cinematic:
      "The sacred fire rises high into the night sky of Ayodhya. A golden vessel emerges from the flames, radiating divine light. As Queen Kausalya holds the newborn Rama, celestial flowers rain down from the heavens, and the entire kingdom erupts in joyous celebration.",
    lesson:
      "Great things often begin with sincere devotion and patience. Dasharatha's years of righteous rule and deep prayer were rewarded with divine grace.",
  },
  ayodhya: {
    title: "Ayodhya Kanda",
    event: "The Exile of Rama",
    sanskrit: "रामः चतुर्दशवर्षाणि वनवासं गतवान्।",
    explanation:
      "On the eve of Rama's coronation, Queen Kaikeyi, influenced by her maid Manthara, demanded two boons from King Dasharatha — the exile of Rama for fourteen years and the coronation of her son Bharata instead.",
    cinematic:
      "The grand coronation hall falls silent. Rama, adorned in royal garments, calmly removes his crown and dons the bark of an ascetic. Sita and Lakshmana follow without hesitation. The gates of Ayodhya close behind them as the city weeps.",
    lesson:
      "True strength lies in accepting life's challenges with grace. Rama's unwavering adherence to dharma, even at great personal cost, shows the power of duty over desire.",
  },
  aranya: {
    title: "Aranya Kanda",
    event: "Sita's Abduction",
    sanskrit: "रावणः सीतां हृतवान् वञ्चनया।",
    explanation:
      "While living in the Dandaka forest, the demoness Surpanakha's humiliation set off a chain of events. Ravana, the mighty king of Lanka, disguised himself as a sage and abducted Sita while Rama and Lakshmana were distracted by the golden deer Maricha.",
    cinematic:
      "A golden deer darts through the emerald forest. Rama chases it with his bow. In the hermitage, a mendicant approaches Sita. The Lakshman Rekha glows faintly on the ground. As Sita steps beyond it, Ravana reveals his true form — ten heads rising against the darkening sky.",
    lesson:
      "Deception can take the most beautiful forms. Vigilance and discernment are essential, for appearances can conceal the gravest dangers.",
  },
  kishkindha: {
    title: "Kishkindha Kanda",
    event: "Alliance with Sugriva",
    sanskrit: "रामः सुग्रीवेण सख्यं कृतवान्।",
    explanation:
      "Rama and Lakshmana reached Kishkindha, where they befriended Hanuman and formed an alliance with the exiled monkey king Sugriva. Rama helped Sugriva defeat his brother Vali, and in return, Sugriva pledged his entire army to search for Sita.",
    cinematic:
      "Atop the misty Rishyamuka mountain, Hanuman leaps down in disguise. Recognition sparks in his eyes. A fire blazes as Rama and Sugriva circle it, binding their friendship. In the distance, the vast monkey army stirs, ready for the greatest search in history.",
    lesson:
      "True alliances are built on mutual trust and reciprocity. Helping others in their time of need creates bonds that can move mountains.",
  },
  sundara: {
    title: "Sundara Kanda",
    event: "Hanuman's Leap to Lanka",
    sanskrit: "हनुमान् समुद्रं लङ्घित्वा लङ्कां गतवान्।",
    explanation:
      "Hanuman, the mighty devotee of Rama, took a colossal leap across the ocean to Lanka. He found Sita in the Ashoka garden, delivered Rama's ring as proof, and set Lanka ablaze with his burning tail before returning with the joyous news.",
    cinematic:
      "The ocean stretches to infinity. Hanuman grows to mountainous size, his eyes blazing with devotion. With a thunderous cry of 'Jai Shri Ram,' he launches into the sky. Waves part below. In Lanka's moonlit garden, a weeping Sita clutches a small golden ring — and hope returns.",
    lesson:
      "Devotion and courage can overcome any obstacle. Hanuman's unwavering faith in Rama gave him the strength to achieve the impossible.",
  },
  yuddha: {
    title: "Yuddha Kanda",
    event: "The Battle of Lanka",
    sanskrit: "रामः रावणं युद्धे निहतवान्।",
    explanation:
      "The great war between Rama's army and Ravana's forces raged across Lanka. After fierce battles, divine weapons, and immense sacrifices on both sides, Rama defeated Ravana with the Brahmastra. Sita was rescued, and dharma was restored.",
    cinematic:
      "The bridge of stones stretches across the churning sea. Armies clash on golden shores. Ravana's ten heads sneer in defiance. Arrow meets arrow in cascading light. Finally, a single divine arrow — glowing with the fire of righteousness — strikes Ravana's heart. The demon king falls. The sky clears. Rama and Sita reunite as flowers rain from the heavens.",
    lesson:
      "No matter how powerful evil becomes, righteousness will ultimately prevail. The battle for dharma requires patience, sacrifice, and unwavering resolve.",
  },
};

const StoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const story = storyData[id || "bala"];

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Story not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-14">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/story-mode")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">
          {story.title}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        {/* Event Title */}
        <div className="rounded-xl border border-gold/20 bg-card p-5 shadow-card">
          <h2 className="text-xl font-display font-bold text-gradient-gold">
            {story.event}
          </h2>
        </div>

        {/* Sanskrit */}
        <div className="rounded-xl border border-gold/10 bg-card p-5 shadow-card">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
            Sanskrit
          </h3>
          <p className="font-display text-base italic text-foreground/80">
            {story.sanskrit}
          </p>
        </div>

        {/* Explanation */}
        <div className="rounded-xl border border-gold/10 bg-card p-5 shadow-card">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
            Modern Explanation
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            {story.explanation}
          </p>
        </div>

        {/* Cinematic */}
        <div className="rounded-xl border border-gold/10 bg-card p-5 shadow-card">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
            Cinematic Version
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 italic">
            {story.cinematic}
          </p>
        </div>

        {/* Life Lesson */}
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 shadow-gold">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Life Lesson
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {story.lesson}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryDetail;
