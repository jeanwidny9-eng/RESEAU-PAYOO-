import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, Award, BadgeCheck, Zap, Sparkles, Send, DollarSign, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PayooVideo, PayooUser } from '../types';

interface PayooVideoFeedProps {
  videos: PayooVideo[];
  currentUser: PayooUser;
  onSendTip: (videoId: string, amountHTG: number) => void;
  onNavigate: (view: string) => void;
}

export const PayooVideoFeed: React.FC<PayooVideoFeedProps> = ({
  videos,
  currentUser,
  onSendTip,
  onNavigate
}) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [muted, setMuted] = useState(true);
  const [tipModalVideo, setTipModalVideo] = useState<PayooVideo | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(500);

  const currentVideo = videos[activeVideoIndex] || videos[0];

  const handleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentVideo.likesCount) + (isLiked ? -1 : 1)
    }));
  };

  const handleConfirmTip = () => {
    if (!tipModalVideo) return;
    onSendTip(tipModalVideo.id, tipAmount);
    alert(`🎉 Bravo! Ou voye yon kado ${tipAmount} HTG bay ${tipModalVideo.authorName} via MonCash/NatCash!`);
    setTipModalVideo(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-2 px-2 pb-24 text-white">
      {/* Feed Top Switcher */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-400/30">
            Fid Prensipal 🇭🇹
          </span>
          <span className="text-[10px] text-zinc-400 font-bold">
            0.50 HTG chak 15 vues
          </span>
        </div>

        <button
          onClick={() => onNavigate('creator')}
          className="text-xs font-black text-emerald-400 flex items-center gap-1 hover:underline"
        >
          <Zap className="w-3.5 h-3.5" />
          Kòmanse Monètize
        </button>
      </div>

      {/* Main Video Card Container */}
      {currentVideo && (
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl min-h-[600px] flex flex-col justify-between">
          {/* Video Background / Simulation */}
          <div className="absolute inset-0 z-0 bg-black">
            <video
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnailUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Top Info Bar */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black text-white flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                {currentVideo.viewsCount.toLocaleString()} vues
              </span>
            </div>

            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Floating Interactive Sidebar */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
            {/* Author Avatar with Follow Plus */}
            <div className="relative">
              <img
                src={currentVideo.authorAvatar}
                alt={currentVideo.authorName}
                className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-lg"
              />
              {currentVideo.authorVerified && (
                <BadgeCheck className="w-4 h-4 text-amber-400 absolute -bottom-1 -right-1 bg-black rounded-full" />
              )}
            </div>

            {/* Like Button */}
            <button
              onClick={() => handleLike(currentVideo.id)}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
                likedMap[currentVideo.id] ? 'bg-rose-500 text-white scale-110' : 'bg-black/60 text-white hover:bg-black/80'
              }`}>
                <Heart className={`w-6 h-6 ${likedMap[currentVideo.id] ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[10px] font-black shadow-sm">
                {(likeCountMap[currentVideo.id] ?? currentVideo.likesCount).toLocaleString()}
              </span>
            </button>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1 text-white">
              <div className="p-3 rounded-full bg-black/60 backdrop-blur-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black">{currentVideo.commentsCount}</span>
            </div>

            {/* Send Tip Gift via MonCash/NatCash */}
            <button
              onClick={() => setTipModalVideo(currentVideo)}
              className="flex flex-col items-center gap-1 text-amber-300 group"
            >
              <div className="p-3 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-black font-black shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Kado</span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center gap-1 text-white">
              <div className="p-3 rounded-full bg-black/60 backdrop-blur-md">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black">{currentVideo.sharesCount}</span>
            </button>
          </div>

          {/* Bottom Details Overlay */}
          <div className="relative z-10 p-5 space-y-2 max-w-[80%]">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">{currentVideo.authorName}</span>
              <span className="text-xs text-amber-400 font-bold">@{currentVideo.authorUsername}</span>
            </div>

            <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed font-medium">
              {currentVideo.title}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentVideo.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* View Earnings Indicator */}
            <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-black">
              <Zap className="w-3.5 h-3.5" />
              <span>Gains estimés pour ce vidéo : {currentVideo.earningsHTG} HTG</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls between videos */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <button
          disabled={activeVideoIndex === 0}
          onClick={() => setActiveVideoIndex((prev) => Math.max(0, prev - 1))}
          className="flex-1 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-black disabled:opacity-40 hover:bg-zinc-800"
        >
          ← Videyo Prese
        </button>
        <span className="text-xs font-bold text-zinc-400">
          {activeVideoIndex + 1} / {videos.length}
        </span>
        <button
          disabled={activeVideoIndex === videos.length - 1}
          onClick={() => setActiveVideoIndex((prev) => Math.min(videos.length - 1, prev + 1))}
          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs disabled:opacity-40 hover:scale-[1.01]"
        >
          Videyo Swivan →
        </button>
      </div>

      {/* Send Tip Gift Modal */}
      <AnimatePresence>
        {tipModalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-white relative"
            >
              <button
                onClick={() => setTipModalVideo(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-white">
                  Voye yon Kado bay {tipModalVideo.authorName} 🇭🇹
                </h3>
                <p className="text-xs text-zinc-400">
                  Sipòte kreyatè sa dirèkteman sou MonCash ak NatCash!
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-300 block uppercase">Chwazi Montan (HTG)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all ${
                        tipAmount === amt
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {amt} HTG
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmTip}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Voye {tipAmount} HTG kounye a</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
