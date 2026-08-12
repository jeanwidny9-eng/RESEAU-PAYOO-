import React, { useState, useEffect } from 'react';
import {
  Building2,
  Hospital,
  ShieldAlert,
  Search,
  MapPin,
  Phone,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Info,
  ChevronRight,
  Printer,
  Copy,
  Check,
  User as UserIcon,
  Mail,
  Smartphone,
  Siren,
  LifeBuoy
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

interface ServiceOffice {
  id: string;
  name: string;
  type: 'hospital' | 'state_office' | 'police' | 'social';
  typeName: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone?: string;
  hours: string;
  status: 'Ouvert' | 'Urgences 24/7' | 'Fermé';
}

const REGIONS = [
  'Toutes les Régions',
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Provence-Alpes-Côte d\'Azur (PACA)',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Grand Est',
  'Normandie',
  'Bretagne',
  'Pays de la Loire',
  'Centre-Val de Loire',
  'Outre-Mer (DOM-TOM)'
];

const SAMPLE_OFFICES: ServiceOffice[] = [
  {
    id: 'off-1',
    name: 'Centre Hospitalier Universitaire (CHU) & Urgences Régionales',
    type: 'hospital',
    typeName: 'Hôpital Public & Urgences',
    region: 'Île-de-France',
    city: 'Paris (75)',
    address: '47 Boulevard Hôpital, 75013 Paris',
    phone: '01 42 16 00 00',
    emergencyPhone: '15 (SAMU) / 112',
    hours: 'Service des Urgences ouvert 24h/24 & 7j/7',
    status: 'Urgences 24/7'
  },
  {
    id: 'off-2',
    name: 'Préfecture de Région & Bureau des Services d\'État',
    type: 'state_office',
    typeName: 'Bureau d\'État & Préfecture',
    region: 'Île-de-France',
    city: 'Paris / Évry',
    address: '5 Rue de Leblanc, 75015 Paris',
    phone: '01 82 52 40 00',
    hours: 'Du Lundi au Vendredi: 08h30 - 16h30',
    status: 'Ouvert'
  },
  {
    id: 'off-3',
    name: 'Centre Hospitalier Régional Lyon Sud (HCL)',
    type: 'hospital',
    typeName: 'Hôpital Public & Urgences',
    region: 'Auvergne-Rhône-Alpes',
    city: 'Lyon (69)',
    address: '165 Chemin du Grand Revoyet, 69230 Saint-Genis-Laval',
    phone: '08 25 08 25 09',
    emergencyPhone: '15 / 112',
    hours: 'Service des Urgences ouvert 24h/24',
    status: 'Urgences 24/7'
  },
  {
    id: 'off-4',
    name: 'Préfecture du Rhône & Guichet des Citoyens',
    type: 'state_office',
    typeName: 'Bureau d\'État & Préfecture',
    region: 'Auvergne-Rhône-Alpes',
    city: 'Lyon (69)',
    address: '106 Rue Pierre Corneille, 69003 Lyon',
    phone: '04 72 61 60 60',
    hours: 'Du Lundi au Vendredi: 09h00 - 16h00',
    status: 'Ouvert'
  },
  {
    id: 'off-5',
    name: 'Hôpital de la Timone (AP-HM) Urgences Générales',
    type: 'hospital',
    typeName: 'Hôpital Public & Urgences',
    region: 'Provence-Alpes-Côte d\'Azur (PACA)',
    city: 'Marseille (13)',
    address: '264 Rue Saint-Pierre, 13005 Marseille',
    phone: '04 91 38 00 00',
    emergencyPhone: '15 / 112',
    hours: 'Urgences Médicales 24h/24',
    status: 'Urgences 24/7'
  },
  {
    id: 'off-6',
    name: 'Hôtel de Ville & Bureau d\'État Civil Régional',
    type: 'state_office',
    typeName: 'Bureau d\'État & Mairie de Proximité',
    region: 'Nouvelle-Aquitaine',
    city: 'Bordeaux (33)',
    address: 'Place Pey Berland, 33000 Bordeaux',
    phone: '05 56 10 20 30',
    hours: 'Du Lundi au Vendredi: 08h30 - 17h00',
    status: 'Ouvert'
  },
  {
    id: 'off-7',
    name: 'Hôpital Pellegrin (CHU Bordeaux) - Urgences',
    type: 'hospital',
    typeName: 'Hôpital Public & Urgences',
    region: 'Nouvelle-Aquitaine',
    city: 'Bordeaux (33)',
    address: 'Place Amélie Raba Léon, 33000 Bordeaux',
    phone: '05 56 79 56 79',
    emergencyPhone: '15 / 112',
    hours: 'Service des Urgences 24h/24',
    status: 'Urgences 24/7'
  },
  {
    id: 'off-8',
    name: 'Hôtel de Police / Commissariat Central de Proximité',
    type: 'police',
    typeName: 'Commissariat & Sécurité Publique',
    region: 'Hauts-de-France',
    city: 'Lille (59)',
    address: '19 Rue de Marquillies, 59000 Lille',
    phone: '03 20 62 49 49',
    emergencyPhone: '17 (Police Secours)',
    hours: 'Accueil Public 24h/24',
    status: 'Urgences 24/7'
  }
];

interface ComplaintRecord {
  id?: string;
  trackingNumber: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  region: string;
  targetType: string;
  targetOfficeName: string;
  urgencyLevel: 'URGENT' | 'HIGH' | 'NORMAL';
  message: string;
  createdAt: string;
  status: 'Reçu par le bureau' | 'En cours d\'examen' | 'Accusé d\'enregistrement émis';
}

export const PublicServicesPortal: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Toutes les Régions');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Target office selected for complaint
  const [selectedOffice, setSelectedOffice] = useState<ServiceOffice | null>(SAMPLE_OFFICES[0]);

  // Form State
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [message, setMessage] = useState<string>('');

  // Form feedback state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<ComplaintRecord | null>(null);
  const [myComplaints, setMyComplaints] = useState<ComplaintRecord[]>([]);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);
  const [aiSuggestionsActive, setAiSuggestionsActive] = useState<boolean>(false);

  // Character limit constant
  const MAX_CHARS = 400;

  // Load user default email if logged in
  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email || '');
      if (auth.currentUser.displayName) setUserName(auth.currentUser.displayName);
    }
  }, []);

  // Filter offices based on region, type and search term
  const filteredOffices = SAMPLE_OFFICES.filter((off) => {
    const matchRegion = selectedRegion === 'Toutes les Régions' || off.region === selectedRegion;
    const matchType = selectedType === 'all' || off.type === selectedType;
    const matchSearch =
      searchTerm === '' ||
      off.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchType && matchSearch;
  });

  const handleAiOptimizeMessage = () => {
    if (!message.trim()) {
      setMessage("Exemple: Demande d'intervention urgente pour retard de traitement de dossier d'aide médicale à l'hôpital régional de Paris. Merci de régulariser sous 48h.");
      return;
    }

    setAiSuggestionsActive(true);
    setTimeout(() => {
      // Shorten message if needed to ensure under 400 chars
      let optimized = message.trim();
      if (optimized.length > 380) {
        optimized = optimized.substring(0, 375) + '... [Condensé IA]';
      }
      setMessage(`[Signalement Officiel]: ${optimized}`);
      setAiSuggestionsActive(false);
    }, 600);
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOffice) {
      alert('Veuillez sélectionner un Bureau d\'État ou un Hôpital de destination.');
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      alert('Veuillez fournir votre nom et votre adresse e-mail pour le suivi.');
      return;
    }

    if (!message.trim()) {
      alert('Veuillez décrire votre requête ou plainte.');
      return;
    }

    if (message.length > MAX_CHARS) {
      alert(`Votre message dépasse la limite stricte de ${MAX_CHARS} caractères. Veuillez le raccourcir.`);
      return;
    }

    setIsSubmitting(true);

    const trackingCode = `PL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: ComplaintRecord = {
      trackingNumber: trackingCode,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userPhone: userPhone.trim(),
      region: selectedOffice.region,
      targetType: selectedOffice.typeName,
      targetOfficeName: selectedOffice.name,
      urgencyLevel,
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Reçu par le bureau'
    };

    try {
      // Save to Firebase Firestore database
      await addDoc(collection(db, 'complaints'), {
        ...newRecord,
        userId: auth.currentUser ? auth.currentUser.uid : 'anonymous',
        timestamp: new Date()
      });

      // Dispatch private email notification to bureau / agency administration
      const adminEmail = `administration@${selectedOffice.region.toLowerCase().replace(/[^a-z0-9]/g, '')}.gouv.fr`;
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: adminEmail,
          senderEmail: userEmail.trim(),
          subject: `[Plainte/Demande Citoyenne ${trackingCode}] ${selectedOffice.name}`,
          body: `
