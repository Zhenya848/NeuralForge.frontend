import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImportContextModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportContextModal({ open, onClose }: ImportContextModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = () => {
    if (!url.trim()) return;
    setLoading(true);
    // Mock import
    setTimeout(() => {
      setLoading(false);
      toast.success('Контекст импортирован (мок)');
      setUrl('');
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Импорт контекста
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <p className="text-xs text-muted-foreground">
            Вставьте ссылку на чат из ChatGPT, Claude или другого сервиса для импорта контекста.
          </p>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://chat.openai.com/share/..."
              className="border-none bg-transparent p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
            />
          </div>

          <div className="flex gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50">🟢 ChatGPT</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50">🟠 Claude</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50">🔵 Gemini</div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Отмена</Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" disabled={!url.trim() || loading} onClick={handleImport}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Импортировать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}