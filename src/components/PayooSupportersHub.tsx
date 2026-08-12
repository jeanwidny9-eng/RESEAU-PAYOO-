import React, { useState } from 'react';
import {
  HeartHandshake,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  Wallet,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Users,
  BadgeCheck,
  Search,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PayooSupporter, PayooUser } from '../types';

interface PayooSupportersHubProps {
  supporters: PayooSupporter[];
  currentUser: PayooUser;
  onAddSupporter: (record: Omit<PayooSupporter, 'id' | 'date' | 'tierBadge'>) => void;
}

export const PayooSupportersHub: React.FC<PayooSupportersHubProps> = ({
  supporters,
  currentUser,
  onAddSupporter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [supporterName, setSupporterName] = useState(currentUser.name || '');
  const [supporterCompany, setSupporterCompany] = useState('');
  const [supporterAmount, setSupporterAmount] = useState<number>(50000);
  const [supporterEmail, setSupporterEmail] = useState(currentUser.email || '');
  const [supporterPhone, setSupporterPhone] = useState(currentUser.phoneNumber || '');
  const [supporterReason, setSupporterReason] = useState('Je souhaite contribuer au développement du numérique et de la vidéo en Haïti.');
  const [supporterPaymentMethod, setSupporterPaymentMethod] = useState<'moncash' | 'natcash' | 'bank_transfer' | 'card'>('moncash');
  const [supporterPublicConsent, setSupporterPublicConsent] = useState<boolean>(true);
  const [thankYouMsg, setThankYouMsg] = useState<string | null>(null);

  const totalRaisedHTG = supporters.reduce((acc, s) => acc + s.amountHTG, 0);

  const publicSupporters = supporters.filter(s => {
    if (!s.isPublicConsent) return false;
    const matchesSearch =
      s.supporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.companyName && s.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.reason.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterTier === 'all') return matchesSearch;
    return matchesSearch && s.tierBadge.toLowerCase().includes(filterTier.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddSupporter({
      supporterName: supporterName || currentUser.name,
      companyName: supporterCompany || undefined,
      amountHTG: Number(supporterAmount),
      email: supporterEmail,
      contactNumber: supporterPhone,
      reason: supporterReason,
      paymentMethod: supporterPaymentMethod,
      isPublicConsent: supporterPublicConsent
    });

    setThankYouMsg(
      "Merci d'avoir choisi de soutenir PAYOO Rézo. Votre contribution aide à construire une plateforme numérique haïtienne innovante, à créer des opportunités pour les utilisateurs et à participer au développement technologique d'Haïti. Nous vous remercions pour votre confiance et votre engagement envers ce projet."
    );

    setTimeout(() => {
      setIsFormOpen(false);
    }, 6000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-white p-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-zinc-950 to-rose-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-md">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              Programme Nasyonal de Soutien PAYOO Rézo d'Haïti 🇭🇹
            </span>

            {currentUser.isSupporter && (
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-lg">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                Statut: Supporteur Officiel ({currentUser.supporterTier})
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Espace Supporteurs & Grands Contributeurs PAYOO 🇭🇹
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Chak kontribisyon ede konstrui premye rezèv teknolojik ak enfrastrikti videyo 100% Ayisyen, 
            kreye travay pou jèn yo, epi pèmèt kreyatè nou yo jwenn kòb sou MonCash ak NatCash!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-amber-500/30">
              <span className="text-[10px] font-extrabold text-amber-300 block uppercase">Fonds Récoltés</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                {totalRaisedHTG.toLocaleString()} HTG
              </span>
            </div>

            <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-amber-500/30">
              <span className="text-[10px] font-extrabold text-amber-300 block uppercase">Contributeurs</span>
              <span className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-1">
                <Users className="w-5 h-5 text-amber-400" />
                {supporters.length}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-zinc-950/80 p-3.5 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-amber-300 block uppercase">Action Directe</span>
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-black" />
                <span>Soutenir PAYOO Rézo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory of Major Contributors */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Tableau d'Honneur des Grands Contributeurs
            </h2>
            <p className="text-xs text-zinc-400">
              Supporteurs ayant donné leur autorisation publique
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Chercher contributeur..."
                className="bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-44 font-bold"
              />
            </div>

            <select
              value={filterTier}
              onChange={e => setFilterTier(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-extrabold focus:outline-none"
            >
              <option value="all">Tous les Badges</option>
              <option value="Visionnaire">Visionnaire Ayiti</option>
              <option value="Diamant">Patron Diamant</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {publicSupporters.map(supporter => (
            <motion.div
              key={supporter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-colors space-y-2.5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shrink-0">
                    <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-sm">
                      {supporter.supporterName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white flex items-center gap-1">
                      <span>{supporter.supporterName}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                    </h3>
                    {supporter.companyName && (
                      <p className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-400" />
                        {supporter.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-950/80 text-amber-300 border border-amber-500/40 shrink-0">
                  {supporter.tierBadge}
                </span>
              </div>

              <p className="text-xs text-zinc-300 italic bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 leading-relaxed">
                "{supporter.reason}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold pt-1 border-t border-zinc-800">
                <span className="text-emerald-400 font-extrabold text-xs">
                  💰 {supporter.amountHTG.toLocaleString()} HTG
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {supporter.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Direct Contribution Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-zinc-800"
              >
                ✕
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-white">Formulaire de Soutien PAYOO Rézo 🇭🇹</h2>
                <p className="text-xs text-zinc-400">
                  Aidez à financer le développement du numérique en Haïti
                </p>
              </div>

              {thankYouMsg ? (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950 to-zinc-950 border border-amber-500 space-y-3 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-xs text-amber-100 italic border-l-2 border-amber-400 pl-3 text-left bg-zinc-900/80 p-3 rounded-r-xl">
                    "{thankYouMsg}"
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    Votre badge de Supporteur Officiel est activé!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                      Nom complet du supporteur *
                    </label>
                    <input
                      type="text"
                      required
                      value={supporterName}
                      onChange={e => setSupporterName(e.target.value)}
                      placeholder="Eg: Jean Widny Papas"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                      Nom de l'entreprise (si applicable)
                    </label>
                    <input
                      type="text"
                      value={supporterCompany}
                      onChange={e => setSupporterCompany(e.target.value)}
                      placeholder="Eg: Papas Tech Media Inc."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                      Montant du soutien choisi *
                    </label>
                    <select
                      value={supporterAmount}
                      onChange={e => setSupporterAmount(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-black focus:outline-none"
                    >
                      <option value={10000}>10 000 gourdes (HTG)</option>
                      <option value={25000}>25 000 gourdes (HTG)</option>
                      <option value={50000}>50 000 gourdes (HTG)</option>
                      <option value={100000}>100 000 gourdes (HTG)</option>
                      <option value={1000000}>1 000 000 gourdes (HTG)</option>
                      <option value={5000000}>5 000 000 gourdes (HTG)</option>
                      <option value={10000000}>10 000 000 gourdes (HTG)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                        Adresse email *
                      </label>
                      <input
                        type="email"
                        required
                        value={supporterEmail}
                        onChange={e => setSupporterEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                        Numéro de contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={supporterPhone}
                        onChange={e => setSupporterPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                      Pourquoi souhaitez-vous soutenir PAYOO Rézo ? *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={supporterReason}
                      onChange={e => setSupporterReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-amber-300 block mb-1 uppercase tracking-wider">
                      Méthode de paiement *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSupporterPaymentMethod('moncash')}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-black border ${
                          supporterPaymentMethod === 'moncash' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        MonCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setSupporterPaymentMethod('natcash')}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-black border ${
                          supporterPaymentMethod === 'natcash' ? 'bg-blue-950 border-blue-500 text-blue-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        NatCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setSupporterPaymentMethod('bank_transfer')}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-black border ${
                          supporterPaymentMethod === 'bank_transfer' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        Unibank/SOGEBANK
                      </button>
                      <button
                        type="button"
                        onClick={() => setSupporterPaymentMethod('card')}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-black border ${
                          supporterPaymentMethod === 'card' ? 'bg-purple-950 border-purple-500 text-purple-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        Carte Visa/Master
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 pt-1 text-[10px] text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supporterPublicConsent}
                      onChange={e => setSupporterPublicConsent(e.target.checked)}
                      className="accent-amber-500 w-3.5 h-3.5 mt-0.5"
                    />
                    <span>Autoriser la publication dans le tableau d'honneur des grands contributeurs.</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4 text-black" />
                    <span>Confirmer la Contribution</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
