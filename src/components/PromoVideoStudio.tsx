import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Mail,
  TrendingUp,
  Target,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Share2,
  Tv,
  Clock,
  Film,
  Download,
  Loader2,
  Wand2,
  CheckCircle2
} from 'lucide-react';

interface PromoVideoStudioProps {
  onStartSearch: () => void;
  onGoToPricing: () => void;
}

interface VideoScene {
  id: number;
  duration: number;
  badge: string;
  title: string;
  subtitle: string;
  narration: string;
  bgGradient: string;
  icon?: any;
  highlightText: string;
  visualMockup?: React.ReactNode;
  mockupType?: string;
}

export const PromoVideoStudio: React.FC<PromoVideoStudioProps> = ({
  onStartSearch,
  onGoToPricing
}) => {
  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);
  const [selectedDurationMode, setSelectedDurationMode] = useState<'60s' | '30s' | '15s'>('60s');

  // AI Script Generator Form state
  const [isGenerating, setIsGenerating] = useState(false);
  const [customProduct, setCustomProduct] = useState('PAYOO REZO — NicheLead Finder');
  const [customTopic, setCustomTopic] = useState('Prospection B2B automatisée avec l’IA Gemini');
  const [customAudience, setCustomAudience] = useState('Agences Marketing, Freelances & Consultants');

  // Pre-configured 60-Second Video Scenes (8 scenes = 60s total)
  const default60sScenes: VideoScene[] = [
    {
      id: 1,
      duration: 7,
      badge: '01. PROBLÈME B2B (7s)',
      title: 'Perdez-vous du temps sur la prospection manuelle ?',
      subtitle: 'Trouver des prospects qualifiés à la main prend plus de 15 heures chaque semaine.',
      narration: 'Chaque jour, des milliers d\'agences et indépendants perdent un temps précieux à chercher des clients qualifiés à la main sans aucun résultat garanti.',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      icon: Search,
      highlightText: 'Plus de 15 heures perdues par semaine.',
      mockupType: 'problem'
    },
    {
      id: 2,
      duration: 8,
      badge: '02. LA RÉVOLUTION IA (8s)',
      title: 'DÉCOUVREZ NICHELEAD FINDER',
      subtitle: 'Le moteur de prospection B2B propulsé par l’IA Gemini.',
      narration: 'Voici NicheLead Finder sur PAYOO REZO : la solution propulsée par l’Intelligence Artificielle Gemini qui révolutionne votre prospection B2B.',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      icon: Target,
      highlightText: '20,000+ données d’entreprises scannées.',
      mockupType: 'feature'
    },
    {
      id: 3,
      duration: 8,
      badge: '03. RECHERCHE CIBLÉE (8s)',
      title: 'Ciblez n’importe quelle niche & ville',
      subtitle: 'Accédez aux décideurs locaux avec des données vérifiées.',
      narration: 'Tapez simplement votre niche et votre ville cible. L’IA scanne le web en temps réel et identifie les failles numériques de vos futurs clients.',
      bgGradient: 'from-slate-900 via-indigo-950 to-blue-950',
      icon: Search,
      highlightText: 'Base de données mise à jour en temps réel.',
      mockupType: 'feature'
    },
    {
      id: 4,
      duration: 8,
      badge: '04. OUTREACH AUTOMATISÉ (8s)',
      title: 'Cold Emails & Messages LinkedIn IA',
      subtitle: 'Messages rédigés sur-mesure selon les vulnérabilités du prospect.',
      narration: 'En un clic, générez des e-mails chauds et des messages LinkedIn ultra-personnalisés avec un taux de réponse moyen supérieur à 34%.',
      bgGradient: 'from-indigo-950 via-slate-900 to-blue-950',
      icon: Mail,
      highlightText: 'Taux de réponse moyen > 34%.',
      mockupType: 'feature'
    },
    {
      id: 5,
      duration: 8,
      badge: '05. AUDIT & SCORE LEAD (8s)',
      title: 'Calculateur de Lead Score (65 à 98/100)',
      subtitle: 'Sachez précisément quel argument utiliser avant de contacter le prospect.',
      narration: 'Chaque prospect reçoit un score d’opportunité précis et un diagnostic personnalisé prêt à être envoyé à votre futur client.',
      bgGradient: 'from-blue-950 via-indigo-950 to-slate-900',
      icon: Sparkles,
      highlightText: 'Angle d’approche personnalisé généré par Gemini.',
      mockupType: 'result'
    },
    {
      id: 6,
      duration: 8,
      badge: '06. PIPELINE CRM & EXPORT (8s)',
      title: 'Suivi commercial & Export CSV en 1 Clic',
      subtitle: 'Gérez les étapes (Nouveau, Contacté, Répondu, Gagné) et synchronisez votre CRM.',
      narration: 'Organisez tout votre pipeline commercial et exportez l’ensemble de vos données en CSV vers HubSpot, GoHighLevel ou Excel.',
      bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
      icon: TrendingUp,
      highlightText: 'Export CSV instantané & illimité.',
      mockupType: 'crm'
    },
    {
      id: 7,
      duration: 7,
      badge: '07. IMPACT SUR VOTRE CA (7s)',
      title: 'Multipliez vos rendez-vous par 3',
      subtitle: 'Signez des contrats récurrents sans gaspiller votre budget ad.',
      narration: 'Ne laissez plus vos concurrents prendre vos contrats. Développez votre chiffre d’affaires dès cette semaine.',
      bgGradient: 'from-indigo-950 via-blue-950 to-slate-900',
      icon: Zap,
      highlightText: '85% de gain de temps sur la prospection.',
      mockupType: 'result'
    },
    {
      id: 8,
      duration: 6,
      badge: '08. ESSAI GRATUIT (6s)',
      title: 'Commencez Gratuitement Aujourd’hui',
      subtitle: 'Obtenez vos 10 premiers prospects immédiatement sans CB.',
      narration: 'Essayez gratuitement dès aujourd’hui sur PAYOO REZO. Aucune carte de crédit requise !',
      bgGradient: 'from-blue-900 via-indigo-900 to-slate-950',
      icon: Sparkles,
      highlightText: 'Prêt en 30 secondes chrono.',
      mockupType: 'cta'
    }
  ];

  const [activeScenes, setActiveScenes] = useState<VideoScene[]>(default60sScenes);
  const [activeScriptText, setActiveScriptText] = useState<string>(
    `🎥 SCRIPT PUBLICITAIRE 60 SECONDES — PAYOO REZO NICHELEAD FINDER\n\n` +
    default60sScenes.map((s, idx) => `[00:${String(idx * 7).padStart(2, '0')}] ${s.badge}\n"${s.narration}"`).join('\n\n')
  );

  // Compute total duration of active scenes
  const totalDurationSeconds = activeScenes.reduce((acc, scene) => acc + scene.duration, 0);

  // Switch presets (60s, 30s, 15s)
  const handleSelectPreset = (mode: '60s' | '30s' | '15s') => {
    setSelectedDurationMode(mode);
    setIsPlaying(false);
    setCurrentScene(0);
    setProgress(0);

    if (mode === '60s') {
      setActiveScenes(default60sScenes);
      setActiveScriptText(
        `🎥 SCRIPT PUBLICITAIRE 60 SECONDES (1 MINUTE)\n\n` +
        default60sScenes.map((s, idx) => `[Scène ${idx + 1} - ${s.duration}s] ${s.badge}\n"${s.narration}"`).join('\n\n')
      );
    } else if (mode === '30s') {
      const sliced30s = default60sScenes.slice(0, 4).map(s => ({ ...s, duration: 7 }));
      setActiveScenes(sliced30s);
      setActiveScriptText(
        `🎥 SCRIPT PUBLICITAIRE 30 SECONDES EXPRESS\n\n` +
        sliced30s.map((s, idx) => `[Scène ${idx + 1}] ${s.badge}\n"${s.narration}"`).join('\n\n')
      );
    } else {
      const sliced15s = [default60sScenes[0], default60sScenes[1], default60sScenes[7]].map(s => ({ ...s, duration: 5 }));
      setActiveScenes(sliced15s);
      setActiveScriptText(
        `🎥 SCRIPT PUBLICITAIRE 15 SECONDES TIKTOK/REELS\n\n` +
        sliced15s.map((s, idx) => `[Scène ${idx + 1}] ${s.badge}\n"${s.narration}"`).join('\n\n')
      );
    }
  };

  // Generate Custom 1-Minute Script with Gemini AI
  const handleGenerateAIScript = async () => {
    setIsGenerating(true);
    setIsPlaying(false);
    setCurrentScene(0);
    setProgress(0);

    try {
      const response = await fetch('/api/video/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: customProduct,
          topic: customTopic,
          targetAudience: customAudience,
          durationSeconds: 60,
          language: 'French'
        })
      });

      const data = await response.json();
      if (data.success && data.script && Array.isArray(data.script.scenes)) {
        const generatedScenes: VideoScene[] = data.script.scenes.map((sc: any, idx: number) => ({
          id: idx + 1,
          duration: sc.duration || 7,
          badge: sc.badge || `0${idx + 1}. SCÈNE ${sc.duration || 7}S`,
          title: sc.title || 'Titre de la séquence',
          subtitle: sc.subtitle || 'Sous-titre descriptif',
          narration: sc.narration || '',
          bgGradient: idx % 2 === 0 ? 'from-slate-900 via-indigo-950 to-slate-900' : 'from-blue-950 via-slate-900 to-indigo-950',
          icon: sc.mockupType === 'problem' ? Search : sc.mockupType === 'result' ? Sparkles : sc.mockupType === 'crm' ? TrendingUp : Target,
          highlightText: sc.highlightText || 'Points clés',
          mockupType: sc.mockupType || 'feature'
        }));

        setActiveScenes(generatedScenes);
        setActiveScriptText(data.script.advertisingScriptText || JSON.stringify(data.script, null, 2));
        setSelectedDurationMode('60s');
      }
    } catch (err) {
      console.error('Failed to generate AI video script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Voice narration speech synthesis
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeScenes.length > 0) {
      const currentSceneObj = activeScenes[currentScene] || activeScenes[0];
      const activeDuration = currentSceneObj.duration || 7;
      speakText(currentSceneObj.narration);

      const intervalMs = 100;
      const totalSteps = (activeDuration * 1000) / intervalMs;

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentScene < activeScenes.length - 1) {
              setCurrentScene((s) => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 100 / totalSteps;
        });
      }, intervalMs);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => clearInterval(timer);
  }, [isPlaying, currentScene, activeScenes, voiceEnabled]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (progress >= 100 && currentScene === activeScenes.length - 1) {
        setCurrentScene(0);
        setProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    setProgress(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const currentSceneData = activeScenes[currentScene] || activeScenes[0];
  const IconComponent = currentSceneData.icon || Sparkles;

  const copyScript = () => {
    navigator.clipboard.writeText(activeScriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // Render dynamic mockups based on scene mockupType
  const renderMockup = (scene: VideoScene) => {
    if (scene.mockupType === 'cta') {
      return (
        <button
          onClick={onStartSearch}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          Lancer ma première recherche de prospects (Gratuit)
        </button>
      );
    }

    if (scene.mockupType === 'problem') {
      return (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-left shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Recherche manuelle inefficace (Google Maps & Annuaires)
          </div>
          <div className="space-y-1.5 opacity-70">
            <div className="h-2.5 bg-slate-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-2.5 bg-slate-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-2.5 bg-slate-700 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (scene.mockupType === 'crm') {
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-amber-400">
            Contactés (18)
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-purple-400">
            Réponses (7)
          </div>
          <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/40 text-emerald-300">
            Contrats Gagnés 🎉 ($18,400)
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 text-left shadow-2xl space-y-2">
        <div className="flex justify-between items-center text-xs text-blue-300">
          <span className="font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gemini AI Lead Score: 96/100
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Opportunité Élevée
          </span>
        </div>
        <p className="text-white font-bold text-sm">Cabinet Médical / Dentaire Prestige</p>
        <p className="text-xs text-slate-300">Diagnostic IA : Inexistence de tunnel de réservation & Score mobile 38/100</p>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Top Banner & Heading */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Film className="w-3.5 h-3.5 text-indigo-600" />
            Studio Vidéo Commercial & Démo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Générateur de Vidéo Promo 1 Minute (60 Secondes)
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Créez, visualisez et exportez des spots vidéo commerciaux complets de 60 secondes avec séquences animées et voix-off pour vos réseaux sociaux et publicités.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onStartSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            Lancer la Prospection
          </button>
        </div>
      </div>

      {/* Preset Duration Selector Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Format & Durée de la Vidéo :</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleSelectPreset('60s')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedDurationMode === '60s'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            1 Minute (60s complet)
          </button>

          <button
            onClick={() => handleSelectPreset('30s')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedDurationMode === '30s'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            30 Sec Express
          </button>

          <button
            onClick={() => handleSelectPreset('15s')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedDurationMode === '15s'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            15 Sec Hook TikTok
          </button>
        </div>
      </div>

      {/* Main Player Screen Stage */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        <div
          className={`p-8 sm:p-14 min-h-[440px] flex flex-col justify-between transition-all duration-700 bg-gradient-to-br ${currentSceneData.bgGradient} text-white relative`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <IconComponent className="w-3.5 h-3.5" />
              {currentSceneData.badge}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                Durée Totale : {totalDurationSeconds}s
              </span>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                  voiceEnabled
                    ? 'bg-blue-600/40 border-blue-400/50 text-blue-200'
                    : 'bg-white/10 border-white/20 text-slate-400'
                }`}
                title="Activer/Désactiver la voix off"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline font-medium">
                  {voiceEnabled ? 'Voix Off Activée' : 'Voix Off Muette'}
                </span>
              </button>
            </div>
          </div>

          {/* Slide Main Content */}
          <div className="my-8 space-y-6 max-w-2xl mx-auto text-center z-10 animate-fade-in key={currentScene}">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              {currentSceneData.title}
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {currentSceneData.subtitle}
            </p>

            {/* Visual Mockup Box */}
            <div className="pt-2 max-w-md mx-auto">
              {renderMockup(currentSceneData)}
            </div>

            <div className="inline-block bg-white/10 border border-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
              💡 {currentSceneData.highlightText}
            </div>
          </div>

          {/* Timeline & Controls Bar */}
          <div className="space-y-3 z-10">
            {/* Scene Step Progress Bars */}
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${activeScenes.length}, minmax(0, 1fr))` }}>
              {activeScenes.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setCurrentScene(idx);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer relative overflow-hidden ${
                    idx === currentScene
                      ? 'bg-slate-700 border border-blue-400/50'
                      : idx < currentScene
                      ? 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                  title={`Scène ${idx + 1}: ${sc.title}`}
                >
                  {idx === currentScene && (
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-slate-200 flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-900" /> : <Play className="w-5 h-5 fill-slate-900 ml-0.5" />}
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Redémarrer la vidéo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="font-mono text-slate-300">
                  Scène {currentScene + 1} / {activeScenes.length} ({currentSceneData.duration}s)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Marque :</span>
                <span className="font-bold text-white bg-indigo-600/40 px-2.5 py-0.5 rounded border border-indigo-500/30">
                  PAYOO REZO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Video Script Generator Form */}
      <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900 to-blue-900/30 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-400" />
              Générateur IA de Vidéo 1 Minute (60s Sur-Mesure)
            </h3>
            <p className="text-slate-300 text-xs">
              Saisissez le nom de votre offre ou entreprise pour générer automatiquement une vidéo promotionnelle de 60 secondes avec script et séquences visuelles Gemini AI.
            </p>
          </div>

          <button
            onClick={handleGenerateAIScript}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Génération du script 60s par Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Générer ma Vidéo 60s par IA</span>
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Nom du Produit / Service :</label>
            <input
              type="text"
              value={customProduct}
              onChange={(e) => setCustomProduct(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              placeholder="ex: PAYOO REZO — NicheLead Finder"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Public Cible :</label>
            <input
              type="text"
              value={customAudience}
              onChange={(e) => setCustomAudience(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              placeholder="ex: Agences, Freelances, Consultants"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Sujet / Argument Clé :</label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              placeholder="ex: Prospection B2B automatisée avec l'IA Gemini"
            />
          </div>
        </div>
      </div>

      {/* Script Breakdown & Export Box */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Voiceover Script Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              Script Publicitaire & Voix-Off (60 Sec Format Ads)
            </h3>

            <button
              onClick={copyScript}
              className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copié !' : 'Copier le script'}</span>
            </button>
          </div>

          <textarea
            rows={10}
            readOnly
            value={activeScriptText}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none"
          />
        </div>

        {/* Storyboard Sequences Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Séquences de la Vidéo 1 Minute ({activeScenes.length} scènes)
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {activeScenes.map((sc, idx) => (
                <div
                  key={sc.id}
                  onClick={() => {
                    setCurrentScene(idx);
                    setProgress(0);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    idx === currentScene
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-indigo-600">{sc.badge}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{sc.duration}s</span>
                  </div>
                  <p className="truncate text-slate-800">{sc.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onStartSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Lancer NicheLead Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToPricing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-3 rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              Voir les Abonnements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
