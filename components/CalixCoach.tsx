'use client';
import { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';

interface CalixProps {
  message: string;
  type?: 'info' | 'warning' | 'success' | 'motivation';
  dismissible?: boolean;
}

export default function CalixCoach({ message, type = 'info', dismissible = true }: CalixProps) {
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  if (!visible) return null;

  const borderColor = {
    info: 'border-cali-blue/40',
    warning: 'border-cali-orange/40',
    success: 'border-cali-green/40',
    motivation: 'border-cali-purple/40',
  }[type];

  const bgGlow = {
    info: 'bg-cali-blue/5',
    warning: 'bg-cali-orange/5',
    success: 'bg-cali-green/5',
    motivation: 'bg-cali-purple/5',
  }[type];

  const iconColor = {
    info: 'text-cali-blue',
    warning: 'text-cali-orange',
    success: 'text-cali-green',
    motivation: 'text-cali-purple',
  }[type];

  return (
    <div
      className={`relative rounded-3xl border ${borderColor} ${bgGlow} p-4 transition-all duration-500 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl bg-cali-surface flex items-center justify-center ${iconColor}`}>
          <Bot size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-cali-blue mb-1 font-display tracking-wide">CALIX</p>
          <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => setVisible(false)}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
