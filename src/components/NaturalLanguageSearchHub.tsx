import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Briefcase,
  Users,
  CheckCircle2,
  Send,
  Video,
  FileText,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2
} from 'lucide-react';
import { JobPosting, TalentProfile } from '../types';

interface NaturalLanguageSearchHubProps {
  onOpenMessageWithUser: (userEmail: string, subject: string) => void;
  onOpenVisioWithUser: (userEmail: string, userName: string) => void;
}

export const NaturalLanguageSearchHub: React.FC<NaturalLanguageSearchHubProps> = ({
  onOpenMessageWithUser,
  onOpenVisioWithUser
}) => {
  const [activeSearchType, setActiveSearchType] = useState<'job_seeker' | 'recruiter'>('job_seeker');
  
  // Prompt text
  const [seekerPrompt, setSeekerPrompt] = useState('Je cherche un emploi de comptable à distance avec un salaire minimum de 1 000 $.');
  const [recruiterPrompt, setRecruiterPrompt] = useState('Je cherche un développeur capable de créer une application mobile avec React Native.');

  const [isLoading, setIsLoading] = useState(false);
  const [parsedCriteria, setParsedCriteria] = useState<any>(null);
  const [resultsJobs, setResultsJobs] = useState<JobPosting[]>([]);
  const [resultsTalents, setResultsTalents] = useState<TalentProfile[]>([]);

  // Execute Gemini AI NL Job Search
  const handleExecuteSeekerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerPrompt.trim()) return;

    setIsLoading(true);
    setParsedCriteria(null);

    try {
      const res = await fetch('/api/ai/job-search-nl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: seekerPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setParsedCriteria(data.parsedCriteria);
        setResultsJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Job NL search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Gemini AI NL Candidate Search
  const handleExecuteRecruiterSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterPrompt.trim()) return;

    setIsLoading(true);
    setParsedCriteria(null);

    try {
      const res = await fetch('/api/ai/candidate-search-nl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: recruiterPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setParsedCriteria(data.parsedCriteria);
        setResultsTalents(data.talents || []);
      }
    } catch (err) {
      console.error('Candidate NL search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Type Mode Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 border border-indigo-900/80">
        <div className="space-y-2">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> INTELLIGENCE ARTIFICIELLE GEMINI
          </span>
          <h2 className="text-2xl font-black text-white">Recherche Intelligente en Langage Naturel</h2>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Exprimez librement votre demande en phrases simples. Notre moteur d'IA extrait automatiquement vos critères, compétences cibles, prétentions salariales et disponibilités.
          </p>
        </div>

        {/* Tab selector buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          <button
            onClick={() => { setActiveSearchType('job_seeker'); setParsedCriteria(null); }}
            className={`p-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeSearchType === 'job_seeker'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-400" /> JE CHERCHE UN EMPLOI
          </button>

          <button
            onClick={() => { setActiveSearchType('recruiter'); setParsedCriteria(null); }}
            className={`p-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeSearchType === 'recruiter'
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" /> JE CHERCHE UN CANDIDAT
          </button>
        </div>
      </div>

      {/* SEARCH FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        {activeSearchType === 'job_seeker' ? (
          <form onSubmit={handleExecuteSeekerSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900">
                Décrivez le poste que vous cherchez (Langage libre) :
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={seekerPrompt}
                  onChange={(e) => setSeekerPrompt(e.target.value)}
                  placeholder="Ex: Je cherche un emploi de comptable à distance avec un salaire minimum de 1 000 $."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl cursor-pointer flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isLoading ? 'Analyse Gemini AI en cours...' : 'Analyser ma demande & Trouver les Offres'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleExecuteRecruiterSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900">
                Décrivez le profil candidat recherché (Langage libre) :
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={recruiterPrompt}
                  onChange={(e) => setRecruiterPrompt(e.target.value)}
                  placeholder="Ex: Je cherche un développeur capable de créer une application mobile avec React Native."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl cursor-pointer flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isLoading ? 'Analyse Gemini AI en cours...' : 'Extraire les critères & Trouver les Candidats'}
            </button>
          </form>
        )}

      </div>

      {/* PARSED GEMINI ANALYSIS RESULTS */}
      {parsedCriteria && (
        <div className="bg-indigo-900 text-white p-6 rounded-3xl border border-indigo-800 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 border-b border-indigo-800/80 pb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm text-white">Analyse Structurée Gemini AI</h3>
          </div>

          <p className="text-xs text-indigo-200 italic font-medium">
            "{parsedCriteria.summaryExplanation}"
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-indigo-300 block">Intitulé Cible</span>
              <span className="text-white font-black">{parsedCriteria.profession || parsedCriteria.targetTitle}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-indigo-300 block">Mode de Travail</span>
              <span className="text-emerald-400 font-black">{parsedCriteria.remoteAvailable || parsedCriteria.remoteOnly ? '100% Remote' : 'Présentiel / Hybride'}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-indigo-300 block">Salaire / Budget</span>
              <span className="text-amber-300 font-black">{parsedCriteria.minSalary || parsedCriteria.maxSalary || 1000} $ / mois</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-indigo-300 block">Disponibilité</span>
              <span className="text-white font-black">{parsedCriteria.availability || 'Immédiate'}</span>
            </div>
          </div>
        </div>
      )}

      {/* MATCHED CANDIDATES / JOBS DISPLAY */}
      {resultsTalents.length > 0 && activeSearchType === 'recruiter' && (
        <div className="space-y-4">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> Candidats Recommandés par Matching IA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultsTalents.map((talent) => (
              <div key={talent.id} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={talent.avatarUrl} alt={talent.fullName} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{talent.fullName}</h4>
                      <p className="text-xs text-indigo-600 font-bold">{talent.profession}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1 rounded-xl">
                    98% Match
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">{talent.bio}</p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => onOpenMessageWithUser(talent.email, `Contact suite à recherche IA`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Contacter
                  </button>
                  <button
                    onClick={() => onOpenVisioWithUser(talent.email, talent.fullName)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" /> Entretien Visio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
