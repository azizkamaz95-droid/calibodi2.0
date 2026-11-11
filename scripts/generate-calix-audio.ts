/**
 * Script de génération unique des audios Calix via ElevenLabs.
 * Lance avec : npx tsx scripts/generate-calix-audio.ts
 *
 * Génère tous les fichiers dans public/audio/calix/
 * Ne régénère PAS un fichier qui existe déjà (sauf --force).
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// ─── Config par langue (voix native + compte dédié) ──────────────────────────

const LANG_CONFIG: Record<string, { apiKey: string; voiceId: string }> = {
  fr: { apiKey: 'sk_75902bc56e93ce76480a3ff1a33748708d45f0ea1974b5a6', voiceId: 'WeAAwKYcS06VmXw086yZ' },
  en: { apiKey: 'sk_d39966738dc6c8fac2e694ee63e27dc185fe7f87d3e437e1', voiceId: 'BAdH0bMfq6VleQGLXj38' },
  es: { apiKey: 'sk_954ae932cdefdc3a08dfd43066a73176ee7ed19d78590baf', voiceId: 'Ir1QNHvhaJXbAGhT50w3' },
  ar: { apiKey: 'sk_75902bc56e93ce76480a3ff1a33748708d45f0ea1974b5a6', voiceId: 'ZeiYF4oDQt8eyQZ1N7Os' },
};

const OUT_DIR = path.resolve('public/audio/calix');
const FORCE   = process.argv.includes('--force');

// Langue à générer (--lang=fr/en/es/ar) ou toutes si absent
const ONLY_LANG = (process.argv.find(a => a.startsWith('--lang='))?.split('=')[1]) || null;

fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Phrases par langue ───────────────────────────────────────────────────────

const PHRASES_BY_LANG: Record<string, { id: string; text: string }[]> = {
  fr: [
    // Onboarding intro
    { id: 'onboarding_1', text: "Bonjour" },
    { id: 'onboarding_2', text: "Je suis Calix, ton coach IA. Je vais analyser ton profil et créer un programme personnalisé rien que pour toi. Sport, nutrition, récupération — tout sera adapté à ton corps." },
    // Session start
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
    { id: 'start_mode_voyage',  text: "Séance adaptée, pas besoin de matériel." },
    { id: 'start_mode_fatigue', text: "On écoute ton corps aujourd'hui, pas de pression." },
    { id: 'start_mode_express', text: "Séance courte mais intense, chaque seconde compte." },
    { id: 'start_mode_cycle',   text: "Séance adaptée à ta phase actuelle. On respecte ton rythme." },
    // Transitions
    { id: 'warmup_to_main_1', text: "Bien. Maintenant on passe aux choses sérieuses." },
    { id: 'warmup_to_main_2', text: "Échauffement terminé. Tes muscles sont prêts, on attaque le bloc principal." },
    { id: 'warmup_to_main_3', text: "Parfait, le corps est prêt. On monte en intensité maintenant." },
    { id: 'warmup_to_main_4', text: "Bien échauffé. C'est maintenant que ça commence vraiment." },
    { id: 'warmup_to_main_5', text: "Les muscles sont chauds. On passe à l'entraînement." },
    { id: 'main_to_cooldown_1', text: "Le plus dur est fait. On termine avec quelques étirements pour bien récupérer." },
    { id: 'main_to_cooldown_2', text: "Excellent travail. Place au retour au calme, c'est aussi important que l'effort." },
    { id: 'main_to_cooldown_3', text: "Bravo, bloc principal terminé. On étire les muscles qui ont travaillé." },
    { id: 'main_to_cooldown_4', text: "La partie intense est finie. Prends le temps de t'étirer, ton corps en a besoin." },
    // Set / rest
    { id: 'set_complete_1', text: "Encore une seule. Donne tout." },
    { id: 'set_complete_2', text: "Terminé. Beau travail." },
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
    // Motivation
    { id: 'motivation_1',    text: "Continue exactement comme ça." },
    { id: 'motivation_2',    text: "Chaque répétition construit la meilleure version de toi." },
    { id: 'motivation_3',    text: "La plupart des gens ont déjà abandonné. Pas toi." },
    { id: 'motivation_4',    text: "La discipline bat toujours la motivation." },
    { id: 'motivation_5',    text: "Ton futur toi te remercie pour cet effort." },
    { id: 'motivation_wl_1', text: "Ton métabolisme tourne à plein régime là." },
    { id: 'motivation_wl_2', text: "Continue, ton corps est en train de se transformer." },
    { id: 'motivation_m_1',  text: "Tes muscles grandissent en ce moment même." },
    { id: 'motivation_m_2',  text: "Contrôle, tension, résultat." },
    { id: 'motivation_e_1',  text: "Ton cœur devient plus efficace à chaque séance." },
    { id: 'motivation_e_2',  text: "Tu repousses tes limites un peu plus loin." },
    { id: 'motivation_h_1',  text: "Tu fais le meilleur investissement possible : ta santé." },
    { id: 'motivation_h_2',  text: "Chaque mouvement est un cadeau pour ton corps." },
    { id: 'motivation_end',  text: "Tu te sentiras tellement bien après." },
    // Injuries
    { id: 'injury_knee',            text: "Fais attention à tes genoux. Ne descends pas trop bas si tu ressens une gêne." },
    { id: 'injury_knee_2',          text: "Contrôle bien le mouvement pour protéger tes genoux." },
    { id: 'injury_shoulder',        text: "Ne descends pas trop bas pour protéger ton épaule." },
    { id: 'injury_wrist',           text: "Reste sur les avant-bras pour épargner tes poignets." },
    { id: 'injury_back',            text: "Contracte les abdos pour protéger ton dos." },
    { id: 'injury_shoulder_2',      text: "Si ton épaule tire, fais la version sur le coude." },
    { id: 'injury_back_2',          text: "Lève doucement. Ne force pas sur le bas du dos." },
    { id: 'injury_knee_3',          text: "Si la douleur au genou est trop forte, remonte un peu." },
    { id: 'injury_back_3',          text: "Garde le bas du dos plaqué au sol." },
    { id: 'injury_preg',            text: "Tous les exercices sont sécurisés pour toi. Pas de mouvement sur le ventre, que de la douceur." },
    { id: 'injury_multi',           text: "J'ai adapté la séance pour tes zones sensibles. Écoute ton corps, on ne force jamais sur la douleur." },
    { id: 'injury_single_knee',     text: "J'ai adapté la séance pour protéger ton genou. Si tu ressens la moindre douleur, arrête-toi." },
    { id: 'injury_single_back',     text: "J'ai adapté la séance pour protéger ton dos. Si tu ressens la moindre douleur, arrête-toi." },
    { id: 'injury_single_shoulder', text: "J'ai adapté la séance pour protéger ton épaule. Si tu ressens la moindre douleur, arrête-toi." },
    { id: 'injury_single_wrist',    text: "J'ai adapté la séance pour protéger ton poignet. Si tu ressens la moindre douleur, arrête-toi." },
    { id: 'injury_single_hip',      text: "J'ai adapté la séance pour protéger ta hanche. Si tu ressens la moindre douleur, arrête-toi." },
    { id: 'injury_single_ankle',    text: "J'ai adapté la séance pour protéger ta cheville. Si tu ressens la moindre douleur, arrête-toi." },
    // Exercise cues
    { id: 'ex_plank',            text: "Corps bien gainé de la tête aux pieds." },
    { id: 'ex_pushup',           text: "Descends la poitrine vers le sol, pas le ventre. Pousse fort en montant." },
    { id: 'ex_knee_pushup',      text: "Genoux au sol, dos bien droit." },
    { id: 'ex_wide_pushup',      text: "Mains plus larges que les épaules, accentue le travail des pectoraux." },
    { id: 'ex_diamond_pushup',   text: "Mains rapprochées sous la poitrine, coudes près du corps." },
    { id: 'ex_pike_pushup',      text: "Fesses en haut, plie les coudes pour descendre la tête vers le sol." },
    { id: 'ex_squat',            text: "Le poids sur les talons, pas sur les pointes. Poitrine haute, regard devant." },
    { id: 'ex_lunge',            text: "Grand pas en avant, genou arrière vers le sol. Le buste reste vertical." },
    { id: 'ex_bss',              text: "Un pied sur le support, descends sur la jambe avant, genou aligné avec le pied." },
    { id: 'ex_side_plank',       text: "Corps aligné, hanches décollées. Si ton épaule tire, passe sur le coude." },
    { id: 'ex_glute_bridge',     text: "Pousse le bassin vers le plafond. Serre fort les fessiers en haut du mouvement." },
    { id: 'ex_mountain_climber', text: "Les épaules restent au-dessus des mains. Hanches basses." },
    { id: 'ex_wall_sit',         text: "Cuisses parallèles au sol, genoux à quatre-vingt-dix degrés. Respire calmement." },
    { id: 'ex_hollow_body',      text: "Ton dos est plaqué au sol comme une coque de bateau." },
    { id: 'ex_leg_raises',       text: "Les jambes descendent ensemble, lentement. Garde le bas du dos plaqué." },
    { id: 'ex_jumping_jacks',    text: "Les bras montent complètement au-dessus de la tête." },
    { id: 'ex_high_knees',       text: "Les genoux montent à hauteur des hanches. Garde le dos droit." },
    { id: 'ex_hip_circles',      text: "Mains sur les hanches, grands cercles fluides et contrôlés." },
    { id: 'ex_bird_dog',         text: "À quatre pattes, dos plat. Tends le bras et la jambe opposés, maintiens deux secondes." },
    { id: 'ex_superman',         text: "Lève bras et jambes simultanément. Contracte les fessiers et le dos." },
    // Session complete
    { id: 'session_done_1', text: "Séance terminée. Tu peux être fier de toi." },
    { id: 'session_done_2', text: "C'est fini. Excellent travail aujourd'hui." },
    { id: 'session_done_3', text: "Bravo, tu as tout donné. Maintenant récupère bien." },
    { id: 'session_done_4', text: "Séance validée. Ton corps progresse." },
    // Countdown + warmup
    { id: 'countdown_1',   text: "Un." },
    { id: 'countdown_3',   text: "Trois." },
    { id: 'countdown_5',   text: "Cinq." },
    { id: 'warmup_first',  text: "On commence par l'échauffement. Prends ton temps." },
  ],

  en: [
    { id: 'onboarding_1', text: "Hey" },
    { id: 'onboarding_2', text: "I'm Calix, your AI coach. I'll analyze your profile and build a personalized program just for you. Training, nutrition, recovery — everything tailored to your body." },
    { id: 'start_weightloss_1', text: "Let's go. Today we burn, we sweat, we move forward." },
    { id: 'start_weightloss_2', text: "Fat-burning session. Every calorie counts." },
    { id: 'start_weightloss_3', text: "Attack mode. Goal: get your metabolism working at full speed." },
    { id: 'start_muscle_1',     text: "Time to build. Every rep sculpts your body." },
    { id: 'start_muscle_2',     text: "Strength session. We're going for quality movement." },
    { id: 'start_muscle_3',     text: "Let's go. Control every movement, feel every muscle." },
    { id: 'start_endurance_1',  text: "Endurance session. We're going for breath and resistance." },
    { id: 'start_endurance_2',  text: "Today we push your cardio limits." },
    { id: 'start_endurance_3',  text: "Let's go. Steady pace, controlled breathing." },
    { id: 'start_health_1',     text: "Let's go. Taking care of your body today." },
    { id: 'start_health_2',     text: "A session to feel good in your body." },
    { id: 'start_health_3',     text: "Nice and steady, with determination." },
    { id: 'start_mode_voyage',  text: "Adapted session, no equipment needed." },
    { id: 'start_mode_fatigue', text: "Listening to your body today, no pressure." },
    { id: 'start_mode_express', text: "Short but intense session, every second counts." },
    { id: 'start_mode_cycle',   text: "Session adapted to your current phase. We respect your rhythm." },
    { id: 'warmup_to_main_1', text: "Good. Now let's get serious." },
    { id: 'warmup_to_main_2', text: "Warm-up done. Your muscles are ready, let's attack the main block." },
    { id: 'warmup_to_main_3', text: "Perfect, body is ready. Time to ramp up the intensity." },
    { id: 'warmup_to_main_4', text: "Well warmed up. This is where it really starts." },
    { id: 'warmup_to_main_5', text: "Muscles are warm. Let's move to the workout." },
    { id: 'main_to_cooldown_1', text: "The hardest part is done. Let's finish with some stretches to recover well." },
    { id: 'main_to_cooldown_2', text: "Excellent work. Time to cool down — it's just as important as the effort." },
    { id: 'main_to_cooldown_3', text: "Well done, main block complete. Let's stretch the muscles that worked." },
    { id: 'main_to_cooldown_4', text: "Intense part is over. Take time to stretch, your body needs it." },
    { id: 'set_complete_1', text: "Just one more. Give it everything." },
    { id: 'set_complete_2', text: "Done. Great work." },
    { id: 'rest_mid_1', text: "Rest. Shake your arms, relax your shoulders." },
    { id: 'rest_mid_2', text: "Rest. You're on the right track." },
    { id: 'rest_mid_3', text: "Take a breath. Halfway there." },
    { id: 'rest_mid_4', text: "Use this time to release the tension." },
    { id: 'rest_mid_5', text: "Rest. Every exercise you finish brings you closer to the result." },
    { id: 'rest_end_1',  text: "Rest. The end is near, hold on." },
    { id: 'rest_end_2',  text: "Just a few exercises left." },
    { id: 'rest_end_3',  text: "Home stretch." },
    { id: 'rest_end_4',  text: "Breathe. You're almost done, don't let go." },
    { id: 'rest_end_5',  text: "The hardest part is behind you." },
    { id: 'motivation_1',    text: "Keep going exactly like that." },
    { id: 'motivation_2',    text: "Every rep builds the best version of you." },
    { id: 'motivation_3',    text: "Most people have already quit. Not you." },
    { id: 'motivation_4',    text: "Discipline always beats motivation." },
    { id: 'motivation_5',    text: "Your future self thanks you for this effort." },
    { id: 'motivation_wl_1', text: "Your metabolism is running at full speed right now." },
    { id: 'motivation_wl_2', text: "Keep going, your body is transforming." },
    { id: 'motivation_m_1',  text: "Your muscles are growing right now." },
    { id: 'motivation_m_2',  text: "Control, tension, results." },
    { id: 'motivation_e_1',  text: "Your heart gets more efficient with every session." },
    { id: 'motivation_e_2',  text: "You're pushing your limits a little further." },
    { id: 'motivation_h_1',  text: "You're making the best investment possible: your health." },
    { id: 'motivation_h_2',  text: "Every movement is a gift to your body." },
    { id: 'motivation_end',  text: "You're going to feel so good after this." },
    { id: 'injury_knee',            text: "Be careful with your knees. Don't go too low if you feel discomfort." },
    { id: 'injury_knee_2',          text: "Control the movement well to protect your knees." },
    { id: 'injury_shoulder',        text: "Don't go too low to protect your shoulder." },
    { id: 'injury_wrist',           text: "Stay on your forearms to spare your wrists." },
    { id: 'injury_back',            text: "Engage your core to protect your back." },
    { id: 'injury_shoulder_2',      text: "If your shoulder pulls, do the forearm version." },
    { id: 'injury_back_2',          text: "Lift slowly. Don't force through your lower back." },
    { id: 'injury_knee_3',          text: "If your knee pain is too strong, come up a bit." },
    { id: 'injury_back_3',          text: "Keep your lower back pressed to the floor." },
    { id: 'injury_preg',            text: "All exercises are safe for you. No movement on your belly, only gentle movements." },
    { id: 'injury_multi',           text: "I've adapted the session for your sensitive areas. Listen to your body, never push through pain." },
    { id: 'injury_single_knee',     text: "I've adapted the session to protect your knee. If you feel any pain, stop." },
    { id: 'injury_single_back',     text: "I've adapted the session to protect your back. If you feel any pain, stop." },
    { id: 'injury_single_shoulder', text: "I've adapted the session to protect your shoulder. If you feel any pain, stop." },
    { id: 'injury_single_wrist',    text: "I've adapted the session to protect your wrist. If you feel any pain, stop." },
    { id: 'injury_single_hip',      text: "I've adapted the session to protect your hip. If you feel any pain, stop." },
    { id: 'injury_single_ankle',    text: "I've adapted the session to protect your ankle. If you feel any pain, stop." },
    { id: 'ex_plank',            text: "Full body tight from head to toe." },
    { id: 'ex_pushup',           text: "Lower your chest to the floor, not your belly. Push hard on the way up." },
    { id: 'ex_knee_pushup',      text: "Knees on the floor, back straight." },
    { id: 'ex_wide_pushup',      text: "Hands wider than shoulders, emphasize the chest." },
    { id: 'ex_diamond_pushup',   text: "Hands close together under your chest, elbows near your body." },
    { id: 'ex_pike_pushup',      text: "Hips high, bend elbows to lower your head toward the floor." },
    { id: 'ex_squat',            text: "Weight on your heels, not your toes. Chest up, eyes forward." },
    { id: 'ex_lunge',            text: "Big step forward, back knee toward the floor. Keep your torso vertical." },
    { id: 'ex_bss',              text: "One foot on the support, lower on the front leg, knee aligned with the foot." },
    { id: 'ex_side_plank',       text: "Body aligned, hips up. If your shoulder pulls, go on your forearm." },
    { id: 'ex_glute_bridge',     text: "Push your hips toward the ceiling. Squeeze your glutes hard at the top." },
    { id: 'ex_mountain_climber', text: "Shoulders over your hands. Hips low." },
    { id: 'ex_wall_sit',         text: "Thighs parallel to the floor, knees at ninety degrees. Breathe calmly." },
    { id: 'ex_hollow_body',      text: "Your back is pressed to the floor like a boat hull." },
    { id: 'ex_leg_raises',       text: "Legs lower together, slowly. Keep your lower back pressed down." },
    { id: 'ex_jumping_jacks',    text: "Arms come all the way up above your head." },
    { id: 'ex_high_knees',       text: "Knees come up to hip height. Keep your back straight." },
    { id: 'ex_hip_circles',      text: "Hands on hips, big smooth controlled circles." },
    { id: 'ex_bird_dog',         text: "On all fours, flat back. Extend opposite arm and leg, hold two seconds." },
    { id: 'ex_superman',         text: "Lift arms and legs simultaneously. Squeeze your glutes and back." },
    { id: 'session_done_1', text: "Session complete. You can be proud of yourself." },
    { id: 'session_done_2', text: "Done. Excellent work today." },
    { id: 'session_done_3', text: "Well done, you gave it everything. Now recover well." },
    { id: 'session_done_4', text: "Session validated. Your body is progressing." },
    { id: 'countdown_1',   text: "One." },
    { id: 'countdown_3',   text: "Three." },
    { id: 'countdown_5',   text: "Five." },
    { id: 'warmup_first',  text: "Let's start with the warm-up. Take your time." },
  ],

  es: [
    { id: 'onboarding_1', text: "Hola" },
    { id: 'onboarding_2', text: "Soy Calix, tu coach de IA. Analizaré tu perfil y crearé un programa personalizado solo para ti. Entrenamiento, nutrición, recuperación — todo adaptado a tu cuerpo." },
    { id: 'start_weightloss_1', text: "Vamos. Hoy quemamos, sudamos, avanzamos." },
    { id: 'start_weightloss_2', text: "Sesión quema-grasas. Cada caloría cuenta." },
    { id: 'start_weightloss_3', text: "Al ataque. Objetivo: hacer trabajar tu metabolismo a fondo." },
    { id: 'start_muscle_1',     text: "Es hora de construir. Cada repetición esculpe tu cuerpo." },
    { id: 'start_muscle_2',     text: "Sesión de fuerza. Buscamos la calidad del movimiento." },
    { id: 'start_muscle_3',     text: "Vamos. Controla cada movimiento, siente cada músculo." },
    { id: 'start_endurance_1',  text: "Sesión de resistencia. Vamos a buscar el aliento y la aguante." },
    { id: 'start_endurance_2',  text: "Hoy empujamos tus límites cardio." },
    { id: 'start_endurance_3',  text: "Vamos. Ritmo regular, respiración controlada." },
    { id: 'start_health_1',     text: "Vamos. Cuidando tu cuerpo hoy." },
    { id: 'start_health_2',     text: "Una sesión para sentirse bien en tu cuerpo." },
    { id: 'start_health_3',     text: "Suave pero con determinación." },
    { id: 'start_mode_voyage',  text: "Sesión adaptada, sin necesidad de equipamiento." },
    { id: 'start_mode_fatigue', text: "Escuchando tu cuerpo hoy, sin presión." },
    { id: 'start_mode_express', text: "Sesión corta pero intensa, cada segundo cuenta." },
    { id: 'start_mode_cycle',   text: "Sesión adaptada a tu fase actual. Respetamos tu ritmo." },
    { id: 'warmup_to_main_1', text: "Bien. Ahora vamos a lo serio." },
    { id: 'warmup_to_main_2', text: "Calentamiento listo. Tus músculos están preparados, atacamos el bloque principal." },
    { id: 'warmup_to_main_3', text: "Perfecto, el cuerpo está listo. Subimos la intensidad ahora." },
    { id: 'warmup_to_main_4', text: "Bien calentado. Aquí es donde empieza de verdad." },
    { id: 'warmup_to_main_5', text: "Los músculos están calientes. Pasamos al entrenamiento." },
    { id: 'main_to_cooldown_1', text: "Lo más difícil está hecho. Terminamos con algunos estiramientos para recuperar bien." },
    { id: 'main_to_cooldown_2', text: "Excelente trabajo. Tiempo de vuelta a la calma, es tan importante como el esfuerzo." },
    { id: 'main_to_cooldown_3', text: "Bravo, bloque principal terminado. Estiramos los músculos que trabajaron." },
    { id: 'main_to_cooldown_4', text: "La parte intensa terminó. Tómate tiempo para estirar, tu cuerpo lo necesita." },
    { id: 'set_complete_1', text: "Solo una más. Dalo todo." },
    { id: 'set_complete_2', text: "Listo. Buen trabajo." },
    { id: 'rest_mid_1', text: "Pausa. Sacude los brazos, relaja los hombros." },
    { id: 'rest_mid_2', text: "Descanso. Estás en el buen camino." },
    { id: 'rest_mid_3', text: "Respira. Ya estás a la mitad." },
    { id: 'rest_mid_4', text: "Aprovecha para soltar las tensiones." },
    { id: 'rest_mid_5', text: "Descanso. Cada ejercicio que terminas te acerca al resultado." },
    { id: 'rest_end_1',  text: "Descanso. El final se acerca, aguanta." },
    { id: 'rest_end_2',  text: "Solo quedan unos pocos ejercicios." },
    { id: 'rest_end_3',  text: "Recta final." },
    { id: 'rest_end_4',  text: "Respira. Ya casi acabas, no te rindas." },
    { id: 'rest_end_5',  text: "Lo más difícil está detrás de ti." },
    { id: 'motivation_1',    text: "Sigue exactamente así." },
    { id: 'motivation_2',    text: "Cada repetición construye la mejor versión de ti." },
    { id: 'motivation_3',    text: "La mayoría ya se rindió. Tú no." },
    { id: 'motivation_4',    text: "La disciplina siempre gana a la motivación." },
    { id: 'motivation_5',    text: "Tu yo del futuro te agradece este esfuerzo." },
    { id: 'motivation_wl_1', text: "Tu metabolismo está funcionando a tope ahora mismo." },
    { id: 'motivation_wl_2', text: "Sigue, tu cuerpo se está transformando." },
    { id: 'motivation_m_1',  text: "Tus músculos están creciendo en este momento." },
    { id: 'motivation_m_2',  text: "Control, tensión, resultado." },
    { id: 'motivation_e_1',  text: "Tu corazón se vuelve más eficiente con cada sesión." },
    { id: 'motivation_e_2',  text: "Estás empujando tus límites un poco más lejos." },
    { id: 'motivation_h_1',  text: "Estás haciendo la mejor inversión posible: tu salud." },
    { id: 'motivation_h_2',  text: "Cada movimiento es un regalo para tu cuerpo." },
    { id: 'motivation_end',  text: "Te vas a sentir genial después de esto." },
    { id: 'injury_knee',            text: "Cuida tus rodillas. No bajes demasiado si sientes molestia." },
    { id: 'injury_knee_2',          text: "Controla bien el movimiento para proteger tus rodillas." },
    { id: 'injury_shoulder',        text: "No bajes demasiado para proteger tu hombro." },
    { id: 'injury_wrist',           text: "Quédate sobre los antebrazos para proteger tus muñecas." },
    { id: 'injury_back',            text: "Contrae el core para proteger tu espalda." },
    { id: 'injury_shoulder_2',      text: "Si tu hombro tira, haz la versión sobre el antebrazo." },
    { id: 'injury_back_2',          text: "Levanta despacio. No forces la zona lumbar." },
    { id: 'injury_knee_3',          text: "Si el dolor de rodilla es muy fuerte, sube un poco." },
    { id: 'injury_back_3',          text: "Mantén la zona lumbar pegada al suelo." },
    { id: 'injury_preg',            text: "Todos los ejercicios son seguros para ti. Sin movimientos boca abajo, solo suavidad." },
    { id: 'injury_multi',           text: "He adaptado la sesión para tus zonas sensibles. Escucha tu cuerpo, nunca fuerces el dolor." },
    { id: 'injury_single_knee',     text: "He adaptado la sesión para proteger tu rodilla. Si sientes dolor, para." },
    { id: 'injury_single_back',     text: "He adaptado la sesión para proteger tu espalda. Si sientes dolor, para." },
    { id: 'injury_single_shoulder', text: "He adaptado la sesión para proteger tu hombro. Si sientes dolor, para." },
    { id: 'injury_single_wrist',    text: "He adaptado la sesión para proteger tu muñeca. Si sientes dolor, para." },
    { id: 'injury_single_hip',      text: "He adaptado la sesión para proteger tu cadera. Si sientes dolor, para." },
    { id: 'injury_single_ankle',    text: "He adaptado la sesión para proteger tu tobillo. Si sientes dolor, para." },
    { id: 'ex_plank',            text: "Cuerpo tenso de cabeza a pies." },
    { id: 'ex_pushup',           text: "Baja el pecho al suelo, no el vientre. Empuja fuerte al subir." },
    { id: 'ex_knee_pushup',      text: "Rodillas en el suelo, espalda recta." },
    { id: 'ex_wide_pushup',      text: "Manos más anchas que los hombros, trabaja el pecho." },
    { id: 'ex_diamond_pushup',   text: "Manos juntas bajo el pecho, codos cerca del cuerpo." },
    { id: 'ex_pike_pushup',      text: "Caderas arriba, dobla los codos para bajar la cabeza hacia el suelo." },
    { id: 'ex_squat',            text: "Peso en los talones, no en las puntas. Pecho alto, mirada al frente." },
    { id: 'ex_lunge',            text: "Paso largo adelante, rodilla trasera hacia el suelo. Tronco vertical." },
    { id: 'ex_bss',              text: "Un pie en el soporte, baja sobre la pierna delantera, rodilla alineada con el pie." },
    { id: 'ex_side_plank',       text: "Cuerpo alineado, caderas arriba. Si el hombro tira, ve al antebrazo." },
    { id: 'ex_glute_bridge',     text: "Empuja las caderas hacia el techo. Aprieta los glúteos arriba del movimiento." },
    { id: 'ex_mountain_climber', text: "Hombros sobre las manos. Caderas bajas." },
    { id: 'ex_wall_sit',         text: "Muslos paralelos al suelo, rodillas a noventa grados. Respira con calma." },
    { id: 'ex_hollow_body',      text: "Tu espalda está pegada al suelo como el casco de un barco." },
    { id: 'ex_leg_raises',       text: "Las piernas bajan juntas, despacio. Mantén la zona lumbar pegada." },
    { id: 'ex_jumping_jacks',    text: "Los brazos suben completamente por encima de la cabeza." },
    { id: 'ex_high_knees',       text: "Las rodillas suben a la altura de las caderas. Espalda recta." },
    { id: 'ex_hip_circles',      text: "Manos en las caderas, grandes círculos fluidos y controlados." },
    { id: 'ex_bird_dog',         text: "A cuatro patas, espalda plana. Extiende el brazo y la pierna opuestos, mantén dos segundos." },
    { id: 'ex_superman',         text: "Levanta brazos y piernas simultáneamente. Contrae glúteos y espalda." },
    { id: 'session_done_1', text: "Sesión terminada. Puedes estar orgulloso de ti." },
    { id: 'session_done_2', text: "Listo. Excelente trabajo hoy." },
    { id: 'session_done_3', text: "Bravo, lo diste todo. Ahora recupérate bien." },
    { id: 'session_done_4', text: "Sesión validada. Tu cuerpo está progresando." },
    { id: 'countdown_1',   text: "Uno." },
    { id: 'countdown_3',   text: "Tres." },
    { id: 'countdown_5',   text: "Cinco." },
    { id: 'warmup_first',  text: "Empezamos con el calentamiento. Tómate tu tiempo." },
  ],

  ar: [
    { id: 'onboarding_1', text: "مرحباً" },
    { id: 'onboarding_2', text: "أنا كاليكس، مدربك بالذكاء الاصطناعي. سأحلل ملفك وأنشئ برنامجاً مخصصاً لك. رياضة، تغذية، تعافٍ — كل شيء مكيّف مع جسمك." },
    { id: 'start_weightloss_1', text: "هيا بنا. اليوم نحرق، نتعرق، نتقدم." },
    { id: 'start_weightloss_2', text: "جلسة حرق دهون. كل سعرة حرارية تحسب." },
    { id: 'start_weightloss_3', text: "على الهجوم. الهدف: تشغيل الأيض بكامل طاقته." },
    { id: 'start_muscle_1',     text: "حان وقت البناء. كل تكرار ينحت جسمك." },
    { id: 'start_muscle_2',     text: "جلسة تقوية. نبحث عن جودة الحركة." },
    { id: 'start_muscle_3',     text: "هيا. تحكم في كل حركة، أحسس كل عضلة." },
    { id: 'start_endurance_1',  text: "جلسة تحمل. سنبحث عن الأنفاس والمقاومة." },
    { id: 'start_endurance_2',  text: "اليوم نتجاوز حدودك القلبية." },
    { id: 'start_endurance_3',  text: "هيا. إيقاع منتظم، تنفس منضبط." },
    { id: 'start_health_1',     text: "هيا. نعتني بجسمك اليوم." },
    { id: 'start_health_2',     text: "جلسة للشعور بالراحة في جسمك." },
    { id: 'start_health_3',     text: "بهدوء لكن بعزيمة." },
    { id: 'start_mode_voyage',  text: "جلسة مكيفة، لا تحتاج معدات." },
    { id: 'start_mode_fatigue', text: "نستمع لجسمك اليوم، بدون ضغط." },
    { id: 'start_mode_express', text: "جلسة قصيرة لكن مكثفة، كل ثانية تحسب." },
    { id: 'start_mode_cycle',   text: "جلسة مكيفة مع مرحلتك الحالية. نحترم إيقاعك." },
    { id: 'warmup_to_main_1', text: "ممتاز. الآن ننتقل للجد." },
    { id: 'warmup_to_main_2', text: "الإحماء انتهى. عضلاتك جاهزة، نهاجم الجزء الرئيسي." },
    { id: 'warmup_to_main_3', text: "رائع، الجسم جاهز. نرفع الكثافة الآن." },
    { id: 'warmup_to_main_4', text: "إحماء جيد. هنا يبدأ التحدي الحقيقي." },
    { id: 'warmup_to_main_5', text: "العضلات دافئة. ننتقل للتدريب." },
    { id: 'main_to_cooldown_1', text: "الأصعب انتهى. ننهي ببعض التمدد للتعافي الجيد." },
    { id: 'main_to_cooldown_2', text: "عمل ممتاز. وقت الاسترداد، وهو مهم مثل الجهد." },
    { id: 'main_to_cooldown_3', text: "أحسنت، الجزء الرئيسي انتهى. نمد العضلات التي عملت." },
    { id: 'main_to_cooldown_4', text: "الجزء المكثف انتهى. خذ وقتك في التمدد، جسمك يحتاجه." },
    { id: 'set_complete_1', text: "واحدة أخيرة. أعطِ كل شيء." },
    { id: 'set_complete_2', text: "انتهى. عمل رائع." },
    { id: 'rest_mid_1', text: "توقف. هز ذراعيك، ارخِ كتفيك." },
    { id: 'rest_mid_2', text: "راحة. أنت على الطريق الصحيح." },
    { id: 'rest_mid_3', text: "خذ نفساً. لقد قطعت نصف الطريق." },
    { id: 'rest_mid_4', text: "استغل هذه اللحظة لإرخاء التوترات." },
    { id: 'rest_mid_5', text: "راحة. كل تمرين تنهيه يقربك من النتيجة." },
    { id: 'rest_end_1',  text: "راحة. النهاية قريبة، تمسك." },
    { id: 'rest_end_2',  text: "بقي فقط بعض التمارين." },
    { id: 'rest_end_3',  text: "الميل الأخير." },
    { id: 'rest_end_4',  text: "تنفس. اقتربت من النهاية، لا تستسلم." },
    { id: 'rest_end_5',  text: "الأصعب خلفك الآن." },
    { id: 'motivation_1',    text: "استمر بنفس الطريقة." },
    { id: 'motivation_2',    text: "كل تكرار يبني أفضل نسخة منك." },
    { id: 'motivation_3',    text: "معظم الناس استسلموا. أنت لا." },
    { id: 'motivation_4',    text: "الانضباط يتغلب دائماً على التحفيز." },
    { id: 'motivation_5',    text: "نسختك المستقبلية تشكرك على هذا الجهد." },
    { id: 'motivation_wl_1', text: "أيضك يعمل بكامل طاقته الآن." },
    { id: 'motivation_wl_2', text: "استمر، جسمك يتحول الآن." },
    { id: 'motivation_m_1',  text: "عضلاتك تنمو في هذه اللحظة." },
    { id: 'motivation_m_2',  text: "تحكم، توتر، نتيجة." },
    { id: 'motivation_e_1',  text: "قلبك يصبح أكثر كفاءة مع كل جلسة." },
    { id: 'motivation_e_2',  text: "أنت تتجاوز حدودك أكثر فأكثر." },
    { id: 'motivation_h_1',  text: "أنت تقوم بأفضل استثمار ممكن: صحتك." },
    { id: 'motivation_h_2',  text: "كل حركة هي هدية لجسمك." },
    { id: 'motivation_end',  text: "ستشعر بتحسن كبير بعد هذا." },
    { id: 'injury_knee',            text: "انتبه لركبتيك. لا تنزل كثيراً إذا شعرت بانزعاج." },
    { id: 'injury_knee_2',          text: "تحكم جيداً في الحركة لحماية ركبتيك." },
    { id: 'injury_shoulder',        text: "لا تنزل كثيراً لحماية كتفك." },
    { id: 'injury_wrist',           text: "ابقَ على ساعديك لحماية رسغيك." },
    { id: 'injury_back',            text: "اشدد عضلات البطن لحماية ظهرك." },
    { id: 'injury_shoulder_2',      text: "إذا شعرت بشد في الكتف، انتقل للنسخة على الساعد." },
    { id: 'injury_back_2',          text: "ارفع ببطء. لا تضغط على أسفل الظهر." },
    { id: 'injury_knee_3',          text: "إذا كان ألم الركبة شديداً، ارتفع قليلاً." },
    { id: 'injury_back_3',          text: "أبقِ أسفل ظهرك ملتصقاً بالأرض." },
    { id: 'injury_preg',            text: "جميع التمارين آمنة لك. لا حركات على البطن، فقط اللطف." },
    { id: 'injury_multi',           text: "كيّفت الجلسة لمناطقك الحساسة. استمع لجسمك، لا تتجاوز الألم أبداً." },
    { id: 'injury_single_knee',     text: "كيّفت الجلسة لحماية ركبتك. إذا شعرت بأي ألم، توقف." },
    { id: 'injury_single_back',     text: "كيّفت الجلسة لحماية ظهرك. إذا شعرت بأي ألم، توقف." },
    { id: 'injury_single_shoulder', text: "كيّفت الجلسة لحماية كتفك. إذا شعرت بأي ألم، توقف." },
    { id: 'injury_single_wrist',    text: "كيّفت الجلسة لحماية رسغك. إذا شعرت بأي ألم، توقف." },
    { id: 'injury_single_hip',      text: "كيّفت الجلسة لحماية وركك. إذا شعرت بأي ألم، توقف." },
    { id: 'injury_single_ankle',    text: "كيّفت الجلسة لحماية كاحلك. إذا شعرت بأي ألم، توقف." },
    { id: 'ex_plank',            text: "الجسم مشدود من الرأس حتى القدمين." },
    { id: 'ex_pushup',           text: "انزل الصدر نحو الأرض، ليس البطن. ادفع بقوة عند الصعود." },
    { id: 'ex_knee_pushup',      text: "الركبتان على الأرض، الظهر مستقيم." },
    { id: 'ex_wide_pushup',      text: "اليدان أوسع من الكتفين، ركز على عضلة الصدر." },
    { id: 'ex_diamond_pushup',   text: "اليدان قريبتان تحت الصدر، المرفقان قرب الجسم." },
    { id: 'ex_pike_pushup',      text: "الوركان للأعلى، اثنِ المرفقين لإنزال الرأس نحو الأرض." },
    { id: 'ex_squat',            text: "الثقل على الكعبين، لا على الأصابع. الصدر للأعلى، النظر للأمام." },
    { id: 'ex_lunge',            text: "خطوة كبيرة للأمام، الركبة الخلفية نحو الأرض. الجذع مستقيم." },
    { id: 'ex_bss',              text: "قدم على الدعامة، انزل على الساق الأمامية، الركبة محاذية للقدم." },
    { id: 'ex_side_plank',       text: "الجسم مستقيم، الوركان مرتفعان. إذا شعرت بشد في الكتف، انتقل للساعد." },
    { id: 'ex_glute_bridge',     text: "ادفع الوركين نحو السقف. اشدد عضلات المؤخرة بقوة في أعلى الحركة." },
    { id: 'ex_mountain_climber', text: "الكتفان فوق اليدين. الوركان منخفضان." },
    { id: 'ex_wall_sit',         text: "الفخذان موازيان للأرض، الركبتان بزاوية تسعين درجة. تنفس بهدوء." },
    { id: 'ex_hollow_body',      text: "ظهرك ملتصق بالأرض كهيكل قارب." },
    { id: 'ex_leg_raises',       text: "الساقان تنزلان معاً ببطء. أبقِ أسفل الظهر ملتصقاً." },
    { id: 'ex_jumping_jacks',    text: "الذراعان ترتفعان بالكامل فوق الرأس." },
    { id: 'ex_high_knees',       text: "الركبتان ترتفعان إلى مستوى الوركين. الظهر مستقيم." },
    { id: 'ex_hip_circles',      text: "اليدان على الوركين، دوائر كبيرة سلسة ومتحكم بها." },
    { id: 'ex_bird_dog',         text: "على أربع، ظهر مستوٍ. مد الذراع والساق المتقابلتين، أمسك ثانيتين." },
    { id: 'ex_superman',         text: "ارفع الذراعين والساقين معاً. اشدد عضلات المؤخرة والظهر." },
    { id: 'session_done_1', text: "انتهت الجلسة. يمكنك أن تفخر بنفسك." },
    { id: 'session_done_2', text: "انتهى. عمل ممتاز اليوم." },
    { id: 'session_done_3', text: "أحسنت، أعطيت كل شيء. الآن تعافَ جيداً." },
    { id: 'session_done_4', text: "الجلسة مؤكدة. جسمك يتقدم." },
    { id: 'countdown_1',   text: "واحد." },
    { id: 'countdown_3',   text: "ثلاثة." },
    { id: 'countdown_5',   text: "خمسة." },
    { id: 'warmup_first',  text: "نبدأ بالإحماء. خذ وقتك." },
  ],
};

// ─── Génération ElevenLabs ────────────────────────────────────────────────────

async function generateAudio(id: string, text: string, lang: string): Promise<void> {
  const outPath = path.join(OUT_DIR, `${id}.mp3`);

  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`  ⏭  ${id}.mp3 (déjà présent)`);
    return;
  }

  const { apiKey, voiceId } = LANG_CONFIG[lang];

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
    });

    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
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
  const langs = ONLY_LANG ? [ONLY_LANG] : Object.keys(PHRASES_BY_LANG);

  // Stats globales
  const totalPhrases = langs.reduce((n, l) => n + (PHRASES_BY_LANG[l]?.length ?? 0), 0);
  const totalChars   = langs.reduce((n, l) =>
    n + (PHRASES_BY_LANG[l] ?? []).reduce((m, p) => m + p.text.length, 0), 0);

  console.log(`\n🎙️  Génération Calix Audio — ElevenLabs`);
  console.log(`   Langues  : ${langs.join(', ')}`);
  console.log(`   Output   : ${OUT_DIR}`);
  console.log(`   Phrases  : ${totalPhrases} — ${totalChars} caractères\n`);

  let generated = 0, skipped = 0, failed = 0;

  for (const lang of langs) {
    const phrases = PHRASES_BY_LANG[lang];
    if (!phrases) { console.warn(`⚠️  Langue inconnue : ${lang}`); continue; }

    console.log(`\n── ${lang.toUpperCase()} (${phrases.length} phrases) ──`);
    for (const phrase of phrases) {
      // Les fichiers audio sont nommés {lang}_{id}.mp3
      const fileId = `${lang}_${phrase.id}`;
      try {
        const existed = fs.existsSync(path.join(OUT_DIR, `${fileId}.mp3`));
        await generateAudio(fileId, phrase.text, lang);
        if (!existed) generated++;
        else skipped++;
      } catch (e) {
        console.error(`  ❌  ${fileId}: ${(e as Error).message}`);
        failed++;
      }
      // Throttle: 3 req/s max (ElevenLabs free tier)
      await new Promise(r => setTimeout(r, 350));
    }
  }

  console.log(`\n✨ Terminé — ${generated} générés, ${skipped} ignorés, ${failed} erreurs`);
  console.log(`   Dossier : ${OUT_DIR}`);
}

main().catch(console.error);
