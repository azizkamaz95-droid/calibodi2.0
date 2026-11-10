'use client';

interface PageBackgroundProps {
  image: 'dashboard' | 'training' | 'nutrition' | 'sleep' | 'profile';
}

export default function PageBackground({ image }: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <img
        src={`/bg/${image}.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover grayscale"
        style={{ opacity: 0.9 }}
        aria-hidden="true"
      />
      {/* Subtle top/bottom fade to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-cali-dark/50 via-transparent to-cali-dark/50" />
    </div>
  );
}
