import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: 'Image manquante' }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });

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
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `Analyse ce repas et réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "foodName": "nom simple de l'aliment en français (ex: poulet grillé, riz blanc, salade verte)",
  "estimatedGrams": 150,
  "kcalPer100g": 165,
  "proteinPer100g": 31,
  "carbsPer100g": 0,
  "fatPer100g": 3.6
}

Règles :
- foodName : nom simple et court pour recherche dans base de données
- estimatedGrams : estimation visuelle de la portion
- valeurs nutritionnelles pour 100g de cet aliment
- Si plusieurs aliments, choisis le principal
- Réponds UNIQUEMENT avec le JSON, rien d'autre`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Erreur API Claude');
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse invalide de l\'IA');

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.foodName || !parsed.estimatedGrams) {
      throw new Error('L\'IA n\'a pas pu identifier l\'aliment');
    }

    return NextResponse.json(parsed, { headers: corsHeaders });
  } catch (e) {
    console.error('Food analysis error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erreur d\'analyse' },
      { status: 500, headers: corsHeaders }
    );
  }
}
