import React from 'react';
import { Video, Radio, HeartHandshake, Zap, ShoppingBag, User, ShieldAlert } from 'lucide-react';

interface PayooBottomNavProps {
  currentNav: string;
  onNavigate: (view: string) => void;
}

export const PayooBottomNav: React.FC<PayooBottomNavProps> = ({ currentNav, onNavigate }) => {
  const navItems = [
    { id: 'feed', label: 'Videyo', icon: Video },
    { id: 'live', label: 'Live', icon: Radio },
    { id: 'supporters', label: 'Sipòtè 🇭🇹', icon: HeartHandshake },
    { id: 'creator', label: 'Monètize', icon: Zap },
    { id: 'marketplace', label: 'Mache', icon: ShoppingBag },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 py-2 px-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all px-2 py-1 rounded-xl ${
                isActive
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
