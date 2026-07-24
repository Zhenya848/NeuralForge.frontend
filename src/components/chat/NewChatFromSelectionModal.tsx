import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRightLeft } from 'lucide-react';
import { useStore } from '@/shared/lib/store';
import { AI_MODELS } from '@/shared/lib/mockData';
import AiModelBadge from './AiModelBadge';
import type { Chat } from '@/entities/chats/Chat';

interface NewChatFromSelectionModalProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

export default function NewChatFromSelectionModal({ open, onClose, chat }: NewChatFromSelectionModalProps) {
  const { createChat } = useStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set());
  const [title, setTitle] = useState('');
  const [modelId, setModelId] = useState(chat?.usedAiModels?.[0] || 'chatgpt');

  if (!chat) return null;

  const toggle = (msgId: string) => {
    const s = new Set(selected);
    if (s.has(msgId)) s.delete(msgId); else s.add(msgId);
    setSelected(s);
  };

  const handleCreate = () => {
    const msgs = chat.messages
      .filter(m => selected.has(m.id))
      .map(m => ({ ...m, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}` }));
    const id = createChat(title || 'Продолжение чата', modelId, msgs);
    navigate(`/chat/${id}`);
    onClose();
    setSelected(new Set());
    setTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Перенести в новый чат
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название нового чата..." className="bg-secondary/50 border-border/50" />

          <div className="flex gap-1.5 flex-wrap">
            {Object.values(AI_MODELS).map(m => (
              <button
                key={m.id}
                onClick={() => setModelId(m.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
                  modelId === m.id ? 'bg-primary/10 border-primary/30 text-foreground' : 'bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/60'
                }`}
              >
                <AiModelBadge modelId={m.id} size="xs" />
              </button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">Выберите сообщения для переноса:</div>
          <div className="max-h-60 overflow-y-auto space-y-1 rounded-lg border border-border/50 p-2">
            {chat.messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => toggle(msg.id)}
                className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  selected.has(msg.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/50 border border-transparent'
                }`}
              >
                <Checkbox checked={selected.has(msg.id)} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {msg.model && <AiModelBadge modelId={msg.model} size="xs" />}
                    {msg.model && <span className="text-[10px] text-muted-foreground">Вы</span>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{msg.value.slice(0, 100)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Отмена</Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" disabled={selected.size === 0} onClick={handleCreate}>
              Создать ({selected.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}