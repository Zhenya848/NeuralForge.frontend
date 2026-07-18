import { useState } from 'react';
import { X } from 'lucide-react';
import { getEmoji } from '@/entities/shared/Constants';
import type { Folder } from '@/entities/folders/Folder';

const ICONS = [
  '📁','📂','🗂️','💼','📚','📖','📝','🗒️','🗃️','🗄️',
  '💻','🖥️','⚙️','🔧','🔨','🛠️','🚀','⚡','🔥','✨',
  '🎨','🎯','🏗️','🧩','🔬','🧪','📐','📊','📈','📉',
  '🤖','🧠','💡','🔑','🏆','⭐','❤️','💜','💙','💚',
  '🌐','🌍','🌙','☀️','🎵','🎬','📷','🎮','💰','🏠',
];

interface FolderIconModalProps {
  folder: Folder;
  onSave: (emoji: string) => void;
  onClose: () => void;
}

export default function FolderIconModal({ folder, onSave, onClose }: FolderIconModalProps) {
  const [selected, setSelected] = useState(getEmoji(folder.emojiId) || '📁');
  const [custom, setCustom] = useState('');

  const handleSave = () => {
    onSave(custom.trim() || selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-popover border border-border rounded-2xl shadow-2xl p-5 w-80"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Иконка папки</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>

        {/* Current preview */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-secondary/40 rounded-xl">
          <span className="text-3xl">{custom.trim() || selected}</span>
          <div>
            <p className="text-xs text-muted-foreground">Предпросмотр</p>
            <p className="text-sm font-medium">{folder.name}</p>
          </div>
        </div>

        {/* Custom emoji input */}
        <div className="mb-3">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Своя иконка</label>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Введите эмодзи..."
            maxLength={4}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-10 gap-1 mb-4 max-h-36 overflow-y-auto">
          {ICONS.map(icon => (
            <button
              key={icon}
              onClick={() => { setSelected(icon); setCustom(''); }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-base hover:bg-secondary/80 transition-colors ${
                selected === icon && !custom.trim() ? 'bg-primary/20 ring-1 ring-primary' : ''
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-border text-sm hover:bg-secondary/50 transition-colors">
            Отмена
          </button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}