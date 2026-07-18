import { useState, useEffect } from 'react';
import type { Fragment } from '@/entities/fragments/Fragment';
import type { Chat } from "@/entities/chats/Chat";
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';
import type { ChatFolder } from "@/entities/folders/ChatFolder";
import type { Project } from "@/entities/projects/Project";
import type { Message } from "@/entities/chats/messages/Message";
import { EMOJIS, COLORS, AI_MODELS, getMessageRole } from '@/entities/shared/Constants';
import {
  MOCK_PROJECTS, MOCK_CHAT_FOLDERS, MOCK_CHATS,
  MOCK_FRAGMENT_FOLDERS, MOCK_ENERGY,
} from './mockData';

export { getMessageRole };

// ─── Types ────────────────────────────────────────────────────────────────────

interface Energy {
  current: number;
  max: number;
  plan: string;
  costPerMessage: { min: number; max: number };
}

interface GlobalState {
  chats: Chat[];
  chatFolders: ChatFolder[];
  fragmentFolders: FragmentFolder[];
  projects: Project[];
  energy: Energy;
  activeChatId: string | null;
  activeProjectId: string;
  listeners: Set<() => void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emojiToId(emoji: string): number {
  const idx = EMOJIS.indexOf(emoji as typeof EMOJIS[number]);
  return idx >= 0 ? idx : 0;
}

function colorToId(color: string): number {
  const idx = COLORS.indexOf(color as typeof COLORS[number]);
  return idx >= 0 ? idx : 0;
}

function generateId(): string {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Global state ────────────────────────────────────────────────────────────

let globalState: GlobalState = {
  chats: MOCK_CHATS.map(c => ({ ...c, messages: [...c.messages] })),
  chatFolders: [...MOCK_CHAT_FOLDERS],
  fragmentFolders: MOCK_FRAGMENT_FOLDERS.map(f => ({ ...f, fragments: [...f.fragments] })),
  projects: [...MOCK_PROJECTS],
  energy: { ...MOCK_ENERGY },
  activeChatId: MOCK_CHATS[0]?.id ?? null,
  activeProjectId: 'all',
  listeners: new Set(),
};

function notify() {
  globalState.listeners.forEach(fn => fn());
}

export type ChatLinkType = {
    id: string;
    fromChatId: string;
    toChatId: string;
    label: string;
}

// ─── Store hook ──────────────────────────────────────────────────────────────

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    globalState.listeners.add(listener);
    return () => { globalState.listeners.delete(listener); };
  }, []);

  return {
    // ── State ──────────────────────────────────────────────────────────────
    chats: globalState.chats,
    chatFolders: globalState.chatFolders,
    folders: globalState.chatFolders, // alias
    fragmentFolders: globalState.fragmentFolders,
    clusters: globalState.fragmentFolders, // alias
    projects: globalState.projects,
    energy: globalState.energy,
    activeChatId: globalState.activeChatId,
    activeProjectId: globalState.activeProjectId,

    // Chat links computed from chat.connections (deduped — one entry per pair)
    chatLinks: globalState.chats.flatMap(c =>
      c.connections
        .filter(connId => c.id < connId)
        .map(connId => ({ id: `${c.id}-${connId}`, fromChatId: c.id, toChatId: connId, label: '' }))
    ) as ChatLinkType[],

    // ── Setters ───────────────────────────────────────────────────────────
    setActiveChat: (id: string) => { globalState.activeChatId = id; notify(); },
    setActiveProject: (id: string) => { globalState.activeProjectId = id; notify(); },

    // ── Projects ──────────────────────────────────────────────────────────
    createProject: (name: string, icon: string, color: string, description: string) => {
      const project: Project = {
        id: generateId(), userId: '', name, description,
        emojiId: emojiToId(icon), colorId: colorToId(color),
        chatFolders: [], fragmentFolders: [],
      };
      globalState.projects.push(project);
      notify();
      return project.id;
    },

    renameProject: (projectId: string, newName: string) => {
      const p = globalState.projects.find(p => p.id === projectId);
      if (p) { p.name = newName; notify(); }
    },

    updateProjectIcon: (projectId: string, icon: string) => {
      const p = globalState.projects.find(p => p.id === projectId);
      if (p) { p.emojiId = emojiToId(icon); notify(); }
    },

    updateProjectColor: (projectId: string, color: string) => {
      const p = globalState.projects.find(p => p.id === projectId);
      if (p) { p.colorId = colorToId(color); notify(); }
    },

    updateProjectInstructions: (projectId: string, description: string) => {
      const p = globalState.projects.find(p => p.id === projectId);
      if (p) { p.description = description; notify(); }
    },

    deleteProject: (projectId: string) => {
      globalState.projects = globalState.projects.filter(p => p.id !== projectId);
      globalState.chatFolders.forEach(f => { if (f.projectId === projectId) f.projectId = ''; });
      globalState.fragmentFolders.forEach(f => { if (f.projectId === projectId) f.projectId = ''; });
      if (globalState.activeProjectId === projectId) globalState.activeProjectId = 'all';
      notify();
    },

    // ── Chats ─────────────────────────────────────────────────────────────
    createChat: (name: string, defaultAiModel: string, initialMessages?: Message[], folderId?: string | null) => {
      const chat: Chat = {
        id: generateId(), userId: '', folderId: folderId ?? '',
        name, connections: [], messages: initialMessages ?? [],
        usedAiModels: initialMessages ? [...new Set(initialMessages.map(m => m.model).filter((model): model is string => model != null))] : [defaultAiModel]
      };
      globalState.chats.unshift(chat);
      globalState.activeChatId = chat.id;
      notify();
      return chat.id;
    },

    renameChat: (chatId: string, newName: string) => {
      const chat = globalState.chats.find(c => c.id === chatId);
      if (chat) { chat.name = newName; notify(); }
    },

    deleteChat: (chatId: string) => {
      globalState.chats = globalState.chats.filter(c => c.id !== chatId);
      if (globalState.activeChatId === chatId) globalState.activeChatId = null;
      notify();
    },

    setChatFolder: (chatId: string, folderId: string | null) => {
      const chat = globalState.chats.find(c => c.id === chatId);
      if (chat) { chat.folderId = folderId ?? ''; notify(); }
    },

    setChatProject: (chatId: string, projectId: string | null) => {
      // Backend derives project from folder; for mock, keep as no-op
      notify();
    },

    // ── Messages ──────────────────────────────────────────────────────────
    sendMessage: (chatId: string, prompt: string, model: string) => {
      const chat = globalState.chats.find(c => c.id === chatId);
      if (!chat) return;
      const nextSerial = chat.messages.length > 0 ? Math.max(...chat.messages.map(m => m.serialNumber)) + 1 : 1;

      chat.messages.push({
        id: generateId(), chatId, serialNumber: nextSerial,
        value: prompt, createdAt: new Date().toISOString(), isBookmarked: false,
      });
      chat.messages.push({
        id: generateId(), chatId, serialNumber: nextSerial + 1, model,
        value: `Это мок-ответ от ${AI_MODELS[model]?.name ?? model}. В реальном приложении здесь будет ответ нейросети на ваш запрос: "${prompt.slice(0, 80)}..."`,
        createdAt: new Date(Date.now() + 1000).toISOString(), isBookmarked: false,
      });
      if (!chat.usedAiModels) chat.usedAiModels = [];
      if (!chat.usedAiModels.includes(model)) chat.usedAiModels.push(model);

      globalState.energy.current = Math.max(0, globalState.energy.current - Math.floor(Math.random() * 4 + 2));
      notify();
    },

    toggleBookmark: (chatId: string, messageId: string) => {
      const chat = globalState.chats.find(c => c.id === chatId);
      if (!chat) return;
      const msg = chat.messages.find(m => m.id === messageId);
      if (msg) { msg.isBookmarked = !msg.isBookmarked; notify(); }
    },

    // ── Chat folders ──────────────────────────────────────────────────────
    createFolder: (name: string, parentId?: string | null, icon?: string, projectId?: string | null) => {
      const folder: ChatFolder = {
        id: generateId(), userId: '', parentId: parentId ?? null,
        name, emojiId: icon ? emojiToId(icon) : 0,
        projectId: projectId ?? '', chats: [],
      };
      globalState.chatFolders.push(folder);
      notify();
      return folder.id;
    },

    renameFolder: (folderId: string, newName: string) => {
      const f = globalState.chatFolders.find(f => f.id === folderId);
      if (f) { f.name = newName; notify(); }
    },

    updateFolderIcon: (folderId: string, icon: string) => {
      const f = globalState.chatFolders.find(f => f.id === folderId);
      if (f) { f.emojiId = emojiToId(icon); notify(); }
    },

    deleteFolder: (folderId: string) => {
      const folder = globalState.chatFolders.find(f => f.id === folderId);
      if (!folder) return;
      globalState.chatFolders.forEach(f => { if (f.parentId === folderId) f.parentId = folder.parentId; });
      globalState.chats.forEach(c => { if (c.folderId === folderId) c.folderId = folder.parentId ?? ''; });
      globalState.chatFolders = globalState.chatFolders.filter(f => f.id !== folderId);
      notify();
    },

    setFolderProject: (folderId: string, projectId: string | null) => {
      const f = globalState.chatFolders.find(f => f.id === folderId);
      if (f) { f.projectId = projectId ?? ''; notify(); }
    },

    // ── Chat connections (replaces chatLinks) ────────────────────────────
    addChatLink: (fromChatId: string, toChatId: string, _label?: string) => {
      const from = globalState.chats.find(c => c.id === fromChatId);
      const to = globalState.chats.find(c => c.id === toChatId);
      if (from && !from.connections.includes(toChatId)) from.connections.push(toChatId);
      if (to && !to.connections.includes(fromChatId)) to.connections.push(fromChatId);
      notify();
    },

    removeChatLink: (linkId: string) => {
      for (const chat of globalState.chats) {
        const connId = chat.connections.find(conn => `${chat.id}-${conn}` === linkId);
        if (connId) {
          chat.connections = chat.connections.filter(c => c !== connId);
          const toChat = globalState.chats.find(c => c.id === connId);
          if (toChat) toChat.connections = toChat.connections.filter(c => c !== chat.id);
          break;
        }
      }
      notify();
    },

    getChatLinks: (chatId: string) => {
      const chat = globalState.chats.find(c => c.id === chatId);
      if (!chat) return [];
      return chat.connections.map(connId => ({ id: `${chatId}-${connId}`, fromChatId: chatId, toChatId: connId, label: '' }));
    },

    // ── Fragment folders (clusters) ──────────────────────────────────────
    createCluster: (name: string, icon?: string, _color?: string, parentId?: string | null, projectId?: string | null) => {
      const folder: FragmentFolder = {
        id: generateId(), userId: '', parentId: parentId ?? null,
        name, emojiId: icon ? emojiToId(icon) : 0,
        projectId: projectId ?? '', fragments: [],
      };
      globalState.fragmentFolders.push(folder);
      notify();
      return folder.id;
    },

    renameCluster: (clusterId: string, newName: string) => {
      const f = globalState.fragmentFolders.find(f => f.id === clusterId);
      if (f) { f.name = newName; notify(); }
    },

    updateClusterIcon: (clusterId: string, icon: string) => {
      const f = globalState.fragmentFolders.find(f => f.id === clusterId);
      if (f) { f.emojiId = emojiToId(icon); notify(); }
    },

    deleteCluster: (clusterId: string) => {
      const toDelete = new Set([clusterId]);
      let changed = true;
      while (changed) {
        changed = false;
        globalState.fragmentFolders.forEach(f => {
          if (f.parentId && toDelete.has(f.parentId) && !toDelete.has(f.id)) {
            toDelete.add(f.id); changed = true;
          }
        });
      }
      globalState.fragmentFolders = globalState.fragmentFolders.filter(f => !toDelete.has(f.id));
      notify();
    },

    // ── Fragments ────────────────────────────────────────────────────────
    saveFragment: (fragment: { title?: string; name?: string; content: string; sourceModel?: string; sourceChatId?: string; sourceMessageId?: string }, clusterId?: string | null, projectId?: string | null) => {
      const newFragment: Fragment = {
        id: generateId(), userId: '', folderId: clusterId ?? '',
        name: fragment.name ?? fragment.title ?? 'Фрагмент',
        content: fragment.content, messageId: fragment.sourceMessageId ?? '',
        aiModel: fragment.sourceModel,
      };
      if (clusterId) {
        const cluster = globalState.fragmentFolders.find(f => f.id === clusterId);
        if (cluster) cluster.fragments.push(newFragment);
      } else {
        let uncategorized = globalState.fragmentFolders.find(f => f.id === 'uncategorized');
        if (!uncategorized) {
          uncategorized = { id: 'uncategorized', userId: '', parentId: null, name: 'Без категории', emojiId: 0, projectId: projectId ?? '', fragments: [] };
          globalState.fragmentFolders.push(uncategorized);
        }
        uncategorized.fragments.push(newFragment);
      }
      notify();
    },

    deleteFragment: (clusterId: string, fragmentId: string) => {
      const cluster = globalState.fragmentFolders.find(f => f.id === clusterId);
      if (cluster) {
        cluster.fragments = cluster.fragments.filter(f => f.id !== fragmentId);
        notify();
      }
    },

    renameFragment: (clusterId: string, fragmentId: string, newName: string) => {
      const cluster = globalState.fragmentFolders.find(f => f.id === clusterId);
      if (cluster) {
        const frag = cluster.fragments.find(f => f.id === fragmentId);
        if (frag) { frag.name = newName; notify(); }
      }
    },

    moveFragment: (fromClusterId: string, fragmentId: string, toClusterId: string) => {
      const fromCluster = globalState.fragmentFolders.find(f => f.id === fromClusterId);
      const toCluster = globalState.fragmentFolders.find(f => f.id === toClusterId);
      if (fromCluster && toCluster) {
        const frag = fromCluster.fragments.find(f => f.id === fragmentId);
        if (frag) {
          fromCluster.fragments = fromCluster.fragments.filter(f => f.id !== fragmentId);
          frag.folderId = toClusterId;
          toCluster.fragments.push(frag);
          notify();
        }
      }
    },
  };
}