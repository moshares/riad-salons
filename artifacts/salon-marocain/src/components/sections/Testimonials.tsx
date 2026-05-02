import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Amina B.",
    city: "Casablanca",
    rating: 5,
    text: "Un travail exceptionnel. Le bois de cèdre est magnifique et la finition du velours est parfaite. Toute la famille est impressionnée par le confort de notre nouveau salon en U."
  },
  {
    name: "Youssef T.",
    city: "Rabat",
    rating: 5,
    text: "Le simulateur m'a aidé à avoir une idée claire du budget. L'équipe a été très professionnelle de la conception à la livraison. Le résultat dépasse nos attentes."
  },
  {
    name: "Sara M.",
    city: "Marrakech",
    rating: 5,
    text: "Mélange parfait entre tradition et modernité. Mon salon droit s'intègre parfaitement dans mon appartement contemporain. La qualité de la mousse haute densité fait vraiment la différence."
  },
  {
    name: "Karim E.",
    city: "Fès",
    rating: 5,
    text: "Les détails de la boiserie sont dignes des plus grands maîtres artisans. Un service premium, une écoute attentive et un respect strict des délais annoncés."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-medium tracking-widest uppercase mb-2 block text-sm">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            Ils Nous Font Confiance
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            La satisfaction de nos clients est notre plus belle réussite. Découvrez leurs retours sur notre savoir-faire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card border-none shadow-sm h-full rounded-none">
                <CardContent className="p-8">
                  <div className="flex text-secondary mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-6 text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-auto border-t border-border pt-4">
                    <span className="block font-serif font-bold text-foreground">
                      {testimonial.name}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {testimonial.city}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
