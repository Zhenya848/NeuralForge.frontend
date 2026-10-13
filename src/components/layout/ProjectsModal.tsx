import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Check, X, FileText } from 'lucide-react';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { getEmoji, getColor } from '@/entities/shared/Constants';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];
import { toast } from 'sonner';
import type { Project } from '@/entities/projects/Project';
import type { UpdateProjectDto } from '@/features/projects/models/UpdateProjectDto';

interface ProjectsModalProps {
  initProjects: Project[];
  open: boolean;
  onClose: () => void;
  onUpdate: (projects: UpdateProjectDto[]) => Promise<void>;
}

export default function ProjectsModal({ initProjects, open, onClose, onUpdate }: ProjectsModalProps) {
  const [editingId, setEditingId] = useState<string | null>('null');
  const [editVal, setEditVal] = useState('');
  const [editInstrId, setEditInstrId] = useState<string | null>(null);
  const [instrVal, setInstrVal] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const initialProjects = useRef<Project[]>([]);

  useEffect(() => {
    if (!open) 
      return;

    setProjects(initProjects);
    initialProjects.current = structuredClone(initProjects);
  }, [open]);

  const [deletedProjects, setDeletedProjects] = useState<string[]>([]);

  const handleUpdateProject = <K extends keyof UpdateProjectDto>(projectId: string, field: K, value: UpdateProjectDto[K]) => {
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? { ...project, [field]: value }
            : project
        )
      );
  };

  const saveChanges = async () => {
    try {
      const changedProjects: UpdateProjectDto[] = projects
      .filter(project => {
        const original = initialProjects.current.find(p => p.id === project.id)!;

        return (
          project.name !== original.name ||
          project.description !== original.description ||
          project.emojiId !== original.emojiId ||
          project.colorId !== original.colorId
        );
      })
      .map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        emojiId: project.emojiId,
        colorId: project.colorId,
      }));

      await onUpdate(changedProjects);

      onClose();
    }
    catch (error: unknown) {
      console.log(error);
    }
  }

  const startEdit = (p: UpdateProjectDto) => { setEditingId(p.id); setEditVal(p.name); };
  const saveEdit = (projectId: string) => {
    if (editVal.trim()) {
      handleUpdateProject(projectId, "name", editVal.trim());
      toast.success('Переименовано');
    }

    setEditingId(null);
  };

  const startEditInstr = (p: UpdateProjectDto) => { setEditInstrId(p.id); setInstrVal(p.description || ''); };
  const saveInstr = (projectId: string) => {
    handleUpdateProject(projectId, "description", instrVal.trim());
    toast.success('Инструкции обновлены');
    setEditInstrId(null);
  };

  const handleDelete = (p: UpdateProjectDto) => {
    if (!window.confirm(`Удалить проект «${p.name}»? Чаты, папки и фрагменты станут «без проекта».`))
        return;

    setDeletedProjects(prev =>
        prev.includes(p.id) ? prev : [...prev, p.id]
    );

    toast.success("Проект удалён");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Управление проектами</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2 max-h-96 overflow-y-auto">
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-6">Нет проектов</p>
          )}
          {projects.map(p => (
            <div key={p.id} className="px-3 py-2 rounded-lg hover:bg-secondary/40 space-y-2">
              <div className="flex items-center gap-2">
                <EmojiPicker value={getEmoji(p.emojiId)} onChange={(emojiId) => handleUpdateProject(p.id, "emojiId", emojiId)} buttonClassName="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-sm transition-colors flex-shrink-0" />
                {editingId === p.id ? (
                  <>
                    <Input value={editVal} onChange={e => setEditVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(p.id); if (e.key === 'Escape') setEditingId(null); }}
                      className="h-7 text-sm bg-secondary/50 border-border/50" autoFocus />
                    <button onClick={() => saveEdit(p.id)} className="p-1 rounded hover:bg-secondary flex-shrink-0"><Check className="w-3.5 h-3.5 text-emerald-400" /></button>
                    <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-secondary flex-shrink-0"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </>
                ) : (
                  <>
                    <span className="text-sm flex-1 truncate">{p.name}</span>
                    <button onClick={() => startEdit(p)} className="p-1 rounded hover:bg-secondary flex-shrink-0"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(p)} className="p-1 rounded hover:bg-destructive/10 flex-shrink-0"><Trash2 className="w-3.5 h-3.5 text-destructive/60" /></button>
                  </>
                )}
              </div>

              {editingId !== p.id && (
                <>
                <div className="flex items-center gap-1.5 pl-6 flex-wrap mb-1">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => handleUpdateProject(p.id, "colorId", COLORS.indexOf(c))}
                      className={`w-4 h-4 rounded-full transition-transform ${getColor(p.colorId) === c ? 'ring-2 ring-offset-1 ring-offset-card scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="pl-6">
                  {editInstrId === p.id ? (
                    <div className="space-y-1.5">
                      <Textarea value={instrVal} onChange={e => setInstrVal(e.target.value)}
                        placeholder="Инструкции для ИИ в этом проекте..."
                        className="bg-secondary/50 border-border/50 text-xs min-h-[80px] resize-none" autoFocus />
                      <div className="flex gap-1.5">
                        <Button size="sm" className="h-6 text-xs px-2 bg-primary hover:bg-primary/90" onClick={() => saveInstr(p.id)}>
                          <Check className="w-3 h-3 mr-1" /> Сохранить
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setEditInstrId(null)}>
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => startEditInstr(p)}
                      className="flex items-start gap-1.5 text-left w-full text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors group">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">
                        {p.description ? (
                          <span className="line-clamp-2">{p.description}</span>
                        ) : (
                          <span className="italic opacity-50">Добавить инструкции...</span>
                        )}
                      </span>
                    </button>
                  )}
                </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={saveChanges}>Готово</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}