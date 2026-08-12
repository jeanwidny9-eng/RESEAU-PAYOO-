import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Video,
  FileText,
  Sparkles,
  Award,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { TalentProfile, TalentFilter } from '../types';
import { INITIAL_TALENTS } from '../data/sampleSocial';

interface TalentFinderCenterProps {
  onOpenMessageWithUser: (userEmail: string, subject: string) => void;
  onOpenVisioWithUser: (userEmail: string, userName: string) => void;
}

export const TalentFinderCenter: React.FC<TalentFinderCenterProps> = ({
  onOpenMessageWithUser,
  onOpenVisioWithUser
}) => {
  const [talents, setTalents] = useState<TalentProfile[]>(INITIAL_TALENTS);

  // Filter state
  const [filters, setFilters] = useState<TalentFilter>({
    country: 'Tous les pays',
    city: '',
    sector: 'Tous les secteurs',
    profession: '',
    skills: [],
    minExperienceYears: 0,
    maxSalary: 10000,
    availability: 'Toutes les disponibilités',
    remoteOnly: false,
    language: 'Toutes les langues',
    professionalLevel: 'Tous les niveaux'
  });

  const [selectedTalentModal, setSelectedTalentModal] = useState<TalentProfile | null>(null);

  // Apply filters
  const filteredTalents = talents.filter((t) => {
    if (filters.country !== 'Tous les pays' && t.country.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }
    if (filters.sector !== 'Tous les secteurs' && t.sector.toLowerCase() !== filters.sector.toLowerCase()) {
      return false;
    }
    if (filters.profession && !t.profession.toLowerCase().includes(filters.profession.toLowerCase()) && !t.title.toLowerCase().includes(filters.profession.toLowerCase())) {
      return false;
    }
    if (filters.remoteOnly && t.remotePreference !== 'Remote') {
      return false;
    }
    if (filters.minExperienceYears > 0 && t.experienceYears < filters.minExperienceYears) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4 border border-indigo-900/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> TROUVER DES TALENTS MONDIAUX
            </span>
            <h2 className="text-2xl font-black text-white">Recherche Avancée de Candidats & Freelances</h2>
            <p className="text-xs text-slate-300 font-medium max-w-2xl">
              Filtrez parmi des milliers de candidats qualifiés par pays, compétences, prétentions salariales et disponibilité. Entretien Visio WebRTC direct.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center font-bold text-xs space-y-1">
            <span className="text-emerald-400 font-black text-lg block">{filteredTalents.length}</span>
            <span className="text-slate-300 text-[10px]">Profils Compatibles Trouvés</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-indigo-600" /> Filtres de Sélection des Talents
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-slate-800">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Profession / Spécialité :</label>
            <input
              type="text"
              value={filters.profession}
              onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
              placeholder="ex: Comptable, Développeur..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Pays de résidence :</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
            >
              <option value="Tous les pays">Tous les pays</option>
              <option value="États-Unis">États-Unis</option>
              <option value="France">France</option>
              <option value="Canada">Canada</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Secteur :</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
            >
              <option value="Tous les secteurs">Tous les secteurs</option>
              <option value="Software & IA">Software & IA</option>
              <option value="Finance & Comptabilité">Finance & Comptabilité</option>
              <option value="Applications Mobiles">Applications Mobiles</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 text-xs font-black text-indigo-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.remoteOnly}
                onChange={(e) => setFilters({ ...filters, remoteOnly: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              Candidats Remote Uniquement
            </label>
          </div>
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent) => (
          <div
            key={talent.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all space-y-4 p-6"
          >
            <div className="space-y-4">
              
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={talent.avatarUrl}
                    alt={talent.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-black text-sm text-slate-900">{talent.fullName}</h3>
                      {talent.idVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
                    </div>
                    <p className="text-xs font-bold text-indigo-600">{talent.profession}</p>
                    <p className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {talent.location}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[10px] px-2.5 py-1 rounded-xl">
                  {talent.compatibilityScore || 96}% Match
                </span>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                {talent.bio}
              </p>

              {/* Key Skills */}
              <div className="flex flex-wrap gap-1">
                {talent.skills.slice(0, 5).map((sk, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    {sk}
                  </span>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-bold">
                <div>
                  <span className="text-[10px] text-slate-400 block">Salaire souhaité</span>
                  <span className="text-slate-900 font-black">{talent.desiredSalary} {talent.currency} / mois</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Disponibilité</span>
                  <span className="text-emerald-600 font-black">{talent.availability}</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenMessageWithUser(talent.email, `Proposition de Recrutement — ${talent.profession}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Contacter
                </button>

                <button
                  onClick={() => onOpenVisioWithUser(talent.email, talent.fullName)}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" /> Entretien Visio
                </button>
              </div>

              <button
                onClick={() => setSelectedTalentModal(talent)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <FileText className="w-3.5 h-3.5" /> Consulter le profil complet & CV
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Talent Detail Modal */}
      {selectedTalentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Profil Candidat : {selectedTalentModal.fullName}</h3>
              </div>
              <button onClick={() => setSelectedTalentModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">Présentation :</span>
                <p className="text-slate-700 font-medium leading-relaxed">{selectedTalentModal.bio}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Toutes les compétences :</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTalentModal.skills.map((sk, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-xl">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={() => onOpenMessageWithUser(selectedTalentModal.email, `Offre de recrutement`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Envoyer un message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
