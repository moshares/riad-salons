import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteState, ShapeType, calculatePriceRange, generateWhatsAppMessage } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, ChevronLeft, Check, Send } from "lucide-react";

const STEPS = 6;

export function QuoteSimulator() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuoteState>({
    shape: 'L',
    dimensions: { length1: 300, length2: 250, depth: 70 },
    options: { foam: 'Premium', cushionsCount: 6, armrests: true, premiumWood: false },
    fabric: { type: 'Premium', color: 'Beige' },
    extras: { storageBox: false, table: false, delivery: true }
  });

  const [lead, setLead] = useState({ name: '', phone: '', city: '' });

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">1. Forme du salon</h3>
            <div className="grid grid-cols-2 gap-4">
              {(['L', 'U', 'Droit', 'Sur mesure'] as ShapeType[]).map((shape) => (
                <div 
                  key={shape}
                  onClick={() => setState({ ...state, shape })}
                  className={`p-6 border cursor-pointer flex flex-col items-center justify-center transition-all ${
                    state.shape === shape 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium uppercase tracking-wider">{shape}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">2. Dimensions (cm)</h3>
            <div className="space-y-4">
              <div>
                <Label>Longueur 1</Label>
                <Input 
                  type="number" 
                  value={state.dimensions.length1} 
                  onChange={e => setState({ ...state, dimensions: { ...state.dimensions, length1: Number(e.target.value) } })}
                />
              </div>
              {['L', 'U'].includes(state.shape) && (
                <div>
                  <Label>Longueur 2</Label>
                  <Input 
                    type="number" 
                    value={state.dimensions.length2 || 0} 
                    onChange={e => setState({ ...state, dimensions: { ...state.dimensions, length2: Number(e.target.value) } })}
                  />
                </div>
              )}
              <div>
                <Label>Profondeur assise</Label>
                <Input 
                  type="number" 
                  value={state.dimensions.depth} 
                  onChange={e => setState({ ...state, dimensions: { ...state.dimensions, depth: Number(e.target.value) } })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">3. Confort & Structure</h3>
            
            <div className="space-y-4">
              <Label className="text-base">Type de mousse</Label>
              <RadioGroup 
                value={state.options.foam} 
                onValueChange={(v: any) => setState({ ...state, options: { ...state.options, foam: v } })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Standard" id="foam-std" />
                  <Label htmlFor="foam-std">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Premium" id="foam-pre" />
                  <Label htmlFor="foam-pre">Premium (+15%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Haute densité" id="foam-hd" />
                  <Label htmlFor="foam-hd">Haute densité (+25%)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between">
                <Label className="text-base">Nombre de coussins</Label>
                <span className="font-bold text-primary">{state.options.cushionsCount}</span>
              </div>
              <Slider 
                value={[state.options.cushionsCount]} 
                min={2} max={12} step={1}
                onValueChange={(v) => setState({ ...state, options: { ...state.options, cushionsCount: v[0] } })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base">Accoudoirs</Label>
                <Switch 
                  checked={state.options.armrests} 
                  onCheckedChange={(c) => setState({ ...state, options: { ...state.options, armrests: c } })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-base">Boiserie Haute Qualité</Label>
                <Switch 
                  checked={state.options.premiumWood} 
                  onCheckedChange={(c) => setState({ ...state, options: { ...state.options, premiumWood: c } })}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">4. Tissus</h3>
            <div className="space-y-4">
              <Label className="text-base">Gamme de tissu</Label>
              <RadioGroup 
                value={state.fabric.type} 
                onValueChange={(v: any) => setState({ ...state, fabric: { ...state.fabric, type: v } })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Standard" id="fab-std" />
                  <Label htmlFor="fab-std">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Premium" id="fab-pre" />
                  <Label htmlFor="fab-pre">Premium (+20%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Luxe" id="fab-lux" />
                  <Label htmlFor="fab-lux">Luxe / Velours (+40%)</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Couleur souhaitée</Label>
              <Input 
                value={state.fabric.color} 
                onChange={e => setState({ ...state, fabric: { ...state.fabric, color: e.target.value } })}
                placeholder="Ex: Beige, Vert sauge, Terracotta..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">5. Options Supplémentaires</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-sm">
                <div>
                  <Label className="text-base block">Coffre de rangement</Label>
                  <span className="text-xs text-muted-foreground">Intégré sous l'assise</span>
                </div>
                <Switch 
                  checked={state.extras.storageBox} 
                  onCheckedChange={(c) => setState({ ...state, extras: { ...state.extras, storageBox: c } })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-sm">
                <div>
                  <Label className="text-base block">Table centrale assortie</Label>
                  <span className="text-xs text-muted-foreground">Même finition bois</span>
                </div>
                <Switch 
                  checked={state.extras.table} 
                  onCheckedChange={(c) => setState({ ...state, extras: { ...state.extras, table: c } })}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-sm">
                <div>
                  <Label className="text-base block">Livraison & Installation</Label>
                </div>
                <Switch 
                  checked={state.extras.delivery} 
                  onCheckedChange={(c) => setState({ ...state, extras: { ...state.extras, delivery: c } })}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        const { min, max } = calculatePriceRange(state);
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-4">6. Votre Devis Estimatif</h3>
            
            <div className="bg-primary/5 p-6 border border-primary/20 text-center">
              <span className="block text-sm uppercase tracking-wider text-primary mb-2">Budget estimé</span>
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {min.toLocaleString()} - {max.toLocaleString()} MAD
              </div>
              <span className="text-xs text-muted-foreground mt-2 block">*Prix indicatif hors finitions spéciales</span>
            </div>

            <div className="space-y-4 mt-8">
              <h4 className="font-medium">Recevoir le devis détaillé par WhatsApp</h4>
              <div>
                <Label>Nom complet</Label>
                <Input value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} />
              </div>
              <div>
                <Label>Ville</Label>
                <Input value={lead.city} onChange={e => setLead({ ...lead, city: e.target.value })} />
              </div>
              <Button 
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-none h-12 text-lg gap-2 mt-4"
                onClick={() => {
                  const msg = generateWhatsAppMessage(state, lead.name || 'Client', lead.city || 'Maroc');
                  window.open(`https://wa.me/212600000000?text=${msg}`, '_blank');
                }}
              >
                <Send size={18} />
                Envoyer via WhatsApp
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="devis" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-medium tracking-widest uppercase mb-2 block text-sm">
            Sur Mesure
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
            Simulateur de Devis
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Configurez le salon de vos rêves et obtenez une estimation immédiate.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-background p-6 md:p-10 shadow-xl border border-border">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: STEPS }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-full h-1 mx-1 ${i < step ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
            <div className="text-right text-xs text-muted-foreground uppercase tracking-wider">
              Étape {step} / {STEPS}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1}
              className="rounded-none gap-2 uppercase tracking-wider"
            >
              <ChevronLeft size={16} /> Retour
            </Button>
            {step < STEPS && (
              <Button 
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none gap-2 uppercase tracking-wider"
              >
                Suivant <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
