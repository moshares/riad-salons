import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="aspect-[4/5] overflow-hidden bg-muted relative">
              <img 
                src="/images/gallery-5.png" 
                alt="Détail de boiserie artisanale" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square bg-primary/10 -z-10" />
            <div className="absolute top-8 -left-8 w-1/3 aspect-square border border-secondary -z-10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <span className="text-secondary font-medium tracking-widest uppercase text-sm block">
              Notre Histoire
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground font-serif">
              L'Héritage Artisanal au Service du Confort
            </h2>
            <div className="w-12 h-1 bg-primary mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Né de la passion pour le travail bien fait, notre atelier perpétue la tradition du salon marocain tout en la réinventant pour les intérieurs d'aujourd'hui.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Chaque pièce qui quitte nos ateliers est le fruit d'une collaboration étroite entre nos maîtres sculpteurs de bois (Maâlem) et nos tapissiers expérimentés. Nous sélectionnons nos matériaux avec la plus grande rigueur : cèdre noble, mousses haute résilience, et velours d'exception.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10 pt-6 border-t border-border">
              <div>
                <span className="block text-4xl font-serif text-primary mb-2">20+</span>
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Années d'expérience</span>
              </div>
              <div>
                <span className="block text-4xl font-serif text-primary mb-2">1000+</span>
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Salons créés</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
