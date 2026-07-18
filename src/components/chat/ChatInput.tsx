import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Paperclip, Mic, MicOff, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AI_MODELS } from '@/lib/mockData';
import AiModelBadge from './AiModelBadge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type AttachmentType = {
  name: string;
  type: string;
  url: string;
}

interface ChatInputProps {
  onSend: (message: string, attachments: AttachmentType[]) => void;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ChatInput({ onSend, currentModel, onModelChange }: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<AttachmentType[]>([]); // { name, type, url }
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    const msg = text.trim();
    onSend(msg, attachments);
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files ?? []);
    const newAttachments: AttachmentType[] = files.map(f => ({
      name: f.name,
      type: f.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(f),
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAttachments(prev => [...prev, { name: `Аудио ${new Date().toLocaleTimeString('ru')}`, type: 'audio', url }]);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch {
      toast.error('Нет доступа к микрофону');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current ?? undefined);
    setRecording(false);
  };

  useEffect(() => () => clearInterval(timerRef.current ?? undefined), []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="p-3 md:p-4 border-t border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/70 border border-border/50 text-xs max-w-[180px]">
                {a.type === 'image' ? <Image className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  : a.type === 'audio' ? <Mic className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  : <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                }
                <span className="truncate text-muted-foreground">{a.name}</span>
                <button onClick={() => removeAttachment(i)} className="flex-shrink-0 hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl bg-secondary/50 border border-border/50 p-2 focus-within:border-primary/40 transition-colors">
          {/* Model selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0">
                <AiModelBadge modelId={currentModel} size="sm" showName={false} />
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover border-border">
              {Object.values(AI_MODELS).map(model => (
                <DropdownMenuItem key={model.id} onClick={() => onModelChange(model.id)} className="gap-2">
                  <AiModelBadge modelId={model.id} size="sm" />
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {model.energyCost[0]}-{model.energyCost[1]} ⚡
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Textarea */}
          {recording ? (
            <div className="flex-1 flex items-center gap-2 py-1.5 px-1">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse flex-shrink-0" />
              <span className="text-sm text-destructive font-mono">{fmt(recordSeconds)}</span>
              <span className="text-xs text-muted-foreground">Запись...</span>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground/50 py-1.5 max-h-32"
              style={{ minHeight: '36px' }}
            />
          )}

          {/* Attach file */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0 text-muted-foreground hover:text-foreground"
            title="Прикрепить файл"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

          {/* Voice */}
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              recording ? 'bg-destructive/10 text-destructive' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
            title={recording ? 'Остановить запись' : 'Голосовое сообщение'}
          >
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() && attachments.length === 0}
            className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-center mt-1.5">
          <span className="text-[10px] text-muted-foreground/40">
            {AI_MODELS[currentModel]?.energyCost[0]}-{AI_MODELS[currentModel]?.energyCost[1]} ⚡ за сообщение
          </span>
        </div>
      </div>
    </div>
  );
}