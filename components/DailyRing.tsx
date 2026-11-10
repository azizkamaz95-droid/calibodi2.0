'use client';

interface RingProps {
  movement: number;  // 0-100
  nutrition: number;
  recovery: number;
  score: number;
  dayMode: string;
}

export default function DailyRing({ movement, nutrition, recovery, score, dayMode }: RingProps) {
  const r1 = 48, r2 = 40, r3 = 32;
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;
  const c3 = 2 * Math.PI * r3;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 120 120" className="transform -rotate-90">
        {/* Background rings */}
        <circle cx="60" cy="60" r={r1} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="60" cy="60" r={r2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="60" cy="60" r={r3} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        {/* Movement ring (orange) */}
        <circle
          cx="60" cy="60" r={r1}
          fill="none" stroke="#FF6B35" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c1}
          strokeDashoffset={c1 * (1 - movement / 100)}
          className="transition-all duration-1000 ease-out"
          style={{ filter: 'drop-shadow(0 0 4px #FF6B35)' }}
        />
        {/* Nutrition ring (green neon) */}
        <circle
          cx="60" cy="60" r={r2}
          fill="none" stroke="#00FF87" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c2}
          strokeDashoffset={c2 * (1 - nutrition / 100)}
          className="transition-all duration-1000 ease-out delay-200"
          style={{ filter: 'drop-shadow(0 0 4px #00FF87)' }}
        />
        {/* Recovery ring (purple) */}
        <circle
          cx="60" cy="60" r={r3}
          fill="none" stroke="#BF5AF2" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c3}
          strokeDashoffset={c3 * (1 - recovery / 100)}
          className="transition-all duration-1000 ease-out delay-400"
          style={{ filter: 'drop-shadow(0 0 4px #BF5AF2)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-black text-white">{score}</span>
        <span className="text-[10px] text-gray-400 font-medium mt-0.5">{dayMode}</span>
      </div>
    </div>
  );
}
