'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useCalix } from '@/lib/useCalix';
import { useCalixStore } from '@/lib/calixStore';

interface Props {
  onClose: () => void;
  initialMessage?: string;
}

export default function CalixChat({ onClose, initialMessage }: Props) {
  const [input, setInput] = useState('');
  const { ask, isLoading, speak } = useCalix();
  const history = useCalixStore((s) => s.history);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('calix_muted') === '1'; } catch { return false; }
  });

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [history]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try { localStorage.setItem('calix_muted', next ? '1' : '0'); } catch {}
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    setInput('');
    await ask(msg, { silent: muted });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestions = [
    'Comment améliorer mon sommeil ?',
    'Qu\'est-ce que je mange ce soir ?',
    'Motive-moi pour ma séance',
    'Analyse ma journée',
  ];

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: '#0A0A0F' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        {/* Calix orb */}
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f18 100%)', border: '1.5px solid rgba(255,107,53,0.4)', boxShadow: '0 0 16px rgba(255,107,53,0.3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="#FF6B35" opacity="0.9" />
            <circle cx="12" cy="12" r="6" stroke="#FF6B35" strokeWidth="1" opacity="0.4" />
            <circle cx="12" cy="12" r="9" stroke="#FF2D55" strokeWidth="0.5" opacity="0.2" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-black tracking-widest uppercase text-cali-orange">Calix</p>
          <p className="text-xs text-gray-500">Coach IA personnel</p>
        </div>
        <button onClick={toggleMute}
          className="w-8 h-8 rounded-xl flex items-center justify-center mr-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {muted ? <VolumeX size={14} className="text-gray-600" /> : <Volume2 size={14} className="text-gray-400" />}
        </button>
        <button onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-8">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)', boxShadow: '0 0 32px rgba(255,107,53,0.3)' }}>
              <Sparkles size={28} className="text-white" />
            </div>
            <p className="text-white font-display font-bold text-xl">Parle-moi</p>
            <p className="text-gray-500 text-sm text-center px-8">Je connais tes données. Pose-moi n&apos;importe quelle question sur ta nutrition, ta forme ou ta récupération.</p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f0f18)', border: '1px solid rgba(255,107,53,0.3)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" fill="#FF6B35" />
                  <circle cx="12" cy="12" r="8" stroke="#FF6B35" strokeWidth="1.5" opacity="0.4" />
                </svg>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              msg.role === 'user'
                ? 'rounded-tr-sm text-white text-sm'
                : 'rounded-tl-sm text-gray-200 text-sm'
            }`}
              style={msg.role === 'user'
                ? { background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
            {msg.role === 'assistant' && !muted && (
              <button onClick={() => speak(msg.content)}
                className="self-end mb-0.5 opacity-40 hover:opacity-100 transition-opacity">
                <Volume2 size={12} className="text-gray-400" />
              </button>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f0f18)', border: '1px solid rgba(255,107,53,0.3)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#FF6B35" />
              </svg>
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-cali-orange"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (si historique vide) */}
      {history.length === 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {suggestions.map((s) => (
            <button key={s} onClick={() => setInput(s)}
              className="flex-shrink-0 text-xs px-3 py-2 rounded-xl whitespace-nowrap"
              style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', color: '#FF6B35' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2">
        <div className="flex gap-2 items-end rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Demande quelque chose à Calix..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF2D55)' }}>
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
