import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, type CSSProperties } from 'react';

interface ContextMenuItem {
  label?: string;
  action?: () => void;
  icon?: LucideIcon;
  emoji?: string;
  danger?: boolean;
  divider?: boolean;
}

interface FolderContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function FolderContextMenu({ x, y, items, onClose }: FolderContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // close on outside click or scroll
    document.addEventListener('mousedown', handle);
    document.addEventListener('scroll', onClose, true);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  // Clamp to viewport
  const style: CSSProperties = {
    position: 'fixed',
    top: Math.min(y, window.innerHeight - 200),
    left: Math.min(x, window.innerWidth - 180),
    zIndex: 9999,
  };

  return (
    <div
      ref={ref}
      style={style}
      className="w-44 bg-popover border border-border rounded-xl shadow-2xl py-1 overflow-hidden"
    >
      {items.map((item, i) => {
        if (item.divider) return <div key={i} className="my-1 border-t border-border/50" />;
        const Icon = item.icon;
        return (
          <button
            key={i}
            onClick={item.action}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/80 transition-colors text-left ${
              item.danger ? 'text-destructive hover:text-destructive' : 'text-foreground'
            }`}
          >
            {Icon ? <Icon className="w-3.5 h-3.5 flex-shrink-0" /> : <span className="w-3.5 h-3.5 flex-shrink-0 text-center leading-none">{item.emoji}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}