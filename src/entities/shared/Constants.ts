import type { Message } from "../chats/messages/Message";

export const EMOJIS = [
  '📁', '🗂️', '📂', '🏗️', '⚛️', '📈', '🚀', '💡', '🔬', '🎯', '📝', '💼',
  '🔧', '🎨', '📊', '🌐', '🤖', '💎', '🔑', '⭐', '🌟', '💫', '🎓', '📚',
  '🧠', '💻', '🖥️', '📱', '🔐', '🛡️', '⚡', '🔥', '💧', '🌿', '🎵', '🎬',
  '🏆', '🎪', '🌈', '🦋', '🐉', '🦄', '🌸', '🍀', '🔮', '🎲', '🗺️', '🧩',
] as const;

export const FOLDER_ICONS = [
  '📁','📂','🗂️','💼','📚','📖','📝','🗒️','🗃️','🗄️',
  '💻','🖥️','⚙️','🔧','🔨','🛠️','🚀','⚡','🔥','✨',
  '🎨','🎯','🏗️','🧩','🔬','🧪','📐','📊','📈','📉',
  '🤖','🧠','💡','🔑','🏆','⭐','❤️','💜','💙','💚',
  '🌐','🌍','🌙','☀️','🎵','🎬','📷','🎮','💰','🏠',
];

export const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#14b8a6', '#6366f1',
] as const;

interface DefaultNamesProps {
  projectName: string;
  folderName: string;
  chatName: string;
}

export const SYSTEM_PROJECT_ID = 'system-project';
export const SYSTEM_CHAT_FOLDER_ID = 'system-chat-folder';
export const SYSTEM_FRAGMENT_FOLDER_ID = 'system-fragment-folder';

export const DEFAULT_NAMES: DefaultNamesProps = 
{
  projectName: "Default project",
  folderName: "Default folder",
  chatName: "Default chat"
}

export interface AiModelInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  energyCost: [number, number];
}

export const AI_MODELS: Record<string, AiModelInfo> = {
  chatgpt: { id: 'chatgpt', name: 'ChatGPT', color: 'hsl(160 60% 45%)', icon: '🟢', energyCost: [2, 5] },
  claude:  { id: 'claude',  name: 'Claude',  color: 'hsl(25 90% 55%)', icon: '🟠', energyCost: [3, 6] },
  gemini:  { id: 'gemini',  name: 'Gemini',  color: 'hsl(210 80% 55%)', icon: '🔵', energyCost: [2, 4] },
  llama:   { id: 'llama',   name: 'Llama',   color: 'hsl(280 60% 55%)', icon: '🟣', energyCost: [1, 3] },
  mistral: { id: 'mistral', name: 'Mistral', color: 'hsl(340 75% 55%)', icon: '🔴', energyCost: [2, 4] },
};

export function getMessageRole(msg: Message): 'user' | 'assistant' {
  return msg.serialNumber % 2 === 1 ? 'user' : 'assistant';
}

export const getEmoji = (emojiId: number): string => EMOJIS[emojiId] ?? EMOJIS[0];
export const getFolderIcon = (iconId: number): string => FOLDER_ICONS[iconId] ?? FOLDER_ICONS[0]
export const getColor = (colorId: number): string => COLORS[colorId] ?? COLORS[0];