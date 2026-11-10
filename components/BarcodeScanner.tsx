'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Search, Loader2, AlertCircle, Plus, Minus, RefreshCw } from 'lucide-react';
import { useUserStore } from '@/lib/userStore';

export interface ScannedFood {
  barcode: string;
  name: string;
  brand: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  image?: string;
  nutriscore?: string;
  servingSize?: string;
}

interface BarcodeScannerProps {
  onFoodFound: (food: ScannedFood, grams: number) => void;
  onClose: () => void;
}

function getNutriScoreFeedback(nutriscore: string | undefined, goal: string, food: ScannedFood): {
  message: string; color: string; emoji: string;
} {
  const score = (nutriscore || 'c').toLowerCase();
  const isSèche = goal === 'weight_loss';
  const isMasse = goal === 'muscle';
  const isHighProtein = food.protein > 15;
  const isHighSugar = (food.sugar || 0) > 20 || food.carbs > 60;

  if (isSèche) {
    if (score === 'a' && isHighProtein) return { color: '#22c55e', emoji: '🌟', message: 'Excellent pour ta perte de poids ! Riche en protéines et sain.' };
    if (score === 'a') return { color: '#22c55e', emoji: '🌟', message: 'Très bon choix pour ta sèche.' };
    if (score === 'b') return { color: '#84cc16', emoji: '👍', message: 'Bon pour ta perte de poids, calories raisonnables.' };
    if (score === 'c') return { color: '#f59e0b', emoji: '⚠️', message: 'Moyen pour ta sèche. Consomme avec modération.' };
    if (score === 'd') return { color: '#f97316', emoji: '👎', message: 'Mauvais pour ta perte de poids. Riche en calories ou en sucres.' };
    if (score === 'e') return { color: '#ef4444', emoji: '🚫', message: 'Très mauvais pour ta sèche ! Très riche en sucre/graisses. À éviter.' };
  }
  if (isMasse) {
    if (isHighProtein && (score === 'a' || score === 'b')) return { color: '#22c55e', emoji: '💪', message: 'Parfait pour ta prise de masse ! Riche en protéines et bonne qualité.' };
    if (isHighProtein) return { color: '#84cc16', emoji: '💪', message: `Riche en protéines (${food.protein}g), bon pour tes muscles.` };
    if (score === 'a') return { color: '#22c55e', emoji: '🌟', message: 'Bon produit mais faible en protéines. Complète avec une source protéinée.' };
    if (score === 'd' || score === 'e') {
      if (isHighSugar) return { color: '#f97316', emoji: '⚠️', message: 'Très sucré. Même en prise de masse, privilégie les bonnes calories.' };
      return { color: '#f97316', emoji: '⚠️', message: 'Qualité nutritionnelle faible. Tu mérites mieux pour construire du muscle.' };
    }
  }
  if (score === 'a') return { color: '#22c55e', emoji: '🌟', message: 'Excellent choix nutritionnel !' };
  if (score === 'b') return { color: '#84cc16', emoji: '👍', message: 'Bon produit, qualité correcte.' };
  if (score === 'c') return { color: '#f59e0b', emoji: '⚠️', message: 'Qualité moyenne. Consomme avec modération.' };
  if (score === 'd') return { color: '#f97316', emoji: '👎', message: 'Qualité nutritionnelle médiocre.' };
  return { color: '#ef4444', emoji: '🚫', message: 'Très mauvaise qualité nutritionnelle. À éviter.' };
}

const NUTRISCORE_LABELS: Record<string, { label: string; color: string }> = {
  a: { label: 'A — Excellent', color: '#22c55e' },
  b: { label: 'B — Très bon', color: '#84cc16' },
  c: { label: 'C — Bon', color: '#f59e0b' },
  d: { label: 'D — Mauvais', color: '#f97316' },
  e: { label: 'E — Très mauvais', color: '#ef4444' },
};

