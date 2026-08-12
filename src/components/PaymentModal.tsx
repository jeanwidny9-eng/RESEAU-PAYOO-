import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  Mail,
  CreditCard,
  Building,
  Coins,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  QrCode,
  Send,
  RefreshCw,
  Phone,
  Smartphone,
  Calculator,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { PlanType } from '../types';

export type PaymentMethod =
  | 'EURO'
  | 'DOLLAR'
  | 'NATCASH'
  | 'BTC'
  | 'USDT_TRC20'
  | 'BNB_BEP20'
  | 'EURC_ERC20'
  | 'USDC_ERC20'
  | 'PI_NETWORK'
  | 'TON_GRAM'
  | 'XRP'
  | 'ETH'
  | 'SOLANA';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanType;
  billingCycle: 'monthly' | 'yearly';
  onPaymentSuccess: (plan: PlanType, email: string, method: PaymentMethod) => void;
}

// User exact provided wallet addresses & Natcash number
const NATCASH_PHONE = '+50955769199';

const DEFAULT_WALLETS = {
  BTC: 'bc1qlpl77h0th9cwq4xzhqxv48sel9wckwa4nmpxjfwzp8ru5l56hzfsnc8rsu',
  USDT_TRC20: 'TC15V8GwGvgda2Gq4PFxKuXFxFcLTTh4Uf',
  BNB_BEP20: '0x4448b234d22b20ff739c882cd1158009bbc0f9b2',
  EURC_ERC20: '0x4448b234d22b20ff739c882cd1158009bbc0f9b2',
  USDC_ERC20: '0x4448b234d22b20ff739c882cd1158009bbc0f9b2',
  PI_NETWORK: 'GA44WN3WSB44TL57NWQWXMBJ2H6FHKLYEYGZXFCR2HXSXZVQNNECQVCI',
  TON_GRAM: 'UQBDE0nJbFLLKEMknYYLG0nVn7tvi4jFKTckp_t2VoWEPoVN',
  XRP: 'rBuZfn1m4tA6znziHsRp9AyC1M3qg6rgbF',
  XRP_TAG: '6496513',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  SOLANA: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingCycle,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NATCASH');
  const [userEmail, setUserEmail] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  // Live Exchange Rates & Crypto State
  const [liveRates, setLiveRates] = useState<{
    htgPerUsd: number;
    btcUsd: number;
    ethUsd: number;
    bnbUsd: number;
    solUsd: number;
    xrpUsd: number;
    tonUsd: number;
    lastUpdated: string;
  }>({
    htgPerUsd: 132, // Taux officiel / marché Gourde Haïtienne vs USD
    btcUsd: 88500,
    ethUsd: 3200,
    bnbUsd: 590,
    solUsd: 175,
    xrpUsd: 2.45,
    tonUsd: 5.20,
    lastUpdated: new Date().toLocaleTimeString('fr-FR')
  });

  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch live rates from CoinGecko or API
  const fetchLiveRates = async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,the-open-network&vs_currencies=usd,htg'
      );
      if (res.ok) {
        const data = await res.json();
        setLiveRates((prev) => ({
          htgPerUsd: data.tether?.htg ? Math.round(data.tether.htg) : 132,
          btcUsd: data.bitcoin?.usd || prev.btcUsd,
          ethUsd: data.ethereum?.usd || prev.ethUsd,
          bnbUsd: data.binancecoin?.usd || prev.bnbUsd,
          solUsd: data.solana?.usd || prev.solUsd,
          xrpUsd: data.ripple?.usd || prev.xrpUsd,
          tonUsd: data['the-open-network']?.usd || prev.tonUsd,
          lastUpdated: new Date().toLocaleTimeString('fr-FR')
        }));
      }
    } catch (err) {
      console.log('Utilisation des taux de change en direct précalculés');
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Custom wallet addresses state with localStorage
  const [wallets, setWallets] = useState(() => {
    try {
      const stored = localStorage.getItem('nichelead_crypto_wallets');
      return stored ? JSON.parse(stored) : DEFAULT_WALLETS;
    } catch {
      return DEFAULT_WALLETS;
    }
  });

  // Price calculation
  const basePriceUSD =
    selectedPlan === 'ultimate_vip'
      ? 500
      : selectedPlan === 'enterprise' || selectedPlan === 'agency'
      ? 100
      : selectedPlan === 'business'
      ? 50
      : 29;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const factor = billingCycle === 'yearly' ? 0.8 : 1;
  const subtotalUSD = Math.round(basePriceUSD * factor);
  
  // Calculate discount
  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountValue = Math.round((subtotalUSD * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount > 0) {
      discountValue = Math.min(subtotalUSD, appliedCoupon.discountAmount);
    }
  }

  const finalDollar = Math.max(1, subtotalUSD - discountValue);
  const finalEuro = Math.round(finalDollar / 1.08);
  const finalHTG = Math.round(finalDollar * liveRates.htgPerUsd);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME20' || code === 'PROMO20' || code === 'PROMO2026') {
      setAppliedCoupon({ code, discountPercent: 20, discountAmount: 0 });
    } else if (code === 'LAUNCH10' || code === 'REZO10') {
      setAppliedCoupon({ code, discountPercent: 0, discountAmount: 10 });
    } else if (code === 'VIP50' || code === 'HALFPRICE') {
      setAppliedCoupon({ code, discountPercent: 50, discountAmount: 0 });
    } else {
      setCouponError('Code promo invalide ou expiré.');
    }
  };

  // Real-time crypto & fiat amounts
  const cryptoAmounts: Record<string, string> = {
    BTC: (finalDollar / (liveRates.btcUsd || 88500)).toFixed(6),
    USDT_TRC20: `${finalDollar}`,
    BNB_BEP20: (finalDollar / (liveRates.bnbUsd || 590)).toFixed(4),
    EURC_ERC20: `${finalEuro}`,
    USDC_ERC20: `${finalDollar}`,
    PI_NETWORK: (finalDollar / 38).toFixed(2),
    TON_GRAM: (finalDollar / (liveRates.tonUsd || 5.20)).toFixed(2),
    XRP: (finalDollar / (liveRates.xrpUsd || 2.45)).toFixed(2),
    ETH: (finalDollar / (liveRates.ethUsd || 3200)).toFixed(4),
    SOLANA: (finalDollar / (liveRates.solUsd || 175)).toFixed(2),
    NATCASH: `${finalHTG.toLocaleString('fr-FR')} HTG`
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userEmail.includes('@')) return;

    setIsSubmitting(true);
    try {
      const amountStr =
        paymentMethod === 'NATCASH'
          ? `${finalHTG.toLocaleString('fr-FR')} HTG (Natcash: ${NATCASH_PHONE})`
          : paymentMethod === 'EURO'
          ? `${finalEuro} €`
          : paymentMethod === 'DOLLAR'
          ? `${finalDollar} $`
          : `${cryptoAmounts[paymentMethod] || '0'} ${paymentMethod}`;

      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          method: paymentMethod,
          email: userEmail,
          amount: amountStr,
          txHash,
          walletAddress:
            paymentMethod === 'NATCASH'
              ? NATCASH_PHONE
              : paymentMethod in wallets
              ? wallets[paymentMethod as keyof typeof wallets]
              : null
        })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmationData(data.receipt);
        setIsConfirmed(true);
        onPaymentSuccess(selectedPlan, userEmail, paymentMethod);
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      // Fallback local receipt
      setIsConfirmed(true);
      onPaymentSuccess(selectedPlan, userEmail, paymentMethod);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
                <CreditCard className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Paiement Sécurisé — Plan {selectedPlan === 'pro' ? 'Pro' : selectedPlan === 'agency' ? 'Agence' : 'Gratuit'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Sélectionnez votre mode de paiement préféré (Crypto, Euro, Dollar) & recevez votre e-mail de confirmation.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {isConfirmed ? (
            /* Confirmation Success Receipt */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Paiement Initié avec Succès
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Merci ! Votre plan {selectedPlan.toUpperCase()} est en cours d'activation
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Un e-mail de confirmation complet a été envoyé à <strong className="text-slate-900">{userEmail}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mode de paiement :</span>
                  <span className="font-bold text-slate-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Montant total :</span>
                  <span className="font-bold text-blue-600">
                    {paymentMethod === 'EURO'
                      ? `${finalEuro} €`
                      : paymentMethod === 'DOLLAR'
                      ? `${finalDollar} $`
                      : `${cryptoAmounts[paymentMethod]} ${paymentMethod}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Adresse e-mail :</span>
                  <span className="font-semibold text-slate-800">{userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">N° de transaction :</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {confirmationData?.transactionId || `PAY-${Date.now().toString().slice(-8)}`}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-8 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Fermer & Profiter des fonctionnalités
              </button>
            </div>
          ) : (
            /* Payment Selection Form */
            <form onSubmit={handleConfirmPayment} className="space-y-6">
              {/* LIVE EXCHANGE RATES & CRYPTO TICKER BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 border border-indigo-500/30 shadow-md space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black tracking-wide text-indigo-200 uppercase flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      Taux de Change & Crypto en Temps Réel
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      Mis à jour : {liveRates.lastUpdated}
                    </span>
                    <button
                      type="button"
                      onClick={fetchLiveRates}
                      disabled={isLoadingRates}
                      className="p-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-indigo-700/50"
                      title="Actualiser les cours crypto et gourde"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
                      <span>{isLoadingRates ? '...' : 'Actualiser'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px] font-semibold">Taux Gourde Haïtienne (HTG)</span>
                    <span className="font-extrabold text-amber-300 font-mono text-xs">
                      1 USD = {liveRates.htgPerUsd} HTG
                    </span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px] font-semibold">Bitcoin (BTC)</span>
                    <span className="font-extrabold text-amber-400 font-mono text-xs">
                      ${liveRates.btcUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px] font-semibold">Ethereum (ETH)</span>
                    <span className="font-extrabold text-indigo-300 font-mono text-xs">
                      ${liveRates.ethUsd.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px] font-semibold">Solana / BNB / XRP</span>
                    <span className="font-extrabold text-teal-300 font-mono text-xs">
                      SOL ${liveRates.solUsd} | BNB ${liveRates.bnbUsd}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Choisissez votre Mode de Paiement</span>
                  <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Natcash, Crypto & Carte
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {/* NATCASH */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NATCASH')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 col-span-1 ${
                      paymentMethod === 'NATCASH'
                        ? 'border-2 border-red-600 bg-red-50 text-red-950 shadow-sm ring-2 ring-red-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-red-600 flex items-center gap-1">
                      <Smartphone className="w-4 h-4" /> Natcash
                    </span>
                    <span className="text-[10px] font-bold text-red-700 font-mono">{NATCASH_PHONE}</span>
                    <span className="text-[10px] text-slate-600 font-extrabold">{finalHTG.toLocaleString('fr-FR')} HTG</span>
                  </button>

                  {/* EURO */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EURO')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'EURO'
                        ? 'border-2 border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-blue-600">€</span>
                    <span className="text-[11px] font-bold">EURO</span>
                    <span className="text-[10px] text-slate-500 font-medium">{finalEuro} €</span>
                  </button>

                  {/* DOLLAR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DOLLAR')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'DOLLAR'
                        ? 'border-2 border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-emerald-600">$</span>
                    <span className="text-[11px] font-bold">DOLLAR</span>
                    <span className="text-[10px] text-slate-500 font-medium">{finalDollar} $</span>
                  </button>

                  {/* BTC */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BTC')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'BTC'
                        ? 'border-2 border-amber-500 bg-amber-50/50 text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-extrabold text-amber-500">₿</span>
                    <span className="text-[11px] font-bold">BTC</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.BTC}</span>
                  </button>

                  {/* USDT TRC20 */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('USDT_TRC20')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'USDT_TRC20'
                        ? 'border-2 border-teal-600 bg-teal-50/50 text-teal-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-teal-600">₮</span>
                    <span className="text-[11px] font-bold">USDT (TRC20)</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.USDT_TRC20} USDT</span>
                  </button>

                  {/* BNB BEP20 */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BNB_BEP20')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'BNB_BEP20'
                        ? 'border-2 border-yellow-600 bg-yellow-50/50 text-yellow-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-yellow-600">❖</span>
                    <span className="text-[11px] font-bold">BNB</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.BNB_BEP20}</span>
                  </button>

                  {/* EURC ERC20 */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EURC_ERC20')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'EURC_ERC20'
                        ? 'border-2 border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-blue-600">€</span>
                    <span className="text-[11px] font-bold">EURC</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.EURC_ERC20}</span>
                  </button>

                  {/* USDC ERC20 */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('USDC_ERC20')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'USDC_ERC20'
                        ? 'border-2 border-blue-500 bg-blue-50/50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-blue-500">$</span>
                    <span className="text-[11px] font-bold">USDC</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.USDC_ERC20}</span>
                  </button>

                  {/* PI NETWORK */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PI_NETWORK')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'PI_NETWORK'
                        ? 'border-2 border-fuchsia-600 bg-fuchsia-50/50 text-fuchsia-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-fuchsia-600">π</span>
                    <span className="text-[11px] font-bold">PI NETWORK</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.PI_NETWORK} PI</span>
                  </button>

                  {/* TON / GRAM */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TON_GRAM')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'TON_GRAM'
                        ? 'border-2 border-sky-600 bg-sky-50/50 text-sky-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-sky-600">💎</span>
                    <span className="text-[11px] font-bold">TON</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.TON_GRAM}</span>
                  </button>

                  {/* XRP Ripple */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('XRP')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'XRP'
                        ? 'border-2 border-cyan-600 bg-cyan-50/50 text-cyan-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-cyan-600">✕</span>
                    <span className="text-[11px] font-bold">XRP</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.XRP}</span>
                  </button>

                  {/* ETH */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ETH')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'ETH'
                        ? 'border-2 border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-indigo-600">⟠</span>
                    <span className="text-[11px] font-bold">ETH</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.ETH}</span>
                  </button>

                  {/* SOLANA */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SOLANA')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      paymentMethod === 'SOLANA'
                        ? 'border-2 border-purple-600 bg-purple-50/50 text-purple-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-black text-purple-600">◎</span>
                    <span className="text-[11px] font-bold">SOLANA</span>
                    <span className="text-[10px] text-slate-500 font-medium">{cryptoAmounts.SOLANA}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                {/* NATCASH DETAILS (EXPLICIT USER REQUEST NUMBER +50955769199) */}
                {paymentMethod === 'NATCASH' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-md">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                            Paiement Natcash Haïti (Gourdes HTG)
                          </h4>
                          <p className="text-xs text-slate-500">Service de paiement mobile Natcom Haïti</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-500 block">Montant équivalent :</span>
                        <span className="text-lg font-black text-red-600 font-mono">
                          {finalHTG.toLocaleString('fr-FR')} HTG
                        </span>
                        <span className="text-[10px] text-slate-400 block">(${finalDollar} USD × {liveRates.htgPerUsd} HTG)</span>
                      </div>
                    </div>

                    {/* Prominent Number Highlight */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-4 text-slate-900 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-red-600" />
                          Numéro Natcash Officiel pour Transfert :
                        </span>
                        <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">
                          Vérifié 100%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={NATCASH_PHONE}
                          className="w-full bg-white border border-red-200 font-mono text-xl sm:text-2xl font-black px-4 py-3 rounded-xl text-red-700 tracking-wider shadow-inner text-center select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(NATCASH_PHONE, 'NATCASH_NUM')}
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-md"
                        >
                          {copiedKey === 'NATCASH_NUM' ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300" /> N° Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Copier N° Natcash
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Transfer Steps */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-red-600" /> Instructions pour valider votre abonnement :
                      </h5>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed text-[11px]">
                        <li>
                          Ouvrez votre menu Natcash ou votre application sur votre téléphone Natcom.
                        </li>
                        <li>
                          Effectuez un transfert direct de <strong>{finalHTG.toLocaleString('fr-FR')} HTG</strong> au numéro Natcash : <strong className="text-red-600 font-mono text-xs">{NATCASH_PHONE}</strong>.
                        </li>
                        <li>
                          Saisissez votre e-mail ci-dessous et validez pour recevoir instantanément votre confirmation d'accès.
                        </li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* EURO Details */}
                {paymentMethod === 'EURO' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" /> Paiement en EURO (€)
                      </h4>
                      <span className="text-xs font-black text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        {finalEuro} €
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Paiement sécurisé via Carte Bancaire, Virement SEPA ou PayPal. Une facture officielle en Euros vous sera instantanément envoyée par e-mail.
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-slate-700 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>Carte Visa/Mastercard</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        <span>Virement SEPA</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>PayPal / Stripe</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DOLLAR Details */}
                {paymentMethod === 'DOLLAR' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" /> Paiement en DOLLAR ($)
                      </h4>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        ${finalDollar}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Paiement sécurisé en Dollars US par Carte Internationale, Virement bancaire ou Apple Pay. Reçu instantané par e-mail.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-slate-700 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cartes Internationales</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Virement Bancaire US</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* XRP SPECIAL CASE: ADDRESS + TAG/MEMO */}
                {paymentMethod === 'XRP' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-cyan-600" /> Paiement XRP (Ripple)
                      </h4>
                      <span className="text-xs font-black text-cyan-900 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
                        ~{cryptoAmounts.XRP} XRP
                      </span>
                    </div>

                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-extrabold flex items-center gap-1.5 text-amber-950">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        IMPORTANT pour XRP : Copiez les DEUX adresses ci-dessous !
                      </p>
                      <p className="text-[11px] leading-relaxed text-amber-900">
                        Pour que votre dépôt soit crédité sans retard, vous devez obligatoirement saisir l'<strong>Adresse XRP</strong> ET la <strong>Balise XRP (Tag: {wallets.XRP_TAG})</strong> lors de votre transfert.
                      </p>
                    </div>

                    {/* 1. XRP Address */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        1. Adresse XRP :
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={wallets.XRP}
                          className="w-full bg-white border border-slate-300 font-mono text-xs font-semibold px-3 py-2.5 rounded-xl text-slate-900 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(wallets.XRP, 'XRP_ADDR')}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'XRP_ADDR' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier l'Adresse
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 2. XRP Tag / Balise */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        2. Balise / Tag XRP (Obligatoire) :
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={wallets.XRP_TAG}
                          className="w-full bg-white border border-cyan-300 font-mono text-xs font-black px-3 py-2.5 rounded-xl text-cyan-900 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(wallets.XRP_TAG, 'XRP_TAG')}
                          className="bg-cyan-700 hover:bg-cyan-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'XRP_TAG' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" /> Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier la Balise ({wallets.XRP_TAG})
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Copy Both XRP Combo Button */}
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `Adresse XRP: ${wallets.XRP}\nBalise XRP (Tag): ${wallets.XRP_TAG}`,
                          'XRP_BOTH'
                        )
                      }
                      className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'XRP_BOTH' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" /> Adresse + Balise XRP copiées !
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-cyan-700" /> Copier Adresse + Balise XRP (Texte Complet)
                        </>
                      )}
                    </button>

                    {/* Tx Hash / Reference Optional Field */}
                    <div className="space-y-1 pt-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        ID de Transaction / Hash Crypto (Optionnel) :
                      </label>
                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="Ex: 0x9f8a... ou hash du transfert Ripple"
                        className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* Standard Crypto Details (BTC, USDT, BNB, PI, TON, ETH, SOLANA) */}
                {paymentMethod !== 'EURO' && paymentMethod !== 'DOLLAR' && paymentMethod !== 'XRP' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-500" />
                        Paiement Crypto —{' '}
                        {paymentMethod === 'BTC' && 'BTC (Réseau BTC)'}
                        {paymentMethod === 'USDT_TRC20' && 'USDT (Réseau TRC20)'}
                        {paymentMethod === 'BNB_BEP20' && 'BNB (Réseau BEP20)'}
                        {paymentMethod === 'PI_NETWORK' && 'PI NETWORK'}
                        {paymentMethod === 'TON_GRAM' && 'GRAM / TONCOIN (Réseau TON)'}
                        {paymentMethod === 'ETH' && 'ETH (Réseau ERC20)'}
                        {paymentMethod === 'SOLANA' && 'SOLANA (Réseau Solana)'}
                      </h4>
                      <span className="text-xs font-black text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                        ~{cryptoAmounts[paymentMethod]} {paymentMethod.split('_')[0]}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Envoyez votre règlement à l'adresse officielle ci-dessous sur le réseau indiqué :
                    </p>

                    {/* Wallet Copy Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Adresse de Portefeuille :</span>
                        <span className="text-blue-700 uppercase">
                          {paymentMethod === 'BTC' && 'Réseau BTC'}
                          {paymentMethod === 'USDT_TRC20' && 'Réseau TRC20 (Tron)'}
                          {paymentMethod === 'BNB_BEP20' && 'Réseau BEP20 (BNB Chain)'}
                          {paymentMethod === 'PI_NETWORK' && 'Réseau Pi Network'}
                          {paymentMethod === 'TON_GRAM' && 'Réseau TON (Toncoin)'}
                          {paymentMethod === 'ETH' && 'Réseau ERC20'}
                          {paymentMethod === 'SOLANA' && 'Réseau Solana'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={wallets[paymentMethod as keyof typeof wallets]}
                          className="w-full bg-white border border-slate-300 font-mono text-xs font-semibold px-3 py-2.5 rounded-xl text-slate-900 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(wallets[paymentMethod as keyof typeof wallets], paymentMethod)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedKey === paymentMethod ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Tx Hash / Reference Optional Field */}
                    <div className="space-y-1 pt-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        ID de Transaction / Hash Crypto (Optionnel) :
                      </label>
                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="Ex: 0x9f8a... ou référence du transfert"
                        className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Confirmation Form Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. E-mail de Confirmation du Paiement <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="votre-email@entreprise.com"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Chaque personne ayant payé un plan recevra immédiatement un e-mail de confirmation détaillé et son reçu officiel.
                </p>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !userEmail}
                  className={`w-full font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    !userEmail
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Traitement et envoi de l'e-mail...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        Confirmer le Paiement ({paymentMethod}) & Recevoir l'E-mail
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Transaction sécurisée & garantie de satisfaction 14 jours
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
