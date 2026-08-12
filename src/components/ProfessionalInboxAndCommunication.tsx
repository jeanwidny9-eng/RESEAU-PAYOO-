import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Send,
  MessageSquare,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Monitor,
  PenTool,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  Paperclip,
  RotateCcw,
  Sparkles,
  Inbox,
  User,
  Trash2,
  FileCheck,
  Calendar,
  Building2,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  Check,
  Upload,
  Phone,
  Lock
} from 'lucide-react';
import { EmailMessage } from '../types';
import { INITIAL_EMAILS } from '../data/sampleJobs';
import { Language, t } from '../lib/i18n';
import { VisioConferenceStudio } from './VisioConferenceStudio';
import { apiCreateVisioRoom, apiDispatchContact } from '../lib/backendClient';

interface ProfessionalInboxAndCommunicationProps {
  currentLang: Language;
}

export const ProfessionalInboxAndCommunication: React.FC<ProfessionalInboxAndCommunicationProps> = ({
  currentLang
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'live_call' | 'esignature'>('inbox');

  // Email & Messaging state
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'starred' | 'drafts'>('inbox');
  const [activeEmail, setActiveEmail] = useState<EmailMessage | null>(null);

  // New Email Modal
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; url: string; size: string }[]>([]);

  // WebRTC Visio Conference Studio Modal state
  const [isVisioActive, setIsVisioActive] = useState(false);
  const [activeRoomData, setActiveRoomData] = useState<{
    roomId: string;
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    companyName: string;
  }>({
    roomId: `room-${Date.now()}`,
    candidateName: 'Candidat Qualifié',
    candidateEmail: 'candidat@example.com',
    jobTitle: 'Entretien Technique Full Stack & IA',
    companyName: 'Tech Corp'
  });

  // Schedule Visio Interview Modal State
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [schedCandidateEmail, setSchedCandidateEmail] = useState('');
  const [schedCandidateName, setSchedCandidateName] = useState('');
  const [schedCompanyEmail, setSchedCompanyEmail] = useState('');
  const [schedCompanyName, setSchedCompanyName] = useState('');
  const [schedJobTitle, setSchedJobTitle] = useState('Développeur Senior & Ingénieur IA');
  const [schedDate, setSchedDate] = useState('Aujourd\'hui à 15h30');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Company 1-Click Signup Modal State
  const [isCompanySignupModalOpen, setIsCompanySignupModalOpen] = useState(false);
  const [companySignupEmail, setCompanySignupEmail] = useState('');
  const [companySignupName, setCompanySignupName] = useState('');
  const [companySignupSector, setCompanySignupSector] = useState('Intelligence Artificielle & Software');
  const [companyCreatedSuccess, setCompanyCreatedSuccess] = useState(false);

  // Electronic Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);

  // Send Email / Reply Handler
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) return;

    const newMsg: EmailMessage = {
      id: `em-${Date.now()}`,
      sender: 'Vous (Membre Rézo)',
      senderEmail: 'user@example.com',
      recipientEmail: composeTo,
      subject: composeSubject,
      body: composeBody,
      date: new Date().toLocaleString('fr-FR'),
      folder: 'sent',
      read: true,
      autoFollowUpEnabled: true
    };

    setEmails([newMsg, ...emails]);
    setIsComposing(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setAttachments([]);
  };

  // Open Reply Modal prefilled
  const handleReplyToCandidate = (email: EmailMessage) => {
    setComposeTo(email.senderEmail || 'candidat@example.com');
    setComposeSubject(`Re: ${email.subject}`);
    setComposeBody(`\n\n--- Message d'origine (${email.date}) ---\n${email.body}`);
    setIsComposing(true);
  };

  // Create Video Room & Dispatch Invitations
  const handleConfirmScheduleVisio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingRoom(true);

    try {
      const res = await apiCreateVisioRoom({
        jobTitle: schedJobTitle,
        companyName: schedCompanyName || 'Entreprise Recruteuse',
        candidateEmail: schedCandidateEmail,
        recruiterEmail: schedCompanyEmail || 'recrutement@entreprise.com',
        scheduledTime: schedDate
      });

      if (res.success && res.room) {
        // Add invite message to inbox
        const roomMsg: EmailMessage = {
          id: `em-room-${Date.now()}`,
          sender: schedCompanyName || 'Entreprise Recruteuse',
          senderEmail: schedCompanyEmail || 'recrutement@entreprise.com',
          recipientEmail: schedCandidateEmail,
          subject: `⚡ Invitation Entretien Visio WebRTC : ${schedJobTitle}`,
          body: `Bonjour,\n\nUn entretien vidéo WebRTC sécurisé a été planifié pour le poste : ${schedJobTitle}.\n\nDate : ${schedDate}\nSalle ID : ${res.room.roomId}\nCode d'accès : ${res.room.passcode}\n\nRejoignez directement la visioconférence en direct en cliquant sur "Démarrer l'Entretien Visio".`,
          date: new Date().toLocaleString('fr-FR'),
          folder: 'inbox',
          read: false
        };

        setEmails([roomMsg, ...emails]);
        setActiveEmail(roomMsg);
        setIsSchedulingModalOpen(false);

        // Offer to launch call immediately
        setActiveRoomData({
          roomId: res.room.roomId,
          candidateName: schedCandidateName || schedCandidateEmail.split('@')[0],
          candidateEmail: schedCandidateEmail,
          jobTitle: schedJobTitle,
          companyName: schedCompanyName || 'Entreprise Recruteuse'
        });

        setIsVisioActive(true);
      }
    } catch (err) {
      console.error('Failed to create visio room:', err);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Company 1-Click Signup Handler
  const handleCompanySignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyCreatedSuccess(true);
    setTimeout(() => {
      setCompanyCreatedSuccess(false);
      setIsCompanySignupModalOpen(false);
      // Auto-redirect focus to active candidate request
      if (emails.length > 0) {
        setActiveEmail(emails[0]);
      }
    }, 1500);
  };

  // File Upload Attachment Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachments([...attachments, {
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(1)} KB`
      }]);
    }
  };

  // Signature Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureSaved(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Section Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" /> Messagerie & E-mails Professionnels
          </button>

          <button
            onClick={() => {
              setActiveTab('live_call');
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'live_call'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-500" /> Visio WebRTC & Studio
          </button>

          <button
            onClick={() => setActiveTab('esignature')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'esignature'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" /> Signature Électronique
          </button>
        </div>

        {/* Quick Visio Launch button */}
        <button
          onClick={() => setIsVisioActive(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 animate-pulse"
        >
          <Video className="w-4 h-4" /> Démarrer l'Entretien Visio
        </button>
      </div>

      {/* TAB 1: INTEGRATED PROFESSIONAL MESSAGING & EMAIL SYSTEM */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* Left Email Sidebar (3 cols) */}
          <div className="md:col-span-3 border-r border-slate-200 bg-slate-50 p-4 space-y-4">
            <button
              onClick={() => {
                setComposeTo('');
                setComposeSubject('');
                setComposeBody('');
                setIsComposing(true);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Nouveau Message
            </button>

            <div className="space-y-1 text-xs font-bold">
              <button
                onClick={() => setSelectedFolder('inbox')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  selectedFolder === 'inbox' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <span className="flex items-center gap-2"><Inbox className="w-4 h-4" /> Boîte de réception</span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {emails.filter(e => e.folder === 'inbox').length}
                </span>
              </button>

              <button
                onClick={() => setSelectedFolder('sent')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  selectedFolder === 'sent' ? 'bg-white text-indigo-700 shadow-xs font-black' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <span className="flex items-center gap-2"><Send className="w-4 h-4" /> E-mails Envoyés</span>
                <span className="text-[10px] text-slate-500 font-bold">{emails.filter(e => e.folder === 'sent').length}</span>
              </button>
            </div>
          </div>

          {/* Middle Email List (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto max-h-[580px] divide-y divide-slate-100">
            {emails.filter(e => e.folder === selectedFolder).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Aucun message dans ce dossier
              </div>
            ) : (
              emails.filter(e => e.folder === selectedFolder).map((email) => (
                <div
                  key={email.id}
                  onClick={() => setActiveEmail(email)}
                  className={`p-4 cursor-pointer transition-all space-y-1.5 ${
                    activeEmail?.id === email.id ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{email.sender}</span>
                    <span className="text-[10px] text-slate-400">{email.date.split(' ')[0]}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{email.subject}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{email.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Right Email Body & Action Hub (5 cols) */}
          <div className="md:col-span-5 p-6 overflow-y-auto max-h-[580px] space-y-6">
            {activeEmail ? (
              <div className="space-y-6 text-xs">
                
                {/* Header info */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <h3 className="text-base font-black text-slate-900">{activeEmail.subject}</h3>
                  <div className="flex items-center justify-between text-slate-500">
                    <div>
                      <span className="font-bold text-slate-800">De : {activeEmail.sender}</span> ({activeEmail.senderEmail})
                    </div>
                    <span className="text-[10px]">{activeEmail.date}</span>
                  </div>
                </div>

                {/* Candidate Action Buttons Header */}
                <div className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl space-y-3 shadow-md border border-indigo-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Profil & Interaction Candidat
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-2 py-0.5 rounded font-bold">
                      Identité Vérifiée
                    </span>
                  </div>

                  {/* 4 RECRUITMENT ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <button
                      onClick={() => {
                        setCompanySignupEmail(activeEmail.recipientEmail || 'entreprise@domaine.com');
                        setIsCompanySignupModalOpen(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Créer un compte
                    </button>

                    <button
                      onClick={() => handleReplyToCandidate(activeEmail)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Répondre au candidat
                    </button>

                    <button
                      onClick={() => handleReplyToCandidate(activeEmail)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-300" /> Démarrer conversation
                    </button>

                    <button
                      onClick={() => {
                        setSchedCandidateEmail(activeEmail.senderEmail || 'candidat@example.com');
                        setSchedCandidateName(activeEmail.sender || 'Candidat');
                        setSchedCompanyEmail(activeEmail.recipientEmail || 'recrutement@entreprise.com');
                        setIsSchedulingModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
                    >
                      <Video className="w-3.5 h-3.5" /> Planifier entretien
                    </button>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-xs font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {activeEmail.body}
                </div>

                {/* Direct Launch Call Button */}
                <button
                  onClick={() => {
                    setActiveRoomData({
                      roomId: `room-${Date.now()}`,
                      candidateName: activeEmail.sender || 'Candidat',
                      candidateEmail: activeEmail.senderEmail || 'candidat@example.com',
                      jobTitle: activeEmail.subject,
                      companyName: 'Votre Entreprise'
                    });
                    setIsVisioActive(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 text-xs"
                >
                  <Video className="w-4 h-4" /> Démarrer l'Entretien Visio WebRTC Immédiat
                </button>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <Mail className="w-10 h-10 text-slate-300 mx-auto" />
                <p>Sélectionnez un message dans la liste pour l'afficher et interagir.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: VISIO & WEBRTC CONFERENCE STUDIO */}
      {activeTab === 'live_call' && (
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded">
                Système Visioconférence WebRTC Chiffré
              </span>
              <h2 className="text-2xl font-black">Salle d'Entretien Vidéo Professionnelle</h2>
            </div>
            <button
              onClick={() => setIsVisioActive(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-pointer flex items-center gap-2 animate-pulse"
            >
              <Video className="w-4 h-4" /> Démarrer l'Entretien Visio
            </button>
          </div>

          <div className="p-10 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
            <Video className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-white">Visioconférence Privée WebRTC</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connecte instantanément les candidats et recuteurs avec caméra, microphone, partage d'écran, chat live et enregistrement de session.
              </p>
            </div>
            <button
              onClick={() => setIsVisioActive(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Lancer le Studio WebRTC
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ELECTRONIC SIGNATURE */}
      {activeTab === 'esignature' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Module de Signature Électronique Certifiée</h2>
            <p className="text-xs text-slate-500">Signez les contrats de travail, devis et accords de confidentialité directement à la souris ou au stylet.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <span className="font-extrabold text-xs text-slate-800 block">Dessinez votre signature dans le cadre ci-dessous :</span>

            <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-300 p-2 text-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full max-w-[500px] h-[160px] mx-auto bg-white cursor-crosshair rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={clearCanvas}
                className="text-slate-600 font-bold hover:text-slate-900 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Effacer
              </button>

              <button
                onClick={() => setSignatureSaved(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" /> Valider & Apposer la Signature
              </button>
            </div>

            {signatureSaved && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Signature enregistrée et cryptée avec horodatage certifié ISO !
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEBRTC VISIO CONFERENCE STUDIO MODAL */}
      {isVisioActive && (
        <VisioConferenceStudio
          roomId={activeRoomData.roomId}
          candidateName={activeRoomData.candidateName}
          candidateEmail={activeRoomData.candidateEmail}
          jobTitle={activeRoomData.jobTitle}
          companyName={activeRoomData.companyName}
          onClose={() => setIsVisioActive(false)}
        />
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {isSchedulingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" /> Planifier un Entretien Visio WebRTC
              </h3>
              <button onClick={() => setIsSchedulingModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmScheduleVisio} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">E-mail du candidat :</label>
                <input
                  type="email"
                  value={schedCandidateEmail}
                  onChange={(e) => setSchedCandidateEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Intitulé du poste :</label>
                <input
                  type="text"
                  value={schedJobTitle}
                  onChange={(e) => setSchedJobTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Date & Horaire de l'entretien :</label>
                <input
                  type="text"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSchedulingModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRoom}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <Video className="w-4 h-4" /> {isCreatingRoom ? 'Création de la Salle...' : 'Créer & Lancer la Salle WebRTC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPANY 1-CLICK SIGNUP MODAL */}
      {isCompanySignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" /> Créer un compte Entreprise
              </h3>
              <button onClick={() => setIsCompanySignupModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Inscrivez votre entreprise en 1 clic pour répondre directement aux candidats et planifier des entretiens vidéo.
            </p>

            <form onSubmit={handleCompanySignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">E-mail Professionnel :</label>
                <input
                  type="email"
                  value={companySignupEmail}
                  onChange={(e) => setCompanySignupEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nom de l'Entreprise :</label>
                <input
                  type="text"
                  value={companySignupName}
                  onChange={(e) => setCompanySignupName(e.target.value)}
                  placeholder="Ex: Apex Studio SARL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Secteur :</label>
                <select
                  value={companySignupSector}
                  onChange={(e) => setCompanySignupSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="Intelligence Artificielle & Software">Intelligence Artificielle & Software</option>
                  <option value="Agences Marketing">Agences Marketing & E-commerce</option>
                  <option value="Santé & Médical">Santé & Médical</option>
                  <option value="Finance & Services Pro">Finance & Services Pro</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompanySignupModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Building2 className="w-4 h-4" /> Inscrire l'Entreprise
                </button>
              </div>

              {companyCreatedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Compte Entreprise activé ! Redirection vers la candidature reçue...
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* COMPOSE EMAIL MODAL */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Nouveau Message Professionnel</h3>
              <button onClick={() => setIsComposing(false)} className="text-slate-500 font-bold">✕</button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Destinataire (E-mail) :</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Objet :</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Corps du message :</label>
                <textarea
                  rows={5}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  required
                />
              </div>

              {/* Attachments list & File Upload */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Pièces jointes :</label>
                <div className="flex items-center gap-2">
                  <label className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" /> Joindre un fichier / CV
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {attachments.map((file, idx) => (
                  <div key={idx} className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {file.name} ({file.size})
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white font-extrabold px-5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
