# CaliBodi — Claude Code Context

## Projet
Application fitness Android (APK) + site web marketing.
- **App** : Next.js 14 + Capacitor 6 → APK Android
- **Site** : HTML statique sur calibodi.com
- **Backend** : Netlify Functions (serverless)
- **Auth/DB** : Firebase
- **Déploiement APK** : GitHub Actions → `android/app/build/outputs/apk/release/app-release.apk`

## Stack technique
- Next.js 14 App Router, TypeScript strict
- Capacitor 6 (`androidScheme: 'https'`, `webDir: 'out'`)
- `output: 'export'` uniquement quand `BUILD_TARGET=apk` (voir `next.config.js`)
- Tailwind CSS avec design system custom (couleurs `cali-*`)
- Zustand pour le state management (avec `persist` middleware → localStorage)
- Netlify Functions dans `netlify/functions/`

## Architecture
```
app/                    # Pages Next.js App Router
  dashboard/page.tsx    # Dashboard principal
  nutrition/page.tsx    # Suivi nutrition + scan
  fitness/page.tsx      # Programme fitness
  session/page.tsx      # Séance en cours
  progress/page.tsx     # Progression / poids
  profile/page.tsx      # Profil utilisateur
  sleep/page.tsx        # Suivi sommeil
  hydration/page.tsx    # Suivi hydratation

components/             # Composants réutilisables
  PhotoFoodScanner.tsx  # Scan photo IA multi-aliments
  BarcodeScanner.tsx    # Scanner code-barres
  RecipeModal.tsx       # Modal recette + liste de courses
  ShoppingList.tsx      # Liste de courses
  ShareCard.tsx         # Partage réseaux sociaux (texte)
  BottomNav.tsx         # Navigation bas d'écran

lib/                    # Stores et utilitaires
  nutritionStore.ts     # Repas du jour, recettes, objectifs
  userStore.ts          # Profil, streak, historique poids
  ciqualDatabase.ts     # Base CIQUAL 3200 aliments français
  shoppingListStore.ts  # Liste de courses (persist)
  shareImageGenerator.ts # Génération image pour partage social
  recipes.ts            # 300+ recettes avec macros

netlify/functions/
  analyze-food.ts       # API Claude Haiku → détection multi-aliments
```

## Fonctionnalités clés
- **Scan photo IA** : photo → Claude Haiku détecte TOUS les aliments → CIQUAL → Open Food Facts → estimation IA
- **Scanner code-barres** : Open Food Facts 3M+ produits + CIQUAL
- **300+ recettes** avec macros, liste de courses automatique
- **Liste de courses** : depuis recettes ou manuel, cochage, partage WhatsApp
- **Partage social** : images générées canvas (résultats jour, transformation, séance)
- **Coach vocal Calix** : TTS, coaching pendant séances
- **Suivi** : poids, IMC, TDEE, calories, macros, hydratation, sommeil, streak

## Règles importantes
- **Ne jamais pusher** sans token GitHub fourni par l'utilisateur (révoqué juste après)
- **Ne jamais mettre les clés API dans le code** — uniquement dans les variables d'environnement Netlify
- `ANTHROPIC_API_KEY` → Netlify env vars
- Firebase config → variables d'environnement
- Tester `npx tsc --noEmit` avant chaque push
- L'APK charge les assets depuis le bundle (pas de serveur) → API calls vers Netlify Functions

## URLs importantes
- App Netlify : `https://dapper-truffle-6871a6.netlify.app`
- Fonction analyze-food : `https://dapper-truffle-6871a6.netlify.app/.netlify/functions/analyze-food`
- Repo GitHub : `https://github.com/azizkamaz95-droid/clibodi-v6`
- Branch principale : `main`

## Design system
- Fond : `#0A0A0F` (cali-dark)
- Cards : `cali-card`, `cali-surface`
- Couleurs : `cali-orange` (#FF6B35), `cali-red` (#FF2D55), `cali-blue`, `cali-green`
- Font display : `font-display` (Outfit)
- Modals : `fixed inset-0 z-[200] flex items-end`, `rounded-t-3xl animate-slide-up`

## Packages Capacitor installés
- `@capacitor/core@^6`, `@capacitor/android@^6`
- `@capacitor/camera`, `@capacitor/share@^6`, `@capacitor/filesystem@^6`
- `@capacitor/preferences`, `@capacitor/local-notifications`
- `@capacitor-community/text-to-speech`

## Workflow de développement
1. Modifier le code localement
2. `npx tsc --noEmit` pour vérifier
3. `git add + commit`
4. Demander un token GitHub à l'utilisateur
5. `git push origin main`
6. Netlify redéploie automatiquement les fonctions
7. GitHub Actions build le nouvel APK
