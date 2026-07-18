export interface Folder {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  emojiId: number;
}