// ═══════════════════════════════════════════════════════════════
// CALIX VOICE ENGINE v7 — TTS natif uniquement, file d'attente
// Une seule voix cohérente, zéro chevauchement
// ═══════════════════════════════════════════════════════════════

let speechEnabled = true;
let isReady = false;
let TTS: any = null;
let femaleVoiceIndex: number | undefined = undefined; // index voix féminine (iOS)
let isIOS = false;

// ─── File d'attente ───────────────────────────────────────────
let speakChain: Promise<void> = Promise.resolve();
let queueSize = 0;

// ─── Session Context ──────────────────────────────────────────
interface CalixContext {
  name: string;
  gender: 'male' | 'female' | 'other';
  goal: 'weight_loss' | 'muscle' | 'endurance' | 'health';
  injuries: string[];
  limitations: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

let ctx: CalixContext = {
  name: '', gender: 'male', goal: 'health',
  injuries: [], limitations: [], level: 'beginner',
};

let exerciseIndex = 0;
let totalExercises = 0;
let phrasesUsed = new Set<string>();

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
// Noms de voix féminines françaises connues (iOS/Android Google TTS)
const FEMALE_VOICE_NAMES = ['audrey', 'marie', 'amélie', 'amelie', 'juliette', 'léa', 'lea', 'alice', 'claire', 'valeria'];

export async function initSpeech() {
  if (isReady || typeof window === 'undefined') return;
  isReady = true;
  isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  try {
    const mod = await import('@capacitor-community/text-to-speech');
    TTS = mod.TextToSpeech;
    // Cherche une voix féminine française FR (pas CA/BE) sur iOS
    if (isIOS) {
      try {
        const { voices } = await TTS.getSupportedVoices();
        // Priorité stricte : fr-FR uniquement
        const frFRVoices: Array<{ name: string; lang: string }> = voices.filter(
          (v: { lang: string }) => v.lang === 'fr-FR'
        );
        // Parmi les voix fr-FR, cherche une voix féminine connue
        const female = frFRVoices.find((v) =>
          FEMALE_VOICE_NAMES.some(n => v.name?.toLowerCase().includes(n))
        ) || frFRVoices[0]; // sinon première voix fr-FR disponible

        if (female) {
          const globalIdx = voices.findIndex((v: { name: string }) => v.name === female.name);
          if (globalIdx >= 0) femaleVoiceIndex = globalIdx;
        }
        // Si aucune voix fr-FR trouvée, ne pas forcer un index — iOS choisit mieux seul
      } catch {}
    }
  } catch {}
  // Pré-charge les voix Web Speech
  try { window.speechSynthesis?.getVoices(); } catch {}
}

export function setContext(c: CalixContext) {
  ctx = c; exerciseIndex = 0; phrasesUsed.clear();
}
export function setTotalExercises(n: number) { totalExercises = n; }
export function enableSpeech(e: boolean) { speechEnabled = e; }

// ═══════════════════════════════════════════════════════════════
// STOP — vide la queue et coupe le TTS en cours
// ─── Timer interne pour les cues de posture ──────────────────
let cueTimers: ReturnType<typeof setTimeout>[] = [];
let cueToken = 0; // incrémenté à chaque stopSpeaking — invalide les timers obsolètes

// ═══════════════════════════════════════════════════════════════
export async function stopSpeaking() {
  cueTimers.forEach(t => clearTimeout(t)); cueTimers = [];
  cueToken++;
  queueSize = 0;
  speakChain = Promise.resolve();
  try {
    if (TTS) {
      await TTS.stop();
      // iOS : latence bridge — attendre que l'audio soit vraiment coupé
      if (isIOS) await new Promise(r => setTimeout(r, 150));
    } else if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}

// ─── Enfile une phrase importante (toujours jouée) ────────────
function enqueue(fn: () => Promise<void>) {
  // Recrée une chain fraîche si queue vide — évite le bug Android
  // où .then() sur une Promise résolue il y a 10s+ ne trigger pas TTS
  if (queueSize === 0) speakChain = Promise.resolve();
  queueSize++;
  speakChain = speakChain.then(async () => {
    if (!speechEnabled) { queueSize = Math.max(0, queueSize - 1); return; }
    try { await fn(); } catch {}
    queueSize = Math.max(0, queueSize - 1);
  });
}

// ─── Enfile une phrase optionnelle (ignorée si queue occupée) ─
function enqueueOptional(fn: () => Promise<void>) {
  if (queueSize > 0) return;
  enqueue(fn);
}

// ─── Utilitaires ──────────────────────────────────────────────
function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique(pool: string[]): string {
  const available = pool.filter(p => !phrasesUsed.has(p));
  const chosen = pick(available.length > 0 ? available : pool);
  phrasesUsed.add(chosen);
  if (phrasesUsed.size > 60) phrasesUsed = new Set(Array.from(phrasesUsed).slice(25));
  return chosen;
}

// ─── TTS — plugin natif (Android/iOS) ou Web Speech ──────────
async function say(text: string, lang = 'fr-FR', rate = 0.92): Promise<void> {
  if (!speechEnabled || !text) return;
  try {
    if (TTS) {
      const params: Record<string, unknown> = {
        text, lang, rate,
        // iOS : voix féminine sélectionnée à l'init
        // Android : pitch 1.2 pour sonner féminin (pas de sélection de genre fiable)
        pitch: isIOS ? 1.0 : 1.2,
        volume: 1.0,
        category: 'playback',
      };
      // N'applique l'index de voix que pour le français — sur iOS, l'index override
      // le lang et ferait prononcer "Squat" avec une voix fr-FR → "ska"
      if (femaleVoiceIndex !== undefined && lang.startsWith('fr')) params.voice = femaleVoiceIndex;
      await TTS.speak(params);
    } else if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      await new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang; u.rate = rate; u.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        // Préférer une voix féminine
        const frVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
        const femaleWeb = frVoices.find(v =>
          FEMALE_VOICE_NAMES.some(n => v.name.toLowerCase().includes(n))
        ) || frVoices.find(v => v.name.toLowerCase().includes('female')) || frVoices[0];
        if (femaleWeb) u.voice = femaleWeb;
        u.pitch = femaleWeb ? 1.0 : 1.2; // Si pas de voix féminine, pitch plus haut
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
        setTimeout(resolve, 15000);
      });
    }
  } catch {}
}

