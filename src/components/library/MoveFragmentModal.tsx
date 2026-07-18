import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { getEmoji } from '@/entities/shared/Constants';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import type { Fragment } from '@/entities/fragments/Fragment';
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';

interface MoveFragmentModalProps {
  frag: Fragment;
  fromClusterId: string;
  clusters: FragmentFolder[];
  onClose: () => void;
}

export default function MoveFragmentModal({ frag, fromClusterId, clusters, onClose }: MoveFragmentModalProps) {
  const { moveFragment } = useStore();

  const otherClusters = clusters.filter(c => c.id !== fromClusterId);

  const handleMove = (toClusterId: string) => {
    moveFragment(fromClusterId, frag.id, toClusterId);
    toast.success('Фрагмент перемещён');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Переместить фрагмент</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">«{frag.name}» → выберите папку назначения:</p>
        {otherClusters.length === 0 ? (
          <p className="text-sm text-muted-foreground/50 text-center py-4">Нет других папок</p>
        ) : (
          <div className="space-y-2">
            {otherClusters.map(cluster => (
              <button
                key={cluster.id}
                onClick={() => handleMove(cluster.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
              >
                <span className="text-lg">{getEmoji(cluster.emojiId)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{cluster.name}</p>
                  <p className="text-[10px] text-muted-foreground">{cluster.fragments.length} фрагментов</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full mt-2" onClick={onClose}>Отмена</Button>
      </DialogContent>
    </Dialog>
  );
}