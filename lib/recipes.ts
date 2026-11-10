// 100 recettes CaliBodi — sans porc — avec catégories pré/post entraînement

export interface Recipe {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  difficulty: 'easy' | 'medium' | 'hard';
  budget: 'low' | 'medium' | 'high';
  prepTime: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  tags: string[];
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  substitutions: string[];
  image: string;
}

export const RECIPES: Recipe[] = [
  // ══════════════════════════════════════════
  //   🌅 PETIT-DÉJEUNER (15 recettes)
  // ══════════════════════════════════════════
  {
    id:'r1',name:'Porridge Banane Amandes',kcal:490,protein:17,carbs:65,fat:18,fiber:8,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:['végétarien','énergie','fibres'],image:'🥣',
    ingredients:[{name:'Flocons d\'avoine',quantity:'80g'},{name:'Lait ou lait végétal',quantity:'250ml'},{name:'Banane',quantity:'1'},{name:'Amandes effilées',quantity:'15g'},{name:'Miel',quantity:'1 c.à.c'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:['Chauffe le lait, ajoute les flocons et remue 5 min à feu doux.','Coupe la banane en rondelles.','Verse dans un bol, garnis de banane, amandes et miel.'],substitutions:['Noix ou graines de chia à la place des amandes.'],
  },
  {
    id:'r2',name:'Omelette aux Légumes',kcal:380,protein:28,carbs:12,fat:25,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'breakfast',tags:['protéines','low-carb','rapide'],image:'🥚',
    ingredients:[{name:'Œufs',quantity:'3'},{name:'Poivron',quantity:'1/2'},{name:'Tomate',quantity:'1'},{name:'Oignon',quantity:'1/2'},{name:'Fromage râpé',quantity:'20g'},{name:'Huile d\'olive',quantity:'1 c.à.c'}],
    steps:['Bats les œufs avec sel et poivre.','Coupe les légumes en dés et fais-les revenir 3 min.','Verse les œufs, ajoute le fromage, cuis 4-5 min à feu doux.'],substitutions:['Champignons ou épinards à la place du poivron.'],
  },
  {
    id:'r3',name:'Smoothie Bowl Protéiné',kcal:420,protein:30,carbs:50,fat:12,fiber:7,difficulty:'easy',budget:'medium',prepTime:8,category:'breakfast',tags:['protéines','fruits','rapide'],image:'🫐',
    ingredients:[{name:'Banane congelée',quantity:'1'},{name:'Myrtilles',quantity:'80g'},{name:'Whey vanille',quantity:'30g'},{name:'Lait d\'amande',quantity:'100ml'},{name:'Granola',quantity:'30g'},{name:'Beurre de cacahuète',quantity:'1 c.à.s'}],
    steps:['Mixe banane, myrtilles, whey et lait.','Verse dans un bol.','Garnis de granola et beurre de cacahuète.'],substitutions:['Yaourt grec à la place de la whey.'],
  },
  {
    id:'r4',name:'Pancakes Protéinés',kcal:450,protein:35,carbs:48,fat:14,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'breakfast',tags:['protéines','gourmand','muscle'],image:'🥞',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Œufs',quantity:'2'},{name:'Banane',quantity:'1'},{name:'Whey',quantity:'20g'},{name:'Lait',quantity:'50ml'},{name:'Fruits rouges',quantity:'50g'}],
    steps:['Mixe avoine, œufs, banane, whey et lait.','Cuis des petites louches 2 min par côté.','Sers avec les fruits rouges.'],substitutions:['Sans whey : ajoute un œuf de plus.'],
  },
  {
    id:'r5',name:'Tartines Avocat Œuf',kcal:410,protein:22,carbs:35,fat:22,fiber:8,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:['rapide','énergie','fibres'],image:'🥑',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Avocat',quantity:'1/2'},{name:'Œuf',quantity:'1'},{name:'Citron',quantity:'1 filet'},{name:'Graines de sésame',quantity:'1 c.à.c'}],
    steps:['Toaste le pain.','Écrase l\'avocat avec citron, sel et poivre.','Cuis l\'œuf au plat, pose sur les tartines.'],substitutions:['Saumon fumé à la place de l\'œuf.'],
  },
  {
    id:'r6',name:'Yaourt Grec Muesli Miel',kcal:350,protein:20,carbs:42,fat:10,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:['rapide','protéines'],image:'🍯',
    ingredients:[{name:'Yaourt grec 0%',quantity:'200g'},{name:'Muesli',quantity:'40g'},{name:'Miel',quantity:'1 c.à.c'},{name:'Fruits de saison',quantity:'100g'}],
    steps:['Verse le yaourt, ajoute muesli et fruits, arrose de miel.'],substitutions:['Granola maison à la place du muesli.'],
  },
  {
    id:'r7',name:'Shakshuka',kcal:370,protein:22,carbs:25,fat:20,fiber:5,difficulty:'easy',budget:'low',prepTime:20,category:'breakfast',tags:['protéines','épicé','végétarien'],image:'🍳',
    ingredients:[{name:'Œufs',quantity:'3'},{name:'Tomates concassées',quantity:'400g'},{name:'Poivron rouge',quantity:'1'},{name:'Oignon',quantity:'1'},{name:'Cumin + paprika',quantity:'1 c.à.c chaque'},{name:'Pain',quantity:'2 tranches'}],
    steps:['Fais revenir oignon et poivron 5 min.','Ajoute tomates et épices, mijote 10 min.','Creuse des trous, casse les œufs dedans, couvre 5 min.'],substitutions:['Ajoute de la feta émiettée.'],
  },
  {
    id:'r8',name:'Overnight Oats Mangue',kcal:440,protein:18,carbs:60,fat:14,fiber:7,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:['sans cuisson','meal-prep','fibres'],image:'🥭',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Lait',quantity:'150ml'},{name:'Yaourt',quantity:'100g'},{name:'Mangue',quantity:'100g'},{name:'Graines de chia',quantity:'1 c.à.s'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:['Mélange avoine, lait, yaourt et chia dans un bocal.','Réfrigère toute la nuit.','Le matin, ajoute la mangue coupée et le miel.'],substitutions:['Fraises ou pêche à la place de la mangue.'],
  },
  {
    id:'r9',name:'Crêpes Sarrasin Complètes',kcal:420,protein:24,carbs:40,fat:18,fiber:3,difficulty:'medium',budget:'low',prepTime:20,category:'breakfast',tags:['protéines','complet'],image:'🥞',
    ingredients:[{name:'Farine de sarrasin',quantity:'80g'},{name:'Œuf',quantity:'1'},{name:'Lait',quantity:'200ml'},{name:'Fromage râpé',quantity:'30g'},{name:'Œuf (garniture)',quantity:'1'},{name:'Champignons',quantity:'50g'}],
    steps:['Mélange farine, œuf et lait pour la pâte.','Cuis la crêpe, ajoute fromage, champignons et œuf.','Replie et sers chaud.'],substitutions:['Épinards à la place des champignons.'],
  },
  {
    id:'r10',name:'Açaí Bowl',kcal:480,protein:12,carbs:68,fat:18,fiber:10,difficulty:'easy',budget:'high',prepTime:10,category:'breakfast',tags:['antioxydants','fruits','énergie'],image:'🍇',
    ingredients:[{name:'Purée d\'açaí',quantity:'100g'},{name:'Banane congelée',quantity:'1'},{name:'Lait d\'amande',quantity:'80ml'},{name:'Granola',quantity:'30g'},{name:'Noix de coco râpée',quantity:'10g'},{name:'Fruits frais',quantity:'80g'}],
    steps:['Mixe açaí, banane et lait jusqu\'à consistance épaisse.','Verse dans un bol.','Garnis de granola, coco et fruits.'],substitutions:['Myrtilles congelées si pas d\'açaí.'],
  },
  {
    id:'r11',name:'Muffins Anglais Œuf Avocat',kcal:400,protein:20,carbs:35,fat:20,fiber:5,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:['rapide','complet'],image:'🍔',
    ingredients:[{name:'Muffin anglais complet',quantity:'1'},{name:'Œuf',quantity:'1'},{name:'Avocat',quantity:'1/4'},{name:'Tomate',quantity:'2 tranches'},{name:'Roquette',quantity:'poignée'}],
    steps:['Toaste le muffin.','Cuis l\'œuf poché ou au plat.','Assemble : avocat écrasé, tomate, roquette, œuf.'],substitutions:['Pain complet à la place du muffin.'],
  },
  {
    id:'r12',name:'Granola Maison',kcal:420,protein:12,carbs:52,fat:18,fiber:6,difficulty:'easy',budget:'low',prepTime:30,category:'breakfast',tags:['meal-prep','fibres','batch'],image:'🥣',
    ingredients:[{name:'Flocons d\'avoine',quantity:'200g'},{name:'Amandes concassées',quantity:'50g'},{name:'Miel',quantity:'3 c.à.s'},{name:'Huile de coco',quantity:'2 c.à.s'},{name:'Cannelle',quantity:'1 c.à.c'},{name:'Raisins secs',quantity:'40g'}],
    steps:['Mélange avoine, amandes, miel, huile et cannelle.','Étale sur une plaque et enfourne 20 min à 160°C.','Laisse refroidir, ajoute les raisins secs.','Conserve en bocal jusqu\'à 2 semaines.'],substitutions:['Noisettes ou noix de cajou à la place des amandes.'],
  },
  {
    id:'r13',name:'Oeufs Brouillés Saumon Fumé',kcal:380,protein:30,carbs:5,fat:27,fiber:0,difficulty:'easy',budget:'high',prepTime:10,category:'breakfast',tags:['protéines','oméga-3','low-carb'],image:'🐟',
    ingredients:[{name:'Œufs',quantity:'3'},{name:'Saumon fumé',quantity:'60g'},{name:'Ciboulette',quantity:'1 c.à.s'},{name:'Beurre',quantity:'10g'},{name:'Pain complet',quantity:'1 tranche'}],
    steps:['Bats les œufs, cuis à feu doux en remuant avec le beurre.','Ajoute le saumon fumé coupé en lanières.','Parsème de ciboulette, sers avec le pain.'],substitutions:['Truite fumée à la place du saumon.'],
  },
  {
    id:'r14',name:'Bol Fromage Blanc Fruits Secs',kcal:360,protein:25,carbs:35,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:['rapide','protéines','simple'],image:'🍑',
    ingredients:[{name:'Fromage blanc 0%',quantity:'250g'},{name:'Noix mélangées',quantity:'20g'},{name:'Miel',quantity:'1 c.à.c'},{name:'Fruits secs',quantity:'20g'}],
    steps:['Verse le fromage blanc dans un bol.','Ajoute noix, fruits secs et miel.'],substitutions:['Skyr à la place du fromage blanc.'],
  },
  {
    id:'r15',name:'Toast Ricotta Figues',kcal:350,protein:14,carbs:42,fat:14,fiber:4,difficulty:'easy',budget:'medium',prepTime:8,category:'breakfast',tags:['gourmand','rapide'],image:'🍞',
    ingredients:[{name:'Pain aux céréales',quantity:'2 tranches'},{name:'Ricotta',quantity:'80g'},{name:'Figues fraîches',quantity:'2'},{name:'Miel',quantity:'filet'},{name:'Pistaches',quantity:'10g'}],
    steps:['Toaste le pain.','Tartine de ricotta.','Ajoute les figues coupées, pistaches et miel.'],substitutions:['Pêches ou poires à la place des figues.'],
  },

  // ══════════════════════════════════════════
  //   ☀️ DÉJEUNER (20 recettes)
  // ══════════════════════════════════════════
  {
    id:'r16',name:'Bowl Saumon Quinoa',kcal:480,protein:38,carbs:42,fat:16,fiber:6,difficulty:'medium',budget:'medium',prepTime:25,category:'lunch',tags:['oméga-3','complet','protéines'],image:'🐟',
    ingredients:[{name:'Filet de saumon',quantity:'150g'},{name:'Quinoa',quantity:'80g'},{name:'Avocat',quantity:'1/2'},{name:'Edamame',quantity:'50g'},{name:'Concombre',quantity:'1/2'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:['Cuis le quinoa 15 min.','Fais revenir le saumon en cubes 3 min.','Assemble dans un bowl avec tous les légumes.'],substitutions:['Thon ou tofu à la place du saumon.'],
  },
  {
    id:'r17',name:'Poulet Grillé Riz Brocoli',kcal:420,protein:40,carbs:45,fat:8,fiber:5,difficulty:'easy',budget:'low',prepTime:20,category:'lunch',tags:['classique','muscle','protéines'],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'180g'},{name:'Riz basmati',quantity:'80g'},{name:'Brocoli',quantity:'150g'},{name:'Huile d\'olive',quantity:'1 c.à.c'},{name:'Paprika, sel, poivre',quantity:'Au goût'}],
    steps:['Cuis le riz.','Grille le poulet assaisonné 5-6 min par côté.','Vapeur le brocoli 5 min. Sers ensemble.'],substitutions:['Dinde ou tempeh à la place du poulet.'],
  },
  {
    id:'r18',name:'Salade Niçoise',kcal:520,protein:45,carbs:28,fat:26,fiber:5,difficulty:'easy',budget:'medium',prepTime:20,category:'lunch',tags:['fraîcheur','été'],image:'🥗',
    ingredients:[{name:'Thon conserve',quantity:'160g'},{name:'Œufs durs',quantity:'2'},{name:'Haricots verts',quantity:'100g'},{name:'Tomates cerises',quantity:'100g'},{name:'Olives noires',quantity:'30g'},{name:'Salade verte',quantity:'100g'}],
    steps:['Cuis œufs durs et haricots verts.','Assemble tous les ingrédients.','Arrose de vinaigrette.'],substitutions:['Saumon fumé à la place du thon.'],
  },
  {
    id:'r19',name:'Wrap Poulet César',kcal:460,protein:35,carbs:38,fat:18,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'lunch',tags:['rapide','à emporter'],image:'🌯',
    ingredients:[{name:'Tortilla complète',quantity:'1'},{name:'Poulet grillé',quantity:'150g'},{name:'Salade romaine',quantity:'50g'},{name:'Parmesan',quantity:'15g'},{name:'Sauce yaourt-citron',quantity:'2 c.à.s'}],
    steps:['Émince le poulet.','Tartine la tortilla de sauce.','Garnis, roule et coupe en deux.'],substitutions:['Falafels pour version végé.'],
  },
  {
    id:'r20',name:'Dinde & Patate Douce',kcal:523,protein:48,carbs:50,fat:14,fiber:7,difficulty:'easy',budget:'medium',prepTime:30,category:'lunch',tags:['complet','muscle'],image:'🦃',
    ingredients:[{name:'Escalope de dinde',quantity:'200g'},{name:'Patate douce',quantity:'200g'},{name:'Haricots verts',quantity:'100g'},{name:'Huile d\'olive',quantity:'1 c.à.s'},{name:'Herbes de Provence',quantity:'1 c.à.c'}],
    steps:['Four 200°C, patate douce en cubes 25 min.','Poêle la dinde 4-5 min par côté.','Vapeur haricots verts 6 min.'],substitutions:['Poulet ou saumon à la place.'],
  },
  {
    id:'r21',name:'Buddha Bowl Végétarien',kcal:510,protein:22,carbs:58,fat:22,fiber:12,difficulty:'easy',budget:'low',prepTime:20,category:'lunch',tags:['végétarien','fibres','complet'],image:'🥙',
    ingredients:[{name:'Pois chiches',quantity:'150g'},{name:'Riz complet',quantity:'80g'},{name:'Avocat',quantity:'1/2'},{name:'Carottes râpées',quantity:'100g'},{name:'Chou rouge',quantity:'50g'},{name:'Tahini + citron',quantity:'2 c.à.s'}],
    steps:['Cuis le riz.','Reviens les pois chiches avec du cumin.','Assemble le tout, arrose de tahini.'],substitutions:['Tofu grillé pour plus de protéines.'],
  },
  {
    id:'r22',name:'Pâtes Bolognaise Bœuf',kcal:550,protein:35,carbs:60,fat:18,fiber:5,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:['classique','énergie','famille'],image:'🍝',
    ingredients:[{name:'Pâtes complètes',quantity:'100g'},{name:'Bœuf haché 5%',quantity:'150g'},{name:'Tomates concassées',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Ail',quantity:'2 gousses'},{name:'Basilic',quantity:'Au goût'}],
    steps:['Cuis les pâtes.','Fais revenir oignon, ail et bœuf 5 min.','Ajoute tomates, mijote 10 min. Mélange.'],substitutions:['Lentilles pour version végé.'],
  },
  {
    id:'r23',name:'Taboulé Oriental',kcal:380,protein:10,carbs:50,fat:16,fiber:6,difficulty:'easy',budget:'low',prepTime:15,category:'lunch',tags:['fraîcheur','végétarien','à emporter'],image:'🥒',
    ingredients:[{name:'Semoule fine',quantity:'100g'},{name:'Tomates',quantity:'2'},{name:'Concombre',quantity:'1/2'},{name:'Menthe fraîche',quantity:'bouquet'},{name:'Persil',quantity:'bouquet'},{name:'Huile d\'olive + citron',quantity:'3 c.à.s'}],
    steps:['Verse de l\'eau bouillante sur la semoule, couvre 5 min.','Coupe tomates et concombre en dés.','Mélange le tout avec les herbes et la vinaigrette.'],substitutions:['Boulgour à la place de la semoule.'],
  },
  {
    id:'r24',name:'Riz Sauté Légumes Crevettes',kcal:440,protein:28,carbs:52,fat:12,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:['asiatique','rapide'],image:'🍤',
    ingredients:[{name:'Riz cuit',quantity:'200g'},{name:'Crevettes',quantity:'150g'},{name:'Poivron',quantity:'1'},{name:'Petit pois',quantity:'50g'},{name:'Sauce soja',quantity:'2 c.à.s'},{name:'Œuf',quantity:'1'}],
    steps:['Fais sauter les crevettes 2 min.','Ajoute les légumes 3 min.','Pousse sur le côté, brouille l\'œuf, mélange avec le riz et la sauce soja.'],substitutions:['Poulet à la place des crevettes.'],
  },
  {
    id:'r25',name:'Salade Lentilles Chèvre',kcal:460,protein:26,carbs:42,fat:20,fiber:10,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:['végétarien','fibres','protéines'],image:'🥗',
    ingredients:[{name:'Lentilles vertes',quantity:'150g'},{name:'Chèvre frais',quantity:'60g'},{name:'Betterave cuite',quantity:'100g'},{name:'Noix',quantity:'20g'},{name:'Roquette',quantity:'50g'},{name:'Vinaigre balsamique',quantity:'1 c.à.s'}],
    steps:['Cuis les lentilles 20 min à l\'eau.','Coupe la betterave en dés.','Mélange tout, émiette le chèvre dessus.'],substitutions:['Feta à la place du chèvre.'],
  },
  {
    id:'r26',name:'Bowl Mexicain',kcal:520,protein:30,carbs:55,fat:18,fiber:10,difficulty:'easy',budget:'low',prepTime:20,category:'lunch',tags:['épicé','complet','fibres'],image:'🌶️',
    ingredients:[{name:'Riz',quantity:'80g'},{name:'Haricots noirs',quantity:'150g'},{name:'Bœuf haché',quantity:'100g'},{name:'Maïs',quantity:'50g'},{name:'Avocat',quantity:'1/2'},{name:'Salsa',quantity:'2 c.à.s'}],
    steps:['Cuis le riz.','Fais revenir le bœuf avec cumin et paprika.','Assemble tous les ingrédients en bowl.'],substitutions:['Haricots rouges à la place des noirs.'],
  },
  {
    id:'r27',name:'Poulet Tandoori Riz',kcal:470,protein:42,carbs:48,fat:10,fiber:3,difficulty:'medium',budget:'low',prepTime:30,category:'lunch',tags:['épicé','protéines','indien'],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Yaourt nature',quantity:'100g'},{name:'Épices tandoori',quantity:'2 c.à.s'},{name:'Riz basmati',quantity:'80g'},{name:'Citron',quantity:'1/2'},{name:'Coriandre',quantity:'Au goût'}],
    steps:['Marine le poulet dans yaourt + épices 15 min minimum.','Cuis au four 200°C pendant 20 min.','Sers avec le riz et un filet de citron.'],substitutions:['Dinde à la place du poulet.'],
  },
  {
    id:'r28',name:'Couscous Légumes Poulet',kcal:530,protein:38,carbs:55,fat:16,fiber:8,difficulty:'medium',budget:'low',prepTime:35,category:'lunch',tags:['complet','familial'],image:'🍲',
    ingredients:[{name:'Semoule',quantity:'80g'},{name:'Poulet (cuisses)',quantity:'200g'},{name:'Courgettes',quantity:'1'},{name:'Carottes',quantity:'2'},{name:'Pois chiches',quantity:'100g'},{name:'Bouillon + épices',quantity:'300ml'}],
    steps:['Fais cuire le poulet dans le bouillon épicé.','Ajoute légumes coupés et pois chiches, mijote 20 min.','Prépare la semoule, sers avec le bouillon.'],substitutions:['Agneau à la place du poulet.'],
  },
  {
    id:'r29',name:'Salade Avocat Crevettes',kcal:400,protein:28,carbs:15,fat:26,fiber:7,difficulty:'easy',budget:'high',prepTime:12,category:'lunch',tags:['low-carb','oméga-3','fraîcheur'],image:'🥑',
    ingredients:[{name:'Crevettes cuites',quantity:'150g'},{name:'Avocat',quantity:'1'},{name:'Mangue',quantity:'1/2'},{name:'Salade',quantity:'100g'},{name:'Citron vert',quantity:'1'},{name:'Coriandre',quantity:'Au goût'}],
    steps:['Coupe avocat et mangue en dés.','Mélange avec les crevettes et la salade.','Arrose de jus de citron vert.'],substitutions:['Saumon fumé à la place des crevettes.'],
  },
  {
    id:'r35',name:'Gratin Quinoa Légumes',kcal:430,protein:20,carbs:48,fat:18,fiber:8,difficulty:'medium',budget:'low',prepTime:35,category:'lunch',tags:['végétarien','complet','gratin'],image:'🧀',
    ingredients:[{name:'Quinoa',quantity:'100g'},{name:'Courgettes',quantity:'2'},{name:'Tomates',quantity:'2'},{name:'Mozzarella',quantity:'80g'},{name:'Crème légère',quantity:'100ml'},{name:'Herbes',quantity:'Au goût'}],
    steps:['Cuis le quinoa.','Coupe les légumes en rondelles.','Superpose quinoa, légumes et mozzarella. Verse la crème.','Four 180°C 20 min.'],substitutions:['Boulgour à la place du quinoa.'],
  },

  // ══════════════════════════════════════════
  //   🌙 DÎNER (20 recettes)
  // ══════════════════════════════════════════
  {
    id:'r30',name:'Curry Pois Chiches',kcal:460,protein:20,carbs:55,fat:18,fiber:12,difficulty:'easy',budget:'low',prepTime:25,category:'dinner',tags:['végétarien','épicé','réconfort'],image:'🍛',
    ingredients:[{name:'Pois chiches',quantity:'250g'},{name:'Lait de coco',quantity:'200ml'},{name:'Tomates concassées',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Curry en poudre',quantity:'1 c.à.s'},{name:'Riz',quantity:'80g'}],
    steps:['Reviens oignon, ajoute curry 1 min.','Verse tomates et lait de coco.','Ajoute pois chiches, mijote 15 min. Sers sur le riz.'],substitutions:['Lentilles ou tofu à la place.'],
  },
  {
    id:'r31',name:'Cabillaud & Lentilles',kcal:449,protein:59,carbs:38,fat:6,fiber:10,difficulty:'medium',budget:'medium',prepTime:30,category:'dinner',tags:['protéines','léger'],image:'🐠',
    ingredients:[{name:'Cabillaud',quantity:'200g'},{name:'Lentilles vertes',quantity:'100g'},{name:'Carottes',quantity:'2'},{name:'Oignon',quantity:'1'},{name:'Bouillon',quantity:'300ml'},{name:'Citron',quantity:'1/2'}],
    steps:['Cuis lentilles et carottes dans le bouillon 20 min.','Poêle le cabillaud 3-4 min par côté.','Sers le poisson sur les lentilles avec du citron.'],substitutions:['Colin ou lieu noir à la place.'],
  },
  {
    id:'r32',name:'Soupe Potiron Coco',kcal:295,protein:7,carbs:35,fat:15,fiber:6,difficulty:'easy',budget:'low',prepTime:25,category:'dinner',tags:['léger','végétarien','réconfort'],image:'🎃',
    ingredients:[{name:'Potiron',quantity:'400g'},{name:'Lait de coco',quantity:'150ml'},{name:'Oignon',quantity:'1'},{name:'Bouillon',quantity:'300ml'},{name:'Gingembre',quantity:'1 cm'},{name:'Graines de courge',quantity:'1 c.à.s'}],
    steps:['Cuis potiron et oignon dans le bouillon 20 min.','Mixe, ajoute lait de coco.','Garnis de graines de courge.'],substitutions:['Butternut à la place du potiron.'],
  },
  {
    id:'r33',name:'Wok Crevettes Légumes',kcal:380,protein:35,carbs:30,fat:14,fiber:5,difficulty:'medium',budget:'high',prepTime:20,category:'dinner',tags:['asiatique','rapide'],image:'🍤',
    ingredients:[{name:'Crevettes',quantity:'200g'},{name:'Nouilles de riz',quantity:'80g'},{name:'Poivron',quantity:'1'},{name:'Courgette',quantity:'1'},{name:'Sauce soja',quantity:'2 c.à.s'},{name:'Huile sésame',quantity:'1 c.à.c'}],
    steps:['Cuis les nouilles.','Saisis crevettes 2 min, ajoute légumes 3 min.','Mélange nouilles et sauce soja.'],substitutions:['Poulet ou tofu à la place.'],
  },
  {
    id:'r34',name:'Saumon Teriyaki Riz',kcal:520,protein:40,carbs:50,fat:16,fiber:2,difficulty:'medium',budget:'high',prepTime:20,category:'dinner',tags:['oméga-3','asiatique','gourmand'],image:'🍣',
    ingredients:[{name:'Pavé de saumon',quantity:'180g'},{name:'Riz à sushi',quantity:'80g'},{name:'Sauce soja',quantity:'2 c.à.s'},{name:'Miel',quantity:'1 c.à.s'},{name:'Gingembre',quantity:'1 c.à.c'},{name:'Sésame',quantity:'1 c.à.c'}],
    steps:['Cuis le riz.','Mélange soja, miel, gingembre pour la sauce.','Poêle le saumon 3-4 min par côté, nappe de sauce.'],substitutions:['Thon ou poulet à la place.'],
  },
  {
    id:'r36',name:'Poulet Tikka Masala',kcal:490,protein:42,carbs:40,fat:18,fiber:4,difficulty:'medium',budget:'medium',prepTime:30,category:'dinner',tags:['épicé','indien','protéines'],image:'🍲',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Yaourt nature',quantity:'100g'},{name:'Tomates concassées',quantity:'200g'},{name:'Crème légère',quantity:'50ml'},{name:'Oignon + ail',quantity:'1 + 2'},{name:'Épices tikka',quantity:'2 c.à.s'}],
    steps:['Marine poulet dans yaourt + épices 15 min.','Reviens oignon, ail, ajoute poulet 5 min.','Verse tomates et crème, mijote 15 min.'],substitutions:['Lait de coco à la place de la crème.'],
  },
  {
    id:'r37',name:'Gratin Courgettes Chèvre',kcal:380,protein:22,carbs:25,fat:22,fiber:4,difficulty:'easy',budget:'low',prepTime:35,category:'dinner',tags:['végétarien','fromage'],image:'🧀',
    ingredients:[{name:'Courgettes',quantity:'3'},{name:'Chèvre frais',quantity:'100g'},{name:'Œufs',quantity:'2'},{name:'Crème légère',quantity:'100ml'},{name:'Ail',quantity:'1 gousse'},{name:'Herbes',quantity:'1 c.à.c'}],
    steps:['Coupe courgettes en rondelles, dispose dans un plat.','Mélange œufs, crème, ail et herbes.','Verse et émiette le chèvre. Four 180°C 25 min.'],substitutions:['Feta ou mozzarella à la place.'],
  },
  {
    id:'r38',name:'Steak Haché & Purée',kcal:560,protein:38,carbs:45,fat:24,fiber:4,difficulty:'easy',budget:'low',prepTime:25,category:'dinner',tags:['classique','réconfort'],image:'🥩',
    ingredients:[{name:'Steak haché 5%',quantity:'150g'},{name:'Pommes de terre',quantity:'250g'},{name:'Lait',quantity:'50ml'},{name:'Beurre',quantity:'10g'},{name:'Salade verte',quantity:'50g'}],
    steps:['Cuis et écrase les pommes de terre avec lait et beurre.','Poêle le steak 3-4 min par côté.','Sers avec purée et salade.'],substitutions:['Steak végétal à la place.'],
  },
  {
    id:'r39',name:'Tacos Bœuf Maison',kcal:480,protein:30,carbs:42,fat:20,fiber:5,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:['mexicain','convivial'],image:'🌮',
    ingredients:[{name:'Tortillas maïs',quantity:'3'},{name:'Bœuf haché',quantity:'150g'},{name:'Poivron',quantity:'1'},{name:'Tomate',quantity:'1'},{name:'Avocat',quantity:'1/2'},{name:'Cumin + paprika',quantity:'1 c.à.c'}],
    steps:['Fais revenir bœuf avec épices.','Coupe légumes et avocat.','Garnis les tortillas chaudes.'],substitutions:['Haricots noirs pour version végé.'],
  },
  {
    id:'r40',name:'Papillote Dorade Légumes',kcal:350,protein:35,carbs:18,fat:14,fiber:4,difficulty:'easy',budget:'medium',prepTime:25,category:'dinner',tags:['léger','oméga-3'],image:'🐟',
    ingredients:[{name:'Filet de dorade',quantity:'200g'},{name:'Courgette',quantity:'1'},{name:'Tomates cerises',quantity:'100g'},{name:'Citron',quantity:'1/2'},{name:'Herbes fraîches',quantity:'Au goût'},{name:'Huile d\'olive',quantity:'1 c.à.c'}],
    steps:['Dispose le poisson et légumes coupés sur du papier alu.','Arrose d\'huile, citron et herbes.','Ferme la papillote, four 200°C 15 min.'],substitutions:['Bar ou cabillaud à la place.'],
  },
  {
    id:'r41',name:'Risotto Champignons',kcal:460,protein:14,carbs:62,fat:16,fiber:3,difficulty:'medium',budget:'low',prepTime:30,category:'dinner',tags:['végétarien','réconfort','italien'],image:'🍄',
    ingredients:[{name:'Riz arborio',quantity:'100g'},{name:'Champignons',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Bouillon légumes',quantity:'500ml'},{name:'Parmesan',quantity:'30g'},{name:'Beurre',quantity:'15g'}],
    steps:['Reviens oignon et champignons.','Ajoute le riz, puis le bouillon louche par louche en remuant.','Termine avec parmesan et beurre.'],substitutions:['Riz complet pour plus de fibres.'],
  },
  {
    id:'r42',name:'Tajine Poulet Citron',kcal:480,protein:40,carbs:38,fat:18,fiber:6,difficulty:'medium',budget:'medium',prepTime:40,category:'dinner',tags:['marocain','épicé','réconfort'],image:'🫕',
    ingredients:[{name:'Cuisses de poulet',quantity:'300g'},{name:'Citron confit',quantity:'1'},{name:'Olives vertes',quantity:'50g'},{name:'Oignon',quantity:'2'},{name:'Gingembre + curcuma',quantity:'1 c.à.c'},{name:'Semoule',quantity:'80g'}],
    steps:['Dore le poulet, ajoute oignons et épices.','Ajoute eau, citron confit et olives, mijote 30 min.','Sers avec la semoule.'],substitutions:['Agneau à la place du poulet.'],
  },
  {
    id:'r43',name:'Soupe Miso Tofu Nouilles',kcal:280,protein:18,carbs:32,fat:8,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:['japonais','léger','végétarien'],image:'🍜',
    ingredients:[{name:'Pâte miso',quantity:'2 c.à.s'},{name:'Tofu ferme',quantity:'150g'},{name:'Nouilles soba',quantity:'80g'},{name:'Algues wakame',quantity:'5g'},{name:'Champignons',quantity:'50g'},{name:'Oignon vert',quantity:'2'}],
    steps:['Cuis les nouilles.','Chauffe l\'eau, ajoute champignons 3 min.','Retire du feu, incorpore le miso. Ajoute tofu en dés et nouilles.'],substitutions:['Nouilles de riz à la place des soba.'],
  },
  {
    id:'r44',name:'Chili Con Carne',kcal:520,protein:35,carbs:48,fat:18,fiber:12,difficulty:'easy',budget:'low',prepTime:30,category:'dinner',tags:['mexicain','épicé','protéines'],image:'🌶️',
    ingredients:[{name:'Bœuf haché',quantity:'200g'},{name:'Haricots rouges',quantity:'200g'},{name:'Tomates concassées',quantity:'300g'},{name:'Oignon',quantity:'1'},{name:'Poivron',quantity:'1'},{name:'Cumin + chili',quantity:'2 c.à.c'}],
    steps:['Reviens oignon et bœuf 5 min.','Ajoute poivron, tomates, haricots et épices.','Mijote 20 min. Sers avec du riz.'],substitutions:['Dinde hachée à la place du bœuf.'],
  },
  {
    id:'r49',name:'Brochettes Poulet Mariné',kcal:350,protein:38,carbs:8,fat:18,fiber:2,difficulty:'easy',budget:'low',prepTime:25,category:'dinner',tags:['BBQ','protéines','été'],image:'🍢',
    ingredients:[{name:'Blanc de poulet',quantity:'250g'},{name:'Poivrons',quantity:'2'},{name:'Oignon rouge',quantity:'1'},{name:'Huile d\'olive',quantity:'1 c.à.s'},{name:'Herbes + ail',quantity:'Au goût'},{name:'Citron',quantity:'1/2'}],
    steps:['Marine le poulet coupé en cubes avec huile, herbes et citron.','Enfile sur des piques avec légumes.','Grille 4-5 min par côté.'],substitutions:['Crevettes à la place du poulet.'],
  },

  // ══════════════════════════════════════════
  //   🍎 SNACKS (15 recettes)
  // ══════════════════════════════════════════
  {
    id:'r45',name:'Energy Balls Cacao',kcal:180,protein:8,carbs:20,fat:8,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:['énergie','sans cuisson','rapide'],image:'🍫',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Beurre de cacahuète',quantity:'2 c.à.s'},{name:'Cacao',quantity:'1 c.à.s'},{name:'Miel',quantity:'1 c.à.s'},{name:'Graines de chia',quantity:'1 c.à.c'}],
    steps:['Mélange tout.','Forme des boules.','Frigo 30 min.'],substitutions:['Beurre d\'amande à la place.'],
  },
  {
    id:'r46',name:'Houmous & Crudités',kcal:220,protein:10,carbs:22,fat:12,fiber:6,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:['végétarien','fibres'],image:'🥕',
    ingredients:[{name:'Houmous',quantity:'80g'},{name:'Carottes',quantity:'2'},{name:'Concombre',quantity:'1/2'},{name:'Poivron',quantity:'1/2'}],
    steps:['Coupe les légumes en bâtonnets.','Sers avec le houmous.'],substitutions:['Houmous maison si possible.'],
  },
  {
    id:'r47',name:'Cottage Cheese Fruits',kcal:200,protein:20,carbs:18,fat:5,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:['protéines','rapide'],image:'🍑',
    ingredients:[{name:'Cottage cheese',quantity:'150g'},{name:'Pêche ou mangue',quantity:'1'},{name:'Miel',quantity:'1 c.à.c'},{name:'Amandes',quantity:'5-6'}],
    steps:['Coupe le fruit, verse le cottage cheese, garnis.'],substitutions:['Fromage blanc à la place.'],
  },
  {
    id:'r48',name:'Banana Bread Protéiné',kcal:250,protein:15,carbs:32,fat:8,fiber:3,difficulty:'medium',budget:'low',prepTime:45,category:'snack',tags:['gourmand','meal-prep'],image:'🍌',
    ingredients:[{name:'Bananes mûres',quantity:'3'},{name:'Flocons d\'avoine',quantity:'150g'},{name:'Œufs',quantity:'2'},{name:'Whey vanille',quantity:'30g'},{name:'Levure',quantity:'1 c.à.c'},{name:'Cannelle',quantity:'1 c.à.c'}],
    steps:['Écrase bananes, mélange avec œufs.','Ajoute avoine, whey, levure, cannelle.','Four 180°C 35 min.'],substitutions:['30g poudre d\'amande sans whey.'],
  },
  {
    id:'r50',name:'Riz au Lait Protéiné',kcal:320,protein:22,carbs:45,fat:6,fiber:1,difficulty:'easy',budget:'low',prepTime:25,category:'snack',tags:['dessert','réconfort'],image:'🍚',
    ingredients:[{name:'Riz rond',quantity:'60g'},{name:'Lait',quantity:'400ml'},{name:'Whey vanille',quantity:'25g'},{name:'Cannelle',quantity:'pincée'},{name:'Sucre ou édulcorant',quantity:'1 c.à.s'}],
    steps:['Cuis le riz dans le lait 20 min à feu doux.','Retire du feu, incorpore la whey.','Saupoudre de cannelle.'],substitutions:['Lait de coco pour plus d\'onctuosité.'],
  },
  {
    id:'r51',name:'Muffins Avoine Myrtilles',kcal:190,protein:10,carbs:25,fat:6,fiber:3,difficulty:'medium',budget:'low',prepTime:30,category:'snack',tags:['meal-prep','gourmand'],image:'🧁',
    ingredients:[{name:'Flocons d\'avoine',quantity:'120g'},{name:'Bananes',quantity:'2'},{name:'Œufs',quantity:'2'},{name:'Myrtilles',quantity:'80g'},{name:'Levure',quantity:'1 c.à.c'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:['Écrase bananes, mélange avec œufs et miel.','Ajoute avoine et levure. Incorpore myrtilles.','Moules à muffins, four 180°C 20 min.'],substitutions:['Pépites de chocolat noir à la place.'],
  },
  {
    id:'r52',name:'Salade de Fruits Énergétique',kcal:200,protein:3,carbs:45,fat:2,fiber:5,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:['vitamines','fraîcheur'],image:'🍇',
    ingredients:[{name:'Pomme',quantity:'1'},{name:'Kiwi',quantity:'1'},{name:'Orange',quantity:'1'},{name:'Banane',quantity:'1/2'},{name:'Citron',quantity:'filet'},{name:'Menthe',quantity:'feuilles'}],
    steps:['Coupe tous les fruits. Mélange. Citron et menthe.'],substitutions:['Fruits de saison selon envie.'],
  },
  {
    id:'r53',name:'Tartine Beurre Cacahuète Banane',kcal:350,protein:12,carbs:40,fat:16,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:['énergie','rapide','gourmand'],image:'🥜',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Beurre de cacahuète',quantity:'2 c.à.s'},{name:'Banane',quantity:'1'},{name:'Miel',quantity:'filet'},{name:'Graines de chia',quantity:'1 c.à.c'}],
    steps:['Tartine le pain de beurre de cacahuète.','Ajoute les rondelles de banane, miel et graines.'],substitutions:['Beurre d\'amande à la place.'],
  },
  {
    id:'r54',name:'Yaourt Grec Compotée Pommes',kcal:250,protein:18,carbs:30,fat:6,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'snack',tags:['réconfort','protéines'],image:'🍎',
    ingredients:[{name:'Yaourt grec',quantity:'200g'},{name:'Pommes',quantity:'2'},{name:'Cannelle',quantity:'1 c.à.c'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:['Coupe les pommes en dés, cuis 10 min avec cannelle.','Verse le yaourt dans un bol, ajoute la compotée.'],substitutions:['Poires à la place des pommes.'],
  },
  {
    id:'r55',name:'Pudding Chia Chocolat',kcal:280,protein:12,carbs:28,fat:14,fiber:10,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:['sans cuisson','fibres','antioxydants'],image:'🍫',
    ingredients:[{name:'Graines de chia',quantity:'30g'},{name:'Lait d\'amande',quantity:'200ml'},{name:'Cacao en poudre',quantity:'1 c.à.s'},{name:'Miel',quantity:'1 c.à.c'},{name:'Banane',quantity:'1/2'}],
    steps:['Mélange chia, lait, cacao et miel.','Réfrigère 4h ou toute la nuit.','Garnis de rondelles de banane.'],substitutions:['Lait de coco à la place.'],
  },
  {
    id:'r56',name:'Mix Trail Maison',kcal:280,protein:10,carbs:25,fat:18,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:['énergie','à emporter','batch'],image:'🥜',
    ingredients:[{name:'Amandes',quantity:'30g'},{name:'Noix de cajou',quantity:'20g'},{name:'Raisins secs',quantity:'20g'},{name:'Chocolat noir concassé',quantity:'15g'},{name:'Graines de courge',quantity:'10g'}],
    steps:['Mélange tous les ingrédients dans un bocal.','Portions de 30-40g pour les snacks.'],substitutions:['Noisettes ou pistaches à la place des cajou.'],
  },
  {
    id:'r57',name:'Galettes de Riz Avocat',kcal:200,protein:5,carbs:22,fat:11,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:['rapide','léger','végétarien'],image:'🥑',
    ingredients:[{name:'Galettes de riz',quantity:'3'},{name:'Avocat',quantity:'1/2'},{name:'Sel, citron, piment',quantity:'Au goût'}],
    steps:['Écrase l\'avocat avec citron et sel.','Tartine sur les galettes.'],substitutions:['Cottage cheese à la place de l\'avocat.'],
  },
  {
    id:'r58',name:'Barre Granola Maison',kcal:220,protein:8,carbs:28,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:25,category:'snack',tags:['meal-prep','énergie','batch'],image:'🍯',
    ingredients:[{name:'Flocons d\'avoine',quantity:'100g'},{name:'Beurre de cacahuète',quantity:'3 c.à.s'},{name:'Miel',quantity:'3 c.à.s'},{name:'Pépites chocolat',quantity:'20g'},{name:'Graines',quantity:'20g'}],
    steps:['Mélange tout.','Tasse dans un moule rectangulaire.','Réfrigère 2h. Coupe en barres.'],substitutions:['Sirop d\'agave à la place du miel.'],
  },
  {
    id:'r59',name:'Skyr Protéiné Granola',kcal:260,protein:28,carbs:28,fat:4,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:['protéines','ultra-rapide'],image:'🥄',
    ingredients:[{name:'Skyr nature',quantity:'200g'},{name:'Granola',quantity:'30g'},{name:'Fruits rouges',quantity:'50g'},{name:'Miel',quantity:'filet'}],
    steps:['Verse le skyr, ajoute granola, fruits et miel.'],substitutions:['Yaourt grec 0% à la place.'],
  },

  // ══════════════════════════════════════════
  //   ⚡ PRÉ-ENTRAÎNEMENT (15 recettes)
  // ══════════════════════════════════════════
  {
    id:'r60',name:'Toast Miel Banane Express',kcal:320,protein:8,carbs:55,fat:8,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:['rapide','énergie','glucides'],image:'🍯',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Banane',quantity:'1'},{name:'Miel',quantity:'1 c.à.s'},{name:'Cannelle',quantity:'pincée'}],
    steps:['Toaste le pain.','Ajoute rondelles de banane, miel et cannelle.'],substitutions:['Beurre de cacahuète en plus pour les protéines.'],
  },
  {
    id:'r61',name:'Porridge Rapide Fruits Secs',kcal:400,protein:14,carbs:58,fat:12,fiber:6,difficulty:'easy',budget:'low',prepTime:8,category:'pre_workout',tags:['énergie','glucides','fibres'],image:'🥣',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Lait',quantity:'200ml'},{name:'Dattes',quantity:'3'},{name:'Noix',quantity:'15g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:['Chauffe le lait, ajoute les flocons 5 min.','Coupe les dattes, ajoute noix et miel.'],substitutions:['Figues séchées à la place des dattes.'],
  },
  {
    id:'r62',name:'Smoothie Énergie Pré-Training',kcal:350,protein:10,carbs:62,fat:8,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:['rapide','énergie','smoothie'],image:'🥤',
    ingredients:[{name:'Banane',quantity:'1'},{name:'Flocons d\'avoine',quantity:'30g'},{name:'Miel',quantity:'1 c.à.s'},{name:'Lait',quantity:'250ml'},{name:'Beurre de cacahuète',quantity:'1 c.à.c'}],
    steps:['Mixe tout jusqu\'à consistance lisse.','Bois 30-60 min avant l\'entraînement.'],substitutions:['Mangue à la place de la banane.'],
  },
  {
    id:'r63',name:'Riz au Lait Vanille Express',kcal:380,protein:10,carbs:65,fat:8,fiber:1,difficulty:'easy',budget:'low',prepTime:20,category:'pre_workout',tags:['glucides','réconfort','énergie'],image:'🍚',
    ingredients:[{name:'Riz rond',quantity:'60g'},{name:'Lait',quantity:'300ml'},{name:'Sucre vanillé',quantity:'1 sachet'},{name:'Cannelle',quantity:'pincée'}],
    steps:['Cuis le riz dans le lait 15 min à feu doux.','Ajoute sucre vanillé et cannelle.','Mange tiède 1h avant la séance.'],substitutions:['Lait d\'amande version légère.'],
  },
  {
    id:'r64',name:'Pâtes Légères Huile d\'Olive',kcal:420,protein:12,carbs:68,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'pre_workout',tags:['glucides','simple','énergie'],image:'🍝',
    ingredients:[{name:'Pâtes',quantity:'100g'},{name:'Huile d\'olive',quantity:'1 c.à.s'},{name:'Parmesan',quantity:'15g'},{name:'Basilic',quantity:'feuilles'},{name:'Sel, poivre',quantity:'Au goût'}],
    steps:['Cuis les pâtes al dente.','Mélange avec huile d\'olive et parmesan.','1h30-2h avant la séance.'],substitutions:['Pâtes complètes pour plus de fibres.'],
  },
  {
    id:'r65',name:'Compote Pomme Amande',kcal:250,protein:5,carbs:40,fat:8,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'pre_workout',tags:['digeste','énergie','rapide'],image:'🍎',
    ingredients:[{name:'Pommes',quantity:'3'},{name:'Amandes effilées',quantity:'15g'},{name:'Miel',quantity:'1 c.à.c'},{name:'Cannelle',quantity:'1 c.à.c'}],
    steps:['Coupe et cuis les pommes 10 min avec cannelle.','Écrase légèrement, ajoute miel et amandes.'],substitutions:['Poires à la place des pommes.'],
  },
  {
    id:'r66',name:'Wrap Poulet Riz Pré-Training',kcal:450,protein:30,carbs:55,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'pre_workout',tags:['complet','protéines','glucides'],image:'🌯',
    ingredients:[{name:'Tortilla',quantity:'1'},{name:'Poulet grillé',quantity:'100g'},{name:'Riz cuit',quantity:'80g'},{name:'Salade',quantity:'30g'},{name:'Sauce yaourt',quantity:'1 c.à.s'}],
    steps:['Garnis la tortilla de riz, poulet, salade et sauce.','Roule et mange 1h30 avant.'],substitutions:['Dinde à la place du poulet.'],
  },
  {
    id:'r67',name:'Galettes Avoine Banane',kcal:280,protein:8,carbs:42,fat:10,fiber:4,difficulty:'easy',budget:'low',prepTime:12,category:'pre_workout',tags:['énergie','sans sucre ajouté'],image:'🥞',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Banane mûre',quantity:'1'},{name:'Œuf',quantity:'1'},{name:'Cannelle',quantity:'pincée'}],
    steps:['Écrase la banane, mélange avec avoine et œuf.','Cuis à la poêle 2 min par côté.'],substitutions:['Ajoute des pépites de chocolat.'],
  },
  {
    id:'r68',name:'Dattes Fourrées Amandes',kcal:220,protein:5,carbs:38,fat:7,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:['ultra-rapide','énergie','naturel'],image:'🌴',
    ingredients:[{name:'Dattes Medjool',quantity:'4'},{name:'Amandes entières',quantity:'4'},{name:'Sel',quantity:'pincée'}],
    steps:['Ouvre chaque datte et insère une amande.','Snack parfait 30 min avant la séance.'],substitutions:['Noix de cajou à la place des amandes.'],
  },
  {
    id:'r69',name:'Bowl Flocons Beurre Cacahuète',kcal:440,protein:16,carbs:52,fat:18,fiber:6,difficulty:'easy',budget:'low',prepTime:8,category:'pre_workout',tags:['énergie','protéines','glucides'],image:'🥜',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Lait',quantity:'200ml'},{name:'Beurre de cacahuète',quantity:'1 c.à.s'},{name:'Banane',quantity:'1'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:['Cuis les flocons dans le lait 5 min.','Ajoute beurre de cacahuète et banane.'],substitutions:['Tahini à la place du beurre de cacahuète.'],
  },
  {
    id:'r70',name:'Jus Betterave Performance',kcal:120,protein:3,carbs:25,fat:0.5,fiber:2,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:['performance','nitrates','endurance'],image:'🥤',
    ingredients:[{name:'Betterave crue',quantity:'200g'},{name:'Pomme',quantity:'1'},{name:'Gingembre',quantity:'1 cm'},{name:'Citron',quantity:'1/2'}],
    steps:['Passe tout à l\'extracteur ou mixe avec un peu d\'eau.','Bois 1-2h avant l\'entraînement pour les nitrates.'],substitutions:['Carotte à la place de la pomme.'],
  },
  {
    id:'r71',name:'Tartine Confiture Maison',kcal:280,protein:6,carbs:50,fat:5,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:['simple','glucides','rapide'],image:'🍓',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Confiture fruits rouges',quantity:'2 c.à.s'},{name:'Beurre',quantity:'5g'}],
    steps:['Tartine le pain de beurre et confiture.','Simple et efficace 1h avant.'],substitutions:['Miel à la place de la confiture.'],
  },
  {
    id:'r72',name:'Bowl Quinoa Sucré',kcal:380,protein:12,carbs:55,fat:12,fiber:5,difficulty:'easy',budget:'medium',prepTime:18,category:'pre_workout',tags:['énergie','protéines végétales'],image:'🥣',
    ingredients:[{name:'Quinoa',quantity:'80g'},{name:'Lait d\'amande',quantity:'200ml'},{name:'Banane',quantity:'1'},{name:'Noix de coco râpée',quantity:'10g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:['Cuis le quinoa dans le lait 15 min.','Garnis de banane, coco et miel.'],substitutions:['Lait de coco à la place.'],
  },
  {
    id:'r73',name:'Sandwich Dinde Avocat',kcal:410,protein:28,carbs:40,fat:16,fiber:5,difficulty:'easy',budget:'medium',prepTime:8,category:'pre_workout',tags:['complet','protéines','à emporter'],image:'🥪',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Dinde (tranches)',quantity:'100g'},{name:'Avocat',quantity:'1/4'},{name:'Tomate',quantity:'2 tranches'},{name:'Salade',quantity:'feuilles'}],
    steps:['Assemble le sandwich.','Mange 1h30-2h avant la séance.'],substitutions:['Poulet grillé à la place.'],
  },
  {
    id:'r74',name:'Crêpes Avoine Miel',kcal:350,protein:12,carbs:50,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'pre_workout',tags:['glucides','énergie','gourmand'],image:'🥞',
    ingredients:[{name:'Flocons d\'avoine',quantity:'60g'},{name:'Œuf',quantity:'1'},{name:'Lait',quantity:'150ml'},{name:'Miel',quantity:'2 c.à.s'},{name:'Citron',quantity:'filet'}],
    steps:['Mixe avoine, œuf et lait.','Cuis les crêpes, garnis de miel et citron.'],substitutions:['Sirop d\'érable à la place du miel.'],
  },

  // ══════════════════════════════════════════
  //   💪 POST-ENTRAÎNEMENT (15 recettes)
  // ══════════════════════════════════════════
  {
    id:'r75',name:'Shake Protéiné Banane',kcal:280,protein:30,carbs:30,fat:5,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:['protéines','rapide','récupération'],image:'🥤',
    ingredients:[{name:'Whey protéine',quantity:'30g'},{name:'Banane',quantity:'1'},{name:'Lait ou eau',quantity:'300ml'},{name:'Glaçons',quantity:'3-4'}],
    steps:['Mixe tout 30 secondes.','Bois dans les 30 min après l\'entraînement.'],substitutions:['Fraises ou mangue à la place de la banane.'],
  },
  {
    id:'r76',name:'Bowl Protéiné Poulet Patate Douce',kcal:520,protein:45,carbs:50,fat:14,fiber:6,difficulty:'easy',budget:'medium',prepTime:25,category:'post_workout',tags:['complet','muscle','récupération'],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Patate douce',quantity:'200g'},{name:'Épinards',quantity:'100g'},{name:'Huile d\'olive',quantity:'1 c.à.s'},{name:'Graines de sésame',quantity:'1 c.à.c'}],
    steps:['Cuis patate douce au four 25 min.','Grille le poulet 5 min par côté.','Assemble avec épinards, huile et sésame.'],substitutions:['Saumon à la place du poulet.'],
  },
  {
    id:'r77',name:'Smoothie Récupération',kcal:380,protein:30,carbs:45,fat:8,fiber:4,difficulty:'easy',budget:'medium',prepTime:5,category:'post_workout',tags:['rapide','protéines','fruits'],image:'🥤',
    ingredients:[{name:'Whey chocolat',quantity:'30g'},{name:'Banane',quantity:'1'},{name:'Lait d\'amande',quantity:'250ml'},{name:'Beurre de cacahuète',quantity:'1 c.à.s'},{name:'Flocons d\'avoine',quantity:'20g'}],
    steps:['Mixe tout.','Bois dans les 30 min post-training.'],substitutions:['Whey vanille + fraises.'],
  },
  {
    id:'r78',name:'Omelette Post-Training',kcal:400,protein:35,carbs:20,fat:20,fiber:2,difficulty:'easy',budget:'low',prepTime:10,category:'post_workout',tags:['protéines','rapide','simple'],image:'🥚',
    ingredients:[{name:'Œufs entiers',quantity:'2'},{name:'Blancs d\'œuf',quantity:'3'},{name:'Champignons',quantity:'80g'},{name:'Épinards',quantity:'50g'},{name:'Pain complet',quantity:'1 tranche'}],
    steps:['Bats les œufs et blancs.','Fais revenir champignons et épinards.','Verse les œufs, cuis 4 min. Sers avec pain.'],substitutions:['Poivrons à la place des champignons.'],
  },
  {
    id:'r79',name:'Riz Poulet Teriyaki Post',kcal:520,protein:42,carbs:58,fat:12,fiber:2,difficulty:'easy',budget:'low',prepTime:20,category:'post_workout',tags:['complet','muscle','glucides'],image:'🍚',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Riz',quantity:'100g'},{name:'Sauce soja',quantity:'2 c.à.s'},{name:'Miel',quantity:'1 c.à.s'},{name:'Brocoli',quantity:'100g'}],
    steps:['Cuis le riz et le brocoli.','Poêle le poulet, nappe de sauce soja + miel.','Assemble le tout.'],substitutions:['Dinde à la place.'],
  },
  {
    id:'r80',name:'Bowl Thon Riz Avocat',kcal:480,protein:40,carbs:45,fat:16,fiber:5,difficulty:'easy',budget:'low',prepTime:12,category:'post_workout',tags:['oméga-3','protéines','rapide'],image:'🐟',
    ingredients:[{name:'Thon conserve naturel',quantity:'160g'},{name:'Riz cuit',quantity:'150g'},{name:'Avocat',quantity:'1/2'},{name:'Maïs',quantity:'50g'},{name:'Citron',quantity:'filet'}],
    steps:['Mélange riz, thon émietté, maïs.','Ajoute l\'avocat en tranches et le citron.'],substitutions:['Saumon en conserve à la place.'],
  },
  {
    id:'r81',name:'Crêpes Protéinées Post',kcal:420,protein:35,carbs:42,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'post_workout',tags:['protéines','gourmand','récupération'],image:'🥞',
    ingredients:[{name:'Whey vanille',quantity:'30g'},{name:'Flocons d\'avoine',quantity:'50g'},{name:'Œuf',quantity:'1'},{name:'Banane',quantity:'1'},{name:'Lait',quantity:'100ml'},{name:'Fruits rouges',quantity:'50g'}],
    steps:['Mixe whey, avoine, œuf, banane et lait.','Cuis les crêpes 2 min par côté.','Garnis de fruits rouges.'],substitutions:['Yaourt grec à la place de la whey.'],
  },
  {
    id:'r82',name:'Salade Pâtes Poulet Feta',kcal:500,protein:38,carbs:50,fat:16,fiber:4,difficulty:'easy',budget:'low',prepTime:20,category:'post_workout',tags:['complet','glucides','protéines'],image:'🥗',
    ingredients:[{name:'Pâtes fusilli',quantity:'100g'},{name:'Poulet grillé',quantity:'150g'},{name:'Feta',quantity:'40g'},{name:'Tomates cerises',quantity:'80g'},{name:'Olives',quantity:'20g'},{name:'Huile d\'olive',quantity:'1 c.à.s'}],
    steps:['Cuis les pâtes et laisse refroidir.','Mélange avec poulet, feta, tomates, olives et huile.'],substitutions:['Thon à la place du poulet.'],
  },
  {
    id:'r83',name:'Yaourt Protéiné Granola Post',kcal:350,protein:30,carbs:35,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'post_workout',tags:['rapide','protéines','récupération'],image:'🥄',
    ingredients:[{name:'Yaourt grec 0%',quantity:'200g'},{name:'Whey vanille',quantity:'15g'},{name:'Granola',quantity:'30g'},{name:'Miel',quantity:'1 c.à.c'},{name:'Banane',quantity:'1/2'}],
    steps:['Mélange yaourt et whey.','Garnis de granola, banane et miel.'],substitutions:['Skyr à la place du yaourt.'],
  },
  {
    id:'r84',name:'Tartines Saumon Cream Cheese',kcal:420,protein:28,carbs:35,fat:18,fiber:3,difficulty:'easy',budget:'high',prepTime:8,category:'post_workout',tags:['oméga-3','protéines','rapide'],image:'🐟',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Saumon fumé',quantity:'80g'},{name:'Cream cheese',quantity:'30g'},{name:'Concombre',quantity:'4 tranches'},{name:'Aneth',quantity:'Au goût'}],
    steps:['Tartine le pain de cream cheese.','Ajoute le saumon, concombre et aneth.'],substitutions:['Truite fumée à la place.'],
  },
  {
    id:'r85',name:'Bowl Quinoa Bœuf Légumes',kcal:550,protein:40,carbs:48,fat:20,fiber:7,difficulty:'medium',budget:'medium',prepTime:25,category:'post_workout',tags:['complet','muscle','récupération'],image:'🥩',
    ingredients:[{name:'Bœuf haché 5%',quantity:'150g'},{name:'Quinoa',quantity:'80g'},{name:'Poivron',quantity:'1'},{name:'Courgette',quantity:'1'},{name:'Huile d\'olive',quantity:'1 c.à.s'},{name:'Épices tex-mex',quantity:'1 c.à.c'}],
    steps:['Cuis le quinoa.','Fais revenir bœuf et légumes avec les épices.','Assemble en bowl.'],substitutions:['Dinde hachée à la place.'],
  },
  {
    id:'r86',name:'Sandwich Œuf Avocat Post',kcal:430,protein:22,carbs:38,fat:22,fiber:6,difficulty:'easy',budget:'low',prepTime:10,category:'post_workout',tags:['complet','rapide'],image:'🥑',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Œufs durs',quantity:'2'},{name:'Avocat',quantity:'1/2'},{name:'Sel, poivre, piment',quantity:'Au goût'}],
    steps:['Écrase les œufs et l\'avocat ensemble.','Assaisonne et tartine le pain.'],substitutions:['Ajoute du thon pour plus de protéines.'],
  },
  {
    id:'r87',name:'Pâtes Thon Tomate Post',kcal:480,protein:35,carbs:55,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'post_workout',tags:['rapide','protéines','glucides'],image:'🍝',
    ingredients:[{name:'Pâtes',quantity:'100g'},{name:'Thon conserve',quantity:'130g'},{name:'Sauce tomate',quantity:'150g'},{name:'Oignon',quantity:'1/2'},{name:'Olives',quantity:'10'}],
    steps:['Cuis les pâtes.','Chauffe la sauce avec oignon et thon.','Mélange et ajoute les olives.'],substitutions:['Saumon en conserve à la place.'],
  },
  {
    id:'r88',name:'Smoothie Bowl Protéiné Post',kcal:400,protein:32,carbs:45,fat:10,fiber:5,difficulty:'easy',budget:'medium',prepTime:8,category:'post_workout',tags:['rapide','protéines','récupération'],image:'🫐',
    ingredients:[{name:'Whey vanille',quantity:'30g'},{name:'Banane congelée',quantity:'1'},{name:'Myrtilles',quantity:'60g'},{name:'Lait',quantity:'100ml'},{name:'Granola',quantity:'25g'},{name:'Graines de chia',quantity:'1 c.à.c'}],
    steps:['Mixe whey, banane, myrtilles et lait.','Verse dans un bol, garnis de granola et chia.'],substitutions:['Fraises à la place des myrtilles.'],
  },
  {
    id:'r89',name:'Riz Crevettes Sauce Coco',kcal:490,protein:30,carbs:52,fat:16,fiber:3,difficulty:'medium',budget:'medium',prepTime:20,category:'post_workout',tags:['complet','protéines','savoureux'],image:'🍤',
    ingredients:[{name:'Crevettes',quantity:'200g'},{name:'Riz',quantity:'80g'},{name:'Lait de coco',quantity:'100ml'},{name:'Curry',quantity:'1 c.à.c'},{name:'Poivron',quantity:'1'},{name:'Coriandre',quantity:'Au goût'}],
    steps:['Cuis le riz.','Saisis crevettes et poivron 3 min.','Ajoute lait de coco et curry, mijote 5 min.'],substitutions:['Poulet à la place des crevettes.'],
  },
  // ══════════════════════════════════════════
  //   📦 RECETTES PRISE DE MASSE & SÈCHE
  // ══════════════════════════════════════════
  {
    id:'r90',name:'Bowl Protéiné Coco Mangue',kcal:620,protein:38,carbs:65,fat:22,fiber:6,difficulty:'easy',budget:'medium',prepTime:10,category:'breakfast',tags:["prise-masse", "protéines", "tropical"],image:'🥥',
    ingredients:[{name:'Yaourt grec',quantity:'200g'},{name:'Mangue',quantity:'150g'},{name:'Whey vanille',quantity:'30g'},{name:'Noix de coco râpée',quantity:'20g'},{name:'Granola',quantity:'40g'}],
    steps:["Mixe yaourt et whey.", "Coupe la mangue en dés, garnis de granola et coco."],substitutions:["Papaye ou ananas."],
  },
  {
    id:'r91',name:'Crêpes Protéinées Banane',kcal:580,protein:35,carbs:62,fat:20,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'breakfast',tags:["prise-masse", "gourmand"],image:'🥞',
    ingredients:[{name:'Flocons d avoine',quantity:'80g'},{name:'Oeufs',quantity:'3'},{name:'Banane',quantity:'1'},{name:'Lait',quantity:'100ml'},{name:'Beurre de cacahuète',quantity:'20g'}],
    steps:["Mixe tous les ingrédients, cuis 2 min par face.", "Garnis de beurre de cacahuète."],substitutions:["Beurre d amande."],
  },
  {
    id:'r92',name:'Bagel Saumon Cream Cheese',kcal:560,protein:32,carbs:48,fat:26,fiber:3,difficulty:'easy',budget:'high',prepTime:10,category:'breakfast',tags:["prise-masse", "oméga-3"],image:'🥯',
    ingredients:[{name:'Bagel complet',quantity:'1'},{name:'Saumon fumé',quantity:'80g'},{name:'Cream cheese',quantity:'40g'},{name:'Avocat',quantity:'1/4'}],
    steps:["Tartine le bagel de cream cheese.", "Ajoute saumon et avocat."],substitutions:["Truite fumée."],
  },
  {
    id:'r93',name:'Smoothie Mass Gainer',kcal:650,protein:40,carbs:75,fat:18,fiber:5,difficulty:'easy',budget:'medium',prepTime:5,category:'breakfast',tags:["prise-masse", "rapide"],image:'🥤',
    ingredients:[{name:'Banane',quantity:'2'},{name:'Lait entier',quantity:'300ml'},{name:'Whey chocolat',quantity:'40g'},{name:'Beurre de cacahuète',quantity:'25g'},{name:'Flocons d avoine',quantity:'40g'}],
    steps:["Mixe tout 30 secondes, sers immédiatement."],substitutions:["Lait d avoine et miel."],
  },
  {
    id:'r94',name:'Tartines Ricotta Figues',kcal:520,protein:22,carbs:58,fat:22,fiber:4,difficulty:'easy',budget:'medium',prepTime:8,category:'breakfast',tags:["prise-masse", "végétarien"],image:'🍯',
    ingredients:[{name:'Pain complet',quantity:'3 tranches'},{name:'Ricotta',quantity:'80g'},{name:'Figues',quantity:'3'},{name:'Miel',quantity:'1 c.à.s'},{name:'Noix',quantity:'15g'}],
    steps:["Tartine de ricotta, dispose les figues.", "Arrose de miel et noix concassées."],substitutions:["Poires."],
  },
  {
    id:'r95',name:'Açaí Bowl Énergie',kcal:580,protein:28,carbs:72,fat:18,fiber:8,difficulty:'easy',budget:'high',prepTime:10,category:'breakfast',tags:["prise-masse", "antioxydants"],image:'🫐',
    ingredients:[{name:'Pulpe d açaí',quantity:'200g'},{name:'Banane congelée',quantity:'1'},{name:'Lait d amande',quantity:'100ml'},{name:'Granola protéiné',quantity:'50g'}],
    steps:["Mixe açaí, banane et lait.", "Garnis de granola."],substitutions:["Myrtilles congelées."],
  },
  {
    id:'r96',name:'Gaufres Avoine Protéinées',kcal:540,protein:30,carbs:60,fat:18,fiber:5,difficulty:'medium',budget:'low',prepTime:20,category:'breakfast',tags:["prise-masse", "gourmand"],image:'🧇',
    ingredients:[{name:'Flocons d avoine',quantity:'100g'},{name:'Oeufs',quantity:'2'},{name:'Yaourt grec',quantity:'100g'},{name:'Whey',quantity:'20g'},{name:'Fruits rouges',quantity:'80g'}],
    steps:["Mixe avoine, oeufs, yaourt et whey.", "Cuis dans le gaufrier, sers avec fruits."],substitutions:["Miel ou sirop d érable."],
  },
  {
    id:'r97',name:'French Toast Protéiné',kcal:600,protein:34,carbs:58,fat:24,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'breakfast',tags:["prise-masse", "gourmand"],image:'🍞',
    ingredients:[{name:'Pain complet',quantity:'4 tranches'},{name:'Oeufs',quantity:'3'},{name:'Lait',quantity:'100ml'},{name:'Cannelle',quantity:'1 pincée'},{name:'Sirop d érable',quantity:'1 c.à.s'}],
    steps:["Bats oeufs, lait et cannelle. Trempe le pain.", "Cuis à la poêle 2 min par face."],substitutions:["Fruits frais."],
  },
  {
    id:'r98',name:'Porridge Chocolat Cacahuète',kcal:620,protein:30,carbs:68,fat:24,fiber:6,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:["prise-masse", "gourmand"],image:'🍫',
    ingredients:[{name:'Flocons d avoine',quantity:'100g'},{name:'Lait',quantity:'300ml'},{name:'Cacao',quantity:'15g'},{name:'Beurre de cacahuète',quantity:'25g'},{name:'Banane',quantity:'1'}],
    steps:["Cuis les flocons 5 min, ajoute le cacao.", "Garnis de beurre de cacahuète et banane."],substitutions:["Beurre d amande."],
  },
  {
    id:'r99',name:'Overnight Oats Protéinés',kcal:500,protein:32,carbs:58,fat:14,fiber:7,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["prise-masse", "meal-prep"],image:'🫙',
    ingredients:[{name:'Flocons d avoine',quantity:'80g'},{name:'Lait',quantity:'200ml'},{name:'Whey vanille',quantity:'25g'},{name:'Graines de chia',quantity:'15g'},{name:'Fruits',quantity:'100g'}],
    steps:["Mélange tout dans un bocal le soir.", "Le matin, ajoute les fruits."],substitutions:["Yaourt grec."],
  },
  {
    id:'r100',name:'Wrap Oeufs Avocat',kcal:530,protein:28,carbs:42,fat:26,fiber:6,difficulty:'easy',budget:'medium',prepTime:10,category:'breakfast',tags:["prise-masse", "protéines"],image:'🌯',
    ingredients:[{name:'Tortilla complète',quantity:'1'},{name:'Oeufs brouillés',quantity:'3'},{name:'Avocat',quantity:'1/2'},{name:'Fromage râpé',quantity:'20g'}],
    steps:["Brouille les oeufs, garnis la tortilla.", "Ajoute avocat et fromage, roule."],substitutions:["Dinde fumée."],
  },
  {
    id:'r101',name:'Bowl Cottage Fruits',kcal:470,protein:38,carbs:48,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["prise-masse", "rapide"],image:'🧀',
    ingredients:[{name:'Cottage cheese',quantity:'250g'},{name:'Fruits de saison',quantity:'150g'},{name:'Granola',quantity:'30g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Verse le cottage cheese dans un bol.", "Ajoute fruits, granola et miel."],substitutions:["Fromage blanc."],
  },
  {
    id:'r102',name:'Pancakes Patate Douce',kcal:540,protein:22,carbs:72,fat:16,fiber:5,difficulty:'medium',budget:'low',prepTime:20,category:'breakfast',tags:["prise-masse", "énergie"],image:'🍠',
    ingredients:[{name:'Patate douce cuite',quantity:'150g'},{name:'Flocons d avoine',quantity:'60g'},{name:'Oeufs',quantity:'2'},{name:'Lait',quantity:'50ml'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Écrase la patate douce, mixe avec le reste.", "Cuis 2 min par face."],substitutions:["Purée de potiron."],
  },
  {
    id:'r103',name:'Egg Muffins Fromage',kcal:490,protein:34,carbs:22,fat:28,fiber:3,difficulty:'medium',budget:'low',prepTime:25,category:'breakfast',tags:["prise-masse", "meal-prep"],image:'🥚',
    ingredients:[{name:'Oeufs',quantity:'6'},{name:'Poivron',quantity:'1'},{name:'Fromage râpé',quantity:'60g'},{name:'Épinards',quantity:'50g'}],
    steps:["Bats les oeufs, ajoute légumes et fromage.", "Verse dans moules, cuis 15 min à 190°C."],substitutions:["Tomates séchées."],
  },
  {
    id:'r104',name:'Smoothie Bowl Mangue Curcuma',kcal:510,protein:25,carbs:62,fat:18,fiber:5,difficulty:'easy',budget:'medium',prepTime:8,category:'breakfast',tags:["prise-masse", "anti-inflammatoire"],image:'🥭',
    ingredients:[{name:'Mangue congelée',quantity:'200g'},{name:'Banane',quantity:'1'},{name:'Lait de coco',quantity:'100ml'},{name:'Whey vanille',quantity:'25g'},{name:'Curcuma',quantity:'1/2 c.à.c'}],
    steps:["Mixe mangue, banane, lait et whey.", "Garnis et ajoute curcuma."],substitutions:["Ananas congelé."],
  },
  {
    id:'r105',name:'Bol Quinoa Petit-Déj',kcal:530,protein:24,carbs:62,fat:20,fiber:8,difficulty:'medium',budget:'medium',prepTime:20,category:'breakfast',tags:["prise-masse", "fibres"],image:'🥗',
    ingredients:[{name:'Quinoa',quantity:'80g'},{name:'Lait de coco',quantity:'150ml'},{name:'Banane',quantity:'1'},{name:'Noix de pécan',quantity:'20g'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:["Cuis quinoa dans lait de coco 15 min.", "Garnis de banane, noix et miel."],substitutions:["Noisettes."],
  },
  {
    id:'r106',name:'Tartines Beurre Amande Banane',kcal:480,protein:18,carbs:55,fat:22,fiber:5,difficulty:'easy',budget:'medium',prepTime:5,category:'breakfast',tags:["prise-masse", "rapide"],image:'🍌',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Beurre d amande',quantity:'30g'},{name:'Banane',quantity:'1'},{name:'Miel',quantity:'1 filet'}],
    steps:["Toaste le pain, tartine de beurre d amande.", "Ajoute banane et miel."],substitutions:["Beurre de cacahuète."],
  },
  {
    id:'r107',name:'Brioche Perdue Protéinée',kcal:560,protein:26,carbs:62,fat:22,fiber:2,difficulty:'easy',budget:'medium',prepTime:12,category:'breakfast',tags:["prise-masse", "gourmand"],image:'🍩',
    ingredients:[{name:'Brioche',quantity:'4 tranches'},{name:'Oeufs',quantity:'2'},{name:'Lait',quantity:'80ml'},{name:'Whey vanille',quantity:'15g'},{name:'Fruits rouges',quantity:'80g'}],
    steps:["Bats oeufs, lait et whey. Trempe la brioche.", "Dore à la poêle, sers avec fruits."],substitutions:["Pain de mie."],
  },
  {
    id:'r108',name:'Muffins Banane Protéinés',kcal:550,protein:28,carbs:62,fat:20,fiber:4,difficulty:'medium',budget:'low',prepTime:30,category:'breakfast',tags:["prise-masse", "batch-cooking"],image:'🧁',
    ingredients:[{name:'Bananes mûres',quantity:'3'},{name:'Flocons d avoine',quantity:'120g'},{name:'Oeufs',quantity:'2'},{name:'Whey',quantity:'30g'},{name:'Pépites chocolat',quantity:'30g'}],
    steps:["Mixe bananes, avoine, oeufs et whey.", "Verse dans moules, cuis 20 min à 180°C."],substitutions:["Sans pépites."],
  },
  {
    id:'r109',name:'Fromage Blanc Granola XL',kcal:510,protein:35,carbs:52,fat:16,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["prise-masse", "rapide"],image:'🥣',
    ingredients:[{name:'Fromage blanc 0%',quantity:'300g'},{name:'Granola',quantity:'60g'},{name:'Banane',quantity:'1'},{name:'Miel',quantity:'1 c.à.s'},{name:'Amandes',quantity:'15g'}],
    steps:["Fromage blanc + granola + banane en rondelles.", "Arrose de miel et amandes."],substitutions:["Skyr."],
  },
  {
    id:'r110',name:'Omelette Blanche Épinards',kcal:220,protein:28,carbs:4,fat:10,fiber:2,difficulty:'easy',budget:'low',prepTime:8,category:'breakfast',tags:["sèche", "protéines", "low-carb"],image:'🥬',
    ingredients:[{name:'Blancs d oeufs',quantity:'6'},{name:'Épinards frais',quantity:'100g'},{name:'Herbes de Provence',quantity:'1 pincée'}],
    steps:["Fais tomber les épinards. Verse les blancs battus.", "Cuis 4 min à feu doux, plie et sers."],substitutions:["Roquette."],
  },
  {
    id:'r111',name:'Skyr Nature Fruits Rouges',kcal:180,protein:24,carbs:18,fat:2,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'breakfast',tags:["sèche", "rapide"],image:'🍓',
    ingredients:[{name:'Skyr nature',quantity:'200g'},{name:'Fruits rouges',quantity:'100g'},{name:'Stévia',quantity:'1 pincée'}],
    steps:["Verse le skyr, ajoute les fruits rouges."],substitutions:["Yaourt grec 0%."],
  },
  {
    id:'r112',name:'Smoothie Vert Détox',kcal:190,protein:15,carbs:28,fat:3,fiber:5,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["sèche", "détox"],image:'🥝',
    ingredients:[{name:'Épinards',quantity:'80g'},{name:'Kiwi',quantity:'1'},{name:'Banane',quantity:'1/2'},{name:'Eau de coco',quantity:'200ml'}],
    steps:["Mixe tout 30 secondes, sers immédiatement."],substitutions:["Concombre."],
  },
  {
    id:'r113',name:'Pudding Chia Léger',kcal:210,protein:12,carbs:22,fat:8,fiber:10,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["sèche", "fibres"],image:'🫙',
    ingredients:[{name:'Graines de chia',quantity:'30g'},{name:'Lait d amande',quantity:'200ml'},{name:'Vanille',quantity:'1/2 c.à.c'},{name:'Fruits',quantity:'50g'}],
    steps:["Mélange chia et lait le soir. Réfrigère 6h.", "Garnis de fruits le matin."],substitutions:["Lait de coco light."],
  },
  {
    id:'r114',name:'Tartine Cottage Tomate',kcal:195,protein:20,carbs:18,fat:5,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["sèche", "rapide"],image:'🍅',
    ingredients:[{name:'Pain complet',quantity:'1 tranche'},{name:'Cottage cheese',quantity:'100g'},{name:'Tomate',quantity:'1'},{name:'Basilic',quantity:'3 feuilles'}],
    steps:["Toaste le pain, tartine de cottage cheese.", "Ajoute tomate et basilic."],substitutions:["Concombre."],
  },
  {
    id:'r115',name:'Tofu Brouillé Légumes',kcal:230,protein:22,carbs:12,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:["sèche", "vegan"],image:'🟡',
    ingredients:[{name:'Tofu ferme',quantity:'200g'},{name:'Curcuma',quantity:'1/2 c.à.c'},{name:'Épinards',quantity:'60g'},{name:'Champignons',quantity:'80g'}],
    steps:["Émiette le tofu, fais revenir avec curcuma.", "Ajoute légumes, cuis 5 min."],substitutions:["Poivron."],
  },
  {
    id:'r116',name:'Crêpes Légères Protéinées',kcal:250,protein:25,carbs:24,fat:6,fiber:2,difficulty:'easy',budget:'low',prepTime:12,category:'breakfast',tags:["sèche", "protéines"],image:'🥞',
    ingredients:[{name:'Blancs d oeufs',quantity:'4'},{name:'Flocons d avoine',quantity:'40g'},{name:'Yaourt grec 0%',quantity:'80g'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Mixe tout. Cuis de petites crêpes 2 min par face."],substitutions:["Whey vanille."],
  },
  {
    id:'r117',name:'Porridge Pomme Cannelle Light',kcal:280,protein:12,carbs:48,fat:5,fiber:6,difficulty:'easy',budget:'low',prepTime:10,category:'breakfast',tags:["sèche", "fibres"],image:'🍎',
    ingredients:[{name:'Flocons d avoine',quantity:'50g'},{name:'Eau',quantity:'200ml'},{name:'Pomme',quantity:'1'},{name:'Cannelle',quantity:'1 c.à.c'}],
    steps:["Cuis les flocons dans l eau 5 min.", "Râpe la pomme, saupoudre de cannelle."],substitutions:["Poire."],
  },
  {
    id:'r118',name:'Mug Cake Protéiné',kcal:200,protein:22,carbs:16,fat:5,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'breakfast',tags:["sèche", "rapide"],image:'☕',
    ingredients:[{name:'Whey chocolat',quantity:'30g'},{name:'Blanc d oeuf',quantity:'1'},{name:'Cacao',quantity:'5g'},{name:'Levure',quantity:'1/4 c.à.c'}],
    steps:["Mélange tout dans une tasse. Micro-ondes 90 sec."],substitutions:["Whey vanille."],
  },
  {
    id:'r119',name:'Yaourt Protéiné Graines',kcal:200,protein:28,carbs:14,fat:4,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'breakfast',tags:["sèche", "rapide"],image:'🥄',
    ingredients:[{name:'Yaourt grec 0%',quantity:'200g'},{name:'Whey vanille',quantity:'15g'},{name:'Graines de chia',quantity:'10g'},{name:'Fruits rouges',quantity:'50g'}],
    steps:["Mélange yaourt et whey. Ajoute graines et fruits."],substitutions:["Graines de lin."],
  },
  {
    id:'r120',name:'Wrap Léger Dinde',kcal:260,protein:28,carbs:22,fat:6,fiber:3,difficulty:'easy',budget:'medium',prepTime:5,category:'breakfast',tags:["sèche", "protéines"],image:'🌯',
    ingredients:[{name:'Tortilla complète',quantity:'1'},{name:'Blanc de dinde',quantity:'60g'},{name:'Salade',quantity:'30g'},{name:'Tomate',quantity:'1/2'},{name:'Moutarde',quantity:'1 c.à.c'}],
    steps:["Tartine de moutarde, ajoute dinde et crudités. Roule."],substitutions:["Poulet grillé."],
  },
  {
    id:'r121',name:'Compote Cottage',kcal:190,protein:16,carbs:22,fat:4,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["sèche", "rapide"],image:'🍏',
    ingredients:[{name:'Cottage cheese',quantity:'120g'},{name:'Compote sans sucre',quantity:'100g'},{name:'Cannelle',quantity:'1 pincée'},{name:'Amandes effilées',quantity:'5g'}],
    steps:["Cottage + compote + cannelle et amandes."],substitutions:["Fromage blanc 0%."],
  },
  {
    id:'r122',name:'Galette Courgette Oeuf',kcal:240,protein:22,carbs:12,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'breakfast',tags:["sèche", "légumes"],image:'🥒',
    ingredients:[{name:'Courgette râpée',quantity:'200g'},{name:'Oeufs',quantity:'2'},{name:'Farine d avoine',quantity:'20g'}],
    steps:["Presse la courgette. Mélange avec oeufs et farine.", "Cuis en galettes 3 min par face."],substitutions:["Carotte râpée."],
  },
  {
    id:'r123',name:'Açaí Bowl Light',kcal:210,protein:8,carbs:38,fat:4,fiber:6,difficulty:'easy',budget:'high',prepTime:8,category:'breakfast',tags:["sèche", "antioxydants"],image:'🟣',
    ingredients:[{name:'Pulpe d açaí non sucrée',quantity:'100g'},{name:'Fruits rouges congelés',quantity:'100g'},{name:'Eau',quantity:'80ml'},{name:'Graines de lin',quantity:'10g'}],
    steps:["Mixe açaí, fruits et eau. Garnis de graines."],substitutions:["Banane congelée."],
  },
  {
    id:'r124',name:'Pancakes Courgette Light',kcal:210,protein:24,carbs:14,fat:6,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'breakfast',tags:["sèche", "légumes"],image:'🥒',
    ingredients:[{name:'Courgette râpée',quantity:'150g'},{name:'Blancs d oeufs',quantity:'4'},{name:'Farine d avoine',quantity:'30g'}],
    steps:["Mélange courgette pressée, blancs et farine.", "Cuis en pancakes 2 min par face."],substitutions:["Fromage frais léger."],
  },
  {
    id:'r125',name:'Pâtes Bolognaise Boeuf',kcal:680,protein:45,carbs:72,fat:20,fiber:5,difficulty:'medium',budget:'medium',prepTime:30,category:'lunch',tags:["prise-masse", "classique"],image:'🍝',
    ingredients:[{name:'Pâtes complètes',quantity:'120g'},{name:'Viande hachée 5%',quantity:'200g'},{name:'Sauce tomate',quantity:'200ml'},{name:'Oignon',quantity:'1'},{name:'Parmesan',quantity:'20g'}],
    steps:["Cuis pâtes. Reviens oignon et viande.", "Ajoute sauce, mijote 15 min. Mélange."],substitutions:["Dinde hachée."],
  },
  {
    id:'r126',name:'Riz Poulet Teriyaki',kcal:620,protein:42,carbs:68,fat:16,fiber:3,difficulty:'medium',budget:'medium',prepTime:25,category:'lunch',tags:["prise-masse", "asiatique"],image:'🍚',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Riz basmati',quantity:'100g'},{name:'Sauce soja',quantity:'2 c.à.s'},{name:'Miel',quantity:'1 c.à.s'},{name:'Brocoli',quantity:'100g'}],
    steps:["Cuis riz. Marine poulet dans soja et miel.", "Poêle poulet 6 min avec brocoli."],substitutions:["Dinde."],
  },
  {
    id:'r127',name:'Burger Maison Boeuf',kcal:700,protein:48,carbs:52,fat:32,fiber:4,difficulty:'medium',budget:'medium',prepTime:25,category:'lunch',tags:["prise-masse", "gourmand"],image:'🍔',
    ingredients:[{name:'Steak haché 5%',quantity:'200g'},{name:'Pain burger complet',quantity:'1'},{name:'Fromage',quantity:'1 tranche'},{name:'Salade',quantity:'2 feuilles'},{name:'Tomate',quantity:'2 rondelles'}],
    steps:["Forme le steak, cuis 4 min par face.", "Assemble le burger avec garnitures."],substitutions:["Poulet grillé."],
  },
  {
    id:'r128',name:'Couscous Poulet Légumes',kcal:650,protein:40,carbs:78,fat:16,fiber:8,difficulty:'medium',budget:'low',prepTime:35,category:'lunch',tags:["prise-masse", "traditionnel"],image:'🫕',
    ingredients:[{name:'Semoule',quantity:'120g'},{name:'Cuisses de poulet',quantity:'200g'},{name:'Courgette',quantity:'1'},{name:'Pois chiches',quantity:'80g'},{name:'Carottes',quantity:'2'}],
    steps:["Cuis poulet avec légumes 25 min.", "Prépare semoule, sers ensemble."],substitutions:["Agneau."],
  },
  {
    id:'r129',name:'Wrap Poulet Guacamole',kcal:580,protein:38,carbs:48,fat:24,fiber:6,difficulty:'easy',budget:'medium',prepTime:10,category:'lunch',tags:["prise-masse", "rapide"],image:'🌯',
    ingredients:[{name:'Tortilla',quantity:'1'},{name:'Poulet grillé',quantity:'150g'},{name:'Avocat',quantity:'1/2'},{name:'Tomate',quantity:'1'},{name:'Coriandre',quantity:'Au goût'}],
    steps:["Écrase avocat. Coupe poulet en lanières.", "Garnis la tortilla, roule."],substitutions:["Dinde."],
  },
  {
    id:'r130',name:'Steak Frites Maison',kcal:720,protein:50,carbs:55,fat:30,fiber:4,difficulty:'medium',budget:'medium',prepTime:35,category:'lunch',tags:["prise-masse", "classique"],image:'🥩',
    ingredients:[{name:'Steak de boeuf',quantity:'250g'},{name:'Pommes de terre',quantity:'250g'},{name:'Huile d olive',quantity:'1 c.à.s'},{name:'Thym',quantity:'1 branche'}],
    steps:["Frites au four 25 min à 220°C.", "Cuis steak 3 min par face."],substitutions:["Patate douce."],
  },
  {
    id:'r131',name:'Poke Bowl Saumon',kcal:580,protein:36,carbs:52,fat:24,fiber:6,difficulty:'easy',budget:'high',prepTime:15,category:'lunch',tags:["prise-masse", "oméga-3"],image:'🐟',
    ingredients:[{name:'Riz à sushi',quantity:'80g'},{name:'Saumon frais',quantity:'150g'},{name:'Avocat',quantity:'1/2'},{name:'Edamame',quantity:'50g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis riz. Coupe saumon en cubes.", "Assemble avec avocat et edamame."],substitutions:["Thon frais."],
  },
  {
    id:'r132',name:'Gratin Pâtes Thon',kcal:640,protein:38,carbs:65,fat:22,fiber:3,difficulty:'medium',budget:'low',prepTime:30,category:'lunch',tags:["prise-masse", "gourmand"],image:'🧀',
    ingredients:[{name:'Pâtes',quantity:'120g'},{name:'Thon en boîte',quantity:'200g'},{name:'Béchamel légère',quantity:'150ml'},{name:'Fromage râpé',quantity:'40g'},{name:'Épinards',quantity:'80g'}],
    steps:["Cuis pâtes. Mélange thon, épinards, béchamel.", "Fromage dessus, gratine 15 min."],substitutions:["Saumon en boîte."],
  },
  {
    id:'r133',name:'Chili Con Carne',kcal:580,protein:42,carbs:48,fat:18,fiber:12,difficulty:'medium',budget:'low',prepTime:30,category:'lunch',tags:["prise-masse", "fibres"],image:'🌶️',
    ingredients:[{name:'Viande hachée 5%',quantity:'200g'},{name:'Haricots rouges',quantity:'100g'},{name:'Tomates concassées',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Cumin',quantity:'1 c.à.c'}],
    steps:["Reviens oignon et viande 5 min.", "Ajoute haricots, tomates, cumin, mijote 20 min."],substitutions:["Lentilles."],
  },
  {
    id:'r134',name:'Tacos Boeuf Fromage',kcal:620,protein:38,carbs:52,fat:26,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["prise-masse", "gourmand"],image:'🌮',
    ingredients:[{name:'Tortillas de maïs',quantity:'3'},{name:'Steak haché',quantity:'200g'},{name:'Fromage râpé',quantity:'40g'},{name:'Salade',quantity:'50g'},{name:'Tomate',quantity:'1'}],
    steps:["Cuis boeuf avec épices tex-mex.", "Garnis les tortillas."],substitutions:["Poulet émincé."],
  },
  {
    id:'r135',name:'Pizza Protéinée Maison',kcal:620,protein:38,carbs:58,fat:24,fiber:4,difficulty:'hard',budget:'medium',prepTime:35,category:'lunch',tags:["prise-masse", "gourmand"],image:'🍕',
    ingredients:[{name:'Pâte à pizza complète',quantity:'200g'},{name:'Sauce tomate',quantity:'60g'},{name:'Mozzarella',quantity:'80g'},{name:'Poulet grillé',quantity:'100g'},{name:'Poivrons',quantity:'1'}],
    steps:["Étale pâte, tartine de sauce.", "Ajoute garnitures, cuis 12 min à 230°C."],substitutions:["Thon."],
  },
  {
    id:'r136',name:'Gratin Patate Douce Poulet',kcal:600,protein:42,carbs:52,fat:20,fiber:5,difficulty:'medium',budget:'medium',prepTime:35,category:'lunch',tags:["prise-masse", "protéines"],image:'🍠',
    ingredients:[{name:'Patate douce',quantity:'250g'},{name:'Blanc de poulet',quantity:'200g'},{name:'Crème légère',quantity:'100ml'},{name:'Fromage râpé',quantity:'30g'}],
    steps:["Couche patate douce et poulet avec crème.", "Fromage dessus, cuis 30 min à 190°C."],substitutions:["Dinde."],
  },
  {
    id:'r137',name:'Pâtes Carbonara Légère',kcal:610,protein:35,carbs:68,fat:20,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'lunch',tags:["prise-masse", "classique"],image:'🍝',
    ingredients:[{name:'Pâtes',quantity:'120g'},{name:'Dinde fumée',quantity:'100g'},{name:'Oeufs',quantity:'2'},{name:'Parmesan',quantity:'30g'},{name:'Poivre noir',quantity:'Au goût'}],
    steps:["Cuis pâtes. Reviens dinde.", "Mélange oeufs et parmesan hors du feu, verse sur pâtes."],substitutions:["Poulet fumé."],
  },
  {
    id:'r138',name:'Bol Poulet Mexicain',kcal:580,protein:40,carbs:52,fat:20,fiber:8,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["prise-masse", "fibres"],image:'🇲🇽',
    ingredients:[{name:'Poulet grillé',quantity:'200g'},{name:'Riz',quantity:'80g'},{name:'Haricots noirs',quantity:'80g'},{name:'Maïs',quantity:'60g'},{name:'Avocat',quantity:'1/4'}],
    steps:["Cuis riz et poulet séparément.", "Assemble dans un bol avec haricots et maïs."],substitutions:["Boeuf haché."],
  },
  {
    id:'r139',name:'Risotto Crevettes Asperges',kcal:600,protein:35,carbs:68,fat:18,fiber:4,difficulty:'hard',budget:'high',prepTime:30,category:'lunch',tags:["prise-masse", "gourmand"],image:'🦐',
    ingredients:[{name:'Riz arborio',quantity:'100g'},{name:'Crevettes',quantity:'200g'},{name:'Asperges vertes',quantity:'150g'},{name:'Bouillon',quantity:'500ml'},{name:'Parmesan',quantity:'30g'}],
    steps:["Reviens oignon, ajout riz, mouille progressivement.", "5 min avant fin, ajoute crevettes et parmesan."],substitutions:["Champignons."],
  },
  {
    id:'r140',name:'Pad Thaï Crevettes',kcal:590,protein:32,carbs:62,fat:22,fiber:4,difficulty:'medium',budget:'medium',prepTime:20,category:'lunch',tags:["prise-masse", "asiatique"],image:'🍜',
    ingredients:[{name:'Nouilles de riz',quantity:'100g'},{name:'Crevettes',quantity:'180g'},{name:'Oeuf',quantity:'1'},{name:'Cacahuètes',quantity:'15g'},{name:'Sauce soja',quantity:'2 c.à.s'}],
    steps:["Cuis nouilles. Saisis crevettes 2 min.", "Ajoute oeuf brouillé, nouilles et cacahuètes."],substitutions:["Tofu."],
  },
  {
    id:'r141',name:'Croque-Monsieur Maison',kcal:540,protein:32,carbs:42,fat:24,fiber:2,difficulty:'easy',budget:'low',prepTime:10,category:'lunch',tags:["prise-masse", "rapide"],image:'🥪',
    ingredients:[{name:'Pain de mie complet',quantity:'4 tranches'},{name:'Fromage',quantity:'2 tranches'},{name:'Dinde',quantity:'80g'},{name:'Béchamel',quantity:'2 c.à.s'}],
    steps:["Tartine béchamel, ajoute dinde et fromage.", "Gratine 5 min au four."],substitutions:["Poulet."],
  },
  {
    id:'r142',name:'Bol Riz Boeuf Kimchi',kcal:640,protein:40,carbs:68,fat:20,fiber:4,difficulty:'medium',budget:'medium',prepTime:20,category:'lunch',tags:["prise-masse", "coréen"],image:'🥘',
    ingredients:[{name:'Riz',quantity:'100g'},{name:'Boeuf émincé',quantity:'200g'},{name:'Kimchi',quantity:'60g'},{name:'Oeuf',quantity:'1'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis riz. Saisis boeuf 4 min.", "Fais un oeuf au plat, assemble avec kimchi."],substitutions:["Poulet émincé."],
  },
  {
    id:'r143',name:'Salade Poulet Quinoa',kcal:350,protein:38,carbs:28,fat:10,fiber:6,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["sèche", "protéines", "fibres"],image:'🥗',
    ingredients:[{name:'Blanc de poulet',quantity:'180g'},{name:'Quinoa',quantity:'60g'},{name:'Tomates cerises',quantity:'100g'},{name:'Concombre',quantity:'1/2'},{name:'Citron',quantity:'1'}],
    steps:["Cuis quinoa et poulet grillé.", "Assemble et assaisonne au citron."],substitutions:["Crevettes."],
  },
  {
    id:'r144',name:'Wok Poulet Légumes Light',kcal:310,protein:35,carbs:18,fat:10,fiber:5,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["sèche", "asiatique"],image:'🥡',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Brocoli',quantity:'100g'},{name:'Poivron',quantity:'1'},{name:'Champignons',quantity:'80g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Coupe poulet en lanières, saisis 4 min.", "Ajoute légumes, saute 5 min."],substitutions:["Dinde."],
  },
  {
    id:'r145',name:'Cabillaud Vapeur Légumes',kcal:280,protein:38,carbs:12,fat:8,fiber:4,difficulty:'easy',budget:'medium',prepTime:20,category:'lunch',tags:["sèche", "poisson"],image:'🐟',
    ingredients:[{name:'Cabillaud',quantity:'200g'},{name:'Courgette',quantity:'1'},{name:'Carottes',quantity:'2'},{name:'Citron',quantity:'1'},{name:'Aneth',quantity:'Au goût'}],
    steps:["Cuis cabillaud et légumes à la vapeur 12 min.", "Arrose de citron et aneth."],substitutions:["Lieu noir."],
  },
  {
    id:'r146',name:'Salade Thon Haricots Verts',kcal:290,protein:35,carbs:14,fat:10,fiber:5,difficulty:'easy',budget:'low',prepTime:10,category:'lunch',tags:["sèche", "rapide"],image:'🥫',
    ingredients:[{name:'Thon au naturel',quantity:'200g'},{name:'Haricots verts',quantity:'200g'},{name:'Tomate',quantity:'1'},{name:'Olives',quantity:'8'}],
    steps:["Cuis haricots verts al dente.", "Émiette thon, assemble."],substitutions:["Saumon en boîte."],
  },
  {
    id:'r147',name:'Soupe Lentilles Épinards',kcal:260,protein:20,carbs:32,fat:4,fiber:10,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:["sèche", "fibres", "végétarien"],image:'🍲',
    ingredients:[{name:'Lentilles corail',quantity:'80g'},{name:'Épinards',quantity:'100g'},{name:'Oignon',quantity:'1'},{name:'Cumin',quantity:'1 c.à.c'},{name:'Bouillon',quantity:'500ml'}],
    steps:["Reviens oignon, ajoute lentilles et bouillon 15 min.", "Ajoute épinards, mixe."],substitutions:["Lentilles vertes."],
  },
  {
    id:'r148',name:'Tartare Saumon Light',kcal:300,protein:32,carbs:8,fat:16,fiber:2,difficulty:'easy',budget:'high',prepTime:10,category:'lunch',tags:["sèche", "oméga-3"],image:'🐠',
    ingredients:[{name:'Saumon frais',quantity:'200g'},{name:'Citron vert',quantity:'1'},{name:'Ciboulette',quantity:'1 bouquet'},{name:'Avocat',quantity:'1/4'}],
    steps:["Coupe saumon en dés.", "Mélange avec citron, ciboulette, sers avec avocat."],substitutions:["Thon frais."],
  },
  {
    id:'r149',name:'Salade César Légère',kcal:320,protein:34,carbs:12,fat:14,fiber:3,difficulty:'easy',budget:'medium',prepTime:10,category:'lunch',tags:["sèche", "classique"],image:'🥗',
    ingredients:[{name:'Blanc de poulet',quantity:'180g'},{name:'Salade romaine',quantity:'150g'},{name:'Parmesan',quantity:'15g'},{name:'Yaourt grec 0%',quantity:'30g'},{name:'Moutarde',quantity:'1 c.à.c'}],
    steps:["Grille poulet. Prépare sauce yaourt-moutarde.", "Assemble salade, poulet et sauce."],substitutions:["Crevettes."],
  },
  {
    id:'r150',name:'Dinde Grillée Ratatouille',kcal:320,protein:42,carbs:18,fat:8,fiber:5,difficulty:'easy',budget:'medium',prepTime:25,category:'lunch',tags:["sèche", "protéines"],image:'🦃',
    ingredients:[{name:'Escalope de dinde',quantity:'200g'},{name:'Courgette',quantity:'1'},{name:'Aubergine',quantity:'1/2'},{name:'Tomate',quantity:'2'},{name:'Poivron',quantity:'1'}],
    steps:["Grille la dinde 5 min par face.", "Coupe légumes, cuis à la poêle 15 min."],substitutions:["Poulet."],
  },
  {
    id:'r151',name:'Bowl Crevettes Concombre',kcal:290,protein:30,carbs:16,fat:12,fiber:3,difficulty:'easy',budget:'high',prepTime:10,category:'lunch',tags:["sèche", "rapide"],image:'🦐',
    ingredients:[{name:'Crevettes',quantity:'200g'},{name:'Concombre',quantity:'1'},{name:'Avocat',quantity:'1/4'},{name:'Citron vert',quantity:'1'},{name:'Sésame',quantity:'1 c.à.c'}],
    steps:["Saisis crevettes 3 min. Coupe concombre.", "Assemble avec avocat et citron."],substitutions:["Saumon fumé."],
  },
  {
    id:'r152',name:'Poulet Tandoori Light',kcal:340,protein:40,carbs:12,fat:14,fiber:3,difficulty:'easy',budget:'low',prepTime:20,category:'lunch',tags:["sèche", "protéines", "épicé"],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Yaourt grec 0%',quantity:'80g'},{name:'Épices tandoori',quantity:'1 c.à.s'},{name:'Citron',quantity:'1/2'}],
    steps:["Marine poulet dans yaourt et épices 1h.", "Cuis au four 18 min à 200°C."],substitutions:["Dinde."],
  },
  {
    id:'r153',name:'Salade Lentilles Chèvre',kcal:330,protein:24,carbs:32,fat:12,fiber:8,difficulty:'easy',budget:'low',prepTime:15,category:'lunch',tags:["sèche", "fibres", "végétarien"],image:'🥗',
    ingredients:[{name:'Lentilles vertes',quantity:'80g'},{name:'Fromage de chèvre',quantity:'30g'},{name:'Noix',quantity:'10g'},{name:'Roquette',quantity:'60g'},{name:'Vinaigre balsamique',quantity:'1 c.à.s'}],
    steps:["Cuis lentilles 20 min. Assemble avec roquette.", "Émiette chèvre, ajoute noix et vinaigre."],substitutions:["Feta."],
  },
  {
    id:'r154',name:'Saumon Grillé Asperges',kcal:340,protein:36,carbs:8,fat:18,fiber:3,difficulty:'easy',budget:'high',prepTime:15,category:'lunch',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Pavé de saumon',quantity:'180g'},{name:'Asperges vertes',quantity:'200g'},{name:'Citron',quantity:'1'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Grille saumon 4 min par face.", "Poêle asperges 5 min, citron par-dessus."],substitutions:["Truite."],
  },
  {
    id:'r155',name:'Steak Haché Salade',kcal:310,protein:36,carbs:8,fat:15,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'lunch',tags:["sèche", "protéines", "rapide"],image:'🥩',
    ingredients:[{name:'Steak haché 5%',quantity:'180g'},{name:'Salade mixte',quantity:'150g'},{name:'Tomate',quantity:'1'},{name:'Concombre',quantity:'1/2'}],
    steps:["Cuis steak 4 min par face.", "Assemble avec salade et crudités."],substitutions:["Dinde hachée."],
  },
  {
    id:'r156',name:'Buddha Bowl Légumes',kcal:300,protein:18,carbs:38,fat:8,fiber:8,difficulty:'easy',budget:'low',prepTime:15,category:'lunch',tags:["sèche", "vegan", "fibres"],image:'🥗',
    ingredients:[{name:'Quinoa',quantity:'50g'},{name:'Patate douce',quantity:'100g'},{name:'Pois chiches',quantity:'60g'},{name:'Épinards',quantity:'60g'},{name:'Tahini',quantity:'1 c.à.c'}],
    steps:["Cuis quinoa et patate douce.", "Assemble avec pois chiches et épinards."],substitutions:["Avocat."],
  },
  {
    id:'r157',name:'Gaspacho Crevettes',kcal:250,protein:24,carbs:16,fat:8,fiber:3,difficulty:'easy',budget:'medium',prepTime:10,category:'lunch',tags:["sèche", "rapide", "été"],image:'🍅',
    ingredients:[{name:'Tomates',quantity:'4'},{name:'Concombre',quantity:'1/2'},{name:'Poivron rouge',quantity:'1/2'},{name:'Crevettes',quantity:'120g'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Mixe tomates, concombre et poivron.", "Saisis crevettes 2 min, dispose sur gaspacho."],substitutions:["Croutons."],
  },
  {
    id:'r158',name:'Taboulé Libanais Poulet',kcal:420,protein:32,carbs:42,fat:14,fiber:6,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["équilibré", "fibres"],image:'🥗',
    ingredients:[{name:'Boulgour',quantity:'80g'},{name:'Poulet grillé',quantity:'150g'},{name:'Tomates',quantity:'2'},{name:'Menthe',quantity:'Au goût'},{name:'Citron',quantity:'1'}],
    steps:["Cuis boulgour. Coupe légumes et poulet.", "Assemble avec menthe et citron."],substitutions:["Quinoa."],
  },
  {
    id:'r159',name:'Sardines Grillées Salade',kcal:310,protein:28,carbs:12,fat:16,fiber:4,difficulty:'easy',budget:'low',prepTime:10,category:'lunch',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Sardines fraîches',quantity:'200g'},{name:'Salade mixte',quantity:'100g'},{name:'Tomate',quantity:'1'},{name:'Citron',quantity:'1'}],
    steps:["Grille sardines 3 min par face.", "Sers sur lit de salade."],substitutions:["Maquereaux."],
  },
  {
    id:'r160',name:'Lasagnes Boeuf Maison',kcal:680,protein:40,carbs:60,fat:28,fiber:5,difficulty:'hard',budget:'medium',prepTime:45,category:'dinner',tags:["prise-masse", "classique"],image:'🫕',
    ingredients:[{name:'Feuilles de lasagne',quantity:'200g'},{name:'Viande hachée',quantity:'250g'},{name:'Sauce tomate',quantity:'300ml'},{name:'Béchamel',quantity:'200ml'},{name:'Fromage râpé',quantity:'60g'}],
    steps:["Cuis viande avec sauce tomate.", "Monte en couches, fromage dessus, cuis 30 min à 190°C."],substitutions:["Dinde hachée."],
  },
  {
    id:'r161',name:'Curry Poulet Coco',kcal:620,protein:40,carbs:55,fat:24,fiber:5,difficulty:'medium',budget:'medium',prepTime:30,category:'dinner',tags:["prise-masse", "asiatique"],image:'🍛',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Lait de coco',quantity:'200ml'},{name:'Pâte de curry',quantity:'1 c.à.s'},{name:'Riz basmati',quantity:'80g'},{name:'Poivron',quantity:'1'}],
    steps:["Saisis poulet, ajoute curry et lait de coco.", "Mijote 15 min. Sers avec riz."],substitutions:["Crevettes."],
  },
  {
    id:'r162',name:'Spaghetti Boulettes',kcal:660,protein:42,carbs:65,fat:22,fiber:4,difficulty:'medium',budget:'medium',prepTime:30,category:'dinner',tags:["prise-masse", "classique"],image:'🍝',
    ingredients:[{name:'Spaghetti',quantity:'120g'},{name:'Viande hachée 5%',quantity:'200g'},{name:'Sauce tomate',quantity:'200ml'},{name:'Oignon',quantity:'1'},{name:'Parmesan',quantity:'20g'}],
    steps:["Forme des boulettes, cuis dans la sauce 20 min.", "Sers avec spaghetti et parmesan."],substitutions:["Dinde hachée."],
  },
  {
    id:'r163',name:'Poulet Rôti Pommes de Terre',kcal:600,protein:45,carbs:48,fat:22,fiber:4,difficulty:'medium',budget:'low',prepTime:40,category:'dinner',tags:["prise-masse", "traditionnel"],image:'🍗',
    ingredients:[{name:'Cuisses de poulet',quantity:'250g'},{name:'Pommes de terre',quantity:'200g'},{name:'Ail',quantity:'3 gousses'},{name:'Thym',quantity:'2 branches'}],
    steps:["Dispose poulet et patates au four.", "Cuis 35 min à 200°C avec ail et thym."],substitutions:["Patate douce."],
  },
  {
    id:'r164',name:'Tajine Boeuf Pruneaux',kcal:580,protein:38,carbs:52,fat:20,fiber:6,difficulty:'hard',budget:'medium',prepTime:45,category:'dinner',tags:["prise-masse", "traditionnel"],image:'🫕',
    ingredients:[{name:'Boeuf à braiser',quantity:'200g'},{name:'Pruneaux',quantity:'8'},{name:'Oignon',quantity:'2'},{name:'Cannelle',quantity:'1 bâton'},{name:'Amandes',quantity:'20g'},{name:'Semoule',quantity:'80g'}],
    steps:["Fais revenir boeuf et oignons. Ajoute pruneaux.", "Mijote 30 min. Sers avec semoule."],substitutions:["Agneau."],
  },
  {
    id:'r165',name:'Riz Sauté Boeuf Légumes',kcal:600,protein:38,carbs:62,fat:20,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'dinner',tags:["prise-masse", "asiatique"],image:'🍚',
    ingredients:[{name:'Riz',quantity:'100g'},{name:'Boeuf émincé',quantity:'200g'},{name:'Poivron',quantity:'1'},{name:'Carotte',quantity:'1'},{name:'Sauce soja',quantity:'2 c.à.s'}],
    steps:["Cuis riz. Saisis boeuf 3 min.", "Ajoute légumes et sauce soja."],substitutions:["Poulet."],
  },
  {
    id:'r166',name:'Penne Pesto Poulet',kcal:580,protein:38,carbs:60,fat:18,fiber:3,difficulty:'easy',budget:'medium',prepTime:15,category:'dinner',tags:["prise-masse", "italien"],image:'🍝',
    ingredients:[{name:'Penne',quantity:'120g'},{name:'Poulet grillé',quantity:'150g'},{name:'Pesto',quantity:'2 c.à.s'},{name:'Tomates cerises',quantity:'100g'},{name:'Parmesan',quantity:'15g'}],
    steps:["Cuis pâtes. Mélange avec pesto et poulet.", "Ajoute tomates et parmesan."],substitutions:["Crevettes."],
  },
  {
    id:'r167',name:'Bibimbap Boeuf',kcal:620,protein:38,carbs:65,fat:20,fiber:5,difficulty:'medium',budget:'medium',prepTime:25,category:'dinner',tags:["prise-masse", "coréen"],image:'🍚',
    ingredients:[{name:'Riz',quantity:'100g'},{name:'Boeuf émincé',quantity:'180g'},{name:'Épinards',quantity:'80g'},{name:'Carotte',quantity:'1'},{name:'Oeuf',quantity:'1'}],
    steps:["Cuis riz. Saisis boeuf et légumes séparément.", "Assemble, oeuf au plat dessus."],substitutions:["Poulet."],
  },
  {
    id:'r168',name:'Gratin Saumon Brocoli',kcal:560,protein:40,carbs:32,fat:28,fiber:5,difficulty:'medium',budget:'high',prepTime:30,category:'dinner',tags:["prise-masse", "oméga-3"],image:'🐟',
    ingredients:[{name:'Pavé de saumon',quantity:'200g'},{name:'Brocoli',quantity:'200g'},{name:'Crème légère',quantity:'100ml'},{name:'Fromage râpé',quantity:'30g'}],
    steps:["Dispose saumon et brocoli dans un plat.", "Crème et fromage dessus, cuis 25 min à 190°C."],substitutions:["Cabillaud."],
  },
  {
    id:'r169',name:'Poulet Tikka Masala',kcal:600,protein:42,carbs:48,fat:22,fiber:4,difficulty:'medium',budget:'medium',prepTime:30,category:'dinner',tags:["prise-masse", "indien"],image:'🍛',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Yaourt',quantity:'80g'},{name:'Sauce tomate',quantity:'200ml'},{name:'Épices tikka',quantity:'1 c.à.s'},{name:'Riz',quantity:'80g'}],
    steps:["Marine poulet dans yaourt et épices.", "Cuis dans sauce tomate 15 min. Sers avec riz."],substitutions:["Pois chiches."],
  },
  {
    id:'r170',name:'Fajitas Poulet',kcal:560,protein:36,carbs:48,fat:22,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'dinner',tags:["prise-masse", "mexicain"],image:'🌯',
    ingredients:[{name:'Poulet émincé',quantity:'200g'},{name:'Tortillas',quantity:'3'},{name:'Poivrons',quantity:'2'},{name:'Oignon',quantity:'1'},{name:'Crème fraîche',quantity:'30g'}],
    steps:["Saisis poulet et poivrons 6 min.", "Garnis les tortillas."],substitutions:["Boeuf émincé."],
  },
  {
    id:'r171',name:'Bol Hawaïen Poulet Ananas',kcal:540,protein:35,carbs:55,fat:18,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'dinner',tags:["prise-masse", "tropical"],image:'🍍',
    ingredients:[{name:'Poulet grillé',quantity:'180g'},{name:'Riz',quantity:'80g'},{name:'Ananas',quantity:'100g'},{name:'Edamame',quantity:'50g'},{name:'Sauce teriyaki',quantity:'1 c.à.s'}],
    steps:["Cuis riz et poulet.", "Assemble avec ananas, edamame et sauce."],substitutions:["Crevettes."],
  },
  {
    id:'r172',name:'Cannelloni Ricotta Épinards',kcal:560,protein:28,carbs:55,fat:22,fiber:5,difficulty:'hard',budget:'medium',prepTime:35,category:'dinner',tags:["prise-masse", "italien", "végétarien"],image:'🧀',
    ingredients:[{name:'Cannelloni',quantity:'12'},{name:'Ricotta',quantity:'200g'},{name:'Épinards',quantity:'200g'},{name:'Sauce tomate',quantity:'200ml'},{name:'Parmesan',quantity:'30g'}],
    steps:["Mélange ricotta et épinards, farce les cannelloni.", "Sauce tomate et parmesan dessus, cuis 25 min."],substitutions:["Fromage de chèvre."],
  },
  {
    id:'r173',name:'Riz Cantonais Maison',kcal:560,protein:28,carbs:68,fat:18,fiber:3,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["prise-masse", "asiatique"],image:'🍚',
    ingredients:[{name:'Riz',quantity:'120g'},{name:'Oeufs',quantity:'2'},{name:'Crevettes',quantity:'100g'},{name:'Petits pois',quantity:'60g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis riz froid. Brouille les oeufs.", "Saisis crevettes, mélange tout avec sauce soja."],substitutions:["Poulet."],
  },
  {
    id:'r174',name:'Poulet Basquaise',kcal:480,protein:38,carbs:32,fat:18,fiber:5,difficulty:'medium',budget:'medium',prepTime:35,category:'dinner',tags:["prise-masse", "traditionnel"],image:'🍗',
    ingredients:[{name:'Cuisses de poulet',quantity:'250g'},{name:'Poivrons',quantity:'2'},{name:'Tomates',quantity:'300g'},{name:'Oignon',quantity:'1'},{name:'Ail',quantity:'2 gousses'}],
    steps:["Dore poulet. Ajoute légumes et tomates.", "Mijote 25 min."],substitutions:["Dinde."],
  },
  {
    id:'r175',name:'Wok Boeuf Nouilles',kcal:580,protein:36,carbs:58,fat:22,fiber:3,difficulty:'easy',budget:'medium',prepTime:15,category:'dinner',tags:["prise-masse", "asiatique"],image:'🍜',
    ingredients:[{name:'Nouilles',quantity:'100g'},{name:'Boeuf émincé',quantity:'180g'},{name:'Brocoli',quantity:'100g'},{name:'Sauce d huître',quantity:'2 c.à.s'},{name:'Ail',quantity:'2 gousses'}],
    steps:["Cuis nouilles. Saisis boeuf et brocoli.", "Assaisonne de sauce et ail."],substitutions:["Crevettes."],
  },
  {
    id:'r176',name:'Moussaka Légère',kcal:550,protein:35,carbs:42,fat:24,fiber:6,difficulty:'hard',budget:'medium',prepTime:45,category:'dinner',tags:["prise-masse", "méditerranéen"],image:'🍆',
    ingredients:[{name:'Aubergines',quantity:'2'},{name:'Viande hachée',quantity:'200g'},{name:'Sauce tomate',quantity:'200ml'},{name:'Béchamel',quantity:'150ml'},{name:'Fromage râpé',quantity:'30g'}],
    steps:["Grille aubergines. Cuis viande avec sauce.", "Monte en couches, béchamel dessus, gratine 25 min."],substitutions:["Courgettes."],
  },
  {
    id:'r177',name:'Gratin Dauphinois Poulet',kcal:630,protein:38,carbs:55,fat:26,fiber:3,difficulty:'medium',budget:'low',prepTime:40,category:'dinner',tags:["prise-masse", "classique"],image:'🧀',
    ingredients:[{name:'Pommes de terre',quantity:'250g'},{name:'Blanc de poulet',quantity:'200g'},{name:'Crème',quantity:'150ml'},{name:'Fromage râpé',quantity:'40g'}],
    steps:["Couche patates et poulet avec crème.", "Fromage dessus, cuis 35 min à 180°C."],substitutions:["Dinde."],
  },
  {
    id:'r178',name:'Poulet Grillé Haricots Verts',kcal:320,protein:40,carbs:12,fat:12,fiber:5,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["sèche", "protéines"],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Haricots verts',quantity:'200g'},{name:'Citron',quantity:'1'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Grille poulet 5 min par face.", "Cuis haricots verts, arrose de citron."],substitutions:["Dinde."],
  },
  {
    id:'r179',name:'Saumon Papillote Légumes',kcal:340,protein:34,carbs:12,fat:18,fiber:4,difficulty:'easy',budget:'high',prepTime:25,category:'dinner',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Pavé de saumon',quantity:'180g'},{name:'Courgette',quantity:'1'},{name:'Tomates cerises',quantity:'100g'},{name:'Aneth',quantity:'Au goût'},{name:'Citron',quantity:'1'}],
    steps:["Emballe saumon et légumes en papillote.", "Cuis 20 min à 190°C."],substitutions:["Cabillaud."],
  },
  {
    id:'r180',name:'Soupe Miso Tofu',kcal:200,protein:18,carbs:16,fat:6,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'dinner',tags:["sèche", "vegan", "asiatique"],image:'🍲',
    ingredients:[{name:'Tofu soyeux',quantity:'150g'},{name:'Pâte miso',quantity:'2 c.à.s'},{name:'Algue wakame',quantity:'5g'},{name:'Champignons',quantity:'80g'}],
    steps:["Chauffe eau, dissolve le miso.", "Ajoute tofu coupé et champignons."],substitutions:["Crevettes."],
  },
  {
    id:'r181',name:'Courgettes Farcies Light',kcal:300,protein:30,carbs:14,fat:14,fiber:4,difficulty:'medium',budget:'low',prepTime:30,category:'dinner',tags:["sèche", "légumes"],image:'🥒',
    ingredients:[{name:'Courgettes',quantity:'2'},{name:'Viande hachée 5%',quantity:'150g'},{name:'Tomate',quantity:'1'},{name:'Oignon',quantity:'1'},{name:'Fromage râpé',quantity:'15g'}],
    steps:["Évide courgettes. Cuis viande avec légumes.", "Farce et gratine 20 min à 180°C."],substitutions:["Tomate farcie."],
  },
  {
    id:'r182',name:'Blanc de Dinde Ratatouille',kcal:310,protein:40,carbs:18,fat:8,fiber:5,difficulty:'easy',budget:'medium',prepTime:25,category:'dinner',tags:["sèche", "protéines"],image:'🦃',
    ingredients:[{name:'Escalope de dinde',quantity:'200g'},{name:'Aubergine',quantity:'1/2'},{name:'Courgette',quantity:'1'},{name:'Tomate',quantity:'2'},{name:'Poivron',quantity:'1'}],
    steps:["Grille dinde. Cuis légumes 15 min.", "Sers ensemble."],substitutions:["Poulet."],
  },
  {
    id:'r183',name:'Omelette Champignons Chèvre',kcal:290,protein:26,carbs:6,fat:18,fiber:2,difficulty:'easy',budget:'low',prepTime:10,category:'dinner',tags:["sèche", "low-carb"],image:'🥚',
    ingredients:[{name:'Oeufs',quantity:'3'},{name:'Champignons',quantity:'150g'},{name:'Fromage de chèvre',quantity:'30g'},{name:'Persil',quantity:'Au goût'}],
    steps:["Poêle champignons. Verse oeufs battus.", "Ajoute chèvre émietté, plie."],substitutions:["Feta."],
  },
  {
    id:'r184',name:'Poisson Blanc Fenouil',kcal:280,protein:35,carbs:10,fat:10,fiber:3,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:["sèche", "poisson"],image:'🐟',
    ingredients:[{name:'Filet de colin',quantity:'200g'},{name:'Fenouil',quantity:'1'},{name:'Citron',quantity:'1'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Cuis colin à la poêle 4 min par face.", "Fenouil braisé 10 min, citron."],substitutions:["Dorade."],
  },
  {
    id:'r185',name:'Velouté Potiron Léger',kcal:180,protein:8,carbs:28,fat:4,fiber:5,difficulty:'easy',budget:'low',prepTime:20,category:'dinner',tags:["sèche", "fibres", "végétarien"],image:'🎃',
    ingredients:[{name:'Potiron',quantity:'400g'},{name:'Oignon',quantity:'1'},{name:'Bouillon',quantity:'400ml'},{name:'Muscade',quantity:'1 pincée'},{name:'Crème légère',quantity:'30ml'}],
    steps:["Cuis potiron et oignon dans bouillon 15 min.", "Mixe, ajoute muscade et crème."],substitutions:["Butternut."],
  },
  {
    id:'r186',name:'Brochettes Poulet Légumes',kcal:330,protein:38,carbs:14,fat:12,fiber:3,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:["sèche", "protéines"],image:'🍢',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Poivron',quantity:'1'},{name:'Courgette',quantity:'1'},{name:'Oignon',quantity:'1'},{name:'Citron',quantity:'1'}],
    steps:["Coupe tout en morceaux, enfiche sur piques.", "Grille 10 min en tournant."],substitutions:["Crevettes."],
  },
  {
    id:'r187',name:'Cabillaud Purée Chou-Fleur',kcal:290,protein:36,carbs:12,fat:10,fiber:4,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:["sèche", "low-carb"],image:'🐟',
    ingredients:[{name:'Cabillaud',quantity:'200g'},{name:'Chou-fleur',quantity:'300g'},{name:'Muscade',quantity:'1 pincée'},{name:'Persil',quantity:'Au goût'}],
    steps:["Cuis cabillaud et chou-fleur séparément.", "Écrase chou-fleur en purée, sers ensemble."],substitutions:["Brocoli."],
  },
  {
    id:'r188',name:'Aubergines Grillées Tahini',kcal:260,protein:12,carbs:22,fat:14,fiber:6,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["sèche", "vegan"],image:'🍆',
    ingredients:[{name:'Aubergines',quantity:'2'},{name:'Tahini',quantity:'1 c.à.s'},{name:'Citron',quantity:'1'},{name:'Ail',quantity:'1 gousse'},{name:'Persil',quantity:'Au goût'}],
    steps:["Grille aubergines 5 min par face.", "Nappé de tahini, citron et ail."],substitutions:["Courgettes grillées."],
  },
  {
    id:'r189',name:'Blanc de Poulet Brocoli',kcal:300,protein:40,carbs:8,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["sèche", "protéines", "rapide"],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Brocoli',quantity:'200g'},{name:'Ail',quantity:'2 gousses'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Grille poulet 5 min par face.", "Brocoli vapeur 8 min, ail et huile."],substitutions:["Dinde."],
  },
  {
    id:'r190',name:'Truite Amandes Épinards',kcal:320,protein:34,carbs:6,fat:18,fiber:3,difficulty:'easy',budget:'high',prepTime:15,category:'dinner',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Filet de truite',quantity:'200g'},{name:'Amandes effilées',quantity:'15g'},{name:'Épinards',quantity:'150g'},{name:'Citron',quantity:'1'}],
    steps:["Cuis truite à la poêle 4 min par face.", "Fais tomber épinards, toaste amandes."],substitutions:["Saumon."],
  },
  {
    id:'r191',name:'Wok Tofu Légumes',kcal:250,protein:20,carbs:22,fat:10,fiber:5,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["sèche", "vegan"],image:'🥡',
    ingredients:[{name:'Tofu ferme',quantity:'200g'},{name:'Brocoli',quantity:'100g'},{name:'Poivron',quantity:'1'},{name:'Sauce soja',quantity:'1 c.à.s'},{name:'Gingembre',quantity:'1 c.à.c'}],
    steps:["Coupe et saisis tofu 4 min.", "Ajoute légumes et assaisonne."],substitutions:["Tempeh."],
  },
  {
    id:'r192',name:'Soupe Poulet Nouilles Light',kcal:280,protein:30,carbs:24,fat:6,fiber:3,difficulty:'easy',budget:'low',prepTime:20,category:'dinner',tags:["sèche", "réconfort"],image:'🍜',
    ingredients:[{name:'Blanc de poulet',quantity:'150g'},{name:'Nouilles de konjac',quantity:'100g'},{name:'Bouillon',quantity:'500ml'},{name:'Carottes',quantity:'2'},{name:'Gingembre',quantity:'1 c.à.c'}],
    steps:["Cuis poulet dans bouillon avec carottes.", "Ajoute nouilles et gingembre en fin."],substitutions:["Nouilles de riz."],
  },
  {
    id:'r193',name:'Curry Lentilles Coco',kcal:380,protein:20,carbs:45,fat:12,fiber:10,difficulty:'easy',budget:'low',prepTime:25,category:'dinner',tags:["sèche", "vegan", "fibres"],image:'🍛',
    ingredients:[{name:'Lentilles corail',quantity:'100g'},{name:'Lait de coco light',quantity:'150ml'},{name:'Curry',quantity:'1 c.à.s'},{name:'Oignon',quantity:'1'},{name:'Tomates',quantity:'200g'}],
    steps:["Reviens oignon. Ajoute lentilles, tomates, curry.", "Lait de coco, mijote 20 min."],substitutions:["Pois chiches."],
  },
  {
    id:'r194',name:'Crevettes Sautées Ail Persil',kcal:260,protein:30,carbs:4,fat:14,fiber:1,difficulty:'easy',budget:'high',prepTime:10,category:'dinner',tags:["sèche", "rapide"],image:'🦐',
    ingredients:[{name:'Crevettes',quantity:'250g'},{name:'Ail',quantity:'3 gousses'},{name:'Persil',quantity:'1 bouquet'},{name:'Huile d olive',quantity:'1 c.à.s'},{name:'Citron',quantity:'1'}],
    steps:["Saisis crevettes avec ail 4 min.", "Persil et citron."],substitutions:["Gambas."],
  },
  {
    id:'r195',name:'Shake Protéiné Banane',kcal:450,protein:35,carbs:52,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["prise-masse", "rapide"],image:'🥤',
    ingredients:[{name:'Banane',quantity:'1'},{name:'Lait',quantity:'250ml'},{name:'Whey chocolat',quantity:'35g'},{name:'Beurre de cacahuète',quantity:'15g'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Beurre d amande."],
  },
  {
    id:'r196',name:'Barres Granola Maison',kcal:380,protein:12,carbs:48,fat:16,fiber:4,difficulty:'medium',budget:'low',prepTime:25,category:'snack',tags:["prise-masse", "batch-cooking"],image:'🍫',
    ingredients:[{name:'Flocons d avoine',quantity:'150g'},{name:'Miel',quantity:'50g'},{name:'Beurre de cacahuète',quantity:'40g'},{name:'Pépites chocolat',quantity:'30g'}],
    steps:["Mélange tout, presse dans un moule.", "Cuis 15 min à 170°C, coupe en barres."],substitutions:["Fruits secs."],
  },
  {
    id:'r197',name:'Trail Mix Maison',kcal:420,protein:15,carbs:35,fat:26,fiber:5,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:["prise-masse", "énergie"],image:'🥜',
    ingredients:[{name:'Amandes',quantity:'30g'},{name:'Noix de cajou',quantity:'20g'},{name:'Raisins secs',quantity:'20g'},{name:'Pépites chocolat',quantity:'15g'}],
    steps:["Mélange tout dans un bol. Prêt !"],substitutions:["Noisettes."],
  },
  {
    id:'r198',name:'Smoothie Avocat Cacao',kcal:400,protein:22,carbs:35,fat:22,fiber:6,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:["prise-masse", "gourmand"],image:'🥑',
    ingredients:[{name:'Avocat',quantity:'1/2'},{name:'Cacao',quantity:'10g'},{name:'Banane',quantity:'1'},{name:'Lait',quantity:'200ml'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Whey chocolat."],
  },
  {
    id:'r199',name:'Muffin Protéiné Myrtille',kcal:320,protein:20,carbs:36,fat:10,fiber:3,difficulty:'medium',budget:'low',prepTime:25,category:'snack',tags:["prise-masse", "gourmand"],image:'🧁',
    ingredients:[{name:'Flocons d avoine',quantity:'80g'},{name:'Whey vanille',quantity:'25g'},{name:'Oeuf',quantity:'1'},{name:'Myrtilles',quantity:'60g'},{name:'Yaourt',quantity:'80g'}],
    steps:["Mélange tout. Verse dans moules.", "Cuis 18 min à 180°C."],substitutions:["Framboises."],
  },
  {
    id:'r200',name:'Rice Cake Protéiné',kcal:280,protein:18,carbs:30,fat:10,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["prise-masse", "rapide"],image:'🍘',
    ingredients:[{name:'Galettes de riz',quantity:'3'},{name:'Beurre de cacahuète',quantity:'20g'},{name:'Banane',quantity:'1/2'},{name:'Miel',quantity:'1 filet'}],
    steps:["Tartine galettes de beurre de cacahuète.", "Ajoute banane et miel."],substitutions:["Beurre d amande."],
  },
  {
    id:'r201',name:'Dattes Farcies Amandes',kcal:340,protein:8,carbs:55,fat:12,fiber:5,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:["prise-masse", "énergie"],image:'🌴',
    ingredients:[{name:'Dattes Medjool',quantity:'6'},{name:'Amandes entières',quantity:'6'},{name:'Chocolat noir',quantity:'10g'}],
    steps:["Ouvre les dattes, place une amande dedans.", "Filet de chocolat fondu dessus."],substitutions:["Noix de cajou."],
  },
  {
    id:'r202',name:'Banana Bread Protéiné',kcal:380,protein:22,carbs:48,fat:12,fiber:3,difficulty:'medium',budget:'low',prepTime:30,category:'snack',tags:["prise-masse", "batch-cooking"],image:'🍌',
    ingredients:[{name:'Bananes mûres',quantity:'3'},{name:'Flocons d avoine',quantity:'100g'},{name:'Oeufs',quantity:'2'},{name:'Whey',quantity:'25g'},{name:'Noix',quantity:'30g'}],
    steps:["Écrase bananes, mélange avec le reste.", "Cuis 25 min à 180°C dans un moule."],substitutions:["Sans noix."],
  },
  {
    id:'r203',name:'Pancake Roll Protéiné',kcal:360,protein:25,carbs:38,fat:12,fiber:2,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:["prise-masse", "protéines"],image:'🥞',
    ingredients:[{name:'Flocons d avoine',quantity:'50g'},{name:'Oeuf',quantity:'1'},{name:'Lait',quantity:'50ml'},{name:'Beurre de cacahuète',quantity:'15g'},{name:'Banane',quantity:'1/2'}],
    steps:["Mixe avoine, oeuf, lait. Cuis une grande crêpe.", "Tartine de cacahuète et banane, roule."],substitutions:["Whey."],
  },
  {
    id:'r204',name:'Energy Balls Coco Chocolat',kcal:350,protein:12,carbs:38,fat:18,fiber:4,difficulty:'easy',budget:'medium',prepTime:10,category:'snack',tags:["prise-masse", "batch-cooking"],image:'🟤',
    ingredients:[{name:'Dattes',quantity:'100g'},{name:'Flocons d avoine',quantity:'50g'},{name:'Cacao',quantity:'15g'},{name:'Noix de coco',quantity:'20g'},{name:'Beurre d amande',quantity:'15g'}],
    steps:["Mixe dattes et avoine. Ajoute cacao et beurre.", "Forme des boules, roule dans la coco."],substitutions:["Beurre de cacahuète."],
  },
  {
    id:'r205',name:'Fromage Blanc Miel Noix',kcal:280,protein:24,carbs:22,fat:10,fiber:1,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["prise-masse", "rapide"],image:'🍯',
    ingredients:[{name:'Fromage blanc',quantity:'200g'},{name:'Miel',quantity:'1 c.à.s'},{name:'Noix',quantity:'15g'}],
    steps:["Verse fromage blanc. Ajoute miel et noix."],substitutions:["Amandes."],
  },
  {
    id:'r206',name:'Banane Chocolat Noir',kcal:200,protein:3,carbs:30,fat:8,fiber:3,difficulty:'easy',budget:'medium',prepTime:3,category:'snack',tags:["équilibré", "gourmand"],image:'🍫',
    ingredients:[{name:'Banane',quantity:'1'},{name:'Chocolat noir 70%',quantity:'15g'}],
    steps:["Coupe banane en rondelles. Fais fondre chocolat.", "Trempe les rondelles."],substitutions:["Fraises."],
  },
  {
    id:'r207',name:'Yaourt Grec 0% Cannelle',kcal:120,protein:20,carbs:8,fat:1,fiber:0,difficulty:'easy',budget:'low',prepTime:2,category:'snack',tags:["sèche", "protéines", "rapide"],image:'🥄',
    ingredients:[{name:'Yaourt grec 0%',quantity:'200g'},{name:'Cannelle',quantity:'1 c.à.c'},{name:'Stévia',quantity:'1 pincée'}],
    steps:["Verse yaourt, saupoudre cannelle."],substitutions:["Fromage blanc 0%."],
  },
  {
    id:'r208',name:'Bâtonnets Légumes Houmous',kcal:180,protein:8,carbs:18,fat:8,fiber:5,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:["sèche", "fibres"],image:'🥕',
    ingredients:[{name:'Carottes',quantity:'2'},{name:'Concombre',quantity:'1/2'},{name:'Céleri',quantity:'2 branches'},{name:'Houmous',quantity:'50g'}],
    steps:["Coupe les légumes en bâtonnets.", "Trempe dans le houmous."],substitutions:["Guacamole léger."],
  },
  {
    id:'r209',name:'Pomme Beurre Amande',kcal:180,protein:5,carbs:22,fat:8,fiber:4,difficulty:'easy',budget:'medium',prepTime:2,category:'snack',tags:["sèche", "rapide"],image:'🍎',
    ingredients:[{name:'Pomme',quantity:'1'},{name:'Beurre d amande',quantity:'10g'}],
    steps:["Coupe la pomme, trempe dans le beurre d amande."],substitutions:["Beurre de cacahuète."],
  },
  {
    id:'r210',name:'Cottage Cheese Concombre',kcal:130,protein:16,carbs:6,fat:4,fiber:1,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["sèche", "protéines", "rapide"],image:'🥒',
    ingredients:[{name:'Cottage cheese',quantity:'150g'},{name:'Concombre',quantity:'1/2'},{name:'Aneth',quantity:'Au goût'}],
    steps:["Coupe concombre en rondelles.", "Verse cottage cheese dessus."],substitutions:["Tomates cerises."],
  },
  {
    id:'r211',name:'Smoothie Fraise Protéiné',kcal:150,protein:22,carbs:14,fat:2,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["sèche", "rapide"],image:'🍓',
    ingredients:[{name:'Fraises',quantity:'100g'},{name:'Whey vanille',quantity:'25g'},{name:'Eau',quantity:'200ml'},{name:'Glaçons',quantity:'5'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Framboises."],
  },
  {
    id:'r212',name:'Oeufs Durs',kcal:140,protein:12,carbs:1,fat:10,fiber:0,difficulty:'easy',budget:'low',prepTime:12,category:'snack',tags:["sèche", "protéines", "meal-prep"],image:'🥚',
    ingredients:[{name:'Oeufs',quantity:'2'},{name:'Sel, poivre',quantity:'Au goût'}],
    steps:["Cuis 10 min dans l eau bouillante. Refroidis."],substitutions:["Avec moutarde."],
  },
  {
    id:'r213',name:'Edamame Sel de Mer',kcal:120,protein:12,carbs:8,fat:5,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:["sèche", "protéines", "vegan"],image:'🫛',
    ingredients:[{name:'Edamame congelés',quantity:'150g'},{name:'Sel de mer',quantity:'1 pincée'}],
    steps:["Cuis à la vapeur 5 min. Sale."],substitutions:["Fleur de sel."],
  },
  {
    id:'r214',name:'Galette Riz Dinde',kcal:160,protein:18,carbs:14,fat:3,fiber:1,difficulty:'easy',budget:'medium',prepTime:3,category:'snack',tags:["sèche", "protéines", "rapide"],image:'🍘',
    ingredients:[{name:'Galettes de riz',quantity:'2'},{name:'Blanc de dinde',quantity:'40g'},{name:'Cornichon',quantity:'2'}],
    steps:["Dispose dinde sur galettes. Cornichon à côté."],substitutions:["Poulet."],
  },
  {
    id:'r215',name:'Tomates Cerises Mozzarella',kcal:170,protein:10,carbs:6,fat:12,fiber:1,difficulty:'easy',budget:'medium',prepTime:3,category:'snack',tags:["sèche", "rapide"],image:'🍅',
    ingredients:[{name:'Tomates cerises',quantity:'150g'},{name:'Mozzarella light',quantity:'50g'},{name:'Basilic',quantity:'3 feuilles'}],
    steps:["Alterne tomates et mozzarella. Basilic dessus."],substitutions:["Burrata."],
  },
  {
    id:'r216',name:'Shake Protéiné Light',kcal:130,protein:25,carbs:6,fat:1,fiber:0,difficulty:'easy',budget:'low',prepTime:2,category:'snack',tags:["sèche", "protéines", "rapide"],image:'🥤',
    ingredients:[{name:'Whey vanille',quantity:'30g'},{name:'Eau',quantity:'250ml'},{name:'Glaçons',quantity:'5'}],
    steps:["Mixe whey et eau froide 15 secondes."],substitutions:["Lait d amande."],
  },
  {
    id:'r217',name:'Poivron Farci Fromage Frais',kcal:140,protein:8,carbs:8,fat:8,fiber:2,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:["sèche", "légumes"],image:'🫑',
    ingredients:[{name:'Poivron',quantity:'1'},{name:'Fromage frais 0%',quantity:'60g'},{name:'Ciboulette',quantity:'Au goût'}],
    steps:["Coupe poivron en quartiers.", "Garnis de fromage frais et ciboulette."],substitutions:["Concombre."],
  },
  {
    id:'r218',name:'Houmous Maison',kcal:200,protein:8,carbs:18,fat:10,fiber:5,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:["sèche", "vegan", "fibres"],image:'🫘',
    ingredients:[{name:'Pois chiches',quantity:'150g'},{name:'Tahini',quantity:'15g'},{name:'Citron',quantity:'1'},{name:'Ail',quantity:'1 gousse'}],
    steps:["Mixe tout avec 2 c.à.s d eau."],substitutions:["Lentilles."],
  },
  {
    id:'r219',name:'Galettes Riz Avocat',kcal:180,protein:3,carbs:20,fat:10,fiber:3,difficulty:'easy',budget:'medium',prepTime:3,category:'snack',tags:["sèche", "rapide"],image:'🍘',
    ingredients:[{name:'Galettes de riz',quantity:'2'},{name:'Avocat',quantity:'1/4'},{name:'Citron',quantity:'1 filet'},{name:'Sel',quantity:'1 pincée'}],
    steps:["Écrase avocat sur galettes. Citron et sel."],substitutions:["Houmous."],
  },
  {
    id:'r220',name:'Tartines Miel Banane Énergie',kcal:420,protein:10,carbs:72,fat:10,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:["prise-masse", "énergie"],image:'🍯',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Miel',quantity:'1 c.à.s'},{name:'Banane',quantity:'1'},{name:'Beurre de cacahuète',quantity:'10g'}],
    steps:["Toaste pain, tartine miel et cacahuète.", "Ajoute banane en rondelles."],substitutions:["Confiture."],
  },
  {
    id:'r221',name:'Smoothie Énergie Banane Avoine',kcal:450,protein:18,carbs:68,fat:12,fiber:5,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:["prise-masse", "rapide"],image:'🥤',
    ingredients:[{name:'Banane',quantity:'2'},{name:'Flocons d avoine',quantity:'40g'},{name:'Lait',quantity:'250ml'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Lait d amande."],
  },
  {
    id:'r222',name:'Bowl Avoine Fruits Secs',kcal:480,protein:15,carbs:70,fat:16,fiber:6,difficulty:'easy',budget:'low',prepTime:8,category:'pre_workout',tags:["prise-masse", "énergie"],image:'🥣',
    ingredients:[{name:'Flocons d avoine',quantity:'80g'},{name:'Lait',quantity:'200ml'},{name:'Dattes',quantity:'3'},{name:'Amandes',quantity:'15g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Cuis avoine dans lait 5 min.", "Ajoute dattes coupées et amandes."],substitutions:["Noix de cajou."],
  },
  {
    id:'r223',name:'Rice Cake Confiture Banane',kcal:350,protein:6,carbs:65,fat:6,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'pre_workout',tags:["prise-masse", "rapide"],image:'🍘',
    ingredients:[{name:'Galettes de riz',quantity:'4'},{name:'Confiture',quantity:'2 c.à.s'},{name:'Banane',quantity:'1'}],
    steps:["Tartine galettes de confiture et banane."],substitutions:["Miel."],
  },
  {
    id:'r224',name:'Wrap Banane Beurre Cacahuète',kcal:420,protein:12,carbs:52,fat:18,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'pre_workout',tags:["prise-masse", "rapide"],image:'🌯',
    ingredients:[{name:'Tortilla',quantity:'1'},{name:'Banane',quantity:'1'},{name:'Beurre de cacahuète',quantity:'20g'},{name:'Miel',quantity:'1 filet'}],
    steps:["Tartine tortilla de cacahuète. Ajoute banane. Roule."],substitutions:["Beurre d amande."],
  },
  {
    id:'r225',name:'Banane Seule',kcal:105,protein:1,carbs:27,fat:0,fiber:3,difficulty:'easy',budget:'low',prepTime:1,category:'pre_workout',tags:["sèche", "rapide", "énergie"],image:'🍌',
    ingredients:[{name:'Banane',quantity:'1'}],
    steps:["Mange la banane 30 min avant l entraînement."],substitutions:["Pomme."],
  },
  {
    id:'r226',name:'Galettes Riz Confiture',kcal:160,protein:3,carbs:34,fat:1,fiber:1,difficulty:'easy',budget:'low',prepTime:2,category:'pre_workout',tags:["sèche", "rapide"],image:'🍘',
    ingredients:[{name:'Galettes de riz',quantity:'3'},{name:'Confiture allégée',quantity:'1 c.à.s'}],
    steps:["Tartine galettes de confiture."],substitutions:["Miel léger."],
  },
  {
    id:'r227',name:'Dattes Énergie',kcal:140,protein:1,carbs:36,fat:0,fiber:3,difficulty:'easy',budget:'low',prepTime:1,category:'pre_workout',tags:["sèche", "rapide", "énergie"],image:'🌴',
    ingredients:[{name:'Dattes',quantity:'4'}],
    steps:["Mange 30 min avant l entraînement."],substitutions:["Figues sèches."],
  },
  {
    id:'r228',name:'Café Protéiné',kcal:100,protein:18,carbs:4,fat:1,fiber:0,difficulty:'easy',budget:'low',prepTime:3,category:'pre_workout',tags:["sèche", "rapide", "protéines"],image:'☕',
    ingredients:[{name:'Café',quantity:'200ml'},{name:'Whey vanille',quantity:'20g'}],
    steps:["Prépare le café. Mixe avec la whey."],substitutions:["Cacao."],
  },
  {
    id:'r229',name:'Tartine Miel Light',kcal:150,protein:3,carbs:32,fat:1,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'pre_workout',tags:["sèche", "énergie"],image:'🍯',
    ingredients:[{name:'Pain complet',quantity:'1 tranche'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Toaste le pain, arrose de miel."],substitutions:["Confiture allégée."],
  },
  {
    id:'r230',name:'Yaourt Miel Pré-Training',kcal:130,protein:12,carbs:16,fat:2,fiber:0,difficulty:'easy',budget:'low',prepTime:2,category:'pre_workout',tags:["sèche", "rapide"],image:'🥄',
    ingredients:[{name:'Yaourt grec 0%',quantity:'150g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Mélange yaourt et miel. Mange 30 min avant."],substitutions:["Compote."],
  },
  {
    id:'r231',name:'Barre Énergie Maison',kcal:360,protein:10,carbs:52,fat:14,fiber:4,difficulty:'medium',budget:'low',prepTime:15,category:'pre_workout',tags:["prise-masse", "batch-cooking"],image:'🍫',
    ingredients:[{name:'Dattes',quantity:'80g'},{name:'Flocons d avoine',quantity:'60g'},{name:'Beurre de cacahuète',quantity:'25g'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:["Mixe dattes et avoine. Ajoute cacahuète et miel.", "Presse dans un moule, réfrigère 1h."],substitutions:["Beurre d amande."],
  },
  {
    id:'r232',name:'Smoothie Mangue Banane',kcal:400,protein:10,carbs:72,fat:6,fiber:4,difficulty:'easy',budget:'medium',prepTime:5,category:'pre_workout',tags:["prise-masse", "rapide"],image:'🥭',
    ingredients:[{name:'Mangue',quantity:'150g'},{name:'Banane',quantity:'1'},{name:'Jus d orange',quantity:'200ml'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Ananas."],
  },
  {
    id:'r233',name:'Banane Beurre Cacahuète',kcal:250,protein:7,carbs:30,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:2,category:'pre_workout',tags:["prise-masse", "rapide"],image:'🍌',
    ingredients:[{name:'Banane',quantity:'1'},{name:'Beurre de cacahuète',quantity:'15g'}],
    steps:["Coupe banane, tartine de beurre de cacahuète."],substitutions:["Beurre d amande."],
  },
  {
    id:'r234',name:'Smoothie Mangue Énergie',kcal:250,protein:5,carbs:55,fat:2,fiber:3,difficulty:'easy',budget:'medium',prepTime:5,category:'pre_workout',tags:["équilibré", "énergie"],image:'🥭',
    ingredients:[{name:'Mangue',quantity:'200g'},{name:'Jus d orange',quantity:'200ml'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Mixe tout. Bois 30 min avant le training."],substitutions:["Ananas."],
  },
  {
    id:'r235',name:'Shake Récup Chocolat Banane',kcal:520,protein:40,carbs:55,fat:14,fiber:4,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:["prise-masse", "protéines", "rapide"],image:'🥤',
    ingredients:[{name:'Whey chocolat',quantity:'40g'},{name:'Banane',quantity:'1'},{name:'Lait',quantity:'300ml'},{name:'Beurre de cacahuète',quantity:'15g'}],
    steps:["Mixe tout 30 secondes. Bois dans les 30 min."],substitutions:["Beurre d amande."],
  },
  {
    id:'r236',name:'Bowl Poulet Patate Douce',kcal:580,protein:42,carbs:55,fat:18,fiber:5,difficulty:'easy',budget:'medium',prepTime:20,category:'post_workout',tags:["prise-masse", "protéines"],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Patate douce',quantity:'200g'},{name:'Brocoli',quantity:'100g'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Cuis poulet et patate douce.", "Ajoute brocoli vapeur."],substitutions:["Dinde."],
  },
  {
    id:'r237',name:'Pâtes Thon Post-Training',kcal:560,protein:38,carbs:62,fat:14,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'post_workout',tags:["prise-masse", "rapide"],image:'🍝',
    ingredients:[{name:'Pâtes complètes',quantity:'120g'},{name:'Thon en boîte',quantity:'200g'},{name:'Sauce tomate',quantity:'100ml'},{name:'Parmesan',quantity:'15g'}],
    steps:["Cuis pâtes. Mélange avec thon et sauce.", "Parmesan dessus."],substitutions:["Saumon en boîte."],
  },
  {
    id:'r238',name:'Riz Boeuf Brocoli',kcal:600,protein:42,carbs:60,fat:18,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'post_workout',tags:["prise-masse", "protéines"],image:'🥩',
    ingredients:[{name:'Riz',quantity:'100g'},{name:'Boeuf émincé',quantity:'200g'},{name:'Brocoli',quantity:'150g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis riz. Saisis boeuf 4 min avec brocoli.", "Assaisonne de sauce soja."],substitutions:["Poulet."],
  },
  {
    id:'r239',name:'Wrap Protéiné Poulet Riz',kcal:540,protein:38,carbs:52,fat:16,fiber:3,difficulty:'easy',budget:'medium',prepTime:10,category:'post_workout',tags:["prise-masse", "rapide"],image:'🌯',
    ingredients:[{name:'Tortilla',quantity:'1'},{name:'Poulet grillé',quantity:'150g'},{name:'Riz',quantity:'50g'},{name:'Salade',quantity:'30g'},{name:'Sauce yaourt',quantity:'1 c.à.s'}],
    steps:["Garnis tortilla de poulet, riz et salade. Roule."],substitutions:["Dinde."],
  },
  {
    id:'r240',name:'Bowl Saumon Riz Avocat',kcal:580,protein:36,carbs:52,fat:24,fiber:5,difficulty:'easy',budget:'high',prepTime:15,category:'post_workout',tags:["prise-masse", "oméga-3"],image:'🐟',
    ingredients:[{name:'Saumon grillé',quantity:'180g'},{name:'Riz',quantity:'80g'},{name:'Avocat',quantity:'1/2'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis saumon et riz.", "Assemble avec avocat et sauce."],substitutions:["Thon."],
  },
  {
    id:'r241',name:'Omelette Patate Douce',kcal:480,protein:32,carbs:38,fat:20,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'post_workout',tags:["prise-masse", "protéines"],image:'🥚',
    ingredients:[{name:'Oeufs',quantity:'4'},{name:'Patate douce',quantity:'150g'},{name:'Fromage râpé',quantity:'20g'},{name:'Épinards',quantity:'50g'}],
    steps:["Cuis patate douce en dés. Bats les oeufs.", "Ajoute tout à la poêle 5 min."],substitutions:["Pomme de terre."],
  },
  {
    id:'r242',name:'Smoothie Bowl Récup',kcal:500,protein:35,carbs:58,fat:12,fiber:5,difficulty:'easy',budget:'medium',prepTime:8,category:'post_workout',tags:["prise-masse", "récupération"],image:'🫐',
    ingredients:[{name:'Banane congelée',quantity:'1'},{name:'Myrtilles',quantity:'100g'},{name:'Whey vanille',quantity:'30g'},{name:'Lait d amande',quantity:'100ml'},{name:'Granola',quantity:'30g'}],
    steps:["Mixe banane, myrtilles, whey et lait.", "Garnis de granola."],substitutions:["Fraises."],
  },
  {
    id:'r243',name:'Bol Quinoa Poulet Légumes',kcal:520,protein:40,carbs:48,fat:16,fiber:6,difficulty:'easy',budget:'medium',prepTime:20,category:'post_workout',tags:["prise-masse", "fibres"],image:'🥗',
    ingredients:[{name:'Quinoa',quantity:'80g'},{name:'Blanc de poulet',quantity:'180g'},{name:'Poivron',quantity:'1'},{name:'Courgette',quantity:'1'},{name:'Citron',quantity:'1'}],
    steps:["Cuis quinoa et poulet.", "Poêle les légumes, assemble."],substitutions:["Dinde."],
  },
  {
    id:'r244',name:'Bol Riz Dinde Légumes',kcal:520,protein:42,carbs:52,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:15,category:'post_workout',tags:["prise-masse", "protéines"],image:'🦃',
    ingredients:[{name:'Riz',quantity:'80g'},{name:'Blanc de dinde',quantity:'200g'},{name:'Brocoli',quantity:'100g'},{name:'Carottes',quantity:'1'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis tout séparément. Assemble dans un bol."],substitutions:["Poulet."],
  },
  {
    id:'r245',name:'Couscous Poulet Post-Training',kcal:560,protein:38,carbs:65,fat:14,fiber:5,difficulty:'easy',budget:'low',prepTime:15,category:'post_workout',tags:["prise-masse", "énergie"],image:'🫕',
    ingredients:[{name:'Semoule',quantity:'100g'},{name:'Blanc de poulet',quantity:'180g'},{name:'Pois chiches',quantity:'60g'},{name:'Courgette',quantity:'1'}],
    steps:["Cuis semoule et poulet.", "Assemble avec pois chiches et courgette."],substitutions:["Lentilles."],
  },
  {
    id:'r246',name:'Bol Cottage Fruits Granola',kcal:450,protein:35,carbs:48,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:["prise-masse", "rapide"],image:'🧀',
    ingredients:[{name:'Cottage cheese',quantity:'250g'},{name:'Fruits de saison',quantity:'100g'},{name:'Granola',quantity:'30g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Verse cottage cheese. Ajoute fruits et granola."],substitutions:["Fromage blanc."],
  },
  {
    id:'r247',name:'Crêpe Protéinée Post Récup',kcal:440,protein:30,carbs:48,fat:14,fiber:3,difficulty:'easy',budget:'low',prepTime:10,category:'post_workout',tags:["prise-masse", "gourmand"],image:'🥞',
    ingredients:[{name:'Flocons d avoine',quantity:'60g'},{name:'Oeufs',quantity:'2'},{name:'Whey',quantity:'20g'},{name:'Banane',quantity:'1'},{name:'Beurre de cacahuète',quantity:'10g'}],
    steps:["Mixe et cuis en crêpes 2 min par face.", "Garnis de cacahuète."],substitutions:["Miel."],
  },
  {
    id:'r248',name:'Galette Avoine Protéinée',kcal:400,protein:25,carbs:42,fat:14,fiber:4,difficulty:'easy',budget:'low',prepTime:10,category:'post_workout',tags:["prise-masse", "rapide"],image:'🥞',
    ingredients:[{name:'Flocons d avoine',quantity:'70g'},{name:'Oeufs',quantity:'2'},{name:'Fromage blanc',quantity:'80g'},{name:'Myrtilles',quantity:'50g'}],
    steps:["Mixe avoine, oeufs et fromage blanc.", "Cuis en galettes, garnis de myrtilles."],substitutions:["Framboises."],
  },
  {
    id:'r249',name:'Tartine Saumon Avocat',kcal:480,protein:28,carbs:35,fat:24,fiber:5,difficulty:'easy',budget:'high',prepTime:5,category:'post_workout',tags:["prise-masse", "oméga-3"],image:'🥯',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Saumon fumé',quantity:'80g'},{name:'Avocat',quantity:'1/2'},{name:'Citron',quantity:'1 filet'}],
    steps:["Toaste pain. Ajoute saumon et avocat."],substitutions:["Truite fumée."],
  },
  {
    id:'r250',name:'Shake Whey Simple',kcal:130,protein:30,carbs:4,fat:1,fiber:0,difficulty:'easy',budget:'low',prepTime:2,category:'post_workout',tags:["sèche", "protéines", "rapide"],image:'🥤',
    ingredients:[{name:'Whey vanille',quantity:'35g'},{name:'Eau',quantity:'300ml'}],
    steps:["Mixe whey et eau. Bois dans les 30 min."],substitutions:["Lait écrémé."],
  },
  {
    id:'r251',name:'Blanc de Poulet Salade',kcal:280,protein:38,carbs:8,fat:10,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'post_workout',tags:["sèche", "protéines"],image:'🍗',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Salade mixte',quantity:'100g'},{name:'Tomate',quantity:'1'},{name:'Citron',quantity:'1'}],
    steps:["Grille poulet 5 min par face.", "Assemble avec salade et citron."],substitutions:["Dinde."],
  },
  {
    id:'r252',name:'Thon Concombre Rapide',kcal:200,protein:35,carbs:4,fat:5,fiber:1,difficulty:'easy',budget:'low',prepTime:5,category:'post_workout',tags:["sèche", "rapide"],image:'🐟',
    ingredients:[{name:'Thon au naturel',quantity:'200g'},{name:'Concombre',quantity:'1'},{name:'Citron',quantity:'1/2'}],
    steps:["Émiette thon. Coupe concombre. Citron."],substitutions:["Saumon en boîte."],
  },
  {
    id:'r253',name:'Oeufs Brouillés Épinards',kcal:220,protein:22,carbs:4,fat:12,fiber:2,difficulty:'easy',budget:'low',prepTime:8,category:'post_workout',tags:["sèche", "protéines"],image:'🥚',
    ingredients:[{name:'Oeufs',quantity:'3'},{name:'Épinards',quantity:'100g'},{name:'Sel, poivre',quantity:'Au goût'}],
    steps:["Fais tomber épinards. Ajoute oeufs brouillés."],substitutions:["Champignons."],
  },
  {
    id:'r254',name:'Yaourt Grec Whey',kcal:180,protein:35,carbs:10,fat:2,fiber:0,difficulty:'easy',budget:'low',prepTime:2,category:'post_workout',tags:["sèche", "protéines", "rapide"],image:'🥄',
    ingredients:[{name:'Yaourt grec 0%',quantity:'200g'},{name:'Whey vanille',quantity:'20g'},{name:'Fruits rouges',quantity:'50g'}],
    steps:["Mélange yaourt et whey. Garnis de fruits."],substitutions:["Fromage blanc 0%."],
  },
  {
    id:'r255',name:'Cottage Cheese Tomate',kcal:160,protein:20,carbs:8,fat:5,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:["sèche", "rapide"],image:'🍅',
    ingredients:[{name:'Cottage cheese',quantity:'200g'},{name:'Tomates cerises',quantity:'100g'},{name:'Basilic',quantity:'Au goût'}],
    steps:["Verse cottage cheese. Ajoute tomates et basilic."],substitutions:["Concombre."],
  },
  {
    id:'r256',name:'Crevettes Citron Express',kcal:180,protein:32,carbs:2,fat:4,fiber:0,difficulty:'easy',budget:'high',prepTime:8,category:'post_workout',tags:["sèche", "protéines", "rapide"],image:'🦐',
    ingredients:[{name:'Crevettes décortiquées',quantity:'250g'},{name:'Citron',quantity:'1'},{name:'Ail',quantity:'1 gousse'},{name:'Persil',quantity:'Au goût'}],
    steps:["Saisis crevettes 3 min avec ail.", "Arrose de citron et persil."],substitutions:["Saumon."],
  },
  {
    id:'r257',name:'Salade Dinde Crudités',kcal:250,protein:32,carbs:10,fat:8,fiber:3,difficulty:'easy',budget:'low',prepTime:5,category:'post_workout',tags:["sèche", "protéines"],image:'🥗',
    ingredients:[{name:'Blanc de dinde',quantity:'150g'},{name:'Salade',quantity:'80g'},{name:'Concombre',quantity:'1/2'},{name:'Tomate',quantity:'1'}],
    steps:["Coupe dinde et légumes. Assemble."],substitutions:["Poulet."],
  },
  {
    id:'r258',name:'Saumon Vapeur Brocoli',kcal:300,protein:34,carbs:6,fat:16,fiber:3,difficulty:'easy',budget:'high',prepTime:15,category:'post_workout',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Pavé de saumon',quantity:'180g'},{name:'Brocoli',quantity:'200g'},{name:'Citron',quantity:'1'}],
    steps:["Cuis saumon et brocoli à la vapeur 12 min.", "Arrose de citron."],substitutions:["Cabillaud."],
  },
  {
    id:'r259',name:'Blancs d Oeufs Champignons',kcal:150,protein:24,carbs:4,fat:4,fiber:2,difficulty:'easy',budget:'low',prepTime:8,category:'post_workout',tags:["sèche", "low-carb"],image:'🥚',
    ingredients:[{name:'Blancs d oeufs',quantity:'6'},{name:'Champignons',quantity:'150g'},{name:'Persil',quantity:'Au goût'}],
    steps:["Poêle champignons. Verse les blancs.", "Cuis 4 min à feu doux."],substitutions:["Épinards."],
  },
  {
    id:'r260',name:'Smoothie Récup Léger',kcal:160,protein:25,carbs:14,fat:2,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:["sèche", "rapide"],image:'🥤',
    ingredients:[{name:'Whey vanille',quantity:'30g'},{name:'Fraises',quantity:'100g'},{name:'Eau',quantity:'250ml'},{name:'Glaçons',quantity:'5'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Framboises."],
  },
  {
    id:'r261',name:'Dinde Grillée Simple',kcal:220,protein:40,carbs:2,fat:6,fiber:0,difficulty:'easy',budget:'low',prepTime:10,category:'post_workout',tags:["sèche", "protéines"],image:'🦃',
    ingredients:[{name:'Escalope de dinde',quantity:'200g'},{name:'Citron',quantity:'1'},{name:'Herbes de Provence',quantity:'1 c.à.c'}],
    steps:["Marine dans citron et herbes. Grille 5 min par face."],substitutions:["Poulet."],
  },
  {
    id:'r262',name:'Bol Protéines Légumes Vapeur',kcal:240,protein:36,carbs:12,fat:6,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'post_workout',tags:["sèche", "protéines"],image:'🥗',
    ingredients:[{name:'Blanc de poulet',quantity:'180g'},{name:'Brocoli',quantity:'100g'},{name:'Carottes',quantity:'100g'},{name:'Haricots verts',quantity:'100g'}],
    steps:["Cuis poulet grillé et légumes vapeur.", "Assemble dans un bol. Citron."],substitutions:["Cabillaud."],
  },
  {
    id:'r263',name:'Shake Vanille Fraise Récup',kcal:190,protein:30,carbs:14,fat:2,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'post_workout',tags:["sèche", "rapide"],image:'🍓',
    ingredients:[{name:'Whey vanille',quantity:'30g'},{name:'Fraises',quantity:'100g'},{name:'Lait écrémé',quantity:'250ml'}],
    steps:["Mixe tout 20 secondes. Bois frais."],substitutions:["Framboises."],
  },

  // ══════════════════════════════════════════
  //   📦 37 RECETTES BONUS
  // ══════════════════════════════════════════
  {
    id:'r264',name:'Smoothie Framboise Avoine',kcal:380,protein:16,carbs:52,fat:12,fiber:6,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["équilibré", "rapide"],image:'🫐',
    ingredients:[{name:'Framboises',quantity:'120g'},{name:'Flocons d avoine',quantity:'40g'},{name:'Lait',quantity:'200ml'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Mixe tout 30 secondes."],substitutions:["Myrtilles."],
  },
  {
    id:'r265',name:'Toast Complet Thon',kcal:340,protein:28,carbs:30,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:8,category:'breakfast',tags:["prise-masse", "protéines"],image:'🥪',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Thon au naturel',quantity:'100g'},{name:'Tomate',quantity:'1'},{name:'Citron',quantity:'1/2'}],
    steps:["Toaste pain. Émiette thon avec citron. Ajoute tomate."],substitutions:["Saumon fumé."],
  },
  {
    id:'r266',name:'Granola Maison Light',kcal:300,protein:10,carbs:48,fat:8,fiber:5,difficulty:'medium',budget:'low',prepTime:25,category:'breakfast',tags:["sèche", "fibres"],image:'🥣',
    ingredients:[{name:'Flocons d avoine',quantity:'100g'},{name:'Miel',quantity:'15g'},{name:'Amandes',quantity:'15g'},{name:'Graines courge',quantity:'10g'}],
    steps:["Mélange tout. Cuis 15 min à 160°C en remuant."],substitutions:["Noix de coco."],
  },
  {
    id:'r267',name:'Bowl Fromage Blanc Kiwi',kcal:360,protein:30,carbs:38,fat:8,fiber:4,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:["sèche", "protéines"],image:'🥝',
    ingredients:[{name:'Fromage blanc 0%',quantity:'250g'},{name:'Kiwi',quantity:'2'},{name:'Granola',quantity:'20g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Verse fromage blanc. Coupe kiwis dessus.", "Ajoute granola et miel."],substitutions:["Yaourt grec 0%."],
  },
  {
    id:'r268',name:'Tartine Oeuf Avocat',kcal:380,protein:18,carbs:28,fat:22,fiber:5,difficulty:'easy',budget:'medium',prepTime:8,category:'breakfast',tags:["équilibré", "protéines"],image:'🥑',
    ingredients:[{name:'Pain complet',quantity:'1 tranche'},{name:'Oeuf poché',quantity:'1'},{name:'Avocat',quantity:'1/2'},{name:'Sel, poivre',quantity:'Au goût'}],
    steps:["Toaste pain. Écrase avocat dessus.", "Dépose oeuf poché, assaisonne."],substitutions:["Oeuf mollet."],
  },
  {
    id:'r269',name:'Bol Falafel Légumes',kcal:480,protein:20,carbs:52,fat:20,fiber:10,difficulty:'medium',budget:'low',prepTime:25,category:'lunch',tags:["prise-masse", "végétarien"],image:'🧆',
    ingredients:[{name:'Pois chiches',quantity:'150g'},{name:'Quinoa',quantity:'60g'},{name:'Concombre',quantity:'1/2'},{name:'Tahini',quantity:'1 c.à.s'},{name:'Citron',quantity:'1/2'}],
    steps:["Forme falafels avec pois chiches, cuis au four.", "Sers sur quinoa avec crudités et tahini."],substitutions:["Lentilles."],
  },
  {
    id:'r270',name:'Poêlée Gambas Légumes',kcal:320,protein:30,carbs:14,fat:16,fiber:3,difficulty:'easy',budget:'high',prepTime:12,category:'lunch',tags:["sèche", "protéines"],image:'🦐',
    ingredients:[{name:'Gambas',quantity:'200g'},{name:'Courgette',quantity:'1'},{name:'Poivron',quantity:'1'},{name:'Ail',quantity:'2 gousses'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Saisis gambas 3 min. Ajoute légumes coupés 5 min."],substitutions:["Crevettes."],
  },
  {
    id:'r271',name:'Salade Pâtes Méditerranéenne',kcal:480,protein:22,carbs:55,fat:18,fiber:4,difficulty:'easy',budget:'medium',prepTime:15,category:'lunch',tags:["prise-masse", "méditerranéen"],image:'🍝',
    ingredients:[{name:'Pâtes courtes',quantity:'100g'},{name:'Feta',quantity:'40g'},{name:'Olives',quantity:'10'},{name:'Tomates cerises',quantity:'100g'},{name:'Concombre',quantity:'1/2'}],
    steps:["Cuis pâtes al dente, refroidis.", "Assemble avec feta, olives et crudités."],substitutions:["Mozzarella."],
  },
  {
    id:'r272',name:'Soupe Thaï Crevettes',kcal:280,protein:24,carbs:22,fat:10,fiber:3,difficulty:'medium',budget:'medium',prepTime:20,category:'lunch',tags:["sèche", "asiatique"],image:'🍲',
    ingredients:[{name:'Crevettes',quantity:'150g'},{name:'Lait de coco light',quantity:'150ml'},{name:'Bouillon',quantity:'300ml'},{name:'Citronnelle',quantity:'1 tige'},{name:'Champignons',quantity:'80g'}],
    steps:["Chauffe bouillon avec lait de coco et citronnelle.", "Ajoute crevettes et champignons 5 min."],substitutions:["Tofu."],
  },
  {
    id:'r273',name:'Quesadilla Poulet Fromage',kcal:560,protein:36,carbs:42,fat:24,fiber:2,difficulty:'easy',budget:'medium',prepTime:12,category:'lunch',tags:["prise-masse", "rapide"],image:'🫓',
    ingredients:[{name:'Tortillas',quantity:'2'},{name:'Poulet cuit',quantity:'150g'},{name:'Fromage râpé',quantity:'50g'},{name:'Poivron',quantity:'1/2'},{name:'Oignon',quantity:'1/2'}],
    steps:["Garnis une tortilla de poulet, fromage et légumes.", "Couvre avec la seconde tortilla. Cuis 3 min par face."],substitutions:["Dinde."],
  },
  {
    id:'r274',name:'Papillote Dorade Fenouil',kcal:300,protein:35,carbs:10,fat:12,fiber:3,difficulty:'medium',budget:'medium',prepTime:25,category:'lunch',tags:["sèche", "poisson"],image:'🐟',
    ingredients:[{name:'Filet de dorade',quantity:'200g'},{name:'Fenouil',quantity:'1'},{name:'Citron',quantity:'1'},{name:'Huile d olive',quantity:'1 c.à.c'}],
    steps:["Emballe dorade et fenouil en papillote.", "Cuis 20 min à 190°C."],substitutions:["Bar."],
  },
  {
    id:'r275',name:'Tomate Farcie Légère',kcal:280,protein:28,carbs:18,fat:10,fiber:4,difficulty:'medium',budget:'low',prepTime:30,category:'lunch',tags:["sèche", "traditionnel"],image:'🍅',
    ingredients:[{name:'Tomates',quantity:'4'},{name:'Viande hachée 5%',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Ail',quantity:'2 gousses'},{name:'Persil',quantity:'Au goût'}],
    steps:["Évide les tomates. Cuis viande avec oignon et ail.", "Farce les tomates, cuis 20 min à 180°C."],substitutions:["Courgette farcie."],
  },
  {
    id:'r276',name:'Bol Poke Thon Mangue',kcal:520,protein:34,carbs:50,fat:18,fiber:4,difficulty:'easy',budget:'high',prepTime:15,category:'lunch',tags:["prise-masse", "oméga-3"],image:'🐟',
    ingredients:[{name:'Thon frais',quantity:'180g'},{name:'Riz à sushi',quantity:'80g'},{name:'Mangue',quantity:'80g'},{name:'Edamame',quantity:'50g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Cuis riz. Coupe thon et mangue en cubes. Assemble."],substitutions:["Saumon."],
  },
  {
    id:'r277',name:'Salade Tiède Crevettes',kcal:280,protein:28,carbs:12,fat:14,fiber:3,difficulty:'easy',budget:'high',prepTime:10,category:'dinner',tags:["sèche", "rapide"],image:'🦐',
    ingredients:[{name:'Crevettes',quantity:'200g'},{name:'Roquette',quantity:'80g'},{name:'Avocat',quantity:'1/4'},{name:'Citron vert',quantity:'1'},{name:'Sésame',quantity:'1 c.à.c'}],
    steps:["Saisis crevettes 3 min. Assemble avec roquette et avocat."],substitutions:["Saumon fumé."],
  },
  {
    id:'r278',name:'Poulet Curry Vert',kcal:340,protein:36,carbs:14,fat:16,fiber:3,difficulty:'medium',budget:'medium',prepTime:20,category:'dinner',tags:["sèche", "asiatique"],image:'🍛',
    ingredients:[{name:'Blanc de poulet',quantity:'200g'},{name:'Pâte curry vert',quantity:'1 c.à.s'},{name:'Lait de coco light',quantity:'100ml'},{name:'Haricots verts',quantity:'150g'}],
    steps:["Saisis poulet. Ajoute curry et lait de coco.", "Haricots verts, mijote 10 min."],substitutions:["Crevettes."],
  },
  {
    id:'r279',name:'Wok Express Dinde',kcal:290,protein:34,carbs:12,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:10,category:'dinner',tags:["sèche", "rapide"],image:'🥡',
    ingredients:[{name:'Dinde émincée',quantity:'200g'},{name:'Brocoli',quantity:'100g'},{name:'Champignons',quantity:'100g'},{name:'Sauce soja',quantity:'1 c.à.s'}],
    steps:["Saisis dinde 4 min. Ajoute légumes 5 min."],substitutions:["Poulet."],
  },
  {
    id:'r280',name:'Steak Dinde Purée Céleri',kcal:310,protein:38,carbs:16,fat:10,fiber:4,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:["sèche", "protéines"],image:'🦃',
    ingredients:[{name:'Escalope de dinde',quantity:'200g'},{name:'Céleri-rave',quantity:'200g'},{name:'Muscade',quantity:'1 pincée'},{name:'Citron',quantity:'1/2'}],
    steps:["Grille dinde. Cuis et écrase céleri en purée."],substitutions:["Brocoli."],
  },
  {
    id:'r281',name:'Gratin Courgettes Fromage',kcal:350,protein:24,carbs:18,fat:20,fiber:4,difficulty:'medium',budget:'low',prepTime:30,category:'dinner',tags:["équilibré", "végétarien"],image:'🧀',
    ingredients:[{name:'Courgettes',quantity:'3'},{name:'Fromage râpé',quantity:'50g'},{name:'Crème légère',quantity:'80ml'},{name:'Oeufs',quantity:'2'},{name:'Muscade',quantity:'1 pincée'}],
    steps:["Coupe courgettes en rondelles.", "Mélange crème et oeufs, verse dessus avec fromage. Cuis 25 min."],substitutions:["Aubergines."],
  },
  {
    id:'r282',name:'Blanquette de Veau',kcal:550,protein:40,carbs:35,fat:24,fiber:3,difficulty:'hard',budget:'high',prepTime:45,category:'dinner',tags:["prise-masse", "traditionnel"],image:'🍲',
    ingredients:[{name:'Veau',quantity:'250g'},{name:'Carottes',quantity:'2'},{name:'Champignons',quantity:'100g'},{name:'Crème',quantity:'100ml'},{name:'Riz',quantity:'80g'}],
    steps:["Cuis veau avec carottes 30 min.", "Ajoute champignons et crème, sers avec riz."],substitutions:["Dinde."],
  },
  {
    id:'r283',name:'Salade Tiède Lentilles',kcal:290,protein:22,carbs:34,fat:6,fiber:10,difficulty:'easy',budget:'low',prepTime:15,category:'dinner',tags:["sèche", "fibres", "végétarien"],image:'🥗',
    ingredients:[{name:'Lentilles du Puy',quantity:'80g'},{name:'Tomates cerises',quantity:'100g'},{name:'Roquette',quantity:'60g'},{name:'Vinaigre balsamique',quantity:'1 c.à.s'}],
    steps:["Cuis lentilles 20 min. Assemble tiède avec roquette."],substitutions:["Chèvre émietté."],
  },
  {
    id:'r284',name:'Bol Açaí Protéiné XL',kcal:550,protein:30,carbs:65,fat:16,fiber:7,difficulty:'easy',budget:'high',prepTime:8,category:'dinner',tags:["prise-masse", "antioxydants"],image:'🟣',
    ingredients:[{name:'Pulpe d açaí',quantity:'200g'},{name:'Banane',quantity:'1'},{name:'Whey',quantity:'25g'},{name:'Lait d amande',quantity:'100ml'},{name:'Granola',quantity:'40g'}],
    steps:["Mixe açaí, banane, whey et lait. Garnis de granola."],substitutions:["Myrtilles."],
  },
  {
    id:'r285',name:'Pudding Riz Vanille',kcal:400,protein:15,carbs:58,fat:12,fiber:1,difficulty:'easy',budget:'low',prepTime:15,category:'snack',tags:["prise-masse", "gourmand"],image:'🍚',
    ingredients:[{name:'Riz rond',quantity:'60g'},{name:'Lait',quantity:'300ml'},{name:'Vanille',quantity:'1 c.à.c'},{name:'Sucre',quantity:'20g'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Cuis riz dans lait 12 min à feu doux. Ajoute vanille."],substitutions:["Lait de coco."],
  },
  {
    id:'r286',name:'Compote Sans Sucre',kcal:70,protein:1,carbs:16,fat:0,fiber:2,difficulty:'easy',budget:'low',prepTime:2,category:'snack',tags:["sèche", "rapide"],image:'🍏',
    ingredients:[{name:'Compote sans sucre',quantity:'100g'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Verse compote dans un bol. Cannelle."],substitutions:["Purée de pomme maison."],
  },
  {
    id:'r287',name:'Pudding Protéiné Light',kcal:160,protein:22,carbs:12,fat:2,fiber:1,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:["sèche", "protéines"],image:'🍮',
    ingredients:[{name:'Lait d amande',quantity:'200ml'},{name:'Whey vanille',quantity:'25g'},{name:'Graines de chia',quantity:'10g'}],
    steps:["Mélange tout. Réfrigère 2h."],substitutions:["Lait écrémé."],
  },
  {
    id:'r288',name:'Tartine Beurre Cacahuète Miel',kcal:350,protein:14,carbs:38,fat:18,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["prise-masse", "rapide"],image:'🍯',
    ingredients:[{name:'Pain complet',quantity:'2 tranches'},{name:'Beurre de cacahuète',quantity:'25g'},{name:'Miel',quantity:'1 c.à.c'}],
    steps:["Tartine de beurre de cacahuète et miel."],substitutions:["Beurre d amande."],
  },
  {
    id:'r289',name:'Energy Balls Dattes Coco',kcal:300,protein:6,carbs:42,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:10,category:'snack',tags:["prise-masse", "batch-cooking"],image:'🟤',
    ingredients:[{name:'Dattes',quantity:'80g'},{name:'Noix de coco',quantity:'25g'},{name:'Amandes',quantity:'20g'},{name:'Cacao',quantity:'10g'}],
    steps:["Mixe dattes et amandes. Ajoute cacao. Forme boules."],substitutions:["Noisettes."],
  },
  {
    id:'r290',name:'Cottage Cheese Herbes',kcal:120,protein:16,carbs:4,fat:4,fiber:0,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:["sèche", "protéines", "rapide"],image:'🧀',
    ingredients:[{name:'Cottage cheese',quantity:'150g'},{name:'Ciboulette',quantity:'Au goût'},{name:'Sel, poivre',quantity:'Au goût'}],
    steps:["Verse cottage cheese. Ajoute ciboulette."],substitutions:["Fromage frais 0%."],
  },
  {
    id:'r291',name:'Porridge Dattes Noix',kcal:500,protein:14,carbs:72,fat:18,fiber:6,difficulty:'easy',budget:'low',prepTime:10,category:'pre_workout',tags:["prise-masse", "énergie"],image:'🥣',
    ingredients:[{name:'Flocons d avoine',quantity:'80g'},{name:'Lait',quantity:'250ml'},{name:'Dattes Medjool',quantity:'3'},{name:'Noix',quantity:'15g'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Cuis avoine dans lait. Ajoute dattes et noix."],substitutions:["Amandes."],
  },
  {
    id:'r292',name:'Pomme Cannelle',kcal:95,protein:0,carbs:25,fat:0,fiber:4,difficulty:'easy',budget:'low',prepTime:2,category:'pre_workout',tags:["sèche", "rapide"],image:'🍎',
    ingredients:[{name:'Pomme',quantity:'1'},{name:'Cannelle',quantity:'1 pincée'}],
    steps:["Coupe la pomme en quartiers. Saupoudre cannelle."],substitutions:["Poire."],
  },
  {
    id:'r293',name:'Smoothie Pastèque Menthe',kcal:90,protein:2,carbs:20,fat:0,fiber:1,difficulty:'easy',budget:'low',prepTime:3,category:'pre_workout',tags:["sèche", "hydratant"],image:'🍉',
    ingredients:[{name:'Pastèque',quantity:'250g'},{name:'Menthe',quantity:'5 feuilles'},{name:'Glaçons',quantity:'5'}],
    steps:["Mixe pastèque, menthe et glaçons."],substitutions:["Melon."],
  },
  {
    id:'r294',name:'Tartine Confiture Maison',kcal:220,protein:5,carbs:42,fat:3,fiber:2,difficulty:'easy',budget:'low',prepTime:3,category:'pre_workout',tags:["sèche", "énergie"],image:'🍓',
    ingredients:[{name:'Pain complet',quantity:'1 tranche'},{name:'Confiture de fraise',quantity:'1 c.à.s'}],
    steps:["Toaste pain, tartine de confiture."],substitutions:["Miel."],
  },
  {
    id:'r295',name:'Pancakes Énergie',kcal:440,protein:16,carbs:62,fat:14,fiber:3,difficulty:'easy',budget:'low',prepTime:12,category:'pre_workout',tags:["prise-masse", "énergie"],image:'🥞',
    ingredients:[{name:'Flocons d avoine',quantity:'70g'},{name:'Banane',quantity:'1'},{name:'Oeuf',quantity:'1'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:["Mixe tout. Cuis petites crêpes 2 min par face."],substitutions:["Sirop d agave."],
  },

  {
    id:'r301',name:'Salade Roquette Parmesan',kcal:280,protein:18,carbs:12,fat:18,fiber:3,difficulty:'easy',budget:'medium',prepTime:5,category:'lunch',tags:["sèche", "rapide"],image:'🥗',
    ingredients:[{name:'Roquette',quantity:'100g'},{name:'Parmesan',quantity:'30g'},{name:'Tomates séchées',quantity:'30g'},{name:'Pignons',quantity:'15g'},{name:'Vinaigre balsamique',quantity:'1 c.à.s'}],
    steps:["Assemble roquette, parmesan et tomates. Ajoute pignons et vinaigre."],substitutions:["Feta."],
  },
  {
    id:'r302',name:'Gratin Brocoli Poulet',kcal:500,protein:40,carbs:22,fat:26,fiber:5,difficulty:'medium',budget:'low',prepTime:30,category:'dinner',tags:["prise-masse", "protéines"],image:'🧀',
    ingredients:[{name:'Brocoli',quantity:'300g'},{name:'Blanc de poulet',quantity:'200g'},{name:'Crème légère',quantity:'100ml'},{name:'Fromage râpé',quantity:'40g'}],
    steps:["Cuis brocoli et poulet. Dispose dans un plat.", "Crème et fromage dessus, gratine 15 min."],substitutions:["Dinde."],
  },
  {
    id:'r303',name:'Compote Banane Cannelle',kcal:90,protein:1,carbs:20,fat:0,fiber:2,difficulty:'easy',budget:'low',prepTime:5,category:'snack',tags:["sèche", "rapide"],image:'🍌',
    ingredients:[{name:'Banane',quantity:'1'},{name:'Cannelle',quantity:'1 c.à.c'},{name:'Citron',quantity:'1 filet'}],
    steps:["Écrase la banane. Ajoute cannelle et citron."],substitutions:["Pomme."],
  },
  {
    id:'r304',name:'Smoothie Betterave Light',kcal:120,protein:3,carbs:26,fat:0,fiber:3,difficulty:'easy',budget:'medium',prepTime:5,category:'pre_workout',tags:["sèche", "performance"],image:'🧃',
    ingredients:[{name:'Betterave',quantity:'1 petite'},{name:'Pomme',quantity:'1'},{name:'Gingembre',quantity:'1 cm'}],
    steps:["Passe tout à l extracteur."],substitutions:["Carotte."],
  },
  {
    id:'r305',name:'Tartare Thon Avocat',kcal:260,protein:32,carbs:6,fat:12,fiber:3,difficulty:'easy',budget:'high',prepTime:10,category:'post_workout',tags:["sèche", "oméga-3"],image:'🐟',
    ingredients:[{name:'Thon frais',quantity:'180g'},{name:'Avocat',quantity:'1/4'},{name:'Citron vert',quantity:'1'},{name:'Sésame',quantity:'1 c.à.c'}],
    steps:["Coupe thon en dés. Assaisonne citron. Sers avec avocat."],substitutions:["Saumon frais."],
  },


  // ══════════════════════════════════════════
  //   🌿 TAYYIBAT — 50 recettes strictes
  //   Seuls ingrédients autorisés utilisés
  // ══════════════════════════════════════════
  {id:'t1',name:"Épaule d'Agneau Mijotée",kcal:520,protein:44,carbs:8,fat:32,fiber:1,difficulty:'medium',budget:'medium',prepTime:90,category:'post_workout',tags:['tayyibat','agneau','prise-masse','post_workout'],image:'🍲',
    ingredients:[{name:"Épaule d'agneau",quantity:'350g'},{name:'Oignon',quantity:'2'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'400ml'}],
    steps:["Dore l'agneau dans l'huile avec les oignons émincés.","Couvre d'eau, sale et mijote à feu doux 75 min.","Sers avec le jus de cuisson réduit."],substitutions:["Gigot d'agneau à la place de l'épaule."],
  },
  {id:'t2',name:"Agneau Grillé au Thym",kcal:430,protein:46,carbs:4,fat:24,fiber:1,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:['tayyibat', 'agneau', 'sèche'],image:'🥩',
    ingredients:[{name:"Côtelettes d'agneau",quantity:'300g'},{name:'Thym frais',quantity:'2 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Badigeonne les côtelettes d'huile et de thym.",'Sale.','Grille 6-8 min par côté à feu vif.'],substitutions:["Gigot en tranches à la place des côtelettes."],
  },
  {id:'t3',name:"Riz Safran Agneau",kcal:560,protein:40,carbs:62,fat:16,fiber:2,difficulty:'medium',budget:'medium',prepTime:45,category:'dinner',tags:['tayyibat', 'agneau', 'riz', 'prise-masse'],image:'🍚',
    ingredients:[{name:'Agneau en cubes',quantity:'220g'},{name:'Riz basmati',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'300ml'}],
    steps:["Dore l'agneau dans le ghee avec oignon et cardamome.","Fais infuser le safran dans 2 c.à.s d'eau chaude.","Ajoute le riz, l'eau safranée et le reste d'eau, cuis 18 min à feu doux."],substitutions:["Bœuf à la place de l'agneau."],
  },
  {id:'t4',name:"Bœuf Mijoté Pommes de Terre",kcal:510,protein:42,carbs:40,fat:18,fiber:5,difficulty:'medium',budget:'medium',prepTime:70,category:'dinner',tags:['tayyibat', 'bœuf', 'mijoté'],image:'🍲',
    ingredients:[{name:'Bœuf à braiser',quantity:'250g'},{name:'Pommes de terre',quantity:'3'},{name:'Oignon',quantity:'1'},{name:'Tomates pelées épépinées',quantity:'2'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Thym',quantity:'1 c.à.c'}],
    steps:["Dore le bœuf avec l'oignon dans l'huile.","Ajoute tomates, thym, sel et 400ml d'eau.",'Ajoute les pommes de terre en gros cubes. Mijote 55 min.'],substitutions:["Patate douce à la place des pommes de terre."],
  },
  {id:'t5',name:"Soupe Potiron Safran",kcal:220,protein:5,carbs:34,fat:8,fiber:4,difficulty:'easy',budget:'low',prepTime:30,category:'dinner',tags:['tayyibat', 'soupe', 'légumes', 'sèche'],image:'🎃',
    ingredients:[{name:'Potiron',quantity:'400g'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'600ml'}],
    steps:["Fais revenir l'oignon dans l'huile 3 min.",'Ajoute potiron en cubes, safran, sel et eau.','Cuis 20 min puis mixe.'],substitutions:["Patate douce à la place du potiron."],
  },
  {id:'t6',name:"Pigeon Rôti Thym Cardamome",kcal:380,protein:42,carbs:2,fat:20,fiber:0,difficulty:'medium',budget:'medium',prepTime:50,category:'dinner',tags:['tayyibat', 'pigeon', 'sèche'],image:'🕊️',
    ingredients:[{name:'Pigeons',quantity:'2 pièces'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Cardamome verte',quantity:'2 gousses'}],
    steps:["Badigeonne les pigeons d'huile, thym et sel.","Glisse l'oignon et la cardamome à l'intérieur.",'Rôtis au four 180°C pendant 40 min en arrosant régulièrement.'],substitutions:["Caille à la place du pigeon."],
  },
  {id:'t7',name:"Caille Grillée Thym",kcal:320,protein:38,carbs:2,fat:16,fiber:0,difficulty:'easy',budget:'medium',prepTime:30,category:'dinner',tags:['tayyibat', 'caille', 'sèche'],image:'🐦',
    ingredients:[{name:'Cailles',quantity:'2 pièces'},{name:'Thym frais',quantity:'1 c.à.s'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Ouvre les cailles à plat (en crapaudine).","Badigeonne d'huile, thym et sel.",'Grille 12 min par côté à feu moyen.'],substitutions:["Pigeon à la place de la caille."],
  },
  {id:'t8',name:"Poisson Sauvage au Four Thym",kcal:350,protein:44,carbs:4,fat:16,fiber:1,difficulty:'easy',budget:'medium',prepTime:25,category:'dinner',tags:['tayyibat', 'poisson', 'sèche'],image:'🐟',
    ingredients:[{name:'Dorade ou bar sauvage',quantity:'1 poisson 400g'},{name:'Oignon',quantity:'1'},{name:'Tomate pelée épépinée',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Pose le poisson sur un lit d'oignon et tomate dans un plat.","Arrose d'huile, parsème de thym et sale.",'Cuis au four 200°C pendant 20 min.'],substitutions:["Mulet ou rouget sauvage à la place de la dorade."],
  },
  {id:'t9',name:"Riz Cardamome Dattes",kcal:460,protein:8,carbs:80,fat:12,fiber:4,difficulty:'easy',budget:'low',prepTime:25,category:'breakfast',tags:['tayyibat','riz','énergie','breakfast'],image:'🍚',
    ingredients:[{name:'Riz basmati',quantity:'150g'},{name:'Dattes Medjool',quantity:'5'},{name:'Cardamome verte moulue',quantity:'0.5 c.à.c'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'280ml'}],
    steps:["Fais revenir le riz dans le ghee 2 min.",'Ajoute eau, sel et cardamome, porte à ébullition.','Cuis à feu doux 15 min, garnit de dattes dénoyautées coupées.'],substitutions:["Raisins secs à la place des dattes."],
  },
  {id:'t10',name:"Foie d'Agneau Oignon Confit",kcal:380,protein:44,carbs:14,fat:14,fiber:2,difficulty:'easy',budget:'low',prepTime:20,category:'post_workout',tags:['tayyibat','agneau','abats','sèche','post_workout'],image:'🍽️',
    ingredients:[{name:"Foie d'agneau",quantity:'250g'},{name:'Oignon',quantity:'2'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Thym',quantity:'1 c.à.c'}],
    steps:["Fais confire les oignons émincés dans l'huile 15 min à feu doux.",'Ajoute les tranches de foie, cuis 3-4 min par côté.','Sale et saupoudre de thym.'],substitutions:["Foie de veau à la place du foie d'agneau."],
  },
  {id:'t11',name:"Agneau Potiron Mijoté",kcal:490,protein:40,carbs:28,fat:22,fiber:4,difficulty:'medium',budget:'medium',prepTime:60,category:'dinner',tags:['tayyibat', 'agneau', 'légumes', 'prise-masse'],image:'🍲',
    ingredients:[{name:'Agneau en morceaux',quantity:'250g'},{name:'Potiron',quantity:'300g'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:'Miel',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Dore l'agneau avec oignon dans l'huile.","Ajoute potiron en cubes, safran, miel et 300ml d'eau.",'Couvre et mijote 45 min.'],substitutions:["Patate douce à la place du potiron."],
  },
  {id:'t12',name:"Bœuf Haché Poivron Tomate",kcal:440,protein:38,carbs:20,fat:22,fiber:4,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:['tayyibat', 'bœuf', 'légumes'],image:'🫑',
    ingredients:[{name:'Bœuf haché',quantity:'200g'},{name:'Poivron rouge',quantity:'1'},{name:'Tomates pelées épépinées cuites',quantity:'2'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Fais revenir oignon et poivron coupé dans l'huile 5 min.",'Ajoute le bœuf haché, dore 5 min.','Ajoute les tomates et sel, cuis 10 min à feu moyen.'],substitutions:["Agneau haché à la place du bœuf."],
  },
  {id:'t13',name:"Lapin Pommes de Terre",kcal:460,protein:44,carbs:32,fat:16,fiber:4,difficulty:'medium',budget:'medium',prepTime:60,category:'dinner',tags:['tayyibat', 'lapin', 'sèche'],image:'🐇',
    ingredients:[{name:'Lapin en morceaux',quantity:'350g'},{name:'Pommes de terre',quantity:'3'},{name:'Oignon',quantity:'1'},{name:'Tomate pelée épépinée cuite',quantity:'2'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Dore le lapin dans l'huile avec oignon.","Ajoute tomates, thym et sel. Couvre d'eau.",'Ajoute les pommes de terre et mijote 45 min.'],substitutions:["Agneau si pas de lapin."],
  },
  {id:'t14',name:"Agneau Champignons Sautés",kcal:410,protein:42,carbs:10,fat:22,fiber:2,difficulty:'easy',budget:'medium',prepTime:25,category:'post_workout',tags:['tayyibat','agneau','champignons','sèche','post_workout'],image:'🍄',
    ingredients:[{name:'Agneau en lamelles',quantity:'220g'},{name:'Champignons de Paris',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Saisis l'agneau à feu vif 5 min. Réserve.",'Fais revenir champignons et oignon 8 min.',"Remets l'agneau, ajoute thym et sel, mélange 2 min."],substitutions:["Champignons shiitake pour plus d'arôme."],
  },
  {id:'t15',name:"Patate Douce Miel Cardamome",kcal:320,protein:4,carbs:62,fat:8,fiber:6,difficulty:'easy',budget:'low',prepTime:35,category:'breakfast',tags:['tayyibat','légumes','breakfast'],image:'🍠',
    ingredients:[{name:'Patate douce',quantity:'2'},{name:'Miel',quantity:'1 c.à.s'},{name:'Cardamome verte moulue',quantity:'0.5 c.à.c'},{name:'Ghee',quantity:'1 c.à.c'},{name:'Sel',quantity:'à goût'}],
    steps:["Cuis les patates douces au four 200°C 30 min.",'Ouvre-les, dépose ghee et miel.','Saupoudre de cardamome.'],substitutions:["Potiron rôti à la place de la patate douce."],
  },
  {id:'t16',name:"Freekeh Agneau Safran",kcal:540,protein:38,carbs:60,fat:16,fiber:6,difficulty:'medium',budget:'medium',prepTime:50,category:'dinner',tags:['tayyibat', 'agneau', 'freekeh', 'prise-masse'],image:'🌾',
    ingredients:[{name:'Freekeh',quantity:'150g'},{name:'Agneau haché',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Safran',quantity:'1 pincée'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'350ml'}],
    steps:["Dore l'agneau avec oignon et cardamome dans l'huile.","Ajoute le freekeh rincé, le safran dissous et l'eau.",'Cuis à feu doux 35 min.'],substitutions:["Riz complet à la place du freekeh."],
  },
  {id:'t17',name:"Poisson Sauvage Vapeur Safran",kcal:300,protein:42,carbs:6,fat:10,fiber:1,difficulty:'easy',budget:'medium',prepTime:20,category:'dinner',tags:['tayyibat', 'poisson', 'sèche'],image:'🐠',
    ingredients:[{name:'Filets de poisson sauvage',quantity:'300g'},{name:'Safran',quantity:'1 pincée'},{name:'Oignon',quantity:'0.5'},{name:'Sel',quantity:'à goût'},{name:"Huile d'olive",quantity:'1 c.à.c'},{name:'Eau',quantity:'200ml'}],
    steps:["Dispose l'oignon émincé au fond d'un plat.","Pose les filets, arrose d'huile et sel.","Fais infuser le safran dans l'eau chaude, verse. Cuis vapeur ou four 15 min."],substitutions:["Tout poisson sauvage convient."],
  },
  {id:'t18',name:"Agneau Tomate Poivron Rôti",kcal:450,protein:40,carbs:18,fat:24,fiber:4,difficulty:'easy',budget:'medium',prepTime:35,category:'dinner',tags:['tayyibat', 'agneau', 'légumes'],image:'🫑',
    ingredients:[{name:'Agneau en cubes',quantity:'250g'},{name:'Poivron rouge cuit',quantity:'2'},{name:'Tomates pelées épépinées',quantity:'3'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Thym',quantity:'1 c.à.c'}],
    steps:["Rôtis les poivrons au four 200°C 20 min, pèle-les.","Saisis l'agneau avec oignon dans l'huile.",'Ajoute tomates et poivrons, thym et sel. Mijote 20 min.'],substitutions:["Poivron vert à la place du rouge."],
  },
  {id:'t19',name:"Bœuf Pommes de Terre Thym",kcal:490,protein:40,carbs:38,fat:18,fiber:5,difficulty:'easy',budget:'medium',prepTime:30,category:'dinner',tags:['tayyibat', 'bœuf', 'légumes', 'sèche'],image:'🥩',
    ingredients:[{name:'Steak de bœuf',quantity:'200g'},{name:'Pommes de terre',quantity:'2'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Cuis les pommes de terre en cubes à l'huile avec oignon et thym.",'Grille le steak 4 min par côté.','Sers ensemble.'],substitutions:["Patate douce à la place des pommes de terre."],
  },
  {id:'t20',name:"Soupe Pomme de Terre Champignon",kcal:260,protein:8,carbs:36,fat:10,fiber:4,difficulty:'easy',budget:'low',prepTime:30,category:'dinner',tags:['tayyibat', 'soupe', 'légumes'],image:'🍵',
    ingredients:[{name:'Pommes de terre',quantity:'3'},{name:'Champignons de Paris',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'700ml'}],
    steps:["Fais revenir oignon dans l'huile 3 min.",'Ajoute champignons, pommes de terre, thym et eau.','Cuis 20 min, mixe partiellement pour texture crémeuse.'],substitutions:["Potiron à la place des champignons."],
  },
  {id:'t21',name:"Poivron Farci Agneau Riz",kcal:420,protein:36,carbs:22,fat:20,fiber:4,difficulty:'medium',budget:'medium',prepTime:40,category:'dinner',tags:['tayyibat', 'agneau', 'légumes', 'prise-masse'],image:'🫑',
    ingredients:[{name:'Poivrons rouges',quantity:'3'},{name:'Agneau haché',quantity:'200g'},{name:'Riz',quantity:'60g'},{name:'Oignon',quantity:'1'},{name:'Tomate pelée cuite',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Mélange agneau, riz mi-cuit, oignon émincé, tomate et sel.",'Coupe le chapeau des poivrons, farcis-les.',"Cuis au four 180°C 30 min avec un fond d'eau."],substitutions:["Bœuf haché à la place de l'agneau."],
  },
  {id:'t22',name:"Freekeh Pigeon Safran",kcal:510,protein:46,carbs:42,fat:18,fiber:5,difficulty:'medium',budget:'medium',prepTime:55,category:'dinner',tags:['tayyibat', 'pigeon', 'freekeh', 'prise-masse'],image:'🕊️',
    ingredients:[{name:'Pigeon',quantity:'1 pièce'},{name:'Freekeh',quantity:'120g'},{name:'Oignon',quantity:'1'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Safran',quantity:'1 pincée'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Cuis le pigeon dans l'eau salée 30 min, réserve le bouillon.",'Fais revenir oignon et cardamome dans le ghee.','Ajoute freekeh et 300ml de bouillon safran. Cuis 30 min. Pose le pigeon.'],substitutions:["Agneau à la place du pigeon."],
  },
  {id:'t23',name:"Caille au Safran Miel",kcal:340,protein:40,carbs:8,fat:14,fiber:1,difficulty:'medium',budget:'medium',prepTime:40,category:'dinner',tags:['tayyibat', 'caille'],image:'🐦',
    ingredients:[{name:'Cailles',quantity:'2 pièces'},{name:'Safran',quantity:'1 pincée'},{name:'Oignon',quantity:'1'},{name:'Miel',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Fais revenir les cailles entières avec oignon dans l'huile.","Dissous le safran dans 200ml d'eau chaude, verse avec le miel.",'Couvre et cuis à feu doux 30 min.'],substitutions:["Pigeon à la place de la caille."],
  },
  {id:'t24',name:"Riz Pilaf Raisins Cardamome",kcal:440,protein:8,carbs:76,fat:12,fiber:3,difficulty:'easy',budget:'low',prepTime:25,category:'pre_workout',tags:['tayyibat','riz','pre_workout'],image:'🍚',
    ingredients:[{name:'Riz basmati',quantity:'150g'},{name:'Raisins secs',quantity:'30g'},{name:'Oignon',quantity:'1'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'280ml'}],
    steps:["Fais revenir oignon et cardamome dans le ghee 3 min.",'Ajoute riz rincé et eau salée.','Cuis 15 min à feu doux. Incorpore les raisins en fin.'],substitutions:["Dattes hachées à la place des raisins."],
  },
  {id:'t25',name:"Lapin Champignons Thym",kcal:420,protein:46,carbs:8,fat:20,fiber:2,difficulty:'medium',budget:'medium',prepTime:55,category:'dinner',tags:['tayyibat', 'lapin', 'champignons', 'sèche'],image:'🐇',
    ingredients:[{name:'Lapin en morceaux',quantity:'300g'},{name:'Champignons de Paris',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'2 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'200ml'}],
    steps:["Dore le lapin avec oignon dans l'huile.",'Ajoute champignons, thym, sel et eau.','Mijote 40 min à feu doux.'],substitutions:["Agneau à la place du lapin."],
  },
  {id:'t26',name:"Bœuf Potiron Safran Mijoté",kcal:470,protein:38,carbs:30,fat:20,fiber:4,difficulty:'medium',budget:'medium',prepTime:65,category:'dinner',tags:['tayyibat', 'bœuf', 'légumes', 'prise-masse'],image:'🍲',
    ingredients:[{name:'Bœuf en cubes',quantity:'220g'},{name:'Potiron',quantity:'300g'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:'Miel',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Dore le bœuf avec l'oignon.","Dissous le safran dans 300ml d'eau chaude. Verse avec le miel.",'Ajoute le potiron en cubes, couvre et mijote 50 min.'],substitutions:["Agneau à la place du bœuf."],
  },
  {id:'t27',name:"Poisson Sauvage Tomate Poivron",kcal:320,protein:38,carbs:16,fat:12,fiber:3,difficulty:'easy',budget:'medium',prepTime:25,category:'dinner',tags:['tayyibat', 'poisson', 'légumes', 'sèche'],image:'🐟',
    ingredients:[{name:'Filets de poisson sauvage',quantity:'280g'},{name:'Tomates pelées épépinées',quantity:'2'},{name:'Poivron rouge cuit',quantity:'1'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Thym',quantity:'1 c.à.c'},{name:'Sel',quantity:'à goût'}],
    steps:["Fais revenir oignon, tomates et poivron 10 min.",'Pose les filets de poisson sur le lit de légumes.','Couvre et cuis 12 min. Sale et ajoute le thym.'],substitutions:["Tout poisson sauvage à chair ferme."],
  },
  {id:'t28',name:"Pommes de Terre Champignons Sautés",kcal:340,protein:8,carbs:48,fat:14,fiber:5,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:['tayyibat', 'légumes'],image:'🥔',
    ingredients:[{name:'Pommes de terre',quantity:'4'},{name:'Champignons de Paris',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Cuis les pommes de terre en cubes dans l'huile avec oignon.",'Ajoute champignons et thym quand les pommes de terre sont dorées.',"Saute 8 min jusqu'à coloration."],substitutions:["Champignons shiitake pour plus de saveur."],
  },
  {id:'t29',name:"Agneau Patate Douce Cardamome",kcal:510,protein:40,carbs:44,fat:18,fiber:6,difficulty:'medium',budget:'medium',prepTime:55,category:'dinner',tags:['tayyibat', 'agneau', 'légumes', 'prise-masse'],image:'🍠',
    ingredients:[{name:'Agneau en cubes',quantity:'230g'},{name:'Patate douce',quantity:'2'},{name:'Oignon',quantity:'1'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Safran',quantity:'1 pincée'},{name:'Miel',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Dore l'agneau avec oignon et cardamome dans l'huile.",'Ajoute patates douces en cubes, safran et miel.',"Couvre de 300ml d'eau salée et mijote 40 min."],substitutions:["Potiron à la place de la patate douce."],
  },
  {id:'t30',name:"Riz Maïs Poivron Oignon",kcal:400,protein:10,carbs:68,fat:10,fiber:4,difficulty:'easy',budget:'low',prepTime:25,category:'pre_workout',tags:['tayyibat','riz','légumes','pre_workout'],image:'🌽',
    ingredients:[{name:'Riz',quantity:'130g'},{name:'Maïs en grains',quantity:'80g'},{name:'Poivron rouge cuit',quantity:'1'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Fais revenir oignon et poivron coupé dans l'huile.","Ajoute le riz rincé, le maïs et 260ml d'eau salée.",'Cuis à feu doux 18 min.'],substitutions:["Freekeh à la place du riz."],
  },
  {id:'t31',name:"Filet de Bœuf Champignons Beurre",kcal:430,protein:46,carbs:8,fat:22,fiber:2,difficulty:'easy',budget:'high',prepTime:20,category:'dinner',tags:['tayyibat', 'bœuf', 'champignons', 'sèche'],image:'🥩',
    ingredients:[{name:'Filet de bœuf',quantity:'200g'},{name:'Champignons de Paris',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:'Beurre',quantity:'10g'},{name:'Sel',quantity:'à goût'}],
    steps:["Saisis le filet dans le beurre 4 min par côté, réserve.",'Fais revenir oignon et champignons dans la même poêle 8 min.','Remets le filet, ajoute thym et sel. Sers.'],substitutions:["Steak de côte à la place du filet."],
  },
  {id:'t32',name:"Banane Dattes Miel Petit-Déj",kcal:340,protein:4,carbs:68,fat:6,fiber:6,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:['tayyibat','fruits','énergie','breakfast'],image:'🍌',
    ingredients:[{name:'Banane',quantity:'2'},{name:'Dattes Medjool',quantity:'3'},{name:'Miel',quantity:'1 c.à.s'},{name:'Cardamome verte moulue',quantity:'1 pincée'},{name:'Eau',quantity:'200ml'}],
    steps:["Tranche les bananes dans un bol.",'Dénoyaute les dattes et coupe-les.','Arrose de miel, saupoudre de cardamome.'],substitutions:["Figues fraîches à la place des dattes."],
  },
  {id:'t33',name:"Smoothie Banane Figue Miel",kcal:320,protein:4,carbs:64,fat:4,fiber:5,difficulty:'easy',budget:'low',prepTime:5,category:'breakfast',tags:['tayyibat','fruits','rapide','breakfast'],image:'🥤',
    ingredients:[{name:'Banane',quantity:'2'},{name:'Figues fraîches',quantity:'3'},{name:'Miel',quantity:'1 c.à.s'},{name:'Eau froide',quantity:'250ml'},{name:'Cardamome verte moulue',quantity:'1 pincée'}],
    steps:['Mixe tous les ingrédients.',"Ajuste la consistance avec l'eau.",'Sers frais.'],substitutions:["Dattes à la place des figues."],
  },
  {id:'t34',name:"Riz au Four Bœuf Safran",kcal:530,protein:38,carbs:58,fat:16,fiber:2,difficulty:'medium',budget:'medium',prepTime:50,category:'dinner',tags:['tayyibat', 'bœuf', 'riz', 'prise-masse'],image:'🍚',
    ingredients:[{name:'Riz',quantity:'140g'},{name:'Bœuf en lamelles',quantity:'200g'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau bouillante',quantity:'280ml'}],
    steps:["Dore bœuf et oignon dans le ghee.",'Dispose dans un plat allant au four avec riz, safran dissous et eau.','Couvre de papier aluminium et cuis 30 min à 180°C.'],substitutions:["Agneau à la place du bœuf."],
  },
  {id:'t35',name:"Figues Miel Cardamome",kcal:260,protein:2,carbs:54,fat:4,fiber:5,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:['tayyibat', 'fruits'],image:'🍯',
    ingredients:[{name:'Figues fraîches',quantity:'5'},{name:'Miel',quantity:'1 c.à.s'},{name:'Cardamome verte moulue',quantity:'1 pincée'}],
    steps:["Coupe les figues en deux.",'Arrose de miel et saupoudre de cardamome.','Sers frais ou tiède.'],substitutions:["Dattes à la place des figues."],
  },
  {id:'t36',name:"Pomme Pelée Miel",kcal:160,protein:1,carbs:38,fat:0,fiber:3,difficulty:'easy',budget:'low',prepTime:3,category:'snack',tags:['tayyibat', 'fruits', 'rapide'],image:'🍎',
    ingredients:[{name:'Pommes pelées',quantity:'2'},{name:'Miel',quantity:'1 c.à.s'}],
    steps:["Pèle et coupe les pommes en tranches.",'Arrose de miel. Sers immédiatement.'],substitutions:["Poires pelées à la place des pommes."],
  },
  {id:'t37',name:"Fraises Miel Anis Vert",kcal:180,protein:2,carbs:38,fat:1,fiber:3,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:['tayyibat', 'fruits', 'rapide'],image:'🍓',
    ingredients:[{name:'Fraises',quantity:'200g'},{name:'Miel',quantity:'1 c.à.s'},{name:'Anis vert moulu',quantity:'1 pincée'}],
    steps:['Lave et équeute les fraises.','Coupe-les en deux, arrose de miel.',"Saupoudre d'anis vert."],substitutions:["Myrtilles à la place des fraises."],
  },
  {id:'t38',name:"Dattes Ghee Cardamome",kcal:280,protein:2,carbs:54,fat:8,fiber:4,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:['tayyibat', 'fruits', 'énergie'],image:'🌴',
    ingredients:[{name:'Dattes Medjool',quantity:'6'},{name:'Ghee',quantity:'1 c.à.c'},{name:'Cardamome verte moulue',quantity:'1 pincée'}],
    steps:['Dénoyaute les dattes.','Glisse une pointe de ghee dans chaque datte.','Saupoudre de cardamome.'],substitutions:["Miel à la place du ghee."],
  },
  {id:'t39',name:"Myrtilles Miel Cardamome",kcal:180,protein:2,carbs:38,fat:1,fiber:4,difficulty:'easy',budget:'medium',prepTime:3,category:'snack',tags:['tayyibat', 'fruits'],image:'🫐',
    ingredients:[{name:'Myrtilles',quantity:'150g'},{name:'Miel',quantity:'1 c.à.s'},{name:'Cardamome verte moulue',quantity:'1 pincée'}],
    steps:['Lave les myrtilles.','Arrose de miel et saupoudre de cardamome.','Sers frais.'],substitutions:["Framboises à la place des myrtilles."],
  },
  {id:'t40',name:"Chocolat Noir Dattes",kcal:260,protein:3,carbs:36,fat:12,fiber:4,difficulty:'easy',budget:'medium',prepTime:5,category:'snack',tags:['tayyibat', 'gourmand'],image:'🍫',
    ingredients:[{name:'Chocolat noir 70%+',quantity:'30g'},{name:'Dattes Medjool',quantity:'3'}],
    steps:['Dénoyaute les dattes.','Sers avec les carrés de chocolat noir.'],substitutions:["Figues fraîches à la place des dattes."],
  },
  {id:'t41',name:"Freekeh Cardamome Safran",kcal:440,protein:12,carbs:72,fat:10,fiber:7,difficulty:'easy',budget:'low',prepTime:40,category:'pre_workout',tags:['tayyibat','freekeh','pre_workout'],image:'🌾',
    ingredients:[{name:'Freekeh',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Safran',quantity:'1 pincée'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'350ml'}],
    steps:["Fais revenir oignon et cardamome dans l'huile.",'Ajoute freekeh rincé, safran dissous et eau salée.','Cuis à feu doux 30 min à couvert.'],substitutions:["Riz complet à la place du freekeh."],
  },
  {id:'t42',name:"Gigot d'Agneau Rôti",kcal:480,protein:50,carbs:4,fat:28,fiber:1,difficulty:'easy',budget:'medium',prepTime:40,category:'dinner',tags:['tayyibat', 'agneau', 'prise-masse'],image:'🥩',
    ingredients:[{name:"Gigot d'agneau",quantity:'400g'},{name:'Oignon',quantity:'2'},{name:'Thym',quantity:'1 c.à.s'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Badigeonne le gigot d'huile, thym et sel.","Dispose sur un lit d'oignon en rondelles.",'Rôtis au four 200°C 30-35 min.'],substitutions:["Épaule d'agneau à la place du gigot."],
  },
  {id:'t43',name:"Bœuf Oignon Confit Riz Safran",kcal:540,protein:40,carbs:58,fat:16,fiber:3,difficulty:'easy',budget:'medium',prepTime:30,category:'dinner',tags:['tayyibat', 'bœuf', 'riz', 'prise-masse'],image:'🍽️',
    ingredients:[{name:'Bœuf haché',quantity:'200g'},{name:'Oignon',quantity:'2'},{name:'Riz',quantity:'130g'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Safran',quantity:'1 pincée'}],
    steps:["Confit l'oignon dans l'huile 15 min à feu doux jusqu'à coloration.",'Ajoute le bœuf, dore 5 min.','Cuis le riz séparément avec le safran. Sers ensemble.'],substitutions:["Agneau haché à la place du bœuf."],
  },
  {id:'t44',name:"Potiron Champignon Thym Rôti",kcal:240,protein:6,carbs:30,fat:12,fiber:5,difficulty:'easy',budget:'low',prepTime:25,category:'lunch',tags:['tayyibat', 'légumes', 'sèche'],image:'🎃',
    ingredients:[{name:'Potiron',quantity:'300g'},{name:'Champignons de Paris',quantity:'150g'},{name:'Oignon',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Rôtis potiron en cubes au four 200°C 20 min.",'Fais revenir champignons et oignon à la poêle 8 min.','Mélange, ajoute thym et sel.'],substitutions:["Patate douce à la place du potiron."],
  },
  {id:'t45',name:"Riz Cardamome Safran Simple",kcal:360,protein:6,carbs:62,fat:10,fiber:1,difficulty:'easy',budget:'low',prepTime:20,category:'pre_workout',tags:['tayyibat','riz','pre_workout'],image:'🍚',
    ingredients:[{name:'Riz basmati',quantity:'130g'},{name:'Cardamome verte',quantity:'3 gousses'},{name:'Safran',quantity:'1 pincée'},{name:'Ghee',quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Eau',quantity:'250ml'}],
    steps:["Fais revenir le riz dans le ghee avec cardamome 2 min.","Dissous le safran dans l'eau chaude. Verse sur le riz.",'Cuis à feu doux 15 min.'],substitutions:["Anis vert en remplacement de la cardamome."],
  },
  {id:'t46',name:"Bœuf Maïs Poivron Sauté",kcal:460,protein:36,carbs:38,fat:18,fiber:4,difficulty:'easy',budget:'medium',prepTime:25,category:'dinner',tags:['tayyibat', 'bœuf', 'légumes'],image:'🌽',
    ingredients:[{name:'Bœuf haché',quantity:'200g'},{name:'Maïs',quantity:'80g'},{name:'Poivron rouge cuit',quantity:'1'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Fais revenir oignon et poivron coupé 5 min.",'Ajoute bœuf haché, dore 5 min.','Ajoute maïs et sel, saute 3 min.'],substitutions:["Agneau haché à la place du bœuf."],
  },
  {id:'t47',name:"Agneau Figues Safran Mijoté",kcal:500,protein:38,carbs:36,fat:22,fiber:4,difficulty:'medium',budget:'medium',prepTime:55,category:'dinner',tags:['tayyibat', 'agneau', 'prise-masse'],image:'🍲',
    ingredients:[{name:'Agneau en morceaux',quantity:'250g'},{name:'Figues fraîches',quantity:'5'},{name:'Oignon',quantity:'1'},{name:'Safran',quantity:'1 pincée'},{name:'Miel',quantity:'1 c.à.s'},{name:"Huile d'olive",quantity:'1 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Dore l'agneau avec l'oignon dans l'huile.","Ajoute safran dissous dans 250ml d'eau, miel et sel.",'Mijote 40 min, ajoute les figues entières les 10 dernières minutes.'],substitutions:["Dattes à la place des figues."],
  },
  {id:'t48',name:"Poisson Sauvage Pomme de Terre Four",kcal:380,protein:40,carbs:32,fat:12,fiber:4,difficulty:'easy',budget:'medium',prepTime:35,category:'post_workout',tags:['tayyibat','poisson','légumes','sèche','post_workout'],image:'🐟',
    ingredients:[{name:'Poisson sauvage entier',quantity:'400g'},{name:'Pommes de terre',quantity:'2'},{name:'Oignon',quantity:'1'},{name:'Tomate pelée épépinée',quantity:'1'},{name:'Thym',quantity:'1 c.à.c'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Précuis les pommes de terre en tranches 10 min.",'Dispose dans un plat avec oignon, tomate et thym.',"Pose le poisson dessus, arrose d'huile, sale et cuis 200°C 20 min."],substitutions:["Filets de poisson si pas de poisson entier."],
  },
  {id:'t49',name:"Salade Poivron Tomate Cuite",kcal:200,protein:4,carbs:24,fat:10,fiber:5,difficulty:'easy',budget:'low',prepTime:20,category:'lunch',tags:['tayyibat', 'légumes', 'sèche'],image:'🫑',
    ingredients:[{name:'Poivrons rouges',quantity:'2'},{name:'Tomates pelées épépinées',quantity:'3'},{name:'Oignon',quantity:'1'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'},{name:'Thym',quantity:'1 c.à.c'}],
    steps:["Rôtis les poivrons au four 200°C 20 min, pèle et coupe.",'Cuis les tomates avec oignon à la poêle 10 min.','Mélange tout avec huile, thym et sel.'],substitutions:["Poivron vert à la place du rouge."],
  },
  {id:'t50',name:"Rôti de Bœuf Four Simple",kcal:440,protein:46,carbs:4,fat:24,fiber:1,difficulty:'easy',budget:'medium',prepTime:40,category:'dinner',tags:['tayyibat', 'bœuf', 'sèche'],image:'🥩',
    ingredients:[{name:'Rôti de bœuf',quantity:'350g'},{name:'Oignon',quantity:'2'},{name:'Thym',quantity:'1 c.à.s'},{name:"Huile d'olive",quantity:'2 c.à.s'},{name:'Sel',quantity:'à goût'}],
    steps:["Badigeonne le rôti d'huile, thym et sel.","Dispose sur un lit d'oignons en rondelles.",'Rôtis au four 200°C 30 min. Repose 5 min avant de trancher.'],substitutions:["Gigot d'agneau à la place du rôti de bœuf."],
  },
];

export const RECIPE_CATEGORIES = [
  { id: 'all', label: '🍽️ Tout', count: RECIPES.length },
  { id: 'prise-masse', label: '💪 Prise masse', count: RECIPES.filter(r => r.tags.includes('prise-masse')).length },
  { id: 'sèche', label: '🔥 Sèche', count: RECIPES.filter(r => r.tags.includes('sèche')).length },
  { id: 'breakfast', label: '🌅 Petit-déj', count: RECIPES.filter(r => r.category === 'breakfast').length },
  { id: 'lunch', label: '☀️ Déjeuner', count: RECIPES.filter(r => r.category === 'lunch').length },
  { id: 'dinner', label: '🌙 Dîner', count: RECIPES.filter(r => r.category === 'dinner').length },
  { id: 'snack', label: '🍎 Snack', count: RECIPES.filter(r => r.category === 'snack').length },
  { id: 'pre_workout', label: '⚡ Pré-training', count: RECIPES.filter(r => r.category === 'pre_workout').length },
  { id: 'post_workout', label: '💪 Post-training', count: RECIPES.filter(r => r.category === 'post_workout').length },
  { id: 'tayyibat', label: '🌿 Tayibat', count: RECIPES.filter(r => r.tags.includes('tayyibat')).length },
];

// Allergy and diet ingredient mappings
const FISH_WORDS = ['saumon','thon','cabillaud','crevette','poisson','sardine','truite','dorade','bar','moule','surimi','fruits de mer','anchois','maquereau','colin'];
const MEAT_WORDS = ['poulet','bœuf','boeuf','dinde','veau','agneau','canard','viande','steak','haché','escalope','cuisse','magret'];
// Aliments interdits régime Tayibat
const TAYIBAT_FORBIDDEN = ['poulet','dinde','canard','escalope','cuisse','blanc de poulet','filet de poulet','œuf','oeuf','oeufs','œufs','blanc d\'œuf','lait','fromage','crème fraîche','beurre','mozzarella','parmesan','feta','chèvre','ricotta','emmental','cream cheese','cottage','skyr','whey','lait d\'amande','lait de coco','farine blanche','pain blanc','pâte','spaghetti','tagliatelle','penne','fusilli','macaroni','linguine'];
const DAIRY_WORDS = ['lait','fromage','yaourt','crème','beurre','mozzarella','parmesan','feta','chèvre','ricotta','emmental','cream cheese','cottage','skyr','whey'];
const EGG_WORDS = ['œuf','oeuf','oeufs','œufs','blanc d\'œuf'];
const NUT_WORDS = ['amande','noix','noisette','cacahuète','cajou','pistache','beurre de cacahuète','beurre d\'amande'];
const GLUTEN_WORDS = ['pâte','pain','tortilla','farine','semoule','couscous','boulgour','flocons d\'avoine','avoine','wrap','muffin','crêpe','pancake','baguette','biscuit'];
const CRUSTACEAN_WORDS = ['crevette','moule','crustacé','fruits de mer'];
const SOY_WORDS = ['soja','tofu','tempeh','edamame','sauce soja'];
const SESAME_WORDS = ['sésame','tahini'];
const PEANUT_WORDS = ['cacahuète','arachide','beurre de cacahuète'];

function hasIngredient(recipe: Recipe, words: string[]): boolean {
  const ingredients = recipe.ingredients.map(i => i.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  return ingredients.some(ing => words.some(w => ing.includes(w)));
}

export function searchRecipes(query: string, category?: string, dietaryPrefs?: string[], allergies?: string[]): Recipe[] {
  let results = RECIPES;
  if (category && category !== 'all') {
    if (category === 'prise-masse' || category === 'sèche' || category === 'tayyibat') {
      results = results.filter(r => r.tags.includes(category));
    } else {
      results = results.filter(r => r.category === category);
    }
  }

  // Dietary preferences filtering
  if (dietaryPrefs && dietaryPrefs.length > 0) {
    if (dietaryPrefs.includes('vegan')) {
      results = results.filter(r => !hasIngredient(r, [...MEAT_WORDS, ...FISH_WORDS, ...DAIRY_WORDS, ...EGG_WORDS]));
    } else if (dietaryPrefs.includes('vegetarian')) {
      results = results.filter(r => !hasIngredient(r, [...MEAT_WORDS, ...FISH_WORDS]));
    }
    if (dietaryPrefs.includes('lactose_free')) {
      results = results.filter(r => !hasIngredient(r, DAIRY_WORDS));
    }
    if (dietaryPrefs.includes('gluten_free')) {
      results = results.filter(r => !hasIngredient(r, GLUTEN_WORDS));
    }
    if (dietaryPrefs.includes('tayyibat')) {
      results = results.filter(r => r.tags.includes('tayyibat'));
    }
  }

  // Allergy filtering
  if (allergies && allergies.length > 0) {
    const allergyMap: Record<string, string[]> = {
      'Poisson': FISH_WORDS,
      'Crustacés': CRUSTACEAN_WORDS,
      'Œufs': EGG_WORDS,
      'Lait': DAIRY_WORDS,
      'Fruits à coque': NUT_WORDS,
      'Arachides': PEANUT_WORDS,
      'Soja': SOY_WORDS,
      'Sésame': SESAME_WORDS,
    };
    for (const allergy of allergies) {
      const words = allergyMap[allergy];
      if (words) {
        results = results.filter(r => !hasIngredient(r, words));
      }
    }
  }

  if (query.trim()) {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const words = q.split(/\s+/);
    results = results.filter(r => {
      const text = (r.name + ' ' + r.tags.join(' ') + ' ' + r.ingredients.map(i => i.name).join(' '))
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return words.every(w => text.includes(w));
    });
  }
  return results;
}
