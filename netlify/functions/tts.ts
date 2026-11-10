import type { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// fr-FR-Neural2-C = voix féminine naturelle Google (meilleure qualité)
const VOICE_NAME = 'fr-FR-Neural2-C';
const LANGUAGE_CODE = 'fr-FR';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' };
  }

  try {
    const { text, rate = 0.92 } = JSON.parse(event.body || '{}');
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Texte manquant' }) };
    }
    if (text.length > 1000) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Texte trop long' }) };
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Clé API manquante' }) };
    }

    // Speaking rate: 0.92 → 0.85 pour Google TTS (échelle différente)
    // Google: 0.25–4.0, 1.0 = normal. On mappe 0.92 → ~0.9
    const speakingRate = Math.max(0.5, Math.min(1.5, rate));

    const payload = {
      input: { text: text.trim() },
      voice: {
        languageCode: LANGUAGE_CODE,
        name: VOICE_NAME,
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch: 0.0,
        volumeGainDb: 1.0,
        effectsProfileId: ['headphone-class-device'],
      },
    };

    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Google TTS error:', err);
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Erreur Google TTS' }) };
    }

    const { audioContent } = await res.json();
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioContent }), // base64 MP3
    };
  } catch (err) {
    console.error('TTS handler error:', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Erreur serveur' }) };
  }
};
