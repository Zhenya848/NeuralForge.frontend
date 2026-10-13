import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Search, Plus, Check, X, Layers, Eye, ExternalLink, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/shared/lib/store';
import { getEmoji, getColor, SYSTEM_FRAGMENT_FOLDER_ID, SYSTEM_PROJECT_ID } from '@/entities/shared/Constants';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import FragmentDetailModal from '@/components/library/FragmentDetailModal';
import MoveFragmentModal from '@/components/library/MoveFragmentModal';
import EmojiPicker from '@/components/ui/EmojiPicker';
import LibraryFolder from '@/components/library/LibraryFolder';
import type { Fragment } from '@/entities/fragments/Fragment';
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';
import AiModelBadge from '@/components/chat/AiModelBadge';
import { useGetWithFragmentsQuery } from '@/features/projects/api';

type MoveFragType = {
  frag: Fragment;
  clusterId: string;
}

export default function Library() {
  const navigate = useNavigate();
  const { chats, clusters, projects, createCluster, renameFragment, setActiveChat } = useStore();

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [editingFragId, setEditingFragId] = useState<string | null>(null);
  const [editingFragTitle, setEditingFragTitle] = useState<string | null>('');
  const [viewFrag, setViewFrag] = useState<Fragment | null>(null);
  const [moveFrag, setMoveFrag] = useState<MoveFragType | null>(null);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIconId, setNewFolderIconId] = useState(0);

  const PAGE_SIZE = 20;
  const { data: projectsData } = useGetWithFragmentsQuery({ page: 1, pageSize: PAGE_SIZE, nameFilter: search });

  const folders = projectsData?.result?.items.flatMap(f => f.fragmentFolders) ?? [];
  const fragments = folders?.flatMap(f => f.fragments) ?? [];

  const systemProject = projects.find(p => p.isSystem)!;

  const handleNewFolder = () => {
    if (!newFolderName.trim()) { toast.error('Введите название'); return; }
    const folderProjectId = projectFilter === 'all' || projectFilter === 'none' ? null : projectFilter;
    createCluster(newFolderName.trim(), getEmoji(newFolderIconId), '#8b5cf6', null, folderProjectId);
    toast.success('Папка создана');
    setShowNewFolderForm(false);
    setNewFolderName('');
    setNewFolderIconId(0);
  };

  const goToSource = (fragment: Fragment) => {
    if (fragment.messageId) {
      const sourceChat = chats.find(c => c.messages.some(m => m.id === fragment.messageId));
      if (sourceChat) {
        setActiveChat(sourceChat.id);
        navigate(`/chat/${sourceChat.id}`);
        setTimeout(() => {
          const el = document.getElementById(`message-${fragment.messageId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  };

  const confirmRenameFrag = (clusterId: string, fragId: string) => {
    if (editingFragTitle && editingFragTitle.trim()) {
      renameFragment(clusterId, fragId, editingFragTitle.trim());
      toast.success('Фрагмент переименован');
    }
    setEditingFragId(null);
  };

  const projectMatch = (c: FragmentFolder) =>
    projectFilter === 'all' ? true
    : projectFilter === 'none' ? c.projectId  === systemProject.id
    : c.projectId === projectFilter;

  const filteredFolders = folders.filter(projectMatch);

  const visibleRoots = filteredFolders.filter(c => !c.parentId && !c.isSystem);

  const uncategorizedFrags = filteredFolders.filter(f => f.isSystem).flatMap(f => f.fragments);

  const totalFragments = clusters.reduce((s, c) => s + c.fragments.length, 0);

  const filteredFragmentsCount = clusters.reduce((s, c) =>
    s + c.fragments.filter(() =>
      projectFilter === 'all' ? true
      : projectFilter === 'none' ? !c.projectId
      : c.projectId === projectFilter
    ).length
  , 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              Библиотека
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {visibleRoots.length} папок · {totalFragments} фрагментов
            </p>
          </div>
          <Button onClick={() => setShowNewFolderForm(v => !v)} className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 gap-2 self-start">
            <Plus className="w-4 h-4" /> Новая папка
          </Button>
        </div>

        {/* New folder form */}
        <AnimatePresence>
          {showNewFolderForm && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 p-4 rounded-2xl bg-card border border-primary/20"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Новая папка</p>
              <div className="flex items-center gap-2 mb-3">
                <EmojiPicker value={getEmoji(newFolderIconId)} onChange={setNewFolderIconId} />
                <Input
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleNewFolder(); if (e.key === 'Escape') setShowNewFolderForm(false); }}
                  placeholder="Название папки..."
                  className="bg-secondary/50 border-border/50"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleNewFolder}>
                  <Check className="w-3.5 h-3.5 mr-1" /> Создать
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewFolderForm(false)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по фрагментам и папкам..."
            className="pl-10 bg-secondary/50 border-border/50 rounded-xl"
          />
        </div>

        {/* Project filter */}
        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          <Layers className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          <button
            onClick={() => setProjectFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${projectFilter === 'all' ? 'bg-primary/15 border border-primary/30 text-foreground' : 'bg-secondary/40 border border-transparent hover:bg-secondary/70 text-muted-foreground'}`}
          >
            Все ({totalFragments})
          </button>
          <button
            onClick={() => setProjectFilter('none')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${projectFilter === 'none' ? 'bg-primary/15 border border-primary/30 text-foreground' : 'bg-secondary/40 border border-transparent hover:bg-secondary/70 text-muted-foreground'}`}
          >
            📭 Без проекта
          </button>
          {projects.filter(p => !p.isSystem).map(p => {
            const count = clusters.reduce((s, c) => s + (c.projectId === p.id ? c.fragments.length : 0), 0);
            return (
              <button
                key={p.id}
                onClick={() => setProjectFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${projectFilter === p.id ? 'border' : 'bg-secondary/40 border border-transparent hover:bg-secondary/70 text-muted-foreground'}`}
                style={projectFilter === p.id ? { color: getColor(p.colorId), borderColor: getColor(p.colorId) + '40', backgroundColor: getColor(p.colorId) + '15' } : {}}
              >
                {getEmoji(p.emojiId)} {p.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Folder tree */}
        <div className="space-y-1 rounded-2xl bg-card border border-border/50 p-3">
          {visibleRoots.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground/50">
                {search ? 'Ничего не найдено' : 'Создайте папку, чтобы хранить фрагменты из чатов'}
              </p>
            </div>
          ) : (
            visibleRoots.map(folder => (
              <LibraryFolder
                key={folder.id}
                cluster={folder}
                allClusters={clusters}
                depth={0}
                onViewFrag={setViewFrag}
                onMoveFrag={setMoveFrag}
                onGoToSource={goToSource}
                editingFragId={editingFragId ?? ""}
                editingFragTitle={editingFragTitle ?? ""}
                setEditingFragId={setEditingFragId}
                setEditingFragTitle={setEditingFragTitle}
                confirmRenameFrag={confirmRenameFrag}
                projectFilterId={projectFilter}
                projects={projects}
              />
            ))
          )}

          {uncategorizedFrags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="px-2 py-1 mb-1">
                <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">📭 Без категории</span>
              </div>
              <div className="divide-y divide-border/20">
                {uncategorizedFrags.map(frag => (
                  <div key={frag.id} className="px-2 py-2.5 hover:bg-secondary/20 transition-colors group/frag">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs font-medium">{frag.name}</h4>
                          {frag.aiModel && <AiModelBadge modelId={frag.aiModel} size="xs" showName={false} />}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground/70" onClick={() => setViewFrag(frag)}>
                          {frag.content}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover/frag:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => setViewFrag(frag)} className="p-1 rounded hover:bg-secondary"><Eye className="w-3 h-3 text-muted-foreground" /></button>
                        <button onClick={() => setMoveFrag({ frag, clusterId: folders.find(f => f.isSystem)!.id })} className="p-1 rounded hover:bg-secondary"><ArrowRight className="w-3 h-3 text-accent" /></button>
                        <button onClick={() => goToSource(frag)} className="p-1 rounded hover:bg-secondary"><ExternalLink className="w-3 h-3 text-primary" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {viewFrag && <FragmentDetailModal frag={viewFrag} onClose={() => setViewFrag(null)} onGoToSource={goToSource} />}
      {moveFrag && (
        <MoveFragmentModal
          frag={moveFrag.frag}
          fromClusterId={moveFrag.clusterId}
          clusters={clusters}
          onClose={() => setMoveFrag(null)}
        />
      )}
    </div>
  );
}