export default function BarcodeScanner({ onFoodFound, onClose }: BarcodeScannerProps) {
  const goal = useUserStore((s) => s.profile.goal);

  // 'ios'    = MLKit live scan (transparent webview)
  // 'live'   = Android BarcodeDetector live scan
  // 'manual' = manual input
  const [scanMode, setScanMode] = useState<'ios' | 'live' | 'manual' | null>(null);
  const [iosScanning, setIosScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedFood | null>(null);
  const [portionGrams, setPortionGrams] = useState(100);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect platform on mount
  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.getPlatform() === 'ios') { setScanMode('ios'); return; }
      } catch {}
      setScanMode('BarcodeDetector' in window ? 'live' : 'manual');
    })();
  }, []);

  // ── Cleanup: stop everything on unmount ──────────────────────────────────
  const stopAndroidCamera = useCallback(() => {
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }, []);

  const stopIOSScan = useCallback(() => {
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
    setIosScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAndroidCamera();
      stopIOSScan();
    };
  }, [stopAndroidCamera, stopIOSScan]);

  // ── Barcode lookup ───────────────────────────────────────────────────────
  const lookupBarcode = useCallback(async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,brands,nutriments,nutriscore_grade,image_front_small_url,serving_size`);
      const data = await res.json();
      if (data.status === 0 || !data.product) {
        setError('Produit non trouvé. Essaie un autre code-barres.');
        setLoading(false);
        return;
      }
      const p = data.product;
      const n = p.nutriments || {};
      const food: ScannedFood = {
        barcode,
        name: p.product_name || 'Produit inconnu',
        brand: p.brands || '',
        kcal: Math.round(n['energy-kcal_100g'] || n['energy-kcal'] || 0),
        protein: Math.round((n.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((n.fat_100g || 0) * 10) / 10,
        fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
        sugar: Math.round((n.sugars_100g || 0) * 10) / 10,
        image: p.image_front_small_url || undefined,
        nutriscore: p.nutriscore_grade || undefined,
        servingSize: p.serving_size || undefined,
      };
      if (p.serving_size) {
        const match = p.serving_size.match(/(\d+)\s*g/i);
        if (match) setPortionGrams(parseInt(match[1]));
      }
      setScannedProduct(food);
      stopAndroidCamera();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    } catch {
      setError('Erreur réseau. Vérifie ta connexion.');
    }
    setLoading(false);
  }, [stopAndroidCamera]);

  // ── iOS live scan via getUserMedia + ZXing frame decode ─────────────────
  const startIOSScan = useCallback(async () => {
    setCameraError(null);
    setError(null);
    setCameraActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch {}
      }
      setCameraActive(true);
      setIosScanning(true);

      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2 || !ctx) return;
        try {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          const result = await reader.decodeFromCanvas(canvas);
          const code = result.getText();
          if (code && code.length >= 8) {
            if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
            stopIOSScan();
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            await lookupBarcode(code);
          }
        } catch {} // NotFoundException lancée sur chaque frame sans code — ignoré
      }, 400);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('NotAllowed') || msg.includes('Permission') || msg.includes('denied')) {
        setCameraError('Permission caméra refusée.\n\nVa dans Réglages > CaliBodi > Caméra et active-la.');
      } else {
        setCameraError('Erreur caméra : ' + msg);
      }
    }
  }, [lookupBarcode, stopIOSScan]);

  // ── Android live scan (BarcodeDetector) ─────────────────────────────────
  const startAndroidCamera = useCallback(async () => {
    setCameraError(null);
    setCameraActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch {}
      }
      setCameraActive(true);

      const BDConstructor = (window as unknown as {
        BarcodeDetector: new (opts: { formats: string[] }) => {
          detect: (src: HTMLVideoElement) => Promise<{ rawValue: string }[]>
        }
      }).BarcodeDetector;
      const detector = new BDConstructor({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'] });

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            if (code && code.length >= 8) {
              if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
              scanIntervalRef.current = null;
              if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
              await lookupBarcode(code);
            }
          }
        } catch {}
      }, 350);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('NotAllowed') || msg.includes('Permission') || msg.includes('denied')) {
        setCameraError('Permission caméra refusée.\n\nVa dans Paramètres > Applications > CaliBodi > Autorisations > Caméra.');
      } else {
        setCameraError('Erreur caméra. Utilise la saisie manuelle.');
      }
    }
  }, [lookupBarcode]);

  useEffect(() => {
    if (scanMode === 'live' && !scannedProduct) startAndroidCamera();
    return () => stopAndroidCamera();
  }, [scanMode, scannedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scanMode === 'ios' && !scannedProduct) startIOSScan();
    return () => stopIOSScan();
  }, [scanMode, scannedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSearch = () => {
    const code = manualCode.trim();
    if (code.length >= 8) lookupBarcode(code);
    else setError('Code-barres invalide (min. 8 chiffres)');
  };

  const handleClose = async () => {
    stopAndroidCamera();
    await stopIOSScan();
    onClose();
  };

  const adjustedMacros = scannedProduct ? {
    kcal: Math.round(scannedProduct.kcal * portionGrams / 100),
    protein: Math.round(scannedProduct.protein * portionGrams / 100 * 10) / 10,
    carbs: Math.round(scannedProduct.carbs * portionGrams / 100 * 10) / 10,
    fat: Math.round(scannedProduct.fat * portionGrams / 100 * 10) / 10,
  } : null;

  const feedback = scannedProduct ? getNutriScoreFeedback(scannedProduct.nutriscore, goal, scannedProduct) : null;
  const nutriLabel = scannedProduct?.nutriscore ? NUTRISCORE_LABELS[scannedProduct.nutriscore.toLowerCase()] : null;

  const MEALS = [
    { id: 'breakfast' as const, label: '🌅 Petit-déj' },
    { id: 'lunch' as const, label: '☀️ Déjeuner' },
    { id: 'dinner' as const, label: '🌙 Dîner' },
    { id: 'snack' as const, label: '🍎 Snack' },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // iOS live scan overlay (camera shows behind transparent webview)
  // ══════════════════════════════════════════════════════════════════════════
  // Normal UI (product result, manual input, live scan iOS/Android, loading)
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col overflow-y-auto">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-cali-dark/80 flex-shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Camera size={20} className="text-cali-orange" /> Scanner
        </h2>
        <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Mode Toggle — iOS/manual: scan ↔ manuel ; Android live: pas de toggle */}
      {!scannedProduct && (scanMode === 'ios' || scanMode === 'manual') && (
        <div className="flex mx-4 mt-2 bg-cali-surface rounded-xl p-1 gap-0.5 flex-shrink-0">
          <button
            onClick={() => { stopIOSScan(); setScanMode('ios'); setError(null); setCameraError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${scanMode === 'ios' ? 'bg-gradient-to-r from-cali-red/20 to-cali-orange/20 text-cali-orange border border-cali-orange/30' : 'text-cali-light-text'}`}
          >
            <Camera size={14} /> Scanner
          </button>
          <button
            onClick={() => { stopIOSScan(); setScanMode('manual'); setError(null); setCameraError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${scanMode === 'manual' ? 'bg-gradient-to-r from-cali-red/20 to-cali-orange/20 text-cali-orange border border-cali-orange/30' : 'text-cali-light-text'}`}
          >
            <Search size={14} /> Manuel
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">

        {/* Live scan — iOS (ZXing) + Android (BarcodeDetector) — même viewfinder */}
        {(scanMode === 'ios' || scanMode === 'live') && !scannedProduct && (
          <div className="w-full max-w-sm space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              {cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 border-2 border-cali-orange/60 rounded-xl relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-cali-orange animate-pulse" />
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cali-orange rounded-tl" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cali-orange rounded-tr" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cali-orange rounded-bl" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cali-orange rounded-br" />
                  </div>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={32} className="text-cali-orange animate-spin" />
                  <p className="text-xs text-white">Recherche du produit...</p>
                </div>
              )}
              {!cameraActive && !cameraError && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={24} className="text-cali-orange animate-spin" />
                  <p className="text-xs text-cali-light-text">Ouverture de la caméra...</p>
                </div>
              )}
            </div>
            {cameraActive && !loading && (
              <p className="text-center text-xs text-cali-light-text">📷 Pointe le code-barres — détection automatique</p>
            )}
            {cameraError && (
              <div className="bg-cali-red/10 border border-cali-red/30 rounded-xl p-4 space-y-3">
                <p className="text-xs text-cali-red whitespace-pre-line">{cameraError}</p>
                <button onClick={() => { stopAndroidCamera(); setCameraError(null); startAndroidCamera(); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cali-red to-cali-orange text-white text-sm font-bold flex items-center justify-center gap-2">
                  <RefreshCw size={14} /> Réessayer
                </button>
                <button onClick={() => setScanMode('manual')}
                  className="w-full py-2.5 rounded-xl bg-cali-surface border border-white/10 text-cali-light-text text-sm font-bold">
                  Saisir le code manuellement
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manuel */}
        {scanMode === 'manual' && !scannedProduct && (
          <div className="w-full max-w-sm space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-cali-orange/10 flex items-center justify-center mx-auto mb-3">
                <Search size={28} className="text-cali-orange" />
              </div>
              <p className="text-sm text-cali-light-text">Entre le code-barres du produit</p>
            </div>
            <input
              type="text" inputMode="numeric" value={manualCode}
              onChange={(e) => { setManualCode(e.target.value.replace(/\D/g, '')); setError(null); }}
              placeholder="Ex: 3017620422003"
              className="w-full bg-cali-surface rounded-xl px-4 py-3.5 text-lg text-center text-white tracking-widest placeholder:text-gray-600 border border-white/10 focus:border-cali-orange/40 focus:outline-none font-mono"
            />
            <button
              onClick={handleManualSearch} disabled={loading || manualCode.length < 8}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Rechercher
            </button>
          </div>
        )}

        {/* Erreur générale */}
        {error && (
          <div className="w-full max-w-sm mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* ═══ PRODUIT SCANNÉ ═══ */}
        {scannedProduct && adjustedMacros && feedback && (
          <div className="w-full max-w-sm space-y-4 animate-slide-up">
            <div className="bg-cali-card rounded-3xl p-5 border border-white/5 space-y-4">
              <div className="flex items-start gap-3">
                {scannedProduct.image && (
                  <img src={scannedProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-white" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-white">{scannedProduct.name}</p>
                  {scannedProduct.brand && <p className="text-xs text-cali-light-text">{scannedProduct.brand}</p>}
                  <span className="text-[10px] text-gray-600 font-mono">{scannedProduct.barcode}</span>
                </div>
              </div>

              {nutriLabel && (
                <div className="rounded-xl p-3 border" style={{ borderColor: `${nutriLabel.color}30`, background: `${nutriLabel.color}08` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-white font-black text-lg px-2.5 py-0.5 rounded-lg" style={{ background: nutriLabel.color }}>
                      {scannedProduct.nutriscore?.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold" style={{ color: nutriLabel.color }}>{nutriLabel.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: feedback.color }}>
                    {feedback.emoji} {feedback.message}
                  </p>
                </div>
              )}

              <div className="bg-cali-surface rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-1">⚖️ Combien tu en manges ?</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setPortionGrams(Math.max(10, portionGrams - 10))}
                    className="w-10 h-10 rounded-xl bg-cali-card border border-white/10 flex items-center justify-center active:scale-95">
                    <Minus size={16} className="text-cali-red" />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-display font-black text-white">{portionGrams}</span>
                    <span className="text-sm text-cali-light-text ml-1">g</span>
                  </div>
                  <button onClick={() => setPortionGrams(portionGrams + 10)}
                    className="w-10 h-10 rounded-xl bg-cali-card border border-white/10 flex items-center justify-center active:scale-95">
                    <Plus size={16} className="text-cali-green" />
                  </button>
                </div>
                <input type="range" min="10" max="500" step="5" value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                  className="w-full accent-cali-orange" style={{ touchAction: 'none' }} />
                <div className="flex justify-between">
                  {[25, 50, 100, 150, 200, 300].map((g) => (
                    <button key={g} onClick={() => setPortionGrams(g)}
                      className={`text-[10px] px-2 py-1 rounded-lg ${portionGrams === g ? 'bg-cali-orange/20 text-cali-orange border border-cali-orange/40' : 'text-cali-light-text'}`}>
                      {g}g
                    </button>
                  ))}
                </div>
                {scannedProduct.servingSize && (
                  <p className="text-[10px] text-cali-light-text text-center">Portion suggérée : {scannedProduct.servingSize}</p>
                )}
              </div>

              <p className="text-[10px] text-cali-light-text font-bold">VALEURS POUR {portionGrams}g</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { l: 'Kcal', v: adjustedMacros.kcal, c: 'text-cali-orange' },
                  { l: 'Prot', v: `${adjustedMacros.protein}g`, c: 'text-cali-red' },
                  { l: 'Gluc', v: `${adjustedMacros.carbs}g`, c: 'text-cali-blue' },
                  { l: 'Lip', v: `${adjustedMacros.fat}g`, c: 'text-cali-orange' },
                ].map(m => (
                  <div key={m.l} className="bg-cali-surface rounded-xl p-2.5 text-center">
                    <p className={`text-lg font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-[9px] text-cali-light-text">{m.l}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {MEALS.map((t) => (
                  <button key={t.id} onClick={() => setMealType(t.id)}
                    className={`py-2 rounded-xl text-[10px] font-bold ${mealType === t.id ? 'bg-cali-orange/20 border border-cali-orange/40 text-cali-orange' : 'bg-cali-surface border border-white/5 text-cali-light-text'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => {
              onFoodFound({
                ...scannedProduct,
                kcal: adjustedMacros.kcal,
                protein: adjustedMacros.protein,
                carbs: adjustedMacros.carbs,
                fat: adjustedMacros.fat,
              }, portionGrams);
              onClose();
            }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-display font-bold flex items-center justify-center gap-2">
              <Plus size={18} /> Ajouter {adjustedMacros.kcal} kcal à {MEALS.find(m => m.id === mealType)?.label}
            </button>
            <button onClick={() => { setScannedProduct(null); setError(null); setManualCode(''); setPortionGrams(100); if (scanMode === 'ios') startIOSScan(); }}
              className="w-full py-3 rounded-2xl bg-cali-surface border border-white/5 text-sm text-cali-light-text">
              Scanner un autre produit
            </button>
          </div>
        )}
      </div>

      <div className="p-3 text-center flex-shrink-0">
        <p className="text-[9px] text-gray-700">Données : Open Food Facts — Base collaborative libre</p>
      </div>
    </div>
  );
}
