import type { Handler } from '@netlify/functions';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export interface CalixContext {
  // Identité utilisateur
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  goal: 'weight_loss' | 'muscle' | 'endurance' | 'health';
  weight: number;
  targetWeight: number;
  level: string;
  streak: number;

  // Nutrition du jour
  nutrition: {
    kcalConsumed: number;
    kcalGoal: number;
    protein: number;
    proteinGoal: number;
    mealsToday: number;
  };

  // Fitness
  fitness: {
    lastSessionDate: string | null; // ISO date or null
    sessionsThisWeek: number;
    sessionsGoal: number;
    lastSessionDuration: number; // minutes
  };

  // Récupération
  recovery: {
    sleepScore: number;        // 0-100
    sleepHoursLast: number;    // dernière nuit
    hydrationPercent: number;  // 0-100
    hydrationMl: number;
  };

  // Message ou question de l'utilisateur (vide = message d'ouverture)
  userMessage: string;

  // Historique court (3 derniers échanges max)
  history: { role: 'user' | 'assistant'; content: string }[];

  // Moment de la journée
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

function buildSystemPrompt(ctx: CalixContext): string {
  const goalLabel = { weight_loss: 'perdre du poids', muscle: 'prendre du muscle', endurance: 'améliorer son endurance', health: 'améliorer sa santé' }[ctx.goal];
  const calDiff = ctx.nutrition.kcalConsumed - ctx.nutrition.kcalGoal;
  const calStatus = calDiff > 200 ? `en excès de ${calDiff} kcal` : calDiff < -300 ? `en déficit de ${Math.abs(calDiff)} kcal` : 'dans l\'objectif';
  const sleepQuality = ctx.recovery.sleepScore >= 80 ? 'excellente' : ctx.recovery.sleepScore >= 60 ? 'correcte' : 'insuffisante';
  const hydraStatus = ctx.recovery.hydrationPercent >= 80 ? 'bien hydraté(e)' : ctx.recovery.hydrationPercent >= 50 ? 'hydratation moyenne' : 'peu hydraté(e)';
  const daysSinceSession = ctx.fitness.lastSessionDate
    ? Math.floor((Date.now() - new Date(ctx.fitness.lastSessionDate).getTime()) / 86400000)
    : 99;

  return `Tu es Calix, le coach IA personnel de ${ctx.name}. Tu es l'unique interlocuteur — une seule voix, cohérente et bienveillante — mais tu maîtrises 4 domaines en profondeur : nutrition, fitness, récupération et motivation.

PROFIL DE ${ctx.name.toUpperCase()} :
- Objectif : ${goalLabel}
- ${ctx.gender === 'female' ? 'Femme' : ctx.gender === 'male' ? 'Homme' : 'Autre'}, ${ctx.age} ans, ${ctx.weight} kg → objectif ${ctx.targetWeight} kg
- Niveau : ${ctx.level} | Streak : ${ctx.streak} jours consécutifs
- Séances objectif : ${ctx.fitness.sessionsGoal}/semaine | Cette semaine : ${ctx.fitness.sessionsThisWeek}

DONNÉES DU JOUR (${ctx.timeOfDay === 'morning' ? 'matin' : ctx.timeOfDay === 'afternoon' ? 'après-midi' : ctx.timeOfDay === 'evening' ? 'soir' : 'nuit'}) :
🍽 NUTRITION : ${ctx.nutrition.kcalConsumed}/${ctx.nutrition.kcalGoal} kcal (${calStatus}) | Protéines : ${ctx.nutrition.protein}g/${ctx.nutrition.proteinGoal}g | ${ctx.nutrition.mealsToday} repas logués
💪 FITNESS : dernière séance ${daysSinceSession === 0 ? "aujourd'hui" : daysSinceSession === 1 ? 'hier' : `il y a ${daysSinceSession} jours`} (${ctx.fitness.lastSessionDuration} min)
😴 RÉCUPÉRATION : sommeil ${sleepQuality} (score ${ctx.recovery.sleepScore}/100, ${ctx.recovery.sleepHoursLast}h) | ${hydraStatus} (${ctx.recovery.hydrationMl} ml, ${ctx.recovery.hydrationPercent}%)

RÈGLES DE COMMUNICATION :
- Réponses courtes : 2-4 phrases max sauf si on te pose une question détaillée
- Ton chaleureux, direct, pas de jargon compliqué
- Tu utilises les vraies données ci-dessus pour personnaliser chaque message
- Tu ne te répètes jamais d'une session à l'autre
- Pas d'emojis sauf 1 max si vraiment pertinent
- Langue : français uniquement
- Si l'utilisateur n'envoie pas de message (ouverture), génère un message de ${ctx.timeOfDay === 'morning' ? 'bonjour motivant basé sur les données du jour' : ctx.timeOfDay === 'evening' ? 'bilan de fin de journée' : 'check-in adapté au moment'}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  try {
    const ctx: CalixContext = JSON.parse(event.body || '{}');
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'API key manquante' }) };

    const messages = [
      ...ctx.history.slice(-6),
      ...(ctx.userMessage ? [{ role: 'user' as const, content: ctx.userMessage }] : []),
    ];

    // Si pas de message utilisateur, on injecte un trigger silencieux
    if (!ctx.userMessage) {
      messages.push({ role: 'user', content: '__open__' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: buildSystemPrompt(ctx),
        messages: messages.length > 0 ? messages : [{ role: 'user', content: '__open__' }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err }) };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (e: any) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
