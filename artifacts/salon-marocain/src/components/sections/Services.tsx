import { motion } from "framer-motion";
import { PenTool, Scissors, Layers, Truck } from "lucide-react";

const services = [
  {
    num: "01",
    icon: PenTool,
    title: "Conception sur mesure",
    description:
      "Chaque espace est unique. Nous étudions vos plans pour créer un salon parfaitement adapté à vos dimensions et à l'architecture de votre intérieur.",
  },
  {
    num: "02",
    icon: Scissors,
    title: "Choix de tissus & finitions",
    description:
      "Accédez à une collection exclusive de velours, lins et tissus techniques, associés à des boiseries finement sculptées par nos maîtres artisans.",
  },
  {
    num: "03",
    icon: Layers,
    title: "Personnalisation du confort",
    description:
      "Choisissez la densité de votre assise. De la mousse standard à la mousse haute résilience, nous garantissons un confort qui dure dans le temps.",
  },
  {
    num: "04",
    icon: Truck,
    title: "Livraison & installation",
    description:
      "Notre équipe dédiée assure la livraison et l'installation minutieuse de votre salon, garantissant un rendu impeccable dans votre espace.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-5 md:px-8">
        {/* Header — left-aligned editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-16 md:mb-20"
        >
          <span className="text-secondary tracking-[0.28em] uppercase text-[11px] font-medium block mb-4">
            Notre Savoir-Faire
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
            L'Excellence à Chaque Étape
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed">
            De la première esquisse à l'installation finale, chaque étape est pensée pour vous
            offrir un salon d'exception.
          </p>
        </motion.div>

        {/* 2×2 grid with border dividers */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border"
        >
          {services.map((s) => (
            <motion.div
              key={s.num}
              variants={item}
              className="bg-background hover:bg-primary/[0.035] transition-colors duration-400 p-8 md:p-10 group cursor-default"
            >
              <div className="flex items-start gap-5">
                {/* Big step number */}
                <span className="text-5xl md:text-6xl font-serif font-bold text-primary/15 leading-none select-none group-hover:text-primary/30 transition-colors duration-400 shrink-0 mt-1">
                  {s.num}
                </span>
                <div className="flex-1 min-w-0">
                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/18 transition-colors duration-300">
                      <s.icon size={17} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-foreground text-base md:text-lg leading-snug">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
