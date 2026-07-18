/*import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Hash, Plus } from 'lucide-react';

interface TopicSelectorModalProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
}

export default function TopicSelectorModal({ open, onClose, chatId }: TopicSelectorModalProps) {
  const { topics, setChatTopic, chats } = useStore();
  const [newTopicName, setNewTopicName] = useState('');
  const [showNew, setShowNew] = useState(false);

  const chat = chats.find(c => c.id === chatId);

  const handleSelectTopic = (topicName) => {
    setChatTopic(chatId, topicName);
    toast.success(`Привязано к теме «${topicName}»`);
    onClose();
  };

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) return;
    setChatTopic(chatId, newTopicName.trim());
    toast.success(`Тема «${newTopicName.trim()}» создана`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Привязать к теме</DialogTitle>
        </DialogHeader>
        {chat?.topic && (
          <p className="text-xs text-muted-foreground -mt-2">
            Текущая тема: <span className="text-primary font-medium">{chat.topic}</span>
          </p>
        )}

        {topics.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Существующие темы</p>
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left ${
                  chat?.topic === topic.name
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium">{topic.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{topic.chatIds.length} чатов</span>
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-border/30 pt-3">
          {showNew ? (
            <div className="flex gap-2">
              <Input
                value={newTopicName}
                onChange={e => setNewTopicName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateTopic()}
                placeholder="Название новой темы"
                className="flex-1 h-9 bg-secondary/50 border-border/50 rounded-xl text-sm"
                autoFocus
              />
              <Button size="sm" onClick={handleCreateTopic} className="h-9 bg-primary/20 hover:bg-primary/30 text-primary border-0">
                Создать
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm text-muted-foreground"
            >
              <Plus className="w-4 h-4" /> Новая тема
            </button>
          )}
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>Отмена</Button>
      </DialogContent>
    </Dialog>
  );
}*/