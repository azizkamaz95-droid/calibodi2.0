'use client';

import { Shield, Eye, Database, Share2 } from 'lucide-react';

export default function PrivacyBadge() {
  return (
    <div className="mx-4 mt-3 mb-2 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-content-center shrink-0 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Données privées</p>
          <p className="text-xs text-gray-400">Stockage local uniquement</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-gray-400 text-center leading-tight">On ne voit<br/>rien</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-gray-400 text-center leading-tight">On ne stocke<br/>rien</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-gray-400 text-center leading-tight">On ne revend<br/>rien</span>
        </div>
      </div>
    </div>
  );
}
