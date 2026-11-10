'use client';
import { useState, useEffect } from 'react';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { X, Crown, Check, Shield, Zap, Star, Loader2 } from 'lucide-react';
import {
  initRevenueCat,
  getOfferings,
  purchasePackage,
  restorePurchases,
  type RCPackage,
} from '@/services/revenueCatService';
import { openExternalLink } from '@/lib/openExternalLink';

// Map RC package identifiers to our plan IDs for display
const PLAN_META: Record<string, { label: string; badge: string | null; description: string; highlight: boolean; price: string }> = {
  'calibodi_monthly': { label: 'Mensuel', badge: null, description: 'Sans engagement', highlight: false, price: '9,99€/mois' },
  '$rc_monthly': { label: 'Mensuel', badge: null, description: 'Sans engagement', highlight: false, price: '9,99€/mois' },
  'calibodi_annual_once': { label: 'Annuel', badge: null, description: 'Paiement en une fois', highlight: false, price: '49,99€' },
  '$rc_annual': { label: 'Annuel', badge: null, description: 'Paiement en une fois', highlight: false, price: '49,99€' },
  'calibodi_monthly_yearly': { label: 'Mensuel', badge: null, description: 'Avec engagement', highlight: false, price: '4,99€/mois' },
  '$rc_six_month': { label: '6 mois', badge: null, description: 'Engagement 6 mois', highlight: false, price: '' },
};

// Fallback par prix pour les identifiants inconnus
const getPriceFallback = (priceString: string): string => {
  if (priceString.includes('44') || priceString.includes('49')) return '49,99€';
  if (priceString.includes('8.9') || priceString.includes('9.9')) return '9,99€/mois';
  if (priceString.includes('3.9') || priceString.includes('4.9')) return '4,99€/mois';
  return priceString;
};

const FEATURES = [
  'Coaching vocal Calix pendant les séances',
  'Séances illimitées par jour',
  'Scan photo IA multi-aliments',
  'Accès aux 300+ recettes',
  'Modes Voyage, Express, Cycle',
  'Analytics avancés & historique',
  'Liste de courses automatique',
  'Partage réseaux sociaux',
];

