// ═══ 100 Conseils de récupération — CaliBodi ═══
// Système: 1 conseil du jour (basé sur la date) + 1 conseil personnalisé

export interface RecoveryTip {
  id: number;
  icon: string;
  title: string;
  fact: string; // Le "Savais-tu ?"
  category: 'sommeil' | 'nutrition' | 'mental' | 'mobilite' | 'hydratation' | 'habitudes' | 'science';
}

export const RECOVERY_TIPS: RecoveryTip[] = [
  // ═══ SOMMEIL (1-20) ═══
  { id: 1, icon: '🌙', title: 'Le sommeil profond', fact: 'Le sommeil profond se concentre dans les 3 premières heures. Se coucher tôt maximise la récupération musculaire de 40%.' , category: 'sommeil' },
  { id: 2, icon: '☕', title: 'Caféine et sommeil', fact: 'La caféine a une demi-vie de 5h. Un café à 15h = encore la moitié dans ton sang à 20h. Limite-toi au matin.' , category: 'sommeil' },
  { id: 3, icon: '📱', title: 'Lumière bleue', fact: 'La lumière bleue des écrans supprime ta production de mélatonine de 50%. Ton cerveau croit que c\'est encore le jour.' , category: 'sommeil' },
  { id: 4, icon: '🌡️', title: 'Température idéale', fact: 'Ton corps doit baisser de 1°C pour déclencher le sommeil. Une chambre entre 18-20°C aide naturellement.' , category: 'sommeil' },
  { id: 5, icon: '⏰', title: 'Rythme circadien', fact: 'Se coucher et se lever à heure fixe pendant 14 jours suffit pour recaler ton horloge interne.' , category: 'sommeil' },
  { id: 6, icon: '🫁', title: 'Respiration 4-7-8', fact: 'Inspire 4s, retiens 7s, expire 8s. Cette technique active le nerf vague et réduit le cortisol en 2 minutes.' , category: 'sommeil' },
  { id: 7, icon: '💤', title: 'Sieste stratégique', fact: 'Une sieste de 20 min booste la vigilance de 34% et les performances sportives de 16%. Au-delà de 30 min, tu entres en sommeil profond.' , category: 'sommeil' },
  { id: 8, icon: '🔇', title: 'Le silence', fact: 'Un bruit de fond constant (même faible) réduit la qualité du sommeil profond de 25%. Les bouchons d\'oreilles changent tout.' , category: 'sommeil' },
  { id: 9, icon: '🌅', title: 'Lumière du matin', fact: '10 minutes de lumière naturelle le matin régulent ta mélatonine pour le soir. Ton corps a besoin de ce signal.' , category: 'sommeil' },
  { id: 10, icon: '🛏️', title: 'Le lit = dormir', fact: 'Ton cerveau associe le lit à ce que tu y fais. Si tu scrolles au lit, il associe le lit à l\'éveil, pas au sommeil.' , category: 'sommeil' },
  { id: 11, icon: '🧠', title: 'Cycles de 90 min', fact: 'Un cycle de sommeil dure ~90 min. Se réveiller entre deux cycles (6h, 7h30, 9h) te donne un réveil plus frais.' , category: 'sommeil' },
  { id: 12, icon: '🍵', title: 'Tisane du soir', fact: 'La camomille contient de l\'apigénine, qui se lie aux mêmes récepteurs que les somnifères. 100% naturel.' , category: 'sommeil' },
  { id: 13, icon: '🧦', title: 'Pieds chauds', fact: 'Porter des chaussettes au lit dilate les vaisseaux des pieds, ce qui aide le corps à baisser sa température centrale. Résultat: endormissement plus rapide.' , category: 'sommeil' },
  { id: 14, icon: '🌿', title: 'Magnésium', fact: 'Le magnésium active le système nerveux parasympathique (repos). 80% des Français sont carencés. Un complément le soir peut transformer ton sommeil.' , category: 'sommeil' },
  { id: 15, icon: '📖', title: 'Lire avant de dormir', fact: '6 minutes de lecture suffisent pour réduire le stress de 68%. C\'est plus efficace que la musique ou une tisane.' , category: 'sommeil' },
  { id: 16, icon: '🏋️', title: 'Sport et sommeil', fact: 'Faire du sport augmente la durée du sommeil profond de 75%. Mais évite les séances intenses dans les 2h avant le coucher.' , category: 'sommeil' },
  { id: 17, icon: '🌊', title: 'Bruit blanc', fact: 'Le bruit blanc constant masque les sons perturbateurs. Le cerveau s\'y habitue en 3 nuits et le sommeil s\'améliore de 38%.' , category: 'sommeil' },
  { id: 18, icon: '🕯️', title: 'Rituel du soir', fact: 'Un rituel de 20 min avant le coucher (toujours le même) envoie un signal à ton cerveau: "c\'est l\'heure de dormir". En 10 jours, l\'habitude s\'installe.' , category: 'sommeil' },
  { id: 19, icon: '😮‍💨', title: 'Respiration nasale', fact: 'Respirer par le nez pendant le sommeil augmente la production d\'oxyde nitrique de 25%, améliorant l\'oxygénation des muscles pendant la récupération.' , category: 'sommeil' },
  { id: 20, icon: '🔄', title: 'Position de sommeil', fact: 'Dormir sur le côté gauche facilite la digestion et la circulation lymphatique. Le côté droit peut aggraver les reflux.' , category: 'sommeil' },

  // ═══ NUTRITION RÉCUP (21-40) ═══
  { id: 21, icon: '🥚', title: 'Protéines le soir', fact: 'La caséine (fromage blanc, lait) libère des acides aminés pendant 7h. Parfait avant le coucher pour nourrir tes muscles toute la nuit.' , category: 'nutrition' },
  { id: 22, icon: '🍌', title: 'Banane post-training', fact: 'La banane contient du tryptophane + magnésium + potassium. Le combo parfait pour la récupération musculaire et le sommeil.' , category: 'nutrition' },
  { id: 23, icon: '🍫', title: 'Chocolat noir 85%', fact: 'Le chocolat noir (85%+) contient plus de magnésium que les épinards et des flavonoïdes anti-inflammatoires. 2 carrés suffisent.' , category: 'nutrition' },
  { id: 24, icon: '🐟', title: 'Oméga-3', fact: 'Les oméga-3 réduisent les courbatures de 35% en diminuant l\'inflammation post-exercice. Le saumon en est la meilleure source.' , category: 'nutrition' },
  { id: 25, icon: '🍒', title: 'Jus de cerise', fact: 'Le jus de cerise griotte réduit les courbatures de 48h. Il contient de la mélatonine naturelle + des antioxydants puissants.' , category: 'nutrition' },
  { id: 26, icon: '🥛', title: 'Lait et récupération', fact: 'Le lait chocolaté a le ratio glucides/protéines idéal (4:1) pour la récupération. Des études le placent au même niveau que les boissons sportives.' , category: 'nutrition' },
  { id: 27, icon: '🫚', title: 'Gingembre frais', fact: 'Le gingembre réduit les douleurs musculaires de 25% grâce au gingérol, un anti-inflammatoire naturel. 2g/jour suffisent.' , category: 'nutrition' },
  { id: 28, icon: '🥜', title: 'Amandes', fact: '23 amandes = 6g de protéines + magnésium + vitamine E. Le snack de récupération parfait entre les repas.' , category: 'nutrition' },
  { id: 29, icon: '🍳', title: 'Fenêtre anabolique', fact: 'La "fenêtre de 30 min" post-training est un mythe. Tu as en réalité 2-3h pour manger sans perdre en récupération.' , category: 'nutrition' },
  { id: 30, icon: '🧄', title: 'Ail et curcuma', fact: 'L\'ail + curcuma + poivre noir = le trio anti-inflammatoire naturel le plus puissant. Le poivre augmente l\'absorption du curcuma de 2000%.' , category: 'nutrition' },
  { id: 31, icon: '🍠', title: 'Patate douce', fact: 'La patate douce a un index glycémique plus bas que la pomme de terre classique et recharge le glycogène musculaire 15% plus efficacement.' , category: 'nutrition' },
  { id: 32, icon: '🥑', title: 'Avocat', fact: 'Un avocat contient plus de potassium qu\'une banane. Le potassium est essentiel pour éviter les crampes post-entraînement.' , category: 'nutrition' },
  { id: 33, icon: '🫐', title: 'Myrtilles', fact: 'Les myrtilles sont les fruits avec le plus d\'antioxydants. 150g après l\'entraînement accélère la récupération musculaire de 20%.' , category: 'nutrition' },
  { id: 34, icon: '🍽️', title: 'Dîner léger', fact: 'Un repas lourd le soir mobilise 30% de ton énergie pour la digestion. Énergie qui devrait aller à la récupération musculaire.' , category: 'nutrition' },
  { id: 35, icon: '🥩', title: 'Protéines complètes', fact: 'Ton corps a besoin des 9 acides aminés essentiels pour reconstruire le muscle. Les œufs ont le profil le plus complet (score 100/100).' , category: 'nutrition' },
  { id: 36, icon: '🌾', title: 'Fibres et récupération', fact: 'Les fibres nourrissent les bonnes bactéries intestinales qui produisent 95% de ta sérotonine. Bon intestin = bon sommeil = bonne récup.' , category: 'nutrition' },
  { id: 37, icon: '🧈', title: 'Graisses saines', fact: 'Les acides gras sont essentiels pour produire la testostérone, l\'hormone de la récupération musculaire. Ne coupe jamais les graisses à moins de 20% de tes calories.' , category: 'nutrition' },
  { id: 38, icon: '🍯', title: 'Miel avant de dormir', fact: 'Une cuillère de miel avant le coucher stabilise le glycogène hépatique et empêche le pic de cortisol (hormone du stress) vers 3h du matin.' , category: 'nutrition' },
  { id: 39, icon: '🥗', title: 'Légumes verts', fact: 'Les épinards, brocolis et choux contiennent des composés soufrés qui activent les enzymes de détoxification. Ton foie te remerciera.' , category: 'nutrition' },
  { id: 40, icon: '🌰', title: 'Noix de cajou', fact: 'Les noix de cajou sont la source n°1 de zinc parmi les noix. Le zinc est crucial pour la synthèse protéique et la réparation musculaire.' , category: 'nutrition' },

  // ═══ MENTAL (41-55) ═══
  { id: 41, icon: '🧘', title: 'Méditation 5 min', fact: '5 minutes de méditation par jour réduisent le cortisol de 23%. Le cortisol est l\'ennemi n°1 de la récupération musculaire.' , category: 'mental' },
  { id: 42, icon: '📓', title: 'Journal de gratitude', fact: 'Écrire 3 choses positives avant de dormir active les circuits de récompense du cerveau et améliore la qualité du sommeil de 25%.' , category: 'mental' },
  { id: 43, icon: '😂', title: 'Rire', fact: 'Le rire réduit le cortisol de 39% et augmente les endorphines de 27%. Regarde une vidéo drôle après ta séance.' , category: 'mental' },
  { id: 44, icon: '🎵', title: 'Musique à 60 BPM', fact: 'La musique lente (60 BPM) synchronise ton rythme cardiaque et te fait entrer en relaxation profonde en 5 minutes.' , category: 'mental' },
  { id: 45, icon: '🌳', title: 'Nature et récupération', fact: '20 minutes dans la nature réduisent le cortisol de 21%. Même regarder des photos de nature réduit le stress de 13%.' , category: 'mental' },
  { id: 46, icon: '🤝', title: 'Lien social', fact: 'Le contact humain positif libère de l\'ocytocine, qui réduit l\'inflammation et accélère la guérison. Appelle un ami après ta séance.' , category: 'mental' },
  { id: 47, icon: '🎯', title: 'Visualisation', fact: 'Les athlètes qui visualisent leur récupération récupèrent 15% plus vite. Le cerveau ne distingue pas l\'imaginé du réel pour certains processus.' , category: 'mental' },
  { id: 48, icon: '🐶', title: 'Animaux et stress', fact: 'Caresser un animal pendant 10 min réduit le cortisol de 23% et la tension artérielle de 10%. Si tu as un animal, profites-en après le sport.' , category: 'mental' },
  { id: 49, icon: '🎨', title: 'Activité créative', fact: 'Dessiner, cuisiner ou jouer de la musique pendant 45 min réduit le cortisol de 75%. La créativité est un anti-stress surpuissant.' , category: 'mental' },
  { id: 50, icon: '☀️', title: 'Dopamine matinale', fact: 'La lumière du soleil dans les 30 premières minutes après le réveil booste ta dopamine de 50% pour toute la journée.' , category: 'mental' },
  { id: 51, icon: '🧊', title: 'Douche froide', fact: 'Une douche froide de 30s active le nerf vague et booste la noradrénaline de 530%. Résultat: plus d\'énergie et moins d\'inflammation.' , category: 'mental' },
  { id: 52, icon: '💆', title: 'Auto-massage', fact: '10 minutes d\'auto-massage des pieds avant de dormir activent 7200 terminaisons nerveuses qui envoient des signaux de relaxation au cerveau.' , category: 'mental' },
  { id: 53, icon: '🏖️', title: 'Jour de repos', fact: 'Un jour de repos n\'est pas un jour perdu. C\'est pendant le repos que tes muscles grandissent. Le sur-entraînement te fait RECULER.' , category: 'mental' },
  { id: 54, icon: '🎮', title: 'Plaisir et récup', fact: 'Faire quelque chose qui te fait plaisir libère de la sérotonine, qui se convertit en mélatonine le soir. Le plaisir aide au sommeil.' , category: 'mental' },
  { id: 55, icon: '✍️', title: 'Brain dump', fact: 'Écrire toutes tes pensées sur papier avant de dormir réduit le temps d\'endormissement de 50%. Ton cerveau lâche prise quand c\'est "noté".' , category: 'mental' },

  // ═══ MOBILITÉ (56-70) ═══
  { id: 56, icon: '🧘‍♂️', title: 'Étirements statiques', fact: 'Les étirements APRÈS l\'entraînement (pas avant) réduisent les courbatures de 20% et améliorent la flexibilité à long terme.' , category: 'mobilite' },
  { id: 57, icon: '🔄', title: 'Foam roller', fact: 'Le foam roller après le sport augmente le flux sanguin de 40% vers les muscles travaillés, accélérant l\'élimination des déchets métaboliques.' , category: 'mobilite' },
  { id: 58, icon: '🦵', title: 'Hanches serrées', fact: 'Rester assis 8h/jour raccourcit les fléchisseurs de hanche de 20%. 2 minutes d\'étirement par côté par jour corrigent ça en 3 semaines.' , category: 'mobilite' },
  { id: 59, icon: '🔙', title: 'Mal de dos', fact: '80% des douleurs de dos viennent de muscles abdominaux faibles, pas du dos lui-même. Renforce ton core pour protéger ton dos.' , category: 'mobilite' },
  { id: 60, icon: '🦶', title: 'Mobilité des chevilles', fact: 'Des chevilles raides limitent la profondeur de ton squat de 30%. 5 rotations par jour dans chaque sens changent tout en 2 semaines.' , category: 'mobilite' },
  { id: 61, icon: '🤸', title: 'Mobilité thoracique', fact: 'La colonne thoracique est la zone la plus négligée. Elle affecte les épaules, le cou ET le bas du dos. 3 min/jour de rotation.' , category: 'mobilite' },
  { id: 62, icon: '🧎', title: 'Position accroupie', fact: 'Les humains sont faits pour s\'accroupir. 5 minutes par jour en squat profond restaurent la mobilité naturelle des hanches et chevilles.' , category: 'mobilite' },
  { id: 63, icon: '🤲', title: 'Poignets', fact: 'Les poignets supportent tout ton poids en planche et pompes. 1 minute de rotations et flexions/extensions avant chaque séance prévient 90% des blessures.' , category: 'mobilite' },
  { id: 64, icon: '🙆', title: 'Épaules', fact: 'Les "pass-throughs" avec un manche à balai (10 reps) améliorent la mobilité des épaules de 15% en 2 semaines.' , category: 'mobilite' },
  { id: 65, icon: '👣', title: 'Marcher pieds nus', fact: 'Marcher pieds nus 15 min/jour active 200 000 terminaisons nerveuses du pied et renforce les muscles stabilisateurs de la cheville.' , category: 'mobilite' },
  { id: 66, icon: '🐱', title: 'Cat-Cow le matin', fact: '10 répétitions de Cat-Cow au réveil lubrifient les disques de ta colonne vertébrale et réduisent les raideurs matinales de 60%.' , category: 'mobilite' },
  { id: 67, icon: '🦴', title: 'Articulations', fact: 'Le liquide synovial (lubrifiant articulaire) est produit UNIQUEMENT quand tu bouges. Pas de mouvement = articulations sèches.' , category: 'mobilite' },
  { id: 68, icon: '🪑', title: 'Contre la position assise', fact: 'Pour chaque heure assise, 5 minutes de mouvement suffisent à contrer les effets négatifs sur ta circulation et tes muscles.' , category: 'mobilite' },
  { id: 69, icon: '🏃', title: 'Marche active', fact: 'La marche à 5 km/h pendant 20 min après l\'entraînement élimine l\'acide lactique 2x plus vite que le repos complet.' , category: 'mobilite' },
  { id: 70, icon: '🧍', title: 'Posture', fact: 'Une bonne posture augmente la capacité respiratoire de 30% et réduit la fatigue de 25%. Grandis-toi comme si un fil tirait ta tête vers le ciel.' , category: 'mobilite' },

  // ═══ HYDRATATION (71-80) ═══
  { id: 71, icon: '💧', title: 'Eau et muscles', fact: 'Le muscle est composé de 75% d\'eau. Une déshydratation de seulement 2% réduit tes performances de 20%.' , category: 'hydratation' },
  { id: 72, icon: '🧂', title: 'Électrolytes', fact: 'L\'eau seule ne suffit pas. Une pincée de sel + jus de citron dans ton eau restaurent le sodium et potassium perdus en sueur.' , category: 'hydratation' },
  { id: 73, icon: '🚰', title: 'Au réveil', fact: 'Tu perds environ 500ml d\'eau pendant la nuit par la respiration. Un grand verre d\'eau au réveil relance ton métabolisme de 24%.' , category: 'hydratation' },
  { id: 74, icon: '🍉', title: 'Aliments hydratants', fact: 'La pastèque, le concombre et la tomate sont composés de 95% d\'eau. Manger ces aliments hydrate autant que boire.' , category: 'hydratation' },
  { id: 75, icon: '🫗', title: 'Petites gorgées', fact: 'Boire par petites gorgées régulières hydrate 25% mieux que boire 500ml d\'un coup. Le corps absorbe max 200ml toutes les 15 min.' , category: 'hydratation' },
  { id: 76, icon: '🍋', title: 'Eau citronnée', fact: 'Le citron alcalinise l\'organisme et aide à éliminer l\'acide urique, un déchet métabolique qui cause des douleurs articulaires.' , category: 'hydratation' },
  { id: 77, icon: '🫧', title: 'Eau gazeuse', fact: 'L\'eau gazeuse hydrate aussi bien que l\'eau plate. Le gaz carbonique n\'a aucun effet négatif sur les os (c\'est un mythe).' , category: 'hydratation' },
  { id: 78, icon: '🍺', title: 'Alcool et récup', fact: 'L\'alcool réduit la synthèse protéique musculaire de 37% et supprime l\'hormone de croissance pendant le sommeil. Un verre = 24h de récup en moins.' , category: 'hydratation' },
  { id: 79, icon: '☕', title: 'Café et hydratation', fact: 'Le café est un diurétique léger mais l\'eau qu\'il contient compense largement. 3 tasses/jour ne déshydratent PAS.' , category: 'hydratation' },
  { id: 80, icon: '🥤', title: 'Pendant l\'effort', fact: 'Bois 150-250ml toutes les 15 min pendant l\'entraînement. Au-delà de 45 min d\'effort, ajoute des glucides (jus dilué).' , category: 'hydratation' },

  // ═══ HABITUDES & SCIENCE (81-100) ═══
  { id: 81, icon: '📊', title: 'Surcompensation', fact: 'Après l\'entraînement, ton muscle est PLUS FAIBLE pendant 24-48h. C\'est ensuite qu\'il surcompense et devient plus fort qu\'avant.' , category: 'science' },
  { id: 82, icon: '🧬', title: 'Hormone de croissance', fact: '75% de l\'hormone de croissance est libérée pendant le sommeil profond. Pas de sommeil = pas de muscles, même avec le meilleur programme.' , category: 'science' },
  { id: 83, icon: '🔬', title: 'Micro-déchirures', fact: 'L\'entraînement crée des micro-déchirures dans tes fibres musculaires. C\'est la réparation de ces déchirures qui rend le muscle plus gros et plus fort.' , category: 'science' },
  { id: 84, icon: '🔥', title: 'Afterburn effect', fact: 'Après un entraînement intense, ton métabolisme reste élevé pendant 24-48h. Tu brûles des calories même en dormant.' , category: 'science' },
  { id: 85, icon: '💪', title: 'Mémoire musculaire', fact: 'La mémoire musculaire est réelle. Si tu arrêtes le sport et reprends, tu récupères ton niveau 2-3x plus vite grâce aux noyaux cellulaires conservés.' , category: 'science' },
  { id: 86, icon: '🩸', title: 'Circulation', fact: 'L\'alternance chaud/froid (douche) augmente la circulation sanguine de 40%, apportant plus de nutriments aux muscles fatigués.' , category: 'science' },
  { id: 87, icon: '⚡', title: 'Glycogène', fact: 'Tes réserves de glycogène mettent 24-48h à se reconstituer complètement. C\'est pour ça que tu es plus faible le lendemain d\'une séance intense.' , category: 'science' },
  { id: 88, icon: '🫀', title: 'Variabilité cardiaque', fact: 'La variabilité de fréquence cardiaque (VFC) est le meilleur indicateur de récupération. Une VFC élevée au réveil = tu es prêt.' , category: 'science' },
  { id: 89, icon: '🧪', title: 'Cortisol du matin', fact: 'Le cortisol est naturellement haut le matin (+50%). C\'est normal et souhaitable. Il te donne de l\'énergie pour la journée.' , category: 'science' },
  { id: 90, icon: '🦠', title: 'Immunité et sport', fact: 'Un entraînement modéré booste l\'immunité de 30%. Mais le surentraînement la réduit de 50%. Respecte tes jours de repos.' , category: 'science' },
  { id: 91, icon: '📅', title: 'Régularité > Intensité', fact: '3 séances/semaine pendant 1 an battent 7 séances/semaine pendant 2 mois. La constance est reine.' , category: 'habitudes' },
  { id: 92, icon: '🎯', title: 'Règle des 2 min', fact: 'Si tu n\'as pas la motivation, engage-toi pour 2 minutes seulement. 90% du temps, tu continueras. Le plus dur c\'est de commencer.' , category: 'habitudes' },
  { id: 93, icon: '📸', title: 'Photos de progression', fact: 'Le miroir ment parce que tu te vois tous les jours. Une photo par mois te montrera des changements que tu ne peux pas voir autrement.' , category: 'habitudes' },
  { id: 94, icon: '🪞', title: 'Effet composé', fact: '1% d\'amélioration par jour = 37x mieux en 1 an. Les petits progrès quotidiens créent des résultats extraordinaires.' , category: 'habitudes' },
  { id: 95, icon: '🏆', title: 'Streak power', fact: 'Après 21 jours consécutifs, une habitude devient semi-automatique. Après 66 jours, elle est ancrée. Ne brise pas ta série.' , category: 'habitudes' },
  { id: 96, icon: '👕', title: 'Prépare ta tenue', fact: 'Poser ta tenue de sport la veille au soir augmente de 40% les chances que tu fasses ta séance. Réduis la friction au maximum.' , category: 'habitudes' },
  { id: 97, icon: '🤔', title: 'Écoute ton corps', fact: 'Une douleur PENDANT l\'exercice = STOP. Une courbature le lendemain = normal. Apprendre la différence évite 90% des blessures.' , category: 'habitudes' },
  { id: 98, icon: '📱', title: 'Moins de scroll', fact: 'Chaque minute de scroll = 1 minute de récupération en moins. Le temps moyen sur les réseaux: 2h27/jour. Imagine cette énergie investie dans ton corps.' , category: 'habitudes' },
  { id: 99, icon: '🌈', title: 'Progression non-linéaire', fact: 'La progression n\'est JAMAIS une ligne droite. Tu auras des semaines où tu recules. C\'est normal. Le trend sur 30 jours est ce qui compte.' , category: 'habitudes' },
  { id: 100, icon: '🎉', title: 'Célèbre tes victoires', fact: 'Célébrer chaque petite victoire libère de la dopamine, qui renforce le circuit de motivation. Sois fier de chaque séance terminée.' , category: 'habitudes' },
];

