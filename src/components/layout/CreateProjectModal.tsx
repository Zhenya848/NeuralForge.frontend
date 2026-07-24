import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { useStore } from '@/shared/lib/store';
import { toast } from 'sonner';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const { createProject, setActiveProject } = useStore();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [color, setColor] = useState(COLORS[0]);
  const [instructions, setInstructions] = useState('');

  const reset = () => { setName(''); setIcon('🚀'); setColor(COLORS[0]); setInstructions(''); };

  const handleCreate = () => {
    if (!name.trim()) { toast.error('Введите название'); return; }
    const id = createProject(name.trim(), icon, color, instructions.trim());
    setActiveProject(id);
    toast.success('Проект создан');
    reset();
    onCreated?.();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Новый проект</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <EmojiPicker value={icon} onChange={setIcon} />
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Название проекта..."
              className="bg-secondary/50 border-border/50" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }} />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-card scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Инструкции для проекта
            </label>
            <Textarea value={instructions} onChange={e => setInstructions(e.target.value)}
              placeholder="Например: отвечай только на русском, используй формальный тон, фокусируйся на технических деталях..."
              className="bg-secondary/50 border-border/50 text-sm min-h-[100px] resize-none" />
            <p className="text-[10px] text-muted-foreground/40 mt-1">
              Эти инструкции будут применяться ко всем чатам внутри проекта
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleCreate}>
            <Check className="w-3.5 h-3.5 mr-1" /> Создать
          </Button>
          <Button size="sm" variant="outline" onClick={handleClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}