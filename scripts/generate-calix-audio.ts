/**
 * Script de génération unique des audios Calix via ElevenLabs.
 * Lance avec : npx tsx scripts/generate-calix-audio.ts
 *
 * Prérequis :
 *   ELEVENLABS_API_KEY=sk_...  (variable d'env ou .env.local)
 *   ELEVENLABS_VOICE_ID=...    (ID de la voix choisie sur elevenlabs.io)
 *
 * Génère tous les fichiers dans public/audio/calix/
 * Ne régénère PAS un fichier qui existe déjà (sauf --force).
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// ─── Config ──────────────────────────────────────────────────────────────────

const API_KEY   = process.env.ELEVENLABS_API_KEY  || '';
const VOICE_ID  = process.env.ELEVENLABS_VOICE_ID || '';
const OUT_DIR   = path.resolve('public/audio/calix');
const FORCE     = process.argv.includes('--force');

if (!API_KEY)  { console.error('❌  ELEVENLABS_API_KEY manquant'); process.exit(1); }
if (!VOICE_ID) { console.error('❌  ELEVENLABS_VOICE_ID manquant'); process.exit(1); }

fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Phrases à générer ───────────────────────────────────────────────────────

const PHRASES: { id: string; text: string }[] = [

  // ── Onboarding intro — PARTIE 1 (avant le prénom) ──
  // Lecture : part1 → pause 300ms → Web Speech dit le prénom → part2
  { id: 'onboarding_fr_1', text: "Bonjour" },
  { id: 'onboarding_en_1', text: "Hey" },
  { id: 'onboarding_es_1', text: "Hola" },
  { id: 'onboarding_ar_1', text: "مرحباً" },

  // ── Onboarding intro — PARTIE 2 (après le prénom) ──
  { id: 'onboarding_fr_2', text: "Je suis Calix, ton coach IA. Je vais analyser ton profil et créer un programme personnalisé rien que pour toi. Sport, nutrition, récupération — tout sera adapté à ton corps." },
  { id: 'onboarding_en_2', text: "I'm Calix, your AI coach. I'll analyze your profile and build a personalized program just for you. Training, nutrition, recovery — everything tailored to your body." },
  { id: 'onboarding_es_2', text: "Soy Calix, tu coach de IA. Analizaré tu perfil y crearé un programa personalizado solo para ti. Entrenamiento, nutrición, recuperación — todo adaptado a tu cuerpo." },
  { id: 'onboarding_ar_2', text: "أنا كاليكس، مدربك بالذكاء الاصطناعي. سأحلل ملفك وأنشئ برنامجاً مخصصاً لك. رياضة، تغذية، تعافٍ — كل شيء مكيّف مع جسمك." },

  // ── Session start — objectifs ──
  { id: 'start_weightloss_1', text: "C'est parti. Aujourd'hui on brûle, on transpire, on avance." },
  { id: 'start_weightloss_2', text: "Séance brûle-graisses. Chaque calorie compte." },
  { id: 'start_weightloss_3', text: "On attaque. Objectif : faire travailler ton métabolisme à fond." },
  { id: 'start_muscle_1',     text: "C'est l'heure de construire. Chaque répétition sculpte ton corps." },
  { id: 'start_muscle_2',     text: "Séance renforcement. On cherche la qualité du mouvement." },
  { id: 'start_muscle_3',     text: "On y va. Contrôle chaque mouvement, ressens chaque muscle." },
  { id: 'start_endurance_1',  text: "Séance endurance. On va chercher le souffle et la résistance." },
  { id: 'start_endurance_2',  text: "Aujourd'hui on repousse tes limites cardio." },
  { id: 'start_endurance_3',  text: "C'est parti. Rythme régulier, respiration contrôlée." },
  { id: 'start_health_1',     text: "C'est parti. On prend soin de ton corps aujourd'hui." },
  { id: 'start_health_2',     text: "Une séance pour se sentir bien dans son corps." },
  { id: 'start_health_3',     text: "On y va en douceur mais avec détermination." },

  // ── Session start — modes ──
  { id: 'start_mode_voyage',   text: "Séance adaptée, pas besoin de matériel." },
  { id: 'start_mode_fatigue',  text: "On écoute ton corps aujourd'hui, pas de pression." },
  { id: 'start_mode_express',  text: "Séance courte mais intense, chaque seconde compte." },
  { id: 'start_mode_cycle',    text: "Séance adaptée à ta phase actuelle. On respecte ton rythme." },

  // ── Transitions ──
  { id: 'warmup_to_main_1', text: "Bien. Maintenant on passe aux choses sérieuses." },
  { id: 'warmup_to_main_2', text: "Échauffement terminé. Tes muscles sont prêts, on attaque le bloc principal." },
  { id: 'warmup_to_main_3', text: "Parfait, le corps est prêt. On monte en intensité maintenant." },
  { id: 'warmup_to_main_4', text: "Bien échauffé. C'est maintenant que ça commence vraiment." },
  { id: 'warmup_to_main_5', text: "Les muscles sont chauds. On passe à l'entraînement." },
  { id: 'main_to_cooldown_1', text: "Le plus dur est fait. On termine avec quelques étirements pour bien récupérer." },
  { id: 'main_to_cooldown_2', text: "Excellent travail. Place au retour au calme, c'est aussi important que l'effort." },
  { id: 'main_to_cooldown_3', text: "Bravo, bloc principal terminé. On étire les muscles qui ont travaillé." },
  { id: 'main_to_cooldown_4', text: "La partie intense est finie. Prends le temps de t'étirer, ton corps en a besoin." },

  // ── Set complete ──
  { id: 'set_complete_1', text: "Encore une seule. Donne tout." },
  { id: 'set_complete_2', text: "Terminé. Beau travail." },

  // ── Rest ──
  { id: 'rest_mid_1', text: "Pause. Secoue les bras, détends les épaules." },
  { id: 'rest_mid_2', text: "Repos. Tu es sur la bonne voie." },
  { id: 'rest_mid_3', text: "Souffle un coup. La moitié est faite." },
  { id: 'rest_mid_4', text: "Profite-en pour relâcher les tensions." },
  { id: 'rest_mid_5', text: "Repos. Chaque exercice que tu termines te rapproche du résultat." },
  { id: 'rest_end_1',  text: "Repos. La fin approche, tiens bon." },
  { id: 'rest_end_2',  text: "Plus que quelques exercices." },
  { id: 'rest_end_3',  text: "Dernière ligne droite." },
  { id: 'rest_end_4',  text: "Souffle. Tu as presque fini, ne lâche rien." },
  { id: 'rest_end_5',  text: "Le plus dur est derrière toi." },

  // ── Motivation ──
  { id: 'motivation_1',  text: "Continue exactement comme ça." },
  { id: 'motivation_2',  text: "Chaque répétition construit la meilleure version de toi." },
  { id: 'motivation_3',  text: "La plupart des gens ont déjà abandonné. Pas toi." },
  { id: 'motivation_4',  text: "La discipline bat toujours la motivation." },
  { id: 'motivation_5',  text: "Ton futur toi te remercie pour cet effort." },
  { id: 'motivation_wl_1', text: "Ton métabolisme tourne à plein régime là." },
  { id: 'motivation_wl_2', text: "Continue, ton corps est en train de se transformer." },
  { id: 'motivation_m_1',  text: "Tes muscles grandissent en ce moment même." },
  { id: 'motivation_m_2',  text: "Contrôle, tension, résultat." },
  { id: 'motivation_e_1',  text: "Ton cœur devient plus efficace à chaque séance." },
  { id: 'motivation_e_2',  text: "Tu repousses tes limites un peu plus loin." },
  { id: 'motivation_h_1',  text: "Tu fais le meilleur investissement possible : ta santé." },
  { id: 'motivation_h_2',  text: "Chaque mouvement est un cadeau pour ton corps." },
  { id: 'motivation_end',  text: "Tu te sentiras tellement bien après." },

  // ── Injury warnings ──
  { id: 'injury_knee',     text: "Fais attention à tes genoux. Ne descends pas trop bas si tu ressens une gêne." },
  { id: 'injury_knee_2',   text: "Contrôle bien le mouvement pour protéger tes genoux." },
  { id: 'injury_shoulder', text: "Ne descends pas trop bas pour protéger ton épaule." },
  { id: 'injury_wrist',    text: "Reste sur les avant-bras pour épargner tes poignets." },
  { id: 'injury_back',     text: "Contracte les abdos pour protéger ton dos." },
  { id: 'injury_shoulder_2', text: "Si ton épaule tire, fais la version sur le coude." },
  { id: 'injury_back_2',   text: "Lève doucement. Ne force pas sur le bas du dos." },
  { id: 'injury_knee_3',   text: "Si la douleur au genou est trop forte, remonte un peu." },
  { id: 'injury_back_3',   text: "Garde le bas du dos plaqué au sol." },
  { id: 'injury_preg',     text: "Tous les exercices sont sécurisés pour toi. Pas de mouvement sur le ventre, que de la douceur." },
  { id: 'injury_multi',    text: "J'ai adapté la séance pour tes zones sensibles. Écoute ton corps, on ne force jamais sur la douleur." },
  { id: 'injury_single_knee',     text: "J'ai adapté la séance pour protéger ton genou. Si tu ressens la moindre douleur, arrête-toi." },
  { id: 'injury_single_back',     text: "J'ai adapté la séance pour protéger ton dos. Si tu ressens la moindre douleur, arrête-toi." },
  { id: 'injury_single_shoulder', text: "J'ai adapté la séance pour protéger ton épaule. Si tu ressens la moindre douleur, arrête-toi." },
  { id: 'injury_single_wrist',    text: "J'ai adapté la séance pour protéger ton poignet. Si tu ressens la moindre douleur, arrête-toi." },
  { id: 'injury_single_hip',      text: "J'ai adapté la séance pour protéger ta hanche. Si tu ressens la moindre douleur, arrête-toi." },
  { id: 'injury_single_ankle',    text: "J'ai adapté la séance pour protéger ta cheville. Si tu ressens la moindre douleur, arrête-toi." },

  // ── Exercise cues ──
  { id: 'ex_plank',         text: "Corps bien gainé de la tête aux pieds." },
  { id: 'ex_pushup',        text: "Descends la poitrine vers le sol, pas le ventre. Pousse fort en montant." },
  { id: 'ex_knee_pushup',   text: "Genoux au sol, dos bien droit." },
  { id: 'ex_wide_pushup',   text: "Mains plus larges que les épaules, accentue le travail des pectoraux." },
  { id: 'ex_diamond_pushup',text: "Mains rapprochées sous la poitrine, coudes près du corps." },
  { id: 'ex_pike_pushup',   text: "Fesses en haut, plie les coudes pour descendre la tête vers le sol." },
  { id: 'ex_squat',         text: "Le poids sur les talons, pas sur les pointes. Poitrine haute, regard devant." },
  { id: 'ex_lunge',         text: "Grand pas en avant, genou arrière vers le sol. Le buste reste vertical." },
  { id: 'ex_bss',           text: "Un pied sur le support, descends sur la jambe avant, genou aligné avec le pied." },
  { id: 'ex_side_plank',    text: "Corps aligné, hanches décollées. Si ton épaule tire, passe sur le coude." },
  { id: 'ex_glute_bridge',  text: "Pousse le bassin vers le plafond. Serre fort les fessiers en haut du mouvement." },
  { id: 'ex_mountain_climber', text: "Les épaules restent au-dessus des mains. Hanches basses." },
  { id: 'ex_wall_sit',      text: "Cuisses parallèles au sol, genoux à quatre-vingt-dix degrés. Respire calmement, ne retiens pas ton souffle." },
  { id: 'ex_hollow_body',   text: "Ton dos est plaqué au sol comme une coque de bateau." },
  { id: 'ex_leg_raises',    text: "Les jambes descendent ensemble, lentement. Garde le bas du dos plaqué." },
  { id: 'ex_jumping_jacks', text: "Les bras montent complètement au-dessus de la tête." },
  { id: 'ex_high_knees',    text: "Les genoux montent à hauteur des hanches. Garde le dos droit." },
  { id: 'ex_hip_circles',   text: "Mains sur les hanches, grands cercles fluides et contrôlés." },
  { id: 'ex_bird_dog',      text: "À quatre pattes, dos plat. Tends le bras et la jambe opposés, maintiens deux secondes." },
  { id: 'ex_superman',      text: "Lève bras et jambes simultanément. Contracte les fessiers et le dos." },

  // ── Session complete ──
  { id: 'session_done_1', text: "Séance terminée. Tu peux être fier de toi." },
  { id: 'session_done_2', text: "C'est fini. Excellent travail aujourd'hui." },
  { id: 'session_done_3', text: "Bravo, tu as tout donné. Maintenant récupère bien." },
  { id: 'session_done_4', text: "Séance validée. Ton corps progresse." },

  // ── Countdown ──
  { id: 'countdown_1', text: "Un." },
  { id: 'countdown_3', text: "Trois." },
  { id: 'countdown_5', text: "Cinq." },

  // ── Warmup first ──
  { id: 'warmup_first', text: "On commence par l'échauffement. Prends ton temps." },
];

// ─── Génération ElevenLabs ────────────────────────────────────────────────────

const TOTAL_CHARS = PHRASES.reduce((n, p) => n + p.text.length, 0);
console.log(`\n📋 ${PHRASES.length} phrases — ${TOTAL_CHARS} caractères total\n`);

async function generateAudio(id: string, text: string): Promise<void> {
  const outPath = path.join(OUT_DIR, `${id}.mp3`);

  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`  ⏭  ${id}.mp3 (déjà présent)`);
    return;
  }

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
    });

    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', d => err += d);
        res.on('end', () => reject(new Error(`${res.statusCode}: ${err}`)));
        return;
      }
      const out = fs.createWriteStream(outPath);
      res.pipe(out);
      out.on('finish', () => { console.log(`  ✅  ${id}.mp3`); resolve(); });
      out.on('error', reject);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`🎙️  Génération Calix Audio — ElevenLabs`);
  console.log(`   Voice ID : ${VOICE_ID}`);
  console.log(`   Output   : ${OUT_DIR}\n`);

  let generated = 0, skipped = 0, failed = 0;

  for (const phrase of PHRASES) {
    try {
      const existed = fs.existsSync(path.join(OUT_DIR, `${phrase.id}.mp3`));
      await generateAudio(phrase.id, phrase.text);
      if (!existed) generated++;
      else skipped++;
    } catch (e) {
      console.error(`  ❌  ${phrase.id}: ${(e as Error).message}`);
      failed++;
    }
    // Throttle: 3 req/s max (ElevenLabs free tier)
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n✨ Terminé — ${generated} générés, ${skipped} ignorés, ${failed} erreurs`);
  console.log(`   Dossier : ${OUT_DIR}`);
}

main().catch(console.error);
