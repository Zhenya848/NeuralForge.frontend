import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, FolderOpen } from 'lucide-react';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { toast } from 'sonner';
import { getEmoji } from '@/entities/shared/Constants';

interface CreateFolderModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string, emojiId: number, projectId?: string, parentId?: string) => Promise<void>;
    projectId?: string;
    parentId?: string
}

export default function CreateFolderModal({ open, onClose, onCreate, projectId, parentId }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [iconId, setIconId] = useState(0);

  useEffect(() => {
    if (open) { setName(''); setIconId(0); }
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Введите название'); return; }

    await onCreate(name.trim(), iconId, projectId, parentId);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FolderOpen className="w-4 h-4 text-primary" />
            {parentId ? 'Новая подпапка' : 'Новая папка'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <EmojiPicker value={getEmoji(iconId)} onChange={setIconId} />
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Название папки..."
              className="bg-secondary/50 border-border/50"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleCreate}>
            <Check className="w-3.5 h-3.5 mr-1" /> Создать
          </Button>
          <Button size="sm" variant="outline" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}