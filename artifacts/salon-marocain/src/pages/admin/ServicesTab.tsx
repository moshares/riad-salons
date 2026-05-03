import { useState, useEffect, useCallback } from "react";
import { getServices, deleteService, type DbService } from "@/lib/supabase";
import { ServiceModal } from "@/components/admin/ServiceModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { upsertService } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";

export function ServicesTab() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editService, setEditService] = useState<DbService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await getServices());
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditService(null); setModalOpen(true); };
  const openEdit = (s: DbService) => { setEditService(s); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette prestation ?")) return;
    setDeletingId(id);
    try {
      await deleteService(id);
      await load();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailable = async (s: DbService) => {
    setTogglingId(s.id);
    try {
      await upsertService({ ...s, available: !s.available });
      await load();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {services.length} prestation{services.length !== 1 ? "s" : ""} enregistrée{services.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openAdd} className="gap-2 bg-amber-700 hover:bg-amber-600 text-white rounded-sm">
          <Plus size={16} /> Ajouter une prestation
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error} — Avez-vous bien exécuté le script SQL dans Supabase ?
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-sm p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-1/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
                <div className="h-4 bg-stone-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Settings size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Aucune prestation enregistrée</p>
          <p className="text-sm mt-1">Ajoutez vos prestations (livraison, pose, etc.).</p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">Prestation</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">Prix</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">Unité</th>
                <th className="px-5 py-3 text-center text-xs uppercase tracking-wider text-stone-500 font-medium">Visible</th>
                <th className="px-5 py-3 text-right text-xs uppercase tracking-wider text-stone-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {services.map((s) => (
                <tr key={s.id} className={`hover:bg-stone-50 transition-colors ${!s.available ? "opacity-50" : ""}`}>
                  <td className="px-5 py-4">
                    <span className="font-medium text-stone-800">{s.name}</span>
                    {s.description && (
                      <span className="block text-xs text-stone-400 mt-0.5">{s.description}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-amber-700">
                    {s.price.toLocaleString("fr-MA")} MAD
                  </td>
                  <td className="px-5 py-4 text-stone-500">/{s.unit}</td>
                  <td className="px-5 py-4 text-center">
                    <Switch
                      checked={s.available}
                      disabled={togglingId === s.id}
                      onCheckedChange={() => toggleAvailable(s)}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(s)}
                        className="h-8 px-3 text-xs rounded-sm gap-1"
                      >
                        <Pencil size={12} /> Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id)}
                        className="h-8 w-8 p-0 rounded-sm border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ServiceModal
        open={modalOpen}
        service={editService}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
