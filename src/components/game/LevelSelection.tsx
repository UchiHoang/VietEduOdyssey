import { memo } from "react";
import { Lock, CheckCircle, Star } from "lucide-react";
import { GameProgress } from "@/hooks/useGameEngine";
import { StoryNode } from "@/types/game";
import { getLevelIcon } from "@/utils/levelIcons";
import { useLanguage } from "@/contexts/LanguageContext";

interface LevelSelectionProps {
  title: string;
  description: string;
  nodes: StoryNode[];
  progress: GameProgress;
  onSelectLevel: (nodeIndex: number) => void;
}

const LevelSelectionComponent = ({
  title,
  description,
  nodes,
  progress,
  onSelectLevel,
}: LevelSelectionProps) => {
  const { t } = useLanguage();

  // Chuẩn hóa completed nodes và ngưỡng mở khóa để tránh khóa lùi khi chơi lại màn cũ
  const completedNodeIndices: number[] = progress.completedNodes
    .map((n: unknown) => {
      if (typeof n === "number") return n;
      if (typeof n === "string") {
        if (!isNaN(Number(n))) return Number(n);
        const foundIndex = nodes.findIndex((nd) => nd.id === n);
        return foundIndex >= 0 ? foundIndex : -1;
      }
      return -1;
    })
    .filter((n: number) => n >= 0);

  const maxCompletedIndex = completedNodeIndices.length
    ? Math.max(...completedNodeIndices)
    : -1;
  const unlockUntil = Math.max(progress.currentNodeIndex, maxCompletedIndex + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>

          {/* Progress Summary */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="bg-card px-6 py-3 rounded-full border border-primary/20">
              <span className="text-sm text-muted-foreground">{t.game.completed}: </span>
              <span className="text-lg font-bold text-primary">
                {progress.completedNodes.length}/{nodes.length}
              </span>
            </div>

            <div className="bg-card px-6 py-3 rounded-full border border-primary/20">
              <Star className="w-4 h-4 text-primary inline mr-2" />
              <span className="text-lg font-bold text-primary">
                {progress.totalXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node, index) => {
            const isCompleted = completedNodeIndices.includes(index);
            // Màn được unlock nếu index <= ngưỡng mở khóa cao nhất (max completed + 1) hoặc currentNodeIndex
            const isUnlocked = index === 0 || index <= unlockUntil;
            const isCurrent = progress.currentNodeIndex === index;

            return (
              <button
                key={node.id}
                onClick={() => isUnlocked && onSelectLevel(index)}
                disabled={!isUnlocked}
                className={`
                  relative bg-card rounded-xl p-6 border-2 transition-all duration-300
                  ${
                    isUnlocked
                      ? "hover:scale-105 hover:shadow-xl cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }
                  ${isCurrent ? "border-primary ring-4 ring-primary/20" : "border-primary/20"}
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                      : ""
                  }
                `}
                aria-label={`${node.order}: ${node.title}`}
              >
                {/* Level Number Badge */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {node.order}
                </div>

                {/* Status Icon */}
                <div className="absolute -top-3 -right-3">
                  {isCompleted ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  ) : null}
                </div>

                {/* Level Icon */}
                <div className="mb-4 flex justify-center">
                  <img
                    src={getLevelIcon(title, index)}
                    alt={node.title}
                    className={`w-20 h-20 object-contain ${
                      !isUnlocked ? "opacity-50 grayscale" : ""
                    }`}
                  />
                </div>

                {/* Level Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    {node.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {node.objective}
                  </p>

                  {/* Math Topic Badge */}
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {node.mathTopic}
                    </span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="mt-4">
                  {isUnlocked ? (
                    <div className="text-sm font-semibold text-primary">
                      {isCompleted ? t.game.playAgain : t.game.start} →
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {t.game.completePrevLevel}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💡 {t.game.levelHint}
          </p>
        </div>
      </div>
    </div>
  );
};

export const LevelSelection = memo(LevelSelectionComponent);
