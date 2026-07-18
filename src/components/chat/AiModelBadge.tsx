import { AI_MODELS } from '@/lib/mockData';

interface AiModelBadgeProps {
  modelId: string;
  size: string;
  showName?: boolean;
}

export default function AiModelBadge({ modelId, size = 'sm', showName = true }: AiModelBadgeProps) {
  const model = AI_MODELS[modelId];
  if (!model) return null;

  const sizeClasses: Record<string, string> = {
    xs: 'h-4 w-4 text-[8px]',
    sm: 'h-5 w-5 text-[10px]',
    md: 'h-7 w-7 text-sm',
    lg: 'h-9 w-9 text-base',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0`}
        style={{ backgroundColor: model.color + '20', border: `1.5px solid ${model.color}` }}
      >
        <span>{model.icon}</span>
      </div>
      {showName && (
        <span className="text-xs font-medium text-muted-foreground">{model.name}</span>
      )}
    </div>
  );
}