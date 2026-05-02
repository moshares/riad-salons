import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Tous", "En L", "En U", "Moderne", "Traditionnel"];

const projects = [
  {
    id: 1,
    category: "En L",
    image: "https://i.digsdigs.com/relaxing-moroccan-living-rooms-41.jpg",
    title: "Salon L Mosaïque",
  },
  {
    id: 2,
    category: "En U",
    image: "https://deavita.fr/wp-content/uploads/2015/01/d%C3%A9coration-salon-marocain-canap%C3%A9-rideaux-Elad-Gonen.jpg",
    title: "Salon U Velours Or",
  },
  {
    id: 3,
    category: "Traditionnel",
    image: "https://i.digsdigs.com/relaxing-moroccan-living-rooms-19.jpg",
    title: "Riad Ornementé Zellige",
  },
  {
    id: 4,
    category: "Moderne",
    image: "https://www.bienvenuechezginette.com/wp-content/uploads/2023/10/decoration-salon-marocain.webp",
    title: "Salon Épuré Ivoire",
  },
  {
    id: 5,
    category: "Traditionnel",
    image: "https://i.digsdigs.com/relaxing-moroccan-living-rooms-48.jpg",
    title: "Banquettes Couleurs Vives",
  },
  {
    id: 6,
    category: "En U",
    image: "https://deavita.fr/wp-content/uploads/2015/01/d%C3%A9coration-salon-marocain-canap%C3%A9-velours-bleu-vert.jpg",
    title: "Salon U Turquoise",
  },
  {
    id: 7,
    category: "Moderne",
    image: "https://www.bienvenuechezginette.com/wp-content/uploads/2023/10/canape-moderne-salon-marocain.webp",
    title: "Salon Moderne Sombre",
  },
  {
    id: 8,
    category: "Traditionnel",
    image: "https://i.digsdigs.com/relaxing-moroccan-living-rooms-33.jpg",
    title: "Banquettes Tissus Brodés",
  },
];

export function Gallery() {
  const [active, setActive] = useState("Tous");
  const filtered = active === "Tous" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-5 md:px-8">
        {/* Header + filter row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary tracking-[0.28em] uppercase text-[11px] font-medium block mb-3">
              Inspirations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Nos Réalisations
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider border transition-all duration-200 ${
                  active === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: idx * 0.045 }}
                className="group relative overflow-hidden bg-muted cursor-pointer aspect-square"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-end p-4 md:p-5">
                  <div>
                    <span className="text-secondary text-[9px] uppercase tracking-[0.22em] mb-1 block">
                      {p.category}
                    </span>
                    <h3 className="text-white font-serif text-sm md:text-base leading-snug">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
