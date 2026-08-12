import React from 'react';
import { X, Sparkles, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { PlanType } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadCountToExport: number;
  activePlan: PlanType;
  onUpgradeToPro: () => void;
  onConfirmExport: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  leadCountToExport,
  activePlan,
  onUpgradeToPro,
  onConfirmExport
}) => {
  if (!isOpen) return null;

  const isFreePlanExceeded = activePlan === 'free' && leadCountToExport > 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isFreePlanExceeded ? (
          /* Plan Limit Reached View */
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" /> Limite gratuite dépassée
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                L'exportation de {leadCountToExport} prospects nécessite l'offre Pro
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les comptes gratuits peuvent exporter jusqu'à 10 prospects par fichier. Passez au <strong className="text-blue-600">Plan Pro</strong> pour des exports CSV illimités et la génération complète de prospection IA.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Plan Pro (29 €/mois)</span>
                <span className="text-blue-600">Accès Instantané</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Exports CSV illimités</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>500 prospects par mois</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Générateur E-mail & LinkedIn par IA</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onUpgradeToPro();
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                Passer au Plan Pro (29 €)
              </button>

              <button
                onClick={() => {
                  onConfirmExport();
                  onClose();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Exporter uniquement les 10 premiers (Formule Gratuite)
              </button>
            </div>
          </div>
        ) : (
          /* Normal Export Confirmation View */
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Exporter les prospects en CSV</h3>
              <p className="text-xs text-slate-600">
                Vous allez télécharger <strong className="text-slate-900">{leadCountToExport} prospect{leadCountToExport > 1 ? 's' : ''}</strong> sous forme de fichier CSV structuré.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <p>Colonnes incluses :</p>
              <p className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 overflow-x-auto">
                Nom entreprise, Site web, E-mail, Téléphone, Secteur, Localisation, Score, Angle d'approche, Statut, Notes
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onConfirmExport();
                  onClose();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
