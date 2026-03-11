import { useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle, Sparkles, Trophy, Star, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import YouTube, { YouTubeEvent } from "react-youtube";
import { useLanguage } from "@/contexts/LanguageContext";

const SOUND_URLS = {
  complete: "https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3",
  xp: "https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3",
};

const playSound = (url: string, volume = 0.5) => {
  try {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
};

/** Extract YouTube video ID from various URL formats */
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  topicId: string;
  isCompleted?: boolean;
  onComplete?: () => Promise<void>;
}

export const VideoPlayer = ({ videoUrl, title, topicId, isCompleted = false, onComplete }: VideoPlayerProps) => {
  const { t } = useLanguage();
  const [hasMarkedComplete, setHasMarkedComplete] = useState(isCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [watchPercent, setWatchPercent] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const maxWatchedTime = useRef(0);
  const duration = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(isCompleted);

  useEffect(() => {
    setHasMarkedComplete(isCompleted);
    completedRef.current = isCompleted;
  }, [isCompleted]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const videoId = extractVideoId(videoUrl);

  const handleMarkComplete = useCallback(async () => {
    if (completedRef.current || isLoading) return;

    setIsLoading(true);
    completedRef.current = true;

    const triggerCelebration = () => {
      setHasMarkedComplete(true);
      setJustCompleted(true);
      setShowConfetti(true);
      setShowOverlay(true);
      playSound(SOUND_URLS.complete, 0.5);
      setTimeout(() => playSound(SOUND_URLS.xp, 0.4), 400);
      setTimeout(() => setShowConfetti(false), 5000);
      setTimeout(() => setShowOverlay(false), 6000);
      setTimeout(() => setJustCompleted(false), 6000);
    };

    if (onComplete) {
      try {
        await onComplete();
        triggerCelebration();
      } catch (error) {
        console.error("Error completing topic:", error);
        completedRef.current = false;
        toast.error(t.videoPlayer.saveError);
      }
    } else {
      triggerCelebration();
    }

    setIsLoading(false);
  }, [onComplete, isLoading, t]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const currentTime = player.getCurrentTime();

      // Anti-seek: if user jumped ahead beyond watched + 2s, snap back
      if (currentTime > maxWatchedTime.current + 2) {
        player.seekTo(maxWatchedTime.current, true);
      } else {
        maxWatchedTime.current = Math.max(maxWatchedTime.current, currentTime);
      }

      // Update progress percentage
      if (duration.current > 0) {
        const pct = Math.min(100, Math.round((maxWatchedTime.current / duration.current) * 100));
        setWatchPercent(pct);

        // Auto-complete at 75%
        if (pct >= 75 && !completedRef.current) {
          handleMarkComplete();
        }
      }
    }, 1000);
  }, [handleMarkComplete]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onReady = useCallback((e: YouTubeEvent) => {
    playerRef.current = e.target;
    duration.current = e.target.getDuration();
  }, []);

  const onStateChange = useCallback((e: YouTubeEvent) => {
    // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0, BUFFERING=3
    if (e.data === 1) {
      // Playing
      if (!duration.current && playerRef.current) {
        duration.current = playerRef.current.getDuration();
      }
      startPolling();
    } else {
      stopPolling();
    }
  }, [startPolling, stopPolling]);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0 as const,
      rel: 0 as const,
      modestbranding: 1 as const,
    },
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          colors={["#FFD700", "#FFA500", "#FFE066", "#FFCC00", "#FF6B6B", "#4ECDC4", "#A78BFA"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      {/* ===== COMPACT CELEBRATION OVERLAY ===== */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Semi-transparent backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowOverlay(false)}
            />

            {/* Compact card */}
            <motion.div
              className="relative bg-card rounded-2xl shadow-2xl border border-border p-6 w-[320px] max-w-[90vw] flex flex-col items-center gap-3"
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowOverlay(false)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Trophy icon */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: "20%", left: "45%" }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3 + i, ease: "linear", delay: i * 0.3 }}
                  >
                    <motion.div style={{ transform: `translateX(${30 + i * 8}px) translateY(-50%)` }}>
                      <Star className="h-3 w-3 text-primary fill-primary" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-xl font-bold text-foreground text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎉 {t.videoPlayer.excellent}
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.videoPlayer.lessonCompleted}
              </motion.p>

              {/* XP Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.4 }}
              >
                <div className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="text-xl font-black text-primary-foreground">+20 XP</span>
                </div>
              </motion.div>

              {/* Auto-dismiss progress */}
              <motion.div className="w-full mt-1">
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear", delay: 0.5 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Video Player */}
        <div className="w-full bg-gradient-to-br from-background via-background to-muted rounded-2xl overflow-hidden shadow-2xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
          <div className="aspect-video w-full relative">
            {videoId ? (
              <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
            ) : (
              <iframe
                src={videoUrl}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Progress / Status bar */}
        <div className="relative flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {hasMarkedComplete ? (
                <motion.div
                  key="completed"
                  initial={justCompleted ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.videoPlayer.completed}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      {t.videoPlayer.earnedXP}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="incomplete" className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-bold text-muted-foreground">{watchPercent}%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {t.videoPlayer.watchProgress.replace("{percent}", String(watchPercent))}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.videoPlayer.autoCompleteHint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar (visible when not completed) */}
          {!hasMarkedComplete && (
            <div className="w-24 md:w-32 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${watchPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
