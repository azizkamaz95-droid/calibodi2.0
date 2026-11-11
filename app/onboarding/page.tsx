'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { initUserTrial } from '@/lib/firebaseUserService';
import { useUserStore } from '@/lib/userStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import { useLanguageStore } from '@/lib/languageStore';
import { t, isRTL } from '@/lib/i18n';
import type { Gender, Goal, DietaryPref } from '@/lib/userStore';
import type { Difficulty, InjuryZone } from '@/lib/exerciseLibrary';
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { openExternalLink } from '@/lib/openExternalLink';

const RESEND_FUNCTION_URL = 'https://calibodi-v02.netlify.app/.netlify/functions/send-verification-email';

const INJURY_OPTIONS: { id: InjuryZone; label: string; icon: string }[] = [
  { id: 'knee', label: 'Genou(x)', icon: '🦵' },
  { id: 'back', label: 'Dos / Lombaires', icon: '🔙' },
  { id: 'shoulder', label: 'Épaule(s)', icon: '💪' },
  { id: 'wrist', label: 'Poignet / Coude', icon: '✋' },
  { id: 'hip', label: 'Hanche', icon: '🦴' },
  { id: 'ankle', label: 'Cheville / Pied', icon: '🦶' },
  { id: 'neck', label: 'Nuque / Cou', icon: '🧣' },
];

const ALL_LIMITATION_OPTIONS = [
  'Mobilité réduite', 'Problème cardiaque', 'Asthme', 'Vertiges fréquents',
  'Obésité', 'Post-opération', 'Grossesse', 'Arthrose',
];

const CHRONIC_PAIN_OPTIONS = [
  'Douleur genou chronique', 'Lombalgie', 'Sciatique', 'Tendinite épaule',
  'Canal carpien', 'Douleur cervicale', 'Douleur hanche', 'Fasciite plantaire',
];

const DIET_OPTIONS: { id: DietaryPref; label: string; icon: string }[] = [
  { id: 'vegetarian', label: 'Végétarien', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'lactose_free', label: 'Sans lactose', icon: '🥛' },
  { id: 'gluten_free', label: 'Sans gluten', icon: '🌾' },
  { id: 'tayyibat', label: 'Tayyibat', icon: '🌿' },
];

const ALLERGY_OPTIONS = ['Arachides', 'Fruits à coque', 'Œufs', 'Lait', 'Soja', 'Poisson', 'Crustacés', 'Sésame'];

const ALL_LIMITATION_OPTIONS_I18N = [
  { key: 'lim_mobility' }, { key: 'lim_cardiac' }, { key: 'lim_asthma' }, { key: 'lim_dizziness' },
  { key: 'lim_obesity' }, { key: 'lim_post_op' }, { key: 'lim_pregnancy' }, { key: 'lim_arthritis' },
];
const CHRONIC_PAIN_OPTIONS_I18N = [
  { key: 'chronic_knee' }, { key: 'chronic_back' }, { key: 'chronic_sciatica' }, { key: 'chronic_shoulder' },
  { key: 'chronic_carpal' }, { key: 'chronic_cervical' }, { key: 'chronic_hip' }, { key: 'chronic_plantar' },
];
const DIET_OPTIONS_I18N: { id: DietaryPref; icon: string }[] = [
  { id: 'vegetarian', icon: '🥬' }, { id: 'vegan', icon: '🌱' },
  { id: 'lactose_free', icon: '🥛' }, { id: 'gluten_free', icon: '🌾' }, { id: 'tayyibat', icon: '🌿' },
];

