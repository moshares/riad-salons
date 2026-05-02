import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Rich traditional Moroccan salon with banquettes and arched doorway
const HERO_IMG =
  "https://cdn.shopify.com/s/files/1/0068/0283/3463/files/decoration_de_salon_marocain.jpg?v=1720701353";

const HEADLINE = ["Votre", "salon,", "une", "œuvre", "d'art", "sur", "mesure."];

const patternSvg = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 2 L58 30 L30 58 L2 30 Z" fill="none" stroke="white" stroke-width="0.5"/><path d="M30 14 L46 30 L30 46 L14 30 Z" fill="none" stroke="white" stroke-width="0.3"/></svg>`;
const PATTERN = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};
const wordVariant = {
  hidden: { opacity: 0, y: 52 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={ref}
      id="home"
      className="relative h-[100dvh] min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 z-0">
        <img
          src={HERO_IMG}
          alt="Salon marocain de luxe"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/38 to-black/65" />
      </motion.div>

      {/* Moroccan geometric pattern overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.055]"
        style={{ backgroundImage: PATTERN, backgroundSize: "60px 60px" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 sm:px-8 flex flex-col items-center text-center max-w-5xl">

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 text-secondary tracking-[0.3em] uppercase text-[11px] sm:text-xs font-medium mb-7"
        >
          <span className="w-10 h-px bg-secondary/70 hidden sm:block" />
          L'Art du Salon Marocain
          <span className="w-10 h-px bg-secondary/70 hidden sm:block" />
        </motion.span>

        {/* Headline — word-by-word stagger, flex-wrap for correct spacing */}
        <motion.h1
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-[clamp(2.6rem,8vw,6.5rem)] font-bold text-white leading-[1.07] mb-7 flex flex-wrap justify-center gap-x-[0.22em]"
        >
          {HEADLINE.map((word, i) => (
            <span key={i} className="overflow-hidden block" style={{ display: "inline-block" }}>
              <motion.span variants={wordVariant} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7 }}
          className="text-gray-300 text-base sm:text-lg font-light max-w-xl leading-relaxed mb-10"
        >
          Alliez l'authenticité de l'artisanat marocain au confort moderne. Créez un espace unique
          qui reflète votre héritage et votre style de vie.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("devis")}
            className="bg-primary hover:bg-primary/90 text-white px-8 h-14 rounded-none uppercase tracking-[0.15em] text-xs sm:text-sm shadow-lg"
          >
            Obtenir un devis gratuit
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("gallery")}
            className="border-white/50 text-white hover:bg-white/10 hover:border-white px-8 h-14 rounded-none uppercase tracking-[0.15em] text-xs sm:text-sm backdrop-blur-sm"
          >
            Voir nos réalisations
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        onClick={() => scrollTo("services")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/55 hover:text-white/90 transition-colors cursor-pointer"
      >
        <span className="text-[9px] tracking-[0.38em] uppercase">Découvrir</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
