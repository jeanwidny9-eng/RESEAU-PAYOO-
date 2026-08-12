import React from 'react';
import { ShieldCheck, Wallet, Sparkles, Bell, Search, Video, HeartHandshake } from 'lucide-react';
import { PayooUser } from '../types';

interface PayooHeaderProps {
  currentUser: PayooUser;
  currentNav: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const PayooHeader: React.FC<PayooHeaderProps> = ({
  currentUser,
  currentNav,
  onNavigate,
  onOpenAuth
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-base">
                P
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight text-white">
                  PAY<span className="text-amber-400">OO</span>
                </span>
                <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                  RÉZO 🇭🇹
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 font-medium hidden sm:block">
                Platfòm Videyo ak Kreyatè Ayisyen
              </span>
            </div>
          </button>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Chèche videyo, kreyatè, sipòtè..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        {/* Right Actions & Balance */}
        <div className="flex items-center gap-2">
          {/* Sipòte PAYOO Button */}
          <button
            onClick={() => onNavigate('supporters')}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-md ${
              currentNav === 'supporters'
                ? 'bg-amber-500 text-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Sipòte PAYOO 🇭🇹</span>
            <span className="sm:hidden">Sipòte</span>
          </button>

          {/* Tokens & Balance */}
          <div className="hidden lg:flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-xs">
            <span className="text-amber-400 font-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {currentUser.payooTokens} Tokens
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-black">
              {currentUser.earningsHTG.toLocaleString()} HTG
            </span>
          </div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-amber-500/50 object-cover"
              />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs hover:scale-105 transition-transform"
            >
              Konekte
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
