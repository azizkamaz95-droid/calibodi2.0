'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { useUserStore } from '@/lib/userStore';
import { ChevronLeft, Crown, Mic, Dumbbell, Utensils, Moon, BarChart3, Camera, Heart, Zap, Shield, Check, X as XIcon, Sparkles, Star, ScanLine, Scale, Bookmark, Target, ShoppingCart, Share2, Loader2, RefreshCw } from 'lucide-react';
import { initRevenueCat, getOfferings, purchasePackage, restorePurchases, type RCPackage } from '@/services/revenueCatService';
import { openExternalLink } from '@/lib/openExternalLink';

const PLANS = [
  { id: 'annual_once', label: 'Annuel unique', price: '49,99€', period: '/an', total: 'Paiement unique', badge: 'MEILLEURE OFFRE', savings: '-58%', popular: true },
  { id: 'annual_monthly', label: 'Annuel', price: '4,99€', period: '/mois', total: '59,88€/an', badge: null, savings: '-50%', popular: false },
  { id: 'monthly', label: 'Mensuel', price: '9,99€', period: '/mois', total: '9,99€/mois', badge: null, savings: null, popular: false },
] as const;

const FEATURES = [
  { icon: Mic, name: 'Coach vocal Calix', free: false, premium: true, highlight: true, desc: 'Un vrai coach IA qui te guide à la voix, te motive et corrige ta posture en temps réel' },
  { icon: Dumbbell, name: 'Séances illimitées', free: '1/jour', premium: 'Illimité', highlight: true, desc: '5 modes : Normal, Express, Voyage, Fatigue, Cycle menstruel' },
  { icon: Utensils, name: '300+ recettes', free: '3/catégorie', premium: '300+', highlight: true, desc: 'Prise de masse, sèche, pré/post workout, avec étapes détaillées' },
  { icon: ScanLine, name: 'Scanner code-barres', free: false, premium: true, highlight: true, desc: 'Scanne tes produits — 3M+ références Open Food Facts + Nutri-Score intelligent' },
  { icon: Heart, name: 'Adaptation blessures', free: 'Basique', premium: 'Complète', highlight: false, desc: 'Exercices adaptés à tes douleurs et limitations physiques' },
  { icon: Target, name: 'Prédictions IA 7j', free: false, premium: true, highlight: true, desc: 'Projection poids/muscle à 7 jours basée sur ton programme' },
  { icon: Scale, name: 'Suivi du poids', free: 'Basique', premium: 'Complet', highlight: false, desc: 'Historique, progression, feedbacks personnalisés et conseils' },
  { icon: Bookmark, name: 'Aliments favoris', free: false, premium: true, highlight: false, desc: 'Sauvegarde tes aliments fréquents pour un ajout en 1 tap' },
  { icon: BarChart3, name: 'IMC, TDEE & Déficit', free: 'Basique', premium: 'Complet', highlight: false, desc: 'Jauge IMC, dépense calorique, bilan mangé/brûlé/reste' },
  { icon: Moon, name: 'Récupération avancée', free: false, premium: true, highlight: false, desc: '100 conseils scientifiques, cartes à retourner, sieste, score récup' },
  { icon: Zap, name: 'Modules connectés', free: false, premium: true, highlight: false, desc: 'Sommeil→séance, séance→eau, nutrition→coaching, tout est lié' },
  { icon: Star, name: '18 badges & XP', free: '3', premium: '18', highlight: false, desc: 'Guerrier, Nomade, En Harmonie... Débloque-les tous' },
  { icon: Camera, name: 'Scan photo IA', free: false, premium: true, highlight: true, desc: 'Prends une photo de ton assiette — l\'IA identifie le plat et calcule les macros automatiquement' },
  { icon: ShoppingCart, name: 'Liste de courses', free: false, premium: true, highlight: true, desc: 'Génère ta liste de courses depuis les recettes en un tap, partage sur WhatsApp' },
  { icon: Share2, name: 'Partage réseaux sociaux', free: false, premium: true, highlight: false, desc: 'Partage tes résultats jour, séance et transformation en image brandée CaliBodi' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', text: 'La voix de Calix, c\'est comme avoir un vrai coach. J\'ai perdu 8kg en 3 mois.', stars: 5, badge: '🔥' },
  { name: 'Mehdi R.', text: 'Le scanner de code-barres m\'a ouvert les yeux sur ce que je mangeais vraiment.', stars: 5, badge: '📱' },
  { name: 'Lucas D.', text: 'L\'adaptation aux blessures m\'a permis de reprendre après ma tendinite.', stars: 5, badge: '💪' },
];

