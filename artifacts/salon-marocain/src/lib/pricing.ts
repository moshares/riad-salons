export type ShapeType = 'L' | 'U' | 'Droit' | 'Sur mesure';
export type FoamType = 'Standard' | 'Premium' | 'Haute densité';
export type FabricType = 'Standard' | 'Premium' | 'Luxe';

export interface QuoteState {
  shape: ShapeType;
  dimensions: {
    length1: number;
    length2?: number; // For L and U
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

export function calculatePriceRange(state: QuoteState): { min: number; max: number } {
  let basePrice = 0;
  
  switch (state.shape) {
    case 'L':
      basePrice = 8000;
      break;
    case 'U':
      basePrice = 12000;
      break;
    case 'Droit':
      basePrice = 5000;
      break;
    case 'Sur mesure':
      basePrice = 15000;
      break;
  }

  let foamMultiplier = 1.0;
  if (state.options.foam === 'Premium') foamMultiplier = 1.15;
  if (state.options.foam === 'Haute densité') foamMultiplier = 1.25;

  let fabricMultiplier = 1.0;
  if (state.fabric.type === 'Premium') fabricMultiplier = 1.2;
  if (state.fabric.type === 'Luxe') fabricMultiplier = 1.4;

  let price = basePrice * foamMultiplier * fabricMultiplier;

  if (state.options.cushionsCount > 4) {
    price += (state.options.cushionsCount - 4) * 300;
  }

  if (state.options.armrests) price += 800;
  if (state.options.premiumWood) price += 2000;
  if (state.extras.storageBox) price += 1500;
  if (state.extras.table) price += 900;
  if (state.extras.delivery) price += 500;

  return {
    min: Math.round(price * 0.9),
    max: Math.round(price * 1.1)
  };
}

export function generateWhatsAppMessage(state: QuoteState, name: string, city: string): string {
  const { min, max } = calculatePriceRange(state);
  
  const text = `Bonjour, je suis ${name} de ${city}. Je souhaite obtenir un devis pour un salon marocain sur mesure.

Détails de ma configuration :
- Forme : ${state.shape}
- Dimensions : L1=${state.dimensions.length1}cm ${state.dimensions.length2 ? `, L2=${state.dimensions.length2}cm` : ''}, Profondeur=${state.dimensions.depth}cm
- Mousse : ${state.options.foam}
- Coussins : ${state.options.cushionsCount}
- Accoudoirs : ${state.options.armrests ? 'Oui' : 'Non'}
- Bois premium : ${state.options.premiumWood ? 'Oui' : 'Non'}
- Tissu : ${state.fabric.type} (Couleur: ${state.fabric.color})
- Coffre : ${state.extras.storageBox ? 'Oui' : 'Non'}
- Table : ${state.extras.table ? 'Oui' : 'Non'}
- Livraison : ${state.extras.delivery ? 'Oui' : 'Non'}

Estimation indicative : ${min} - ${max} MAD

Pouvez-vous me recontacter pour finaliser ce devis ?`;

  return encodeURIComponent(text);
}
