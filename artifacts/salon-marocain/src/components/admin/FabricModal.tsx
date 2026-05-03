import { useState, useEffect, useRef } from "react";
import { upsertFabric, uploadFabricImage, type DbFabric } from "@/lib/supabase";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, ImagePlus } from "lucide-react";

const UNITS = ["m²", "m", "pièce", "forfait"];

interface Props {
  open: boolean;
  fabric: DbFabric | null;
  onClose: () => void;
  onSaved: () => void;
}

export function FabricModal({ open, fabric, onClose, onSaved }: Props) {
  const [name, setName]           = useState("");
  const [color, setColor]         = useState("");
  const [colorHex, setColorHex]   = useState("#888888");
  const [price, setPrice]         = useState("");
  const [unit, setUnit]           = useState("m²");
  const [inStock, setInStock]     = useState(true);
  const [available, setAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    setImageFile(null);
    if (fabric) {
      setName(fabric.name);
      setColor(fabric.color);
      setColorHex(fabric.color_hex);
      setPrice(String(fabric.price));
      setUnit(fabric.unit);
      setInStock(fabric.in_stock);
      setAvailable(fabric.available);
      setSortOrder(String(fabric.sort_order));
      setImagePreview(fabric.image_url ?? null);
    } else {
      setName(""); setColor(""); setColorHex("#888888");
      setPrice(""); setUnit("m²"); setInStock(true);
      setAvailable(true); setSortOrder("0"); setImagePreview(null);
    }
  }, [open, fabric]);

  const handleFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleSave = async () => {
    if (!name.trim() || !color.trim() || !price) {
      setError("Nom, couleur et prix sont obligatoires.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const partial: Partial<DbFabric> & { name: string; color: string; price: number; unit: string } = {
        ...(fabric?.id ? { id: fabric.id } : {}),
        name: name.trim(),
        color: color.trim(),
        color_hex: colorHex,
        price: parseFloat(price),
        unit,
        in_stock: inStock,
        available,
        sort_order: parseInt(sortOrder) || 0,
      };
      const saved = await upsertFabric(partial);
      if (imageFile) {
        const imageUrl = await uploadFabricImage(imageFile, saved.id);
        await upsertFabric({ ...saved, image_url: imageUrl });
      }
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {fabric ? "Modifier le tissu" : "Nouveau tissu"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          {/* Image upload */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Photo du tissu</Label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-stone-200 rounded-sm overflow-hidden cursor-pointer hover:border-amber-400 transition-colors"
              style={{ height: 160 }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400">
                  <ImagePlus size={28} />
                  <span className="text-xs">Glissez une image ou cliquez pour choisir</span>
                  <span className="text-[10px]">PNG, JPG, WEBP</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nom du tissu *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Velours Bordeaux" className="rounded-sm" />
          </div>

          {/* Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Couleur (nom) *</Label>
              <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Bordeaux" className="rounded-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Couleur (hex)</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-10 w-10 rounded-sm border border-input cursor-pointer p-0.5"
                />
                <Input
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  placeholder="#7a2d3a"
                  className="rounded-sm font-mono text-sm"
                />
              </div>
            </div>
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
                  placeholder="85"
                  className="pr-14 rounded-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">MAD</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Unité</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort order */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Ordre d'affichage</Label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-sm w-24"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className={`flex items-center justify-between p-4 border-2 rounded-sm transition-colors ${inStock ? "border-green-300 bg-green-50" : "border-stone-200"}`}>
              <div>
                <span className="block text-sm font-medium">En stock</span>
                <span className="text-xs text-muted-foreground">{inStock ? "Disponible" : "Épuisé"}</span>
              </div>
              <Switch checked={inStock} onCheckedChange={setInStock} />
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
            <Upload size={15} />
            {saving ? "Enregistrement…" : fabric ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
