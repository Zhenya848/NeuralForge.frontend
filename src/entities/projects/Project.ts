import type { ChatFolder } from "../folders/ChatFolder";
import type { FragmentFolder } from "../folders/FragmentFolder";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  emojiId: number;
  colorId: number;
  fragmentFolders: FragmentFolder[];
  chatFolders: ChatFolder[];
  isSystem?: boolean;
}