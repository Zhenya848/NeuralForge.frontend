import { BookmarkCheck, MessageSquare, ChevronRight, X } from 'lucide-react';
import { useStore } from '@/shared/lib/store';
import { getMessageRole } from '@/entities/shared/Constants';

interface BookmarksSidebarProps {
  chatId: string;
  onScrollToMessage: (messageId: string) => void;
  onClose: () => void;
}

export default function BookmarksSidebar({ chatId, onScrollToMessage, onClose }: BookmarksSidebarProps) {
  const { chats } = useStore();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return null;

  const bookmarkedMsgs = chat.messages.filter(m => m.isBookmarked);
  const userMessages = chat.messages.filter(m => getMessageRole(m) === 'user');

  return (
    <div className="w-full h-full flex flex-col bg-card/50 border-l border-border/50">
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Навигация</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Bookmarks */}
        {bookmarkedMsgs.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <BookmarkCheck className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Закладки</span>
            </div>
            <div className="space-y-1">
              {bookmarkedMsgs.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => onScrollToMessage(msg.id)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-secondary/60 transition-colors group"
                >
                  <p className="text-xs text-foreground/80 line-clamp-2 group-hover:text-foreground transition-colors">
                    {msg.value.slice(0, 80)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User messages */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Запросы</span>
          </div>
          <div className="space-y-1">
            {userMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => onScrollToMessage(msg.id)}
                className="w-full flex items-center gap-1.5 text-left px-2.5 py-2 rounded-lg hover:bg-secondary/60 transition-colors group"
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                  {msg.value.slice(0, 60)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}