export default function PremiumPage() {
  const router = useRouter();
  const isPremium = useFreemiumStore((s) => s.isPremium);
  const plan = useFreemiumStore((s) => s.plan);
  const setPremium = useFreemiumStore((s) => s.setPremium);
  const name = useUserStore((s) => s.profile.name);
  const userId = useUserStore((s) => s.profile.name); // used as RC userId
  const [selectedPlan, setSelectedPlan] = useState<string>('annual_once');
  const [packages, setPackages] = useState<RCPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Init RevenueCat + load offerings
  useEffect(() => {
    async function load() {
      await initRevenueCat();
      const pkgs = await getOfferings();
      setPackages(pkgs);
    }
    load();
  }, [userId]);

  // Map RC package to our plan ID — match on store product identifier
  const getPackageForPlan = useCallback((planId: string): RCPackage | null => {
    const idMap: Record<string, string[]> = {
      annual_once: ['calibodi_annual_once'],
      annual_monthly: ['calibodi_annual', 'calibodi_monthly_yearly'],
      monthly: ['calibodi_monthly'],
    };
    const ids = idMap[planId] ?? [];
    return packages.find(p => ids.some(id => p.productIdentifier === id || p.productIdentifier.startsWith(id + ':'))) || null;
  }, [packages]);

  const handleSubscribe = async () => {
    setErrorMsg('');
    const pkg = getPackageForPlan(selectedPlan);

    if (!pkg) {
      setErrorMsg('Offre indisponible pour le moment. Réessaie dans quelques instants.');
      return;
    }

    setLoading(true);
    const result = await purchasePackage(pkg);
    setLoading(false);

    if (result.success) {
      setPremium(selectedPlan as any);
      alert('🎉 Bienvenue dans CaliBodi Premium !');
      router.push('/dashboard');
    } else if (result.error !== 'cancelled') {
      setErrorMsg(result.error || 'Erreur lors de l\'achat. Réessaie.');
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const isActive = await restorePurchases();
    setRestoring(false);
    if (isActive) {
      setPremium('monthly' as any);
      alert('✅ Abonnement restauré !');
      router.push('/dashboard');
    } else {
      alert('Aucun abonnement actif trouvé.');
    }
  };

  return (
    <div className="min-h-dvh pb-12">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><ChevronLeft size={20} className="text-white" /></button>
      </div>

      {/* Already subscribed banner */}
      {isPremium && plan !== 'free' && (
        <div className="mx-6 mb-2 p-3 rounded-2xl flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(255,45,85,0.15) 100%)', border: '1px solid rgba(255,107,53,0.4)' }}>
          <Crown size={18} className="text-[#FF6B35] flex-shrink-0" />
          <p className="text-xs text-white font-bold">Tu es déjà abonné Premium — toutes les fonctionnalités sont débloquées.</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-6 pb-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-25 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #FF6B35 0%, #FF2D55 50%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-orange-500/40"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>
            <Crown size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-white mb-2">
            Passe au niveau<br />
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF2D55] bg-clip-text text-transparent">supérieur</span>
          </h1>
          <p className="text-sm text-cali-light-text mt-3 max-w-xs mx-auto leading-relaxed">
            {name ? `${name}, ton` : 'Ton'} corps mérite le meilleur coaching. Un investissement dans ta santé qui vaut bien plus que 5€.
          </p>
        </div>
      </div>

      {/* Emotional quote */}
      <div className="mx-6 mb-6 p-4 rounded-2xl text-center"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,45,85,0.15) 100%)', border: '1px solid rgba(255,107,53,0.3)' }}>
        <p className="text-sm text-white font-bold italic">&ldquo;5€ peuvent changer ta vie.&rdquo;</p>
        <p className="text-[10px] text-cali-orange mt-1">Investis dans ton corps. Ton futur commence aujourd&apos;hui.</p>
      </div>

      {/* Voice coaching highlight */}
      <div className="mx-6 mb-6 p-5 rounded-3xl border border-[#FF6B35]/40 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.18) 0%, rgba(255,45,85,0.12) 100%)' }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: '#FF6B35' }} />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>
            <Mic size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-white">Coach vocal Calix</p>
            <p className="text-xs text-cali-light-text mt-1 leading-relaxed">Un vrai coach qui t&apos;appelle par ton prénom, guide chaque mouvement, corrige ta posture et te motive quand ça devient dur.</p>
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-[#FF6B35] fill-[#FF6B35]" />)}
              <span className="text-[10px] text-cali-light-text ml-1">Fonctionnalité n°1 demandée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 mb-6">
        <p className="text-xs font-bold text-center mb-4 uppercase tracking-wider" style={{ color: '#FF6B35' }}>Choisis ton plan</p>
        <div className="space-y-3">
          {PLANS.map((p) => (
            <button key={p.id} onClick={() => setSelectedPlan(p.id)}
              className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all relative overflow-hidden active:scale-[0.98] ${
                selectedPlan === p.id
                  ? 'border-[#FF6B35]/50 shadow-lg shadow-[#FF6B35]/15'
                  : 'border-white/5 bg-cali-card'
              }`}
              style={selectedPlan === p.id ? { background: 'linear-gradient(135deg, rgba(255,107,53,0.18) 0%, rgba(255,45,85,0.1) 100%)' } : {}}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedPlan === p.id ? 'border-[#FF6B35]' : 'border-gray-600'
              }`}
                style={selectedPlan === p.id ? { background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' } : {}}>
                {selectedPlan === p.id && <Check size={14} className="text-white" />}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{p.label}</p>
                  {p.badge && (
                    <span className="text-[8px] font-black text-white px-2 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>{p.badge}</span>
                  )}
                </div>
                <p className="text-[10px] text-cali-light-text mt-0.5">{p.total}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-display font-black text-white">{p.price}</p>
                <p className="text-[10px] text-cali-light-text">{p.period}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mb-8 space-y-3">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs text-red-400">{errorMsg}</p>
          </div>
        )}
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full rounded-2xl font-display font-bold text-white text-base flex items-center justify-center gap-2 shadow-2xl shadow-[#FF6B35]/30 active:scale-[0.97] transition-transform disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF2D55 100%)', padding: '18px' }}>
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'Traitement...' : 'Débloquer Premium'}
        </button>
        <button onClick={handleRestore} disabled={restoring}
          className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-cali-light-text flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
          {restoring ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {restoring ? 'Restauration...' : 'Restaurer mes achats'}
        </button>
        <p className="text-center text-[10px] text-cali-light-text">7 jours d&apos;essai gratuit · Annulable à tout moment</p>
      </div>

      {/* ═══ Feature comparison — VIVID DESIGN ═══ */}
      <div className="px-6 mb-8">
        <p className="text-xs font-bold text-center mb-4 uppercase tracking-wider" style={{ color: '#FF6B35' }}>Gratuit vs Premium</p>
        <div className="rounded-3xl border overflow-hidden" style={{ borderColor: 'rgba(255,107,53,0.15)', background: 'linear-gradient(180deg, #0F0F18 0%, #0A0A0F 100%)' }}>
          {/* Header row */}
          <div className="grid grid-cols-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,45,85,0.08) 100%)', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
            <span className="text-xs text-cali-light-text font-bold">Fonctionnalité</span>
            <span className="text-xs text-gray-500 text-center font-bold">Gratuit</span>
            <span className="text-xs text-center font-black bg-gradient-to-r from-[#FF6B35] to-[#FF2D55] bg-clip-text text-transparent">Premium ✨</span>
          </div>
          {FEATURES.map((f, i) => (
            <div key={f.name} className={`grid grid-cols-3 items-center px-4 py-3.5 ${i < FEATURES.length - 1 ? '' : ''}`}
              style={{
                borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: f.highlight ? 'linear-gradient(90deg, rgba(255,107,53,0.06) 0%, rgba(255,45,85,0.03) 100%)' : 'transparent',
              }}>
              <div className="flex items-center gap-2">
                <f.icon size={14} className={f.highlight ? 'text-[#FF6B35]' : 'text-cali-light-text'} />
                <span className={`text-[11px] font-medium ${f.highlight ? 'text-white' : 'text-cali-light-text'}`}>{f.name}</span>
              </div>
              <div className="text-center">
                {f.free === false ? (
                  <XIcon size={14} className="text-red-500/60 mx-auto" />
                ) : f.free === true ? (
                  <Check size={14} className="text-green-400 mx-auto" />
                ) : (
                  <span className="text-[10px] text-gray-500">{f.free}</span>
                )}
              </div>
              <div className="text-center">
                {f.premium === true ? (
                  <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>
                    <Check size={12} className="text-white" />
                  </div>
                ) : (
                  <span className="text-[10px] font-black bg-gradient-to-r from-[#FF6B35] to-[#FF2D55] bg-clip-text text-transparent">{f.premium}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-6 mb-8">
        <p className="text-xs font-bold text-center mb-1 uppercase tracking-wider" style={{ color: '#FF6B35' }}>Ils ont transformé leur corps</p>
        <p className="text-[10px] text-gray-600 text-center mb-4 italic">Exemples illustratifs — les résultats varient selon chaque personne.</p>
        <div className="space-y-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,107,53,0.04)', borderColor: 'rgba(255,107,53,0.1)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{t.badge}</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className={`${s <= t.stars ? 'text-[#FF6B35] fill-[#FF6B35]' : 'text-gray-700'}`} />)}
                </div>
              </div>
              <p className="text-xs text-cali-light-text italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <p className="text-[10px] text-gray-600 mt-2 font-bold">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional closing */}
      <div className="px-6 mb-8 text-center">
        <p className="text-lg font-display font-bold text-white mb-2">Le meilleur coach, nutritionniste<br/>et suivi santé dans une seule app.</p>
        <p className="text-sm text-cali-light-text mb-6">Transforme ton physique et ton hygiène de vie.</p>
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full rounded-2xl font-display font-bold text-white text-base flex items-center justify-center gap-2 shadow-2xl shadow-[#FF6B35]/30 active:scale-[0.97] transition-transform disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF2D55 100%)', padding: '18px' }}>
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Crown size={20} />}
          {loading ? 'Traitement...' : 'Commencer maintenant'}
        </button>
        <p className="text-[10px] text-cali-light-text mt-3">Garantie résultats 30 jours</p>
      </div>

      {/* Legal links — required by Apple guideline 3.1.2(c) */}
      <div className="px-6 mb-6 flex flex-col items-center gap-2">
        <p className="text-[10px] text-gray-600 text-center leading-relaxed">
          En t&apos;abonnant, tu acceptes nos{' '}
          <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-[#FF6B35] underline underline-offset-2">Conditions d&apos;utilisation</button>
          {' '}et notre{' '}
          <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-[#FF6B35] underline underline-offset-2">Politique de confidentialité</button>.
        </p>
        <p className="text-[10px] text-gray-600 text-center">L&apos;abonnement se renouvelle automatiquement sauf annulation 24h avant la date de renouvellement.</p>
        <div className="flex items-center gap-4 mt-1">
          <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-[10px] text-gray-500 underline underline-offset-2">CGU / CLUF</button>
          <span className="text-gray-700 text-[10px]">·</span>
          <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-[10px] text-gray-500 underline underline-offset-2">Politique de confidentialité</button>
        </div>
      </div>

      {/* Guarantee */}
      <div className="mx-6 mb-8 p-4 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,45,85,0.05) 100%)', border: '1px solid rgba(255,107,53,0.15)' }}>
        <Shield size={20} className="text-[#FF6B35] mx-auto mb-2" />
        <p className="text-xs text-white font-bold">Garantie 30 jours</p>
        <p className="text-[10px] text-cali-light-text mt-1">Si vous n&apos;avez pas de résultat et que vous avez bien suivi votre programme, on vous rembourse intégralement.</p>
      </div>
    </div>
  );
}
