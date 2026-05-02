import { motion } from "framer-motion";
import { PenTool, Scissors, Layers, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Conception sur mesure",
    description: "Chaque espace est unique. Nous étudions vos plans pour créer un salon parfaitement adapté à vos dimensions et à l'architecture de votre intérieur.",
    icon: PenTool
  },
  {
    title: "Choix de tissus & finitions",
    description: "Accédez à une collection exclusive de velours, lins et tissus techniques, associés à des boiseries finement sculptées par nos maîtres artisans.",
    icon: Scissors
  },
  {
    title: "Personnalisation du confort",
    description: "Choisissez la densité de votre assise. De la mousse standard à la mousse haute résilience, nous garantissons un confort qui dure dans le temps.",
    icon: Layers
  },
  {
    title: "Livraison & installation",
    description: "Notre équipe dédiée assure la livraison et l'installation minutieuse de votre salon, garantissant un rendu impeccable dans votre espace.",
    icon: Truck
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-medium tracking-widest uppercase mb-2 block text-sm">
            Notre Savoir-Faire
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            L'Excellence à Chaque Étape
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            De la première esquisse à l'installation finale, nous vous accompagnons pour 
            donner vie au salon de vos rêves avec une attention absolue aux détails.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full rounded-none">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
