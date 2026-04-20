import { Card } from '@/shared/ui';

interface AchievementCardProps {
  description: string;
  icon: string;
  name: string;
}

export const AchievementCard = ({ description, icon, name }: AchievementCardProps) => {
  return (
    <Card className="group border-white/80 bg-white/82 p-5 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-accent/15 to-primary/15">
        <svg className="h-10 w-10 text-warning drop-shadow-md transition-transform duration-300 group-hover:scale-110">
          <use href={`/sprite.svg#${icon}`} />
        </svg>
      </div>
      <div className="font-display text-lg text-dark">{name}</div>
      <div className="mt-2 text-xs leading-5 text-muted">{description}</div>
    </Card>
  );
};
