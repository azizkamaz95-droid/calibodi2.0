'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { useGameStore } from '@/lib/gameStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import type { InjuryZone, Difficulty } from '@/lib/exerciseLibrary';
import type { DietaryPref } from '@/lib/userStore';
import { auth } from '@/lib/firebase';
import { deleteUser, sendEmailVerification } from 'firebase/auth';
import { redeemPromoCode, createPromoCode, ADMIN_EMAIL } from '@/lib/firebaseUserService';

import PrivacyBadge from '@/components/PrivacyBadge';
import { User, Crown, HeartPulse, TrendingUp, LogOut, ChevronRight, Bell, Utensils, Calendar, X, Camera, Trash2, Moon, Sun, Dumbbell, Scale, Settings2 } from 'lucide-react';
import { openExternalLink } from '@/lib/openExternalLink';
import { useThemeStore, applyTheme } from '@/lib/themeStore';

const INJURY_OPTIONS: { id: InjuryZone; label: string; icon: string }[] = [
  { id: 'knee', label: 'Genou(x)', icon: '🦵' },{ id: 'back', label: 'Dos / Lombaires', icon: '🔙' },
  { id: 'shoulder', label: 'Épaule(s)', icon: '💪' },{ id: 'wrist', label: 'Poignet / Coude', icon: '✋' },
  { id: 'hip', label: 'Hanche', icon: '🦴' },{ id: 'ankle', label: 'Cheville / Pied', icon: '🦶' },
  { id: 'neck', label: 'Nuque / Cou', icon: '🧣' },
];

const DIET_OPTIONS: { id: DietaryPref; label: string }[] = [
  { id: 'vegetarian', label: '🥬 Végétarien' },{ id: 'vegan', label: '🌱 Vegan' },
  { id: 'lactose_free', label: '🥛 Sans lactose' },{ id: 'gluten_free', label: '🌾 Sans gluten' },
  { id: 'tayyibat', label: '🌿 Tayyibat' },
];

function ProfileModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-cali-card rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h3 className="text-lg font-display font-bold text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16} className="text-gray-400" /></button></div>
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const resetStore = useUserStore((s) => s.resetStore);
  const totalSessions = useUserStore((s) => s.totalSessions);
  const xp = useUserStore((s) => s.xp);
  const level = useUserStore((s) => s.level);
  const isPremium = useFreemiumStore((s) => s.isPremium);
  const plan = useFreemiumStore((s) => s.plan);
  const notifHydration = useUserStore((s) => s.notifHydration);
  const notifNutrition = useUserStore((s) => s.notifNutrition);
  const notifSleep = useUserStore((s) => s.notifSleep);
  const notifTraining = useUserStore((s) => s.notifTraining);
  const notifMotivation = useUserStore((s) => s.notifMotivation);
  const notifSleepTime = useUserStore((s) => s.notifSleepTime);
  const updateNotifPrefs = useUserStore((s) => s.updateNotifPrefs);
  const addWeightEntry = useUserStore((s) => s.addWeightEntry);
  const addCycleEntry = useUserStore((s) => s.addCycleEntry);
  const getCurrentCycleDay = useUserStore((s) => s.getCurrentCycleDay);
  const getCurrentCyclePhase = useUserStore((s) => s.getCurrentCyclePhase);
  const cycleEntries = useUserStore((s) => s.cycleEntries);
  const visitPage = useGameStore((s) => s.visitPage);

  const [activeModal, setActiveModal] = useState<'edit'|'injuries'|'diet'|'notif'|'cycle'|null>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const profileCameraRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPhotoChoice, setShowPhotoChoice] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setEmailVerified(user.emailVerified);
  }, []);

  const handleSendVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await sendEmailVerification(user).catch(() => {});
    setVerificationSent(true);
  };

  // Load profile photo from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calibodi-profile-photo');
      if (saved) setProfilePhoto(saved);
    }
  }, []);

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setProfilePhoto(url);
      localStorage.setItem('calibodi-profile-photo', url);
    };
    reader.readAsDataURL(file);
    setShowPhotoChoice(false);
  };
  const [editName, setEditName] = useState(profile.name);
  const [editWeight, setEditWeight] = useState(profile.weight);
  const [editHeight, setEditHeight] = useState(profile.height);
  const [editLevel, setEditLevel] = useState(profile.level);
  const [editInjuries, setEditInjuries] = useState<InjuryZone[]>(profile.injuries);
  const [editDiet, setEditDiet] = useState<DietaryPref[]>(profile.dietaryPrefs);
  const [editChronicPain, setEditChronicPain] = useState<string[]>(profile.chronicPain || []);
  const [cycleLength, setCycleLength] = useState(28);
  const [cycleStartDate, setCycleStartDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { visitPage('profile'); }, []);

  const saveProfile = () => {
    updateProfile({ name: editName, weight: editWeight, height: editHeight, level: editLevel });
    if (editWeight !== profile.weight) addWeightEntry(editWeight);
    // Sync nutrition goals and hydration target with updated profile data
    useNutritionStore.getState().setDailyGoals(editWeight, profile.goal, profile.gender, profile.age, editHeight);
    useHydrationStore.getState().setBaseGoal(editWeight, profile.gender);
    setActiveModal(null);
  };
  const saveInjuries = () => { updateProfile({ injuries: editInjuries, chronicPain: editChronicPain }); setActiveModal(null); };
  const saveDiet = () => { updateProfile({ dietaryPrefs: editDiet }); setActiveModal(null); };
  const saveCycle = () => { addCycleEntry({ startDate: cycleStartDate, cycleLength }); setActiveModal(null); };
  const toggleInjury = (z: InjuryZone) => setEditInjuries(p => p.includes(z) ? p.filter(x=>x!==z) : [...p, z]);
  const toggleDiet = (d: DietaryPref) => setEditDiet(p => p.includes(d) ? p.filter(x=>x!==d) : [...p, d]);
  const toggleChronicPain = (c: string) => setEditChronicPain(p => p.includes(c) ? p.filter(x=>x!==c) : [...p, c]);

  const CHRONIC_PAIN_OPTIONS = ['Douleur genou chronique', 'Lombalgie', 'Sciatique', 'Tendinite épaule', 'Canal carpien', 'Douleur cervicale', 'Douleur hanche', 'Fasciite plantaire'];

  const handleReset = () => { if (confirm('Réinitialiser toutes les données ?')) { resetStore(); router.push('/onboarding'); } };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin — generate promo code
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminDuration, setAdminDuration] = useState(30);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const isAdmin = auth.currentUser?.email?.toLowerCase() === ADMIN_EMAIL;
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); applyTheme(next); };

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    setPromoLoading(true);
    setPromoMsg(null);
    const result = await redeemPromoCode(user.uid, promoCode);
    if (result.success) {
      useFreemiumStore.getState().setPremium('annual_once');
      const months = Math.round((result.durationDays ?? 30) / 30);
      setPromoMsg({ type: 'success', text: `✅ Code activé ! Tu as ${months} mois de Premium offerts.` });
      setPromoCode('');
    } else {
      setPromoMsg({ type: 'error', text: result.error ?? 'Code invalide.' });
    }
    setPromoLoading(false);
  };

  const handleGenerateCode = async () => {
    setAdminLoading(true);
    setGeneratedCode(null);
    const result = await createPromoCode(auth.currentUser?.email ?? '', adminDuration);
    if (result.success) setGeneratedCode(result.code ?? null);
    setAdminLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }
      // Clear all Zustand local data
      resetStore();
      useFreemiumStore.getState().cancelPremium();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router.push('/onboarding');
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e.code === 'auth/requires-recent-login') {
        setDeleteError('Par mesure de sécurité, Firebase exige que tu te sois connecté(e) il y a moins de 5 minutes avant de supprimer ton compte. Déconnecte-toi, reconnecte-toi, puis réessaie immédiatement.');
      } else {
        setDeleteError('Erreur lors de la suppression. Réessaie.');
      }
      setDeleteLoading(false);
    }
  };

  const phaseLabels = { menstrual: '🔴 Menstruelle', follicular: '🟢 Folliculaire', ovulation: '🟡 Ovulation', luteal: '🟠 Lutéale' };

  // Waze-style icon circle
  const IC = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>{children}</div>
  );

  // Waze-style menu row
  const Row = ({ onClick, icon, label, sub, last = false }: { onClick: () => void; icon: React.ReactNode; label: string; sub?: string; last?: boolean }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-white/5 transition-colors text-left">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
      {!last && <span className="sr-only" />}
    </button>
  );

  // Section list container
  const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div>
      {title && <p className="text-[11px] font-bold uppercase tracking-widest px-4 pb-2 pt-1" style={{ color: 'var(--text-tertiary)' }}>{title}</p>}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {children}
      </div>
    </div>
  );

  const Divider = () => <div className="ml-[70px] h-px" style={{ background: 'var(--border)' }} />;

  return (
    <div className="pb-24 page-enter" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>

      {/* Email non vérifié */}
      {!emailVerified && (
        <div className="mx-4 mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-yellow-400">Vérifie ton email pour sécuriser ton compte.</p>
          {verificationSent ? (
            <span className="text-[10px] text-yellow-600 flex-shrink-0">Email envoyé ✓</span>
          ) : (
            <button onClick={handleSendVerification} className="text-[10px] text-yellow-400 underline flex-shrink-0">Envoyer</button>
          )}
        </div>
      )}

      {/* ── Hero profil ── */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <button onClick={() => setShowPhotoChoice(true)} className="relative w-24 h-24 rounded-full mb-4 overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #FF2D55, #FF6B35)' }}>
          {profilePhoto
            ? <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
            : <span className="text-4xl">{profile.gender === 'male' ? '👨' : profile.gender === 'female' ? '👩' : '🧑'}</span>}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-active:opacity-100 flex items-center justify-center transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        </button>
        <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
        <input ref={profileCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleProfilePhoto} />

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{profile.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          {isPremium && plan !== 'free' && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
              style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--brand-orange)' }}>
              <Crown size={10} />Premium
            </span>
          )}
          <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Niv. {level} · {xp} XP</span>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 mt-5">
          {[
            { val: totalSessions, label: 'Séances', color: '#00D4FF' },
            { val: `${profile.weight}kg`, label: 'Poids', color: '#00FF87' },
            { val: profile.height > 0 ? `${profile.height}cm` : '—', label: 'Taille', color: '#BF5AF2' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo choice popup */}
      {showPhotoChoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPhotoChoice(false)}>
          <div className="w-72 rounded-3xl p-5 space-y-3 animate-slide-up" style={{ background: 'var(--bg-card)' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold text-center" style={{ color: 'var(--text-primary)' }}>Changer la photo</p>
            <button onClick={() => profileCameraRef.current?.click()} className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2" style={{ background: 'var(--brand-gradient)' }}>
              <Camera size={16} /> Prendre une photo
            </button>
            <button onClick={() => profilePhotoRef.current?.click()} className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              Choisir dans la galerie
            </button>
            <button onClick={() => setShowPhotoChoice(false)} className="w-full py-2 text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>Annuler</button>
          </div>
        </div>
      )}

      {/* ── Sections style Waze ── */}
      <div className="space-y-6 mt-2">

        {/* Profil */}
        <Section title="Profil">
          <Row onClick={() => setActiveModal('edit')} last={false}
            icon={<IC bg="bg-blue-500"><User size={18} className="text-white" /></IC>}
            label="Modifier le profil" sub={`${profile.weight} kg · ${profile.height} cm`} />
          <Divider />
          <Row onClick={() => setActiveModal('injuries')}
            icon={<IC bg="bg-rose-500"><HeartPulse size={18} className="text-white" /></IC>}
            label="Blessures / Douleurs"
            sub={profile.injuries.length > 0 ? `${profile.injuries.length} zone(s) renseignée(s)` : 'Aucune blessure'} />
          <Divider />
          <Row onClick={() => setActiveModal('diet')} last
            icon={<IC bg="bg-green-500"><Utensils size={18} className="text-white" /></IC>}
            label="Préférences alimentaires"
            sub={profile.dietaryPrefs.length > 0 ? `${profile.dietaryPrefs.length} préférence(s)` : 'Standard'} />
        </Section>

        {/* Entraînement & suivi */}
        <Section title="Entraînement">
          <Row onClick={() => router.push('/progress')}
            icon={<IC bg="bg-violet-500"><TrendingUp size={18} className="text-white" /></IC>}
            label="Ma progression" sub="Poids, performances, historique" />
          <Divider />
          <Row onClick={() => router.push('/fitness')} last
            icon={<IC bg="bg-orange-500"><Dumbbell size={18} className="text-white" /></IC>}
            label="Programme fitness" sub={profile.level === 'beginner' ? 'Débutant' : profile.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'} />
        </Section>

        {/* Préférences */}
        <Section title="Préférences">
          <Row onClick={() => setActiveModal('notif')}
            icon={<IC bg="bg-amber-500"><Bell size={18} className="text-white" /></IC>}
            label="Notifications" sub="Rappels hydratation, sommeil..." />
          <Divider />
          {/* Theme toggle */}
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <IC bg={theme === 'dark' ? 'bg-indigo-500' : 'bg-yellow-400'}>
              {theme === 'dark' ? <Moon size={18} className="text-white" /> : <Sun size={18} className="text-white" />}
            </IC>
            <div className="flex-1">
              <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Apparence de l&apos;application</p>
            </div>
            <button onClick={toggleTheme}
              className="w-12 h-7 rounded-full transition-all flex items-center relative"
              style={{ background: theme === 'dark' ? '#6366F1' : 'var(--border-strong)' }}>
              <div className={`w-5 h-5 rounded-full bg-white absolute transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </Section>

        {/* Premium */}
        {(!isPremium || plan === 'free') && (
          <Section title="Abonnement">
            <Row onClick={() => router.push('/premium')}
              icon={<div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-gradient)' }}><Crown size={18} className="text-white" /></div>}
              label="Passer Premium" sub="Accès illimité à toutes les fonctionnalités" last />
          </Section>
        )}
        {isPremium && plan !== 'free' && (
          <Section title="Abonnement">
            <Row onClick={() => router.push('/premium')}
              icon={<div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-gradient)' }}><Crown size={18} className="text-white" /></div>}
              label="Gérer mon abonnement" sub="Premium actif" last />
          </Section>
        )}

        {/* Code promo */}
        <Section title="Code promo">
          <div className="px-4 py-4">
            <div className="flex gap-2">
              <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="CAL-XXXXXXXX"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              <button onClick={handleRedeemPromo} disabled={promoLoading || !promoCode.trim()}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50"
                style={{ background: 'var(--brand-gradient)' }}>
                {promoLoading ? '...' : 'Activer'}
              </button>
            </div>
            {promoMsg && <p className={`text-xs mt-2 ${promoMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{promoMsg.text}</p>}
          </div>
        </Section>

        {/* Admin */}
        {isAdmin && (
          <Section title="Admin">
            <div className="px-4 py-4 space-y-3">
              <div className="flex gap-2">
                {[30, 60, 90, 365].map(d => (
                  <button key={d} onClick={() => setAdminDuration(d)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors"
                    style={adminDuration === d ? { background: 'var(--brand-orange)', borderColor: 'var(--brand-orange)', color: '#fff' } : { background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
                    {d === 365 ? '1 an' : `${d}j`}
                  </button>
                ))}
              </div>
              <button onClick={handleGenerateCode} disabled={adminLoading}
                className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', color: 'var(--brand-orange)' }}>
                {adminLoading ? 'Génération...' : `Générer code ${adminDuration} jours`}
              </button>
              {generatedCode && (
                <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ background: 'var(--bg-surface)' }}>
                  <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{generatedCode}</span>
                  <button onClick={() => navigator.clipboard?.writeText(generatedCode)} className="text-xs font-bold" style={{ color: 'var(--brand-orange)' }}>Copier</button>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Cycle (femme) */}
        {profile.gender === 'female' && (
          <Section title="Santé">
            <Row onClick={() => setActiveModal('cycle')} last
              icon={<IC bg="bg-pink-500"><Calendar size={18} className="text-white" /></IC>}
              label="Cycle menstruel"
              sub={cycleEntries.length > 0 ? `J${getCurrentCycleDay()} — ${phaseLabels[getCurrentCyclePhase()]}` : 'Non renseigné'} />
          </Section>
        )}

        {/* Liens légaux */}
        <div className="px-4">
          <PrivacyBadge />
          <div className="flex items-center justify-center gap-4 py-2">
            <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-[11px] underline underline-offset-2" style={{ color: 'var(--text-tertiary)' }}>Conditions d&apos;utilisation</button>
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>·</span>
            <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-[11px] underline underline-offset-2" style={{ color: 'var(--text-tertiary)' }}>Confidentialité</button>
          </div>
        </div>

        {/* Danger zone */}
        <Section>
          <Row onClick={handleReset}
            icon={<IC bg="bg-red-500"><LogOut size={18} className="text-white" /></IC>}
            label="Réinitialiser les données" />
          <Divider />
          <Row onClick={() => setShowDeleteConfirm(true)} last
            icon={<IC bg="bg-gray-700"><Trash2 size={18} className="text-white" /></IC>}
            label="Supprimer mon compte" />
        </Section>

      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
            <div className="w-full max-w-lg bg-cali-card rounded-t-3xl p-6 space-y-4 animate-slide-up" style={{paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 5rem))'}} onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">Supprimer mon compte</h3>
                  <p className="text-xs text-gray-500">Cette action est irréversible</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Toutes tes données (profil, historique, progression) seront définitivement supprimées. Tu ne pourras pas récupérer ton compte.
              </p>
              {deleteError && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                  <p className="text-xs text-red-400">{deleteError}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                  className="flex-1 py-3 rounded-2xl bg-cali-surface border border-white/10 text-white text-sm font-medium">
                  Annuler
                </button>
                <button onClick={handleDeleteAccount} disabled={deleteLoading}
                  className="flex-1 py-3 rounded-2xl bg-red-700 text-white text-sm font-bold disabled:opacity-50">
                  {deleteLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Edit Modal */}
      {activeModal === 'edit' && (
        <ProfileModal title="Modifier le profil" onClose={() => setActiveModal(null)}>
          <div><label className="text-xs text-gray-500">Prénom</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-cali-surface rounded-xl px-4 py-3 text-white mt-1 border border-white/5 focus:border-cali-blue/40 focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Poids (kg)</label><input type="number" value={editWeight} onChange={e => setEditWeight(Number(e.target.value))} className="w-full bg-cali-surface rounded-xl px-4 py-3 text-white mt-1 border border-white/5 focus:outline-none" /></div>
            <div><label className="text-xs text-gray-500">Taille (cm)</label><input type="number" value={editHeight} onChange={e => setEditHeight(Number(e.target.value))} className="w-full bg-cali-surface rounded-xl px-4 py-3 text-white mt-1 border border-white/5 focus:outline-none" /></div>
          </div>
          <div><label className="text-xs text-gray-500 mb-2 block">Niveau</label>
            <div className="grid grid-cols-3 gap-2">{(['beginner','intermediate','advanced'] as Difficulty[]).map(l => (
              <button key={l} onClick={() => setEditLevel(l)} className={`py-2.5 rounded-xl text-xs font-medium ${editLevel===l?'bg-cali-blue/20 border border-cali-blue/40 text-cali-blue':'bg-cali-surface border border-white/5 text-gray-500'}`}>
                {l==='beginner'?'🌱 Débutant':l==='intermediate'?'⚡ Inter':'🔥 Avancé'}</button>
            ))}</div></div>
          <button onClick={saveProfile} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Enregistrer</button>
        </ProfileModal>
      )}

      {/* Injuries Modal */}
      {activeModal === 'injuries' && (
        <ProfileModal title="Blessures / Douleurs" onClose={() => setActiveModal(null)}>
          <p className="text-xs text-gray-400 font-bold">Blessures</p>
          <div className="grid grid-cols-2 gap-2">{INJURY_OPTIONS.map(o => (
            <button key={o.id} onClick={() => toggleInjury(o.id)} className={`p-3 rounded-2xl text-left flex items-center gap-2 text-xs font-medium ${editInjuries.includes(o.id)?'bg-cali-red/15 border border-cali-red/40 text-cali-red':'bg-cali-surface border border-white/5 text-gray-400'}`}><span>{o.icon}</span>{o.label}</button>
          ))}</div>
          <button onClick={() => setEditInjuries([])} className={`w-full p-3 rounded-2xl text-center text-sm font-medium ${editInjuries.length===0?'bg-cali-green/15 border border-cali-green/40 text-cali-green':'bg-cali-surface border border-white/5 text-gray-400'}`}>✅ Aucune blessure</button>
          <p className="text-xs text-gray-400 font-bold mt-2">Douleurs chroniques</p>
          <div className="grid grid-cols-2 gap-1.5">{CHRONIC_PAIN_OPTIONS.map(c => (
            <button key={c} onClick={() => toggleChronicPain(c)} className={`p-2.5 rounded-2xl text-[11px] font-medium ${editChronicPain.includes(c)?'bg-cali-orange/15 border border-cali-orange/40 text-cali-orange':'bg-cali-surface border border-white/5 text-gray-400'}`}>{c}</button>
          ))}</div>
          <button onClick={saveInjuries} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Enregistrer</button>
        </ProfileModal>
      )}

      {/* Diet Modal */}
      {activeModal === 'diet' && (
        <ProfileModal title="Préférences alimentaires" onClose={() => setActiveModal(null)}>
          <div className="grid grid-cols-2 gap-2">{DIET_OPTIONS.map(d => (
            <button key={d.id} onClick={() => toggleDiet(d.id)} className={`p-3 rounded-2xl text-xs font-medium ${editDiet.includes(d.id)?'bg-cali-green/15 border border-cali-green/40 text-cali-green':'bg-cali-surface border border-white/5 text-gray-400'}`}>{d.label}</button>
          ))}</div>
          <button onClick={saveDiet} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white font-display font-bold">Enregistrer</button>
        </ProfileModal>
      )}

      {/* Notifications Modal */}
      {activeModal === 'notif' && (
        <ProfileModal title="Notifications" onClose={() => setActiveModal(null)}>
          {[{k:'notifHydration',l:'💧 Hydratation',v:notifHydration},{k:'notifNutrition',l:'🥗 Nutrition',v:notifNutrition},{k:'notifSleep',l:'😴 Sommeil',v:notifSleep},{k:'notifTraining',l:'💪 Entraînement',v:notifTraining},{k:'notifMotivation',l:'🌟 Motivation',v:notifMotivation}].map(n => (
            <div key={n.k} className="flex items-center justify-between bg-cali-surface rounded-xl px-4 py-3">
              <span className="text-sm text-white">{n.l}</span>
              <button onClick={() => updateNotifPrefs({[n.k]:!n.v})} className={`w-12 h-6 rounded-full transition-all ${n.v?'bg-cali-green':'bg-gray-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${n.v?'translate-x-6':'translate-x-0.5'}`} /></button>
            </div>
          ))}
          <div className="bg-cali-surface rounded-xl px-4 py-3">
            <div className="flex items-center justify-between"><span className="text-sm text-white">🌙 Rappel coucher</span>
              <input type="time" value={notifSleepTime} onChange={e => updateNotifPrefs({notifSleepTime:e.target.value})} className="bg-transparent text-cali-purple text-sm font-bold focus:outline-none" /></div>
          </div>
        </ProfileModal>
      )}

      {/* Cycle Modal */}
      {activeModal === 'cycle' && (
        <ProfileModal title="Cycle menstruel" onClose={() => setActiveModal(null)}>
          <div className="bg-cali-surface rounded-xl p-4"><label className="text-xs text-gray-500">Dernier début de règles</label>
            <input type="date" value={cycleStartDate} onChange={e => setCycleStartDate(e.target.value)} className="w-full bg-transparent text-white text-lg font-bold mt-2 focus:outline-none" /></div>
          <div className="bg-cali-surface rounded-xl p-4" onTouchStart={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}><div className="flex justify-between mb-1"><span className="text-xs text-cali-light-text">Durée du cycle</span><span className="text-sm font-bold text-white">{cycleLength} jours</span></div>
            <input type="range" min="21" max="35" value={cycleLength} onChange={e => setCycleLength(Number(e.target.value))} className="w-full accent-pink-400" style={{ touchAction: 'none' }} /></div>
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-3"><p className="text-xs text-gray-400">Les séances seront automatiquement adaptées à chaque phase de ton cycle.</p></div>
          <button onClick={saveCycle} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-display font-bold">Enregistrer</button>
        </ProfileModal>
      )}


    </div>
  );
}
