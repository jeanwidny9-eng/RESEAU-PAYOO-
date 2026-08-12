import React from 'react';
import { BadgeCheck, ShieldCheck, HeartHandshake, Sparkles, MapPin, Wallet, Award, Lock } from 'lucide-react';
import { PayooUser } from '../types';

interface PayooUserProfileProps {
  user: PayooUser;
  onNavigate: (view: string) => void;
}

export const PayooUserProfile: React.FC<PayooUserProfileProps> = ({ user, onNavigate }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24 text-white p-4">
      {/* Cover & Avatar Header */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="h-40 bg-gradient-to-r from-amber-600 to-rose-600">
          {user.coverPhoto && (
            <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-80" />
          )}
        </div>

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4 -mt-12">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-3xl border-4 border-zinc-950 object-cover shadow-2xl"
            />
            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.isVerified && <BadgeCheck className="w-5 h-5 text-amber-400" />}
              </h1>
              <p className="text-xs text-amber-400 font-bold">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('supporters')}
              className="px-4 py-2 rounded-2xl bg-amber-500 text-black font-black text-xs shadow-lg hover:scale-105 transition-transform"
            >
              Badge Supporteur 🇭🇹
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">{user.bio}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-400 pt-2 border-t border-zinc-800">
            <div>
              <span className="text-white font-black">{user.followersCount.toLocaleString()}</span> abonnés
            </div>
            <div>
              <span className="text-white font-black">{user.followingCount}</span> abonnements
            </div>
            {user.location && (
              <div className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {user.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-black text-white">Vérification d'Identité National</h3>
          </div>
          <p className="text-[11px] text-zinc-400">
            {user.isIdentityVerified ? 'Compte Vérifié avec CIN / Passeport Haïtien ✓' : 'Non vérifié'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 space-y-1">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-black text-amber-300">Statut Supporteur Officiel</h3>
          </div>
          <p className="text-[11px] text-zinc-300">
            Tier: <span className="font-black text-amber-400">{user.supporterTier || 'Non inscrit'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
