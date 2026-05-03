import { useState, useEffect, useCallback } from "react";
import { getDesigns, deleteDesign, type DbDesign } from "@/lib/supabase";
import { DesignModal } from "@/components/admin/DesignModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, Shapes } from "lucide-react";

export function DesignsTab() {
  const [designs, setDesigns] = useState<DbDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDesign, setEditDesign] = useState<DbDesign | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setDesigns(await getDesigns());
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditDesign(null); setModalOpen(true); };
  const openEdit = (d: DbDesign) => { setEditDesign(d); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce motif ?")) return;
    setDeletingId(id);
    try {
      await deleteDesign(id);
      await load();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {designs.length} motif{designs.length !== 1 ? "s" : ""} enregistré{designs.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={openAdd} className="gap-2 bg-amber-700 hover:bg-amber-600 text-white rounded-sm">
          <Plus size={16} /> Ajouter un motif
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error} — Avez-vous bien exécuté le script SQL dans Supabase ?
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-stone-200 overflow-hidden animate-pulse">
              <div className="h-44 bg-stone-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Shapes size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Aucun motif enregistré</p>
          <p className="text-sm mt-1">
            Ajoutez vos motifs (arabesque, géométrique, floral…) pour que vos clients puissent les choisir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-44 bg-stone-100">
                {d.image_url ? (
                  <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <Shapes size={32} className="text-stone-300" />
                  </div>
                )}
                {/* Visibility badge */}
                <div className="absolute top-2 right-2">
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    d.available ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-500"
                  }`}>
                    {d.available ? <Eye size={10} /> : <EyeOff size={10} />}
                    {d.available ? "Visible" : "Masqué"}
                  </span>
                </div>
                {/* Price badge */}
                {d.price_surcharge > 0 && (
                  <div className="absolute bottom-2 left-2 bg-amber-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    +{d.price_surcharge.toLocaleString("fr-MA")} MAD
                  </div>
                )}
                {d.price_surcharge === 0 && (
                  <div className="absolute bottom-2 left-2 bg-green-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    Inclus
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <span className="block font-semibold text-sm text-stone-800 truncate mb-0.5">{d.name}</span>
                {d.description && (
                  <span className="block text-xs text-stone-400 line-clamp-2 mb-2">{d.description}</span>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(d)}
                    className="flex-1 h-8 text-xs rounded-sm gap-1"
                  >
                    <Pencil size={12} /> Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingId === d.id}
                    onClick={() => handleDelete(d.id)}
                    className="h-8 w-8 p-0 rounded-sm border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DesignModal
        open={modalOpen}
        design={editDesign}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
