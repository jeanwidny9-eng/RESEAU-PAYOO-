import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Check,
  Star,
  CreditCard,
  Coins
} from 'lucide-react';
import { PlanType } from '../types';

interface PricingPageProps {
  activePlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onStartSearch: () => void;
  onOpenPaymentModal: (plan: PlanType, billingCycle: 'monthly' | 'yearly') => void;
  onOpenGeminiAdvisor?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  activePlan,
  onSelectPlan,
  onStartSearch,
  onOpenPaymentModal,
  onOpenGeminiAdvisor
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const discountFactor = billingCycle === 'yearly' ? 0.8 : 1;

  const faqs = [
    {
      q: 'Comment NicheLead Finder génère-t-il les données de prospects ?',
      a: 'Nous combinons des algorithmes de découverte web en temps réel avec Gemini IA pour analyser les entreprises locales, identifier leurs manques numériques (vitesse de chargement, SEO local manquant, absence de tunnel e-mail) et calculer un score d\'opportunité.'
    },
    {
      q: 'Puis-je exporter mes prospects vers mon CRM comme Hubspot ou GoHighLevel ?',
      a: 'Oui ! Tous les abonnements incluent des fonctionnalités d\'exportation CSV. Les formules Pro et Agence permettent des exports illimités contenant le nom d\'entreprise, le site web, l\'e-mail, le téléphone et les angles de prospection IA prêts pour une importation directe.'
    },
    {
      q: 'Puis-je changer ou surclasser mon abonnement à tout moment ?',
      a: 'Absolument. Vous pouvez passer de la formule Gratuite à Pro ou Agence à tout moment avec un accès instantané à des volumes de prospects plus élevés et à la génération prioritaire par IA.'
    },
    {
      q: 'Y a-t-il une limite sur les messages de prospection IA ?',
      a: 'Les utilisateurs Pro bénéficient de 500 messages de prospection IA par mois (e-mail froid, note LinkedIn et relance). Les utilisateurs Agence bénéficient d\'une génération illimitée pour toute leur équipe.'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
          Tarifs B2B Flexibles
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Choisissez la formule adaptée à vos objectifs de croissance
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Commencez gratuitement pour tester notre moteur de recherche, ou passez à la vitesse supérieure pour des exports illimités et la génération de messages par IA.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Facturation Mensuelle
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors cursor-pointer relative"
          >
            <div
              className={`w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6 bg-indigo-600' : ''
              }`}
            />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Facturation Annuelle
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
              Économisez 20%
            </span>
          </span>
        </div>

        {/* Payment Modes Banner */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-blue-600" /> Payment & Crypto en temps réel :
          </span>
          <span className="bg-red-100 text-red-950 border border-red-300 text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
            📲 Natcash (+509 5576 9199)
          </span>
          <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            EURO (€)
          </span>
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            DOLLAR ($)
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ₿ BTC (Réseau BTC)
          </span>
          <span className="bg-teal-100 text-teal-900 border border-teal-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ₮ USDT (TRC20)
          </span>
          <span className="bg-yellow-100 text-yellow-900 border border-yellow-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ❖ BNB (BEP20)
          </span>
          <span className="bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            π PI NETWORK
          </span>
          <span className="bg-sky-100 text-sky-900 border border-sky-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            💎 GRAM / TON
          </span>
          <span className="bg-cyan-100 text-cyan-900 border border-cyan-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ✕ XRP (+ Balise)
          </span>
          <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ⟠ ETH
          </span>
          <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
            ◎ SOLANA
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
        {/* Plan Pro ($29/mo) */}
        <div
          className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            activePlan === 'pro'
              ? 'border-2 border-blue-600 shadow-xl ring-2 ring-blue-500/20'
              : 'border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  🥉 Freelance / Pro
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Plan Pro</h3>
                <p className="text-xs text-slate-500">Pour indépendants et créateurs</p>
              </div>
              {activePlan === 'pro' && (
                <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
                  Actif
                </span>
              )}
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-black text-slate-900">
                {Math.round(29 * discountFactor)} $
              </span>
              <span className="text-slate-500 text-xs ml-1">
                / mo {billingCycle === 'yearly' && '(annuel)'}
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recherches B2B illimitées</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Jusqu'à 5 000 leads par mois</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Export CSV & Excel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Générateur de messages IA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Support e-mail & Mises à jour</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenPaymentModal('pro', billingCycle)}
            className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {activePlan === 'pro' ? 'Gérer mon Abonnement' : 'S\'abonner au Plan Pro (29$/mo)'}
          </button>
        </div>

        {/* Plan Business ($50/mo) */}
        <div
          className={`bg-white p-6 rounded-3xl border-2 border-indigo-600 shadow-xl relative flex flex-col justify-between ${
            activePlan === 'business' ? 'ring-4 ring-indigo-500/20' : ''
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
            🥈 Populaire Agence
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  🥈 Business / Agency
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Plan Business</h3>
                <p className="text-xs text-slate-500">Pour agences & PME</p>
              </div>
              {activePlan === 'business' && (
                <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-full">
                  Actif
                </span>
              )}
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-black text-slate-900">
                {Math.round(50 * discountFactor)} $
              </span>
              <span className="text-slate-500 text-xs ml-1">
                / mo {billingCycle === 'yearly' && '(annuel)'}
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2 font-bold text-indigo-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Avantages du Plan Pro inclus</span>
              </li>
              <li className="flex items-center gap-2 font-extrabold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Jusqu'à 20 000 leads par mois</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Export CSV, Excel et PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Vérification des e-mails</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-indigo-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Support prioritaire 24h</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenPaymentModal('business', billingCycle)}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {activePlan === 'business' ? 'Gérer mon Abonnement' : 'S\'abonner au Plan Business (50$/mo)'}
          </button>
        </div>

        {/* Plan Enterprise ($100/mo) */}
        <div
          className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            activePlan === 'enterprise' || activePlan === 'agency'
              ? 'border-2 border-emerald-600 shadow-xl ring-2 ring-emerald-500/20'
              : 'border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  🥇 Enterprise
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Plan Enterprise</h3>
                <p className="text-xs text-slate-500">Pour grandes entreprises</p>
              </div>
              {(activePlan === 'enterprise' || activePlan === 'agency') && (
                <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                  Actif
                </span>
              )}
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-black text-slate-900">
                {Math.round(100 * discountFactor)} $
              </span>
              <span className="text-slate-500 text-xs ml-1">
                / mo {billingCycle === 'yearly' && '(annuel)'}
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100">
              <li className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Leads illimités & Accès API</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Comptes multi-utilisateurs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Intégration CRM (Hubspot, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rapports analytiques sur mesure</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Assistance téléphonique VIP 24/7</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onOpenPaymentModal('enterprise', billingCycle)}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {activePlan === 'enterprise' || activePlan === 'agency' ? 'Gérer mon Abonnement' : 'S\'abonner à Enterprise (100$/mo)'}
          </button>
        </div>

        {/* Plan Ultimate VIP Gemini ($500/mo) - NEW SPECIAL PLAN REQUESTED BY USER */}
        <div
          className={`bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border-2 border-purple-500/80 shadow-2xl relative flex flex-col justify-between ${
            activePlan === 'ultimate_vip' ? 'ring-4 ring-purple-500/40' : ''
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-[10px] font-black px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            👑 Ultimate VIP Gemini IA
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-950 border border-purple-800 px-2.5 py-0.5 rounded-full">
                  💎 Accès Direct Gemini IA
                </span>
                <h3 className="text-xl font-black text-white mt-1">Ultimate VIP</h3>
                <p className="text-xs text-purple-200">Création Apps, Sites, Vidéos & Plan d'action</p>
              </div>
              {activePlan === 'ultimate_vip' && (
                <span className="text-xs font-bold bg-purple-600 text-white px-2.5 py-1 rounded-full">
                  Actif
                </span>
              )}
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-black text-amber-300">
                {Math.round(500 * discountFactor)} $
              </span>
              <span className="text-slate-400 text-xs ml-1">
                / mo {billingCycle === 'yearly' && '(annuel)'}
              </span>
            </div>

            <ul className="space-y-2 text-xs text-purple-100 pt-4 border-t border-purple-800/60">
              <li className="flex items-center gap-2 font-black text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Accès Direct au Chatbot Gemini IA sur le site</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conseils d'expert pour créer des Apps & Sites</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Scripts & Montage Vidéo (TikTok/YouTube)</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Génération de Plan d'Action pas-à-pas</span>
              </li>
              <li className="flex items-center gap-2 text-purple-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toutes les fonctionnalités du site en illimité</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 mt-6">
            {onOpenGeminiAdvisor && (
              <button
                type="button"
                onClick={onOpenGeminiAdvisor}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md border border-purple-400/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Discuter avec Gemini
              </button>
            )}

            <button
              onClick={() => onOpenPaymentModal('ultimate_vip', billingCycle)}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {activePlan === 'ultimate_vip' ? 'Abonnement VIP Actif' : 'S\'abonner au Plan VIP ($500/mo)'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-5xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          Comparatif des fonctionnalités
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-4">Fonctionnalité</th>
                <th className="py-3 px-4 text-center">Gratuit</th>
                <th className="py-3 px-4 text-center text-blue-600">Pro</th>
                <th className="py-3 px-4 text-center text-violet-600">Agence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Limite mensuelle de recherche</td>
                <td className="py-3 px-4 text-center">10 / mois</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">500 / mois</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">Illimité</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Exports CSV de prospects</td>
                <td className="py-3 px-4 text-center">Jusqu'à 10</td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">Illimité</td>
                <td className="py-3 px-4 text-center font-bold text-violet-600">Illimité</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Générateur de prospection IA (E-mail + LinkedIn)</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Inclus</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Inclus</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Score de prospect & diagnostic de failles</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ De base</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Complet</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Complet</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">Accès multi-utilisateurs & équipe</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center text-slate-400">✕</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Multi-utilisateurs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Foire Aux Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Tout ce que vous devez savoir sur PAYOO Rézo — NicheLead Finder.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 text-sm font-bold text-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
