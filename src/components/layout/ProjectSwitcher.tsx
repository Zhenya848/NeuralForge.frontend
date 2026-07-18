import { useState } from 'react';
import { ChevronDown, Plus, Settings2, Layers, CircleDot } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getEmoji } from '@/entities/shared/Constants';
import ProjectsModal from '@/components/layout/ProjectsModal';
import CreateProjectModal from '@/components/layout/CreateProjectModal';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

export default function ProjectSwitcher() {
  const { projects, activeProjectId, setActiveProject } = useStore();
  const [manageOpen, setManageOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const active = projects.find(p => p.id === activeProjectId);
  const label = active
    ? active.name
    : (activeProjectId === 'none' ? 'Без проекта' : 'Все проекты');
  const iconEl = active
    ? <span className="text-sm">{getEmoji(active.emojiId)}</span>
    : <Layers className="w-3.5 h-3.5" />;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors text-left">
            {iconEl}
            <span className="text-xs font-medium truncate flex-1">{label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover border-border w-56">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Проекты</DropdownMenuLabel>
          <DropdownMenuItem className="gap-2 text-xs" onClick={() => setActiveProject('all')}>
            <Layers className="w-3.5 h-3.5" /> Все проекты
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs" onClick={() => setActiveProject('none')}>
            <CircleDot className="w-3.5 h-3.5" /> Без проекта
          </DropdownMenuItem>
          {projects.length > 0 && <DropdownMenuSeparator />}
          {projects.map(p => (
            <DropdownMenuItem key={p.id} className="gap-2 text-xs" onClick={() => setActiveProject(p.id)}>
              <span>{getEmoji(p.emojiId)}</span> {p.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Новый проект
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs" onClick={() => setManageOpen(true)}>
            <Settings2 className="w-3.5 h-3.5" /> Управление проектами
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectsModal open={manageOpen} onClose={() => setManageOpen(false)} />
      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}