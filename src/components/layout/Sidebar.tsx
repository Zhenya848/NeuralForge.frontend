import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare, Plus, Search, Zap, LayoutDashboard,
  ChevronDown, ChevronRight, X, CreditCard, Pencil, Trash2,
  FolderOpen, Layers
} from 'lucide-react';
import { useStore } from '@/shared/lib/store';
import EnergyBar from '@/components/chat/EnergyBar';
import { getEmoji, SYSTEM_CHAT_FOLDER_ID, SYSTEM_PROJECT_ID } from '@/entities/shared/Constants';
import AiModelBadge from '@/components/chat/AiModelBadge';
import FolderContextMenu from '@/components/layout/FolderContextMenu';
import FolderIconModal from '@/components/layout/FolderIconModal';
import ProjectSwitcher from '@/components/layout/ProjectSwitcher';
import AssignProjectModal from '@/components/layout/AssignProjectModal';
import FolderSelectorModal from '@/components/chat/FolderSelectorModal';
import type { Chat } from '@/entities/chats/Chat';
import type { Folder } from '@/entities/folders/Folder';
import type { ChatFolder } from '@/entities/folders/ChatFolder';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete: (chat: Chat) => void;
  onRename: (chat: Chat) => void;
  onAssignProject: (chat: Chat) => void;
  onMoveFolder: (chat: Chat) => void;
  depth: number;
}

interface FolderHandlers {
  onChatClick(chatId: string): void;
  onNewChat(folderId?: string | null): void;
  onNewFolder(parentId?: string | null): void;
  onRenameFolder(folder: Folder): void;
  onDeleteFolder(folder: Folder): void;
  onRenameChat(chat: Chat): void;
  onDeleteChat(chat: Chat): void;
  onChangeIcon(folder: Folder): void;
  onAssignProject(target: Chat | Folder, type: "chat" | "folder"): void;
  onMoveFolder(chat: Chat): void;
}

interface FolderNodeProps {
  folder: Folder;
  allFolders: Folder[];
  chats: Chat[];
  activeChatId: string | null;
  handlers: FolderHandlers;
  depth?: number;
}

interface SidebarProps {
  onOpenSearch: () => void;
  mobileOpen: boolean;
  onCloseMobile?: () => void;
}

type MenuPos = {
  x: number;
  y: number;
}

// ─── ChatItem ───────────────────────────────────────────────────────────────
function ChatItem({ chat, isActive, onClick, onDelete, onRename, onAssignProject, onMoveFolder, depth = 0 }: ChatItemProps) {
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <button
        onContextMenu={handleContextMenu}
        onClick={onClick}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        className={`w-full flex items-center gap-2 pr-2 py-1.5 rounded-xl text-left transition-colors group/chat ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
        }`}
      >
        <MessageSquare className="w-3 h-3 flex-shrink-0 text-muted-foreground/60" />
        <span className="text-xs truncate flex-1">{chat.name}</span>
        {chat.usedAiModels?.length > 0 && (
          <div className="flex -space-x-0.5 flex-shrink-0">
            {chat.usedAiModels.slice(0, 2).map(m => <AiModelBadge key={m} modelId={m} size="xs" showName={false} />)}
          </div>
        )}
      </button>
      {menuPos && (
        <FolderContextMenu
          x={menuPos.x} y={menuPos.y}
          onClose={() => setMenuPos(null)}
          items={[
            { label: 'В проект', icon: Layers, action: () => { setMenuPos(null); onAssignProject(chat); } },
            { label: 'В папку', icon: FolderOpen, action: () => { setMenuPos(null); onMoveFolder(chat); } },
            { label: 'Переименовать', icon: Pencil, action: () => { setMenuPos(null); onRename(chat); } },
            { label: 'Удалить чат', icon: Trash2, danger: true, action: () => { setMenuPos(null); onDelete(chat); } },
          ]}
        />
      )}
    </>
  );
}

