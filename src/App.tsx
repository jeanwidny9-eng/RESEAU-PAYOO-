import React, { useState, useEffect, useCallback } from 'react';
import {
  Lead,
  SavedLead,
  PlanType,
  JobPosting,
  JobApplication,
  ApplicationStatus,
  LeadStatus,
  OutreachMessage
} from './types';
import { INITIAL_SEARCH_RESULTS, INITIAL_SAVED_LEADS } from './data/sampleLeads';
import { SAMPLE_JOB_POSTINGS, INITIAL_APPLICATIONS } from './data/sampleJobs';
import { Language } from './lib/i18n';
import { auth, onAuthStateChanged, User as FirebaseUser } from './lib/firebase';

// Components
import { Navbar, NavTab } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LeadSearchDashboard } from './components/LeadSearchDashboard';
import { SavedLeadsPage } from './components/SavedLeadsPage';
import { GlobalJobSearchPortal } from './components/GlobalJobSearchPortal';
import { SmartJobApplicationCenter } from './components/SmartJobApplicationCenter';
import { TalentFinderCenter } from './components/TalentFinderCenter';
import { NaturalLanguageSearchHub } from './components/NaturalLanguageSearchHub';
import { ProfessionalInboxAndCommunication } from './components/ProfessionalInboxAndCommunication';
import { PublicServicesPortal } from './components/PublicServicesPortal';
import { SocialFeedAndNetwork } from './components/SocialFeedAndNetwork';
import { PromoVideoStudio } from './components/PromoVideoStudio';
import { MonetizationHub } from './components/MonetizationHub';
import { PricingPage } from './components/PricingPage';

