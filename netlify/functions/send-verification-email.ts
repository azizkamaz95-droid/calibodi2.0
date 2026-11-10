// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin');
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
    const { email, firstName, uid } = JSON.parse(event.body || '{}');
    if (!email || !uid) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'email et uid requis' }) };
    }

    const resendKey = process.env.RESEND_API_KEY;
    const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!resendKey || !firebaseKey) {
      console.error('Missing env vars — RESEND_API_KEY:', !!resendKey, 'FIREBASE_SERVICE_ACCOUNT_JSON:', !!firebaseKey);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Variables manquantes' }) };
    }

    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(firebaseKey)) });
    }

    const verificationLink = await admin.auth().generateEmailVerificationLink(email, {
      url: 'https://calibodi.com',
    });

    const name = firstName?.trim() || 'toi';
    const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#111118;border-radius:20px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#FF6B35,#FF2D55);padding:28px;text-align:center;">
            <div style="font-size:26px;font-weight:900;color:#fff;">CaliBodi</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:3px;">Ton coach fitness IA</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 36px 28px;">
            <p style="font-size:21px;font-weight:800;color:#fff;margin:0 0 14px;">Confirme ton email 👋</p>
            <p style="font-size:15px;color:#888;line-height:1.75;margin:0 0 28px;">
              Salut ${name},<br><br>
              Bienvenue sur CaliBodi ! Un dernier clic pour activer ton compte et rencontrer ton coach Calix.
            </p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${verificationLink}"
                 style="display:inline-block;padding:16px 40px;border-radius:14px;background:linear-gradient(135deg,#FF6B35,#FF2D55);color:#fff;font-weight:800;font-size:16px;text-decoration:none;">
                Confirmer mon email →
              </a>
            </div>
            <p style="font-size:12px;color:#555;line-height:1.65;margin:0;">
              Lien qui ne fonctionne pas ? Copie-colle dans ton navigateur :<br>
              <a href="${verificationLink}" style="color:#FF6B35;word-break:break-all;font-size:11px;">${verificationLink}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="font-size:11px;color:#444;margin:0;line-height:1.6;">
              Ce lien expire dans 24 heures. Si tu n'as pas créé de compte CaliBodi, ignore cet email.<br>
              © 2026 CaliBodi · <a href="https://calibodi.com/privacy" style="color:#555;text-decoration:none;">Confidentialité</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CaliBodi <noreply@calibodi.com>',
        to: [email],
        subject: '✅ Confirme ton email CaliBodi',
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Erreur envoi Resend' }) };
    }

    console.log('Email sent via Resend to:', email);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Email handler error:', String(err));
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Erreur serveur', detail: String(err) }) };
  }
};
