import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EMOJIS } from '@/entities/shared/Constants';

interface EmojiPickerProps {
  value: string;
  onChange: (emojid: number) => void;
  buttonClassName?: string;
}

export default function EmojiPicker({ value, onChange, buttonClassName }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={buttonClassName || "w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 text-xl transition-colors flex-shrink-0"}
        >
          {value || '📁'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-popover border-border" align="start">
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onChange(i); setOpen(false); }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-base hover:bg-secondary transition-colors ${value === emoji ? 'bg-primary/20 ring-1 ring-primary/50' : ''}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}