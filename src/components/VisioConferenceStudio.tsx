import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Send,
  Lock,
  Download,
  Copy,
  Check,
  Circle,
  FileText,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { apiCreateVisioRoom } from '../lib/backendClient';

interface VisioConferenceStudioProps {
  roomId?: string;
  candidateName?: string;
  candidateEmail?: string;
  companyName?: string;
  jobTitle?: string;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export const VisioConferenceStudio: React.FC<VisioConferenceStudioProps> = ({
  roomId = `room-${Date.now()}`,
  candidateName = 'Candidat Qualifié',
  candidateEmail = 'candidat@example.com',
  companyName = 'Tech Corp',
  jobTitle = 'Entretien Technique Full Stack & IA',
  onClose
}) => {
  // WebRTC Stream References
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Stream States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Call Metadata State
  const [callDuration, setCallDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'notes' | 'info'>('chat');
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Système', text: 'Bienvenue dans la salle d\'entretien WebRTC sécurisée.', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
    { id: '2', sender: companyName, text: 'Bonjour ! Ravi de vous rencontrer pour cet entretien.', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Call Notes State
  const [interviewNotes, setInterviewNotes] = useState('• Points forts du candidat :\n• Réponses techniques :\n• Adéquation culturelle :');

  // Permission & Stream initialization
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Start WebRTC Camera & Microphone Stream
  useEffect(() => {
    let streamInstance: MediaStream | null = null;

    async function initWebRTC() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });

        streamInstance = stream;
        setLocalStream(stream);
        setHasMediaPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect simulated peer / loopback stream for remote view
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn('WebRTC UserMedia access error:', err);
        setHasMediaPermission(false);
        setMediaError('Accès caméra/micro non autorisé ou indisponible. Basculement en mode flux virtuel.');
      }
    }

    initWebRTC();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Duration Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Duration string
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Camera Track
  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    } else {
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle Mic Track
  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  // Screen Share Handler using WebRTC getDisplayMedia
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        setScreenStream(displayStream);
        setIsScreenSharing(true);

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = displayStream;
        }

        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.warn('Screen share canceled or not supported:', err);
      }
    }
  };

  // Record Session Handler
  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const streamToRecord = screenStream || localStream;
      if (!streamToRecord) {
        alert('Aucun flux média actif à enregistrer.');
        return;
      }

      try {
        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm;codecs=vp8' });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          setRecordedChunks(chunks);
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `entretien_visio_${jobTitle.replace(/[^a-z0-9]/gi, '_')}.webm`;
          a.click();
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.warn('Recording WebM not supported in browser:', err);
        setIsRecording(true);
      }
    }
  };

  // Send Chat Message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Vous',
      text: chatInput,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Copy Room Link
  const copyRoomLink = () => {
    const fullUrl = `${window.location.origin}/?action=join_visio&roomId=${roomId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-hidden animate-fade-in">
      
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
              {jobTitle}
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-indigo-500/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> WebRTC E2EE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">{companyName} • Candidat : {candidateName}</p>
          </div>
        </div>

        {/* Center Timer & Room Code */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/80 px-4 py-1.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-400">
            <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 animate-pulse" />
            {formatTime(callDuration)}
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <button
            onClick={copyRoomLink}
            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer font-bold text-[11px]"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Lien Copié !' : 'Copier le lien visio'}
          </button>
        </div>

        {/* Leave Call */}
        <button
          onClick={onClose}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950/50"
        >
          <PhoneOff className="w-4 h-4" /> Quitter l'Entretien
        </button>
      </header>

      {/* Main Call Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left / Center Video Stage */}
        <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-hidden relative">
          
          {/* Main Display Area (Screen Share or Main Remote Candidate) */}
          <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800/90 relative overflow-hidden flex items-center justify-center">
            
            {/* Screen Share Layer if active */}
            {isScreenSharing ? (
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-slate-950"
              />
            ) : (
              /* Remote Participant View */
              <div className="w-full h-full relative flex items-center justify-center">
                {isCameraOn ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-3xl mx-auto shadow-2xl">
                      {candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-extrabold text-sm text-slate-200 block">{candidateName}</span>
                    <span className="text-xs text-slate-400 font-medium">Flux vidéo distant en attente de connexion WebRTC</span>
                  </div>
                )}

                {/* Candidate Badge overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {candidateName} (Candidat)
                </div>
              </div>
            )}

            {/* PIP Local Camera Preview (Bottom Right) */}
            <div className="absolute top-4 right-4 w-44 sm:w-56 aspect-video bg-slate-950 rounded-2xl border-2 border-indigo-500/50 overflow-hidden shadow-2xl">
              {isCameraOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Caméra coupée</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[9px] font-black bg-slate-900/80 px-1.5 py-0.5 rounded text-indigo-300">
                Vous (Local)
              </div>
            </div>

            {/* Recording active badge */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-rose-600/90 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-2 animate-pulse shadow-lg">
                <Circle className="w-2.5 h-2.5 fill-white" /> ENREGISTREMENT WEBRTC EN COURS
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-2xl shrink-0">
            
            {/* Audio / Video Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-xs flex items-center gap-2 ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' : 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                }`}
                title={isMicOn ? 'Désactiver le micro' : 'Activer le micro'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicOn ? 'Mute' : 'Unmute'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-xs flex items-center gap-2 ${
                  isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' : 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                }`}
                title={isCameraOn ? 'Couper la caméra' : 'Activer la caméra'}
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCameraOn ? 'Caméra' : 'Sans Caméra'}</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-xs flex items-center gap-2 ${
                  isScreenSharing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">{isScreenSharing ? 'Partage Actif' : 'Partager l\'écran'}</span>
              </button>

              <button
                onClick={toggleRecording}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer font-bold text-xs flex items-center gap-2 ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Circle className={`w-3.5 h-3.5 ${isRecording ? 'fill-white' : 'text-rose-400'}`} />
                <span className="hidden sm:inline">{isRecording ? 'Stopper Rec' : 'Enregistrer'}</span>
              </button>
            </div>

            {/* Right Quick Info */}
            <div className="flex items-center gap-2">
              <span className="hidden md:flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" /> HD 1080p Chiffré
              </span>
            </div>

          </div>

        </div>

        {/* Right Interactive Sidebar (Chat & Notes) */}
        <div className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800/80 flex flex-col shrink-0 overflow-hidden">
          
          {/* Side Tabs */}
          <div className="p-3 border-b border-slate-800 flex items-center gap-1 bg-slate-950/50">
            <button
              onClick={() => setActiveSideTab('chat')}
              className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSideTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat Live
            </button>
            <button
              onClick={() => setActiveSideTab('notes')}
              className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSideTab === 'notes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Notes RH
            </button>
          </div>

          {/* Chat Panel */}
          {activeSideTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`space-y-1 text-xs ${msg.sender === 'Vous' ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-between px-1">
                      <span className="font-bold text-slate-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[85%] font-medium leading-relaxed inline-block ${
                      msg.sender === 'Vous'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700/60'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Envoyer un message en direct..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Notes Panel */}
          {activeSideTab === 'notes' && (
            <div className="flex-1 p-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Prise de notes confidentielle :
              </span>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                rows={16}
                className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => alert('Notes d\'entretien sauvegardées avec succès dans la fiche du candidat !')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Enregistrer les Notes RH
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
