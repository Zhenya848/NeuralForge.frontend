import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, FolderOpen, Bookmark } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getEmoji } from '@/entities/shared/Constants';
import AiModelBadge from '@/components/chat/AiModelBadge';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { chats, clusters } = useStore();
  const navigate = useNavigate();
  const q = query.toLowerCase().trim();

  // Search results
  const chatResults = q ? chats.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.messages.some(m => m.value.toLowerCase().includes(q))
  ).slice(0, 5) : [];

  const fragmentResults = q ? clusters.flatMap(cl =>
    cl.fragments.filter(f =>
      f.name.toLowerCase().includes(q) || f.content.toLowerCase().includes(q)
    ).map(f => ({ ...f, clusterName: cl.name, clusterId: cl.id }))
  ).slice(0, 5) : [];

  const clusterResults = q ? clusters.filter(cl =>
    cl.name.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const goToChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    onClose();
  };

  const goToLibrary = () => {
    navigate('/library');
    onClose();
  };

  const hasResults = chatResults.length > 0 || fragmentResults.length > 0 || clusterResults.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-card border-border overflow-hidden gap-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по чатам, фрагментам, кластерам..."
            className="border-none bg-transparent p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
            autoFocus
          />
          <kbd className="hidden sm:inline text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {!q && (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground/50">Начните вводить для поиска</p>
            </div>
          )}

          {q && !hasResults && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground/50">Ничего не найдено</p>
            </div>
          )}

          {/* Chats */}
          {chatResults.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Чаты</span>
              </div>
              {chatResults.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => goToChat(chat.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4 text-primary/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{chat.name}</p>
                    <p className="text-[10px] text-muted-foreground">{chat.messages.length} сообщений</p>
                    </div>
                    {chat.usedAiModels?.length > 0 && (
                    <div className="flex -space-x-1 flex-shrink-0">
                     {chat.usedAiModels.map(m => <AiModelBadge key={m} modelId={m} size="xs" showName={false} />)}
                    </div>
                    )}

                    </button>
              ))}
            </div>
          )}

          {/* Fragments */}
          {fragmentResults.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Фрагменты</span>
              </div>
              {fragmentResults.map(frag => (
                <button
                  key={frag.id}
                  onClick={goToLibrary}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                >
                  <Bookmark className="w-4 h-4 text-yellow-500/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{frag.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{frag.clusterName}</p>
                    {frag.aiModel && <AiModelBadge modelId={frag.aiModel} size="xs" showName={false} />}
                    </div>
                  
                </button>
              ))}
            </div>
          )}

          {/* Clusters */}
          {clusterResults.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Кластеры</span>
              </div>
              {clusterResults.map(cl => (
                <button
                  key={cl.id}
                  onClick={goToLibrary}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                >
                  <FolderOpen className="w-4 h-4 text-primary/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{getEmoji(cl.emojiId)} {cl.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cl.fragments.length} фрагментов</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-border/50 bg-secondary/20 flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground">
            <kbd className="bg-muted px-1 py-0.5 rounded mr-1">↑↓</kbd> навигация
          </span>
          <span className="text-[10px] text-muted-foreground">
            <kbd className="bg-muted px-1 py-0.5 rounded mr-1">↵</kbd> открыть
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}