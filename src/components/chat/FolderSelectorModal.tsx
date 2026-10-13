import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getEmoji } from '@/entities/shared/Constants';
import { toast } from 'sonner';
import { Folder, Plus, ChevronRight } from 'lucide-react';
import type { ChatFolder } from '@/entities/folders/ChatFolder';
import type { Chat } from '@/entities/chats/Chat';

interface FolderOptionProps {
  folder: ChatFolder;
  allFolders: ChatFolder[];
  depth: number;
  selectedId: string;
  chat: Chat;
  onSelect: (chat: Chat, folderId: string) => Promise<void>;
}

function FolderOption({ folder, allFolders, depth, selectedId, chat, onSelect }: FolderOptionProps) {
  const children = allFolders.filter(f => f.parentId === folder.id);
  return (
    <div>
      <button
        onClick={async () => await onSelect(chat, folder.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left ${
          selectedId === folder.id ? 'bg-primary/15 border border-primary/30' : 'hover:bg-secondary/60'
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span className="text-sm">{getEmoji(folder.emojiId)}</span>
        <span className="text-sm flex-1 truncate">{folder.name}</span>
        {selectedId === folder.id && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
      </button>
      {children.map(child => (
        <FolderOption key={child.id} folder={child} allFolders={allFolders} depth={depth + 1} selectedId={selectedId} chat={chat} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface FolderSelectorModalProps {
  folders: ChatFolder[];
  chat: Chat;
  open: boolean;
  onClose: () => void;
  onSelect: (chat: Chat, folderId: string) => Promise<void>;
}

export default function FolderSelectorModal({ folders, chat, open, onClose, onSelect }: FolderSelectorModalProps) {
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newParentId, setNewParentId] = useState<string | null>(null);

  const rootFolders = folders.filter(f => f.parentId === null && !f.isSystem);
  const systemFolder = folders.find(f => f.isSystem)!;

  const handleSelect = async (chat: Chat, folderId: string) => {
    await onSelect(chat, folderId);
    onClose();
  };

  const handleRemoveFromFolder = async () => {
    await onSelect(chat, systemFolder.id);
    onClose();
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    toast.success(`Папка «${newTitle.trim()}» создана`);
    setNewTitle('');
    setShowNew(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Folder className="w-4 h-4" /> Переместить в папку
          </DialogTitle>
        </DialogHeader>

        {chat.folderId !== systemFolder.id && (
          <button
            onClick={handleRemoveFromFolder}
            className="text-xs text-muted-foreground hover:text-destructive text-left transition-colors"
          >
            Убрать из папки
          </button>
        )}

        <div className="space-y-0.5 max-h-60 overflow-y-auto">
          {rootFolders.map(folder => (
            <FolderOption
              key={folder.id}
              folder={folder}
              allFolders={folders}
              depth={0}
              selectedId={chat.folderId}
              chat={chat}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="border-t border-border/30 pt-3">
          {showNew ? (
            <div className="space-y-2">
              <select
                className="w-full text-sm bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-foreground"
                value={newParentId || ''}
                onChange={e => setNewParentId(e.target.value || null)}
              >
                <option value="">Корневая папка</option>
                {folders.map(f => <option key={f.id} value={f.id}>{getEmoji(f.emojiId)} {f.name}</option>)}
              </select>
              <div className="flex gap-2">
                <Input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Название папки"
                  className="flex-1 h-9 bg-secondary/50 border-border/50 rounded-xl text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleCreate} className="h-9">Создать</Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm text-muted-foreground"
            >
              <Plus className="w-4 h-4" /> Новая папка
            </button>
          )}
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>Отмена</Button>
      </DialogContent>
    </Dialog>
  );
}