import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

type ShareImageType = 'day' | 'transformation' | 'workout' | 'dashboard';

interface DayData {
  name: string;
  kcal: number;
  goal: number;
  protein: number;
  carbs: number;
  fat: number;
  streak: number;
}

interface TransformationData {
  name: string;
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  diff: number;
  weeks: number;
}

interface WorkoutData {
  name: string;
  duration: number;
  calories: number;
  exercises: number;
  streak: number;
}

interface DashboardData {
  name: string;
  streak: number;
  weekSessions: number;
  sessionsGoal: number;
  kcal: number;
  kcalGoal: number;
  protein: number;
  hydration: number; // 0-100
  sleepScore: number; // 0-100
  dailyScore: number; // 0-100
  level: number;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBase(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0A0A0F');
  bg.addColorStop(1, '#12121A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Glow
  const glow = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, w * 0.6);
  glow.addColorStop(0, 'rgba(255,107,53,0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

function drawLogo(ctx: CanvasRenderingContext2D, w: number) {
  ctx.font = 'bold 18px sans-serif';
  const grad = ctx.createLinearGradient(0, 0, 120, 0);
  grad.addColorStop(0, '#FF2D55');
  grad.addColorStop(1, '#FF6B35');
  ctx.fillStyle = grad;
  ctx.fillText('CaliBodi', w / 2 - 38, 36);
}

function macroBox(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, value: string, color: string) {
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  roundRect(ctx, x, y, 110, 64, 14);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(value, x + 55 - ctx.measureText(value).width / 2, y + 36);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px sans-serif';
  ctx.fillText(label, x + 55 - ctx.measureText(label).width / 2, y + 54);
}

export async function generateAndShareImage(type: ShareImageType, data: DayData | TransformationData | WorkoutData | DashboardData) {
  const W = 480;
  const H = type === 'dashboard' ? 860 : 640;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  drawBase(ctx, W, H);

  // Border
  ctx.strokeStyle = 'rgba(255,107,53,0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, 1, 1, W - 2, H - 2, 24);
  ctx.stroke();

  if (type !== 'dashboard') drawLogo(ctx, W);

  if (type === 'day') {
    const d = data as DayData;
    const pct = Math.min(100, Math.round((d.kcal / d.goal) * 100));

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif';
    const title = `Journée de ${d.name || 'CaliBodi'}`;
    ctx.fillText(title, W / 2 - ctx.measureText(title).width / 2, 100);

    // Big kcal
    ctx.font = 'bold 72px sans-serif';
    const kGrad = ctx.createLinearGradient(0, 0, W, 0);
    kGrad.addColorStop(0, '#FF2D55');
    kGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = kGrad;
    const kcalStr = `${d.kcal}`;
    ctx.fillText(kcalStr, W / 2 - ctx.measureText(kcalStr).width / 2, 210);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '18px sans-serif';
    ctx.fillText('kcal', W / 2 + ctx.measureText(kcalStr).width / 2 - 30, 195);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '15px sans-serif';
    const goalStr = `Objectif : ${d.goal} kcal`;
    ctx.fillText(goalStr, W / 2 - ctx.measureText(goalStr).width / 2, 240);

    // Progress bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 40, 260, W - 80, 12, 6);
    ctx.fill();
    const barGrad = ctx.createLinearGradient(40, 0, 40 + (W - 80) * (pct / 100), 0);
    barGrad.addColorStop(0, '#FF2D55');
    barGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = barGrad;
    roundRect(ctx, 40, 260, Math.max(12, (W - 80) * (pct / 100)), 12, 6);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${pct}% de l'objectif`, W / 2 - 50, 292);

    // Macros
    macroBox(ctx, 30, 320, 'Protéines', `${d.protein}g`, '#FF2D55');
    macroBox(ctx, 185 - 55, 320, 'Glucides', `${d.carbs}g`, '#00D4FF');
    macroBox(ctx, 340, 320, 'Lipides', `${d.fat}g`, '#FF6B35');

    // Streak
    if (d.streak > 0) {
      ctx.fillStyle = 'rgba(255,107,53,0.1)';
      roundRect(ctx, W / 2 - 80, 410, 160, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 16px sans-serif';
      const streakStr = `🔥 ${d.streak} jours consécutifs`;
      ctx.fillText(streakStr, W / 2 - ctx.measureText(streakStr).width / 2, 437);
    }

    // Slogan défi
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'italic bold 17px sans-serif';
    const slogan = '"Chaque calorie compte. Chaque jour aussi."';
    ctx.fillText(slogan, W / 2 - ctx.measureText(slogan).width / 2, 490);
    ctx.fillStyle = 'rgba(255,107,53,0.7)';
    ctx.font = '13px sans-serif';
    const cta = '→ Rejoins CaliBodi — Coach Fitness IA';
    ctx.fillText(cta, W / 2 - ctx.measureText(cta).width / 2, 514);

  } else if (type === 'transformation') {
    const d = data as TransformationData;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 26px sans-serif';
    const t = 'Ma Transformation';
    ctx.fillText(t, W / 2 - ctx.measureText(t).width / 2, 100);

    if (d.name) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '16px sans-serif';
      ctx.fillText(d.name, W / 2 - ctx.measureText(d.name).width / 2, 126);
    }

    // Boxes
    const boxY = 170;
    [
      { label: 'Départ', value: `${d.startWeight} kg`, color: 'rgba(255,255,255,0.4)', x: 30 },
      { label: 'Aujourd\'hui', value: `${d.currentWeight} kg`, color: '#FF6B35', x: 175 },
      { label: 'Objectif', value: `${d.targetWeight} kg`, color: '#00FF87', x: 320 },
    ].forEach(({ label, value, color, x }) => {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      roundRect(ctx, x, boxY, 130, 90, 16);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(value, x + 65 - ctx.measureText(value).width / 2, boxY + 48);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '13px sans-serif';
      ctx.fillText(label, x + 65 - ctx.measureText(label).width / 2, boxY + 72);
    });

    // Diff
    const absDiff = Math.abs(d.diff);
    if (absDiff > 0) {
      const diffColor = d.diff < 0 ? '#00FF87' : '#FF6B35';
      ctx.fillStyle = diffColor;
      ctx.font = 'bold 52px sans-serif';
      const diffStr = `${d.diff < 0 ? '-' : '+'}${absDiff} kg`;
      ctx.fillText(diffStr, W / 2 - ctx.measureText(diffStr).width / 2, 350);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '15px sans-serif';
      const sub = d.diff < 0 ? 'perdus' : 'gagnés';
      ctx.fillText(sub, W / 2 - ctx.measureText(sub).width / 2, 376);
    }

    if (d.weeks > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '14px sans-serif';
      const wStr = `En ${d.weeks} semaine${d.weeks > 1 ? 's' : ''}`;
      ctx.fillText(wStr, W / 2 - ctx.measureText(wStr).width / 2, 410);
    }

    // Slogan défi transformation
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'italic bold 17px sans-serif';
    const sloganT = '"Et toi, tu commences quand ?"';
    ctx.fillText(sloganT, W / 2 - ctx.measureText(sloganT).width / 2, 470);
    ctx.fillStyle = 'rgba(255,107,53,0.7)';
    ctx.font = '13px sans-serif';
    const ctaT = '→ Rejoins CaliBodi — Coach Fitness IA';
    ctx.fillText(ctaT, W / 2 - ctx.measureText(ctaT).width / 2, 494);

  } else if (type === 'workout') {
    const d = data as WorkoutData;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif';
    const t = '💪 Séance terminée !';
    ctx.fillText(t, W / 2 - ctx.measureText(t).width / 2, 110);

    if (d.name) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '15px sans-serif';
      ctx.fillText(d.name, W / 2 - ctx.measureText(d.name).width / 2, 136);
    }

    [
      { label: 'Durée', value: `${d.duration} min`, color: '#00D4FF', x: 30 },
      { label: 'Calories', value: `${d.calories}`, color: '#FF6B35', x: 175 },
      { label: 'Exercices', value: `${d.exercises}`, color: '#FF2D55', x: 320 },
    ].forEach(({ label, value, color, x }) => {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      roundRect(ctx, x, 180, 130, 90, 16);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(value, x + 65 - ctx.measureText(value).width / 2, 230);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '13px sans-serif';
      ctx.fillText(label, x + 65 - ctx.measureText(label).width / 2, 256);
    });

    if (d.streak > 0) {
      ctx.fillStyle = 'rgba(255,107,53,0.1)';
      roundRect(ctx, W / 2 - 100, 310, 200, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 16px sans-serif';
      const s = `🔥 ${d.streak} jours consécutifs`;
      ctx.fillText(s, W / 2 - ctx.measureText(s).width / 2, 337);
    }

    // Slogan défi séance
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'italic bold 17px sans-serif';
    const sloganW = '"Je viens de terminer. Toi tu fais quoi ?"';
    ctx.fillText(sloganW, W / 2 - ctx.measureText(sloganW).width / 2, 400);
    ctx.fillStyle = 'rgba(255,107,53,0.7)';
    ctx.font = '13px sans-serif';
    const ctaW = '→ Rejoins CaliBodi — Coach Fitness IA';
    ctx.fillText(ctaW, W / 2 - ctx.measureText(ctaW).width / 2, 424);
  }

  if (type === 'dashboard') {
    const d = data as DashboardData;
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    // Header gradient strip
    const hGrad = ctx.createLinearGradient(0, 0, W, 0);
    hGrad.addColorStop(0, '#FF2D55');
    hGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = hGrad;
    roundRect(ctx, 0, 0, W, 6, 0);
    ctx.fill();

    // Logo
    ctx.font = 'bold 22px sans-serif';
    const logoGrad = ctx.createLinearGradient(0, 0, 160, 0);
    logoGrad.addColorStop(0, '#FF2D55');
    logoGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = logoGrad;
    ctx.fillText('CaliBodi', W / 2 - ctx.measureText('CaliBodi').width / 2, 46);

    // Subtitle date
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '13px sans-serif';
    const cap = today.charAt(0).toUpperCase() + today.slice(1);
    ctx.fillText(cap, W / 2 - ctx.measureText(cap).width / 2, 68);

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    const nameStr = d.name ? `${d.name}'s day` : 'Ma journée';
    ctx.fillText(nameStr, W / 2 - ctx.measureText(nameStr).width / 2, 110);

    // Daily score circle
    const cx = W / 2, cy = 185, r = 60;
    // Background circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 10;
    ctx.stroke();
    // Score arc
    const scoreAngle = (d.dailyScore / 100) * Math.PI * 2;
    const arcGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    arcGrad.addColorStop(0, '#FF2D55');
    arcGrad.addColorStop(1, '#FF6B35');
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
    ctx.strokeStyle = arcGrad;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
    // Score text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`${d.dailyScore}`, cx - ctx.measureText(`${d.dailyScore}`).width / 2, cy + 12);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '13px sans-serif';
    ctx.fillText('score', cx - ctx.measureText('score').width / 2, cy + 30);

    // 4 pillar cards — 2x2 grid
    const pillars = [
      { emoji: '🏋️', label: 'Sport', value: `${d.weekSessions}/${d.sessionsGoal}`, sub: 'séances / semaine', color: '#FF6B35', pct: Math.min(100, (d.weekSessions / Math.max(1, d.sessionsGoal)) * 100) },
      { emoji: '🍽️', label: 'Nutrition', value: `${d.kcal}`, sub: `/ ${d.kcalGoal} kcal`, color: '#30D158', pct: Math.min(100, (d.kcal / Math.max(1, d.kcalGoal)) * 100) },
      { emoji: '💧', label: 'Hydratation', value: `${d.hydration}%`, sub: 'objectif eau', color: '#0A84FF', pct: d.hydration },
      { emoji: '😴', label: 'Sommeil', value: `${d.sleepScore}%`, sub: 'score récup', color: '#BF5AF2', pct: d.sleepScore },
    ];

    const cardW = 200, cardH = 110, gap = 20;
    const gridX = (W - (cardW * 2 + gap)) / 2;
    const gridY = 270;

    pillars.forEach((p, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = gridX + col * (cardW + gap);
      const y = gridY + row * (cardH + gap);

      // Card background
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      roundRect(ctx, x, y, cardW, cardH, 18);
      ctx.fill();

      // Left accent bar
      ctx.fillStyle = p.color;
      roundRect(ctx, x, y, 4, cardH, 4);
      ctx.fill();

      // Emoji
      ctx.font = '26px sans-serif';
      ctx.fillText(p.emoji, x + 18, y + 38);

      // Value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(p.value, x + 18, y + 68);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '12px sans-serif';
      ctx.fillText(p.sub, x + 18, y + 86);

      // Progress bar
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      roundRect(ctx, x + 14, y + cardH - 16, cardW - 28, 6, 3);
      ctx.fill();
      ctx.fillStyle = p.color;
      roundRect(ctx, x + 14, y + cardH - 16, Math.max(6, (cardW - 28) * (p.pct / 100)), 6, 3);
      ctx.fill();
    });

    // Streak badge
    const streakY = gridY + 2 * (cardH + gap) + 24;
    ctx.fillStyle = 'rgba(255,107,53,0.12)';
    roundRect(ctx, W / 2 - 120, streakY, 240, 50, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,107,53,0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, W / 2 - 120, streakY, 240, 50, 25);
    ctx.stroke();
    const streakText = `🔥 ${d.streak} jours de streak`;
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(streakText, W / 2 - ctx.measureText(streakText).width / 2, streakY + 32);

    // Level badge
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, W / 2 - 60, streakY + 66, 120, 36, 18);
    ctx.fill();
    const lvlText = `⭐ Niveau ${d.level}`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(lvlText, W / 2 - ctx.measureText(lvlText).width / 2, streakY + 89);

    // Slogan
    const sloganY = streakY + 130;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = 'italic bold 16px sans-serif';
    const slogan = '"Mon coach IA suit tout. Chaque jour."';
    ctx.fillText(slogan, W / 2 - ctx.measureText(slogan).width / 2, sloganY);

    // CTA
    const ctaGrad = ctx.createLinearGradient(W / 2 - 140, 0, W / 2 + 140, 0);
    ctaGrad.addColorStop(0, '#FF2D55');
    ctaGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = ctaGrad;
    roundRect(ctx, W / 2 - 140, sloganY + 18, 280, 46, 23);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    const ctaText = '📲 Télécharge CaliBodi gratuitement';
    ctx.fillText(ctaText, W / 2 - ctx.measureText(ctaText).width / 2, sloganY + 47);

    // Hashtags
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '12px sans-serif';
    const tags = '#CaliBodi #CoachIA #Fitness #Nutrition #Streak';
    ctx.fillText(tags, W / 2 - ctx.measureText(tags).width / 2, H - 18);

    // Skip bottom tag below
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    const fileName = `calibodi-share-${Date.now()}.png`;
    await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
    const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
    await Share.share({
      files: [uri],
      title: 'CaliBodi — Mon bilan du jour',
      text: [
        `🏋️ Je suis mon entraînement, ma nutrition, mon sommeil et mon hydratation avec CaliBodi.`,
        ``,
        `📲 Télécharge l'app gratuitement : https://calibodi.com/telecharger/`,
        `📋 Crée ton plan personnalisé : https://calibodi.com/plan.html`,
        `🌐 Découvre CaliBodi : https://calibodi.com/`,
      ].join('\n'),
    });
    setTimeout(() => Filesystem.deleteFile({ path: fileName, directory: Directory.Cache }).catch(() => null), 5000);
    return;
  }

  // Bottom tag
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '13px sans-serif';
  ctx.fillText('#CaliBodi #Fitness #CoachIA', W / 2 - 95, H - 24);

  // Export & share
  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const fileName = `calibodi-share-${Date.now()}.png`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
  });

  const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });

  await Share.share({ files: [uri] });

  // Cleanup after a delay
  setTimeout(() => Filesystem.deleteFile({ path: fileName, directory: Directory.Cache }).catch(() => null), 5000);
}
