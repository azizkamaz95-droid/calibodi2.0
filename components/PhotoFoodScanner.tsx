'use client';
import { useState, useRef, useCallback } from 'react';
import { X, Camera, Loader2, RefreshCw, Plus, AlertCircle, ImageIcon, PenLine, Check } from 'lucide-react';

interface PhotoFoodResult {
  name: string;
  estimatedGrams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: 'high' | 'medium' | 'low';
  source: 'ciqual' | 'openfoodfacts' | 'ai_estimate';
  ciqualName?: string;
}

interface DishResult {
  dishName: string;
  estimatedGrams: number;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

interface PhotoFoodScannerProps {
  onClose: () => void;
  onFoodFound: (food: PhotoFoodResult) => void;
}

function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
}

export default function PhotoFoodScanner({ onClose, onFoodFound }: PhotoFoodScannerProps) {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'result' | 'recalculating' | 'error'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dish, setDish] = useState<DishResult | null>(null);
  const [grams, setGrams] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = useCallback(async (base64Image: string) => {
    setStep('analyzing');
    try {
      const response = await fetch('https://dapper-truffle-6871a6.netlify.app/.netlify/functions/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data.dish) throw new Error('Plat non détecté');

      setDish(data.dish);
      setGrams(data.dish.estimatedGrams);
      setEditedName(data.dish.dishName);
      setStep('result');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Erreur inconnue');
      setStep('error');
    }
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImage(dataUrl);
      const base64 = compressed.split(',')[1];
      setCapturedImage(compressed);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  }, [analyzeImage]);

  const recalculate = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setStep('recalculating');
    try {
      const response = await fetch('https://dapper-truffle-6871a6.netlify.app/.netlify/functions/nutrition-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName: name.trim() }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setDish(data.dish);
      setGrams(data.dish.estimatedGrams);
      setEditedName(data.dish.dishName);
      setEditingName(false);
      setStep('result');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Erreur inconnue');
      setStep('error');
    }
  }, []);

  const handleAdd = () => {
    if (!dish) return;
    const m = grams / 100;
    onFoodFound({
      name: dish.dishName,
      estimatedGrams: grams,
      kcal: Math.round(dish.kcalPer100g * m),
      protein: Math.round(dish.proteinPer100g * m * 10) / 10,
      carbs: Math.round(dish.carbsPer100g * m * 10) / 10,
      fat: Math.round(dish.fatPer100g * m * 10) / 10,
      confidence: 'medium',
      source: 'ai_estimate',
    });
    onClose();
  };

  const macros = dish ? (() => {
    const m = grams / 100;
    return {
      kcal: Math.round(dish.kcalPer100g * m),
      protein: Math.round(dish.proteinPer100g * m * 10) / 10,
      carbs: Math.round(dish.carbsPer100g * m * 10) / 10,
      fat: Math.round(dish.fatPer100g * m * 10) / 10,
    };
  })() : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-cali-card rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 flex items-center justify-center">
              <Camera size={18} className="text-cali-orange" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">Scan Photo IA ✨</h3>
              <p className="text-[10px] text-cali-light-text">Identifie ton plat automatiquement</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* CAPTURE */}
          {step === 'capture' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => cameraInputRef.current?.click()}
                  className="h-36 rounded-2xl border-2 border-dashed border-cali-orange/40 bg-cali-surface flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cali-red/20 to-cali-orange/20 flex items-center justify-center">
                    <Camera size={24} className="text-cali-orange" />
                  </div>
                  <p className="text-xs font-bold text-white">Appareil photo</p>
                  <p className="text-[10px] text-cali-light-text">Prendre une photo</p>
                </button>
                <button onClick={() => galleryInputRef.current?.click()}
                  className="h-36 rounded-2xl border-2 border-dashed border-white/20 bg-cali-surface flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  <p className="text-xs font-bold text-white">Galerie</p>
                  <p className="text-[10px] text-cali-light-text">Choisir une photo</p>
                </button>
              </div>
              <div className="bg-cali-surface rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-cali-orange">💡 Conseils pour un bon scan</p>
                {['Photo bien éclairée, de dessus de préférence', 'Assiette entière visible dans le cadre', 'Évite les photos floues ou trop sombres'].map((tip, i) => (
                  <p key={i} className="text-xs text-cali-light-text flex items-start gap-2">
                    <span className="text-cali-orange mt-0.5">•</span> {tip}
                  </p>
                ))}
              </div>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
              <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          )}

          {/* ANALYZING */}
          {step === 'analyzing' && (
            <div className="space-y-4">
              {capturedImage && (
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img src={capturedImage} alt="Repas" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-cali-orange/20 flex items-center justify-center">
                      <Loader2 size={28} className="text-cali-orange animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Analyse en cours...</p>
                      <p className="text-xs text-cali-light-text mt-1">Claude identifie ton plat 🤖</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {['Analyse de l\'image en haute qualité...', 'Identification du plat...', 'Calcul des valeurs nutritionnelles...'].map((txt, i) => (
                  <div key={i} className="flex items-center gap-3 bg-cali-surface rounded-xl px-4 py-3">
                    <Loader2 size={14} className="text-cali-orange animate-spin flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                    <p className="text-xs text-cali-light-text">{txt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECALCULATING */}
          {step === 'recalculating' && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 size={32} className="text-cali-orange animate-spin" />
              <p className="text-sm font-bold text-white">Recalcul en cours...</p>
              <p className="text-xs text-cali-light-text">L&apos;IA calcule les valeurs pour ce plat 🤖</p>
            </div>
          )}

          {/* RESULT */}
          {step === 'result' && dish && macros && (
            <div className="space-y-4">
              {capturedImage && (
                <div className="relative h-40 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={capturedImage} alt="Repas" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-cali-surface rounded-2xl p-4 border border-cali-orange/20 space-y-3">
                {editingName ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-cali-light-text">Corriger le nom du plat :</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && recalculate(editedName)}
                        autoFocus
                        className="flex-1 bg-cali-card rounded-xl px-3 py-2 text-sm text-white border border-cali-orange/40 focus:outline-none focus:border-cali-orange"
                        placeholder="Ex: lasagne bolognaise"
                      />
                      <button onClick={() => recalculate(editedName)}
                        className="w-10 h-10 rounded-xl bg-cali-orange flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </button>
                      <button onClick={() => { setEditingName(false); setEditedName(dish.dishName); }}
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <p className="text-[10px] text-cali-orange">↩ Appuie sur ✓ pour recalculer les calories</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍽️</span>
                    <p className="text-sm font-bold text-white capitalize flex-1">{dish.dishName}</p>
                    <button onClick={() => { setEditingName(true); setEditedName(dish.dishName); }}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <PenLine size={14} className="text-cali-light-text" />
                    </button>
                  </div>
                )}
                {!editingName && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cali-orange/20 text-cali-orange">🤖 IA</span>
                    <span className="text-[10px] text-cali-light-text">Estimation basée sur la photo · ✏️ Tap pour corriger</span>
                  </div>
                )}
              </div>

              {/* Gram slider */}
              <div className="bg-cali-surface rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-bold text-white">Quantité estimée</p>
                  <p className="text-xs font-bold text-cali-orange">{grams}g</p>
                </div>
                <input type="range" min="50" max="1000" step="10"
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                  className="w-full accent-cali-orange" />
                <div className="flex gap-1.5">
                  {[150, 250, 350, 500].map((g) => (
                    <button key={g} onClick={() => setGrams(g)}
                      className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold ${grams === g ? 'bg-cali-orange/20 text-cali-orange border border-cali-orange/40' : 'text-cali-light-text bg-white/5'}`}>
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { l: 'Kcal', v: macros.kcal, c: 'text-cali-orange' },
                  { l: 'Prot', v: `${macros.protein}g`, c: 'text-cali-red' },
                  { l: 'Gluc', v: `${macros.carbs}g`, c: 'text-cali-blue' },
                  { l: 'Lip', v: `${macros.fat}g`, c: 'text-cali-orange' },
                ].map((m) => (
                  <div key={m.l} className="bg-cali-surface rounded-2xl p-3 text-center border border-white/5">
                    <p className={`text-base font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-[9px] text-cali-light-text mt-0.5">{m.l}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-cali-orange/10 rounded-xl px-3 py-2">
                <AlertCircle size={12} className="text-cali-orange flex-shrink-0 mt-0.5" />
                <p className="text-[9px] text-cali-light-text">Valeurs estimées par l&apos;IA — ajuste la quantité si besoin</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setStep('capture'); setCapturedImage(null); setDish(null); }}
                  className="flex-1 py-3 rounded-2xl bg-cali-surface border border-white/10 text-sm font-bold text-cali-light-text flex items-center justify-center gap-2">
                  <RefreshCw size={16} /> Réessayer
                </button>
                <button onClick={handleAdd}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
                  <Plus size={18} /> Ajouter {macros.kcal} kcal
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {step === 'error' && (
            <div className="space-y-4">
              <div className="bg-cali-surface rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle size={28} className="text-red-400" />
                </div>
                <p className="text-sm font-bold text-white">Analyse impossible</p>
                <p className="text-xs text-cali-light-text">{errorMsg || 'Essaie avec une photo plus nette'}</p>
              </div>
              <button onClick={() => { setStep('capture'); setCapturedImage(null); }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
                <RefreshCw size={16} /> Reprendre une photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