// Modals & Popups
import { AuthModal } from './components/AuthModal';
import { ExportModal } from './components/ExportModal';
import { OutreachGeneratorModal } from './components/OutreachGeneratorModal';
import { WelcomeModal } from './components/WelcomeModal';
import { GeminiAdvisorModal } from './components/GeminiAdvisorModal';
import { PaymentModal, PaymentMethod } from './components/PaymentModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export function App() {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [currentLang, setCurrentLang] = useState<Language>('fr');

  // Authentication & User Profile
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [activePlan, setActivePlan] = useState<PlanType>('free');
  const [remainingRequests, setRemainingRequests] = useState<number>(10);

  // Leads & Searches State
  const [searchResults, setSearchResults] = useState<Lead[]>(INITIAL_SEARCH_RESULTS);
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>(INITIAL_SAVED_LEADS);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [initialSearchNiche, setInitialSearchNiche] = useState<string>('');
  const [initialSearchLocation, setInitialSearchLocation] = useState<string>('');

  // Jobs & Applications State
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);

  // Modals Control State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanType>('pro');
  const [billingCycleForPayment, setBillingCycleForPayment] = useState<'monthly' | 'yearly'>('monthly');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [leadsToExport, setLeadsToExport] = useState<Lead[]>([]);
  const [isOutreachOpen, setIsOutreachOpen] = useState<boolean>(false);
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isGeminiAdvisorOpen, setIsGeminiAdvisorOpen] = useState<boolean>(false);

  // Toasts Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Quick Start Search from Landing Page
  const handleStartSearch = (niche?: string, location?: string) => {
    if (niche) setInitialSearchNiche(niche);
    if (location) setInitialSearchLocation(location);
    setActiveTab('search');
  };

  // Lead Search execution
  const handleExecuteSearch = async (niche: string, location: string, service: string, count: number) => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, location, service, count })
      });
      const data = await res.json();
      if (data.success && data.leads) {
        setSearchResults(data.leads);
        addToast('success', 'Recherche terminée !', `${data.leads.length} prospects qualifiés trouvés.`);
        if (remainingRequests > 0) {
          setRemainingRequests(prev => prev - 1);
        }
      } else {
        addToast('warning', 'Aucun prospect trouvé', 'Veuillez essayer avec d\'autres critères.');
      }
    } catch (err) {
      console.error('Lead search error:', err);
      addToast('warning', 'Erreur de recherche', 'Impossible de joindre le serveur de prospection.');
    } finally {
      setIsSearching(false);
    }
  };

  // Save / Bookmark Lead
  const handleSaveLead = (lead: Lead) => {
    if (savedLeads.some(sl => sl.id === lead.id)) {
      addToast('info', 'Prospect déjà enregistré', lead.name);
      return;
    }
    const newSaved: SavedLead = {
      ...lead,
      savedAt: new Date().toISOString(),
      status: 'New',
      notes: ''
    };
    setSavedLeads(prev => [newSaved, ...prev]);
    addToast('success', 'Prospect sauvegardé', `${lead.name} a été ajouté à vos favoris.`);
  };

  const handleRemoveSavedLead = (leadId: string) => {
    setSavedLeads(prev => prev.filter(sl => sl.id !== leadId));
    addToast('info', 'Prospect retiré', 'Le prospect a été supprimé de vos favoris.');
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setSavedLeads(prev =>
      prev.map(sl => (sl.id === leadId ? { ...sl, status, lastContactedAt: new Date().toISOString() } : sl))
    );
    addToast('success', 'Statut mis à jour', `Nouveau statut: ${status}`);
  };

  const handleUpdateLeadNotes = (leadId: string, notes: string) => {
    setSavedLeads(prev =>
      prev.map(sl => (sl.id === leadId ? { ...sl, notes } : sl))
    );
    addToast('success', 'Note enregistrée', 'Les notes ont été mises à jour.');
  };

  // Open Outreach Modal
  const handleOpenOutreach = (lead: Lead) => {
    setSelectedLeadForOutreach(lead);
    setIsOutreachOpen(true);
  };

  // Export CSV
  const handleExportLeads = (leads: Lead[]) => {
    setLeadsToExport(leads);
    setIsExportOpen(true);
  };

  const handleConfirmExport = () => {
    if (leadsToExport.length === 0) return;
    const headers = ['Nom', 'Niche', 'Localisation', 'Site Web', 'Email', 'Téléphone', 'Score Opportunité', 'Angle Suggéré'];
    const rows = leadsToExport.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.niche.replace(/"/g, '""')}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${l.website || ''}"`,
      `"${l.contactEmail || ''}"`,
      `"${l.phone || ''}"`,
      l.leadScore,
      `"${(l.suggestedAngle || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nichelead_prospects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportOpen(false);
    addToast('success', 'Exportation CSV réussie', `${leadsToExport.length} prospects exportés.`);
  };

  // Payment Modal Trigger
  const handleOpenPaymentModal = (plan: PlanType, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    setSelectedPlanForPayment(plan);
    setBillingCycleForPayment(billingCycle);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (plan: PlanType, email: string, method: PaymentMethod) => {
    setActivePlan(plan);
    setIsPaymentOpen(false);
    addToast(
      'success',
      'Paiement Validé ! 🎉',
      `Félicitations ! Votre abonnement ${plan.toUpperCase()} a été activé via ${method}.`
    );
  };

  // Job Application Handlers
  const handleApplyJob = (job: JobPosting, coverLetter: string) => {
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applicantName: currentUser?.displayName || 'Candidat Payoo',
      applicantEmail: currentUser?.email || 'candidat@payoo.ht',
      appliedDate: new Date().toLocaleDateString('fr-FR'),
      status: 'Envoyée',
      compatibilityScore: job.aiCompatibilityScore || 92,
      coverLetter: coverLetter
    };
    setApplications(prev => [newApp, ...prev]);
    addToast('success', 'Candidature transmise !', `Votre candidature pour "${job.title}" chez ${job.companyName} a été envoyée.`);
  };

  const handleUpdateAppStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );
    addToast('info', 'Statut mis à jour', `Candidature passée à : ${newStatus}`);
  };

  const handleOpenMessageWithUser = (email: string, subject: string) => {
    setActiveTab('inbox');
    addToast('info', 'Messagerie ouverte', `Discussion avec : ${email} (${subject})`);
  };

  const handleOpenVisioWithUser = (email: string, name: string) => {
    setActiveTab('inbox');
    addToast('success', 'Salon Visio préparé', `Appel vidéo avec ${name} (${email})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedLeadsCount={savedLeads.length}
        activePlan={activePlan}
        onOpenUpgrade={() => handleOpenPaymentModal('pro')}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenGeminiAdvisor={() => setIsGeminiAdvisorOpen(true)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />

      {/* Main App Content Views */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartSearch={handleStartSearch}
            onGoToPricing={() => setActiveTab('pricing')}
            activePlan={activePlan}
          />
        )}

        {activeTab === 'feed' && (
          <SocialFeedAndNetwork
            currentLang={currentLang}
            onOpenMessageWithUser={handleOpenMessageWithUser}
            onOpenVisioWithUser={handleOpenVisioWithUser}
          />
        )}

        {activeTab === 'jobs' && (
          <GlobalJobSearchPortal
            currentLang={currentLang}
            onApplyJob={handleApplyJob}
            onOpenCoverLetterGenerator={(job) => {
              setActiveTab('applications');
              addToast('info', 'Générateur de Lettre IA', `Prêt pour ${job.title} chez ${job.companyName}`);
            }}
          />
        )}

        {activeTab === 'talents' && (
          <TalentFinderCenter
            onOpenMessageWithUser={handleOpenMessageWithUser}
            onOpenVisioWithUser={handleOpenVisioWithUser}
          />
        )}

        {activeTab === 'nl_ai_search' && (
          <NaturalLanguageSearchHub
            onOpenMessageWithUser={handleOpenMessageWithUser}
            onOpenVisioWithUser={handleOpenVisioWithUser}
          />
        )}

        {activeTab === 'search' && (
          <LeadSearchDashboard
            searchResults={searchResults}
            isSearching={isSearching}
            onSearch={handleExecuteSearch}
            savedLeads={savedLeads}
            onSaveLead={handleSaveLead}
            onRemoveSavedLead={handleRemoveSavedLead}
            onOpenOutreach={handleOpenOutreach}
            onExportLeads={handleExportLeads}
            initialNiche={initialSearchNiche}
            initialLocation={initialSearchLocation}
          />
        )}

        {activeTab === 'applications' && (
          <SmartJobApplicationCenter
            currentLang={currentLang}
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
            onOpenMessageWithCompany={handleOpenMessageWithUser}
          />
        )}

        {activeTab === 'inbox' && (
          <ProfessionalInboxAndCommunication
            currentLang={currentLang}
          />
        )}

        {activeTab === 'services' && (
          <PublicServicesPortal />
        )}

        {activeTab === 'profile' && (
          <TalentFinderCenter
            onOpenMessageWithUser={handleOpenMessageWithUser}
            onOpenVisioWithUser={handleOpenVisioWithUser}
          />
        )}

        {activeTab === 'integrations' && (
          <MonetizationHub
            onOpenPaymentModal={handleOpenPaymentModal}
            onGoToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingPage
            activePlan={activePlan}
            onSelectPlan={(plan) => handleOpenPaymentModal(plan)}
            onStartSearch={() => setActiveTab('search')}
            onOpenPaymentModal={handleOpenPaymentModal}
            onOpenGeminiAdvisor={() => setIsGeminiAdvisorOpen(true)}
          />
        )}

        {activeTab === 'promo' && (
          <PromoVideoStudio
            onStartSearch={() => setActiveTab('search')}
            onGoToPricing={() => setActiveTab('pricing')}
          />
        )}

        {activeTab === 'monetization' && (
          <MonetizationHub
            onOpenPaymentModal={handleOpenPaymentModal}
            onGoToSearch={() => setActiveTab('search')}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user, isNew) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
          addToast('success', isNew ? 'Compte créé avec succès !' : 'Connexion réussie !', user.email || '');
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedPlan={selectedPlanForPayment}
        billingCycle={billingCycleForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        leadCountToExport={leadsToExport.length}
        activePlan={activePlan}
        onUpgradeToPro={() => {
          setIsExportOpen(false);
          handleOpenPaymentModal('pro');
        }}
        onConfirmExport={handleConfirmExport}
      />

      <OutreachGeneratorModal
        lead={selectedLeadForOutreach}
        onClose={() => {
          setIsOutreachOpen(false);
          setSelectedLeadForOutreach(null);
        }}
        onSaveLead={handleSaveLead}
        isLeadSaved={selectedLeadForOutreach ? savedLeads.some(sl => sl.id === selectedLeadForOutreach.id) : false}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        userName={currentUser?.displayName || 'Partenaire Pro'}
        onStartSearch={() => {
          setIsWelcomeOpen(false);
          setActiveTab('search');
        }}
        onOpenUpgrade={() => {
          setIsWelcomeOpen(false);
          handleOpenPaymentModal('pro');
        }}
        remainingRequests={remainingRequests}
      />

      <GeminiAdvisorModal
        isOpen={isGeminiAdvisorOpen}
        onClose={() => setIsGeminiAdvisorOpen(false)}
        activePlan={activePlan}
        onOpenUpgradeModal={() => {
          setIsGeminiAdvisorOpen(false);
          handleOpenPaymentModal('ultimate_vip');
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
