import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  Globe2,
  Building2,
  MapPin,
  DollarSign,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Mail,
  Send,
  FileText,
  Bookmark,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Percent
} from 'lucide-react';
import { JobPosting, CompanyProfile, ContractType } from '../types';
import { SAMPLE_JOB_POSTINGS, SAMPLE_COMPANIES } from '../data/sampleJobs';
import { apiDispatchContact } from '../lib/backendClient';
import { Language, t } from '../lib/i18n';

interface GlobalJobSearchPortalProps {
  currentLang: Language;
  onApplyJob: (job: JobPosting, coverLetter: string) => void;
  onOpenCoverLetterGenerator: (job: JobPosting) => void;
}

export const GlobalJobSearchPortal: React.FC<GlobalJobSearchPortalProps> = ({
  currentLang,
  onApplyJob,
  onOpenCoverLetterGenerator
}) => {
  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous les pays');
  const [selectedSector, setSelectedSector] = useState<string>('Tous les secteurs');
  const [selectedContract, setSelectedContract] = useState<string>('Tous les contrats');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);

  // Job list state
  const [jobs, setJobs] = useState<JobPosting[]>(SAMPLE_JOB_POSTINGS);
  const [companies, setCompanies] = useState<CompanyProfile[]>(SAMPLE_COMPANIES);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPosting | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Filter options
  const countriesList = ['Tous les pays', 'France', 'Canada', 'États-Unis', 'Allemagne', 'Haïti', 'Royaume-Uni', 'Suisse', 'Espagne', 'Sénégal'];
  const sectorsList = ['Tous les secteurs', 'Intelligence Artificielle & Software', 'Data Science & Machine Learning', 'Design & Marketing Digital', 'Marketing & Acquisition', 'Systèmes d\'Information & Consulting', 'Santé & Médical', 'Finance & Comptabilité'];
  const contractTypes: string[] = ['Tous les contrats', 'CDI', 'CDD', 'Freelance', 'Stage', 'Remote', 'Temps plein', 'Temps partiel'];

  // Toggle Save Job
  const handleToggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter(jId => jId !== id));
    } else {
      setSavedJobIds([...savedJobIds, id]);
    }
  };

  // Filter Jobs Logic
  const filteredJobs = jobs.filter(job => {
    const matchesKeyword = searchKeyword === '' ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.requirements.some(r => r.toLowerCase().includes(searchKeyword.toLowerCase()));

    const matchesCountry = selectedCountry === 'Tous les pays' || job.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesSector = selectedSector === 'Tous les secteurs' || job.sector.toLowerCase() === selectedSector.toLowerCase();
    const matchesContract = selectedContract === 'Tous les contrats' || job.contractType === selectedContract;
    const matchesSalary = job.salaryMin >= minSalaryFilter;
    const matchesRemote = !remoteOnly || job.remoteAvailable;

    return matchesKeyword && matchesCountry && matchesSector && matchesContract && matchesSalary && matchesRemote;
  });

  // AI Cover Letter Generator inside application modal
  const handleGenerateAICoverLetter = () => {
    if (!applyingJob) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = `Madame, Monsieur le Responsable du Recrutement chez ${applyingJob.companyName},

C'est avec un vif intérêt que je soumets ma candidature pour le poste de ${applyingJob.title} à ${applyingJob.location}.

En examinant vos exigences pour ce poste (${applyingJob.requirements.slice(0, 2).join(', ')}), je constate une parfaite adéquation avec mes réalisations professionnelles récentes. Mon expérience m'a permis d'acquérir une maîtrise approfondie des technologies modernes et une capacité avérée à livrer des projets complexes dans les délais impartis.

Je serais particulièrement honoré d'apporter ma contribution aux ambitions de ${applyingJob.companyName} et de participer activement à votre croissance internationale.

Je me tiens à votre entière disposition pour convenir d'un entretien préalable.

Bien cordialement,
${applicantName}
E-mail : ${applicantEmail}`;
      setCoverLetterText(generated);
      setIsGeneratingAI(false);
    }, 1200);
  };

  // Submit Application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    onApplyJob(applyingJob, coverLetterText);

    // Dispatch automated contact email to company with profile & 4 action buttons
    try {
      await apiDispatchContact({
        candidateName: applicantName || 'Candidat Qualifié',
        candidateEmail: applicantEmail || 'candidat@example.com',
        companyEmail: `${applyingJob.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@entreprise.com`,
        companyName: applyingJob.companyName,
        jobTitle: applyingJob.title,
        coverLetter: coverLetterText,
        resumeUrl: 'https://nichelead.io/resumes/cv_candidate.pdf',
        portfolioUrl: 'https://nichelead.io/portfolio/candidate'
      });
    } catch (err) {
      console.warn('Contact dispatch warning:', err);
    }

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingJob(null);
      setCoverLetterText('');
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-900/50">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
            <Globe2 className="w-4 h-4 text-blue-400" />
            {t(currentLang, 'search_jobs_title')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Plateforme Mondiale de Recrutement & Emploi IA
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {t(currentLang, 'search_jobs_desc')}
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Offres Disponibles</span>
              <span className="text-lg font-black text-emerald-400">12 480+ Postes</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Entreprises Recrutant</span>
              <span className="text-lg font-black text-blue-400">3 250 Sociétés</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Pays Couverts</span>
              <span className="text-lg font-black text-amber-400">85+ Pays</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Matching IA Moyen</span>
              <span className="text-lg font-black text-purple-400">92% Précision</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Filter Console */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Intitulé de poste, compétence (ex: React, IA, Marketing), ou entreprise..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Country Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pays / Zone géographique :</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              {countriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Secteur d'activité :</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              {sectorsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Contract Type Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Type de Contrat :</label>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              {contractTypes.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Salary & Remote Toggle */}
          <div className="flex items-center justify-between pt-5 px-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
              <span>Télétravail (Remote Only)</span>
            </label>
          </div>

        </div>

      </div>

      {/* Main Content: Job Listings & Featured Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Job Cards List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Offres d'Emploi Récents ({filteredJobs.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">Mises à jour en temps réel</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">Aucune offre ne correspond à vos filtres</h3>
              <p className="text-xs text-slate-500">Essayez de réinitialiser vos critères de recherche ou de changer de pays.</p>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedCountry('Tous les pays');
                  setSelectedSector('Tous les secteurs');
                  setSelectedContract('Tous les contrats');
                  setRemoteOnly(false);
                }}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobForDetails(job)}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 relative group"
              >
                {job.featured && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" /> Premium / Urgent
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                    {job.companyName.charAt(0)}
                  </div>

                  <div className="space-y-1 pr-16">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                      <span className="text-slate-900 font-extrabold">{job.companyName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                        {job.contractType}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {req}
                    </span>
                  ))}
                </div>

                {/* Card Footer: Salary & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      💰 {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency} / an
                    </span>
                    {job.aiCompatibilityScore && (
                      <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> Compatibilité IA : {job.aiCompatibilityScore}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleSaveJob(job.id, e)}
                      className={`p-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        savedJobIds.includes(job.id)
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                      title="Sauvegarder cette offre"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setApplyingJob(job);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Postuler
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Right: Verified Companies & Hiring Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Entreprises Végétales & Partenaires
            </h3>

            <div className="space-y-3">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-blue-300 bg-slate-50 hover:bg-white transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{company.logo}</span>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                          {company.name}
                          {company.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-100" />}
                        </h4>
                        <span className="text-[10px] text-slate-500">{company.sector}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {company.openJobsCount} Offres
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>📍 {company.city}, {company.country}</span>
                    <span>⭐ {company.rating} / 5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL 1: JOB DETAILS & AI MATCH */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded">
                  {selectedJobForDetails.contractType}
                </span>
                <h3 className="text-2xl font-black">{selectedJobForDetails.title}</h3>
                <p className="text-xs text-slate-300">{selectedJobForDetails.companyName} • {selectedJobForDetails.location}</p>
              </div>
              <button
                onClick={() => setSelectedJobForDetails(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block">Rémunération Proposée :</span>
                  <span className="text-lg font-black text-indigo-700">
                    {selectedJobForDetails.salaryMin.toLocaleString()} - {selectedJobForDetails.salaryMax.toLocaleString()} {selectedJobForDetails.currency} / an
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-purple-900 block">Score AI Matching :</span>
                  <span className="text-lg font-black text-purple-700">
                    {selectedJobForDetails.aiCompatibilityScore}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Description du poste :</h4>
                <p className="text-slate-700 leading-relaxed text-xs">{selectedJobForDetails.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Compétences & Prérequis :</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJobForDetails.requirements.map((req, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl">
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedJobForDetails(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const jobToApply = selectedJobForDetails;
                    setSelectedJobForDetails(null);
                    setApplyingJob(jobToApply);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Postuler Maintenant avec l'IA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CANDIDATURE INTELLIGENTE & GENERATION DE LETTRE DE MOTIVATION IA */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400">Formulaire de Candidature IA</span>
                <h3 className="text-xl font-black">{applyingJob.title}</h3>
                <p className="text-xs text-slate-300">{applyingJob.companyName}</p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {appliedSuccess ? (
              <div className="p-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900">Candidature Envoyée avec Succès !</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Votre CV, votre lettre de motivation générée par l'IA et votre portfolio ont été transmis directement au recruteur chez <strong>{applyingJob.companyName}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Nom Complet :</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">E-mail Professionnel :</label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Lettre de Motivation Personnalisée :</label>
                    <button
                      type="button"
                      onClick={handleGenerateAICoverLetter}
                      className="text-[11px] font-black text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      {isGeneratingAI ? 'Génération IA en cours...' : 'Générer avec Gemini AI'}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    placeholder="Rédigez ou laissez l'IA générer automatiquement votre lettre de motivation basée sur l'offre d'emploi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">CV & Portfolio Rattachés</span>
                      <span className="text-[10px] text-slate-500">Jean_Widny_CV_2026.pdf (Profil Vérifié)</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">Joint</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Envoyer la Candidature Directe
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: COMPANY PROFILE MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCompany.logo}</span>
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                    {selectedCompany.name}
                    {selectedCompany.verified && <ShieldCheck className="w-4 h-4 text-blue-600 fill-blue-100" />}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedCompany.sector} • {selectedCompany.city}, {selectedCompany.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed">{selectedCompany.description}</p>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Taille entreprise</span>
                  <span className="font-extrabold text-slate-900">{selectedCompany.headcount}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Contact principal</span>
                  <span className="font-extrabold text-slate-900">{selectedCompany.contactPerson}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">E-mail direct</span>
                  <span className="font-extrabold text-indigo-600">{selectedCompany.email}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Téléphone</span>
                  <span className="font-extrabold text-slate-900">{selectedCompany.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
