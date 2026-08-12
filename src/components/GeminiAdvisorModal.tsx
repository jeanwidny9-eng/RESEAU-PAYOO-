import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Smartphone,
  Globe,
  Video,
  FileCode,
  Copy,
  Check,
  Download,
  Zap,
  CheckCircle2,
  HelpCircle,
  Crown,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { PlanType } from '../types';

interface GeminiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: PlanType;
  onOpenUpgradeModal: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  topic?: string;
  timestamp: string;
}

export const GeminiAdvisorModal: React.FC<GeminiAdvisorModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  onOpenUpgradeModal
}) => {
  if (!isOpen) return null;

  const isVipUser = activePlan === 'ultimate_vip' || activePlan === 'enterprise' || activePlan === 'agency';

  const [inputMessage, setInputMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'apps' | 'websites' | 'videos' | 'roadmap'>('apps');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'gemini',
      text: `👋 **Bonjour ! Je suis Gemini 3.6 Flash, votre Conseiller IA Expert.**

Je suis là pour vous aider à concrétiser toutes vos idées :
- 📱 **Applications Web & Mobiles** : Architecture, Stack tech, Tunnels, Monetization.
- 🌐 **Sites Web & E-commerce** : Wireframe, Copywriting high-converting, SEO.
- 🎬 **Vidéos & Tunnels TikTok/YouTube** : Scripts viraux, Storyboard, Hooks.
- 📋 **Plan d'Action Sur Mesure** : Cahier des charges complet et étapes de réalisation.

Que souhaitez-vous créer aujourd'hui ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      topic: selectedTopic,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          topic: selectedTopic
        })
      });

      const data = await response.json();

      if (data.success && data.advice) {
        const geminiMsg: ChatMessage = {
          id: `gem-${Date.now()}`,
          sender: 'gemini',
          text: data.advice,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, geminiMsg]);
      } else {
        throw new Error('Erreur de réponse API Gemini');
      }
    } catch (err) {
      console.error('Failed to get Gemini response:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'gemini',
        text: '⚠️ Une erreur s\'est produite lors de la connexion à Gemini. Veuillez réessayer dans quelques instants.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPlan = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plan_Action_Gemini_${Date.now()}.md`;
    link.click();
  };

  const quickPrompts = [
    {
      topic: 'apps' as const,
      icon: Smartphone,
      label: 'Plan App Mobile',
      prompt: 'Propose-moi une architecture complète et le cahier des charges pour créer une application mobile SaaS de livraison avec React Native et Supabase.'
    },
    {
      topic: 'websites' as const,
      icon: Globe,
      label: 'Plan Site Web / Landing',
      prompt: 'Crée le plan de structure d\'un site web e-commerce à forte conversion pour une marque de cosmétiques bio avec tunnel de vente.'
    },
    {
      topic: 'videos' as const,
      icon: Video,
      label: 'Script Vidéo Viral',
      prompt: 'Rédige un script vidéo TikTok / Reels de 30 secondes avec un hook explosif pour vendre un service de prospection B2B par IA.'
    },
    {
      topic: 'roadmap' as const,
      icon: FileCode,
      label: 'Cahier des Charges SaaS',
      prompt: 'Donne-moi le plan d\'action étape par étape sur 4 semaines pour développer et lancer un SaaS de gestion de rendez-vous.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/80 border border-purple-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> Plan Ultimate VIP ($500/mo)
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Gemini 3.6 Flash
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                Assistant Gemini IA • Apps, Sites & Vidéos
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIP Lock Guard if user is not VIP */}
        {!isVipUser && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-medium">
              <Crown className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                L'accès illimité à l'assistant Gemini IA pour la création d'apps, sites et vidéos est réservé aux abonnés du <strong>Plan Ultimate VIP (500$/mois)</strong>.
              </span>
            </div>
            <button
              onClick={onOpenUpgradeModal}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black px-4 py-2 rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Passer au Plan VIP ($500/mo)
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
          {/* Topic Selectors */}
          <div className="p-3 bg-white border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs font-bold">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider shrink-0 mr-1">
              Domaine :
            </span>

            <button
              onClick={() => setSelectedTopic('apps')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'apps'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Créer une App Web/Mobile
            </button>

            <button
              onClick={() => setSelectedTopic('websites')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'websites'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Créer un Site / E-commerce
            </button>

            <button
              onClick={() => setSelectedTopic('videos')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'videos'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Créer & Monter des Vidéos
            </button>

            <button
              onClick={() => setSelectedTopic('roadmap')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> Plan d'Action & Cahier des Charges
            </button>
          </div>

          {/* Quick Starter Prompts */}
          <div className="p-3 bg-indigo-50/60 border-b border-indigo-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {quickPrompts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTopic(item.topic);
                    handleSendMessage(item.prompt);
                  }}
                  disabled={isLoading}
                  className="bg-white hover:bg-indigo-100/50 p-2.5 rounded-2xl border border-indigo-200/80 text-left transition-all cursor-pointer flex items-center gap-2 shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 text-[11px] leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Générer en 1-clic
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'gemini' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-purple-200" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 pb-1 border-b border-current/10 font-mono">
                    <span>{msg.sender === 'user' ? 'Vous' : 'Gemini 3.6 Flash IA'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.sender === 'gemini' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? 'Copié' : 'Copier'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadPlan(msg.text)}
                        className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger (.md)</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-extrabold text-xs">
                    VOUS
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-500 text-xs font-bold p-4 bg-white rounded-2xl border border-slate-200/80 max-w-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Gemini analyse votre demande et prépare votre plan...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ex: Donne-moi le plan d'action pour créer une appli mobile de e-commerce avec tunnel..."
                className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50 transition-all text-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Discuter avec Gemini</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
