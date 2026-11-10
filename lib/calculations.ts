import type { Exercise, InjuryZone, Difficulty, ExerciseCategory } from './exerciseLibrary';
import { exercises, getAdaptedExercise, getExercisesByCategory } from './exerciseLibrary';
import type { SessionMode, CyclePhase, Goal, FeedbackLevel } from './userStore';

// ─── Daily Score ───
export function calculateDailyScore(
  sleepScore: number,
  nutritionScore: number,
  trainingScore: number,
  hydrationScore: number
): number {
  return Math.round(
    sleepScore * 0.30 +
    nutritionScore * 0.30 +
    trainingScore * 0.25 +
    hydrationScore * 0.15
  );
}

export function getDayMode(score: number): string {
  if (score >= 85) return '🔥 Performance';
  if (score >= 70) return '⚡ Équilibre';
  if (score >= 55) return '🌱 Récupération';
  if (score >= 40) return '💤 Recharge';
  return '😴 Repos';
}

// ─── BMI & TDEE ───
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

export function calculateTDEE(weight: number, height: number, age: number, gender: string, activityLevel: number): number {
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

// ─── Session Generation ───
interface SessionConfig {
  level: Difficulty;
  goal: Goal;
  injuries: InjuryZone[];
  mode: SessionMode;
  cyclePhase?: CyclePhase;
  sleepScore: number;
  lastFeedback?: FeedbackLevel;
  previousExerciseIds?: string[];
  limitations?: string[];
  chronicPain?: string[];
  expressDuration?: 5 | 10 | 15;
  gender?: string;
  weight?: number;
  age?: number;
}

export interface GeneratedSession {
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
  totalDuration: number;
  intensityMultiplier: number;
  calixMessage: string;
  adaptationMessages: string[];
}

export function generateSession(configIn: SessionConfig): GeneratedSession {
  let config = { ...configIn, injuries: [...configIn.injuries] };

  let mainCount = 8;
  let intensityMult = 1.0;
  let warmupCount = 3;
  let cooldownCount = 3;
  let calixMsg = '💪 Séance complète prête ! Donne tout.';
  const adaptationMessages: string[] = [];

  // ─── Injury-specific adaptations ───
  const injuryLabels: Record<string, string> = {
    knee: 'genou', back: 'dos', shoulder: 'épaule', wrist: 'poignet',
    hip: 'hanche', ankle: 'cheville', neck: 'nuque',
  };
  // Preposition varies by gender/vowel: "au genou", "à l'épaule", "à la nuque"
  const injuryPrep: Record<string, string> = {
    knee: 'au genou', back: 'au dos', shoulder: "à l'épaule",
    wrist: 'au poignet', hip: 'à la hanche', ankle: 'à la cheville', neck: 'à la nuque',
  };
  if (config.injuries.length > 0) {
    const zones = config.injuries.map(i => injuryPrep[i] || `au ${injuryLabels[i] || i}`).join(', ');
    adaptationMessages.push(`🩹 J'ai bien noté ta douleur ${zones}. J'ai retiré tous les exercices qui sollicitent cette zone et je les ai remplacés par des alternatives sûres.`);
    intensityMult *= 0.9;
  }

  // ─── Limitation-specific adaptations ───
  if (config.limitations && config.limitations.length > 0) {
    if (config.limitations.includes('Grossesse')) {
      mainCount = Math.min(mainCount, 4);
      intensityMult *= 0.5;
      adaptationMessages.push('🤰 Séance spécialement adaptée pour la grossesse : pas de mouvements sur le ventre, intensité douce, focus sur la mobilité et le renforcement léger.');
    }
    if (config.limitations.includes('Problème cardiaque')) {
      intensityMult *= 0.6;
      adaptationMessages.push('❤️ J\'ai réduit l\'intensité cardio pour protéger ton cœur. On privilégie des exercices calmes et contrôlés.');
    }
    if (config.limitations.includes('Asthme')) {
      adaptationMessages.push('🫁 Séance adaptée pour l\'asthme : pas de cardio intense prolongé, des pauses plus longues entre les exercices.');
    }
    if (config.limitations.includes('Mobilité réduite')) {
      mainCount = Math.min(mainCount, 5);
      adaptationMessages.push('♿ J\'ai sélectionné des exercices adaptés à ta mobilité. Chaque mouvement peut être modifié selon ton confort.');
    }
    if (config.limitations.includes('Post-opération')) {
      intensityMult *= 0.5;
      mainCount = Math.min(mainCount, 4);
      adaptationMessages.push('🏥 Reprise progressive post-opération. On y va très doucement, le plus important c\'est de bouger sans forcer.');
    }
    if (config.limitations.includes('Obésité')) {
      adaptationMessages.push('💪 J\'ai choisi des exercices à faible impact articulaire pour protéger tes articulations tout en brûlant des calories.');
    }
    if (config.limitations.includes('Arthrose')) {
      intensityMult *= 0.8;
      adaptationMessages.push('🦴 Exercices doux pour tes articulations. Pas de sauts, pas d\'impacts. On renforce en douceur.');
    }
    if (config.limitations.includes('Vertiges fréquents')) {
      adaptationMessages.push('🌀 Pas de changements de position brusques. On évite les exercices au sol qui nécessitent de se relever vite.');
    }
  }

  // ─── Chronic pain adaptations ───
  if (config.chronicPain && config.chronicPain.length > 0) {
    const painMsg = config.chronicPain.join(', ');
    adaptationMessages.push(`🩺 Douleurs chroniques prises en compte : ${painMsg}. Les exercices sont adaptés pour ne pas aggraver ces zones.`);
    intensityMult *= 0.85;

    // Map chronic pain to injury zones for exercise filtering
    const painToInjury: Record<string, InjuryZone[]> = {
      'Douleur genou chronique': ['knee'],
      'Lombalgie': ['back'],
      'Sciatique': ['back', 'hip'],
      'Tendinite épaule': ['shoulder'],
      'Canal carpien': ['wrist'],
      'Douleur cervicale': ['neck'],
      'Douleur hanche': ['hip'],
      'Fasciite plantaire': ['ankle'],
    };
    const extraInjuries: InjuryZone[] = [];
    for (const pain of config.chronicPain ?? []) {
      const zones = painToInjury[pain];
      if (zones) {
        for (const z of zones) {
          if (!config.injuries.includes(z as InjuryZone) && !extraInjuries.includes(z as InjuryZone)) extraInjuries.push(z as InjuryZone);
        }
      }
    }
    // Do NOT mutate config.injuries (it's a reference to the store array)
    config = { ...config, injuries: [...config.injuries, ...extraInjuries] };
    if ((config.chronicPain ?? []).includes('Lombalgie') || (config.chronicPain ?? []).includes('Sciatique')) {
      adaptationMessages.push('🔙 Lombalgie/Sciatique : pas de flexion avant, pas de crunch, mouvements doux pour le dos.');
    }
  }

  // Mode adjustments
  switch (config.mode) {
    case 'voyage':
      mainCount = 5;
      calixMsg = '✈️ Séance adaptée voyage — pas besoin d\'équipement.';
      break;
    case 'fatigue':
      mainCount = 4;
      intensityMult = 0.6;
      calixMsg = '😴 Mode fatigue activé. On y va doucement aujourd\'hui.';
      break;
    case 'express': {
      const dur = config.expressDuration ?? 15;
      mainCount = dur === 5 ? 3 : dur === 10 ? 4 : 5;
      // No warmup/cooldown for 5 min; minimal for 10/15 min
      warmupCount = dur === 5 ? 0 : dur === 10 ? 1 : 2;
      cooldownCount = dur === 5 ? 0 : dur === 10 ? 1 : 2;
      calixMsg = `⚡ Séance express ${dur} min — HIIT pur, intensité maximale !`;
      break;
    }
    case 'cycle':
      if (config.cyclePhase === 'menstrual') {
        mainCount = 3;
        intensityMult = 0.5;
        calixMsg = '🌸 Phase menstruelle — douceur et mobilité. Reps réduites, pas d\'impacts.';
      } else if (config.cyclePhase === 'luteal') {
        mainCount = 5;
        intensityMult = 0.7;
        calixMsg = '🌸 Phase lutéale — on modère l\'intensité. Reps allégées.';
      } else if (config.cyclePhase === 'ovulation') {
        mainCount = 8;
        intensityMult = 1.1;
        calixMsg = '🌸 Ovulation — pic de performance ! On en profite.';
      } else {
        calixMsg = '🌸 Phase folliculaire — énergie montante, on pousse !';
      }
      break;
  }

  // Age 50+ adaptation
  if (config.age && config.age >= 50) {
    intensityMult *= 0.9;
    adaptationMessages.push('🦴 Programme adapté 50+ : mouvements contrôlés, récupération prolongée entre les séries.');
  }

  // Sleep adjustment
  if (config.sleepScore < 55) {
    intensityMult *= 0.7;
    mainCount = Math.max(3, mainCount - 2);
    calixMsg = '⚠️ Sommeil insuffisant. Séance allégée pour protéger ta récupération.';
  }

  // Feedback adjustment
  if (config.lastFeedback === 'hard') {
    intensityMult *= 0.85;
    calixMsg = '🎯 La dernière était dure. On ajuste pour aujourd\'hui.';
  } else if (config.lastFeedback === 'easy') {
    intensityMult *= 1.1;
    calixMsg = '🔥 La dernière était facile ? On monte d\'un cran !';
  }

  // Warmup and cooldown built after mode switch (express controls counts)
  const warmup = getExercisesByCategory('warmup')
    .filter(e => !e.injuryContraindications.some(z => config.injuries.includes(z)))
    .slice(0, warmupCount);

  // Select main exercises
  const difficultyMap: Record<Difficulty, Difficulty[]> = {
    beginner: ['beginner'],
    intermediate: ['beginner', 'intermediate'],
    advanced: ['beginner', 'intermediate', 'advanced'],
  };

  const goalPriority: Record<Goal, ExerciseCategory[]> = {
    weight_loss: ['cardio', 'legs', 'core', 'upper'],
    muscle: ['upper', 'legs', 'core', 'back_stability'],
    endurance: ['cardio', 'legs', 'core', 'upper'],
    health: ['legs', 'upper', 'core', 'cardio'],
  };

  // Cycle phases override exercise priority toward gentler categories
  const cyclePriority: Partial<Record<string, ExerciseCategory[]>> = {
    menstrual: ['back_stability', 'core', 'legs'],
    luteal: ['core', 'legs', 'back_stability', 'upper'],
  };

  let priorities: ExerciseCategory[] = goalPriority[config.goal];
  if (config.mode === 'cycle' && config.cyclePhase && cyclePriority[config.cyclePhase]) {
    priorities = cyclePriority[config.cyclePhase]!;
  }

  const highImpactIds = ['jumping_jacks', 'burpee', 'jump_squat', 'box_jump', 'high_knees', 'mountain_climber'];
  const isCycleLowIntensity = config.mode === 'cycle' && (config.cyclePhase === 'menstrual' || config.cyclePhase === 'luteal');
  // Menstrual: also exclude all cardio category (too intense)
  const excludeCardio = config.mode === 'cycle' && config.cyclePhase === 'menstrual';

  let pool = exercises
    .filter(e =>
      e.category !== 'warmup' &&
      e.category !== 'cooldown' &&
      difficultyMap[config.level].includes(e.difficulty) &&
      !(isCycleLowIntensity && highImpactIds.includes(e.id)) &&
      !(excludeCardio && e.category === 'cardio')
    )
    .map(e => getAdaptedExercise(e, config.injuries))
    .filter((e, i, arr) => arr.findIndex(x => x.id === e.id) === i);

  // Anti-repetition: move categories from last session to the back of priorities
  if (config.previousExerciseIds && config.previousExerciseIds.length > 0) {
    const prevIds = new Set(config.previousExerciseIds);
    const prevCats = new Set(
      exercises.filter(e => prevIds.has(e.id)).map(e => e.category)
    );
    // Fresh categories first, recently worked categories last
    priorities = [
      ...priorities.filter(p => !prevCats.has(p)),
      ...priorities.filter(p => prevCats.has(p)),
    ];
  }

  // Shuffle within each priority group so same-category exercises rotate each session
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  shuffled.sort((a, b) => {
    const aIdx = priorities.indexOf(a.category as ExerciseCategory);
    const bIdx = priorities.indexOf(b.category as ExerciseCategory);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });
  pool = shuffled;

  // Avoid repeating previous session
  if (config.previousExerciseIds && config.previousExerciseIds.length > 0) {
    const prev = new Set(config.previousExerciseIds);
    pool.sort((a, b) => {
      const aWas = prev.has(a.id) ? 1 : 0;
      const bWas = prev.has(b.id) ? 1 : 0;
      return aWas - bWas;
    });
  }

  const rawMain = pool.slice(0, mainCount);
  const cooldown = getExercisesByCategory('cooldown').slice(0, cooldownCount);

  // ─── Express mode: adapt exercises so session EXACTLY matches chosen duration ───
  let main = rawMain;
  if (config.mode === 'express' && config.expressDuration) {
    const dur = config.expressDuration;
    // Warmup/cooldown time in seconds (each exercise is 30s)
    const warmupSec = warmupCount * 30;
    const cooldownSec = cooldownCount * 30;
    const mainBudget = dur * 60 - warmupSec - cooldownSec;
    const perExercise = Math.floor(mainBudget / rawMain.length);

    // Sets, rest, and duration per set calculated to fill perExercise seconds exactly
    let sets: number, rest: number;
    if (dur === 5)       { sets = 2; rest = 20; }
    else if (dur === 10) { sets = 2; rest = 45; }
    else                 { sets = 3; rest = 18; }

    const secPerSet = Math.max(20, Math.floor((perExercise - rest * (sets - 1)) / sets));

    main = rawMain.map(e => ({
      ...e,
      isTimeBased: true,
      defaultDuration: secPerSet,
      defaultSets: sets,
      restBetweenSets: rest,
    }));
  }

  // Compute real total duration from exercise timings
  let totalDuration = 0;
  warmup.forEach(e => { totalDuration += e.defaultDuration; });
  main.forEach(e => {
    const setDuration = e.isTimeBased ? e.defaultDuration : e.defaultDuration * 4;
    totalDuration += (setDuration * e.defaultSets) + (e.restBetweenSets * (e.defaultSets - 1));
  });
  cooldown.forEach(e => { totalDuration += e.defaultDuration; });
  totalDuration = Math.round((totalDuration * (config.mode === 'express' ? 1 : intensityMult)) / 60);

  return {
    warmup,
    main,
    cooldown,
    totalDuration,
    intensityMultiplier: Math.round(intensityMult * 100) / 100,
    calixMessage: calixMsg,
    adaptationMessages,
  };
}

// ─── Calories Estimation ───
export function estimateCalories(exercises: Exercise[], durationMin: number, weight: number): number {
  // Only use main exercises (exclude near-zero cooldown exercises)
  const mainEx = exercises.filter(e => e.category !== 'warmup' && e.category !== 'cooldown');
  const pool = mainEx.length > 0 ? mainEx : exercises;
  const avgCalPerMin = pool.reduce((s, e) => s + e.caloriesPerMin, 0) / pool.length;
  return Math.round(avgCalPerMin * durationMin * (weight / 70));
}
