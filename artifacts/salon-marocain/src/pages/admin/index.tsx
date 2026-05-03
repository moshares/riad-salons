import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="w-8 h-8 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return <AdminLogin />;
  return <AdminLayout session={session} />;
}
