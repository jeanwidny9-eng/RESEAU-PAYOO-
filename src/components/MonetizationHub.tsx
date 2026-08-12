import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Coins,
  Megaphone,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  ShieldAlert,
  Download,
  Share2,
  HelpCircle,
  BarChart3,
  Globe,
  Award,
  ArrowRight,
  PieChart,
  Wallet,
  Users,
  Percent,
  Lock,
  RefreshCw,
  Sliders,
  FileSpreadsheet,
  AlertTriangle,
  Gift,
  CheckSquare,
  Eye,
  Settings,
  Bell,
  Activity,
  UserCheck,
  UserX,
  FileText
} from 'lucide-react';
import { PlanType, Coupon, Transaction, ReferralData, AdSenseConfig } from '../types';

interface MonetizationHubProps {
  onOpenPaymentModal: (plan: PlanType, billingCycle: 'monthly' | 'yearly') => void;
  onGoToSearch: () => void;
  onGoToServices: () => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  onOpenPaymentModal,
  onGoToSearch,
  onGoToServices
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'coupons' | 'referral' | 'admin' | 'adsense' | 'security'>('plans');

  // Subscription state
  const [currentPlan, setCurrentPlan] = useState<PlanType>('pro');
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // AdSense Config State
  const [adSenseConfig, setAdSenseConfig] = useState<AdSenseConfig>({
    publisherId: 'pub-9840219842104921',
    enableHeaderBanner: true,
    enableSidebarBanner: true,
    enableResultsSpotlight: true,
    testMode: true
  });
  const [adSenseSaved, setAdSenseSaved] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'WELCOME20', discountType: 'percent', value: 20, expiryDate: '2026-12-31', maxUses: 500, currentUses: 42, active: true },
    { code: 'LAUNCH10', discountType: 'fixed', value: 10, expiryDate: '2026-09-30', maxUses: 200, currentUses: 89, active: true },
    { code: 'VIP50', discountType: 'percent', value: 50, expiryDate: '2026-12-31', maxUses: 50, currentUses: 12, active: true },
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponValue, setNewCouponValue] = useState<number>(15);
  const [newCouponExpiry, setNewCouponExpiry] = useState('2026-12-31');
  const [newCouponMax, setNewCouponMax] = useState<number>(100);

  // Referral / Affiliate State
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: 'REZO-JEAN-849',
    totalReferrals: 14,
    totalCommissionsUSD: 140.00,
    pendingCommissionsUSD: 70.00,
    commissionRatePercent: 20
  });
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);
  const [copiedRefLink, setCopiedRefLink] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-98402', userId: 'usr_1', userEmail: 'jeanwidny9@gmail.com', plan: 'pro', amount: 29.00, currency: 'USD', paymentMethod: 'Stripe (Visa)', status: 'Reussi', invoiceNumber: 'INV-2026-001', date: '2026-08-01' },
    { id: 'TX-98403', userId: 'usr_2', userEmail: 'cabinet.avocat@rezo.fr', plan: 'business', amount: 50.00, currency: 'USD', paymentMethod: 'PayPal', status: 'Reussi', invoiceNumber: 'INV-2026-002', date: '2026-08-03' },
    { id: 'TX-98404', userId: 'usr_3', userEmail: 'dev.agency@tech.io', plan: 'enterprise', amount: 100.00, currency: 'USD', paymentMethod: 'Pi Network (Crypto)', status: 'Reussi', invoiceNumber: 'INV-2026-003', date: '2026-08-05' },
  ]);

  // Admin User Control State
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Jean Widny', email: 'jeanwidny9@gmail.com', plan: 'pro', status: 'Actif', registeredAt: '2026-01-10' },
    { id: 'u2', name: 'Cabinet Juridique Sud', email: 'contact@sud-juridique.fr', plan: 'business', status: 'Actif', registeredAt: '2026-02-15' },
    { id: 'u3', name: 'Clinic Santé Express', email: 'admin@sante-express.org', plan: 'enterprise', status: 'Actif', registeredAt: '2026-03-22' },
    { id: 'u4', name: 'Marketing Pro Web', email: 'hello@mpro.com', plan: 'free', status: 'Suspendu', registeredAt: '2026-04-05' },
  ]);

  // Admin Pricing Control
  const [planPrices, setPlanPrices] = useState({
    pro: 29,
    business: 50,
    enterprise: 100,
    ultimate_vip: 500
  });

  // Security 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Helper functions
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const code = newCouponCode.trim().toUpperCase();
    const newC: Coupon = {
      code,
      discountType: newCouponType,
      value: newCouponValue,
      expiryDate: newCouponExpiry,
      maxUses: newCouponMax,
      currentUses: 0,
      active: true
    };
    setCoupons([newC, ...coupons]);
    setNewCouponCode('');
  };

  const handleToggleCouponStatus = (code: string) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const handleCopyReferral = () => {
    const url = `${window.location.origin}/ref?code=${referralData.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopiedRefLink(true);
    setTimeout(() => setCopiedRefLink(false), 2000);
  };

  const handleRequestWithdrawal = () => {
    setWithdrawalRequested(true);
    setTimeout(() => setWithdrawalRequested(false), 4000);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'Actif' ? 'Suspendu' : 'Actif' } : u));
  };

  const handleExportFinancialReport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'ID Transaction,Email,Plan,Montant,Devise,Methode,Statut,Facture,Date\n'
      + transactions.map(t => `${t.id},${t.userEmail},${t.plan},${t.amount},${t.currency},${t.paymentMethod},${t.status},${t.invoiceNumber},${t.date}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_financier_nichelead_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAdSense = () => {
    setAdSenseSaved(true);
    setTimeout(() => setAdSenseSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Main Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-900/50">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Centre Global de Monétisation & Revenus B2B
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            NicheLead Finder – Ecosystème de Revenus
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Gérez l'ensemble de vos abonnements B2B, vos codes promotionnels, vos commissions de parrainage 20%, votre affichage Google AdSense et le panneau d'administration financier.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenPaymentModal('business', 'monthly')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              S'abonner au Plan Business (50$/mo)
            </button>
            <button
              onClick={handleCopyReferral}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-blue-300" />
              {copiedRefLink ? 'Lien Parrain Copié !' : 'Partager mon Lien Parrain (20%)'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveSubTab('plans')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'plans'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Formules Abonnements (Pro/Biz/VIP)
        </button>

        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gift className="w-4 h-4 text-purple-400" />
          Codes Promo & Coupons
        </button>

        <button
          onClick={() => setActiveSubTab('referral')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'referral'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          Parrainage (20% Commission)
        </button>

        <button
          onClick={() => setActiveSubTab('admin')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'admin'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          Panneau d'Administration
        </button>

        <button
          onClick={() => setActiveSubTab('adsense')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'adsense'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4 text-rose-400" />
          Google AdSense
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'security'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4 text-teal-400" />
          Sécurité & 2FA
        </button>
      </div>

      {/* TAB 1: SUBSCRIPTION PLANS & MANAGEMENT */}
      {activeSubTab === 'plans' && (
        <div className="space-y-8">
          
          {/* Active Subscription Status Banner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Votre Statut d'Abonnement Actuel
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-900">
                  Plan {currentPlan.toUpperCase()} (Actif)
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Renouvellement Automatique Actif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Prochaine date de facturation : <strong>06 Septembre 2026</strong> ({planPrices[currentPlan as keyof typeof planPrices] || 29} $/mois).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setAutoRenew(!autoRenew)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                  autoRenew ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {autoRenew ? 'Désactiver le renouvellement auto' : 'Réactiver le renouvellement auto'}
              </button>
              <button
                onClick={() => onOpenPaymentModal('enterprise', 'monthly')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Changer de Formule (Upgrade)
              </button>
            </div>
          </div>

          {/* Detailed Plans Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 🥉 PLAN PRO ($29/mo) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-amber-600">🥉 Plan Pro</span>
                  <span className="text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                    29 $/mois
                  </span>
                </div>
                <p className="text-xs text-slate-500">Idéal pour les indépendants, freelances et petites entreprises.</p>

                <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recherches illimitées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accès à toutes les niches disponibles</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jusqu'à 5 000 leads par mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export des données en CSV et Excel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sauvegarde des recherches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Historique des recherches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Support par e-mail</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mises à jour automatiques</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPaymentModal('pro', 'monthly')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                S'abonner au Plan Pro (29$/mo)
              </button>
            </div>

            {/* 🥈 PLAN BUSINESS ($50/mo) */}
            <div className="bg-white p-6 rounded-3xl border-2 border-indigo-600 shadow-xl space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recommandé Agences
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-indigo-600">🥈 Plan Business</span>
                  <span className="text-xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-full">
                    50 $/mois
                  </span>
                </div>
                <p className="text-xs text-slate-500">Idéal pour les agences et les entreprises en croissance.</p>

                <div className="text-[11px] font-bold text-indigo-900 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                  Tous les avantages du Plan Pro, plus :
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-extrabold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Jusqu'à 20 000 leads par mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Export CSV, Excel et PDF</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Recherche avancée avec filtres Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Vérification des e-mails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Sauvegarde illimitée</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Tableau de bord analytique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Accès anticipé aux nouvelles fonctionnalités</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPaymentModal('business', 'monthly')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/20"
              >
                S'abonner au Plan Business (50$/mo)
              </button>
            </div>

            {/* 🥇 PLAN ENTERPRISE ($100/mo) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-emerald-600">🥇 Plan Enterprise</span>
                  <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                    100 $/mois
                  </span>
                </div>
                <p className="text-xs text-slate-500">Conçu pour les grandes entreprises et équipes commerciales.</p>

                <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  Tous les avantages du Plan Business, plus :
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-black text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Leads illimités</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accès API complet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Comptes multi-utilisateurs</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Intégration avec les principaux CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export illimité & Rapports avancés</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gestion des équipes</span>
                  </li>
                  <li className="flex items-center gap-2 font-black text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Support VIP 24 h/24 et 7 j/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Assistance personnalisée & Fonctionnalités exclusives</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPaymentModal('enterprise', 'monthly')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                S'abonner au Plan Enterprise (100$/mo)
              </button>
            </div>

          </div>

          {/* Payment History & Factures Download */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Historique des Paiements & Téléchargement des Factures
              </h3>
              <button
                onClick={handleExportFinancialReport}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Exporter tout en CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Facture N°</th>
                    <th className="py-3 px-3">Formule</th>
                    <th className="py-3 px-3">Montant</th>
                    <th className="py-3 px-3">Moyen de Paiement</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3 text-right">Télécharger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">{tx.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.invoiceNumber}</td>
                      <td className="py-3 px-3 uppercase font-extrabold text-indigo-600">{tx.plan}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{tx.amount} {tx.currency}</td>
                      <td className="py-3 px-3">{tx.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => alert(`Téléchargement de la facture PDF N° ${tx.invoiceNumber}...`)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-slate-600" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COUPONS & CODE PROMO */}
      {activeSubTab === 'coupons' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Create Coupon Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Créer un Code Promo / Coupon
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Générez des réductions fixes ou en pourcentage pour attirer de nouveaux abonnés.
              </p>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Code du Coupon :</label>
                  <input
                    type="text"
                    placeholder="EX: BIENVENUE20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold uppercase focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Type de Réduction :</label>
                    <select
                      value={newCouponType}
                      onChange={(e: any) => setNewCouponType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-purple-600"
                    >
                      <option value="percent">Pourcentage (%)</option>
                      <option value="fixed">Montant Fixe ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Valeur de Réduction :</label>
                    <input
                      type="number"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-purple-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Date d'expiration :</label>
                    <input
                      type="date"
                      value={newCouponExpiry}
                      onChange={(e) => setNewCouponExpiry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Utilisations Max :</label>
                    <input
                      type="number"
                      value={newCouponMax}
                      onChange={(e) => setNewCouponMax(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/20"
                >
                  Ajouter le Coupon Promo
                </button>
              </form>
            </div>

            {/* Right: Existing Coupons List */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900">Coupons Actifs & Historique</h3>

              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {c.discountType === 'percent' ? `-${c.value}% de réduction` : `-${c.value}$ de réduction`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 space-x-3">
                        <span>Expire le : <strong>{c.expiryDate}</strong></span>
                        <span>Utilisé : <strong>{c.currentUses} / {c.maxUses}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCouponStatus(c.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          c.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {c.active ? 'Actif' : 'Désactivé'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: REFERRAL PROGRAM (20%) */}
      {activeSubTab === 'referral' && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                  Programme d'Affiliation 20%
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  Gagnez 20% de Commission sur chaque Filleul !
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Partagez votre lien de parrainage unique. Pour chaque utilisateur qui s'abonne à un plan Pro (29$), Business (50$) ou Enterprise (100$), vous touchez 20% immédiatement.
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-400/30 p-4 rounded-2xl text-center shrink-0">
                <div className="text-[10px] font-bold text-slate-300 uppercase">Commission</div>
                <div className="text-3xl font-black text-emerald-400">20 %</div>
                <div className="text-[10px] text-slate-400">Sur le 1er paiement</div>
              </div>
            </div>

            {/* Referral Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Nombre de Filleuls :</span>
                <div className="text-2xl font-black text-white">{referralData.totalReferrals} Utilisateurs</div>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Gains Totaux Accumulés :</span>
                <div className="text-2xl font-black text-emerald-400">{referralData.totalCommissionsUSD.toFixed(2)} $</div>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Solde Disponible au Retrait :</span>
                <div className="text-2xl font-black text-amber-400">{referralData.pendingCommissionsUSD.toFixed(2)} $</div>
              </div>
            </div>

            {/* Referral Link Copy Bar */}
            <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-2">
              <label className="block text-xs font-bold text-slate-300">Votre Lien de Parrainage Personnel :</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/ref?code=${referralData.referralCode}`}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {copiedRefLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedRefLink ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            {/* Request Payout Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300">
                Seuil minimum de retrait : <strong>50.00 $</strong>. Retraits traités sous 24-48h.
              </span>
              <button
                onClick={handleRequestWithdrawal}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {withdrawalRequested ? 'Demande Envoyée avec Succès !' : 'Demander le Retrait des Gains'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: ADMIN CENTER (PANNEAU D'ADMINISTRATION) */}
      {activeSubTab === 'admin' && (
        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                  Centre d'Administration Global
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Gestion des Utilisateurs & Tarifs
                </h3>
              </div>
              <button
                onClick={handleExportFinancialReport}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Exporter le Rapport Financier CSV
              </button>
            </div>

            {/* Pricing Override Panel */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Modifier les Tarifs Mensuels des Formules ($) :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🥉 Plan Pro ($) :</label>
                  <input
                    type="number"
                    value={planPrices.pro}
                    onChange={(e) => setPlanPrices({ ...planPrices, pro: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🥈 Plan Business ($) :</label>
                  <input
                    type="number"
                    value={planPrices.business}
                    onChange={(e) => setPlanPrices({ ...planPrices, business: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">🥇 Plan Enterprise ($) :</label>
                  <input
                    type="number"
                    value={planPrices.enterprise}
                    onChange={(e) => setPlanPrices({ ...planPrices, enterprise: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Users Control Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Liste des Comptes & Contrôle des Accès :</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Nom</th>
                      <th className="py-3 px-3">E-mail</th>
                      <th className="py-3 px-3">Plan Actuel</th>
                      <th className="py-3 px-3">Inscrit Le</th>
                      <th className="py-3 px-3">Statut</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3 px-3">{u.email}</td>
                        <td className="py-3 px-3 font-extrabold uppercase text-indigo-600">{u.plan}</td>
                        <td className="py-3 px-3 text-slate-500">{u.registeredAt}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              u.status === 'Actif'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              u.status === 'Actif'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {u.status === 'Actif' ? 'Suspendre' : 'Réactiver'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 5: GOOGLE ADSENSE */}
      {activeSubTab === 'adsense' && (
        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                  Monétisation Publicitaire
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Intégration Google AdSense
                </h3>
              </div>
              <Megaphone className="w-8 h-8 text-rose-600" />
            </div>

            <p className="text-xs text-slate-600">
              Configurez votre identifiant d'éditeur Google AdSense (<code>ca-pub-XXXXXXXXXXXXXXXX</code>) pour diffuser des bannières pub automatiques sur votre application.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Identifiant Éditeur Google AdSense (Publisher ID) :</label>
                <input
                  type="text"
                  value={adSenseConfig.publisherId}
                  onChange={(e) => setAdSenseConfig({ ...adSenseConfig, publisherId: e.target.value })}
                  placeholder="pub-9840219842104921"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Emplacements des Bannières Publicitaires :</label>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>Bannière En-Tête (Header Display Ad)</span>
                  <input
                    type="checkbox"
                    checked={adSenseConfig.enableHeaderBanner}
                    onChange={(e) => setAdSenseConfig({ ...adSenseConfig, enableHeaderBanner: e.target.checked })}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>Bannière Barre Latérale (Sidebar Banner)</span>
                  <input
                    type="checkbox"
                    checked={adSenseConfig.enableSidebarBanner}
                    onChange={(e) => setAdSenseConfig({ ...adSenseConfig, enableSidebarBanner: e.target.checked })}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span>Encart Sponsor Résultats Recherche (In-Feed Search Ads)</span>
                  <input
                    type="checkbox"
                    checked={adSenseConfig.enableResultsSpotlight}
                    onChange={(e) => setAdSenseConfig({ ...adSenseConfig, enableResultsSpotlight: e.target.checked })}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAdSense}
                className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/20"
              >
                {adSenseSaved ? 'Configuration AdSense Enregistrée !' : 'Enregistrer la Config Google AdSense'}
              </button>
            </div>

            {/* Live Banner Preview Simulator */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase">Aperçu du Bloc Publicitaire Google AdSense :</h4>
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Annonce Google Ads (Responsive 728x90)</span>
                <div className="text-sm font-extrabold text-slate-800">PUB : Boostez Votre Présence Web avec Google Workspace</div>
                <p className="text-xs text-slate-500">Offre spéciale réservée aux agences B2B — Sponsorisé via AdSense ({adSenseConfig.publisherId})</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 6: SECURITY & 2FA */}
      {activeSubTab === 'security' && (
        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
                  Sécurité & Authentification
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Double Authentification (2FA) & Chiffrement
                </h3>
              </div>
              <Lock className="w-8 h-8 text-teal-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Authentification à Deux Facteurs (2FA) :</span>
                  <input
                    type="checkbox"
                    checked={is2FAEnabled}
                    onChange={(e) => setIs2FAEnabled(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 cursor-pointer"
                  />
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Protégez votre compte avec un code temporaire envoyé par SMS ou Google Authenticator lors de chaque connexion.
                </p>
                <div className="text-[11px] font-bold text-teal-700">
                  {is2FAEnabled ? '✓ 2FA Activé & Sécurisé' : '⚠️ 2FA Désactivé (Non recommandé)'}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-extrabold text-slate-900">Chiffrement des Données & Protection Anti-Fraude :</span>
                <p className="text-slate-500 leading-relaxed">
                  Toutes vos clés et requêtes API sont chiffrées en AES-256 bits côté serveur avec limitation des taux de requêtes IP.
                </p>
                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Certificat SSL & Guard Active
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
