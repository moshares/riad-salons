import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-medium tracking-widest uppercase mb-2 block text-sm">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            Parlons de Votre Projet
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Notre équipe est à votre disposition pour vous conseiller et répondre à toutes vos questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif mb-2">Notre Atelier</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Quartier des Artisans<br />
                  20000 Casablanca, Maroc
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif mb-2">Téléphone</h4>
                <a href="tel:+212600000000" className="text-muted-foreground hover:text-primary transition-colors block mb-1">
                  +212 6 00 00 00 00
                </a>
                <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
                  Disponible sur WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif mb-2">Email</h4>
                <a href="mailto:contact@riadsalons.ma" className="text-muted-foreground hover:text-primary transition-colors">
                  contact@riadsalons.ma
                </a>
              </div>
            </div>

            <div className="aspect-video w-full bg-muted border border-border">
              {/* Map Placeholder */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.56000676722!2d-7.669394017688277!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1709600000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-card p-8 shadow-sm border border-border">
            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Envoyez-nous un message
            </h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Votre nom" className="rounded-none border-border focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" className="rounded-none border-border focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+212 6..." className="rounded-none border-border focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Parlez-nous de votre projet..." className="min-h-[150px] rounded-none border-border focus-visible:ring-primary" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wider h-12">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
