# CaliBodi v4 — Application Fitness Intelligente

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en dev
npm run dev

# 3. Build pour production (static export)
npm run build
```

## 📱 Build Android (APK)

```bash
# Build Next.js
npm run build

# Ajouter la plateforme Android
npx cap add android

# Synchroniser
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android

# Ou build direct en CLI
cd android && ./gradlew assembleDebug
```

L'APK se trouvera dans `android/app/build/outputs/apk/debug/app-debug.apk`

## 🌐 Déploiement Netlify

Le projet est configuré pour Netlify via `netlify.toml` :

```bash
# Build automatique
npm run build
# Le dossier `out/` est servi
```

Ou connecter le repo GitHub directement sur Netlify.

**Site:** `calibodi-v3-test.netlify.app`

## 🏗️ Stack technique

- **Framework:** Next.js 14 (Static Export)
- **Language:** TypeScript
- **State:** Zustand (persist localStorage)
- **Mobile:** Capacitor 6
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Style:** Tailwind CSS + Framer Motion
- **Son:** Web Audio API (synthèse)
- **Vibration:** Navigator.vibrate API

## 📂 Structure

```
calibodi-final/
├── app/              # Pages Next.js
│   ├── onboarding/   # 7 étapes d'inscription
│   ├── dashboard/    # Hub principal
│   ├── fitness/      # Sélection mode + preview séance
│   ├── session/      # Séance active (timer, son, vibration)
│   ├── nutrition/    # Repas, recettes, macros
│   ├── hydration/    # Suivi eau
│   ├── sleep/        # Sommeil + récupération
│   ├── progress/     # Badges, historique, stats
│   ├── profile/      # Profil + blessures + settings
│   └── premium/      # Paywall 3 plans
├── components/       # Composants réutilisables
├── lib/              # Stores Zustand + logique métier
├── services/         # Audio, vibration, notifications
└── public/           # Assets statiques
```

## ✨ Fonctionnalités clés

- **Onboarding 7 étapes** avec sélection de blessures
- **5 modes de séance** : Normal, Voyage, Fatigue, Express, Cycle
- **Connexions inter-modules** : Sommeil → Séance, Séance → Eau
- **10 recettes complètes** avec étapes, ingrédients, badges
- **18 badges** de gamification
- **Score quotidien 0-100** multi-facteurs
- **Son réel** via Web Audio API (pas de fichiers)
- **Vibration réelle** via Navigator API
- **Coach IA Calix** adaptatif
