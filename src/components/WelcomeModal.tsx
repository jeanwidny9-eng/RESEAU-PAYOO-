import React from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Search,
  Mail,
  Phone,
  ArrowRight,
  X,
  Gift,
  Target,
  ShieldCheck
} from 'lucide-react';
import { PlanType } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onStartSearch: () => void;
  onOpenUpgrade: () => void;
  remainingRequests?: number;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  userName,
  onStartSearch,
  onOpenUpgrade,
  remainingRequests = 10
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Background gradient accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-all cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 mx-auto transform -rotate-3">
            <Gift className="w-8 h-8 text-amber-300" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              🎉 Inscription Réussie & Cadeau de Bienvenue
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              Bienvenue {userName ? `, ${userName}` : ''} !
            </h2>
          </div>

          {/* Main Welcome Offer Box */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 border border-indigo-900/50 text-left space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                Votre Crédit Découverte Offert
              </span>
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                {remainingRequests} Requêtes Restantes
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Vous disposez de <strong>10 requêtes offertes</strong> pour effectuer vos recherches de prospects qualifiés ou pour envoyer vos propositions commerciales aux entreprises par <strong>e-mail</strong>, <strong>demande</strong> ou <strong>appel téléphonique</strong>.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5 text-slate-200">
                <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Recherches</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5 text-slate-200">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>E-mails IA</span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-1.5 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Appels & Offres</span>
              </div>
            </div>
          </div>

          {/* Upgrade Incentive Callout */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-snug">
              <strong>Besoin de plus de volume ?</strong><br />
              Pour bénéficier de recherches et d'exports illimités ainsi que du support prioritaire, passez à nos <strong>plans d'abonnement Pro, Business ou Enterprise</strong> !
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onStartSearch();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Utiliser mes 10 Requêtes Offertes (Rechercher)
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenUpgrade();
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              Voir les Plans d'Abonnement Illimités
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
