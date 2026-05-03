import { useState, useEffect, useCallback } from "react";
import { getFabrics, deleteFabric, type DbFabric } from "@/lib/supabase";
import { FabricModal } from "@/components/admin/FabricModal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, PackageX, Eye, EyeOff, ImageOff } from "lucide-react";

export function FabricsTab() {
  const [fabrics, setFabrics] = useState<DbFabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editFabric, setEditFabric] = useState<DbFabric | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setFabrics(await getFabrics());
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditFabric(null); setModalOpen(true); };
  const openEdit = (f: DbFabric) => { setEditFabric(f); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce tissu ?")) return;
    setDeletingId(id);
    try {
      await deleteFabric(id);
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
        <div>
          <p className="text-sm text-stone-500">
            {fabrics.length} tissu{fabrics.length !== 1 ? "s" : ""} enregistré{fabrics.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 bg-amber-700 hover:bg-amber-600 text-white rounded-sm">
          <Plus size={16} /> Ajouter un tissu
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error} — Avez-vous bien exécuté le script SQL dans Supabase ?
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-stone-200 overflow-hidden animate-pulse">
              <div className="h-40 bg-stone-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : fabrics.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <ImageOff size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Aucun tissu enregistré</p>
          <p className="text-sm mt-1">Cliquez sur « Ajouter un tissu » pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fabrics.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-40 bg-stone-100">
                {f.image_url ? (
                  <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: f.color_hex }}
                  >
                    <span className="text-white/70 text-xs uppercase tracking-wider">{f.color}</span>
                  </div>
                )}
                {/* Status badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    f.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {f.in_stock ? <Package size={10} /> : <PackageX size={10} />}
                    {f.in_stock ? "En stock" : "Épuisé"}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    f.available ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-500"
                  }`}>
                    {f.available ? <Eye size={10} /> : <EyeOff size={10} />}
                    {f.available ? "Visible" : "Masqué"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-200 shrink-0"
                    style={{ background: f.color_hex }}
                  />
                  <span className="font-semibold text-sm text-stone-800 truncate">{f.name}</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  <strong className="text-amber-700">{f.price.toLocaleString("fr-MA")} MAD</strong>
                  {" / "}{f.unit}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(f)}
                    className="flex-1 h-8 text-xs rounded-sm gap-1"
                  >
                    <Pencil size={12} /> Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingId === f.id}
                    onClick={() => handleDelete(f.id)}
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

      <FabricModal
        open={modalOpen}
        fabric={editFabric}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
