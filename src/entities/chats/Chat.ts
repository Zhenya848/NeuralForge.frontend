import type { Message } from "./messages/Message";

export interface Chat {
    id: string;
    userId: string;
    folderId: string;
    name: string;
    connections: string[];
    usedAiModels: string[];
    messages: Message[];
}