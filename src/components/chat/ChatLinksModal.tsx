import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, type ChatLinkType } from '@/lib/store';
import { toast } from 'sonner';
import { Link2, Plus, X, MessageSquare, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatLinksModalProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
}

export default function ChatLinksModal({ open, onClose, chatId }: ChatLinksModalProps) {
  const { chats, chatLinks, addChatLink, removeChatLink } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const currentLinks = chatLinks.filter(l => l.fromChatId === chatId || l.toChatId === chatId);

  const getLinkedChat = (link: ChatLinkType) => {
    const linkedId = link.fromChatId === chatId ? link.toChatId : link.fromChatId;
    return chats.find(c => c.id === linkedId);
  };

  const otherChats = chats.filter(c => c.id !== chatId && !currentLinks.some(l => l.fromChatId === c.id || l.toChatId === c.id));
  const filtered = otherChats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!selectedChatId) return;
    addChatLink(chatId, selectedChatId, linkLabel.trim());
    const linked = chats.find(c => c.id === selectedChatId);
    toast.success(`Связь с «${linked?.name}» добавлена`);
    setSelectedChatId(null);
    setLinkLabel('');
    setSearch('');
    setShowAdd(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Связи с другими чатами
          </DialogTitle>
        </DialogHeader>

        {/* Existing links */}
        {currentLinks.length > 0 ? (
          <div className="space-y-1.5">
            {currentLinks.map(link => {
              const linked = getLinkedChat(link);
              if (!linked) return null;
              return (
                <div key={link.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 group">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => { navigate(`/chat/${linked.id}`); onClose(); }}
                      className="text-sm font-medium truncate block w-full text-left hover:text-primary transition-colors"
                    >
                      {linked.name}
                    </button>
                    {link.label && <span className="text-[10px] text-muted-foreground">{link.label}</span>}
                  </div>
                  <button
                    onClick={() => removeChatLink(link.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">Нет связанных чатов</p>
        )}

        {/* Add new link */}
        {showAdd ? (
          <div className="border-t border-border/30 pt-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск чата..."
                className="pl-8 h-9 bg-secondary/50 border-border/50 rounded-xl text-sm"
                autoFocus
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-0.5">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChatId(c.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                    selectedChatId === c.id ? 'bg-primary/15 border border-primary/30' : 'hover:bg-secondary/60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
            {selectedChatId && (
              <Input
                value={linkLabel}
                onChange={e => setLinkLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Описание связи (опционально)"
                className="h-9 bg-secondary/50 border-border/50 rounded-xl text-sm"
              />
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!selectedChatId} className="flex-1 h-9">
                Добавить связь
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setSelectedChatId(null); setSearch(''); }}>
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm text-muted-foreground border-t border-border/30 pt-3 mt-1"
          >
            <Plus className="w-4 h-4" /> Связать с чатом
          </button>
        )}

        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>Закрыть</Button>
      </DialogContent>
    </Dialog>
  );
}