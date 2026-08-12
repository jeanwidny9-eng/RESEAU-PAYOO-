import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Target,
  Mail,
  TrendingUp,
  Download,
  Building2,
  Users,
  ShieldCheck,
  Star,
  ChevronRight
} from 'lucide-react';
import { PlanType } from '../types';

interface LandingPageProps {
  onStartSearch: (niche?: string, location?: string) => void;
  onGoToPricing: () => void;
  activePlan: PlanType;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSearch,
  onGoToPricing,
  activePlan
}) => {
  const [quickNiche, setQuickNiche] = useState('Cliniques Dentaires');
  const [quickLocation, setQuickLocation] = useState('Paris, France');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSearch(quickNiche, quickLocation);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold border border-blue-200/80 mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span>Prospection B2B par IA pour Agences & Indépendants</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Trouvez des prospects qualifiés pour votre entreprise en quelques minutes
          </h1>

          {/* Subtitle / Explanation */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez des entreprises vérifiées dans n'importe quelle niche, analysez leurs failles numériques avec un score d'opportunité instantané, et générez des messages de prospection ultra-personnalisés par IA.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartSearch()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Search className="w-5 h-5" />
              <span>Trouver des prospects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToPricing}
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 text-base font-semibold px-8 py-4 rounded-xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Voir les tarifs</span>
            </button>
          </div>

          {/* Interactive Quick Search Widget Preview */}
          <div className="mt-14 max-w-3xl mx-auto bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickNiche}
                  onChange={(e) => setQuickNiche(e.target.value)}
                  placeholder="ex. Cliniques dentaires, Plomberie, MedSpa..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="flex-1 relative">
                <Target className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickLocation}
                  onChange={(e) => setQuickLocation(e.target.value)}
                  placeholder="ex. Paris, Lyon, ou À distance"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Niches populaires :</span>
              <button
                onClick={() => {
                  setQuickNiche('Cliniques Dentaires');
                  setQuickLocation('Paris, France');
                  onStartSearch('Cliniques Dentaires', 'Paris, France');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                Cliniques Dentaires
              </button>
              <button
                onClick={() => {
                  setQuickNiche('Marques E-commerce');
                  setQuickLocation('Lyon, France');
                  onStartSearch('Marques E-commerce', 'Lyon, France');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                E-commerce
              </button>
              <button
                onClick={() => {
                  setQuickNiche('Couverture & Toitures');
                  setQuickLocation('Bordeaux, France');
                  onStartSearch('Couverture & Toitures', 'Bordeaux, France');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                Couverture
              </button>
              <button
                onClick={() => {
                  setQuickNiche('MedSpas');
                  setQuickLocation('Nice, France');
                  onStartSearch('MedSpas', 'Nice, France');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                MedSpas
              </button>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/80 pt-8">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">100K+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Prospects B2B vérifiés</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">3.8x</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Taux de réponse plus élevé</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">2 400+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Indépendants & Agences actifs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">98%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Score de précision des niches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comment NicheLead Finder accélère votre acquisition clients
          </h2>
          <p className="mt-3 text-slate-600">
            Fini les heures perdues à chercher dans les annuaires. Obtenez des prospects ciblés avec des angles d'approche concrets en quelques secondes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Recherche instantanée par niche</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ciblez des entreprises locales ou internationales dans n'importe quel secteur d'activité : dentistes, avocats, e-commerçants ou startups.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Filtrage par localisation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Sites web & e-mails de contact directs
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Diagnostic des failles par IA</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Notre IA analyse la présence en ligne de chaque prospect pour identifier des angles de vente à fort taux de conversion.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-600" /> Score de prospect coloré (60-100)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-600" /> Accroche de service spécifique par prospect
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Prospection IA en 1 clic</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Générez des e-mails chauds personnalisés, des notes d'invitation LinkedIn et des relances prêts à copier ou envoyer en quelques secondes.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> E-mail froid + LinkedIn + Relances
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Export CSV pour importation CRM
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Tarifs Transparents
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Des abonnements simples pour chaque étape de votre activité
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Commencez avec 10 prospects gratuits par mois ou évoluez avec des prospects illimités.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Gratuit</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Débutant
                  </span>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">0 €</span>
                  <span className="text-slate-500 text-xs ml-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Parfait pour essayer la recherche de prospects et tester vos messages.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>10 prospects / mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Score de prospect de base</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Export CSV jusqu'à 10 prospects</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">✕</span>
                    <span>Générateur de prospection IA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onStartSearch()}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-xl relative flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                Le plus populaire
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Croissance
                  </span>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">29 €</span>
                  <span className="text-slate-500 text-xs ml-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Idéal pour les indépendants actifs et fondateurs d'agences.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>500 prospects / mois</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Exports CSV illimités</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Générateur de prospection IA (E-mail + LinkedIn)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Filtres par score et angles de service</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToPricing}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Choisir le plan Pro
              </button>
            </div>

            {/* Agency Plan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Agence</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    Échelle
                  </span>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">99 €</span>
                  <span className="text-slate-500 text-xs ml-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Conçu pour les équipes et les agences de prospection.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Prospects illimités / mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Accès multi-utilisateurs & équipe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Génération IA Gemini prioritaire</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>Support client dédié</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToPricing}
                className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Choisir le plan Agence
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Approuvé par les indépendants et fondateurs d'agences</h2>
          <p className="text-sm text-slate-600 mt-1">Découvrez comment nos utilisateurs concluent leurs contrats plus rapidement.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "J'ai trouvé 20 cliniques dentaires à Paris en 30 secondes. J'ai utilisé le générateur de prospection IA et signé mon premier client SEO à 2 000 € la même semaine !"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Marc V.</p>
                <p className="text-[11px] text-slate-500">Consultant SEO Freelance</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Le diagnostic de faille par IA est une vraie mine d'or. Au lieu d'envoyer des e-mails génériques, je mentionne leur problème exact. Mon taux de réponse est passé de 3% à 14%."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Élodie R.</p>
                <p className="text-[11px] text-slate-500">Fondatrice d'Agence Web</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Exporter les prospects enregistrés directement en CSV pour notre équipe commerciale nous fait gagner au moins 15 heures par semaine."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">David M.</p>
                <p className="text-[11px] text-slate-500">Directeur de la Croissance, Apex Media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Prêt à découvrir vos 50 prochains clients à haute valeur ?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Essayez NicheLead Finder aujourd'hui. Aucune carte de crédit requise pour commencer.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onStartSearch()}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Trouver des prospects gratuitement
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
