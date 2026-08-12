import React from 'react';
import { Radio, Users, Sparkles, MessageCircle, HeartHandshake, Eye } from 'lucide-react';
import { PayooLiveStream } from '../types';

interface PayooLiveStreamProps {
  streams: PayooLiveStream[];
  onNavigate: (view: string) => void;
}

export const PayooLiveStreamView: React.FC<PayooLiveStreamProps> = ({ streams, onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-white p-4">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-zinc-950 to-amber-950 border border-rose-500/40 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-black uppercase text-rose-300">Live Stream & Konkou Studio</span>
        </div>
        <h1 className="text-2xl font-black text-white">Transmisyon an Dirèk 🇭🇹</h1>
        <p className="text-xs text-zinc-300">
          Gade live kreyatè ayisyen yo, voye kado sou MonCash ak NatCash nan chat la!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streams.map((stream) => (
          <div key={stream.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
            <div className="relative rounded-xl overflow-hidden h-48 bg-black">
              <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                EN DIRÈK
              </div>
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3 text-zinc-400" />
                {stream.viewersCount} spectateurs
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase">{stream.category}</span>
              <h3 className="text-sm font-black text-white">{stream.title}</h3>
              <p className="text-xs text-zinc-400">Pwofese pa: {stream.hostName}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
              <span className="text-emerald-400 font-black">💰 {stream.totalGiftsHTG.toLocaleString()} HTG Kado</span>
              <button
                onClick={() => alert(`Ou rantre nan Live ${stream.hostName} an dirèk!`)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500"
              >
                Gade Live →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
