import { useState, useRef, useEffect } from 'react';
import { Bookmark, BookmarkCheck, MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { getMessageRole } from '@/entities/shared/Constants';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Message } from '@/entities/chats/messages/Message';

interface ChatMessageProps {
  message: Message;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSaveFragment: (selectedText: string, message: Message) => void;
  onDiscussInChat: (selectedText: string) => void;
  onDiscussInNewChat: (selectedText: string) => void;
  highlightId: string;
}

export default function ChatMessage({
  message,
  isBookmarked,
  onToggleBookmark,
  onSaveFragment,
  onDiscussInChat,
  onDiscussInNewChat,
  highlightId,
}: ChatMessageProps) {
  const isUser = getMessageRole(message) === 'user';
  const [selectedText, setSelectedText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [actionPos, setActionPos] = useState({ x: 0, y: 0 });
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString()?.trim();
      if (selection?.anchorNode && text && text.length > 3 && msgRef.current?.contains(selection?.anchorNode)) {
        setSelectedText(text);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const msgRect = msgRef.current.getBoundingClientRect();
        setActionPos({
          x: rect.left - msgRect.left + rect.width / 2,
          y: rect.top - msgRect.top - 8,
        });
        setShowActions(true);
      } else if (selection?.anchorNode && msgRef.current && !msgRef.current.contains(selection?.anchorNode)) {
        setShowActions(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;

      if (!e.target.closest('.selection-toolbar')) {
        setShowActions(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleSave = () => {
    onSaveFragment(selectedText, message);
    setShowActions(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(selectedText || message.value);
    toast.success('Скопировано');
  };

  return (
    <div
      id={`message-${message.id}`}
      ref={msgRef}
      className={`group relative px-4 py-4 md:px-8 transition-colors duration-300 ${
        isBookmarked ? 'bg-yellow-500/5 border-l-2 border-yellow-500/50' : 'border-l-2 border-transparent'
      } ${highlightId === message.id ? 'bg-primary/10 animate-pulse' : ''}`}
    >
      {/* Selection toolbar */}
      {showActions && (
        <div
          className="selection-toolbar absolute z-50 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-popover border border-border shadow-xl shadow-black/20 -translate-x-1/2 -translate-y-full"
          style={{ left: actionPos.x, top: actionPos.y }}
        >
          <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs gap-1.5" onClick={handleSave}>
            <Bookmark className="w-3 h-3" /> Сохранить
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs gap-1.5" onClick={() => { onDiscussInChat(selectedText); setShowActions(false); }}>
            <MessageSquare className="w-3 h-3" /> Обсудить
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs gap-1.5" onClick={() => { onDiscussInNewChat(selectedText); setShowActions(false); }}>
            <ExternalLink className="w-3 h-3" /> Новый чат
          </Button>
        </div>
      )}

      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`min-w-0 ${isUser ? 'max-w-[85%] ml-auto' : 'w-full'}`}>
          {/* Message content */}
          <div className={`rounded-2xl px-4 py-3 overflow-x-hidden w-full ${
            isUser 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-secondary/50 border border-border/50'
          }`}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.value}</p>
            ) : (
              <div className="text-sm break-words overflow-hidden">
                <ReactMarkdown
                  className="prose prose-invert prose-sm max-w-none 
                    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 
                    prose-headings:text-foreground prose-p:text-foreground/90 
                    prose-strong:text-foreground prose-code:text-primary
                    prose-pre:bg-background prose-pre:border prose-pre:border-border
                    prose-li:text-foreground/90
                    [&_pre]:overflow-x-auto [&_pre]:max-w-full
                    [&_code]:break-all [&_p]:break-words [&_li]:break-words
                    [&_a]:break-all"
                >
                  {message.value}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className={`flex items-center gap-2 mt-1.5 px-1 ${isUser ? 'justify-end' : ''}`}>
            <span className="text-[10px] text-muted-foreground/50">
              {new Date(message.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1 rounded hover:bg-secondary transition-colors">
                <Copy className="w-3 h-3 text-muted-foreground" />
              </button>
              <button onClick={() => onToggleBookmark(message.id)} className="p-1 rounded hover:bg-secondary transition-colors">
                {isBookmarked ? (
                  <BookmarkCheck className="w-3 h-3 text-yellow-500" />
                ) : (
                  <Bookmark className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              <button onClick={() => onSaveFragment(message.value, message)} className="p-1 rounded hover:bg-secondary transition-colors">
                <Bookmark className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}