// ─── Compatibilité ancienne API ───────────────────────────────
export async function speak(text: string, rate = 0.92) {
  await say(text, 'fr-FR', rate);
}

// ═══════════════════════════════════════════════════════════════
// NOM D'EXERCICE — phonétique française pour les termes anglais
// ═══════════════════════════════════════════════════════════════
// Sur iOS, garder la voix fr-FR et substituer la phonétique
// évite le changement de voix et donne une prononciation naturelle.
const IOS_PHONETICS: Record<string, string> = {
  // Squats — "squatte" confirmé ✓ pour squat seul
  // Le séparateur | déclenche deux appels TTS séparés → chaque mot prononcé indépendamment
  'squat':                  'squatte',
  'sumo squat':             'soumeau|squatte',           // soumeau=/sumo/ + squatte=/skwat/ séparés
  'pistol squat':           'pistol|squatte',
  'bulgarian split squat':  'boulgar|split|squatte',

  // Push-ups — "pousseupe" proche de push-up en voix française
  'push-up':                'pousseupe',
  'knee push-up':           'ni pousseupe',
  'wide push-up':           'ouaide pousseupe',
  'diamond push-up':        'diamonde pousseupe',
  'pike push-up':           'paike pousseupe',

  // Planche / plank
  'plank':                  'plank',
  'side plank':             'saide plank',

  // Autres mouvements
  'lunge':                  'lonnj',
  'glute bridge':           'gloute bridj',
  'wall sit':               'wol sit',
  'burpee':                 'beurpee',
  'mountain climber':       'maounteun claimeur',
  'jumping jacks':          'djomping djax',
  'high knees':             'haï niz',
  'bird dog':               'beurde dog',
  'leg raises':             'lèg rézeuz',
  'arm circles':            'arm seurkeulz',
  'hip circles':            'hip seurkeulz',

  // Superman / hollow body — le TTS français lit bien ces mots
  'superman':               'superman',
  'superman hold':          'superman hold',
  'hollow body':            'hollow body',
  'hollow body hold':       'hollow body hold',

  // Étirements
  'cobra stretch':          'cobra strètche',
  'hamstring stretch':      'hamstringue strètche',
};

