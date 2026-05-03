import { useState, useEffect, useRef } from "react";
import { upsertDesign, uploadDesignImage, type DbDesign } from "@/lib/supabase";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, X, ImagePlus } from "lucide-react";

interface Props {
  open: boolean;
  design: DbDesign | null;
  onClose: () => void;
  onSaved: () => void;
}

export function DesignModal({ open, design, onClose, onSaved }: Props) {
  const [name, setName]                 = useState("");
  const [description, setDesc]          = useState("");
  const [priceSurcharge, setPriceSur]   = useState("0");
  const [available, setAvailable]       = useState(true);
  const [sortOrder, setSortOrder]       = useState("0");
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    setImageFile(null);
    if (design) {
      setName(design.name);
      setDesc(design.description ?? "");
      setPriceSur(String(design.price_surcharge));
      setAvailable(design.available);
      setSortOrder(String(design.sort_order));
      setImagePreview(design.image_url ?? null);
    } else {
      setName(""); setDesc(""); setPriceSur("0");
      setAvailable(true); setSortOrder("0"); setImagePreview(null);
    }
  }, [open, design]);

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
    if (!name.trim()) {
      setError("Le nom du motif est obligatoire.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const partial: Partial<DbDesign> & { name: string; price_surcharge: number } = {
        ...(design?.id ? { id: design.id } : {}),
        name: name.trim(),
        description: description.trim() || null,
        price_surcharge: parseFloat(priceSurcharge) || 0,
        available,
        sort_order: parseInt(sortOrder) || 0,
      };
      const saved = await upsertDesign(partial);
      if (imageFile) {
        const imageUrl = await uploadDesignImage(imageFile, saved.id);
        await upsertDesign({ ...saved, image_url: imageUrl });
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {design ? "Modifier le motif" : "Nouveau motif"}
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
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Photo du motif</Label>
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
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nom du motif *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arabesque classique"
              className="rounded-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Motif arabesques entrelacées, brodé à la main…"
              className="rounded-sm resize-none"
              rows={2}
            />
          </div>

          {/* Price surcharge */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Supplément de prix (MAD)
            </Label>
            <p className="text-[11px] text-muted-foreground -mt-0.5">
              Laissez à 0 pour un motif inclus sans supplément.
            </p>
            <div className="relative">
              <Input
                type="number"
                min={0}
                step={50}
                value={priceSurcharge}
                onChange={(e) => setPriceSur(e.target.value)}
                placeholder="0"
                className="pr-14 rounded-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">MAD</span>
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
            <Upload size={15} />
            {saving ? "Enregistrement…" : design ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
