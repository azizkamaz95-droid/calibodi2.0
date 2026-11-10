'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { initUserTrial } from '@/lib/firebaseUserService';
import { useUserStore } from '@/lib/userStore';
import { useFreemiumStore } from '@/lib/freemiumStore';
import { useHydrationStore } from '@/lib/hydrationStore';
import { useNutritionStore } from '@/lib/nutritionStore';
import type { Gender, Goal, DietaryPref } from '@/lib/userStore';
import type { Difficulty, InjuryZone } from '@/lib/exerciseLibrary';
import { ChevronLeft, ChevronRight, Sparkles, User, Target, Ruler, BarChart3, HeartPulse, Check, Mail, Lock, Eye, EyeOff, Calendar, Utensils, PenLine } from 'lucide-react';
import { openExternalLink } from '@/lib/openExternalLink';

const RESEND_FUNCTION_URL = 'https://calibodi-v2.netlify.app/.netlify/functions/send-verification-email';

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

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useUserStore((s) => s.updateProfile);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const startTrial = useFreemiumStore((s) => s.startTrial);
  const setBaseGoal = useHydrationStore((s) => s.setBaseGoal);
  const setDailyGoals = useNutritionStore((s) => s.setDailyGoals);

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
  const [waitingVerification, setWaitingVerification] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  const totalSteps = 10;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleInjury = (z: InjuryZone) => { setNoInjury(false); setInjuries(p => p.includes(z) ? p.filter(x => x !== z) : [...p, z]); };
  const toggleLimitation = (l: string) => setLimitations(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleChronicPain = (c: string) => setChronicPain(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleDiet = (d: DietaryPref) => setDietaryPrefs(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const toggleAllergy = (a: string) => setAllergies(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError('');
    try {
      // skipNativeAuth: true → plugin fait le Google Sign-In natif (sélecteur de comptes)
      // mais retourne l'idToken au lieu de signer en natif Firebase
      // On utilise ensuite le SDK web Firebase (signInWithCredential) → zéro permission-denied
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
      await initUserTrial(uid);
      if (userEmail.toLowerCase() === 'azizkamaz95@gmail.com') {
        useFreemiumStore.getState().setPremium('annual_once');
      }
      setStep(2);
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
          setStep(2);
        } else if (!loginCred.user.emailVerified) {
          await sendEmailVerification(loginCred.user).catch(() => {});
          setWaitingVerification(true);
        } else {
          setStep(2);
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const resendOk = await fetch(RESEND_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cred.user.email, uid: cred.user.uid }),
        }).then(r => r.ok).catch(() => false);
        if (!resendOk) {
          await sendEmailVerification(cred.user).catch(() => {});
        }
        await initUserTrial(cred.user.uid);
        if (email.toLowerCase() === 'azizkamaz95@gmail.com') {
          useFreemiumStore.getState().setPremium('annual_once');
          setStep(2);
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
    if (email.toLowerCase() === 'azizkamaz95@gmail.com') {
      useFreemiumStore.getState().setPremium('annual_once');
    }
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  const canNext = () => {
    switch (step) {
      case 1: return email.includes('@') && password.length >= 6;
      case 2: return name.trim().length > 0;
      case 7: return injuries.length > 0 || noInjury;
      default: return true;
    }
  };

  const handleNext = () => { if (step === 1) handleAuth(); else setStep(step + 1); };

  const Btn = ({ sel, onClick, children }: { sel: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`p-3 rounded-2xl text-left transition-all flex items-center gap-2 text-xs font-medium ${sel ? 'bg-cali-orange/15 border border-cali-orange/40 text-cali-orange' : 'bg-cali-surface border border-white/5 text-gray-400'}`}>{children}</button>
  );

  const handleForgotPassword = async () => {
    if (!email.includes('@')) { setAuthError('Entre ton email d\'abord.'); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthError('');
      alert('Un email de réinitialisation a été envoyé à ' + email);
    } catch { setAuthError('Impossible d\'envoyer l\'email. Vérifie l\'adresse.'); }
  };

  const DrumRoll = ({ value, onChange, min, max, unit, label }: { value: number; onChange: (v: number) => void; min: number; max: number; unit: string; label: string }) => {
    const ITEM_H = 48;
    const VISIBLE = 5;
    const ref = useRef<HTMLDivElement>(null);
    // useMemo évite de recréer le tableau à chaque render → l'effet scroll ne retourne pas inutilement
    const items = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => i + min), [min, max]);
    const lastSnapped = useRef<number>(value);
    const hapticsRef = useRef<any>(null);
    const isSettlingRef = useRef(false); // useRef = persiste entre les re-renders, contrairement à une variable locale
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
        // Remettre le snap CSS après l'arrêt
        el.style.scrollSnapType = 'y mandatory';
        const idx = Math.round(el.scrollTop / ITEM_H);
        const clamped = Math.max(0, Math.min(items.length - 1, idx));
        // Marquer qu'on fait un scroll programmatique → ignorer les scroll events qu'il génère
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
        if (isSettlingRef.current) return; // ignore les scroll events générés par notre propre scrollTo
        // Enlever le snap pendant le scroll → défilement libre et rapide
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
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="relative">
          <div
            ref={ref}
            className="overflow-y-scroll"
            style={{ height: ITEM_H * VISIBLE, scrollSnapType: 'y mandatory', overscrollBehaviorY: 'contain', overflowX: 'hidden', touchAction: 'pan-y', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            <div style={{ height: ITEM_H * 2 }} />
            {items.map(v => (
              <div
                key={v}
                style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
                className={`flex items-center justify-center font-display font-bold ${v === displayValue ? 'text-white text-2xl scale-110' : 'text-gray-600 text-sm'}`}
              >
                {v}
              </div>
            ))}
            <div style={{ height: ITEM_H * 2 }} />
          </div>
          <div className="absolute left-0 right-0 pointer-events-none" style={{ top: ITEM_H * 2, height: ITEM_H, borderTop: '1.5px solid rgba(255,107,53,0.4)', borderBottom: '1.5px solid rgba(255,107,53,0.4)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.9) 0%, transparent 35%, transparent 65%, rgba(10,10,15,0.9) 100%)' }} />
        </div>
        <span className="text-xs text-cali-orange font-bold">{unit}</span>
      </div>
    );
  };

  const steps = [
    // 0: Welcome
    <div key="0" className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
      {/* Smartphone illustration */}
      <div className="relative w-36 h-56 mb-6">
        <div className="absolute inset-0 rounded-[1.8rem] border-2 border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f18] shadow-[0_0_50px_rgba(255,107,53,0.15),0_0_25px_rgba(255,45,85,0.1)]">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-cali-dark rounded-full" />
          <div className="absolute top-7 left-2.5 right-2.5 bottom-5 rounded-lg overflow-hidden bg-cali-dark/80">
            <div className="p-1.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-1.5 rounded bg-gradient-to-r from-cali-red to-cali-orange" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cali-orange to-cali-red" />
              </div>
              <div className="flex justify-center py-0.5">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                  <circle cx="20" cy="20" r="15" fill="none" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="25" style={{transform:'rotate(-90deg)',transformOrigin:'center'}} />
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF2D55"/><stop offset="100%" stopColor="#FF6B35"/></linearGradient></defs>
                  <text x="20" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">87</text>
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-5 rounded bg-cali-orange/10 border border-cali-orange/20 flex items-center justify-center"><span className="text-[5px] text-cali-orange font-bold">💪 Training</span></div>
                <div className="h-5 rounded bg-cali-green/10 border border-cali-green/20 flex items-center justify-center"><span className="text-[5px] text-cali-green font-bold">🥗 Nutrition</span></div>
                <div className="h-5 rounded bg-cali-blue/10 border border-cali-blue/20 flex items-center justify-center"><span className="text-[5px] text-cali-blue font-bold">💧 Eau</span></div>
                <div className="h-5 rounded bg-cali-purple/10 border border-cali-purple/20 flex items-center justify-center"><span className="text-[5px] text-cali-purple font-bold">🌙 Sommeil</span></div>
              </div>
              <div className="h-3 rounded bg-gradient-to-r from-cali-red/20 to-cali-orange/20 border border-white/5" />
            </div>
          </div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white/20" />
        </div>
        <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cali-red/15 via-cali-orange/10 to-transparent blur-xl -z-10 animate-pulse-glow" />
      </div>
      <h1 className="text-4xl font-display font-black bg-gradient-to-r from-cali-red to-cali-orange bg-clip-text text-transparent mb-3">CaliBodi</h1>
      <p className="text-cali-light-text text-sm">Ton corps change chaque jour.<br/>Ton coaching aussi.</p>
    </div>,

    // 1: Auth
    <div key="1" className="space-y-5 animate-fade-in">
      <div className="text-center"><Mail size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">{isLogin ? 'Connexion' : 'Crée ton compte'}</h2></div>
      <div className="space-y-3">
        <div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setAuthError(''); }} placeholder="ton@email.com"
            className="w-full bg-cali-surface border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-cali-orange focus:outline-none" autoFocus /></div>
        <div className="relative"><Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }} placeholder="Mot de passe (6 car. min)"
            className="w-full bg-cali-surface border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-white text-sm focus:border-cali-orange focus:outline-none" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
      </div>
      {authError && <div className="bg-cali-red/10 border border-cali-red/20 rounded-xl p-3 text-center"><p className="text-xs text-cali-red">{authError}</p></div>}
      <div className="flex justify-between">
        <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} className="text-xs text-cali-orange">{isLogin ? 'Pas de compte ? Inscris-toi' : 'Déjà un compte ? Connecte-toi'}</button>
        {isLogin && <button onClick={handleForgotPassword} className="text-xs text-gray-500">Mot de passe oublié ?</button>}
      </div>
      <div className="flex items-center gap-3 my-1"><div className="flex-1 h-px bg-white/10"/><span className="text-[10px] text-gray-600">ou</span><div className="flex-1 h-px bg-white/10"/></div>
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-sm font-medium text-white active:opacity-70 transition-opacity"
      >
        {googleLoading ? (
          <span className="animate-pulse text-sm">Connexion...</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Continuer avec Google
          </>
        )}
      </button>
      <p className="text-[10px] text-gray-600 text-center leading-relaxed">
        En créant un compte, tu acceptes nos{' '}
        <button onClick={() => openExternalLink('https://calibodi.com/terms')} className="text-gray-500 underline underline-offset-2">Conditions d&apos;utilisation</button>
        {' '}et notre{' '}
        <button onClick={() => openExternalLink('https://calibodi.com/privacy')} className="text-gray-500 underline underline-offset-2">Politique de confidentialité</button>.
      </p>
    </div>,

    // 2: Identity
    <div key="2" className="space-y-6 animate-fade-in">
      <div className="text-center"><User size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Comment tu t&apos;appelles ?</h2></div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ton prénom"
        className="w-full bg-cali-surface border border-white/10 rounded-2xl px-4 py-3.5 text-white text-center text-lg font-medium focus:border-cali-orange focus:outline-none" autoFocus />
      <div><p className="text-sm text-gray-400 text-center mb-3">Genre</p>
        <div className="grid grid-cols-3 gap-2">
          {([['male','👨','Homme'],['female','👩','Femme'],['other','🧑','Autre']] as [Gender,string,string][]).map(([g,icon,label]) => (
            <button key={g} onClick={() => setGender(g)} className={`py-3 rounded-2xl text-sm font-medium transition-all ${gender===g?'bg-cali-orange/20 border border-cali-orange text-cali-orange':'bg-cali-surface border border-white/5 text-gray-400'}`}><span className="text-lg">{icon}</span><p className="text-xs mt-1">{label}</p></button>
          ))}
        </div></div>
      <div className="flex justify-center">
        <DrumRoll value={age} onChange={setAge} min={14} max={80} unit="ans" label="Âge" />
      </div>
    </div>,

    // 3: Goal
    <div key="3" className="space-y-4 animate-fade-in">
      <div className="text-center"><Target size={32} className="text-cali-green mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Ton objectif</h2></div>
      {([['weight_loss','🔥','Perte de poids','Brûler les graisses'],['muscle','💪','Prise de muscle','Renforcer ton corps'],['endurance','🏃','Endurance','Cardio et résistance'],['health','💚','Santé générale','Se sentir bien']] as [Goal,string,string,string][]).map(([g,icon,t,d]) => (
        <button key={g} onClick={() => setGoal(g)} className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 ${goal===g?'bg-cali-green/10 border border-cali-green/40':'bg-cali-surface border border-white/5'}`}>
          <span className="text-2xl">{icon}</span><div><p className="font-bold text-white text-sm">{t}</p><p className="text-xs text-gray-500">{d}</p></div>{goal===g&&<Check size={18} className="text-cali-green ml-auto"/>}</button>
      ))}
    </div>,

    // 4: Program Duration
    <div key="4" className="space-y-5 animate-fade-in">
      <div className="text-center"><Calendar size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Durée du programme</h2><p className="text-xs text-gray-500 mt-1">Tu recevras une lettre personnelle au jour 30</p></div>
      {([30,60,90] as const).map(d => (
        <button key={d} onClick={() => setProgramDuration(d)} className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 ${programDuration===d?'bg-cali-orange/10 border border-cali-orange/40':'bg-cali-surface border border-white/5'}`}>
          <span className="text-2xl">{d===30?'🎯':d===60?'🔥':'🏆'}</span><div><p className="font-bold text-white text-sm">{d} jours</p><p className="text-xs text-gray-500">{d===30?'Idéal pour démarrer':d===60?'Transformation visible':'Changement de vie'}</p></div>
          {programDuration===d&&<Check size={18} className="text-cali-orange ml-auto"/>}</button>
      ))}
    </div>,

    // 5: Body
    <div key="5" className="space-y-5 animate-fade-in">
      <div className="text-center"><Ruler size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Tes données</h2></div>
      <div className="bg-cali-surface rounded-2xl p-4">
        <div className="flex justify-around">
          <DrumRoll value={weight} onChange={setWeight} min={30} max={200} unit="kg" label="Poids actuel" />
          <div className="w-px bg-white/5" />
          <DrumRoll value={height} onChange={setHeight} min={120} max={220} unit="cm" label="Taille" />
          <div className="w-px bg-white/5" />
          <DrumRoll value={targetWeight} onChange={setTargetWeight} min={30} max={200} unit="kg" label="Poids objectif" />
        </div>
      </div>
      <div className="bg-cali-surface rounded-2xl p-4"><p className="text-sm text-gray-400 mb-2">Séances / semaine : {sessionsPerWeek}</p>
        <div className="flex gap-2">{[2,3,4,5,6].map(n=><button key={n} onClick={()=>setSessionsPerWeek(n)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${sessionsPerWeek===n?'bg-cali-orange text-white':'bg-cali-card text-gray-500'}`}>{n}x</button>)}</div></div>
    </div>,

    // 6: Level
    <div key="6" className="space-y-4 animate-fade-in">
      <div className="text-center"><BarChart3 size={32} className="text-cali-purple mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Ton niveau</h2></div>
      {([['beginner','🌱','Débutant','Peu d\'expérience'],['intermediate','⚡','Intermédiaire','Sport régulier'],['advanced','🔥','Avancé','Plus d\'un an']] as [Difficulty,string,string,string][]).map(([l,icon,t,d])=>(
        <button key={l} onClick={()=>setLevel(l)} className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 ${level===l?'bg-cali-purple/10 border border-cali-purple/40':'bg-cali-surface border border-white/5'}`}>
          <span className="text-2xl">{icon}</span><div><p className="font-bold text-white text-sm">{t}</p><p className="text-xs text-gray-500">{d}</p></div>{level===l&&<Check size={18} className="text-cali-purple ml-auto"/>}</button>
      ))}
    </div>,

    // 7: Injuries + Limitations + Chronic Pain
    <div key="7" className="space-y-4 animate-fade-in">
      <div className="text-center"><HeartPulse size={32} className="text-cali-red mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Ton corps</h2><p className="text-xs text-gray-500 mt-1">On adapte tout automatiquement</p></div>
      <p className="text-xs text-gray-400 font-bold">Blessures</p>
      <div className="grid grid-cols-2 gap-2">{INJURY_OPTIONS.map(o=><Btn key={o.id} sel={injuries.includes(o.id)} onClick={()=>toggleInjury(o.id)}><span>{o.icon}</span>{o.label}</Btn>)}</div>
      <button onClick={()=>{setNoInjury(true);setInjuries([])}} className={`w-full p-3 rounded-2xl text-center text-sm font-bold transition-all ${noInjury?'bg-cali-green text-white shadow-[0_0_12px_rgba(48,209,88,0.4)]':'bg-cali-surface border border-white/10 text-gray-300'}`}>
        {noInjury ? '✓ Je n\'ai aucune blessure' : 'Je n\'ai aucune blessure'}
      </button>
      <p className="text-xs text-gray-400 font-bold mt-3">Limitations physiques (optionnel)</p>
      <div className="grid grid-cols-2 gap-1.5">{ALL_LIMITATION_OPTIONS.filter(l => gender !== 'male' || l !== 'Grossesse').map(l=><Btn key={l} sel={limitations.includes(l)} onClick={()=>toggleLimitation(l)}>{l}</Btn>)}</div>
      <p className="text-xs text-gray-400 font-bold mt-3">Douleurs chroniques (optionnel)</p>
      <div className="grid grid-cols-2 gap-1.5">{CHRONIC_PAIN_OPTIONS.map(c=><Btn key={c} sel={chronicPain.includes(c)} onClick={()=>toggleChronicPain(c)}>{c}</Btn>)}</div>
    </div>,

    // 8: Dietary Preferences
    <div key="8" className="space-y-5 animate-fade-in">
      <div className="text-center"><Utensils size={32} className="text-cali-green mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Alimentation</h2><p className="text-xs text-gray-500 mt-1">Optionnel — on adapte les recettes</p></div>
      <div><p className="text-xs text-gray-400 font-bold mb-2">Régime alimentaire</p>
        <div className="grid grid-cols-2 gap-2">{DIET_OPTIONS.map(d=><Btn key={d.id} sel={dietaryPrefs.includes(d.id)} onClick={()=>toggleDiet(d.id)}><span>{d.icon}</span>{d.label}</Btn>)}</div></div>
      <div><p className="text-xs text-gray-400 font-bold mb-2">Allergies</p>
        <div className="flex flex-wrap gap-1.5">{ALLERGY_OPTIONS.map(a=>(
          <button key={a} onClick={()=>toggleAllergy(a)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium ${allergies.includes(a)?'bg-cali-red/15 border border-cali-red/40 text-cali-red':'bg-cali-surface border border-white/5 text-gray-500'}`}>{a}</button>
        ))}</div></div>
      <div className="bg-cali-orange/5 border border-cali-orange/20 rounded-2xl p-3"><p className="text-xs text-gray-400">💡 Tu pourras modifier ces préférences à tout moment dans ton profil.</p></div>
    </div>,

    // 9: Personal Letter
    <div key="9" className="space-y-5 animate-fade-in">
      <div className="text-center"><PenLine size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Lettre à toi-même</h2><p className="text-xs text-gray-500 mt-1">Écris un message que tu reliras au jour 30 de ton programme</p></div>
      <textarea value={personalLetter} onChange={e=>setPersonalLetter(e.target.value)} rows={6} placeholder="Cher(e) moi du futur, je commence ce programme parce que..."
        className="w-full bg-cali-surface border border-white/10 rounded-2xl px-4 py-3 text-white text-sm leading-relaxed focus:border-cali-orange/40 focus:outline-none resize-none" />
      <div className="bg-cali-orange/5 border border-cali-orange/20 rounded-2xl p-3 text-center">
        <p className="text-xs text-gray-400">🔒 Cette lettre sera verrouillée et débloquée au <span className="text-cali-orange font-bold">jour 30</span></p></div>
      <button onClick={()=>setStep(step+1)} className="text-xs text-gray-600 text-center w-full">Passer cette étape →</button>
    </div>,
  ];

  const summaryStep = (
    <div key="summary" className="space-y-4 animate-fade-in">
      <div className="text-center"><Sparkles size={32} className="text-cali-orange mx-auto mb-3" /><h2 className="text-xl font-display font-bold">Tout est prêt, {name} !</h2></div>
      <div className="bg-cali-surface rounded-2xl p-4 space-y-2.5">
        {[
          ['Email', email],
          ['Objectif', {weight_loss:'🔥 Perte de poids',muscle:'💪 Muscle',endurance:'🏃 Endurance',health:'💚 Santé'}[goal]],
          ['Programme', `${programDuration} jours`],
          ['Niveau', {beginner:'🌱 Débutant',intermediate:'⚡ Intermédiaire',advanced:'🔥 Avancé'}[level]],
          ['Poids', `${weight} kg → ${targetWeight} kg`],
          ['Séances', `${sessionsPerWeek}x / semaine`],
          ['Blessures', noInjury ? 'Aucune' : injuries.map(i => INJURY_OPTIONS.find(o=>o.id===i)?.label).join(', ')],
          ['Régime', dietaryPrefs.length === 0 ? 'Standard' : dietaryPrefs.map(d=>DIET_OPTIONS.find(o=>o.id===d)?.label).join(', ')],
          ['Lettre J30', personalLetter ? '✅ Écrite' : '—'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between"><span className="text-xs text-gray-500">{label}</span><span className="text-xs text-white font-medium text-right max-w-[60%] truncate">{value}</span></div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-cali-purple/10 to-cali-orange/10 border border-cali-purple/20 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-300">🎁 7 jours Premium gratuits inclus</p></div>
    </div>
  );

  const allSteps = [...steps, summaryStep];
  const isLastStep = step === allSteps.length - 1;

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      setWaitingVerification(false);
      setStep(2);
    } else {
      alert('Email pas encore vérifié. Clique sur le lien dans le mail.');
    }
    setCheckingVerification(false);
  };

  if (waitingVerification) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">📧</div>
        <h2 className="text-2xl font-display font-black text-white">Vérifie ton email</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          On a envoyé un lien de vérification à <span className="text-white font-bold">{email}</span>.{'\n'}
          Clique sur le lien dans le mail, puis reviens ici.
        </p>
        <p className="text-yellow-500/80 text-xs leading-relaxed">
          📌 Si tu ne vois pas le mail, vérifie ton dossier <span className="font-bold">spam / courrier indésirable</span>.
        </p>
        <button
          onClick={handleCheckVerification}
          disabled={checkingVerification}
          className="w-full py-4 rounded-2xl font-display font-bold text-sm bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white"
        >
          {checkingVerification ? 'Vérification...' : "J'ai vérifié mon email ✓"}
        </button>
        <button
          onClick={() => sendEmailVerification(auth.currentUser!).catch(() => {})}
          className="text-xs text-gray-500 underline"
        >
          Renvoyer le mail
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col p-5 pb-8">
      <div className="flex items-center gap-3 mb-8">
        {step > 0 && <button onClick={() => setStep(step === 2 ? 1 : step - 1)} className="text-gray-500 hover:text-white"><ChevronLeft size={24} /></button>}
        <div className="flex-1 h-1.5 bg-cali-surface rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange rounded-full transition-all duration-500" style={{width:`${progress}%`}}/></div>
        <span className="text-xs text-gray-500 w-10 text-right">{step+1}/{totalSteps}</span>
      </div>
      <div className="flex-1 overflow-y-auto">{allSteps[step]}</div>
      <div className="mt-6">
        {!isLastStep ? (
          <button onClick={handleNext} disabled={!canNext()||authLoading}
            className={`w-full py-4 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 ${canNext()&&!authLoading?'bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white glow-orange':'bg-cali-surface text-gray-600'}`}>
            {authLoading?<span className="animate-pulse">Connexion...</span>:step===1?<>{isLogin?'Se connecter':'Créer mon compte'} <ChevronRight size={18}/></>:<>Continuer <ChevronRight size={18}/></>}
          </button>
        ) : (
          <button onClick={handleFinish} className="w-full py-4 rounded-2xl font-display font-bold text-sm bg-gradient-to-r from-cali-red via-cali-orange to-cali-orange text-white glow-orange flex items-center justify-center gap-2 animate-pulse-glow">
            <Sparkles size={18}/> Commencer mon programme</button>
        )}
      </div>
    </div>
  );
}