function toPhoneticFR(name: string): string | null {
  return IOS_PHONETICS[name.toLowerCase()] ?? null;
}

// Estime la durée de parole en secondes (rate 0.9 ≈ 2.5 mots/s en français)
function estimateSpeechDuration(text: string, rate = 0.9): number {
  const words = text.trim().split(/\s+/).length;
  return words / (2.5 * rate);
}

// speakQuickName : dit le nom puis chaîne les instructions dans la même
// Promise (seul mécanisme fiable sur Android — pas de setTimeout séparé)
// exerciseDuration : durée totale de l'exercice en secondes (0 = pas de limite)
export async function speakQuickName(nameFr: string, instructions: string[] = [], exerciseDuration = 0) {
  await stopSpeaking();
  enqueue(async () => {
    const rate = 0.90;
    const startTime = Date.now();

    if (isIOS) {
      const phonetic = toPhoneticFR(nameFr);
      if (phonetic && phonetic.includes('|')) {
        // Plusieurs parties → appels TTS séparés pour garantir la prononciation de chaque mot
        const parts = phonetic.split('|');
        for (const part of parts) {
          await say(part.trim(), 'fr-FR', rate);
          await wait(80);
        }
      } else {
        await say(phonetic ?? nameFr, 'fr-FR', rate);
      }
    } else {
      // Android : changer de langue pour les noms anglais (fonctionne bien)
      const lang = IOS_PHONETICS[nameFr.toLowerCase()] !== undefined ? 'en-US' : 'fr-FR';
      await say(nameFr, lang, rate);
    }

    // say() attend la fin — pause 900ms puis on vérifie si le temps suffit
    // Règle : ne pas commencer une instruction si elle ne peut pas se terminer
    // avant les 5 dernières secondes (début du compte à rebours)
    const COUNTDOWN_BUFFER = 5; // secondes réservées au compte à rebours
    for (let i = 0; i < Math.min(instructions.length, 2); i++) {
      await wait(900);
      if (!speechEnabled) break;
      if (exerciseDuration > 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = exerciseDuration - elapsed;
        const needed = estimateSpeechDuration(instructions[i]) + 0.9; // +pause suivante
        if (remaining - needed < COUNTDOWN_BUFFER) break; // pas assez de temps
      }
      await say(instructions[i], 'fr-FR', 0.9);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// SESSION START — intro + prénom + objectif + blessures
// ═══════════════════════════════════════════════════════════════
export async function speakSessionStart(mode: string) {
  await stopSpeaking();
  exerciseIndex = 0;

  const goalPhrases: Record<string, string[]> = {
    weight_loss: [
      "C'est parti. Aujourd'hui on brûle, on transpire, on avance.",
      "Séance brûle-graisses. Chaque calorie compte.",
      "On attaque. Objectif : faire travailler ton métabolisme à fond.",
    ],
    muscle: [
      "C'est l'heure de construire. Chaque répétition sculpte ton corps.",
      "Séance renforcement. On cherche la qualité du mouvement.",
      "On y va. Contrôle chaque mouvement, ressens chaque muscle.",
    ],
    endurance: [
      "Séance endurance. On va chercher le souffle et la résistance.",
      "Aujourd'hui on repousse tes limites cardio.",
      "C'est parti. Rythme régulier, respiration contrôlée.",
    ],
    health: [
      "C'est parti. On prend soin de ton corps aujourd'hui.",
      "Une séance pour se sentir bien dans son corps.",
      "On y va en douceur mais avec détermination.",
    ],
  };

  const modePhrases: Record<string, string> = {
    voyage: "Séance adaptée, pas besoin de matériel.",
    fatigue: "On écoute ton corps aujourd'hui, pas de pression.",
    express: "Séance courte mais intense, chaque seconde compte.",
    cycle: "Séance adaptée à ta phase actuelle. On respecte ton rythme.",
  };

  // Await directement — pas de queue — pour que l'intro soit complète
  // avant que startExerciseAtIndex ne s'exécute et vide la queue
  const name = ctx.name ? ` ${ctx.name}` : '';
  await say(`Prêt${name} ?`, 'fr-FR', 0.9);
  await wait(400);
  await say(pick(goalPhrases[ctx.goal] || goalPhrases.health), 'fr-FR', 0.92);

  if (mode !== 'normal' && modePhrases[mode]) {
    await wait(300);
    await say(modePhrases[mode]);
  }

  if (ctx.limitations.includes('Grossesse')) {
    await say("Tous les exercices sont sécurisés pour toi. Pas de mouvement sur le ventre, que de la douceur.");
  } else if (ctx.injuries.length > 1) {
    await say("J'ai adapté la séance pour tes zones sensibles. Écoute ton corps, on ne force jamais sur la douleur.");
  } else if (ctx.injuries.length === 1) {
    const injuryPhrases: Record<string, string> = {
      knee:     "J'ai adapté la séance pour protéger ton genou. Si tu ressens la moindre douleur, arrête-toi.",
      back:     "J'ai adapté la séance pour protéger ton dos. Si tu ressens la moindre douleur, arrête-toi.",
      shoulder: "J'ai adapté la séance pour protéger ton épaule. Si tu ressens la moindre douleur, arrête-toi.",
      wrist:    "J'ai adapté la séance pour protéger ton poignet. Si tu ressens la moindre douleur, arrête-toi.",
      hip:      "J'ai adapté la séance pour protéger ta hanche. Si tu ressens la moindre douleur, arrête-toi.",
      ankle:    "J'ai adapté la séance pour protéger ta cheville. Si tu ressens la moindre douleur, arrête-toi.",
    };
    const phrase = injuryPhrases[ctx.injuries[0]];
    if (phrase) await say(phrase);
  }
}

// ═══════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════
export async function speakWarmupToMain() {
  await stopSpeaking();
  enqueue(() => say(pickUnique([
    "Bien. Maintenant on passe aux choses sérieuses.",
    "Échauffement terminé. Tes muscles sont prêts, on attaque le bloc principal.",
    "Parfait, le corps est prêt. On monte en intensité maintenant.",
    "Bien échauffé. C'est maintenant que ça commence vraiment.",
    "Les muscles sont chauds. On passe à l'entraînement.",
  ])));
}

export async function speakMainToCooldown() {
  await stopSpeaking();
  enqueue(() => say(pickUnique([
    "Le plus dur est fait. On termine avec quelques étirements pour bien récupérer.",
    "Excellent travail. Place au retour au calme, c'est aussi important que l'effort.",
    "Bravo, bloc principal terminé. On étire les muscles qui ont travaillé.",
    "La partie intense est finie. Prends le temps de t'étirer, ton corps en a besoin.",
  ])));
}

// ═══════════════════════════════════════════════════════════════
// ANNONCES DE SÉRIE
// ═══════════════════════════════════════════════════════════════
export async function speakSetAnnouncement(currentSet: number, totalSets: number) {
  await stopSpeaking();
  if (currentSet === totalSets) {
    enqueue(() => say("Dernière série."));
  } else {
    enqueue(() => say(pick(["Go.", "On enchaîne.", "C'est reparti."])));
  }
}

export function speakSetComplete(setsRemaining: number) {
  enqueue(async () => {
    if (setsRemaining === 1) await say("Encore une seule. Donne tout.");
    else if (setsRemaining > 1) await say(pick(["Bien. On continue.", "C'est bon. On enchaîne.", "Parfait."]));
    else await say(pick(["Exercice terminé.", "C'est fait. On passe au suivant.", "Terminé. Beau travail.", "Validé."]));
  });
}

// ═══════════════════════════════════════════════════════════════
// REPOS
// ═══════════════════════════════════════════════════════════════
export async function speakRestStart(restTime: number) {
  const progress = totalExercises > 0 ? exerciseIndex / totalExercises : 0;

  let phrases: string[];
  if (progress < 0.25) {
    phrases = [
      "Repos.", "Respire calmement.", "Pause. Secoue les bras, détends les épaules.",
      "Souffle.", "Bois de l'eau si tu en as besoin.",
    ];
  } else if (progress < 0.7) {
    phrases = [
      "Repos. Tu es sur la bonne voie.", "Pause bien méritée.",
      "Souffle un coup. La moitié est faite.", "Profite-en pour relâcher les tensions.",
      "Repos. Chaque exercice que tu termines te rapproche du résultat.",
    ];
  } else {
    phrases = [
      "Repos. La fin approche, tiens bon.", "Plus que quelques exercices.",
      "Dernière ligne droite.", "Souffle. Tu as presque fini, ne lâche rien.",
      "Le plus dur est derrière toi.",
    ];
  }
  enqueue(() => say(pickUnique(phrases)));
  return speakChain;
}

// ═══════════════════════════════════════════════════════════════
// INSTRUCTIONS D'EXERCICE
// Le timer est géré par le module (pas React) pour contourner le
// bug Android où .then() sur une Promise idle 10s+ ne trigger pas TTS.
// stopSpeaking() annule automatiquement le cue programmé.
// ═══════════════════════════════════════════════════════════════
const POSTURE_CUES: Record<string, string[]> = {
  pushup:                ["Corps bien gainé de la tête aux pieds.", "Descends la poitrine vers le sol, pas le ventre.", "Pousse fort en montant."],
  knee_pushup:           ["Genoux au sol, dos bien droit.", "Descends le buste vers le sol, remonte en poussant."],
  wide_pushup:           ["Mains plus larges que les épaules, accentue le travail des pectoraux."],
  diamond_pushup:        ["Mains rapprochées sous la poitrine, coudes près du corps."],
  pike_pushup:           ["Fesses en haut, plie les coudes pour descendre la tête vers le sol."],
  squat:                 ["Le poids sur les talons, pas sur les pointes.", "Imagine que tu t'assoies sur une chaise invisible.", "Poitrine haute, regard devant."],
  sumo_squat:            ["Pieds très écartés, pointes vers l'extérieur. Focus sur l'intérieur des cuisses."],
  lunge:                 ["Grand pas en avant, genou arrière vers le sol.", "Le buste reste vertical."],
  bulgarian_split_squat: ["Un pied sur le support, descends sur la jambe avant, genou aligné avec le pied."],
  pistol_squat:          ["Garde l'équilibre et le dos droit pendant toute la descente."],
  plank:                 ["Imagine une ligne droite de ta tête à tes talons.", "Respire, ne bloque pas."],
  side_plank:            ["Corps aligné, hanches décollées. Si ton épaule tire, passe sur le coude."],
  glute_bridge:          ["Pousse le bassin vers le plafond.", "Serre fort les fessiers en haut du mouvement.", "Redescends lentement."],
  burpee:                ["Mouvement fluide, pas saccadé. Contrôle l'atterrissage."],
  mountain_climber:      ["Les épaules restent au-dessus des mains. Hanches basses."],
  wall_sit:              ["Cuisses parallèles au sol, genoux à quatre-vingt-dix degrés.", "Respire calmement, ne retiens pas ton souffle."],
  hollow_body:           ["Ton dos est plaqué au sol comme une coque de bateau."],
  leg_raises:            ["Les jambes descendent ensemble, lentement. Garde le bas du dos plaqué."],
  jumping_jacks:         ["Les bras montent complètement au-dessus de la tête."],
  high_knees:            ["Les genoux montent à hauteur des hanches. Garde le dos droit."],
  arm_circles:           ["Bras tendus sur les côtés. Augmente progressivement l'amplitude."],
  hip_circles:           ["Mains sur les hanches, grands cercles fluides et contrôlés."],
  bird_dog:              ["À quatre pattes, dos plat. Tends le bras et la jambe opposés, maintiens deux secondes."],
  superman_hold:         ["Lève bras et jambes simultanément. Contracte les fessiers et le dos."],
};

// Lit toutes les instructions en séquence, espacées de 5s
// Timer géré par le module (pas React) — annulé par stopSpeaking()
export function schedulePostureCue(exerciseId: string, instructions: string[], startDelay = 5000) {
  cueTimers.forEach(t => clearTimeout(t)); cueTimers = [];
  // Instructions à lire : celles du POSTURE_CUES ou celles passées (affichées à l'écran)
  const cuePool = POSTURE_CUES[exerciseId];
  const texts = cuePool ? cuePool.slice(0, 2) : instructions.slice(0, 2);
  if (texts.length === 0) return;

  const myToken = cueToken;
  texts.forEach((text, i) => {
    const t = setTimeout(() => {
      if (cueToken !== myToken) return; // exercice changé entre-temps — ignorer
      speakChain = Promise.resolve();
      enqueue(() => say(text, 'fr-FR', 0.9));
    }, startDelay + i * 5000);
    cueTimers.push(t);
  });
}

// Alias pour compatibilité
export function speakPostureCue(exerciseId: string, instruction?: string) {
  schedulePostureCue(exerciseId, instruction ? [instruction] : [], 0);
}

// ═══════════════════════════════════════════════════════════════
// COUNTDOWN
// ═══════════════════════════════════════════════════════════════
export async function speakCountdown(seconds: number) {
  if (seconds === 5) enqueue(() => say("Cinq."));
  else if (seconds === 3) enqueue(() => say("Trois."));
  else if (seconds === 1) enqueue(() => say("Et un !"));
}

// ═══════════════════════════════════════════════════════════════
// MOTIVATION — optionnel
// ═══════════════════════════════════════════════════════════════
export function speakMotivation() {
  const general = [
    "Continue exactement comme ça.",
    "Chaque répétition construit la meilleure version de toi.",
    "La plupart des gens ont déjà abandonné. Pas toi.",
    "La discipline bat toujours la motivation.",
    "Ton futur toi te remercie pour cet effort.",
  ];
  const goalPhrases: Record<string, string[]> = {
    weight_loss: ["Ton métabolisme tourne à plein régime là.", "Chaque goutte de sueur est du gras qui s'en va.", "Continue, ton corps est en train de se transformer."],
    muscle:      ["Tes muscles grandissent en ce moment même.", "La brûlure que tu ressens, c'est la progression.", "Contrôle, tension, résultat."],
    endurance:   ["Ton cœur devient plus efficace à chaque séance.", "Tu repousses tes limites un peu plus loin.", "La résistance se construit dans l'inconfort."],
    health:      ["Tu fais le meilleur investissement possible : ta santé.", "Chaque mouvement est un cadeau pour ton corps.", "Tu te sentiras tellement bien après."],
  };
  const pool = [...general, ...(goalPhrases[ctx.goal] || [])];
  enqueueOptional(() => say(pickUnique(pool)));
}

// ═══════════════════════════════════════════════════════════════
// FIN DE SÉANCE
// ═══════════════════════════════════════════════════════════════
export async function speakSessionComplete(_durationMin: number, _calories: number) {
  await stopSpeaking();
  const name = ctx.name ? `, ${ctx.name}` : '';
  enqueue(async () => {
    await say(pick([
      `Séance terminée${name}. Tu peux être fier de toi.`,
      `C'est fini${name}. Chapeau.`,
      `Bravo${name}. Ton corps te remercie.`,
      "C'est ça la régularité.",
    ]));
  });
}

// ═══════════════════════════════════════════════════════════════
// AVERTISSEMENT BLESSURE — optionnel
// ═══════════════════════════════════════════════════════════════
export function speakInjuryWarning(exerciseId: string) {
  if (ctx.injuries.length === 0) return;
  const warnings: Record<string, Record<string, string>> = {
    squat:         { knee: "Fais attention à tes genoux. Ne descends pas trop bas si tu ressens une gêne." },
    lunge:         { knee: "Contrôle bien le mouvement pour protéger tes genoux." },
    pushup:        { wrist: "Si tes poignets te font mal, fais l'exercice sur les poings.", shoulder: "Ne descends pas trop bas pour protéger ton épaule." },
    knee_pushup:   { wrist: "Si tes poignets te font mal, fais l'exercice sur les poings." },
    plank:         { wrist: "Reste sur les avant-bras pour épargner tes poignets.", back: "Contracte les abdos pour protéger ton dos." },
    side_plank:    { shoulder: "Si ton épaule tire, fais la version sur le coude." },
    superman_hold: { back: "Lève doucement. Ne force pas sur le bas du dos." },
    wall_sit:      { knee: "Si la douleur au genou est trop forte, remonte un peu." },
    burpee:        { knee: "Contrôle l'atterrissage pour protéger tes genoux." },
    hollow_body:   { back: "Garde le bas du dos plaqué au sol." },
    leg_raises:    { back: "Si ton dos se cambre, plie légèrement les genoux." },
    jumping_jacks: { knee: "Si tes genoux sont sensibles, fais des pas latéraux à la place." },
    high_knees:    { knee: "Monte à ton rythme, sans forcer." },
  };
  const w = warnings[exerciseId];
  if (!w) return;
  for (const injury of ctx.injuries) {
    if (w[injury]) {
      enqueueOptional(() => say(w[injury]));
      return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// CONSEIL OBJECTIF — optionnel
// ═══════════════════════════════════════════════════════════════
export function speakGoalTip() {
  const tips: Record<string, string[]> = {
    weight_loss: ["Garde un rythme soutenu pour maximiser la dépense.", "Plus tu contrôles, plus tu brûles."],
    muscle:      ["Tempo lent à la descente, explosif à la montée.", "Contracte bien le muscle ciblé."],
    endurance:   ["Respire régulièrement.", "Trouve ton rythme et maintiens-le."],
    health:      ["Profite de chaque mouvement.", "Le plus important c'est d'être là."],
  };
  const pool = tips[ctx.goal];
  if (pool) enqueueOptional(() => say(pick(pool)));
}

// ═══════════════════════════════════════════════════════════════
// RÉPÉTITIONS RESTANTES
// ═══════════════════════════════════════════════════════════════
export async function speakRepsRemaining(remaining: number) {
  if (remaining === 3) enqueue(() => say("Plus que trois."));
  else if (remaining === 1) enqueue(() => say("Dernière !"));
}

// ═══════════════════════════════════════════════════════════════
// MESSAGE D'ADAPTATION (texte dynamique)
// ═══════════════════════════════════════════════════════════════
export async function speakAdaptationMessage(message: string) {
  const clean = message.replace(/[^a-zA-ZÀ-ÿ0-9\s.,;:!?''"()-]/g, '').trim();
  enqueue(() => say(clean, 'fr-FR', 0.88));
}
