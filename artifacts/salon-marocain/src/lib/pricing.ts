export type ShapeType = 'L' | 'U' | 'Droit' | 'Sur mesure';
export type FoamType = 'Standard' | 'Premium' | 'Haute densité';
export type FabricType = 'Standard' | 'Premium' | 'Luxe';

export interface QuoteState {
  shape: ShapeType;
  dimensions: {
    length1: number;
    length2: number;
    depth: number;
  };
  options: {
    foam: FoamType;
    cushionsCount: number;
    armrests: boolean;
    premiumWood: boolean;
  };
  fabric: {
    type: FabricType;
    color: string;
  };
  extras: {
    storageBox: boolean;
    table: boolean;
    delivery: boolean;
  };
}

export const SHAPE_BASE_PRICES: Record<ShapeType, number> = {
  Droit: 5000,
  L: 8000,
  U: 12000,
  'Sur mesure': 15000,
};

export const FOAM_LABELS: Record<FoamType, string> = {
  Standard: 'Standard',
  Premium: 'Premium',
  'Haute densité': 'Haute densité',
};

export const FOAM_MULTIPLIERS: Record<FoamType, number> = {
  Standard: 1.0,
  Premium: 1.15,
  'Haute densité': 1.25,
};

export const FABRIC_MULTIPLIERS: Record<FabricType, number> = {
  Standard: 1.0,
  Premium: 1.2,
  Luxe: 1.4,
};

export interface PriceBreakdown {
  base: number;
  foamSurcharge: number;
  fabricSurcharge: number;
  cushionsSurcharge: number;
  armrestsSurcharge: number;
  woodSurcharge: number;
  storageBoxSurcharge: number;
  tableSurcharge: number;
  deliverySurcharge: number;
  total: number;
  min: number;
  max: number;
}

export function calculateBreakdown(state: QuoteState): PriceBreakdown {
  const base = SHAPE_BASE_PRICES[state.shape];

  const foamMultiplier = FOAM_MULTIPLIERS[state.options.foam];
  const fabricMultiplier = FABRIC_MULTIPLIERS[state.fabric.type];

  const baseAfterMaterials = base * foamMultiplier * fabricMultiplier;
  const foamSurcharge = base * (foamMultiplier - 1) * fabricMultiplier;
  const fabricSurcharge = base * (fabricMultiplier - 1);

  const cushionsSurcharge = Math.max(0, state.options.cushionsCount - 4) * 300;
  const armrestsSurcharge = state.options.armrests ? 800 : 0;
  const woodSurcharge = state.options.premiumWood ? 2000 : 0;
  const storageBoxSurcharge = state.extras.storageBox ? 1500 : 0;
  const tableSurcharge = state.extras.table ? 900 : 0;
  const deliverySurcharge = state.extras.delivery ? 500 : 0;

  const total =
    baseAfterMaterials +
    cushionsSurcharge +
    armrestsSurcharge +
    woodSurcharge +
    storageBoxSurcharge +
    tableSurcharge +
    deliverySurcharge;

  return {
    base,
    foamSurcharge: Math.round(foamSurcharge),
    fabricSurcharge: Math.round(fabricSurcharge),
    cushionsSurcharge,
    armrestsSurcharge,
    woodSurcharge,
    storageBoxSurcharge,
    tableSurcharge,
    deliverySurcharge,
    total: Math.round(total),
    min: Math.round(total * 0.9),
    max: Math.round(total * 1.1),
  };
}

export function calculatePriceRange(state: QuoteState): { min: number; max: number } {
  const { min, max } = calculateBreakdown(state);
  return { min, max };
}

export function fmt(n: number): string {
  return n.toLocaleString('fr-MA') + ' MAD';
}

export function generateWhatsAppMessage(
  state: QuoteState,
  name: string,
  phone: string,
  city: string
): string {
  const { min, max } = calculateBreakdown(state);
  const needsLength2 = state.shape === 'L' || state.shape === 'U';

  const lines = [
    `Bonjour, je suis *${name}* de *${city}* (${phone}).`,
    `Je souhaite un devis pour un salon marocain sur mesure.`,
    ``,
    `*Configuration :*`,
    `• Forme : ${state.shape}`,
    `• Longueur principale : ${state.dimensions.length1} cm`,
    ...(needsLength2 ? [`• Longueur secondaire : ${state.dimensions.length2} cm`] : []),
    `• Profondeur d'assise : ${state.dimensions.depth} cm`,
    `• Mousse : ${state.options.foam}`,
    `• Coussins : ${state.options.cushionsCount}`,
    `• Accoudoirs : ${state.options.armrests ? 'Oui' : 'Non'}`,
    `• Boiserie premium : ${state.options.premiumWood ? 'Oui' : 'Non'}`,
    `• Tissu : ${state.fabric.type}${state.fabric.color ? ` — ${state.fabric.color}` : ''}`,
    `• Coffre de rangement : ${state.extras.storageBox ? 'Oui' : 'Non'}`,
    `• Table centrale : ${state.extras.table ? 'Oui' : 'Non'}`,
    `• Livraison & installation : ${state.extras.delivery ? 'Oui' : 'Non'}`,
    ``,
    `*Estimation : ${min.toLocaleString()} – ${max.toLocaleString()} MAD*`,
    ``,
    `Merci de me recontacter pour finaliser ce devis.`,
  ];

  return encodeURIComponent(lines.join('\n'));
}
