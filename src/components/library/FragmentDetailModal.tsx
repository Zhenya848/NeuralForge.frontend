import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getEmoji, getColor } from '@/entities/shared/Constants';
import AiModelBadge from '@/components/chat/AiModelBadge';
import { useStore } from '@/lib/store';
import type { Fragment } from '@/entities/fragments/Fragment';

interface FragmentDetailModalProps {
  frag: Fragment;
  onClose: () => void;
  onGoToSource: (frag: Fragment) => void;
}

export default function FragmentDetailModal({ frag, onClose, onGoToSource }: FragmentDetailModalProps) {
  const { projects, clusters } = useStore();
  if (!frag) return null;

  const fragFolder = clusters.find(c => c.id === frag.folderId);
  const project = projects.find(p => p.id === fragFolder?.projectId);

  return (
    <Dialog open={!!frag} onOpenChange={() => onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {frag.name}
            {frag.aiModel && <AiModelBadge modelId={frag.aiModel} size="xs" />}
          </DialogTitle>
        </DialogHeader>

        {project && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
              style={{ color: getColor(project.colorId), borderColor: getColor(project.colorId) + '40', backgroundColor: getColor(project.colorId) + '15' }}
            >
              {getEmoji(project.emojiId)} {project.name}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{frag.content}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-2">

          <div className="flex gap-2">
            {frag.messageId && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-border/50"
                onClick={() => { onGoToSource(frag); onClose(); }}
              >
                <ExternalLink className="w-3 h-3" /> К источнику
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}