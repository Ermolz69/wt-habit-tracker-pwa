import { Card } from '@/shared/ui';

interface AchievementCardProps {
  description: string;
  icon: string;
  name: string;
}

export const AchievementCard = ({ description, icon, name }: AchievementCardProps) => {
  return (
    <Card className="p-4 bg-white border-gray-100 text-center group">
      <svg className="w-14 h-14 text-warning mb-3 mx-auto drop-shadow-md group-hover:scale-110 transition-transform duration-300">
        <use href={`/sprite.svg#${icon}`} />
      </svg>
      <div className="text-sm font-bold text-dark leading-tight mb-1">{name}</div>
      <div className="text-[10px] text-gray-500">{description}</div>
    </Card>
  );
};
