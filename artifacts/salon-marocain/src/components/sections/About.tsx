import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const IMG_MAIN =
  "https://deavita.fr/wp-content/uploads/2015/01/d%C3%A9coration-salon-marocain-luxe-Gordon-Stein-Design.jpg";
const IMG_DETAIL =
  "https://inspivie.com/wp-content/uploads/2025/10/20-Salon-marocain-avec-mur-en-zellige-et-sedari-jaune-a-motifs-pois.jpg";

const stats = [
  { value: "20+", label: "Années d'expérience" },
  { value: "1 000+", label: "Salons créés" },
  { value: "5 ★", label: "Note moyenne clients" },
];

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <span className="block text-3xl md:text-4xl font-serif text-primary font-bold mb-1">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ── Images column ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Primary image */}
            <div className="aspect-[4/5] overflow-hidden relative z-10 shadow-xl">
              <img
                src={IMG_MAIN}
                alt="Intérieur salon marocain artisanal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating inset image */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 w-[42%] aspect-[3/4] overflow-hidden border-4 border-background shadow-2xl z-20">
              <img
                src={IMG_DETAIL}
                alt="Détail boiserie artisanale"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Decorative geometry */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-primary/8 -z-10 hidden sm:block" />
            <div className="absolute top-8 -left-6 w-20 h-20 border border-secondary/35 -z-10 hidden sm:block" />
          </motion.div>

          {/* ── Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 lg:py-4"
          >
            <span className="text-secondary tracking-[0.28em] uppercase text-[11px] font-medium block">
              Notre Histoire
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              L'Héritage Artisanal au Service du Confort
            </h2>

            <div className="w-10 h-[2px] bg-primary" />

            <p className="text-muted-foreground leading-relaxed font-light">
              Né de la passion pour le travail bien fait, notre atelier perpétue la tradition du
              salon marocain tout en la réinventant pour les intérieurs d'aujourd'hui.
            </p>

            <blockquote className="border-l-2 border-primary pl-5 italic text-foreground/75 text-lg font-serif leading-relaxed my-2">
              « Chaque pièce est le fruit d'une collaboration entre nos maîtres sculpteurs de bois{" "}
              <em>(Maâlem)</em> et nos tapissiers — un dialogue entre héritage et innovation. »
            </blockquote>

            <p className="text-muted-foreground leading-relaxed font-light">
              Nous sélectionnons nos matériaux avec la plus grande rigueur : cèdre noble, mousses
              haute résilience et velours d'exception pour sublimer chaque création.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {stats.map((s, i) => (
                <Stat key={s.label} value={s.value} label={s.label} delay={i * 0.12} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
