import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToQuote = () => {
    document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero.png" 
          alt="Salon Marocain de luxe" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="text-secondary font-medium tracking-widest uppercase mb-4 block text-sm md:text-base drop-shadow-md">
            L'Art du Salon Marocain
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Votre salon, une œuvre d'art sur mesure.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
            Alliez l'authenticité de l'artisanat marocain au confort moderne. 
            Créez un espace unique qui reflète votre héritage et votre style de vie.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={scrollToQuote}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-none uppercase tracking-wide transition-all duration-300"
            >
              Obtenir un devis gratuit
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-white/70 text-xs uppercase tracking-widest mb-2">Découvrir</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-white/50"
        />
      </motion.div>
    </section>
  );
}
