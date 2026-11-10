'use client';
import { Share2 } from 'lucide-react';
import { generateAndShareImage } from '@/lib/shareImageGenerator';
import { Share } from '@capacitor/share';
import { useGameStore } from '@/lib/gameStore';

interface ShareCardProps {
  type: 'day' | 'transformation' | 'streak' | 'workout' | 'dashboard';
  data: Record<string, string | number>;
}

const IMAGE_TYPES: ShareCardProps['type'][] = ['day', 'transformation', 'workout', 'dashboard'];

function buildText(type: ShareCardProps['type'], data: Record<string, string | number>): string {
  switch (type) {
    case 'streak':
      return [
        `⚡ ${data.streak} jours consécutifs sur CaliBodi !`,
        ``,
        `🔥 La régularité, c'est la clé du succès.`,
        `💪 Entraînement + Nutrition + Récupération`,
        ``,
        `📱 CaliBodi — Coach Fitness IA`,
        `#CaliBodi #Streak #Discipline #Fitness`,
      ].join('\n');
    default:
      return '';
  }
}

export async function shareContent(type: ShareCardProps['type'], data: Record<string, string | number>) {
  useGameStore.getState().markShared();
  if (IMAGE_TYPES.includes(type)) {
    try {
      await generateAndShareImage(type as 'day' | 'transformation' | 'workout', data as never);
      return;
    } catch {
      // fallback texte si image échoue
    }
  }

  const text = buildText(type, data);
  try {
    await Share.share({ text });
  } catch {
    if (navigator.share) {
      await navigator.share({ text }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(text).catch(() => null);
    }
  }
}

export default function ShareButton({
  type,
  data,
  label,
  className,
}: ShareCardProps & { label?: string; className?: string }) {
  return (
    <button
      onClick={() => shareContent(type, data)}
      className={className ?? 'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cali-surface border border-white/10 text-sm font-bold text-white active:scale-95 transition-all'}
    >
      <Share2 size={15} className="text-cali-blue" />
      {label ?? 'Partager'}
    </button>
  );
}
