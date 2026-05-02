import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Tous", "En L", "En U", "Moderne", "Traditionnel"];

const projects = [
  { id: 1, category: "En L", image: "/images/gallery-1.png", title: "Salon L Velours Terracotta" },
  { id: 2, category: "En U", image: "/images/gallery-2.png", title: "Salon U Épuré Sable" },
  { id: 3, category: "Traditionnel", image: "/images/gallery-3.png", title: "Majesté Traditionnelle" },
  { id: 4, category: "Moderne", image: "/images/gallery-4.png", title: "Ligne Droite Moderne" },
  { id: 5, category: "Traditionnel", image: "/images/gallery-5.png", title: "Détails Boiserie" },
  { id: 6, category: "En U", image: "/images/gallery-6.png", title: "Salon U Riad" },
  { id: 7, category: "Moderne", image: "/images/gallery-7.png", title: "Salon L Moderne Clair" },
  { id: 8, category: "Traditionnel", image: "/images/gallery-8.png", title: "Artisanat Authentique" },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(p => p.category === activeCategory || (activeCategory === "Moderne" && (p.id === 4 || p.id === 7)) || (activeCategory === "Traditionnel" && (p.id === 3 || p.id === 5 || p.id === 8)));

  return (
    <section id="gallery" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-medium tracking-widest uppercase mb-2 block text-sm">
            Inspirations
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Nos Réalisations
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Découvrez nos créations uniques, pensées pour sublimer chaque intérieur.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-transparent text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-square overflow-hidden bg-muted cursor-pointer"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-secondary text-xs uppercase tracking-widest mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-white font-serif text-xl">
                      {project.title}
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
