import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bookmark, Plus, FolderOpen, ChevronRight, ChevronDown, X } from 'lucide-react';
import { useStore } from '@/shared/lib/store';
import { toast } from 'sonner';
import EmojiPicker from '@/components/ui/EmojiPicker';
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';
import { EMOJIS, getEmoji } from '@/entities/shared/Constants';
import type { Message } from '@/entities/chats/messages/Message';

interface FolderRowProps {
  cluster: FragmentFolder;
  allClusters: FragmentFolder[];
  selectedId: string;
  onSelect: (selectedId: string) => void;
  depth: number;
}

// Recursive folder row for selection
function FolderRow({ cluster, allClusters, selectedId, onSelect, depth = 0 }: FolderRowProps) {
  const [expanded, setExpanded] = useState(depth === 0);
  const children = allClusters.filter(c => c.parentId === cluster.id);

  return (
    <div>
      <div
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onSelect(cluster.id)}
        className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-lg cursor-pointer text-sm transition-colors ${
          selectedId === cluster.id
            ? 'bg-primary/15 border border-primary/30 text-foreground'
            : 'hover:bg-secondary/50 text-muted-foreground'
        }`}
      >
        {children.length > 0 ? (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            className="p-0.5 hover:bg-secondary rounded flex-shrink-0"
          >
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        <span className="flex-shrink-0">{getEmoji(cluster.emojiId)}</span>
        <span className="truncate flex-1">{cluster.name}</span>
        <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{cluster.fragments.length}</span>
      </div>
      {expanded && children.map(child => (
        <FolderRow
          key={child.id}
          cluster={child}
          allClusters={allClusters}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

interface SaveFragmentModalProps {
  open: boolean;
  onClose: () => void;
  text: string;
  sourceMessage: Message;
  sourceChatId: string;
}

export default function SaveFragmentModal({ open, onClose, text, sourceMessage, sourceChatId }: SaveFragmentModalProps) {
  const { clusters, projects, activeProjectId, saveFragment, createCluster } = useStore();
  const [title, setTitle] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewCluster, setShowNewCluster] = useState(false);
  const [newClusterName, setNewClusterName] = useState('');
  const [newClusterIcon, setNewClusterIcon] = useState('📁');

  // Default to the active project whenever the modal opens
  useEffect(() => {
    if (open) {
      setSelectedProject(
        (activeProjectId !== 'all' && activeProjectId !== 'none') ? activeProjectId : null
      );
    }
  }, [open]);

  const rootClusters = clusters.filter(c => !c.parentId && !c.isSystem);

  const handleSave = () => {
    if (!title.trim()) { toast.error('Введите название фрагмента'); return; }

    let clusterId = selectedCluster;
    if (showNewCluster && newClusterName.trim()) {
      clusterId = createCluster(newClusterName.trim(), newClusterIcon, '#8b5cf6', null, selectedProject);
    }

    saveFragment({
      title: title.trim(),
      content: text,
      sourceModel: sourceMessage?.model || 'user',
      sourceChatId,
      sourceMessageId: sourceMessage?.id,
    }, clusterId, selectedProject);

    toast.success('Фрагмент сохранён');
    setTitle('');
    setSelectedCluster(null);
    setShowNewCluster(false);
    setNewClusterName('');
    setNewClusterIcon('📁');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Bookmark className="w-5 h-5 text-primary" />
            Сохранить фрагмент
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Preview */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 max-h-24 overflow-y-auto">
            <p className="text-xs text-muted-foreground line-clamp-4">{text}</p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Название фрагмента</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              placeholder="Введите название..."
              className="bg-secondary/50 border-border/50"
              autoFocus
            />
          </div>

          {/* Project selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Проект</Label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedProject(null)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  !selectedProject ? 'bg-primary/15 border border-primary/30 text-foreground' : 'bg-secondary/30 border border-transparent hover:bg-secondary/60 text-muted-foreground'
                }`}
              >
                <span>📭</span> Без проекта
              </button>
              {projects.filter(p => !p.isSystem).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedProject === p.id ? 'bg-primary/15 border border-primary/30 text-foreground' : 'bg-secondary/30 border border-transparent hover:bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  <span>{getEmoji(p.emojiId)}</span> {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Folder tree selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Папка библиотеки (необязательно)</Label>
            <div className="rounded-lg bg-secondary/30 border border-border/50 max-h-40 overflow-y-auto p-1 space-y-0.5">
              {rootClusters.length === 0 && !showNewCluster && (
                <p className="text-xs text-muted-foreground/50 text-center py-3">Нет папок</p>
              )}
              {rootClusters.map(cluster => (
                <FolderRow
                  key={cluster.id}
                  cluster={cluster}
                  allClusters={clusters}
                  selectedId={selectedCluster ?? ""}
                  onSelect={(id) => { setSelectedCluster(id); setShowNewCluster(false); }}
                  depth={0}
                />
              ))}
              <button
                onClick={() => { setShowNewCluster(v => !v); setSelectedCluster(null); }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm w-full transition-colors ${
                  showNewCluster
                    ? 'bg-primary/15 border border-primary/30 text-foreground'
                    : 'border border-dashed border-border hover:bg-secondary/60 text-muted-foreground'
                }`}
              >
                {showNewCluster ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Создать новую папку</span>
              </button>
            </div>

            {showNewCluster && (
              <div className="flex items-center gap-2">
                <EmojiPicker value={newClusterIcon} onChange={setNewClusterIcon} />
                <Input
                  value={newClusterName}
                  onChange={e => setNewClusterName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setShowNewCluster(false); }}
                  placeholder="Название папки..."
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Отмена</Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSave}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}