import { useState } from 'react';
import {
  ChevronRight, ChevronDown, Pencil, Trash2, Plus,
  Check, X, Eye, ArrowRight, ExternalLink, MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getEmoji, getColor } from '@/entities/shared/Constants';
import AiModelBadge from '@/components/chat/AiModelBadge';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';
import type { Project } from '@/entities/projects/Project';
import type { Fragment } from '@/entities/fragments/Fragment';

interface LibraryFolderProps {
  cluster: FragmentFolder;
  allClusters: FragmentFolder[];
  depth: number;
  onViewFrag: (folder: Fragment) => void;
  onMoveFrag: ({ frag, clusterId }: { frag: Fragment; clusterId: string; }) => void;
  onGoToSource: (folder: Fragment) => void;
  editingFragId: string;
  editingFragTitle: string;
  setEditingFragId: (id: string | null) => void;
  setEditingFragTitle: (id: string | null) => void;
  confirmRenameFrag: (clusterId: string, fragId: string) => void;
  projectFilterId: string;
  projects: Project[];
}

export default function LibraryFolder({
  cluster, allClusters, depth = 0,
  onViewFrag, onMoveFrag, onGoToSource,
  editingFragId, editingFragTitle, setEditingFragId, setEditingFragTitle, confirmRenameFrag,
  projectFilterId = 'all', projects = [],
}: LibraryFolderProps) {
  const { renameCluster, deleteCluster, deleteFragment, renameFragment, createCluster, updateClusterIcon } = useStore();
  const [expanded, setExpanded] = useState(depth === 0);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(cluster.name);
  const [addingSubfolder, setAddingSubfolder] = useState(false);
  const [subName, setSubName] = useState('');
  const [subIcon, setSubIcon] = useState('📁');

  const children = allClusters.filter(c => c.parentId === cluster.id);

  const visibleFrags = cluster.fragments.filter(() =>
    projectFilterId === 'all' ? true
    : projectFilterId === 'none' ? !cluster.projectId
    : cluster.projectId === projectFilterId
  );
  const project = projects.find(p => p.id === cluster.projectId);

  const handleRename = () => {
    if (nameVal.trim()) { renameCluster(cluster.id, nameVal.trim()); toast.success('Переименовано'); }
    setEditingName(false);
  };

  const handleDelete = () => {
    if (window.confirm('Удалить папку и все фрагменты в ней?')) {
      deleteCluster(cluster.id);
      toast.success('Папка удалена');
    }
  };

  const handleCreateSub = () => {
    if (!subName.trim()) return;
    createCluster(subName.trim(), subIcon, '#8b5cf6', cluster.id, cluster.projectId);
    toast.success('Подпапка создана');
    setAddingSubfolder(false);
    setSubName('');
    setSubIcon('📁');
    setExpanded(true);
  };

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      {/* Folder header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer group transition-colors"
        onClick={() => setExpanded(p => !p)}
      >
        {expanded
          ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
        }
        <div onClick={e => e.stopPropagation()} className="flex-shrink-0">
          <EmojiPicker value={getEmoji(cluster.emojiId)} onChange={(emoji) => { updateClusterIcon(cluster.id, emoji); }} buttonClassName="text-lg hover:opacity-70 transition-opacity cursor-pointer" />
        </div>
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <Input
                value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingName(false); }}
                className="h-6 text-sm bg-secondary/50 border-border/50 w-36 py-0"
                autoFocus
              />
              <button onClick={handleRename} className="p-0.5 rounded hover:bg-secondary"><Check className="w-3 h-3 text-emerald-400" /></button>
              <button onClick={() => setEditingName(false)} className="p-0.5 rounded hover:bg-secondary"><X className="w-3 h-3 text-muted-foreground" /></button>
            </div>
          ) : (
            <span className="text-sm font-semibold truncate">{cluster.name}</span>
          )}
          <p className="text-[10px] text-muted-foreground/50">
            {visibleFrags.length} фр. · {children.length} подпапок
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <div className="hidden sm:flex items-center gap-1">
            <button onClick={() => { setAddingSubfolder(true); setExpanded(true); }} className="p-1 rounded hover:bg-secondary transition-colors" title="Новая подпапка">
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={() => { setEditingName(true); setNameVal(cluster.name); }} className="p-1 rounded hover:bg-secondary transition-colors" title="Переименовать">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={handleDelete} className="p-1 rounded hover:bg-destructive/10 transition-colors" title="Удалить">
              <Trash2 className="w-3.5 h-3.5 text-destructive/60" />
            </button>
          </div>
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-secondary"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border w-44">
                <DropdownMenuItem className="gap-2 text-xs" onClick={() => { setAddingSubfolder(true); setExpanded(true); }}>
                  <Plus className="w-3 h-3" /> Новая подпапка
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs" onClick={() => { setEditingName(true); setNameVal(cluster.name); }}>
                  <Pencil className="w-3 h-3" /> Переименовать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive" onClick={handleDelete}>
                  <Trash2 className="w-3 h-3" /> Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* New subfolder form */}
            {addingSubfolder && (
              <div className="ml-6 mb-2 flex items-center gap-2 px-2" onClick={e => e.stopPropagation()}>
                <EmojiPicker value={subIcon} onChange={setSubIcon} />
                <Input
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateSub(); if (e.key === 'Escape') setAddingSubfolder(false); }}
                  placeholder="Название подпапки..."
                  className="h-7 text-sm bg-secondary/50 border-border/50"
                  autoFocus
                />
                <button onClick={handleCreateSub} className="p-1 rounded hover:bg-secondary"><Check className="w-3.5 h-3.5 text-emerald-400" /></button>
                <button onClick={() => setAddingSubfolder(false)} className="p-1 rounded hover:bg-secondary"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
            )}

            {/* Child folders */}
            {children.map(child => (
              <LibraryFolder
                key={child.id}
                cluster={child}
                allClusters={allClusters}
                depth={depth + 1}
                onViewFrag={onViewFrag}
                onMoveFrag={onMoveFrag}
                onGoToSource={onGoToSource}
                editingFragId={editingFragId}
                editingFragTitle={editingFragTitle}
                setEditingFragId={setEditingFragId}
                setEditingFragTitle={setEditingFragTitle}
                confirmRenameFrag={confirmRenameFrag}
                projectFilterId={projectFilterId}
                projects={projects}
              />
            ))}

            {/* Fragments */}
            {visibleFrags.length === 0 && children.length === 0 && !addingSubfolder ? (
              <p className="text-[11px] text-muted-foreground/40 ml-6 px-2 py-2">Пусто</p>
            ) : (
              <div className="ml-6 divide-y divide-border/20">
                {visibleFrags.map(frag => (
                  <div key={frag.id} className="px-2 py-2.5 hover:bg-secondary/20 transition-colors group/frag">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          {editingFragId === frag.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={editingFragTitle}
                                onChange={e => setEditingFragTitle(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmRenameFrag(cluster.id, frag.id); if (e.key === 'Escape') setEditingFragId(null); }}
                                className="h-6 text-sm bg-secondary/50 border-border/50 w-36 py-0"
                                autoFocus
                                onClick={e => e.stopPropagation()}
                              />
                              <button onClick={() => confirmRenameFrag(cluster.id, frag.id)} className="p-0.5 rounded hover:bg-secondary"><Check className="w-3 h-3 text-emerald-400" /></button>
                              <button onClick={() => setEditingFragId(null)} className="p-0.5 rounded hover:bg-secondary"><X className="w-3 h-3 text-muted-foreground" /></button>
                            </div>
                          ) : (
                            <h4 className="text-xs font-medium">{frag.name}</h4>
                          )}
                          {frag.aiModel && <AiModelBadge modelId={frag.aiModel} size="xs" showName={false} />}
                          {project && (
                            <span
                              className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border"
                              style={{ color: getColor(project.colorId), borderColor: getColor(project.colorId) + '40', backgroundColor: getColor(project.colorId) + '15' }}
                              title={project.name}
                            >
                              {getEmoji(project.emojiId)} {project.name}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[11px] text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground/70"
                          onClick={() => onViewFrag(frag)}
                        >
                          {frag.content}
                        </p>

                      </div>
                      {/* Actions */}
                      <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover/frag:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => onViewFrag(frag)} className="p-1 rounded hover:bg-secondary"><Eye className="w-3 h-3 text-muted-foreground" /></button>
                        <button onClick={() => { setEditingFragId(frag.id); setEditingFragTitle(frag.name); }} className="p-1 rounded hover:bg-secondary"><Pencil className="w-3 h-3 text-muted-foreground" /></button>
                        <button onClick={() => onMoveFrag({ frag, clusterId: cluster.id })} className="p-1 rounded hover:bg-secondary"><ArrowRight className="w-3 h-3 text-accent" /></button>
                        <button onClick={() => onGoToSource(frag)} className="p-1 rounded hover:bg-secondary"><ExternalLink className="w-3 h-3 text-primary" /></button>
                        <button onClick={() => { deleteFragment(cluster.id, frag.id); toast.success('Удалено'); }} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive/60" /></button>
                      </div>
                      <div className="sm:hidden flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-secondary"><MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border w-40">
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onViewFrag(frag)}><Eye className="w-3 h-3" /> Просмотр</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => { setEditingFragId(frag.id); setEditingFragTitle(frag.name); }}><Pencil className="w-3 h-3" /> Переименовать</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onMoveFrag({ frag, clusterId: cluster.id })}><ArrowRight className="w-3 h-3" /> Переместить</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onGoToSource(frag)}><ExternalLink className="w-3 h-3" /> К источнику</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive" onClick={() => { deleteFragment(cluster.id, frag.id); toast.success('Удалено'); }}><Trash2 className="w-3 h-3" /> Удалить</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}