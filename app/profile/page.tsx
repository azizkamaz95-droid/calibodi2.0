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
import { User, Crown, HeartPulse, TrendingUp, LogOut, ChevronRight, Bell, Utensils, Calendar, X, Camera, Trash2 } from 'lucide-react';
import { openExternalLink } from '@/lib/openExternalLink';

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

  return (
    <div className="pb-20 page-enter relative">
      
      <div className="relative z-10 p-5 space-y-5">
        {/* Email non vérifié — bandeau discret */}
        {!emailVerified && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-yellow-400">Vérifie ton email pour sécuriser ton compte.</p>
            {verificationSent ? (
              <span className="text-[10px] text-yellow-600 flex-shrink-0">Email envoyé ✓</span>
            ) : (
              <button onClick={handleSendVerification} className="text-[10px] text-yellow-400 underline flex-shrink-0">Envoyer</button>
            )}
          </div>
        )}

        {/* Header */}
        <div className="bg-cali-card rounded-3xl p-5 border border-white/5 text-center">
          <button onClick={() => setShowPhotoChoice(true)} className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cali-red via-cali-orange to-cali-orange mx-auto flex items-center justify-center mb-3 overflow-hidden group">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">{profile.gender === 'female' ? '👩' : profile.gender === 'male' ? '👨' : '🧑'}</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={18} className="text-white" />
            </div>
          </button>
          <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
          <input ref={profileCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleProfilePhoto} />
          {/* Photo choice popup */}
          {showPhotoChoice && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPhotoChoice(false)}>
              <div className="bg-cali-card rounded-3xl p-5 w-72 space-y-3 animate-slide-up" onClick={e => e.stopPropagation()}>
                <p className="text-sm font-bold text-white text-center">Changer ta photo</p>
                <button onClick={() => profileCameraRef.current?.click()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cali-red to-cali-orange text-white font-bold text-sm flex items-center justify-center gap-2">
                  📸 Prendre une photo
                </button>
                <button onClick={() => profilePhotoRef.current?.click()}
                  className="w-full py-3 rounded-2xl bg-cali-surface border border-white/10 text-cali-light-text font-bold text-sm flex items-center justify-center gap-2">
                  🖼️ Choisir dans la galerie
                </button>
                <button onClick={() => setShowPhotoChoice(false)}
                  className="w-full py-2 text-xs text-gray-500 text-center">
                  Annuler
                </button>
              </div>
            </div>
          )}
          <h2 className="text-xl font-display font-bold text-white">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            {isPremium && plan !== 'free' && <span className="bg-cali-orange/20 text-cali-orange px-2 py-0.5 rounded-full text-[10px] font-bold"><Crown size={10} className="inline mr-1" />Premium</span>}
            <span className="text-xs text-gray-500">Niveau {level} · {xp} XP</span>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center"><p className="text-lg font-bold text-cali-blue">{totalSessions}</p><p className="text-[10px] text-gray-500">Séances</p></div>
            <div className="w-px bg-white/10" />
            <div className="text-center"><p className="text-lg font-bold text-cali-green">{profile.weight} kg</p><p className="text-[10px] text-gray-500">Poids</p></div>
            <div className="w-px bg-white/10" />
            <div className="text-center"><p className="text-lg font-bold text-cali-purple">{profile.level === 'beginner' ? '🌱' : profile.level === 'intermediate' ? '⚡' : '🔥'}</p><p className="text-[10px] text-gray-500">Niveau</p></div>
          </div>
        </div>

        {/* Cycle Tracker (women only) */}
        {profile.gender === 'female' && (
          <div className="bg-cali-card rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Calendar size={16} className="text-pink-400" /><span className="text-sm font-bold text-white">Cycle menstruel</span></div>
              <button onClick={() => setActiveModal('cycle')} className="text-xs text-cali-blue">Modifier</button>
            </div>
            {cycleEntries.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="bg-cali-surface rounded-xl px-3 py-2"><p className="text-lg font-bold text-pink-400">J{getCurrentCycleDay()}</p></div>
                <div><p className="text-sm text-white">{phaseLabels[getCurrentCyclePhase()]}</p><p className="text-[10px] text-gray-500">Cycle de {cycleEntries[cycleEntries.length-1].cycleLength} jours</p></div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Renseigne ton cycle pour adapter tes séances</p>
            )}
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Modifier le profil', action: () => setActiveModal('edit'), color: 'text-cali-blue', isPremiumItem: false },
            { icon: HeartPulse, label: 'Blessures / Douleurs', action: () => setActiveModal('injuries'), color: 'text-cali-red', sub: profile.injuries.length > 0 ? `${profile.injuries.length} zone(s)` : 'Aucune', isPremiumItem: false },
            { icon: Utensils, label: 'Préférences alimentaires', action: () => setActiveModal('diet'), color: 'text-cali-green', sub: profile.dietaryPrefs.length > 0 ? profile.dietaryPrefs.length + ' pref(s)' : 'Standard', isPremiumItem: false },
            { icon: Bell, label: 'Notifications', action: () => setActiveModal('notif'), color: 'text-cali-orange', isPremiumItem: false },
            { icon: TrendingUp, label: 'Progression', action: () => router.push('/progress'), color: 'text-cali-purple', isPremiumItem: false },
            { icon: Crown, label: isPremium ? 'Gérer Premium' : 'Passer Premium', action: () => router.push('/premium'), color: 'text-cali-orange', isPremiumItem: true },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className={`w-full rounded-2xl px-4 py-4 border flex items-center gap-3 active:scale-[0.99] ${
                item.isPremiumItem
                  ? 'bg-gradient-to-r from-cali-orange/10 to-cali-red/10 border-cali-orange/30'
                  : 'bg-cali-card border-white/5 hover:border-white/10'
              }`}>
              <item.icon size={20} className={item.color} />
              <div className="flex-1 text-left"><p className="text-sm text-white font-medium">{item.label}</p>{'sub' in item && item.sub && <p className="text-[10px] text-gray-500">{item.sub}</p>}</div>
              <ChevronRight size={16} className={item.isPremiumItem ? 'text-cali-orange' : 'text-gray-600'} />
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5">
          <PrivacyBadge />

          <div className="flex items-center justify-center gap-4 py-3">
            <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-[11px] text-gray-600 underline underline-offset-2">Conditions d&apos;utilisation</button>
            <span className="text-gray-700 text-[11px]">·</span>
            <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-[11px] text-gray-600 underline underline-offset-2">Politique de confidentialité</button>
          </div>

          {/* Promo code section */}
          <div className="bg-cali-card border border-white/5 rounded-2xl p-4 mb-2 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Code promo</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="CAL-XXXXXXXX"
                className="flex-1 bg-cali-surface rounded-xl px-4 py-2.5 text-white text-sm border border-white/5 focus:border-cali-orange/40 focus:outline-none font-mono"
              />
              <button
                onClick={handleRedeemPromo}
                disabled={promoLoading || !promoCode.trim()}
                className="px-4 py-2.5 rounded-xl bg-cali-orange text-white text-sm font-bold disabled:opacity-50"
              >
                {promoLoading ? '...' : 'Activer'}
              </button>
            </div>
            {promoMsg && (
              <p className={`text-xs ${promoMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{promoMsg.text}</p>
            )}
          </div>

          {/* Admin panel — only for admin email */}
          {isAdmin && (
            <div className="bg-cali-card border border-cali-orange/20 rounded-2xl p-4 mb-2 space-y-3">
              <p className="text-xs font-semibold text-cali-orange uppercase tracking-wider">Générer un code promo (admin)</p>
              <div className="flex gap-2">
                {[30, 60, 90, 365].map(d => (
                  <button key={d} onClick={() => setAdminDuration(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${adminDuration === d ? 'bg-cali-orange border-cali-orange text-white' : 'bg-transparent border-white/10 text-gray-400'}`}>
                    {d === 365 ? '1 an' : `${d}j`}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerateCode}
                disabled={adminLoading}
                className="w-full py-2.5 rounded-xl bg-cali-orange/20 border border-cali-orange/40 text-cali-orange text-sm font-bold disabled:opacity-50"
              >
                {adminLoading ? 'Génération...' : `Générer code ${adminDuration} jours`}
              </button>
              {generatedCode && (
                <div className="bg-cali-surface rounded-xl p-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-white text-sm">{generatedCode}</span>
                  <button onClick={() => { navigator.clipboard?.writeText(generatedCode); }}
                    className="text-xs text-cali-orange font-bold">Copier</button>
                </div>
              )}
            </div>
          )}

          <button onClick={handleReset} className="w-full bg-cali-red/10 border border-cali-red/20 rounded-2xl px-4 py-3 flex items-center gap-3 text-cali-red">
            <LogOut size={18} /><span className="text-sm font-medium">Réinitialiser les données</span></button>

          <button onClick={() => setShowDeleteConfirm(true)} className="w-full mt-2 bg-transparent border border-red-900/40 rounded-2xl px-4 py-3 flex items-center gap-3 text-red-700 hover:bg-red-950/20">
            <Trash2 size={18} /><span className="text-sm font-medium">Supprimer mon compte</span></button>
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
      </div>

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
