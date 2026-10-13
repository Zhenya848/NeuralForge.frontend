import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { getEmoji } from '@/entities/shared/Constants';
import type { ChatFolder } from '@/entities/folders/ChatFolder';
import type { Chat } from '@/entities/chats/Chat';
import type { Project } from '@/entities/projects/Project';

interface AssignProjectModalProps {
  projects: Project[];
  open: boolean;
  onClose: () => void;
  target: Chat | ChatFolder;
  currentProjectId: string | null;
  onAssign: (target: Chat | ChatFolder, projectId: string | null) => Promise<void>;
}

export default function AssignProjectModal({ projects, open, onClose, target, currentProjectId, onAssign }: AssignProjectModalProps) {
  const assign = async (projectId: string | null) => {
    await onAssign(target, projectId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Перенести в проект</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 mt-2 max-h-72 overflow-y-auto">
          <button
            onClick={async () => await assign(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!currentProjectId ? 'bg-primary/15 border border-primary/30 text-foreground' : 'hover:bg-secondary/50 border border-transparent text-muted-foreground'}`}
          >
            <span>📭</span> Без проекта
            {!currentProjectId && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </button>
          {projects.filter(p => !p.isSystem).map(p => (
              <button
                key={p.id}
                onClick={async () => await assign(p.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${currentProjectId === p.id ? 'bg-primary/15 border border-primary/30 text-foreground' : 'hover:bg-secondary/50 border border-transparent text-muted-foreground'}`}
            >
              <span>{getEmoji(p.emojiId)}</span> {p.name}
              {currentProjectId === p.id && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
            </button>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-4">Создайте проект в свитчере</p>
          )}
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>Отмена</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}