// ─── FolderNode ─────────────────────────────────────────────────────────────
function FolderNode({ folder, allFolders, chats, activeChatId, handlers, depth = 0 }: FolderNodeProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);

  const children = allFolders.filter(f => f.parentId === folder.id);
  const folderChats = chats.filter(c => c.folderId === folder.id);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <button
          onClick={() => setCollapsed(p => !p)}
          style={{ paddingLeft: `${depth * 14}px` }}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-left group/folder"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            : <ChevronDown className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
          }
          <span className="text-sm">{getEmoji(folder.emojiId)}</span>
          <span className="text-[11px] font-semibold text-muted-foreground truncate flex-1">{folder.name}</span>
          <span className="text-[9px] text-muted-foreground/40 ml-1 flex-shrink-0">
            {folderChats.length + children.length}
          </span>
        </button>

        {!collapsed && (
          <div>
            {children.map(child => (
              <FolderNode
                key={child.id}
                folder={child}
                allFolders={allFolders}
                chats={chats}
                activeChatId={activeChatId}
                handlers={handlers}
                depth={depth + 1}
              />
            ))}
            {folderChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChatId === chat.id}
                onClick={() => handlers.onChatClick(chat.id)}
                onRename={(c) => handlers.onRenameChat(c)}
                onDelete={(c) => handlers.onDeleteChat(c)}
                onAssignProject={(c) => handlers.onAssignProject(c, 'chat')}
                onMoveFolder={(c) => handlers.onMoveFolder(c)}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>

      {menuPos && (
        <FolderContextMenu
          x={menuPos.x} y={menuPos.y}
          onClose={() => setMenuPos(null)}
          items={[
            { label: 'Новый чат здесь', icon: MessageSquare, action: () => { setMenuPos(null); handlers.onNewChat(folder.id); } },
            { label: 'Новая подпапка', icon: FolderOpen, action: () => { setMenuPos(null); handlers.onNewFolder(folder.id); } },
            { divider: true },
            { label: 'В проект', icon: Layers, action: () => { setMenuPos(null); handlers.onAssignProject(folder, 'folder'); } },
            { label: 'Переименовать', icon: Pencil, action: () => { setMenuPos(null); handlers.onRenameFolder(folder); } },
            { label: 'Изменить иконку', icon: undefined, emoji: '🎨', action: () => { setMenuPos(null); handlers.onChangeIcon(folder); } },
            { label: 'Удалить папку', icon: Trash2, danger: true, action: () => { setMenuPos(null); handlers.onDeleteFolder(folder); } },
          ]}
        />
      )}
    </>
  );
}

//target: Chat | Folder, type: "chat" | "folder"

