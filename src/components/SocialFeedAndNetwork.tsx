import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Zap,
  Sparkles,
  Send,
  Video,
  FileText,
  Image as ImageIcon,
  UserPlus,
  Briefcase,
  Globe2,
  MapPin,
  Building2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  ExternalLink,
  Plus,
  X,
  Target,
  MoreHorizontal,
  Flag,
  UserCheck
} from 'lucide-react';
import { SocialPost, PostCategory, CandidateProfile } from '../types';
import { INITIAL_SOCIAL_POSTS } from '../data/sampleSocial';
import { Language } from '../lib/i18n';

interface SocialFeedAndNetworkProps {
  currentLang: Language;
  onOpenMessageWithUser: (userEmail: string, subject: string) => void;
  onOpenVisioWithUser: (userEmail: string, userName: string) => void;
}

export const SocialFeedAndNetwork: React.FC<SocialFeedAndNetworkProps> = ({
  currentLang,
  onOpenMessageWithUser,
  onOpenVisioWithUser
}) => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [activeFeedTab, setActiveFeedTab] = useState<'feed' | 'my_profile' | 'company_profile'>('feed');

  // New Post Form State
  const [isPublishingModalOpen, setIsPublishingModalOpen] = useState(false);
  const [postCategory, setPostCategory] = useState<PostCategory>('text');
  const [postContent, setPostContent] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState('');
  const [postDocumentUrl, setPostDocumentUrl] = useState('');
  const [postDocumentName, setPostDocumentName] = useState('');
  const [postJobTitle, setPostJobTitle] = useState('');
  const [postSalaryText, setPostSalaryText] = useState('');

  // Post Boost Modal State
  const [boostingPost, setBoostingPost] = useState<SocialPost | null>(null);
  const [selectedBoostType, setSelectedBoostType] = useState<'standard' | 'double'>('standard');
  const [targetCountry, setTargetCountry] = useState('Tous les pays');
  const [targetSector, setTargetSector] = useState('Tous les secteurs');
  const [targetProfession, setTargetProfession] = useState('Toutes les professions');
  const [boostSuccessMsg, setBoostSuccessMsg] = useState('');

  // User Profile State
  const [myProfile, setMyProfile] = useState<CandidateProfile>({
    fullName: 'Jean-Marc Duval',
    title: 'Ingénieur Full Stack & Spécialiste IA',
    email: 'user@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France (Remote)',
    bio: 'Passionné par le développement web moderne (React 18, Node.js), le Cloud et l\'intégration de modèles d\'Intelligence Artificielle générative Gemini API. Disponible pour des missions ou postes en Full Remote.',
    skills: ['React 18', 'TypeScript', 'Node.js', 'Gemini AI API', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'WebRTC'],
    experiences: [
      { id: 'exp-1', role: 'Lead Frontend Developer', company: 'Tech Innovation Studio', period: '2022 - Présent', description: 'Architecture d\'applications SaaS à fort trafic et intégrations d\'APIs IA.' },
      { id: 'exp-2', role: 'Full Stack Engineer', company: 'Digital Services Corp', period: '2019 - 2022', description: 'Développement de microservices Node.js et dashboards interactifs.' }
    ],
    education: [
      { id: 'edu-1', degree: 'Master en Ingénierie Logicielle', school: 'École Polytechnique Paris', year: '2019' }
    ],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud AI Engineer'],
    portfolioLinks: [
      { label: 'GitHub Profile', url: 'https://github.com' },
      { label: 'Portfolio Personnel', url: 'https://nichelead.io' }
    ],
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    idVerified: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    coverPhoto: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profession: 'Ingénieur Full Stack & IA',
    country: 'France',
    city: 'Paris',
    availability: 'Immédiate',
    workPreference: 'Remote',
    desiredSalary: 4500,
    currency: 'EUR',
    resumeUrl: 'https://nichelead.io/resumes/cv_jean_marc.pdf',
    portfolioUrl: 'https://nichelead.io/portfolio/jean_marc',
    websiteUrl: 'https://nichelead.io',
    followersCount: 1420,
    followingCount: 380,
    isFollowing: false
  });

  // Handle Like Post
  const handleToggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newLiked = !p.likedByMe;
          return {
            ...p,
            likedByMe: newLiked,
            likesCount: p.likesCount + (newLiked ? 1 : -1)
          };
        }
        return p;
      })
    );
  };

  // Handle Add Comment
  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: myProfile.fullName,
            authorAvatar: myProfile.avatarUrl || '',
            authorTitle: myProfile.title,
            text,
            createdAt: 'À l\'instant'
          };
          const updatedComments = [...(p.comments || []), newComment];
          return {
            ...p,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        }
        return p;
      })
    );
  };

  // Submit Publish Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorType: 'user',
      authorId: 'usr-me',
      authorName: myProfile.fullName,
      authorAvatar: myProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorTitle: myProfile.title,
      authorLocation: myProfile.location,
      authorVerified: true,
      postType: postCategory,
      content: postContent,
      mediaUrl: postMediaUrl || undefined,
      documentUrl: postDocumentUrl || undefined,
      documentName: postDocumentName || undefined,
      jobTitle: postJobTitle || undefined,
      salaryText: postSalaryText || undefined,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      likedByMe: true,
      savedByMe: false,
      isBoosted: false,
      createdAt: 'À l\'instant',
      comments: []
    };

    setPosts([newPost, ...posts]);
    setIsPublishingModalOpen(false);
    setPostContent('');
    setPostMediaUrl('');
    setPostDocumentUrl('');
    setPostDocumentName('');
    setPostJobTitle('');
    setPostSalaryText('');
  };

  // Confirm Boost
  const handleConfirmBoost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boostingPost) return;

    const price = selectedBoostType === 'double' ? 20 : 5;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === boostingPost.id) {
          return {
            ...p,
            isBoosted: true,
            boostType: selectedBoostType,
            boostTargeting: {
              country: targetCountry,
              sector: targetSector,
              profession: targetProfession
            }
          };
        }
        return p;
      })
    );

    setBoostSuccessMsg(`Boost ${selectedBoostType.toUpperCase()} ($${price} USD) activé avec succès ! Votre publication bénéficie d'une visibilité maximale auprès du public ciblé.`);
    setTimeout(() => {
      setBoostSuccessMsg('');
      setBoostingPost(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Mode Selector */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFeedTab('feed')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeFeedTab === 'feed'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe2 className="w-4 h-4" /> Fil d'Actualité Professionnel Mondial
          </button>

          <button
            onClick={() => setActiveFeedTab('my_profile')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeFeedTab === 'my_profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Mon Profil Réseau & CV
          </button>
        </div>

        <button
          onClick={() => setIsPublishingModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Publier une Annonce / Contenu
        </button>
      </div>

      {/* FEED TAB */}
      {activeFeedTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Profile Summary Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Mini Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div
                className="h-24 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${myProfile.coverPhoto})` }}
              >
                <div className="absolute inset-0 bg-slate-900/30" />
              </div>

              <div className="px-6 pt-0 pb-6 relative text-center space-y-3">
                <img
                  src={myProfile.avatarUrl}
                  alt={myProfile.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md mx-auto -mt-10 relative z-10"
                />

                <div>
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-black text-base text-slate-900">{myProfile.fullName}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">{myProfile.title}</p>
                  <p className="text-[11px] text-indigo-600 font-extrabold flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {myProfile.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">Abonnés</span>
                    <span className="font-black text-slate-900 text-sm">{myProfile.followersCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold block">Abonnements</span>
                    <span className="font-black text-slate-900 text-sm">{myProfile.followingCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFeedTab('my_profile')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Gérer mon profil complet & CV
                </button>
              </div>
            </div>

            {/* Recommended Boost Info Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 border border-indigo-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Boost de Publications</h4>
                  <p className="text-[10px] text-indigo-300">Multipliez votre visibilité par 10</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">BOOST STANDARD</span>
                    <span className="text-[10px] text-slate-400">Ciblage pays & compétences</span>
                  </div>
                  <span className="font-black text-emerald-400 text-sm">5 USD</span>
                </div>

                <div className="bg-indigo-950/80 p-3 rounded-2xl border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="font-black text-amber-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> DOUBLE BOOST
                    </span>
                    <span className="text-[10px] text-indigo-200">Priorité Top Opportunité & Stats</span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">20 USD</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                Badge "Sponsorisé" clair, zéro spam par e-mail, respect strict des préférences de notification.
              </p>
            </div>

          </div>

          {/* Right Main Feed Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Publish Box */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={myProfile.avatarUrl}
                  alt={myProfile.fullName}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                />
                <button
                  onClick={() => setIsPublishingModalOpen(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-500 font-medium text-xs px-4 py-3 rounded-2xl text-left transition-all cursor-pointer"
                >
                  Exprimez une demande d'emploi, un projet, un service ou une offre...
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold gap-2">
                <button
                  onClick={() => { setPostCategory('job_request'); setIsPublishingModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" /> Demande d'emploi
                </button>
                <button
                  onClick={() => { setPostCategory('cv'); setIsPublishingModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-purple-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Partager un CV
                </button>
                <button
                  onClick={() => { setPostCategory('service'); setIsPublishingModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-rose-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Proposer un Service
                </button>
                <button
                  onClick={() => { setPostCategory('photo'); setIsPublishingModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-emerald-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" /> Photo / Projet
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`bg-white rounded-3xl border shadow-xs overflow-hidden transition-all ${
                    post.boostType === 'double'
                      ? 'border-amber-400/80 ring-2 ring-amber-400/20'
                      : post.isBoosted
                      ? 'border-indigo-300'
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Boost Header Badge */}
                  {post.isBoosted && (
                    <div
                      className={`px-6 py-2 flex items-center justify-between text-xs font-black ${
                        post.boostType === 'double'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 fill-current" />
                        {post.boostType === 'double' ? 'OPPORTUNITÉ RECOMMANDÉE — DOUBLE BOOST' : 'PUBLICATION SPONSORISÉE'}
                      </span>
                      <span className="text-[10px] font-bold opacity-90">
                        Ciblage : {post.boostTargeting?.country || 'Mondial'}
                      </span>
                    </div>
                  )}

                  {/* Post Author Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-900">{post.authorName}</h4>
                            {post.authorVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{post.authorTitle}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{post.createdAt}</p>
                        </div>
                      </div>

                      {/* Contact Author Button */}
                      <button
                        onClick={() => onOpenMessageWithUser(post.authorName, `Contact via publication: ${post.content.substring(0, 30)}...`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 text-indigo-400" /> Contacter
                      </button>
                    </div>

                    {/* Post Body Content */}
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {post.content}
                    </p>

                    {/* Optional Media Preview */}
                    {post.mediaUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[380px]">
                        <img src={post.mediaUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Optional Document Attachment */}
                    {post.documentUrl && (
                      <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          <div>
                            <span className="font-extrabold text-slate-900 block">{post.documentName || 'Document Joint.pdf'}</span>
                            <span className="text-[10px] text-slate-500">Document professionnel vérifié</span>
                          </div>
                        </div>
                        <a
                          href={post.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Voir le CV / Document
                        </a>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                            post.likedByMe ? 'bg-indigo-50 text-indigo-700 font-black' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" /> {post.likesCount} J'aime
                        </button>

                        <button
                          onClick={() => onOpenMessageWithUser(post.authorName, `Discussion suite à publication`)}
                          className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" /> {post.commentsCount} Commentaires
                        </button>
                      </div>

                      {/* Boost Button */}
                      <button
                        onClick={() => setBoostingPost(post)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5 fill-current" /> Booster cette publication
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="pt-3 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Commentaires :</span>
                        {post.comments.map(c => (
                          <div key={c.id} className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200/60">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{c.authorName} ({c.authorTitle})</span>
                              <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* MY PROFILE TAB */}
      {activeFeedTab === 'my_profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-8 p-6 sm:p-8">
          
          {/* Profile Header */}
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${myProfile.coverPhoto})` }}
            >
              <div className="absolute inset-0 bg-slate-900/40" />
            </div>

            <div className="bg-slate-900 text-white p-6 sm:p-8 relative pt-12 space-y-4">
              <img
                src={myProfile.avatarUrl}
                alt={myProfile.fullName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-2xl absolute -top-12 left-6"
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black">{myProfile.fullName}</h2>
                    <ShieldCheck className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                  </div>
                  <p className="text-sm text-indigo-300 font-extrabold">{myProfile.title}</p>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {myProfile.location} • Disponibilité : <span className="text-emerald-400">{myProfile.availability}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={myProfile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Voir le CV
                  </a>

                  <button
                    onClick={() => onOpenVisioWithUser(myProfile.email, myProfile.fullName)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" /> Lancer Entretien Visio
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            
            {/* Bio & Experiences (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-2">
                <h3 className="font-black text-sm text-slate-900">À propos / Présentation</h3>
                <p className="text-slate-700 leading-relaxed font-medium">{myProfile.bio}</p>
              </div>

              {/* Experiences */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-4">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Expériences Professionnelles
                </h3>
                <div className="space-y-3">
                  {myProfile.experiences.map((exp) => (
                    <div key={exp.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-1">
                      <div className="flex items-center justify-between font-extrabold text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-[10px] text-indigo-600">{exp.period}</span>
                      </div>
                      <p className="text-slate-600 font-medium">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Skills & Certifications (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-3">
                <h3 className="font-black text-sm text-slate-900">Compétences Clés</h3>
                <div className="flex flex-wrap gap-1.5">
                  {myProfile.skills.map((sk, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Certifications
                </h3>
                <ul className="space-y-1 text-slate-700 font-bold">
                  {myProfile.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {cert}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PUBLISH POST MODAL */}
      {isPublishingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Créer une Publication / Annonce</h3>
              <button onClick={() => setIsPublishingModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Type de publication :</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as PostCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="text">Publication Texte / Réseau</option>
                  <option value="job_request">Demande d'Emploi</option>
                  <option value="cv">Partager un CV / Portfolio</option>
                  <option value="service">Proposer un Service Professionnel</option>
                  <option value="job_offer">Offre d'Emploi (Entreprise)</option>
                  <option value="announcement">Annonce Professionnelle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Contenu de la publication :</label>
                <textarea
                  rows={5}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Décrivez votre projet, demande d'emploi ou annonce..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">URL de l'image / visuel (Optionnel) :</label>
                <input
                  type="url"
                  value={postMediaUrl}
                  onChange={(e) => setPostMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lien du Document / CV (Optionnel) :</label>
                <input
                  type="url"
                  value={postDocumentUrl}
                  onChange={(e) => setPostDocumentUrl(e.target.value)}
                  placeholder="https://nichelead.io/docs/mon_cv.pdf"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishingModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" /> Publier Immédiatement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOST POST MODAL */}
      {boostingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" /> Booster la Visibilité
              </h3>
              <button onClick={() => setBoostingPost(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmBoost} className="space-y-4 text-xs">
              
              {/* Option Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedBoostType('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBoostType === 'standard' ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/20' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-slate-900 mb-1">
                    <span>BOOST STANDARD</span>
                    <span className="text-indigo-600 font-extrabold">5 USD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Badging Sponsorisé & visibilité accrue sur le feed.</p>
                </div>

                <div
                  onClick={() => setSelectedBoostType('double')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBoostType === 'double' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-amber-900 mb-1">
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> DOUBLE BOOST</span>
                    <span className="text-amber-600 font-black">20 USD</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Priorité maximale, badge Top Opportunité & statistiques détaillées.</p>
                </div>
              </div>

              {/* Target Filters */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-800 block">Ciblage du public :</span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Pays cible :</label>
                    <select
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold"
                    >
                      <option value="Tous les pays">Tous les pays (Mondial)</option>
                      <option value="France">France</option>
                      <option value="Canada">Canada</option>
                      <option value="États-Unis">États-Unis</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Sénégal">Sénégal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Secteur cible :</label>
                    <select
                      value={targetSector}
                      onChange={(e) => setTargetSector(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold"
                    >
                      <option value="Tous les secteurs">Tous les secteurs</option>
                      <option value="Intelligence Artificielle & Software">IA & Software</option>
                      <option value="Finance & Comptabilité">Finance & Comptabilité</option>
                      <option value="Marketing Digital & Sales">Marketing Digital</option>
                    </select>
                  </div>
                </div>
              </div>

              {boostSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {boostSuccessMsg}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBoostingPost(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Flame className="w-4 h-4 fill-current" /> Confirmer le Boost (${selectedBoostType === 'double' ? '20' : '5'} USD)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
