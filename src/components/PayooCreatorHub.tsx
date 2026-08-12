import React, { useState } from 'react';
import { Zap, DollarSign, Wallet, Video, Award, CheckCircle, ArrowUpRight, Lock, TrendingUp } from 'lucide-react';
import { PayooUser } from '../types';

interface PayooCreatorHubProps {
  currentUser: PayooUser;
  onNavigate: (view: string) => void;
}

export const PayooCreatorHub: React.FC<PayooCreatorHubProps> = ({ currentUser, onNavigate }) => {
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'MonCash' | 'NatCash' | 'Unibank'>('MonCash');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutRequested(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-white p-4">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-amber-950/60 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            Monètizasyon Aktif ✓
          </span>
          <span className="text-xs font-bold text-amber-300">
            0.50 HTG / 15 Vues Vèrifye
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white">
          Espace Kreyatè & Sant Retrè MonCash / NatCash 🇭🇹
        </h1>

        <p className="text-xs text-zinc-300">
          Chak fwa moun gade videyo w yo sou PAYOO Rézo, ou touche goud dirèkteman. Retire kòb ou nenpòt ki lè sou kont telefòn ou!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase">Kòb Disponible</span>
          <div className="text-2xl font-black text-emerald-400">
            {currentUser.earningsHTG.toLocaleString()} HTG
          </div>
          <span className="text-[10px] text-zinc-400">Peman sou MonCash / NatCash</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase">PAYOO Tokens</span>
          <div className="text-2xl font-black text-amber-300">
            {currentUser.payooTokens} Tokens
          </div>
          <span className="text-[10px] text-zinc-400">Itilize pou kado & boost</span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase">Total Vues Vèrifye</span>
          <div className="text-2xl font-black text-white">
            2,535,000
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Anti-Cheat Sistèm Aktif</span>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          Mande yon Retrè Kòb (Withdrawal)
        </h2>

        {payoutRequested ? (
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-sm font-black text-white">Demand Retrè Enregistre!</h3>
            <p className="text-xs text-emerald-300">
              Ou pral resevwa {currentUser.earningsHTG.toLocaleString()} HTG sou {payoutMethod} nan nimewo {phoneNumber} nan mwens ke 15 minit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
                Mwayen Retrè
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('MonCash')}
                  className={`py-2 rounded-xl text-xs font-black border ${
                    payoutMethod === 'MonCash' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  MonCash
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('NatCash')}
                  className={`py-2 rounded-xl text-xs font-black border ${
                    payoutMethod === 'NatCash' ? 'bg-blue-950 border-blue-500 text-blue-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  NatCash
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod('Unibank')}
                  className={`py-2 rounded-xl text-xs font-black border ${
                    payoutMethod === 'Unibank' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Unibank
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
                Nimewo Telefòn MonCash / NatCash *
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+509 3812 9045"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-transform"
            >
              Transfere {currentUser.earningsHTG.toLocaleString()} HTG Kounye a
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
