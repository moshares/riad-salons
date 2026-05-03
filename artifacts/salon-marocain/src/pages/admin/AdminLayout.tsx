import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { FabricsTab } from "./FabricsTab";
import { DesignsTab } from "./DesignsTab";
import { ServicesTab } from "./ServicesTab";
import { Button } from "@/components/ui/button";
import { Layers, Shapes, Settings, LogOut, Home } from "lucide-react";

type Tab = "fabrics" | "designs" | "services";

export function AdminLayout({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("fabrics");

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "fabrics",  label: "Tissus",      icon: <Layers size={17} /> },
    { id: "designs",  label: "Motifs",      icon: <Shapes size={17} /> },
    { id: "services", label: "Prestations", icon: <Settings size={17} /> },
  ];

  const titles: Record<Tab, string> = {
    fabrics:  "Gestion des tissus",
    designs:  "Gestion des motifs",
    services: "Gestion des prestations",
  };

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* Sidebar */}
      <aside className="w-56 bg-stone-950 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-stone-800">
          <span className="text-xl font-serif font-bold text-white">Riad Salons</span>
          <span className="block text-[10px] uppercase tracking-widest text-amber-600 mt-0.5">
            Administration
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-amber-700 text-white"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-stone-800 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Home size={16} />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-stone-800 text-lg">{titles[tab]}</h1>
          <span className="text-xs text-stone-400">{session.user.email}</span>
        </div>

        {/* Tab content */}
        <div className="p-8">
          {tab === "fabrics"  && <FabricsTab />}
          {tab === "designs"  && <DesignsTab />}
          {tab === "services" && <ServicesTab />}
        </div>
      </main>
    </div>
  );
}
