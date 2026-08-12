import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Mail,
  Linkedin,
  Clock,
  RefreshCw,
  Building2,
  Send,
  Sliders,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { Lead, OutreachMessage } from '../types';

interface OutreachGeneratorModalProps {
  lead: Lead | null;
  onClose: () => void;
  onSaveLead?: (lead: Lead) => void;
  isLeadSaved?: boolean;
}

export const OutreachGeneratorModal: React.FC<OutreachGeneratorModalProps> = ({
  lead,
  onClose,
  onSaveLead,
  isLeadSaved = false
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'email' | 'linkedin' | 'followup'>('email');
  const [tone, setTone] = useState('Consultatif & Utile');
  const [offeredService, setOfferedService] = useState('SEO & Positionnement Google Maps');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [outreachData, setOutreachData] = useState<OutreachMessage>({
    coldEmailSubject: `Remarque rapide concernant la présence en ligne de ${lead.name}`,
    coldEmailBody: `Bonjour à l'équipe de ${lead.name},

Je faisais des recherches sur les meilleures entreprises du secteur ${lead.niche.toLowerCase()} à ${lead.location} et je suis tombé sur ${lead.name}. Votre réputation locale est excellente, mais j'ai remarqué un point d'amélioration rapide qui pourrait vous faire perdre des clients potentiels.

Précisément : ${lead.suggestedAngle}

Nous avons récemment aidé une entreprise similaire dans le secteur ${lead.niche.toLowerCase()} à mettre en place une stratégie d'optimisation ciblée, ce qui a entraîné une augmentation de 34% des demandes de devis qualifiées en 30 jours.

J'ai enregistré une courte vidéo de 3 minutes montrant comment votre équipe peut corriger ce point immédiatement. Seriez-vous ouvert à y jeter un coup d'œil ?

Cordialement,
[Votre Nom]
Partenaire Croissance`,
    linkedinMessage: `Bonjour ! Bravo pour la croissance de ${lead.name} à ${lead.location}. J'ai remarqué une opportunité rapide sur votre présence en ligne qui pourrait générer +20% de demandes qualifiées. Ravi de me connecter pour vous envoyer un audit vidéo de 2 min !`,
    followUpEmailSubject: `Re: Remarque rapide concernant ${lead.name}`,
    followUpEmailBody: `Bonjour,

Je reviens vers vous suite à mon message du début de semaine concernant l'acquisition en ligne de ${lead.name}.

Je sais que la gestion d'une entreprise dans le secteur ${lead.niche.toLowerCase()} demande beaucoup de temps ! Si vous souhaitez toujours recevoir l'analyse vidéo gratuite de 3 minutes, répondez simplement "Oui" et je vous l'envoie tout de suite.

Excellente journée,
[Votre Nom]`
  });

  // Call API to generate fresh AI outreach message if available
  const generateOutreach = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/leads/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: lead.name,
          niche: lead.niche,
          location: lead.location,
          service: offeredService,
          suggestedAngle: lead.suggestedAngle,
          tone
        })
      });

      const data = await response.json();
      if (data.success && data.outreach) {
        setOutreachData(data.outreach);
      }
    } catch (err) {
      console.error('Error generating AI outreach:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateOutreach();
  }, [lead.id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">Générateur de prospection IA</h2>
            </div>
            <p className="text-xs text-slate-400">
              Génération de messages sur mesure pour <strong className="text-white">{lead.name}</strong> ({lead.niche} • {lead.location})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Context Summary Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Angle diagnostiqué :</span>
              <span className="text-slate-700 italic">"{lead.suggestedAngle}"</span>
            </div>

            {onSaveLead && (
              <button
                onClick={() => onSaveLead(lead)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  isLeadSaved
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isLeadSaved ? 'fill-emerald-800' : ''}`} />
                {isLeadSaved ? 'Prospect enregistré' : 'Enregistrer'}
              </button>
            )}
          </div>

          {/* Tone & Service Controls */}
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-700">Ton du message :</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Consultatif & Utile">Consultatif & Utile</option>
                <option value="Direct & Audacieux">Direct & Audacieux</option>
                <option value="Décontracté & Amical">Décontracté & Amical</option>
                <option value="Haute Urgence">Haute Urgence</option>
              </select>
            </div>

            <button
              onClick={generateOutreach}
              disabled={isGenerating}
              className="bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 font-semibold text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Régénérer les messages</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>1. E-mail à froid</span>
          </button>

          <button
            onClick={() => setActiveTab('linkedin')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'linkedin'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Linkedin className="w-4 h-4" />
            <span>2. Note LinkedIn courte</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              &lt; 300 car.
            </span>
          </button>

          <button
            onClick={() => setActiveTab('followup')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'followup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. E-mail de relance (J+3)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isGenerating ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">Génération de la prospection sur mesure avec l'IA Gemini...</p>
              <p className="text-xs text-slate-500">Analyse de la niche, de l'angle de service et du ton choisi</p>
            </div>
          ) : (
            <>
              {/* Cold Email View */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Objet de l'e-mail
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={outreachData.coldEmailSubject}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                      />
                      <button
                        onClick={() => copyToClipboard(outreachData.coldEmailSubject, 'sub')}
                        className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedKey === 'sub' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'sub' ? 'Copié' : 'Copier l\'objet'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Corps de l'e-mail
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `Objet: ${outreachData.coldEmailSubject}\n\n${outreachData.coldEmailBody}`,
                            'emailFull'
                          )
                        }
                        className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'emailFull' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> E-mail complet copié !
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copier tout l'e-mail
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      rows={10}
                      readOnly
                      value={outreachData.coldEmailBody}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* LinkedIn Message View */}
              {activeTab === 'linkedin' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Note de connexion LinkedIn courte
                    </label>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {outreachData.linkedinMessage.length} / 300 caractères
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    readOnly
                    value={outreachData.linkedinMessage}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none"
                  />

                  <button
                    onClick={() => copyToClipboard(outreachData.linkedinMessage, 'linkedin')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {copiedKey === 'linkedin' ? (
                      <>
                        <Check className="w-4 h-4" /> Note LinkedIn copiée !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copier la note LinkedIn
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Follow-Up Email View */}
              {activeTab === 'followup' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Objet de la relance
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={outreachData.followUpEmailSubject}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Corps de l'e-mail de relance
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `Objet: ${outreachData.followUpEmailSubject}\n\n${outreachData.followUpEmailBody}`,
                            'followupFull'
                          )
                        }
                        className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'followupFull' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Relance copiée !
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copier l'e-mail de relance
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      readOnly
                      value={outreachData.followUpEmailBody}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prêt à être copié dans Gmail, Outlook ou LinkedIn
          </div>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
