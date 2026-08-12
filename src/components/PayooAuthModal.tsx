import React, { useState } from 'react';
import { HeartHandshake, CheckCircle, ShieldCheck, Mail, Lock, Phone, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface PayooAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name: string) => void;
}

export const PayooAuthModal: React.FC<PayooAuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email || 'widny@payoo.ht', fullName || 'Jean Widny Papas');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          ✕
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white">
            {mode === 'login' ? 'Konekte sou PAYOO Rézo 🇭🇹' : 'Kreye Kont Kreyatè pa w'}
          </h2>
          <p className="text-xs text-zinc-400">
            Platfòm videyo, monètizasyon ak rezo sosyal nasyonal Ayiti
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Eg: Jean Widny Papas"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
              Adresse email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vostrenom@gmail.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
                Téléphone MonCash / NatCash
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+509 3812 9045"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase">
              Mot de passe *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
          >
            {mode === 'login' ? 'Konekte Kounye a' : 'Kreye Kont Kreyatè'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          {mode === 'login' ? (
            <button onClick={() => setMode('signup')} className="hover:text-amber-300 font-bold">
              Ou pa gen kont? Kreye youn kounye a →
            </button>
          ) : (
            <button onClick={() => setMode('login')} className="hover:text-amber-300 font-bold">
              Ou gen kont deja? Konekte la →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