// Get tip of the day based on date (cycles through all 100)
export function getTipOfDay(): RecoveryTip {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return RECOVERY_TIPS[dayOfYear % RECOVERY_TIPS.length];
}

// Get personalized tip based on user context
export function getPersonalizedTip(context: {
  sleepScore?: number;
  didSessionToday?: boolean;
  streak?: number;
  waterProgress?: number;
  goal?: string;
  cyclePhase?: string;
}): RecoveryTip | null {
  const { sleepScore, didSessionToday, streak, waterProgress, goal } = context;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  // Priority: address the weakest area
  if (sleepScore !== undefined && sleepScore < 50) {
    const sleepTips = RECOVERY_TIPS.filter(t => t.category === 'sommeil');
    return sleepTips[dayOfYear % sleepTips.length];
  }
  if (waterProgress !== undefined && waterProgress < 40) {
    const waterTips = RECOVERY_TIPS.filter(t => t.category === 'hydratation');
    return waterTips[dayOfYear % waterTips.length];
  }
  if (didSessionToday) {
    const nutTips = RECOVERY_TIPS.filter(t => t.category === 'nutrition');
    return nutTips[dayOfYear % nutTips.length];
  }
  if (streak !== undefined && streak > 5) {
    const mentalTips = RECOVERY_TIPS.filter(t => t.category === 'mental');
    return mentalTips[dayOfYear % mentalTips.length];
  }
  return null;
}