type AssignModalType = {
  type: "chat" | "folder";
  id: string;
  projectId: string;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export default function Sidebar({ onOpenSearch, mobileOpen, onCloseMobile }: SidebarProps) {
  const {
    chats, folders, activeChatId, activeProjectId,
    setActiveChat, createChat, createFolder,
    renameFolder, deleteFolder, deleteChat, renameChat,
    updateFolderIcon, setChatFolder,
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [iconModal, setIconModal] = useState<Folder | null>(null); // folder to edit icon
  const [bgMenuPos, setBgMenuPos] = useState<MenuPos | null>(null); // right-click on blank area
  const [assignModal, setAssignModal] = useState<AssignModalType | null>(null); // { type, id, projectId }
  const [moveChatId, setMoveChatId] = useState<string | null>(null); // chat to move between folders

  // Project assigned to newly created chats/folders
  const newProjectId = (activeProjectId !== 'all' && activeProjectId !== 'none') ? activeProjectId : null;

  const handleNewChat = (folderId = null) => {
    const id = createChat('Новый чат', 'chatgpt', [], folderId);
    navigate(`/chat/${id}`);
    onCloseMobile?.();
  };

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
    onCloseMobile?.();
  };

  const handleNewFolder = (parentId = null) => {
    const name = prompt('Название папки:');
    if (name?.trim()) createFolder(name.trim(), parentId, undefined, newProjectId);
  };

  const handleRenameFolder = (folder: Folder) => {
    const name = prompt('Новое название:', folder.name);
    if (name?.trim()) renameFolder(folder.id, name.trim());
  };

  const handleDeleteFolder = (folder: Folder) => {
    if (window.confirm(`Удалить «${folder.name}»? Вложенные папки и чаты перейдут на уровень выше.`)) {
      deleteFolder(folder.id);
    }
  };

  const handleRenameChat = (chat: Chat) => {
    const name = prompt('Новое название:', chat.name);
    if (name?.trim()) renameChat(chat.id, name.trim());
  };

  const handleDeleteChat = (chat: Chat) => {
    if (window.confirm(`Удалить чат «${chat.name}»?`)) {
      deleteChat(chat.id);
      if (activeChatId === chat.id) navigate('/');
    }
  };

  const handleAssignProject = (target: Chat | ChatFolder, type: "chat" | "folder") => {
    const projectId =
    type === "chat"
      ? folders.find(f => f.id === (target as Chat).folderId)!.projectId
      : (target as ChatFolder).projectId;

    setAssignModal({ type, id: target.id, projectId: projectId });
  };

  const handlers = {
    onChatClick: handleChatClick,
    onNewChat: handleNewChat,
    onNewFolder: handleNewFolder,
    onRenameFolder: handleRenameFolder,
    onDeleteFolder: handleDeleteFolder,
    onRenameChat: handleRenameChat,
    onDeleteChat: handleDeleteChat,
    onChangeIcon: (folder: Folder) => setIconModal(folder),
    onAssignProject: handleAssignProject,
    onMoveFolder: (chat: Chat) => setMoveChatId(chat.id),
  };

  const handleBgContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || e.currentTarget.contains(e.target as Node)) {
      e.preventDefault();
      setBgMenuPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Filter tree by active project
  const projectFilter = (item: ChatFolder) => {
    if (activeProjectId === 'all') return true;
    if (activeProjectId === 'none') return item.projectId === SYSTEM_PROJECT_ID;
    return item.projectId === activeProjectId;
  };

  const rootFolders = folders.filter(f => f.parentId === null && !f.isSystem).filter(projectFilter);
  const unfoldered = (activeProjectId === 'all' || activeProjectId === 'none')
    ? chats.filter(c => c.folderId === SYSTEM_CHAT_FOLDER_ID)
    : [];

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Главная' },
    { path: '/library', icon: FolderOpen, label: 'Библиотека' },
    { path: '/pricing', icon: CreditCard, label: 'Тарифы' },
  ];

  const content = (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0">
        <Link to="/" className="flex items-center gap-2" onClick={onCloseMobile}>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground tracking-tight">NeuralHub</span>
        </Link>
        <button onClick={onCloseMobile} className="md:hidden p-1 rounded-lg hover:bg-secondary">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Project switcher */}
      <div className="px-3 mb-2 flex-shrink-0">
        <ProjectSwitcher />
      </div>

      {/* Search */}
      <div className="px-3 mb-2 flex-shrink-0">
        <button
          onClick={() => { onOpenSearch(); onCloseMobile?.(); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors text-left"
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Поиск...</span>
          <kbd className="hidden sm:inline ml-auto text-[10px] text-muted-foreground/50 bg-muted/50 px-1 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <div className="px-3 mb-3 space-y-0.5 flex-shrink-0">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* New chat button */}
      <div className="px-3 mb-3 flex-shrink-0">
        <button
          onClick={() => handleNewChat()}
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl h-9 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Новый чат
        </button>
      </div>

      {/* Folders tree — right-click on empty space */}
      <div
        className="flex-1 overflow-y-auto px-3 pb-2 min-h-0"
        onContextMenu={handleBgContextMenu}
      >
        {rootFolders.map(folder => (
          <FolderNode
            key={folder.id}
            folder={folder}
            allFolders={folders}
            chats={chats}
            activeChatId={activeChatId}
            handlers={handlers}
          />
        ))}

        {unfoldered.length > 0 && (
          <div className="mt-2">
            <div className="px-2 py-1">
              <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">Без папки</span>
            </div>
            {unfoldered.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChatId === chat.id}
                onClick={() => handleChatClick(chat.id)}
                onRename={handleRenameChat}
                onDelete={handleDeleteChat}
                onAssignProject={(c) => handleAssignProject(c, 'chat')}
                onMoveFolder={(c) => setMoveChatId(c.id)}
                depth={0}
              />
            ))}
          </div>
        )}

        {/* Empty state hint */}
        {rootFolders.length === 0 && (
          <p className="text-[11px] text-muted-foreground/40 text-center mt-6 px-2">
            {activeProjectId === 'all' || activeProjectId === 'none'
              ? 'Правый клик чтобы создать папку или чат'
              : 'В этом проекте пока пусто — создайте чат или перенесите сюда'}
          </p>
        )}
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border space-y-2 flex-shrink-0">
        <EnergyBar />
        <Link
          to="/profile"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors w-full ${
            location.pathname === '/profile'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">И</div>
          <span className="text-sm">Мой профиль</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 h-screen flex-col border-r border-sidebar-border flex-shrink-0">
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 z-10">{content}</aside>
        </div>
      )}

      {/* Background context menu */}
      {bgMenuPos && (
        <FolderContextMenu
          x={bgMenuPos.x} y={bgMenuPos.y}
          onClose={() => setBgMenuPos(null)}
          items={[
            { label: 'Новый чат', icon: MessageSquare, action: () => { setBgMenuPos(null); handleNewChat(); } },
            { label: 'Новая папка', icon: FolderOpen, action: () => { setBgMenuPos(null); handleNewFolder(); } },
          ]}
        />
      )}

      {/* Icon picker modal */}
      {iconModal && (
        <FolderIconModal
          folder={iconModal}
          onSave={(icon) => { updateFolderIcon(iconModal.id, icon); setIconModal(null); }}
          onClose={() => setIconModal(null)}
        />
      )}

      {/* Assign to project modal */}
      {assignModal && (
        <AssignProjectModal
          open
          onClose={() => setAssignModal(null)}
          targetType={assignModal.type}
          targetId={assignModal.id}
          currentProjectId={assignModal.projectId}
        />
      )}

      {/* Move chat to folder modal */}
      {moveChatId && (
        <FolderSelectorModal
          open
          chatId={moveChatId}
          onClose={() => setMoveChatId(null)}
        />
      )}
    </>
  );
}