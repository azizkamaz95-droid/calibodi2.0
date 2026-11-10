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
    const { image } = JSON.parse(event.body || '{}');
    if (!image) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Image manquante' }) };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ error: 'Clé API manquante - vérifier Netlify env vars' }) };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: image },
            },
            {
              type: 'text',
              text: `Tu es un expert en nutrition. Analyse cette assiette/repas et donne le résultat nutritionnel TOTAL du repas complet.

Identifie tous les composants visibles, calcule leurs valeurs individuelles, puis combine-les en UN SEUL résultat représentant le repas entier. Donne un nom de plat complet et descriptif (ex: "Assiette poulet-riz-légumes", "Salade de riz au thon", "Pizza margherita", "Bowl avocat-œuf").

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après :
{
  "dishName": "Assiette poulet grillé, riz blanc et brocolis",
  "estimatedGrams": 450,
  "kcalPer100g": 120,
  "proteinPer100g": 12,
  "carbsPer100g": 14,
  "fatPer100g": 2.5
}

Règles STRICTES :
- UN SEUL objet JSON représentant le repas complet
- dishName : nom descriptif du plat complet (cite les composants principaux)
- estimatedGrams : poids total estimé de l'assiette entière
- kcalPer100g, proteinPer100g, carbsPer100g, fatPer100g : valeurs MOYENNES pondérées pour 100g du mélange
- Sois précis et réaliste dans tes estimations
- Réponds UNIQUEMENT avec le JSON, rien d'autre`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic error:', response.status, errText);
      throw new Error(`API Claude ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON in response:', text);
      throw new Error('Réponse invalide de l\'IA');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.dishName || parsed.estimatedGrams === undefined || parsed.kcalPer100g === undefined) {
      throw new Error('L\'IA n\'a pas pu identifier le plat');
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ dish: parsed }) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    console.error('Function error:', msg);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ error: msg }),
    };
  }
};
