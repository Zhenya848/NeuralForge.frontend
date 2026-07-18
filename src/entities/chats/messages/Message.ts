export interface Message {
  id: string;
  chatId: string;
  serialNumber: number;
  value: string;
  createdAt: string;
  isBookmarked: boolean;
  model?: string;
}