export default function Paywall() {
  const isPremium = useFreemiumStore((s) => s.isPremium);
  const trialExpired = useFreemiumStore((s) => s.trialExpired);
  const setPremium = useFreemiumStore((s) => s.setPremium);

  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [packages, setPackages] = useState<RCPackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const platform = Capacitor.getPlatform();
        if (platform !== 'ios' && platform !== 'android') return;
        if (platform === 'ios') setIsIOS(true);
        await initRevenueCat();
        const pkgs = await getOfferings();
        setPackages(pkgs);
        // Default select the "popular" plan or first
        const popular = pkgs.find((p) => PLAN_META[p.identifier]?.highlight);
        setSelectedId(popular?.identifier ?? pkgs[0]?.identifier ?? null);
      } catch {}
    })();
  }, []);

  const shouldShow = !isPremium && trialExpired && !dismissed && isIOS;
  if (!shouldShow) return null;

  const handlePurchase = async () => {
    if (!selectedId) return;
    const pkg = packages.find((p) => p.identifier === selectedId);
    if (!pkg) return;
    setLoading(true);
    setPurchaseError(null);
    const result = await purchasePackage(pkg);
    if (result.success) {
      setPremium('annual_once');
    } else if (result.error) {
      setPurchaseError(result.error);
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    setLoading(true);
    setRestoreMsg(null);
    const active = await restorePurchases();
    if (active) {
      setPremium('annual_once');
    } else {
      setRestoreMsg('Aucun achat trouvé sur ce compte Apple.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-[#0A0A0F] overflow-y-auto">
      {/* Close */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center z-10"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        aria-label="Fermer"
      >
        <X size={18} className="text-gray-400" />
      </button>

      {/* Hero */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FF6B35] to-[#FF2D55] flex items-center justify-center mb-4 shadow-lg shadow-[#FF6B35]/30">
          <Crown size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">Passe à CaliBodi Premium</h1>
        <p className="mt-2 text-sm text-gray-400 max-w-xs">
          Ton essai gratuit est terminé. Débloque tous tes outils pour continuer à progresser.
        </p>
      </div>

      {/* Features */}
      <div className="px-6 mb-6">
        <div className="bg-white/5 rounded-2xl p-4 space-y-2.5">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF6B35]/20 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-[#FF6B35]" />
              </div>
              <p className="text-sm text-gray-300">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans — from RevenueCat offerings */}
      <div className="px-6 space-y-3 mb-6">
        {packages.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={24} className="text-[#FF6B35] animate-spin" />
          </div>
        )}
        {packages.map((pkg) => {
          const metaByPrice = (() => {
            const ps = pkg.product.priceString;
            if (ps.includes('44') || ps.includes('49')) return { label: 'Annuel', badge: null, description: 'Paiement en une fois', highlight: false, price: '49,99€' };
            if (ps.includes('8.9') || ps.includes('9.9')) return { label: 'Mensuel', badge: null, description: 'Sans engagement', highlight: false, price: '9,99€/mois' };
            if (ps.includes('3.9') || ps.includes('4.9')) return { label: 'Mensuel', badge: null, description: 'Avec engagement', highlight: false, price: '4,99€/mois' };
            return { label: pkg.product.localizedTitle, badge: null, description: '', highlight: false, price: '' };
          })();
          // Priority: productIdentifier (App Store ID) over RevenueCat package identifier
          const metaKey =
            Object.keys(PLAN_META).find(k => pkg.productIdentifier === k || pkg.productIdentifier.startsWith(k + ':')) ||
            Object.keys(PLAN_META).find(k => pkg.identifier === k || pkg.identifier.startsWith(k + ':'));
          const meta = (metaKey ? PLAN_META[metaKey] : null) ?? metaByPrice;
          const isSelected = selectedId === pkg.identifier;
          return (
            <button
              key={pkg.identifier}
              onClick={() => setSelectedId(pkg.identifier)}
              className={`w-full text-left rounded-2xl border p-4 transition-all relative ${
                isSelected
                  ? meta.highlight
                    ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                    : 'border-white/40 bg-white/5'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {meta.badge && (
                <span className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  meta.highlight ? 'bg-[#FF6B35] text-white' : 'bg-white/20 text-white'
                }`}>
                  {meta.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{meta.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{meta.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-display font-bold text-white">{meta.price || getPriceFallback(pkg.product.priceString)}</span>
                </div>
              </div>
              {isSelected && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {purchaseError && (
        <p className="px-6 mb-3 text-xs text-red-400 text-center">{purchaseError}</p>
      )}

      {/* CTA */}
      <div className="px-6 pb-4">
        <button
          onClick={handlePurchase}
          disabled={loading || packages.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D55] via-[#FF6B35] to-[#FF6B35] text-white font-display font-bold text-base shadow-lg shadow-[#FF6B35]/30 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Traitement...</>
          ) : (
            <><Zap size={18} /> Commencer maintenant</>
          )}
        </button>

        <button
          onClick={handleRestore}
          disabled={loading}
          className="w-full mt-3 py-2.5 text-sm text-gray-500 disabled:opacity-40"
        >
          Restaurer mes achats
        </button>

        {restoreMsg && (
          <p className="text-center text-xs text-gray-500 mt-1">{restoreMsg}</p>
        )}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-3 mt-2 mb-4">
          <div className="flex items-center gap-1">
            <Shield size={12} className="text-gray-600" />
            <span className="text-[10px] text-gray-600">Paiement sécurisé Apple</span>
          </div>
          <span className="text-gray-700">·</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-gray-600" />
            <span className="text-[10px] text-gray-600">Résiliable à tout moment</span>
          </div>
        </div>

        {/* Legal */}
        <div className="flex items-center justify-center gap-4 pb-6">
          <button onClick={() => openExternalLink('https://calibodi.com/privacy')}
            className="text-[10px] text-gray-600 underline underline-offset-2">
            Politique de confidentialité
          </button>
          <span className="text-gray-700 text-[10px]">·</span>
          <button onClick={() => openExternalLink('https://calibodi.com/terms')}
            className="text-[10px] text-gray-600 underline underline-offset-2">
            CGU
          </button>
        </div>
      </div>
    </div>
  );
}
