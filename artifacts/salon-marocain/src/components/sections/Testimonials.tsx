import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amina B.",
    city: "Casablanca",
    initials: "AB",
    rating: 5,
    featured: true,
    text: "Un travail exceptionnel. Le bois de cèdre est magnifique et la finition du velours est parfaite. Toute la famille est impressionnée par le confort de notre nouveau salon en U.",
  },
  {
    name: "Youssef T.",
    city: "Rabat",
    initials: "YT",
    rating: 5,
    featured: false,
    text: "Le simulateur m'a aidé à avoir une idée claire du budget. L'équipe a été très professionnelle de la conception à la livraison. Le résultat dépasse nos attentes.",
  },
  {
    name: "Sara M.",
    city: "Marrakech",
    initials: "SM",
    rating: 5,
    featured: false,
    text: "Mélange parfait entre tradition et modernité. Mon salon s'intègre parfaitement dans mon appartement contemporain. La qualité de la mousse haute densité fait vraiment la différence.",
  },
  {
    name: "Karim E.",
    city: "Fès",
    initials: "KE",
    rating: 5,
    featured: false,
    text: "Les détails de la boiserie sont dignes des plus grands maîtres artisans. Service premium, écoute attentive et respect strict des délais annoncés.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < n ? "text-secondary fill-secondary" : "text-border fill-border"}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="text-secondary tracking-[0.28em] uppercase text-[11px] font-medium block mb-3">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Ils Nous Font Confiance
          </h2>
        </motion.div>

        {/* Featured card + 3 regular cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Featured — terracotta */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:row-span-1 bg-primary p-8 md:p-10 flex flex-col relative overflow-hidden"
          >
            {/* Decorative large quote */}
            <span className="absolute -top-3 -left-1 text-[130px] font-serif text-white/10 leading-none select-none pointer-events-none">
              "
            </span>
            <Stars n={featured.rating} />
            <p className="mt-6 text-base md:text-lg text-primary-foreground/90 font-light leading-relaxed flex-1 relative z-10">
              "{featured.text}"
            </p>
            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/20">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {featured.initials}
              </div>
              <div>
                <span className="block font-serif font-bold text-primary-foreground text-sm">
                  {featured.name}
                </span>
                <span className="text-primary-foreground/65 text-[10px] uppercase tracking-widest">
                  {featured.city}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Regular cards — 1 col on mobile, 3 cols spans the remaining 2 cols on lg */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {rest.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.1 + 0.15 }}
                className="bg-card border border-border p-6 md:p-7 flex flex-col"
              >
                <Stars n={t.rating} />
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed italic flex-1">
                  "{t.text}"
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-foreground text-sm">
                      {t.name}
                    </span>
                    <span className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      {t.city}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
