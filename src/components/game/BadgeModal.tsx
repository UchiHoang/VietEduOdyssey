import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { StarRating } from "./StarRating";
import { useLanguage } from "@/contexts/LanguageContext";

const playFailureSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [400, 300, 200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.3);
    });
    setTimeout(() => ctx.close(), 2000);
  } catch (e) {}
};

interface BadgeModalProps {
  isOpen: boolean;
  badgeId: string | null;
  badgeInfo?: any;
  earnedXp: number;
  stars?: number;
  performance: "excellent" | "good" | "retry";
  onBackToMap: () => void;
  onNextLevel?: () => void;
  onRetry?: () => void;
}

export const BadgeModal = ({ 
  isOpen, badgeId, badgeInfo, earnedXp, stars = 0, performance,
  onBackToMap, onNextLevel, onRetry
}: BadgeModalProps) => {
  const { t } = useLanguage();
  const badge = badgeId && badgeInfo ? badgeInfo(badgeId) : null;
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isOpen && performance === "retry" && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      setTimeout(() => playFailureSound(), 500);
    }
    if (!isOpen) {
      hasPlayedSound.current = false;
    }
  }, [isOpen, performance]);

  const performanceConfig = {
    excellent: {
      title: `🎉 ${t.game.excellent}`,
      message: t.game.excellentMsg,
      color: "text-green-600"
    },
    good: {
      title: `👍 ${t.game.good}`,
      message: t.game.goodMsg,
      color: "text-blue-600"
    },
    retry: {
      title: `💪 ${t.game.tryHarder}`,
      message: t.game.tryHarderMsg,
      color: "text-orange-600"
    }
  };

  const config = performanceConfig[performance];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-center text-2xl ${config.color}`}>
            {config.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isOpen && (
            <div className="py-2">
              <StarRating stars={stars} size="lg" showConfetti={stars === 3} enableSound={true} delay={400} />
            </div>
          )}

          {badge && performance !== "retry" && (
            <div className="flex flex-col items-center gap-4 animate-scale-in">
              <div className="relative">
                <img src={badge.icon} alt={badge.name} className="w-32 h-32 object-contain" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-heading font-bold text-primary mb-1">{badge.name}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-base text-foreground">{config.message}</p>
            <div className="flex items-center justify-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-primary">+{earnedXp} XP</span>
            </div>
          </div>

          <div className="flex gap-3">
            {performance === "retry" && onRetry && (
              <Button onClick={onRetry} variant="outline" className="flex-1">
                {t.game.retry}
              </Button>
            )}
            {performance !== "retry" && onNextLevel && (
              <Button onClick={onNextLevel} variant="outline" className="flex-1">
                {t.game.nextLevel}
              </Button>
            )}
            <Button onClick={onBackToMap} className="flex-1">
              {performance === "retry" ? t.game.backToMap : t.game.backToLevelList}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
