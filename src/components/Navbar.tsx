import React, { useState } from 'react';
import {
  Target,
  Search,
  Bookmark,
  CreditCard,
  Sparkles,
  Menu,
  X,
  Zap,
  Tv,
  User as UserIcon,
  LogIn,
  Building2,
  DollarSign,
  Globe2,
  Briefcase,
  FileText,
  Mail,
  ShieldCheck,
  User
} from 'lucide-react';
import { PlanType } from '../types';
import { User as FirebaseUser } from '../lib/firebase';
import { Language, LANGUAGES, t } from '../lib/i18n';

export type NavTab = 
  | 'landing'
  | 'feed'
  | 'jobs'
  | 'talents'
  | 'nl_ai_search'
  | 'search'
  | 'applications'
  | 'inbox'
  | 'services'
  | 'profile'
  | 'integrations'
  | 'pricing'
  | 'promo'
  | 'monetization';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  savedLeadsCount: number;
  activePlan: PlanType;
  onOpenUpgrade: () => void;
  currentUser: FirebaseUser | null;
  onOpenAuth: () => void;
  onOpenWelcome?: () => void;
  onOpenGeminiAdvisor?: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedLeadsCount,
  activePlan,
  onOpenUpgrade,
  currentUser,
  onOpenAuth,
  onOpenWelcome,
  onOpenGeminiAdvisor,
  currentLang,
  onLanguageChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPlanBadge = () => {
    switch (activePlan) {
      case 'agency':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
            <Zap className="w-3.5 h-3.5" /> Plan Agence
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" /> Plan Pro
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Plan Gratuit
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  PAYOO REZO
                </span>
                <span className="text-base font-black tracking-tight text-slate-900">
                  NicheLead <span className="text-indigo-600">Finder</span>
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 hidden sm:block">
                Emploi Mondial, Prospection & Services IA
              </p>
            </div>
          </button>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold">
            
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'feed' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
              Fil Social
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              {t(currentLang, 'nav_jobs')}
            </button>

            <button
              onClick={() => setActiveTab('talents')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'talents' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
              Trouver Talents
            </button>

            <button
              onClick={() => setActiveTab('nl_ai_search')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'nl_ai_search' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Recherche IA
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'applications' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              {t(currentLang, 'nav_applications')}
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inbox' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              {t(currentLang, 'nav_messages')}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-rose-600" />
              {t(currentLang, 'nav_services')}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-600" />
              {t(currentLang, 'nav_profile')}
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'integrations' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              {t(currentLang, 'nav_integrations')}
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pricing' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-700" />
              {t(currentLang, 'nav_pricing')}
            </button>

          </nav>

          {/* Right Controls: Language Switcher & Auth */}
          <div className="hidden sm:flex items-center gap-2">
            
            {onOpenGeminiAdvisor && (
              <button
                onClick={onOpenGeminiAdvisor}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md border border-purple-400/40"
                title="Conseiller Gemini IA (Apps, Sites, Vidéos) - Plan VIP $500"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Gemini IA ($500 VIP)</span>
              </button>
            )}

            {/* Language Dropdown Selector */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {onOpenWelcome && (
              <button
                onClick={onOpenWelcome}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Offre de bienvenue (10 requêtes offertes)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{t(currentLang, 'welcome_gift')}</span>
              </button>
            )}

            {/* Auth Button */}
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[80px] truncate">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                Connexion
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg text-xs font-bold">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span>Langue :</span>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold px-2 py-1 rounded-lg"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <Briefcase className="w-4 h-4 text-indigo-600" /> {t(currentLang, 'nav_jobs')}
          </button>

          <button
            onClick={() => { setActiveTab('applications'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'applications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <FileText className="w-4 h-4 text-purple-600" /> {t(currentLang, 'nav_applications')}
          </button>

          <button
            onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'search' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <Search className="w-4 h-4 text-blue-600" /> {t(currentLang, 'nav_leads')}
          </button>

          <button
            onClick={() => { setActiveTab('inbox'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <Mail className="w-4 h-4 text-emerald-600" /> {t(currentLang, 'nav_messages')}
          </button>

          <button
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'services' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <Building2 className="w-4 h-4 text-rose-600" /> {t(currentLang, 'nav_services')}
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <UserIcon className="w-4 h-4 text-amber-600" /> {t(currentLang, 'nav_profile')}
          </button>

          <button
            onClick={() => { setActiveTab('integrations'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'integrations' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-500" /> {t(currentLang, 'nav_integrations')}
          </button>

          <button
            onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 ${activeTab === 'pricing' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
          >
            <CreditCard className="w-4 h-4 text-slate-700" /> {t(currentLang, 'nav_pricing')}
          </button>

          <button
            onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
            className="w-full mt-2 bg-slate-900 text-white font-extrabold py-2.5 rounded-xl text-center"
          >
            {currentUser ? 'Mon Compte' : 'Connexion / Inscription'}
          </button>
        </div>
      )}
    </header>
  );
};
