import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-bold text-background leading-none">
                Riad
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-secondary leading-none mt-1">
                Salons
              </span>
            </div>
            <p className="text-background/70 font-light text-sm leading-relaxed">
              L'excellence de l'artisanat marocain au service de votre confort. Des créations uniques, sur mesure, pour des intérieurs d'exception.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">Liens Rapides</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-background/70 hover:text-secondary transition-colors text-sm">Accueil</a></li>
              <li><a href="#services" className="text-background/70 hover:text-secondary transition-colors text-sm">Savoir-Faire</a></li>
              <li><a href="#gallery" className="text-background/70 hover:text-secondary transition-colors text-sm">Réalisations</a></li>
              <li><a href="#about" className="text-background/70 hover:text-secondary transition-colors text-sm">Notre Atelier</a></li>
              <li><a href="#devis" className="text-background/70 hover:text-secondary transition-colors text-sm">Devis Gratuit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              <li className="text-background/70 text-sm">Conception 3D</li>
              <li className="text-background/70 text-sm">Choix Tissus & Boiseries</li>
              <li className="text-background/70 text-sm">Fabrication Artisanale</li>
              <li className="text-background/70 text-sm">Livraison & Installation</li>
              <li className="text-background/70 text-sm">Service Après-Vente</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <MapPin size={16} className="text-secondary" />
                <span>Casablanca, Maroc</span>
              </li>
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <Phone size={16} className="text-secondary" />
                <a href="tel:+212600000000" className="hover:text-secondary transition-colors">+212 6 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-3 text-background/70 text-sm">
                <Mail size={16} className="text-secondary" />
                <a href="mailto:contact@riadsalons.ma" className="hover:text-secondary transition-colors">contact@riadsalons.ma</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-xs">
            &copy; {new Date().getFullYear()} Riad Salons. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-xs text-background/50">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
