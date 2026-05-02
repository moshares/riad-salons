import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Accueil" },
  { href: "#services", label: "Savoir-Faire" },
  { href: "#gallery", label: "Inspirations" },
  { href: "#about", label: "Atelier" },
  { href: "#testimonials", label: "Avis" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <span className="font-serif text-2xl font-bold text-foreground leading-none">
            Riad
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-primary leading-none mt-1">
            Salons
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium mr-2">
            <Phone size={16} className="text-primary" />
            <span>+212 6 00 00 00 00</span>
          </div>
          <Button 
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wide text-xs px-6"
            onClick={() => scrollTo("#devis")}
          >
            Devis
          </Button>
          
          <button 
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50 uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wide"
                  onClick={() => scrollTo("#devis")}
                >
                  Obtenir un devis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
