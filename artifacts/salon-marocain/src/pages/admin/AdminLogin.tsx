import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, AlertCircle } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl font-serif font-bold text-white tracking-wide">Riad</span>
          <span className="text-xs uppercase tracking-[0.3em] text-amber-600 block mt-0.5">Salons — Admin</span>
        </div>

        <form onSubmit={handleLogin} className="bg-stone-900 rounded-sm border border-stone-800 p-8 space-y-5 shadow-2xl">
          <h1 className="text-lg font-semibold text-white mb-2">Connexion</h1>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/60 border border-red-800/60 text-red-300 text-sm px-4 py-3 rounded-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-stone-400">E-mail</Label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-sm"
              placeholder="admin@riad-salons.ma"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-stone-400">Mot de passe</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-sm"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-sm bg-amber-700 hover:bg-amber-600 text-white font-semibold gap-2"
          >
            <LogIn size={16} />
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="text-center text-xs text-stone-600 mt-6">
          Espace réservé à l'administrateur du site
        </p>
      </div>
    </div>
  );
}
