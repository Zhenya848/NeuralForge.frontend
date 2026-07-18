import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getEmoji } from '@/entities/shared/Constants';
import { toast } from 'sonner';

interface AssignProjectModalProps {
  open: boolean;
  onClose: () => void;
  targetType: 'chat' | 'folder';
  targetId: string;
  currentProjectId: string | null;
}

export default function AssignProjectModal({ open, onClose, targetType, targetId, currentProjectId }: AssignProjectModalProps) {
  const { projects, setChatProject, setFolderProject } = useStore();

  const assign = (projectId: string | null) => {
    if (targetType === 'chat') setChatProject(targetId, projectId);
    else setFolderProject(targetId, projectId);
    toast.success('Проект изменён');
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
            onClick={() => assign(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${!currentProjectId ? 'bg-primary/15 border border-primary/30 text-foreground' : 'hover:bg-secondary/50 border border-transparent text-muted-foreground'}`}
          >
            <span>📭</span> Без проекта
            {!currentProjectId && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </button>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => assign(p.id)}
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