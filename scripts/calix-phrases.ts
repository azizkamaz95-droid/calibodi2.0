/**
 * Calix Voice — All static phrases to pre-generate with ElevenLabs
 * Run: npx ts-node scripts/calix-phrases.ts
 * Output: list of all phrases with their audio file IDs
 */

export const CALIX_PHRASES: Record<string, string> = {

  // ─── Session Start ───────────────────────────────────────────────
  "start_weightloss_1": "C'est parti. Aujourd'hui on brûle, on transpire, on avance.",
  "start_weightloss_2": "Séance brûle-graisses. Chaque calorie compte.",
  "start_weightloss_3": "On attaque. Objectif : faire travailler ton métabolisme à fond.",
  "start_muscle_1": "C'est l'heure de construire. Chaque répétition sculpte ton corps.",
  "start_muscle_2": "Séance renforcement. On cherche la qualité du mouvement.",
  "start_muscle_3": "On y va. Contrôle chaque mouvement, sens chaque muscle.",
  "start_endurance_1": "Séance endurance. On va chercher le souffle et la résistance.",
  "start_endurance_2": "Aujourd'hui on repousse tes limites cardio.",
  "start_endurance_3": "C'est parti. Rythme régulier, respiration contrôlée.",
  "start_health_1": "C'est parti. On prend soin de ton corps aujourd'hui.",
  "start_health_2": "Une séance pour se sentir bien dans son corps.",
  "start_health_3": "On y va en douceur mais avec détermination.",

  // ─── Session Start — Mode extras ────────────────────────────────
  "start_mode_voyage": "Séance adaptée, pas besoin de matériel.",
  "start_mode_fatigue": "On écoute ton corps aujourd'hui, pas de pression.",
  "start_mode_express": "Séance courte mais intense, chaque seconde compte.",
  "start_mode_cycle": "Séance adaptée à ta phase actuelle. On respecte ton rythme.",

  // ─── Injury acknowledgment ───────────────────────────────────────
  "injury_single_knee": "J'ai adapté la séance pour protéger ton genou. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_single_back": "J'ai adapté la séance pour protéger ton dos. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_single_shoulder": "J'ai adapté la séance pour protéger ton épaule. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_single_wrist": "J'ai adapté la séance pour protéger ton poignet. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_single_hip": "J'ai adapté la séance pour protéger ta hanche. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_single_ankle": "J'ai adapté la séance pour protéger ta cheville. Si tu ressens la moindre douleur, arrête-toi.",
  "injury_multiple": "J'ai adapté la séance pour tes zones sensibles. Écoute ton corps, on ne force jamais sur la douleur.",
  "injury_pregnancy": "Tous les exercices sont sécurisés pour toi. Pas de mouvement sur le ventre, que de la douceur.",

  // ─── Warmup → Main ──────────────────────────────────────────────
  "warmup_to_main_1": "Bien. Maintenant on passe aux choses sérieuses.",
  "warmup_to_main_2": "Échauffement terminé. Tes muscles sont prêts, on attaque le bloc principal.",
  "warmup_to_main_3": "Parfait, le corps est prêt. On monte en intensité maintenant.",
  "warmup_to_main_4": "Bien échauffé. C'est maintenant que ça commence vraiment.",
  "warmup_to_main_5": "Les muscles sont chauds. On passe à l'entraînement.",

  // ─── Main → Cooldown ─────────────────────────────────────────────
  "main_to_cooldown_1": "Le plus dur est fait. On termine avec quelques étirements pour bien récupérer.",
  "main_to_cooldown_2": "Excellent travail. Place au retour au calme, c'est aussi important que l'effort.",
  "main_to_cooldown_3": "Bravo, bloc principal terminé. On étire les muscles qui ont travaillé.",
  "main_to_cooldown_4": "La partie intense est finie. Prends le temps de t'étirer, ton corps en a besoin.",

  // ─── Rest — Early session ────────────────────────────────────────
  "rest_early_1": "Repos.",
  "rest_early_2": "Respire calmement.",
  "rest_early_3": "Pause. Secoue les bras, détends les épaules.",
  "rest_early_4": "Bon début.",
  "rest_early_5": "Souffle.",
  "rest_early_6": "Bois de l'eau si tu en as besoin.",

  // ─── Rest — Mid session ──────────────────────────────────────────
  "rest_mid_1": "Repos. Tu es sur la bonne voie.",
  "rest_mid_2": "Pause bien méritée.",
  "rest_mid_3": "Souffle un coup. La moitié est faite.",
  "rest_mid_4": "Profite-en pour relâcher les tensions.",
  "rest_mid_5": "Repos. Chaque exercice que tu termines te rapproche du résultat.",
  "rest_mid_6": "Ton corps travaille même pendant le repos.",

  // ─── Rest — Late session ─────────────────────────────────────────
  "rest_late_1": "Repos. La fin approche, tiens bon.",
  "rest_late_2": "Plus que quelques exercices.",
  "rest_late_3": "Dernière ligne droite.",
  "rest_late_4": "Souffle. Tu as presque fini, ne lâche rien.",
  "rest_late_5": "Le plus dur est derrière toi.",
  "rest_late_6": "Repos. Tu vas terminer cette séance, aucun doute.",

  // ─── Set complete ────────────────────────────────────────────────
  "set_complete_1": "Exercice terminé.",
  "set_complete_2": "C'est fait. On passe au suivant.",
  "set_complete_3": "Terminé. Beau travail.",
  "set_complete_4": "Validé.",
  "set_last_1": "Encore une seule. Donne tout.",
  "set_remaining_1": "Bien. On continue.",
  "set_remaining_2": "C'est bon. On enchaîne.",
  "set_remaining_3": "Parfait.",
  "set_remaining_4": "Validé.",

  // ─── Set announcements ───────────────────────────────────────────
  "set_announce_1": "Go.",
  "set_announce_2": "On enchaîne.",
  "set_announce_3": "C'est reparti.",
  "set_announce_last": "Dernière série.",

  // ─── Countdown ───────────────────────────────────────────────────
  "countdown_5": "Cinq.",
  "countdown_3": "Trois.",
  "countdown_1": "Et un !",

  // ─── Motivation ──────────────────────────────────────────────────
  "motivation_1": "Continue exactement comme ça.",
  "motivation_2": "Chaque répétition construit la meilleure version de toi.",
  "motivation_3": "La plupart des gens ont déjà abandonné. Pas toi.",
  "motivation_4": "La discipline bat toujours la motivation.",
  "motivation_5": "Ton futur toi te remercie pour cet effort.",
  "motivation_wl_1": "Ton métabolisme tourne à plein régime là.",
  "motivation_wl_2": "Chaque goutte de sueur est du gras qui s'en va.",
  "motivation_wl_3": "Continue, ton corps est en train de se transformer.",
  "motivation_muscle_1": "Tes muscles grandissent en ce moment même.",
  "motivation_muscle_2": "La brûlure que tu sens, c'est la progression.",
  "motivation_muscle_3": "Contrôle, tension, résultat.",
  "motivation_endurance_1": "Ton cœur devient plus efficace à chaque séance.",
  "motivation_endurance_2": "Tu repousses tes limites un peu plus loin.",
  "motivation_endurance_3": "La résistance se construit dans l'inconfort.",
  "motivation_health_1": "Tu fais le meilleur investissement possible : ta santé.",
  "motivation_health_2": "Chaque mouvement est un cadeau pour ton corps.",
  "motivation_health_3": "Tu te sentiras tellement bien après.",

  // ─── Reps remaining ──────────────────────────────────────────────
  "reps_3": "Plus que trois.",
  "reps_1": "Dernière !",

  // ─── Goal tips ───────────────────────────────────────────────────
  "tip_wl_1": "Garde un rythme soutenu pour maximiser la dépense.",
  "tip_wl_2": "Plus tu contrôles, plus tu brûles.",
  "tip_muscle_1": "Tempo lent à la descente, explosif à la montée.",
  "tip_muscle_2": "Contracte bien le muscle ciblé.",
  "tip_endurance_1": "Respire régulièrement.",
  "tip_endurance_2": "Trouve ton rythme et maintiens-le.",
  "tip_health_1": "Profite de chaque mouvement.",
  "tip_health_2": "Le plus important c'est d'être là.",

  // ─── Posture cues ────────────────────────────────────────────────
  "cue_pushup_1": "Corps bien gainé de la tête aux pieds.",
  "cue_pushup_2": "Descends la poitrine vers le sol, pas le ventre.",
  "cue_pushup_3": "Pousse fort en montant.",
  "cue_squat_1": "Le poids sur les talons, pas sur les pointes.",
  "cue_squat_2": "Imagine que tu t'assoies sur une chaise invisible.",
  "cue_squat_3": "Poitrine haute, regard devant.",
  "cue_plank_1": "Imagine une ligne droite de ta tête à tes talons.",
  "cue_plank_2": "Respire, ne bloque pas.",
  "cue_lunge_1": "Grand pas en avant, genou arrière vers le sol.",
  "cue_lunge_2": "Le buste reste vertical.",
  "cue_glute_bridge_1": "Pousse le bassin vers le plafond.",
  "cue_glute_bridge_2": "Serre fort les fessiers en haut du mouvement.",
  "cue_glute_bridge_3": "Redescends lentement.",
  "cue_burpee_1": "Mouvement fluide, pas saccadé.",
  "cue_mountain_climber_1": "Les épaules restent au-dessus des mains.",
  "cue_wall_sit_1": "Tes cuisses doivent brûler, c'est bon signe.",
  "cue_wall_sit_2": "Respire calmement, ne retiens pas ton souffle.",
  "cue_hollow_body_1": "Ton dos est comme une coque de bateau.",
  "cue_leg_raises_1": "Les jambes descendent ensemble, lentement.",
  "cue_cobra_1": "Ouvre la poitrine vers le ciel.",
  "cue_jumping_jacks_1": "Les bras montent complètement au-dessus de la tête.",
  "cue_high_knees_1": "Les genoux montent à hauteur des hanches.",

  // ─── Session complete ────────────────────────────────────────────
  "session_done_1": "Séance terminée. Tu peux être fier de toi.",
  "session_done_2": "C'est fini. Chapeau.",
  "session_done_3": "Bravo. Ton corps te remercie.",
  "session_done_4": "C'est ça la régularité.",

  // ─── Warmup exercise intros ──────────────────────────────────────
  "warmup_first": "On commence l'échauffement.",
  "warmup_next_1": "Ensuite,",
  "warmup_next_2": "On continue avec,",

  // ─── Main exercise intros ────────────────────────────────────────
  "main_next_1": "Prochain exercice.",
  "main_next_2": "On passe à",
  "main_next_3": "Place à",

  // ─── Cooldown intros ─────────────────────────────────────────────
  "cooldown_1": "On étire. Prends ton temps.",
  "cooldown_2": "Maintenant, détends-toi.",

  // ─── Injury warnings ─────────────────────────────────────────────
  "warn_squat_knee": "Fais attention à tes genoux. Ne descends pas trop bas si tu ressens une gêne.",
  "warn_lunge_knee": "Contrôle bien le mouvement pour protéger tes genoux.",
  "warn_pushup_wrist": "Si tes poignets te font mal, fais l'exercice sur les poings.",
  "warn_pushup_shoulder": "Ne descends pas trop bas pour protéger ton épaule.",
  "warn_plank_wrist": "Reste sur les avant-bras pour épargner tes poignets.",
  "warn_plank_back": "Contracte les abdos pour protéger ton dos.",
  "warn_superman_back": "Lève doucement. Ne force pas sur le bas du dos.",
  "warn_wallsit_knee": "Si la douleur au genou est trop forte, remonte un peu.",
  "warn_burpee_knee": "Contrôle l'atterrissage pour protéger tes genoux.",
  "warn_hollow_back": "Garde le bas du dos plaqué au sol.",
  "warn_leg_raises_back": "Si ton dos se cambre, plie légèrement les genoux.",
  "warn_side_plank_shoulder": "Si ton épaule tire, fais la version sur le coude.",
  "warn_jumping_jacks_knee": "Si tes genoux sont sensibles, fais des pas latéraux à la place.",
  "warn_high_knees_knee": "Monte à ton rythme, sans forcer.",
};

console.log(`Total phrases: ${Object.keys(CALIX_PHRASES).length}`);
Object.entries(CALIX_PHRASES).forEach(([id, text]) => {
  console.log(`${id}: "${text}" (${text.length} chars)`);
});
const total = Object.values(CALIX_PHRASES).reduce((sum, t) => sum + t.length, 0);
console.log(`\nTotal characters: ${total}`);
