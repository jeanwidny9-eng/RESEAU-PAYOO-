import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Check,
  Music,
  Sparkles,
  Send,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Radio,
  BadgeCheck,
  Zap,
  Gift,
  Copy,
  ExternalLink,
  Flame,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PayooVideo, PayooUser, VideoComment } from '../types';

interface PayooVideoFeedProps {
  videos: PayooVideo[];
  currentUser: PayooUser;
  onSendTip: (videoId: string, amountHTG: number) => void;
  onNavigate: (view: string) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const PayooVideoFeed: React.FC<PayooVideoFeedProps> = ({
  videos: initialVideos,
  currentUser,
  onSendTip,
  onNavigate
}) => {
  const [videos, setVideos] = useState<PayooVideo[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'live'>('foryou');
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showExpandedCaption, setShowExpandedCaption] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [activeDrawer, setActiveDrawer] = useState<'comments' | 'gifts' | 'share' | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedGift, setSelectedGift] = useState<number>(100);
  const [videoProgress, setVideoProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [flyingGiftAnimation, setFlyingGiftAnimation] = useState<{ icon: string; name: string; amount: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTapRef = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const currentVideo = videos[currentIndex] || videos[0];

  // Sync state if initialVideos changes
  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  // Video playback management when switching videos
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay fallback with mute
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
    setShowExpandedCaption(false);
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 800);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 800);
    }
  };

  // Double tap to like with floating heart burst
  const handleVideoAreaClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Detected!
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const heartId = Date.now() + Math.random();
      const newHeart: FloatingHeart = {
        id: heartId,
        x,
        y,
        scale: 1 + Math.random() * 0.4,
        rotation: (Math.random() - 0.5) * 40
      };

      setFloatingHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1000);

      if (!currentVideo.isLiked) {
        toggleLike(currentVideo.id);
      }
    } else {
      // Single tap -> toggle play/pause
      handleTogglePlay(e);
    }
    lastTapRef.current = now;
  };

  const toggleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1)
          };
        }
        return v;
      })
    );
  };

  const toggleBookmark = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const isSaved = !v.isSaved;
          showToast(isSaved ? 'Videyo anrejistre nan favori w! 📌' : 'Retire nan favori');
          return { ...v, isSaved };
        }
        return v;
      })
    );
  };

  const toggleFollow = (authorUsername: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.authorUsername === authorUsername) {
          const isFollowing = !v.isFollowing;
          showToast(isFollowing ? `Ou kòmanse swiv @${authorUsername} !` : `Ou pa swiv @${authorUsername} ankò`);
          return { ...v, isFollowing };
        }
        return v;
      })
    );
  };

  const goToNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      showToast('Ou rive nan dènye videyo a!');
    }
  };

  const goToPrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDrawer) return; // don't navigate when typing comment
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevVideo();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        }
      } else if (e.key === 'm') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying, isMuted, activeDrawer, videos.length]);

  // Touch Swipe Handlers for mobile TikTok feel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      // Swiped UP -> Next video
      goToNextVideo();
    } else if (diff < -SWIPE_THRESHOLD) {
      // Swiped DOWN -> Previous video
      goToPrevVideo();
    }
  };

  // Add a new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: VideoComment = {
      id: `comm_${Date.now()}`,
      user: currentUser.name || 'Mwen',
      avatar: currentUser.avatar,
      text: newCommentText.trim(),
      time: 'Kounye a',
      likes: 0,
      isLiked: false
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          const list = v.commentsList || [];
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
            commentsList: [newComment, ...list]
          };
        }
        return v;
      })
    );

    setNewCommentText('');
    showToast('Kòmantè w la pibliye! 💬');
  };

  // Like a comment
  const handleLikeComment = (commentId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id && v.commentsList) {
          return {
            ...v,
            commentsList: v.commentsList.map((c) => {
              if (c.id === commentId) {
                const isLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked,
                  likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
                };
              }
              return c;
            })
          };
        }
        return v;
      })
    );
  };

  // Send TikTok Live / Video Gift
  const handleSendGift = (giftObj: { name: string; amount: number; icon: string }) => {
    onSendTip(currentVideo.id, giftObj.amount);

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === currentVideo.id) {
          return {
            ...v,
            earningsHTG: v.earningsHTG + giftObj.amount
          };
        }
        return v;
      })
    );

    // Trigger on-screen gift explosion animation
    setFlyingGiftAnimation(giftObj);
    setTimeout(() => setFlyingGiftAnimation(null), 3000);

    setActiveDrawer(null);
    showToast(`🎉 Ou voye ${giftObj.name} (${giftObj.amount} HTG) bay @${currentVideo.authorUsername} sou MonCash!`);
  };

  const giftOptions = [
    { id: 1, name: 'Goud Ayisyen 🪙', amount: 50, icon: '🪙', desc: '50 HTG MonCash' },
    { id: 2, name: 'Drapwo Ayiti 🇭🇹', amount: 100, icon: '🇭🇹', desc: '100 HTG NatCash' },
    { id: 3, name: 'Prestige Glase 🍺', amount: 250, icon: '🍺', desc: '250 HTG Kado' },
    { id: 4, name: 'Soup Joumou 🍲', amount: 500, icon: '🍲', desc: '500 HTG Sipò' },
    { id: 5, name: 'Kouròn Wa 👑', amount: 1000, icon: '👑', desc: '1,000 HTG VIP' },
    { id: 6, name: 'Lion Kreyòl 🦁', amount: 2500, icon: '🦁', desc: '2,500 HTG Patron' },
    { id: 7, name: 'MonCash Express ⚡', amount: 5000, icon: '⚡', desc: '5,000 HTG Super' },
    { id: 8, name: 'Diamant Ayiti 💎', amount: 10000, icon: '💎', desc: '10,000 HTG Diamant' }
  ];

  const filteredVideos = activeTab === 'following'
    ? videos.filter((v) => v.isFollowing)
    : videos;

  const displayVideo = filteredVideos[currentIndex] || currentVideo;

  return (
    <div
      className="relative w-full h-[calc(100vh-64px)] max-h-[920px] max-w-md mx-auto bg-black overflow-hidden select-none touch-none rounded-none sm:rounded-3xl border-0 sm:border sm:border-zinc-800 shadow-2xl flex flex-col justify-between"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 text-amber-300 border border-amber-500/50 px-4 py-2 rounded-full text-xs font-black shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Gift On-Screen Animation */}
      <AnimatePresence>
        {flyingGiftAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 100 }}
            animate={{ opacity: 1, scale: [0.3, 1.4, 1], y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -100 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="text-7xl animate-bounce mb-2 filter drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">
              {flyingGiftAnimation.icon}
            </div>
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-black px-6 py-2 rounded-full font-black text-sm shadow-2xl tracking-wider">
              {flyingGiftAnimation.name} (+{flyingGiftAnimation.amount} HTG)
            </div>
            <div className="text-white text-xs font-bold mt-2 bg-black/60 px-3 py-1 rounded-full border border-white/20">
              Kado voye bay @{displayVideo.authorUsername}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Double-Tap Hearts */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 1, scale: 0.4, rotate: heart.rotation }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0.4, heart.scale * 1.5, heart.scale * 2],
            y: -120,
            rotate: heart.rotation + 15
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute z-40 pointer-events-none"
          style={{ left: heart.x - 30, top: heart.y - 30 }}
        >
          <Heart className="w-16 h-16 fill-rose-500 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]" />
        </motion.div>
      ))}

      {/* Top Header Bar: Following / For You / Live tabs */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-3 px-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Live Broadcast Button */}
        <button
          onClick={() => onNavigate('live')}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 flex items-center gap-1 group"
        >
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="text-[11px] font-black text-rose-400 hidden sm:inline">LIVE</span>
        </button>

        {/* TikTok Center Switcher Tabs: Swiv | Pou Ou */}
        <div className="flex items-center gap-4 text-sm font-black tracking-tight">
          <button
            onClick={() => {
              setActiveTab('following');
              setCurrentIndex(0);
            }}
            className={`relative py-1 transition-all ${
              activeTab === 'following' ? 'text-white scale-105' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Swiv</span>
            {activeTab === 'following' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full shadow-[0_0_8px_white]"
              />
            )}
          </button>

          <span className="text-zinc-600 font-normal">|</span>

          <button
            onClick={() => {
              setActiveTab('foryou');
              setCurrentIndex(0);
            }}
            className={`relative py-1 transition-all ${
              activeTab === 'foryou' ? 'text-white scale-105' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-1">
              Pou Ou
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </span>
            {activeTab === 'foryou' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              />
            )}
          </button>
        </div>

        {/* Top Right Controls: Mute/Unmute & Search */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-colors"
            title={isMuted ? 'Mete son an (M)' : 'Koupe son an (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Video Screen Container (Click to Play/Pause, Double Tap to Like) */}
      <div
        onClick={handleVideoAreaClick}
        className="relative w-full h-full flex-1 bg-zinc-950 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <video
          ref={videoRef}
          src={displayVideo.videoUrl}
          poster={displayVideo.thumbnailUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Video Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

        {/* Play/Pause Central Icon Feedback */}
        <AnimatePresence>
          {showPlayIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-none z-30"
            >
              {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Up/Down Desktop Quick Navigation Buttons */}
        <div className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevVideo();
            }}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-zinc-900/70 hover:bg-zinc-800 text-white disabled:opacity-30 border border-white/10 backdrop-blur-md"
            title="Videyo Prese (Up)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextVideo();
            }}
            disabled={currentIndex === filteredVideos.length - 1}
            className="p-2 rounded-full bg-zinc-900/70 hover:bg-zinc-800 text-white disabled:opacity-30 border border-white/10 backdrop-blur-md"
            title="Videyo Swivan (Down)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* TikTok Style Vertical Action Sidebar (Right Side) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 bottom-16 z-30 flex flex-col items-center gap-3.5 pb-2"
        >
          {/* Creator Avatar with Follow (+) Button */}
          <div className="relative group">
            <button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-amber-500 to-rose-500"
            >
              <img
                src={displayVideo.authorAvatar}
                alt={displayVideo.authorName}
                className="w-full h-full rounded-full object-cover"
              />
            </button>
            <button
              onClick={() => toggleFollow(displayVideo.authorUsername)}
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-110 ${
                displayVideo.isFollowing ? 'bg-zinc-700' : 'bg-rose-500 animate-pulse'
              }`}
            >
              {displayVideo.isFollowing ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-white" />}
            </button>
          </div>

          {/* Like Button (Heart) */}
          <button
            onClick={() => toggleLike(displayVideo.id)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md transition-transform duration-200 group-hover:scale-110 ${
                displayVideo.isLiked
                  ? 'bg-rose-500/30 text-rose-500'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  displayVideo.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {displayVideo.likesCount > 999
                ? `${(displayVideo.likesCount / 1000).toFixed(1)}k`
                : displayVideo.likesCount}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => setActiveDrawer('comments')}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
              <MessageCircle className="w-7 h-7 fill-white/10 text-white" />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {displayVideo.commentsCount > 999
                ? `${(displayVideo.commentsCount / 1000).toFixed(1)}k`
                : displayVideo.commentsCount}
            </span>
          </button>

          {/* MonCash/NatCash Live Gifts Button */}
          <button
            onClick={() => setActiveDrawer('gifts')}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 text-black backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-transform duration-200 group-hover:scale-110 animate-bounce">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Kado
            </span>
          </button>

          {/* Bookmark / Favorite Button */}
          <button
            onClick={() => toggleBookmark(displayVideo.id)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md transition-transform duration-200 group-hover:scale-110 ${
                displayVideo.isSaved
                  ? 'bg-amber-500/30 text-amber-400'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 ${displayVideo.isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
              />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Favori
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setActiveDrawer('share')}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {displayVideo.sharesCount > 999
                ? `${(displayVideo.sharesCount / 1000).toFixed(1)}k`
                : displayVideo.sharesCount}
            </span>
          </button>

          {/* Rotating Vinyl Record / Audio Disc */}
          <div className="relative pt-1">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-black p-1 shadow-2xl border border-zinc-700 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400">
                <img
                  src={displayVideo.authorAvatar}
                  alt="Track"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            {/* Floating musical note notes */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: [0, 1, 0], y: -25, x: -15, scale: [0.6, 1.1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                className="absolute -top-1 right-2 text-amber-300 pointer-events-none"
              >
                <Music className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Left Creator Details, Caption & Audio Marquee */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 right-16 z-20 space-y-2 text-white pointer-events-auto"
        >
          {/* Creator Name & Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('profile')}
              className="font-black text-sm text-white hover:underline flex items-center gap-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
            >
              <span>@{displayVideo.authorUsername}</span>
              {displayVideo.authorVerified && (
                <BadgeCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              )}
            </button>

            {!displayVideo.isFollowing && (
              <button
                onClick={() => toggleFollow(displayVideo.authorUsername)}
                className="px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white font-black text-[10px] uppercase tracking-wider hover:bg-rose-600 transition-colors"
              >
                Swiv +
              </button>
            )}
          </div>

          {/* Video Description & Expandable Tagline */}
          <div className="text-xs text-zinc-100 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <p className={showExpandedCaption ? '' : 'line-clamp-2'}>
              {displayVideo.description}
            </p>
            {displayVideo.description.length > 80 && (
              <button
                onClick={() => setShowExpandedCaption(!showExpandedCaption)}
                className="text-[11px] font-black text-amber-300 hover:underline pt-0.5 block"
              >
                {showExpandedCaption ? 'Mwens ▴' : 'Wè plis ▾'}
              </button>
            )}
          </div>

          {/* Monetization Earnings Live Badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-black text-emerald-300 backdrop-blur-md">
            <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Monètize: {displayVideo.earningsHTG.toLocaleString()} HTG</span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-[9px] text-zinc-300 font-normal">0.50 HTG / 15 vues</span>
          </div>

          {/* Audio Marquee Ticker (TikTok Signature) */}
          <div className="flex items-center gap-2 pt-0.5 text-xs text-zinc-300">
            <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="overflow-hidden whitespace-nowrap w-48 text-[11px] font-semibold text-zinc-200">
              <div className="inline-block animate-marquee">
                {displayVideo.audioTrack || `Son Orijinal - ${displayVideo.authorName}`} 🇭🇹 • PAYOO Mizik Rasin •
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber / Progress Bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-amber-400 transition-all duration-100 shadow-[0_0_8px_rgba(245,158,11,1)]"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      </div>

      {/* ---------------- DRAWERS & MODALS ---------------- */}

      {/* 1. Comments Drawer (TikTok Bottom Sheet) */}
      <AnimatePresence>
        {activeDrawer === 'comments' && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-md bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-4 max-h-[75vh] h-[550px] flex flex-col text-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-black text-zinc-400 uppercase">
                  {displayVideo.commentsCount} Kòmantè
                </span>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 divide-y divide-zinc-800/40">
                {(displayVideo.commentsList || []).length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs">
                    Pa gen kòmantè ankò. Se premye moun ki kite yon kòmantè! ✍️
                  </div>
                ) : (
                  (displayVideo.commentsList || []).map((comm) => (
                    <div key={comm.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <img
                          src={comm.avatar}
                          alt={comm.user}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-zinc-300">{comm.user}</span>
                            <span className="text-[10px] text-zinc-500">{comm.time}</span>
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                            {comm.text}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLikeComment(comm.id)}
                        className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-rose-500 shrink-0 pt-1"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            comm.isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                          }`}
                        />
                        <span className="text-[9px] font-bold">{comm.likes}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input Bar */}
              <form onSubmit={handleAddComment} className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400"
                />
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Kite yon bèl kòmantè kreyòl..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. TikTok Gifts Drawer (MonCash & NatCash Live Gifts) */}
      <AnimatePresence>
        {activeDrawer === 'gifts' && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-md bg-zinc-900 border-t border-amber-500/40 rounded-t-3xl p-5 text-white shadow-2xl space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Kado & Tips MonCash / NatCash 🇭🇹
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Sipòte @{displayVideo.authorUsername} dirèkteman!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Haitian TikTok Gifts */}
              <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
                {giftOptions.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSendGift(g)}
                    className="p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:scale-105 transition-all flex flex-col items-center justify-center gap-1 group text-center"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {g.icon}
                    </span>
                    <span className="text-[10px] font-black text-white leading-tight">
                      {g.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-black text-amber-400">
                      {g.amount} HTG
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer info */}
              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-bold">Balans Tokens ou:</span>
                <span className="text-amber-400 font-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentUser.payooTokens} Tokens ({currentUser.earningsHTG.toLocaleString()} HTG)
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Share Drawer */}
      <AnimatePresence>
        {activeDrawer === 'share' && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-md bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-5 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-sm font-black text-white">Pataje videyo sa a 🚀</h3>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 py-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Lyen kopye nan clipboard! 📋');
                    setActiveDrawer(null);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white group-hover:bg-zinc-700">
                    <Copy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300">Kopi Lyen</span>
                </button>

                <button
                  onClick={() => {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Gade bèl videyo sa a sou PAYOO Rézo d'Haïti: ${displayVideo.title}`)}`);
                    setActiveDrawer(null);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white group-hover:bg-emerald-500">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Pataj Facebook ouvè!');
                    setActiveDrawer(null);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-blue-500">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300">Facebook</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Videyo reposte sou paj ou!');
                    setActiveDrawer(null);
                  }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-black font-black flex items-center justify-center group-hover:bg-amber-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300">Reposte</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
