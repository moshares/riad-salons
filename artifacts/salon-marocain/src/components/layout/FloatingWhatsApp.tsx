import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/212600000000"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center cursor-pointer group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-background text-foreground text-sm px-3 py-1.5 rounded shadow-sm border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
        Discuter avec nous
      </span>
    </motion.a>
  );
}
