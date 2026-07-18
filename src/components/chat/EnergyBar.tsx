import { Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function EnergyBar() {
  const { energy } = useStore();
  const pct = (energy.current / energy.max) * 100;
  const isLow = pct < 20;
  const isCritical = pct < 10;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/50">
      <Zap className={`w-4 h-4 ${isCritical ? 'text-destructive' : isLow ? 'text-yellow-500' : 'text-emerald-400'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Энергия</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {energy.current.toLocaleString()}/{energy.max.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical ? 'bg-destructive' : isLow ? 'bg-yellow-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}