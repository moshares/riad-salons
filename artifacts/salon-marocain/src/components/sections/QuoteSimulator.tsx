import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuoteState,
  ShapeType,
  FoamType,
  FabricType,
  calculateBreakdown,
  generateWhatsAppMessage,
  fmt,
  SHAPE_BASE_PRICES,
} from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle2,
} from "lucide-react";

const TOTAL_STEPS = 6;

const DEFAULT_STATE: QuoteState = {
  shape: "L",
  dimensions: { length1: 300, length2: 200, depth: 70 },
  options: { foam: "Premium", cushionsCount: 6, armrests: true, premiumWood: false },
  fabric: { type: "Standard", color: "" },
  extras: { storageBox: false, table: false, delivery: true },
};

// ─── Shape SVGs ───────────────────────────────────────────────────────────────

function ShapeIcon({ shape, selected }: { shape: ShapeType; selected: boolean }) {
  const c = selected ? "var(--color-primary, #b45309)" : "#9ca3af";
  const stroke = 2.5;
  switch (shape) {
    case "Droit":
      return (
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <rect x="8" y="22" width="44" height="16" rx="2" fill="none" stroke={c} strokeWidth={stroke} />
        </svg>
      );
    case "L":
      return (
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <polyline points="10,10 10,50 50,50" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="10,10 22,10 22,38 50,38 50,50" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "U":
      return (
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <polyline points="8,10 8,50 52,50 52,10" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="8,10 20,10 20,38 40,38 40,10 52,10" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Sur mesure":
      return (
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <path d="M10 40 L10 20 L25 10 L50 10 L50 40 L35 50 L10 40Z" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

// ─── Color Swatches ───────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { label: "Beige", hex: "#e8dcc8" },
  { label: "Blanc Cassé", hex: "#f5f0e8" },
  { label: "Gris Perle", hex: "#c8c5bf" },
  { label: "Terracotta", hex: "#c17a5a" },
  { label: "Vert Sauge", hex: "#8a9e85" },
  { label: "Bordeaux", hex: "#7a2d3a" },
  { label: "Bleu Nuit", hex: "#2d3a5a" },
  { label: "Camel", hex: "#c4955a" },
  { label: "Anthracite", hex: "#4a4a4a" },
];

// ─── Live Price Strip ─────────────────────────────────────────────────────────

function LivePriceStrip({ state, step }: { state: QuoteState; step: number }) {
  const { min, max } = useMemo(() => calculateBreakdown(state), [state]);
  if (step < 2) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-amber-50 border border-amber-200 px-4 py-2.5 mb-6 rounded-sm"
    >
      <span className="text-xs uppercase tracking-widest text-amber-700 font-medium">Estimation en cours</span>
      <span className="text-base font-bold text-amber-900">
        {min.toLocaleString()} – {max.toLocaleString()} MAD
      </span>
    </motion.div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEP_LABELS = ["Forme", "Dimensions", "Confort", "Tissu", "Options", "Devis"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: i < step ? "var(--color-primary, #b45309)" : "#e5e7eb" }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        {STEP_LABELS.map((l, i) => (
          <span
            key={i}
            className="transition-colors duration-300"
            style={{ color: i === step - 1 ? "var(--color-primary, #b45309)" : undefined, fontWeight: i === step - 1 ? 600 : 400 }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable option card ─────────────────────────────────────────────────────

function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left p-4 border-2 transition-all duration-200 rounded-sm cursor-pointer ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 bg-background"
      }`}
    >
      {selected && (
        <CheckCircle2
          size={16}
          className="absolute top-3 right-3 text-primary"
        />
      )}
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <span className={`block font-semibold text-sm ${selected ? "text-primary" : "text-foreground"}`}>
        {title}
      </span>
      {subtitle && (
        <span className="block text-xs text-muted-foreground mt-0.5">{subtitle}</span>
      )}
    </button>
  );
}

// ─── Extra toggle row ─────────────────────────────────────────────────────────

function ExtraRow({
  label,
  sublabel,
  price,
  checked,
  onChange,
}: {
  label: string;
  sublabel?: string;
  price: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-sm transition-colors ${
        checked ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {sublabel && <span className="block text-xs text-muted-foreground">{sublabel}</span>}
        <span className="block text-xs font-semibold text-primary mt-0.5">{price}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="ml-4 shrink-0" />
    </div>
  );
}

// ─── Step content components ──────────────────────────────────────────────────

function StepShape({ state, setState }: { state: QuoteState; setState: (s: QuoteState) => void }) {
  const shapes: ShapeType[] = ["Droit", "L", "U", "Sur mesure"];
  const subtitles: Record<ShapeType, string> = {
    Droit: `À partir de ${SHAPE_BASE_PRICES.Droit.toLocaleString()} MAD`,
    L: `À partir de ${SHAPE_BASE_PRICES.L.toLocaleString()} MAD`,
    U: `À partir de ${SHAPE_BASE_PRICES.U.toLocaleString()} MAD`,
    "Sur mesure": `À partir de ${SHAPE_BASE_PRICES["Sur mesure"].toLocaleString()} MAD`,
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Forme du salon</h3>
        <p className="text-sm text-muted-foreground">Choisissez la configuration qui correspond à votre espace.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shapes.map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => setState({ ...state, shape })}
            className={`flex flex-col items-center justify-center gap-2 p-5 border-2 rounded-sm transition-all duration-200 cursor-pointer ${
              state.shape === shape
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <ShapeIcon shape={shape} selected={state.shape === shape} />
            <span className={`font-semibold text-sm ${state.shape === shape ? "text-primary" : "text-foreground"}`}>
              {shape}
            </span>
            <span className="text-[11px] text-muted-foreground">{subtitles[shape]}</span>
            {state.shape === shape && (
              <CheckCircle2 size={14} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Inline editable pill for diagram inputs ──────────────────────────────────

function DiagramInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-white border-2 border-primary shadow-md rounded-md px-2 py-1 flex items-center gap-1">
      <input
        type="number"
        min={50}
        max={1000}
        value={value}
        onChange={(e) => onChange(Math.max(50, Number(e.target.value)))}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="w-14 text-center text-sm font-bold outline-none bg-transparent text-primary"
      />
      <span className="text-[11px] text-muted-foreground font-medium">cm</span>
    </div>
  );
}

// ─── SVG floor-plan diagram with overlaid inputs ──────────────────────────────

const SHAPE_FILL = "#f5ede0";
const SHAPE_STROKE = "#b45309";
const DIM_COLOR = "#94a3b8";
const SSW = 1.8;  // shape stroke width
const DSW = 1.0;  // dim line stroke width

function Tick({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={DIM_COLOR} strokeWidth={DSW} />;
}

function DimensionDiagram({
  state,
  setState,
}: {
  state: QuoteState;
  setState: (s: QuoteState) => void;
}) {
  const { shape, dimensions } = state;
  const upd = (patch: Partial<typeof dimensions>) =>
    setState({ ...state, dimensions: { ...state.dimensions, ...patch } });

  const W = 400, H = 300;

  // ── Sur mesure: plain inputs, no diagram ────────────────────────────────────
  if (shape === "Sur mesure") {
    return (
      <div className="space-y-4 bg-muted/30 rounded-sm p-5 border border-dashed border-border">
        <p className="text-sm text-muted-foreground text-center">
          Indiquez vos dimensions approximatives — nos artisans s'adaptent entièrement à votre espace.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { label: "Longueur estimée", key: "length1" as const },
              { label: "Profondeur estimée", key: "depth" as const },
            ] as const
          ).map(({ label, key }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={50}
                  max={1000}
                  value={dimensions[key]}
                  onChange={(e) => upd({ [key]: Number(e.target.value) })}
                  className="pr-10 rounded-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">cm</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Helper to place an input pill at SVG-coordinate (svgX, svgY), offset by (dx, dy) px
  const pill = (
    svgX: number,
    svgY: number,
    anchorX: "left" | "center" | "right",
    anchorY: "top" | "center" | "bottom",
    input: React.ReactNode
  ) => {
    const leftPct = `${(svgX / W) * 100}%`;
    const topPct = `${(svgY / H) * 100}%`;
    const tx = anchorX === "left" ? "0" : anchorX === "center" ? "-50%" : "-100%";
    const ty = anchorY === "top" ? "0" : anchorY === "center" ? "-50%" : "-100%";
    return (
      <div
        className="absolute"
        style={{ left: leftPct, top: topPct, transform: `translate(${tx}, ${ty})` }}
      >
        {input}
      </div>
    );
  };

  // ── DROIT ───────────────────────────────────────────────────────────────────
  if (shape === "Droit") {
    const sx = 80, sy = 85, sw = 215, sh = 95;
    const dl1y = sy + sh + 30;   // dim line for length1 (below)
    const ddx  = sx + sw + 30;   // dim line for depth (right)
    return (
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible">
          {/* Shape */}
          <rect x={sx} y={sy} width={sw} height={sh} fill={SHAPE_FILL} stroke={SHAPE_STROKE} strokeWidth={SSW} rx={2} />

          {/* length1 dim line — below */}
          <line x1={sx}      y1={sy + sh} x2={sx}      y2={dl1y + 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={sx + sw} y1={sy + sh} x2={sx + sw} y2={dl1y + 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={sx}      y1={dl1y}    x2={sx + sw}  y2={dl1y}    stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={sx} y1={dl1y - 5} x2={sx} y2={dl1y + 5} />
          <Tick x1={sx + sw} y1={dl1y - 5} x2={sx + sw} y2={dl1y + 5} />

          {/* depth dim line — right */}
          <line x1={sx + sw} y1={sy}      x2={ddx + 6} y2={sy}      stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={sx + sw} y1={sy + sh} x2={ddx + 6} y2={sy + sh} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={ddx}     y1={sy}      x2={ddx}     y2={sy + sh} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={ddx - 5} y1={sy}      x2={ddx + 5} y2={sy} />
          <Tick x1={ddx - 5} y1={sy + sh} x2={ddx + 5} y2={sy + sh} />
        </svg>
        {pill(sx + sw / 2, dl1y + 10, "center", "top", <DiagramInput value={dimensions.length1} onChange={(v) => upd({ length1: v })} />)}
        {pill(ddx + 10,    sy + sh / 2, "left", "center", <DiagramInput value={dimensions.depth} onChange={(v) => upd({ depth: v })} />)}
      </div>
    );
  }

  // ── L ───────────────────────────────────────────────────────────────────────
  if (shape === "L") {
    // Main horizontal arm (top): (mx,my) → (mx+mw, my+mh)
    // Side vertical arm (bottom-left): (mx,my+mh) → (mx+sw2, my+mh+sh2)
    // depth = mh = sw2 (same for both arms)
    const mx = 55, my = 50, mw = 250, mh = 85;
    const sw2 = 85, sh2 = 120;
    const pts = [
      `${mx},${my}`,
      `${mx + mw},${my}`,
      `${mx + mw},${my + mh}`,
      `${mx + sw2},${my + mh}`,
      `${mx + sw2},${my + mh + sh2}`,
      `${mx},${my + mh + sh2}`,
    ].join(" ");

    const dl1y  = my - 26;           // length1 above
    const ddx   = mx + mw + 28;      // depth right of main arm
    const dl2x  = mx + sw2 + 28;     // length2 right of side arm section

    return (
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible">
          <polygon points={pts} fill={SHAPE_FILL} stroke={SHAPE_STROKE} strokeWidth={SSW} />

          {/* length1 — above main arm */}
          <line x1={mx}      y1={my} x2={mx}      y2={dl1y - 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={mx + mw} y1={my} x2={mx + mw} y2={dl1y - 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={mx} y1={dl1y} x2={mx + mw} y2={dl1y} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={mx} y1={dl1y - 5} x2={mx} y2={dl1y + 5} />
          <Tick x1={mx + mw} y1={dl1y - 5} x2={mx + mw} y2={dl1y + 5} />

          {/* depth — right of main arm */}
          <line x1={mx + mw} y1={my}      x2={ddx + 6} y2={my}      stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={mx + mw} y1={my + mh} x2={ddx + 6} y2={my + mh} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={ddx} y1={my} x2={ddx} y2={my + mh} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={ddx - 5} y1={my}      x2={ddx + 5} y2={my} />
          <Tick x1={ddx - 5} y1={my + mh} x2={ddx + 5} y2={my + mh} />

          {/* length2 — right of side arm lower section */}
          <line x1={mx + sw2} y1={my + mh}        x2={dl2x + 6} y2={my + mh}        stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={mx + sw2} y1={my + mh + sh2}  x2={dl2x + 6} y2={my + mh + sh2}  stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={dl2x} y1={my + mh} x2={dl2x} y2={my + mh + sh2} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={dl2x - 5} y1={my + mh}       x2={dl2x + 5} y2={my + mh} />
          <Tick x1={dl2x - 5} y1={my + mh + sh2} x2={dl2x + 5} y2={my + mh + sh2} />
        </svg>

        {pill(mx + mw / 2,         dl1y - 12,            "center", "bottom", <DiagramInput value={dimensions.length1} onChange={(v) => upd({ length1: v })} />)}
        {pill(ddx + 10,            my + mh / 2,          "left",   "center", <DiagramInput value={dimensions.depth}   onChange={(v) => upd({ depth: v })} />)}
        {pill(dl2x + 10,           my + mh + sh2 / 2,    "left",   "center", <DiagramInput value={dimensions.length2} onChange={(v) => upd({ length2: v })} />)}
      </div>
    );
  }

  // ── U ───────────────────────────────────────────────────────────────────────
  if (shape === "U") {
    const armT = 78;  // arm thickness (= depth)
    const lx = 50, ty = 38, armH = 168, botH = 52;
    const rx = lx + 220;  // right arm x start
    const pts = [
      `${lx},${ty}`,
      `${lx + armT},${ty}`,
      `${lx + armT},${ty + armH}`,
      `${rx},${ty + armH}`,
      `${rx},${ty}`,
      `${rx + armT},${ty}`,
      `${rx + armT},${ty + armH + botH}`,
      `${lx},${ty + armH + botH}`,
    ].join(" ");

    const totalW = rx + armT - lx;
    const dl1y = ty - 26;                   // length1 above
    const dl2x = rx + armT + 28;            // length2 right of right arm
    const ddy  = ty + armH + botH + 26;     // depth below, under left arm

    return (
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible">
          <polygon points={pts} fill={SHAPE_FILL} stroke={SHAPE_STROKE} strokeWidth={SSW} />

          {/* length1 (total width) — above */}
          <line x1={lx}          y1={ty} x2={lx}          y2={dl1y - 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={rx + armT}   y1={ty} x2={rx + armT}   y2={dl1y - 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={lx} y1={dl1y} x2={rx + armT} y2={dl1y} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={lx}        y1={dl1y - 5} x2={lx}        y2={dl1y + 5} />
          <Tick x1={rx + armT} y1={dl1y - 5} x2={rx + armT} y2={dl1y + 5} />

          {/* length2 (arm height) — right of right arm */}
          <line x1={rx + armT} y1={ty}        x2={dl2x + 6} y2={ty}        stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={rx + armT} y1={ty + armH} x2={dl2x + 6} y2={ty + armH} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={dl2x} y1={ty} x2={dl2x} y2={ty + armH} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={dl2x - 5} y1={ty}        x2={dl2x + 5} y2={ty} />
          <Tick x1={dl2x - 5} y1={ty + armH} x2={dl2x + 5} y2={ty + armH} />

          {/* depth (arm thickness) — below, under left arm */}
          <line x1={lx}        y1={ty + armH + botH} x2={lx}        y2={ddy + 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={lx + armT} y1={ty + armH + botH} x2={lx + armT} y2={ddy + 6} stroke={DIM_COLOR} strokeWidth={DSW} strokeDasharray="3 2" />
          <line x1={lx} y1={ddy} x2={lx + armT} y2={ddy} stroke={DIM_COLOR} strokeWidth={DSW} />
          <Tick x1={lx}        y1={ddy - 5} x2={lx}        y2={ddy + 5} />
          <Tick x1={lx + armT} y1={ddy - 5} x2={lx + armT} y2={ddy + 5} />
        </svg>

        {pill(lx + totalW / 2,    dl1y - 12,          "center", "bottom", <DiagramInput value={dimensions.length1} onChange={(v) => upd({ length1: v })} />)}
        {pill(dl2x + 10,          ty + armH / 2,      "left",   "center", <DiagramInput value={dimensions.length2} onChange={(v) => upd({ length2: v })} />)}
        {pill(lx + armT / 2,      ddy + 10,           "center", "top",    <DiagramInput value={dimensions.depth}   onChange={(v) => upd({ depth: v })} />)}
      </div>
    );
  }

  return null;
}

function StepDimensions({ state, setState }: { state: QuoteState; setState: (s: QuoteState) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Dimensions</h3>
        <p className="text-sm text-muted-foreground">
          Cliquez sur une valeur pour la modifier directement sur le plan.
        </p>
      </div>
      <DimensionDiagram state={state} setState={setState} />
      <p className="text-[11px] text-muted-foreground text-center pt-1">
        Vue de dessus — toutes les mesures en centimètres
      </p>
    </div>
  );
}

function StepComfort({ state, setState }: { state: QuoteState; setState: (s: QuoteState) => void }) {
  const foams: { value: FoamType; title: string; subtitle: string; badge?: string }[] = [
    { value: "Standard", title: "Standard", subtitle: "Confort quotidien, densité 25 kg/m³" },
    { value: "Premium", title: "Premium", subtitle: "Meilleure durabilité, densité 35 kg/m³", badge: "+15%" },
    { value: "Haute densité", title: "Haute densité", subtitle: "Haut de gamme, densité 45 kg/m³", badge: "+25%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Confort & Structure</h3>
        <p className="text-sm text-muted-foreground">La qualité de la mousse détermine le confort sur le long terme.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Qualité de mousse</Label>
        <div className="space-y-2">
          {foams.map((f) => (
            <OptionCard
              key={f.value}
              selected={state.options.foam === f.value}
              onClick={() => setState({ ...state, options: { ...state.options, foam: f.value } })}
              title={f.title}
              subtitle={f.subtitle}
              badge={f.badge}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nombre de coussins</Label>
          <span className="text-xl font-bold text-primary">{state.options.cushionsCount}</span>
        </div>
        <Slider
          value={[state.options.cushionsCount]}
          min={2}
          max={12}
          step={1}
          onValueChange={(v) => setState({ ...state, options: { ...state.options, cushionsCount: v[0] } })}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>2</span>
          <span className="text-[10px] text-amber-700">+300 MAD / coussin au-delà de 4</span>
          <span>12</span>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Finitions</Label>
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-4 border-2 rounded-sm transition-colors ${state.options.armrests ? "border-primary/40 bg-primary/5" : "border-border"}`}>
            <div>
              <span className="block text-sm font-medium">Accoudoirs</span>
              <span className="text-xs text-primary font-semibold">+800 MAD</span>
            </div>
            <Switch
              checked={state.options.armrests}
              onCheckedChange={(c) => setState({ ...state, options: { ...state.options, armrests: c } })}
            />
          </div>
          <div className={`flex items-center justify-between p-4 border-2 rounded-sm transition-colors ${state.options.premiumWood ? "border-primary/40 bg-primary/5" : "border-border"}`}>
            <div>
              <span className="block text-sm font-medium">Boiserie haute qualité</span>
              <span className="text-xs text-muted-foreground">Bois massif taillé à la main</span>
              <span className="block text-xs text-primary font-semibold">+2 000 MAD</span>
            </div>
            <Switch
              checked={state.options.premiumWood}
              onCheckedChange={(c) => setState({ ...state, options: { ...state.options, premiumWood: c } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFabric({ state, setState }: { state: QuoteState; setState: (s: QuoteState) => void }) {
  const fabrics: { value: FabricType; title: string; subtitle: string; badge?: string }[] = [
    { value: "Standard", title: "Tissu Standard", subtitle: "Résistant et facile d'entretien" },
    { value: "Premium", title: "Tissu Premium", subtitle: "Texture raffinée, longue durabilité", badge: "+20%" },
    { value: "Luxe", title: "Velours Luxe", subtitle: "Velours marocain, toucher soyeux", badge: "+40%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Choix du tissu</h3>
        <p className="text-sm text-muted-foreground">Le tissu façonne l'ambiance de votre salon.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Gamme</Label>
        <div className="space-y-2">
          {fabrics.map((f) => (
            <OptionCard
              key={f.value}
              selected={state.fabric.type === f.value}
              onClick={() => setState({ ...state, fabric: { ...state.fabric, type: f.value } })}
              title={f.title}
              subtitle={f.subtitle}
              badge={f.badge}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Couleur souhaitée</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.label}
              type="button"
              title={c.label}
              onClick={() => setState({ ...state, fabric: { ...state.fabric, color: c.label } })}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                state.fabric.color === c.label
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent hover:border-muted-foreground"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
        {state.fabric.color && (
          <p className="text-xs text-muted-foreground">
            Couleur sélectionnée : <strong className="text-foreground">{state.fabric.color}</strong>
          </p>
        )}
        <Input
          placeholder="Autre couleur ou précision…"
          value={COLOR_OPTIONS.some((c) => c.label === state.fabric.color) ? "" : state.fabric.color}
          onChange={(e) => setState({ ...state, fabric: { ...state.fabric, color: e.target.value } })}
          className="rounded-sm text-sm"
        />
      </div>
    </div>
  );
}

function StepExtras({ state, setState }: { state: QuoteState; setState: (s: QuoteState) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Options supplémentaires</h3>
        <p className="text-sm text-muted-foreground">Personnalisez les derniers détails de votre salon.</p>
      </div>
      <div className="space-y-3">
        <ExtraRow
          label="Coffre de rangement"
          sublabel="Intégré sous l'assise, charnières silencieuses"
          price="+1 500 MAD"
          checked={state.extras.storageBox}
          onChange={(c) => setState({ ...state, extras: { ...state.extras, storageBox: c } })}
        />
        <ExtraRow
          label="Table centrale assortie"
          sublabel="Même finition bois, plateau assorti"
          price="+900 MAD"
          checked={state.extras.table}
          onChange={(c) => setState({ ...state, extras: { ...state.extras, table: c } })}
        />
        <ExtraRow
          label="Livraison & Installation"
          sublabel="Livraison à domicile et montage par nos équipes"
          price="+500 MAD"
          checked={state.extras.delivery}
          onChange={(c) => setState({ ...state, extras: { ...state.extras, delivery: c } })}
        />
      </div>
    </div>
  );
}

function StepResult({ state }: { state: QuoteState }) {
  const [lead, setLead] = useState({ name: "", phone: "", city: "" });
  const [sent, setSent] = useState(false);
  const bd = useMemo(() => calculateBreakdown(state), [state]);

  const lineItems: { label: string; value: number }[] = [
    { label: `Base — salon ${state.shape}`, value: bd.base },
    ...(bd.foamSurcharge ? [{ label: `Mousse ${state.options.foam}`, value: bd.foamSurcharge }] : []),
    ...(bd.fabricSurcharge ? [{ label: `Tissu ${state.fabric.type}`, value: bd.fabricSurcharge }] : []),
    ...(bd.cushionsSurcharge ? [{ label: `Coussins supplémentaires (×${Math.max(0, state.options.cushionsCount - 4)})`, value: bd.cushionsSurcharge }] : []),
    ...(bd.armrestsSurcharge ? [{ label: "Accoudoirs", value: bd.armrestsSurcharge }] : []),
    ...(bd.woodSurcharge ? [{ label: "Boiserie haute qualité", value: bd.woodSurcharge }] : []),
    ...(bd.storageBoxSurcharge ? [{ label: "Coffre de rangement", value: bd.storageBoxSurcharge }] : []),
    ...(bd.tableSurcharge ? [{ label: "Table centrale", value: bd.tableSurcharge }] : []),
    ...(bd.deliverySurcharge ? [{ label: "Livraison & installation", value: bd.deliverySurcharge }] : []),
  ];

  const isValid = lead.name.trim() && lead.phone.trim() && lead.city.trim();

  const handleSend = () => {
    if (!isValid) return;
    const msg = generateWhatsAppMessage(state, lead.name, lead.phone, lead.city);
    window.open(`https://wa.me/212600000000?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-semibold mb-1">Votre devis estimatif</h3>
        <p className="text-sm text-muted-foreground">Estimation indicative avant devis définitif.</p>
      </div>

      {/* Price hero */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-sm p-5 text-center">
        <span className="text-xs uppercase tracking-widest text-amber-700 block mb-1">Budget estimé</span>
        <div className="text-3xl font-bold text-amber-900">
          {bd.min.toLocaleString()} – {bd.max.toLocaleString()} <span className="text-xl">MAD</span>
        </div>
        <span className="text-[11px] text-amber-700 mt-1 block">±10% selon finitions définitives</span>
      </div>

      {/* Itemized breakdown */}
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Détail de l'estimation</Label>
        <div className="border rounded-sm overflow-hidden">
          {lineItems.map((item, i) => (
            <div
              key={i}
              className={`flex justify-between text-sm px-4 py-2.5 ${i % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold tabular-nums">{fmt(item.value)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm px-4 py-3 bg-primary/5 border-t border-primary/20">
            <span className="font-bold">Total estimé</span>
            <span className="font-bold text-primary tabular-nums">{fmt(bd.total)}</span>
          </div>
        </div>
      </div>

      {/* Lead form */}
      <div className="space-y-4 pt-2 border-t">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Recevoir le devis par WhatsApp</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm">Nom complet</Label>
            <Input
              placeholder="Votre nom"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className="rounded-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Téléphone WhatsApp</Label>
            <Input
              placeholder="+212 6…"
              type="tel"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              className="rounded-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Ville</Label>
            <Input
              placeholder="Casablanca…"
              value={lead.city}
              onChange={(e) => setLead({ ...lead, city: e.target.value })}
              className="rounded-sm"
            />
          </div>
        </div>

        {sent ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3 text-green-800 text-sm">
            <CheckCircle2 size={16} className="shrink-0" />
            Message envoyé ! Nous vous contacterons dans les plus brefs délais.
          </div>
        ) : (
          <Button
            className="w-full rounded-sm h-12 text-base gap-2 font-semibold"
            style={{ background: "#25D366", color: "#fff" }}
            disabled={!isValid}
            onClick={handleSend}
          >
            <Send size={17} />
            Envoyer ma demande via WhatsApp
          </Button>
        )}
        {!isValid && !sent && (
          <p className="text-[11px] text-muted-foreground text-center">
            Remplissez votre nom, téléphone et ville pour envoyer.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuoteSimulator() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuoteState>(DEFAULT_STATE);

  const canAdvance = () => {
    if (step === 2) {
      const { length1, length2, depth } = state.dimensions;
      const needsTwo = state.shape === "L" || state.shape === "U";
      return length1 > 0 && depth > 0 && (!needsTwo || (length2 && length2 > 0));
    }
    return true;
  };

  const nextStep = () => {
    if (canAdvance()) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1: return <StepShape state={state} setState={setState} />;
      case 2: return <StepDimensions state={state} setState={setState} />;
      case 3: return <StepComfort state={state} setState={setState} />;
      case 4: return <StepFabric state={state} setState={setState} />;
      case 5: return <StepExtras state={state} setState={setState} />;
      case 6: return <StepResult state={state} />;
    }
  };

  return (
    <section id="devis" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold block mb-3">
            Configuration sur mesure
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Simulateur de Devis
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Configurez votre salon étape par étape et obtenez une estimation instantanée.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-background border border-border shadow-xl rounded-sm p-6 md:p-10">
          <StepBar step={step} />
          <LivePriceStrip state={state} step={step} />

          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="rounded-sm gap-2 uppercase tracking-wider text-xs h-11 px-5"
            >
              <ChevronLeft size={15} /> Retour
            </Button>
            {step < TOTAL_STEPS && (
              <Button
                onClick={nextStep}
                disabled={!canAdvance()}
                className="rounded-sm gap-2 uppercase tracking-wider text-xs h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Suivant <ChevronRight size={15} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