export interface SleepHabitAdvice {
  icon: string;
  title: string;
  message: string;
  action: string;
}

// Analyse les derniers logs sommeil et génère des conseils concrets
export function getSleepHabitAdvice(entries: { bedTime: string; wakeTime: string; duration: number; quality: number; score: number; isNap?: boolean }[]): SleepHabitAdvice[] {
  const nights = entries.filter(e => !e.isNap).slice(-7);
  if (nights.length === 0) return [];

  const advice: SleepHabitAdvice[] = [];

  // Analyse heure de coucher
  const bedHours = nights
    .map(e => {
      const [h, m] = e.bedTime.split(':').map(Number);
      return isNaN(h) ? null : h + m / 60;
    })
    .filter((h): h is number => h !== null)
    .map(h => (h < 6 ? h + 24 : h)); // normalise 0h → 24h

  if (bedHours.length >= 3) {
    const avgBed = bedHours.reduce((a, b) => a + b, 0) / bedHours.length;
    const lateBeds = bedHours.filter(h => h >= 23.5).length;
    if (lateBeds >= 2 || avgBed >= 23.5) {
      const targetHour = Math.max(22, Math.round(avgBed) - 1);
      advice.push({
        icon: '🌙',
        title: 'Tu te couches trop tard',
        message: `Tu t'es couché(e) après minuit ${lateBeds} fois cette semaine. La mélatonine est optimale entre 22h et 23h.`,
        action: `Ce soir, vise ${targetHour}h00 — même 30 min plus tôt change tout à la qualité de ta récupération.`,
      });
    }
  }

  // Analyse durée
  const avgDuration = nights.reduce((a, b) => a + b.duration, 0) / nights.length / 60;
  const shortNights = nights.filter(e => e.duration < 360).length;
  if (shortNights >= 2 || avgDuration < 6.5) {
    advice.push({
      icon: '⏱️',
      title: 'Nuits trop courtes',
      message: `Durée moyenne cette semaine : ${avgDuration.toFixed(1)}h. En dessous de 7h, la récupération musculaire est incomplète.`,
      action: 'Essaie de te coucher 30 min plus tôt chaque soir cette semaine pour récupérer ta dette de sommeil.',
    });
  }

  // Analyse qualité
  const avgQuality = nights.reduce((a, b) => a + b.quality, 0) / nights.length;
  if (avgQuality < 3) {
    advice.push({
      icon: '😴',
      title: 'Sommeil peu réparateur',
      message: `Ta qualité moyenne est de ${avgQuality.toFixed(1)}/5. Un sommeil léger ou agité empêche la sécrétion d'hormone de croissance.`,
      action: 'Évite les écrans 1h avant de dormir et garde ta chambre à 18–19°C pour améliorer la profondeur du sommeil.',
    });
  }

  // Analyse régularité
  if (bedHours.length >= 4) {
    const maxDiff = Math.max(...bedHours) - Math.min(...bedHours);
    if (maxDiff > 2) {
      advice.push({
        icon: '📅',
        title: 'Horaires irréguliers',
        message: `Tes heures de coucher varient de plus de ${maxDiff.toFixed(0)}h cette semaine. L'irrégularité perturbe ton rythme circadien.`,
        action: 'Fixe une heure de coucher et de réveil identique 7j/7 pendant 2 semaines — même le week-end.',
      });
    }
  }

  // Score moyen faible
  const avgScore = nights.reduce((a, b) => a + b.score, 0) / nights.length;
  if (avgScore < 55 && advice.length === 0) {
    advice.push({
      icon: '💡',
      title: 'Récupération insuffisante',
      message: `Ton score moyen est de ${Math.round(avgScore)}/100 cette semaine. Le sommeil représente 30% de ta performance sportive.`,
      action: 'Commence par une routine simple : même heure de coucher, chambre sombre et fraîche, pas d\'écran 45 min avant.',
    });
  }

  return advice.slice(0, 3);
}