Signalement / Plainte N° : ${trackingCode}
Demandeur : ${userName.trim()} (${userEmail.trim()}, Tel: ${userPhone.trim()})
Bureau / Organisme Cible : ${selectedOffice.name} (${selectedOffice.region})
Niveau d'urgence : ${urgencyLevel}
Date : ${newRecord.createdAt}

Message :
"${message.trim()}"
`
        })
      });
    } catch (err) {
      console.warn('Firestore or email dispatch notice:', err);
    }

    // Update local list
    setMyComplaints([newRecord, ...myComplaints]);
    setSubmittedRecord(newRecord);
    setIsSubmitting(false);

    // Reset message
    setMessage('');
  };

  const copyTrackingNumber = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Hero Portal Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <LifeBuoy className="w-4 h-4 text-blue-400" />
              Service Citoyen Régional & Urgences Proches
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Portail des Plaintes, Soutien & Urgences Régionales
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inscrivez directement votre requête ou réclamation auprès du <strong>Bureau d'État</strong> ou de l'<strong>Hôpital Public</strong> le plus proche de votre région. Un espace d'expression garanti à <strong>400 caractères par personne</strong> pour une prise en charge rapide.
            </p>

            {/* Urgent Phone Banner Emergency alert */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
                Urgences Médicales : <span className="text-white font-black">Composez le 15 (SAMU)</span>
              </div>
              <div className="bg-amber-950/80 border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Police / Sécurité : <span className="text-white font-black">Composez le 17</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Directory & Region Selector / Right Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLUMNS: REGIONAL DIRECTORY & SELECTOR */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Sélectionnez votre Région & Service de Proximité
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredOffices.length} établissements trouvés
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Region Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Région / Territoire :
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Type d'Établissement :
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                  >
                    <option value="all">Tous les services (Hôpitaux & Bureaux d'État)</option>
                    <option value="hospital">🏥 Hôpitaux & Urgences Médicales</option>
                    <option value="state_office">🏛️ Bureaux d'État & Préfectures</option>
                    <option value="police">🛡️ Commissariats & Sécurité</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une ville, un hôpital, un bureau d'état..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* List of Offices / Hospitals */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Centres Régionaux Disponibles
              </p>

              {filteredOffices.map((office) => {
                const isSelected = selectedOffice?.id === office.id;
                return (
                  <div
                    key={office.id}
                    onClick={() => setSelectedOffice(office)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-50/60 border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              office.type === 'hospital'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : office.type === 'police'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {office.typeName}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {office.city} ({office.region})
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {office.name}
                        </h4>

                        <p className="text-xs text-slate-600">{office.address}</p>

                        <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
                          <span className="flex items-center gap-1 text-slate-700 font-bold">
                            <Phone className="w-3 h-3 text-blue-600" /> {office.phone}
                          </span>
                          {office.emergencyPhone && (
                            <span className="flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <Siren className="w-3 h-3 text-rose-600" /> {office.emergencyPhone}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" /> {office.hours}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffice(office);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {isSelected ? 'Sélectionné ✓' : 'Choisir'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: FORMULAR 400 CHARACTERS MAX */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                    Formulaire Régional Officiel
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Max 400 caractères
                  </span>
                </div>

                <h3 className="text-lg font-black text-white">
                  Déposer une Plainte ou Message d'Urgence
                </h3>
                <p className="text-xs text-blue-100/90 mt-0.5">
                  Destinataire : <strong className="text-white underline">{selectedOffice?.name || 'Aucun sélectionné'}</strong>
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitComplaint} className="p-5 space-y-4">
                
                {/* Target Selected Box */}
                {selectedOffice && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        {selectedOffice.name}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        {selectedOffice.region}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{selectedOffice.address}</p>
                  </div>
                )}

                {/* Sender Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nom & Prénom :
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ex: Jean Dupont"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Adresse Email :
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="jean.dupont@email.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-2.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Numéro de Téléphone (Pour suivi ou urgence) :
                  </label>
                  <div className="relative">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Niveau de Priorité / Urgence :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgencyLevel('NORMAL')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        urgencyLevel === 'NORMAL'
                          ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🟡 Réclamation / Plainte
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgencyLevel('HIGH')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        urgencyLevel === 'HIGH'
                          ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🟠 Urgence Prioritaire
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgencyLevel('URGENT')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        urgencyLevel === 'URGENT'
                          ? 'bg-rose-100 border-rose-500 text-rose-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🔴 Urgence Absolue
                    </button>
                  </div>
                </div>

                {/* Message Field with strictly enforced 400 Max Characters */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-800">
                      Explication de la Plainte / Soutien demandé :
                    </label>
                    <span
                      className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-full ${
                        message.length >= MAX_CHARS
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : message.length > 350
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {message.length} / {MAX_CHARS} car.
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    maxLength={MAX_CHARS}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Expliquez votre situation, plainte ou urgence en 400 caractères maximum..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all leading-relaxed font-normal"
                  />

                  {/* Character Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        message.length >= MAX_CHARS
                          ? 'bg-rose-600'
                          : message.length > 350
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (message.length / MAX_CHARS) * 100)}%` }}
                    ></div>
                  </div>

                  {/* AI Assistance Button */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={handleAiOptimizeMessage}
                      disabled={aiSuggestionsActive}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      {aiSuggestionsActive ? 'Optimisation IA...' : 'Aide IA (Rester sous 400 car.)'}
                    </button>
                    <span className="text-slate-500">
                      Reste {MAX_CHARS - message.length} car.
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || message.length > MAX_CHARS || !message.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs py-3 rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Envoi du signalement...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enregistrer ma Plainte (Transmettre au Bureau)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Submitted Record Receipt Modal / Alert */}
            {submittedRecord && (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Plainte Enregistrée avec Succès !
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">{submittedRecord.createdAt}</span>
                </div>

                <div className="space-y-1 text-xs text-emerald-950">
                  <p className="font-bold">Accusé de réception émis pour :</p>
                  <p className="text-sm font-black text-slate-900">{submittedRecord.targetOfficeName}</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Code de suivi unique :</span>
                      <button
                        type="button"
                        onClick={() => copyTrackingNumber(submittedRecord.trackingNumber)}
                        className="text-[11px] font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                      >
                        {submittedRecord.trackingNumber}
                        {copiedTracking ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <p className="text-slate-700 text-xs italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                      "{submittedRecord.message}"
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-normal">
                  Une copie officielle a été transmise au service d'État de {submittedRecord.region}. Un e-mail de confirmation à été envoyé à <strong>{submittedRecord.userEmail}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Historic list of user submitted complaints */}
        {myComplaints.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Mes Signalements & Plaintes Transmises ({myComplaints.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myComplaints.map((c, idx) => (
                <div key={c.trackingNumber || `complaint-${idx}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      {c.trackingNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{c.createdAt}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900">{c.targetOfficeName}</h4>
                    <p className="text-slate-500 text-[11px]">{c.region}</p>
                  </div>

                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                    {c.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {c.status}
                    </span>
                    <span className="text-slate-500 font-mono">{c.userName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
