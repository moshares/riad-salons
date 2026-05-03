import { useState, useEffect } from "react";
import { upsertService, type DbService } from "@/lib/supabase";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const UNIT_PRESETS = ["forfait", "m²", "m", "pièce", "paire", "heure"];

interface Props {
  open: boolean;
  service: DbService | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ServiceModal({ open, service, onClose, onSaved }: Props) {
  const [name, setName]           = useState("");
  const [description, setDesc]    = useState("");
  const [price, setPrice]         = useState("");
  const [unit, setUnit]           = useState("forfait");
  const [available, setAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (service) {
      setName(service.name);
      setDesc(service.description ?? "");
      setPrice(String(service.price));
      setUnit(service.unit);
      setAvailable(service.available);
      setSortOrder(String(service.sort_order));
    } else {
      setName(""); setDesc(""); setPrice(""); setUnit("forfait");
      setAvailable(true); setSortOrder("0");
    }
  }, [open, service]);

  const handleSave = async () => {
    if (!name.trim() || !price) {
      setError("Nom et prix sont obligatoires.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await upsertService({
        ...(service?.id ? { id: service.id } : {}),
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        unit,
        available,
        sort_order: parseInt(sortOrder) || 0,
      } as Parameters<typeof upsertService>[0]);
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {service ? "Modifier la prestation" : "Nouvelle prestation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nom de la prestation *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Livraison & Installation" className="rounded-sm" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Livraison à domicile et montage par nos équipes"
              className="rounded-sm resize-none"
              rows={2}
            />
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Prix (MAD) *</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="500"
                  className="pr-14 rounded-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">MAD</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Unité</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="forfait"
                className="rounded-sm"
                list="unit-presets"
              />
              <datalist id="unit-presets">
                {UNIT_PRESETS.map((u) => <option key={u} value={u} />)}
              </datalist>
            </div>
          </div>

          {/* Sort + Available */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Ordre</Label>
              <Input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-sm"
              />
            </div>
            <div className={`flex items-center justify-between p-4 border-2 rounded-sm transition-colors ${available ? "border-blue-300 bg-blue-50" : "border-stone-200"}`}>
              <div>
                <span className="block text-sm font-medium">Visible</span>
                <span className="text-xs text-muted-foreground">{available ? "Affiché" : "Masqué"}</span>
              </div>
              <Switch checked={available} onCheckedChange={setAvailable} />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving} className="rounded-sm">
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-amber-700 hover:bg-amber-600 text-white rounded-sm"
          >
            <Save size={15} />
            {saving ? "Enregistrement…" : service ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
