import type { Chat } from "../chats/Chat";
import type { Folder } from "./Folder";

export interface ChatFolder extends Folder {
  projectId: string;
  chats: Chat[];
}