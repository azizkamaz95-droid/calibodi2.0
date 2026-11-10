import type { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' };
  }

  try {
    const { dishName } = JSON.parse(event.body || '{}');
    if (!dishName) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Nom du plat manquant' }) };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ error: 'Clé API manquante' }) };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Tu es un expert en nutrition. Donne les valeurs nutritionnelles pour ce plat : "${dishName}".

Réponds UNIQUEMENT avec un JSON valide :
{
  "dishName": "${dishName}",
  "estimatedGrams": 350,
  "kcalPer100g": 150,
  "proteinPer100g": 12,
  "carbsPer100g": 18,
  "fatPer100g": 4
}

Règles :
- estimatedGrams : portion standard typique pour ce plat
- kcalPer100g, proteinPer100g, carbsPer100g, fatPer100g : valeurs réelles pour 100g
- Réponds UNIQUEMENT avec le JSON, rien d'autre`,
        }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Claude ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse invalide');

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.kcalPer100g) throw new Error('Données nutritionnelles manquantes');

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ dish: parsed }) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ error: msg }) };
  }
};
