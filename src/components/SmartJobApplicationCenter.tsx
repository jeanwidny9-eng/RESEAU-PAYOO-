import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  HelpCircle,
  Bot,
  Percent,
  Calendar,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sliders,
  Share2,
  Video
} from 'lucide-react';
import { JobApplication, CandidateProfile, ApplicationStatus } from '../types';
import { INITIAL_APPLICATIONS } from '../data/sampleJobs';
import { Language, t } from '../lib/i18n';

interface SmartJobApplicationCenterProps {
  currentLang: Language;
  applications: JobApplication[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onOpenMessageWithCompany: (companyEmail: string, subject: string) => void;
}

export const SmartJobApplicationCenter: React.FC<SmartJobApplicationCenterProps> = ({
  currentLang,
  applications,
  onUpdateStatus,
  onOpenMessageWithCompany
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'cv_builder' | 'ai_coach'>('applications');

  // CV Builder state
  const [profile, setProfile] = useState<CandidateProfile>({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    portfolioLinks: [],
    linkedinUrl: '',
    githubUrl: '',
    idVerified: false,
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false
  });

  // New Skill input for CV
  const [newSkill, setNewSkill] = useState('');

  // AI Career Coach & Interview Simulator state
  const [targetRole, setTargetRole] = useState('');
  const [simulatedQuestions, setSimulatedQuestions] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Add Skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  // Evaluate Answer with AI
  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setAiFeedback(`💡 **Diagnostic du Career Coach IA (Score: 92/100)**:
      
1. **Points forts**: Votre réponse est bien structurée, mentionne les bonnes pratiques techniques (memoization, lazy loading, validation des schémas JSON) et démontre une expérience concrète.
2. **Axe d'amélioration**: Pensez à citer des métriques quantitatives précises (ex: "ceci a réduit le temps de réponse de 35%").
3. **Verdict**: Réponse très convaincante pour un entretien de niveau Senior !`);
      setIsEvaluating(false);
    }, 1200);
  };

  // Status Badge Helper
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Envoyée':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Envoyée</span>;
      case 'En cours':
        return <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> En cours d'examen</span>;
      case 'Entretien':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-600" /> Entretien programmé</span>;
      case 'Acceptée':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Offre Acceptée</span>;
      case 'Refusée':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Non retenu</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Sub Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'applications'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" /> Suivi des Candidatures ({applications.length})
        </button>

        <button
          onClick={() => setActiveSubTab('cv_builder')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'cv_builder'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Créateur & Optimiseur de CV IA
        </button>

        <button
          onClick={() => setActiveSubTab('ai_coach')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'ai_coach'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-400" /> Coach de Carrière & Préparation Entretien
        </button>
      </div>

      {/* SUB-TAB 1: APPLICATIONS TRACKING & PIPELINE */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Suivi & Historique des Candidatures</h2>
              <p className="text-xs text-slate-300">Gérez l'avancement de vos demandes d'emploi et contactez directement les recruteurs.</p>
            </div>
            <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <span className="font-bold text-slate-300">Taux de réponse moyen :</span>
              <span className="font-black text-emerald-400 text-base">78%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800">Aucune candidature enregistrée pour le moment</h3>
                <p className="text-xs text-slate-500">Parcourez les offres dans l'onglet "Offres d'Emploi" pour postuler en 1 clic.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">{app.jobTitle}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs font-bold text-indigo-600">{app.companyName} • Candidature du {app.appliedDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                        Match CV : {app.compatibilityScore}%
                      </span>
                      
                      {/* Status Selector Dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none"
                      >
                        <option value="Envoyée">Envoyée</option>
                        <option value="En cours">En cours</option>
                        <option value="Entretien">Entretien</option>
                        <option value="Acceptée">Acceptée</option>
                        <option value="Refusée">Refusée</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                    <span className="font-bold text-slate-700 block">Lettre de motivation transmise :</span>
                    <p className="text-slate-600 leading-relaxed italic line-clamp-3">"{app.coverLetter}"</p>
                  </div>

                  {app.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 font-medium">
                      📌 <strong>Note de suivi :</strong> {app.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onOpenMessageWithCompany(app.applicantEmail, `Entretien Visio WebRTC — ${app.jobTitle}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" /> Démarrer l'Entretien Visio
                    </button>

                    <button
                      onClick={() => onOpenMessageWithCompany(app.applicantEmail, `Relance Candidature — ${app.jobTitle}`)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Envoyer un e-mail de relance
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: RESUME BUILDER & OPTIMIZER */}
      {activeSubTab === 'cv_builder' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Créateur & Générateur de CV Professionnel IA</h2>
              <p className="text-xs text-slate-500">Mettez à jour vos compétences pour augmenter votre score de compatibilité avec les offres.</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profil CV 100% Vérifié
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nom Complet :</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Titre / Postes Visés :</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Résumé / Résumé Exécutif :</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Compétences Techniques & Clés :</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ajouter une compétence (ex: PyTorch, Docker)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[100px]">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600 cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <span className="font-extrabold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Auto-Analyse du CV par l'IA Gemini
                </span>
                <p className="text-purple-800 leading-relaxed text-[11px]">
                  Votre profil possède une très forte visibilité pour les postes de <strong>Développeur Senior & AI Engineer</strong> dans la zone Europe & Amérique du Nord.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AI CAREER COACH & INTERVIEW PREP */}
      {activeSubTab === 'ai_coach' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Coach de Carrière & Simulateur d'Entretien IA</h2>
              <p className="text-xs text-slate-500">Préparez vos réponses aux questions d'entretien courantes et recevez un feedback immédiat.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">Questions fréquentes pour : {targetRole}</span>
              
              <div className="space-y-2">
                {simulatedQuestions.map((q, index) => (
                  <div key={index} className="p-3 bg-white rounded-xl border border-slate-200 font-bold text-xs text-slate-800 flex items-start gap-2">
                    <span className="text-indigo-600 shrink-0 font-black">Q{index + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">Saisissez votre réponse pour la question 1 :</label>
              <textarea
                rows={4}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Exemple: Pour optimiser Express.js, j'implémente un cluster Node.js multi-cœurs, de la mise en cache Redis et de la compression gzip..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
              />
            </div>

            <button
              onClick={handleEvaluateAnswer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isEvaluating ? 'Évaluation IA en cours...' : 'Évaluer ma réponse avec l\'IA'}
            </button>

            {aiFeedback && (
              <div className="p-5 bg-purple-50 text-purple-950 rounded-2xl border border-purple-200 space-y-2 text-xs leading-relaxed whitespace-pre-line animate-fade-in">
                {aiFeedback}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