/* ─── DrumRoll (conservé à l'identique) ─────────────────────────────────── */
function DrumRoll({ value, onChange, min, max, unit, label }: { value: number; onChange: (v: number) => void; min: number; max: number; unit: string; label: string }) {
  const ITEM_H = 52;
  const VISIBLE = 5;
  const ref = useRef<HTMLDivElement>(null);
  const items = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => i + min), [min, max]);
  const lastSnapped = useRef<number>(value);
  const hapticsRef = useRef<any>(null);
  const isSettlingRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(value);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  useEffect(() => {
    import('@capacitor/haptics').then(({ Haptics }) => { hapticsRef.current = Haptics; }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = (value - min) * ITEM_H;
    lastSnapped.current = value;
  }, []); // eslint-disable-line

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let snapTimer: ReturnType<typeof setTimeout>;

    const settle = () => {
      el.style.scrollSnapType = 'y mandatory';
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      isSettlingRef.current = true;
      el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      setTimeout(() => { isSettlingRef.current = false; }, 350);
      const snapped = items[clamped];
      if (snapped !== lastSnapped.current) {
        lastSnapped.current = snapped;
        setDisplayValue(snapped);
        onChangeRef.current(snapped);
        hapticsRef.current?.impact({ style: 'LIGHT' }).catch?.(() => {});
      }
    };

    const onScroll = () => {
      if (isSettlingRef.current) return;
      el.style.scrollSnapType = 'none';
      clearTimeout(snapTimer);
      snapTimer = setTimeout(settle, 150);
    };

    const onScrollEnd = () => {
      if (isSettlingRef.current) return;
      clearTimeout(snapTimer);
      settle();
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', onScrollEnd, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', onScrollEnd);
      clearTimeout(snapTimer);
    };
  }, [items]); // eslint-disable-line

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{label}</span>
      <div className="relative">
        <div
          ref={ref}
          className="overflow-y-scroll"
          style={{ height: ITEM_H * VISIBLE, scrollSnapType: 'y mandatory', overscrollBehaviorY: 'contain', overflowX: 'hidden', touchAction: 'pan-y', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {items.map(v => (
            <div key={v} style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center font-display font-black transition-all ${v === displayValue ? 'text-white text-3xl' : 'text-gray-700 text-base'}`}>
              {v}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
        {/* Selection indicator */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: ITEM_H * 2, height: ITEM_H }}>
          <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.3)' }} />
        </div>
        {/* Fade top/bottom */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #0A0A0F 0%, transparent 30%, transparent 70%, #0A0A0F 100%)' }} />
      </div>
      <span className="text-xs font-bold text-cali-orange">{unit}</span>
    </div>
  );
}

/* ─── Calix orb avatar ───────────────────────────────────────────────────── */
function CalixOrb({ size = 80 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,107,53,0.6), rgba(255,45,85,0.3), transparent 70%)', filter: `blur(${size * 0.1}px)` }} />
      <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f18 100%)', border: '1.5px solid rgba(255,107,53,0.3)', boxShadow: '0 0 30px rgba(255,107,53,0.2), inset 0 1px 0 rgba(255,255,255,0.05)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,107,53,0.5)" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="12" fill="none" stroke="url(#calix-g)" strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray="75" strokeDashoffset="20" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          <defs>
            <linearGradient id="calix-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF2D55" /><stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="4" fill="url(#calix-g)" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Selection chip ─────────────────────────────────────────────────────── */
function Chip({ sel, onClick, children }: { sel: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${sel ? 'bg-cali-orange/15 border border-cali-orange/50 text-cali-orange' : 'bg-white/[0.04] border border-white/8 text-gray-400'}`}>
      {children}
    </button>
  );
}

/* ─── Calix video presentation screen ────────────────────────────────────── */
function CalixVideoStep({ lang, name, onNext }: { lang: import('@/lib/languageStore').AppLanguage; name: string; onNext: () => void }) {
  const { t: tFn, isRTL: isRTLFn } = { t, isRTL };
  const rtl = isRTLFn(lang);
  const script = tFn(lang, 'calix_tts', { name: name || 'toi' });
  const videoSrc = `/videos/onboarding/calix_${lang}.mp4`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoExists, setVideoExists] = useState(true);

  useEffect(() => {
    // Auto-play TTS + video on mount
    setPlaying(true);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(script);
      const langMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', ar: 'ar-SA' };
      utt.lang = langMap[lang] || 'fr-FR';
      utt.rate = 0.92;
      utt.pitch = 1.0;

      let start = Date.now();
      const wordRate = script.length * 60; // rough ms estimate
      utt.onstart = () => { start = Date.now(); };
      utt.onboundary = () => {
        const elapsed = Date.now() - start;
        setProgress(Math.min(elapsed / wordRate, 0.95));
      };
      utt.onend = () => { setProgress(1); };
      window.speechSynthesis.speak(utt);
    }
    if (videoRef.current) videoRef.current.play().catch(() => {});

    return () => { window.speechSynthesis?.cancel(); };
  }, []); // eslint-disable-line

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: '#0A0A0F' }} dir={rtl ? 'rtl' : 'ltr'}>
      {/* Video or animated fallback */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {videoExists ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            playsInline
            muted
            onError={() => setVideoExists(false)}
          />
        ) : (
          /* Animated orb fallback when video not yet available */
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(255,107,53,0.2)', animationDuration: '2s' }} />
              <CalixOrb size={120} />
            </div>
            <div className="text-center px-8">
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-3">Calix</p>
              <p className="text-white text-lg font-semibold leading-relaxed">{script}</p>
            </div>
          </div>
        )}
        {/* Dark gradient bottom */}
        {videoExists && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.85) 100%)' }} />
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-5 pb-8 pt-4 flex flex-col gap-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
        {/* TTS progress bar */}
        {playing && (
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg,#FF6B35,#FF2D55)' }} />
          </div>
        )}

        <button onClick={() => { window.speechSynthesis?.cancel(); onNext(); }}
          className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#FF6B35,#FF2D55)', color: '#fff', boxShadow: '0 6px 28px rgba(255,107,53,0.45)' }}>
          {tFn(lang, 'continue')} <ChevronRight size={18} />
        </button>

        <button onClick={() => { window.speechSynthesis?.cancel(); onNext(); }}
          className="text-xs text-gray-600 w-full text-center py-2">
          {tFn(lang, 'video_skip')}
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useUserStore((s) => s.updateProfile);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const startTrial = useFreemiumStore((s) => s.startTrial);
  const setBaseGoal = useHydrationStore((s) => s.setBaseGoal);
  const setDailyGoals = useNutritionStore((s) => s.setDailyGoals);
  const { language, setLanguage } = useLanguageStore();
  const lang = language;
  const rtl = isRTL(lang);
  const tr = useCallback((key: Parameters<typeof t>[1], vars?: Record<string, string>) => t(lang, key, vars), [lang]);

  const [step, setStep] = useState(0);

  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [waitingVerification, setWaitingVerification] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Profile
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(25);
  const [goal, setGoal] = useState<Goal>('health');
  const [programDuration, setProgramDuration] = useState<30 | 60 | 90>(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [targetWeight, setTargetWeight] = useState(70);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [level, setLevel] = useState<Difficulty>('beginner');
  const [injuries, setInjuries] = useState<InjuryZone[]>([]);
  const [noInjury, setNoInjury] = useState(false);
  const [limitations, setLimitations] = useState<string[]>([]);
  const [chronicPain, setChronicPain] = useState<string[]>([]);
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPref[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [personalLetter, setPersonalLetter] = useState('');

  // New structure: 0=lang, 1=name+age, 2=calix-video, 3=auth, 4=goal, 5=duration,
  //                6=body, 7=level, 8=health, 9=nutrition, 10=letter, 11=summary
  const TOTAL_STEPS = 11;

  const toggleInjury = (z: InjuryZone) => { setNoInjury(false); setInjuries(p => p.includes(z) ? p.filter(x => x !== z) : [...p, z]); };
  const toggleLimitation = (l: string) => setLimitations(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleChronicPain = (c: string) => setChronicPain(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleDiet = (d: DietaryPref) => setDietaryPrefs(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const toggleAllergy = (a: string) => setAllergies(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError('');
    try {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result.credential?.idToken;
      if (!idToken) throw new Error('no-id-token');
      const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const userEmail = userCredential.user.email || '';
      const uid = userCredential.user.uid;
      setEmail(userEmail);
      try { await initUserTrial(uid); } catch (_) {}
      if (userEmail.toLowerCase() === 'azizkamaz95@gmail.com') {
        useFreemiumStore.getState().setPremium('annual_once');
      }
      setStep(4);
    } catch (err: any) {
      const msg = err?.code || err?.message || String(err);
      if (!msg.includes('12501') && !msg.includes('cancelled') && !msg.includes('cancel')) {
        setAuthError(`Google: ${msg.slice(0, 80)}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuth = async () => {
    setAuthError(''); setAuthLoading(true);
    try {
      if (isLogin) {
        const loginCred = await signInWithEmailAndPassword(auth, email, password);
        if (email.toLowerCase() === 'azizkamaz95@gmail.com') {
          useFreemiumStore.getState().setPremium('annual_once');
          setStep(4);
        } else if (!loginCred.user.emailVerified) {
          await sendEmailVerification(loginCred.user).catch(() => {});
          setWaitingVerification(true);
        } else {
          setStep(4);
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const resendOk = await fetch(RESEND_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cred.user.email, uid: cred.user.uid }),
        }).then(r => r.ok).catch(() => false);
        if (!resendOk) await sendEmailVerification(cred.user).catch(() => {});
        try { await initUserTrial(cred.user.uid); } catch (_) {}
        if (email.toLowerCase() === 'azizkamaz95@gmail.com') {
          useFreemiumStore.getState().setPremium('annual_once');
          setStep(4);
        } else {
          setWaitingVerification(true);
        }
      }
    } catch (error: any) {
      const c = error?.code || '';
      if (c === 'auth/email-already-in-use') setAuthError('Email déjà utilisé. Connecte-toi.');
      else if (c === 'auth/weak-password') setAuthError('Mot de passe trop faible (6 car. min).');
      else if (c.includes('credential') || c.includes('not-found') || c.includes('wrong-password')) setAuthError('Email ou mot de passe incorrect.');
      else setAuthError('Erreur de connexion. Réessaie.');
    }
    setAuthLoading(false);
  };

  const handleFinish = () => {
    updateProfile({ name, gender, age, goal, weight, height, targetWeight, sessionsPerWeek, level, injuries, programDuration, personalLetter, limitations, chronicPain, dietaryPrefs, allergies });
    setBaseGoal(weight);
    setDailyGoals(weight, goal);
    startTrial();
    if (email.toLowerCase() === 'azizkamaz95@gmail.com') useFreemiumStore.getState().setPremium('annual_once');
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  const handleForgotPassword = async () => {
    if (!email.includes('@')) { setAuthError("Entre ton email d'abord."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthError('');
      alert('Un email de réinitialisation a été envoyé à ' + email);
    } catch { setAuthError("Impossible d'envoyer l'email. Vérifie l'adresse."); }
  };

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 3) return email.includes('@') && password.length >= 6;
    if (step === 8) return injuries.length > 0 || noInjury;
    return true;
  };

  const handleNext = () => {
    if (step === 3) handleAuth();
    else if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      setWaitingVerification(false);
      setStep(4);
    } else {
      alert('Email pas encore vérifié. Clique sur le lien dans le mail.');
    }
    setCheckingVerification(false);
  };

  /* ─── Email verification screen ───────────────────────────────────────── */
  if (waitingVerification) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center gap-6" style={{ background: 'var(--bg)' }}>
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(255,107,53,0.15),rgba(255,45,85,0.1))', border: '1.5px solid rgba(255,107,53,0.3)', boxShadow: '0 0 40px rgba(255,107,53,0.15)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#ev)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
            <defs><linearGradient id="ev" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF6B35"/><stop offset="100%" stopColor="#FF2D55"/>
            </linearGradient></defs>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Vérifie ton email</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un lien de vérification a été envoyé à<br/>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{email}</span>
          </p>
        </div>
        <div className="rounded-2xl px-4 py-3 w-full" style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.2)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,200,0,0.8)' }}>Vérifie ton dossier spam si tu ne vois pas le mail</p>
        </div>
        <div className="w-full space-y-3">
          <button onClick={handleCheckVerification} disabled={checkingVerification}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white active:opacity-80 cb-btn-primary">
            {checkingVerification ? 'Vérification...' : "J'ai cliqué sur le lien"}
          </button>
          <button onClick={() => sendEmailVerification(auth.currentUser!).catch(() => {})}
            className="text-xs w-full" style={{ color: 'var(--text-tertiary)' }}>
            Renvoyer le mail
          </button>
        </div>
      </div>
    );
  }

  /* ─── Step content ─────────────────────────────────────────────────────── */

  // Photo cards — place your own photos in /public/onboarding/
  // Names: welcome.jpg, weight_loss.jpg, muscle.jpg, endurance.jpg, health.jpg,
  //        beginner.jpg, advanced.jpg, nutrition.jpg, summary.jpg
  const PHOTO = (name: string) => `/onboarding/${name}.jpg`;

  // Gradient fallbacks shown when photo isn't present yet
  const GOAL_GRADIENTS: Record<string, string> = {
    weight_loss: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #FF4500 100%)',
    muscle:      'linear-gradient(135deg, #000d1a 0%, #001433 50%, #0057FF 100%)',
    endurance:   'linear-gradient(135deg, #001a0d 0%, #003320 50%, #00C853 100%)',
    health:      'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #8B2FC9 100%)',
  };

  const GOAL_CONFIG = {
    weight_loss: { photo: PHOTO('weight_loss'), gradient: GOAL_GRADIENTS.weight_loss,  accent: '#FF6B35', label: 'Perte de poids',  desc: 'Brûler les graisses durablement',  color: 'from-orange-500/20 to-red-500/10',     border: 'border-orange-500/40', text: 'text-orange-400' },
    muscle:      { photo: PHOTO('muscle'),      gradient: GOAL_GRADIENTS.muscle,       accent: '#3B82F6', label: 'Prise de muscle', desc: 'Sculpter et renforcer le corps',    color: 'from-blue-500/20 to-purple-500/10',    border: 'border-blue-500/40',   text: 'text-blue-400'   },
    endurance:   { photo: PHOTO('endurance'),   gradient: GOAL_GRADIENTS.endurance,    accent: '#00C853', label: 'Endurance',       desc: 'Cardio et résistance maximale',     color: 'from-green-500/20 to-teal-500/10',     border: 'border-green-500/40',  text: 'text-green-400'  },
    health:      { photo: PHOTO('health'),      gradient: GOAL_GRADIENTS.health,       accent: '#BF5AF2', label: 'Santé générale',  desc: 'Retrouver une hygiène de vie',      color: 'from-emerald-500/20 to-green-500/10',  border: 'border-emerald-500/40',text: 'text-emerald-400'},
  };

  const renderStep = () => {
    switch (step) {
      /* ── 0 Language selection ─────────────────────────────────────────── */
      case 0:
        return (
          <div className="flex flex-col h-full -mx-5 -mt-5">
            {/* Hero */}
            <div className="relative h-[40vh] flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ borderRadius: '0 0 36px 36px', background: 'linear-gradient(145deg, #1a0a00 0%, #0a0014 60%, #08080E 100%)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,107,53,0.15) 0%, transparent 70%)' }} />
              <div className="relative flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.35)' }}>
                  <svg width="34" height="34" viewBox="0 0 60 60" fill="none">
                    <path d="M44 20C41 14 35 10 28 10C18 10 10 18 10 30C10 42 18 50 28 50C35 50 41 46 44 40"
                      stroke="url(#lg0)" strokeWidth="4.5" strokeLinecap="round"/>
                    <defs><linearGradient id="lg0" x1="10" y1="10" x2="44" y2="50" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF2D55"/><stop offset="100%" stopColor="#FF6B35"/>
                    </linearGradient></defs>
                  </svg>
                </div>
                <span className="text-white font-black text-2xl tracking-tight">CaliBodi</span>
              </div>
            </div>

            <div className="flex-1 px-5 pt-8 pb-4 flex flex-col gap-6">
              <h2 className="text-2xl font-display font-black text-white text-center">{tr('lang_choose')}</h2>

              <div className="space-y-3">
                {([
                  { code: 'fr' as const, flag: '🇫🇷', name: 'Français' },
                  { code: 'en' as const, flag: '🇬🇧', name: 'English' },
                  { code: 'es' as const, flag: '🇪🇸', name: 'Español' },
                  { code: 'ar' as const, flag: '🇸🇦', name: 'العربية' },
                ]).map(({ code, flag, name: langName }) => (
                  <button key={code} onClick={() => setLanguage(code)}
                    className="w-full py-4 px-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
                    style={language === code
                      ? { background: 'rgba(255,107,53,0.12)', border: '2px solid rgba(255,107,53,0.6)', boxShadow: '0 0 20px rgba(255,107,53,0.2)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-3xl">{flag}</span>
                    <span className={`font-bold text-lg flex-1 ${language === code ? 'text-white' : 'text-gray-400'}`} style={code === 'ar' ? { fontFamily: 'serif', direction: 'rtl' } : {}}>{langName}</span>
                    {language === code && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#FF6B35' }}>
                        <Check size={14} color="#fff" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* ── 1 Name + Age + Gender ────────────────────────────────────────── */
      case 1:
        return (
          <div className="space-y-6" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white leading-tight">{tr('identity_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('identity_subtitle')}</p>
            </div>

            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={tr('identity_name_placeholder')}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white text-xl font-display font-bold text-center focus:border-cali-orange/50 focus:outline-none" autoFocus />

            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">{tr('identity_gender')}</p>
              <div className="grid grid-cols-3 gap-2">
                {([['male', '👨', tr('identity_male')], ['female', '👩', tr('identity_female')], ['other', '🧑', tr('identity_other')]] as [Gender, string, string][]).map(([g, icon, label]) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`py-4 rounded-2xl text-sm font-semibold transition-all flex flex-col items-center gap-1.5 ${gender === g ? 'bg-cali-orange/15 border border-cali-orange/50 text-white' : 'bg-white/[0.04] border border-white/8 text-gray-500'}`}>
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">{tr('identity_age')}</p>
              <div className="bg-white/[0.03] border border-white/6 rounded-2xl p-4 flex justify-center">
                <DrumRoll value={age} onChange={setAge} min={14} max={80} unit={tr('identity_age').toLowerCase()} label={tr('identity_age')} />
              </div>
            </div>
          </div>
        );

      /* ── 2 Calix video presentation ───────────────────────────────────── */
      case 2:
        return <CalixVideoStep lang={lang} name={name} onNext={() => setStep(3)} />;

      /* ── 3 Auth ────────────────────────────────────────────────────────── */
      case 3:
        return (
          <div className="space-y-5" dir={rtl ? 'rtl' : 'ltr'}>
            <div className="text-center">
              <CalixOrb size={56} />
              <div className="mt-3">
                <h2 className="text-2xl font-display font-black text-white">{isLogin ? tr('auth_welcome_back') : tr('auth_create')}</h2>
                <p className="text-sm text-gray-500 mt-1">{isLogin ? tr('auth_reconnect') : tr('auth_trial')}</p>
              </div>
            </div>

            <button onClick={handleGoogleSignIn} disabled={googleLoading}
              className="w-full py-4 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center gap-3 font-semibold text-white text-sm active:opacity-70 transition-opacity">
              {googleLoading ? (
                <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>{tr('connecting')}</span></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  {tr('auth_google')}
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[11px] text-gray-600 font-medium">{tr('auth_or')}</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="space-y-3">
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setAuthError(''); }}
                placeholder={tr('auth_email')}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:border-cali-orange/50 focus:outline-none" />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                  placeholder={tr('auth_password')}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-white text-sm placeholder-gray-600 focus:border-cali-orange/50 focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-cali-red/10 border border-cali-red/20 rounded-xl px-4 py-3">
                <p className="text-xs text-cali-red text-center">{authError}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }}
                className="text-xs text-cali-orange font-medium">
                {isLogin ? tr('auth_no_account') : tr('auth_has_account')}
              </button>
              {isLogin && (
                <button onClick={handleForgotPassword} className="text-xs text-gray-500">{tr('auth_forgot')}</button>
              )}
            </div>

            <p className="text-[10px] text-gray-600 text-center leading-relaxed">
              {tr('auth_terms')}{' '}
              <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-gray-500 underline underline-offset-2">{tr('auth_terms_link')}</button>
              {' '}{tr('auth_privacy')}{' '}
              <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-gray-500 underline underline-offset-2">{tr('auth_privacy_link')}</button>.
            </p>
          </div>
        );

      /* ── 4 Goal ──────────────────────────────────────────────────────── */
      case 4:
        return (
          <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('goal_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('goal_subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(GOAL_CONFIG) as [Goal, typeof GOAL_CONFIG['health']][]).map(([g, cfg]) => (
                <button key={g} onClick={() => setGoal(g)}
                  className="relative overflow-hidden text-left active:scale-95 transition-transform"
                  style={{ borderRadius: '20px', height: '130px', border: goal === g ? `2px solid ${cfg.accent}` : '2px solid transparent', boxShadow: goal === g ? `0 0 24px ${cfg.accent}40` : 'none' }}>
                  <img src={cfg.photo} alt={cfg.label} className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 -z-10" style={{ background: cfg.gradient }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)' }} />
                  {goal === g && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: cfg.accent }}>
                      <Check size={13} color="#fff" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight">{cfg.label}</p>
                    <p className="text-white/60 text-[10px] mt-0.5 leading-tight">{cfg.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      /* ── 5 Program Duration ──────────────────────────────────────────── */
      case 5:
        return (
          <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('duration_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('duration_subtitle')}</p>
            </div>

            <div className="space-y-3">
              {([
                [30, PHOTO('beginner'),  'linear-gradient(135deg,#0d0800 0%,#2a1500 100%)', '#FF8C42', tr('duration_30_title'), tr('duration_30_desc')],
                [60, PHOTO('advanced'),  'linear-gradient(135deg,#080010 0%,#1a0030 100%)', '#FF6B35', tr('duration_60_title'), tr('duration_60_desc')],
                [90, PHOTO('summary'),   'linear-gradient(135deg,#000814 0%,#001433 100%)', '#FF2D55', tr('duration_90_title'), tr('duration_90_desc')],
              ] as [30|60|90, string, string, string, string, string][]).map(([d, photo, grad, accent, title, detail]) => (
                <button key={d} onClick={() => setProgramDuration(d)}
                  className="relative w-full overflow-hidden text-left active:scale-[0.98] transition-transform"
                  style={{ borderRadius: '20px', height: '86px', border: programDuration === d ? `2px solid ${accent}` : '1px solid var(--border)', boxShadow: programDuration === d ? `0 0 20px ${accent}30` : 'none' }}>
                  <img src={photo} alt={title} className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 -z-10" style={{ background: grad }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.1) 100%)' }} />
                  <div className="absolute inset-0 flex items-center px-4 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-black text-base">{title}</span>
                        {programDuration === d && <div className="w-2 h-2 rounded-full" style={{ background: accent }} />}
                      </div>
                      <p className="text-white/55 text-xs">{detail}</p>
                    </div>
                    {programDuration === d && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                        <Check size={14} color="#fff" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      /* ── 6 Body data ──────────────────────────────────────────────────── */
      case 6:
        return (
          <div className="space-y-5" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('body_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('body_subtitle')}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/6 rounded-2xl p-4">
              <div className="flex justify-around">
                <DrumRoll value={weight} onChange={setWeight} min={30} max={200} unit="kg" label={tr('body_current_weight')} />
                <div className="w-px bg-white/6" />
                <DrumRoll value={height} onChange={setHeight} min={120} max={220} unit="cm" label={tr('body_height')} />
                <div className="w-px bg-white/6" />
                <DrumRoll value={targetWeight} onChange={setTargetWeight} min={30} max={200} unit="kg" label={tr('body_target')} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">{tr('body_sessions')}</p>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => setSessionsPerWeek(n)}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${sessionsPerWeek === n ? 'bg-cali-orange text-white shadow-[0_4px_15px_rgba(255,107,53,0.4)]' : 'bg-white/[0.04] border border-white/8 text-gray-500'}`}>
                    {n}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* ── 7 Level ──────────────────────────────────────────────────────── */
      case 7:
        return (
          <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('level_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('level_subtitle')}</p>
            </div>

            <div className="space-y-3">
              {([
                ['beginner',     PHOTO('beginner'), 'linear-gradient(135deg,#001a06 0%,#003510 100%)', '#00C853', tr('level_beginner'), tr('level_beginner_desc')],
                ['intermediate', PHOTO('advanced'), 'linear-gradient(135deg,#000d1a 0%,#001433 100%)', '#3B82F6', tr('level_intermediate'), tr('level_intermediate_desc')],
                ['advanced',     PHOTO('summary'),  'linear-gradient(135deg,#1a0400 0%,#3d0d00 100%)', '#FF6B35', tr('level_advanced'), tr('level_advanced_desc')],
              ] as [Difficulty, string, string, string, string, string][]).map(([l, photo, grad, accent, title, desc]) => (
                <button key={l} onClick={() => setLevel(l)}
                  className="relative w-full overflow-hidden text-left active:scale-[0.98] transition-transform"
                  style={{ borderRadius: '20px', height: '90px', border: level === l ? `2px solid ${accent}` : '1px solid var(--border)', boxShadow: level === l ? `0 0 20px ${accent}30` : 'none' }}>
                  <img src={photo} alt={title} className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 -z-10" style={{ background: grad }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)' }} />
                  <div className="absolute inset-0 flex items-center px-4 gap-3">
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{title}</p>
                      <p className="text-white/55 text-xs mt-0.5">{desc}</p>
                    </div>
                    {level === l && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                        <Check size={14} color="#fff" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      /* ── 8 Health ─────────────────────────────────────────────────────── */
      case 8:
        return (
          <div className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('health_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('health_subtitle')}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">{tr('health_injuries')}</p>
              <div className="grid grid-cols-2 gap-2">
                {INJURY_OPTIONS.map(o => (
                  <Chip key={o.id} sel={injuries.includes(o.id)} onClick={() => toggleInjury(o.id)}>
                    <span>{o.icon}</span>{tr(`injury_${o.id}` as Parameters<typeof t>[1])}
                  </Chip>
                ))}
              </div>
              <button onClick={() => { setNoInjury(true); setInjuries([]); }}
                className={`mt-2 w-full p-3 rounded-xl text-sm font-semibold transition-all ${noInjury ? 'bg-green-500/15 border border-green-500/40 text-green-400' : 'bg-white/[0.04] border border-white/8 text-gray-400'}`}>
                {noInjury ? tr('health_no_injury_confirm') : tr('health_no_injury')}
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">{tr('health_limitations')}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_LIMITATION_OPTIONS_I18N.filter(l => gender !== 'male' || l.key !== 'lim_pregnancy').map(l => (
                  <Chip key={l.key} sel={limitations.includes(l.key)} onClick={() => toggleLimitation(l.key)}>{tr(l.key as Parameters<typeof t>[1])}</Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">{tr('health_chronic')}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CHRONIC_PAIN_OPTIONS_I18N.map(c => (
                  <Chip key={c.key} sel={chronicPain.includes(c.key)} onClick={() => toggleChronicPain(c.key)}>{tr(c.key as Parameters<typeof t>[1])}</Chip>
                ))}
              </div>
            </div>
          </div>
        );

      /* ── 9 Nutrition ──────────────────────────────────────────────────── */
      case 9:
        return (
          <div className="space-y-5" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('nutrition_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('nutrition_subtitle')}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">{tr('nutrition_diet')}</p>
              <div className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS_I18N.map(d => (
                  <Chip key={d.id} sel={dietaryPrefs.includes(d.id)} onClick={() => toggleDiet(d.id)}>
                    <span>{d.icon}</span>{tr(`diet_${d.id}` as Parameters<typeof t>[1])}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">{tr('nutrition_allergies')}</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map(a => (
                  <button key={a} onClick={() => toggleAllergy(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${allergies.includes(a) ? 'bg-red-500/15 border border-red-500/40 text-red-400' : 'bg-white/[0.04] border border-white/8 text-gray-500'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-cali-orange/5 border border-cali-orange/15 rounded-2xl px-4 py-3">
              <p className="text-xs text-gray-400">{tr('nutrition_tip')}</p>
            </div>
          </div>
        );

      /* ── 10 Personal Letter ───────────────────────────────────────────── */
      case 10:
        return (
          <div className="space-y-5" dir={rtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs text-cali-orange font-bold tracking-widest uppercase mb-1">Calix</p>
              <h2 className="text-2xl font-display font-black text-white">{tr('letter_title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{tr('letter_subtitle')}</p>
            </div>

            <textarea value={personalLetter} onChange={e => setPersonalLetter(e.target.value)} rows={7}
              placeholder={tr('letter_placeholder')}
              className="w-full bg-white/[0.04] border border-white/8 rounded-2xl px-4 py-4 text-white text-sm leading-relaxed focus:border-cali-orange/30 focus:outline-none resize-none"
              dir={rtl ? 'rtl' : 'ltr'} />

            <div className="bg-white/[0.03] border border-white/6 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <p className="text-xs text-gray-400">{tr('letter_locked')} <span className="text-cali-orange font-bold">{tr('letter_day30')}</span></p>
            </div>

            <button onClick={() => setStep(step + 1)} className="text-xs text-gray-600 w-full text-center">
              {tr('letter_skip')}
            </button>
          </div>
        );

      /* ── Summary ──────────────────────────────────────────────────────── */
      default:
        return (
          <div className="flex flex-col h-full -mx-5 -mt-5" dir={rtl ? 'rtl' : 'ltr'}>
            <div className="relative h-[36vh] flex-shrink-0 overflow-hidden" style={{ borderRadius: '0 0 36px 36px' }}>
              <img src={GOAL_CONFIG[goal]?.photo || PHOTO('summary')} alt="" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0 -z-10" style={{ background: GOAL_CONFIG[goal]?.gradient || 'linear-gradient(135deg,#0a0a0f,#1a0a00)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,14,0.3) 0%, rgba(8,8,14,0.95) 100%)' }} />
              <div className="absolute bottom-6 left-5 right-5">
                <div className="flex items-center gap-3 mb-2">
                  <CalixOrb size={36} />
                  <div>
                    <p className="text-[10px] font-black tracking-widest uppercase text-cali-orange">Calix</p>
                    <p className="text-white font-black text-xl leading-tight">{tr('summary_ready')}{name ? `, ${name}` : ''} !</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 px-5 pt-5 pb-4 space-y-3 overflow-y-auto">
              <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {[
                  [tr('summary_goal'), GOAL_CONFIG[goal]?.label],
                  [tr('summary_program'), `${programDuration} · ${sessionsPerWeek}×`],
                  [tr('summary_level'), tr(`lvl_${level}` as Parameters<typeof t>[1])],
                  [tr('summary_weight'), `${weight} kg → ${targetWeight} kg (${height} cm)`],
                  [tr('summary_injuries'), noInjury ? tr('summary_none') : injuries.map(i => INJURY_OPTIONS.find(o => o.id === i)?.id).filter(Boolean).map(id => tr(`injury_${id}` as Parameters<typeof t>[1])).join(', ')],
                  [tr('summary_nutrition'), dietaryPrefs.length === 0 ? tr('summary_standard') : dietaryPrefs.map(d => tr(`diet_${d}` as Parameters<typeof t>[1])).join(', ')],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-0.5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                    <span className="text-xs font-semibold text-right max-w-[58%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,45,85,0.08) 100%)', border: '1px solid rgba(255,107,53,0.25)' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF6B35,#FF2D55)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{tr('summary_premium')}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{tr('summary_premium_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const isLastStep = step === TOTAL_STEPS;
  const progress = step / TOTAL_STEPS;
  // Step 2 (Calix video) handles its own full-screen UI + navigation
  if (step === 2) return renderStep();

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>

      {/* Progress bar — hidden on language screen (step 0) */}
      {step > 0 && (
        <div className="px-5 pt-5 pb-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setStep(step - 1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'var(--overlay-card)', border: '1px solid var(--border)' }}>
            <ChevronLeft size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg,#FF2D55,#FF6B35)' }} />
          </div>
          <span className="text-[11px] font-semibold w-8 text-right" style={{ color: 'var(--text-tertiary)' }}>{step}/{TOTAL_STEPS}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4" style={{ minHeight: 0 }}>
        {renderStep()}
      </div>

      {/* CTA button */}
      <div className="px-5 pt-2 flex-shrink-0">
        {!isLastStep ? (
          <button onClick={handleNext} disabled={!canNext() || authLoading}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={canNext() && !authLoading
              ? { background: 'linear-gradient(135deg,#FF6B35,#FF2D55)', color: '#fff', boxShadow: '0 6px 28px rgba(255,107,53,0.45)' }
              : { background: 'var(--overlay-card)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
            {authLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{tr('connecting')}</span>
              </>
            ) : step === 3 ? (
              <>{isLogin ? tr('auth_login_btn') : tr('auth_register_btn')} <ChevronRight size={18} /></>
            ) : (
              <>{tr('continue')} <ChevronRight size={18} /></>
            )}
          </button>
        ) : (
          <button onClick={handleFinish}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FF2D55)', color: '#fff', boxShadow: '0 6px 28px rgba(255,107,53,0.45)' }}>
            <Sparkles size={18} /> {tr('summary_start')}
          </button>
        )}
      </div>
    </div>
  );
}
