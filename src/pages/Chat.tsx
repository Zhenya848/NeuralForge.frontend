import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit3, Check, X, AlignJustify,
  Link2, Download, ArrowRightLeft, ChevronDown, Trash2, Folder } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/shared/lib/store';
import { AI_MODELS } from '@/shared/lib/mockData';
import AiModelBadge from '@/components/chat/AiModelBadge';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import BookmarksSidebar from '@/components/chat/BookmarksSidebar';
import SaveFragmentModal from '@/components/chat/SaveFragmentModal';
import NewChatFromSelectionModal from '@/components/chat/NewChatFromSelectionModal';
import ImportContextModal from '@/components/chat/ImportContextModal';
import FolderSelectorModal from '@/components/chat/FolderSelectorModal';
import ChatLinksModal from '@/components/chat/ChatLinksModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator } from
'@/components/ui/dropdown-menu';
import type { Message } from '@/entities/chats/messages/Message';

type SaveModalType = {
  open: boolean;
  text: string;
  message: Message | null;
}

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, setActiveChat, renameChat, deleteChat, toggleBookmark, sendMessage, createChat } = useStore();
  const chat = chats.find((c) => c.id === chatId);

  const [currentModel, setCurrentModel] = useState(chat?.usedAiModels?.[0] || 'chatgpt');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const [saveModal, setSaveModal] = useState<SaveModalType>({ open: false, text: '', message: null });
  const [newChatModal, setNewChatModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [folderModal, setFolderModal] = useState(false);
  const [linksModal, setLinksModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) setActiveChat(chatId);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages?.length]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Чат не найден</p>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </div>
      </div>
    );
  }

  const handleSend = (text: string) => sendMessage(chatId ?? "", text, currentModel);

  const handleSaveFragment = (text: string, message: Message) => setSaveModal({ open: true, text, message });

  const handleDiscussInChat = (text: string) => {
    sendMessage(chatId ?? "", `Давай обсудим это подробнее:\n\n"${text}"`, currentModel);
  };

  const handleDiscussInNewChat = (text: string) => {
    const id = createChat(`Обсуждение: ${text.slice(0, 30)}...`, currentModel, [
      { id: `msg-${Date.now()}`, chatId: '', serialNumber: 1, value: `Давай обсудим это подробнее:\n\n"${text}"`, createdAt: new Date().toISOString(), isBookmarked: false },
      { id: `msg-${Date.now() + 1}`, chatId: '', serialNumber: 2, model: currentModel, value: `Конечно! Это интересный фрагмент. Давайте разберём его подробнее...\n\nМок-ответ от ${AI_MODELS[currentModel]?.name}.`, createdAt: new Date(Date.now() + 1000).toISOString(), isBookmarked: false }
    ]);
    navigate(`/chat/${id}`);
  };

  const scrollToMessage = (msgId: string) => {
    setHighlightId(msgId);
    const el = document.getElementById(`message-${msgId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightId(null), 2000);
  };

  const handleRename = () => {
    if (editTitle.trim() && chatId) renameChat(chatId, editTitle.trim());
    setEditing(false);
  };

  return (
    <div className="flex h-full overflow-hidden w-full max-w-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border/50 bg-card/50 backdrop-blur-xl min-w-0">
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  className="h-7 text-sm bg-secondary/50 border-border/50 min-w-0 w-full max-w-[180px] sm:max-w-xs"
                  autoFocus
                />
                <button onClick={handleRename} className="p-1 rounded hover:bg-secondary flex-shrink-0"><Check className="w-3.5 h-3.5 text-emerald-400" /></button>
                <button onClick={() => setEditing(false)} className="p-1 rounded hover:bg-secondary flex-shrink-0"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
            ) : (
              <button onClick={() => { setEditing(true); setEditTitle(chat.name); }} className="flex items-center gap-1.5 hover:bg-secondary/50 px-2 py-1 rounded-lg transition-colors max-w-full">
                <h2 className="text-sm font-semibold truncate">{chat.name}</h2>
                <Edit3 className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
              </button>
            )}
          </div>

          {chat.usedAiModels?.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              {chat.usedAiModels.map(m => <AiModelBadge key={m} modelId={m} size="xs" showName={false} />)}
            </div>
          )}



          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors flex-shrink-0">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border w-52">
              <DropdownMenuItem onClick={() => setNewChatModal(true)} className="gap-2 text-xs">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Перенести в новый чат
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportModal(true)} className="gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Импорт контекста
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFolderModal(true)} className="gap-2 text-xs">
                <Folder className="w-3.5 h-3.5" /> Переместить в папку
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLinksModal(true)} className="gap-2 text-xs">
                <Link2 className="w-3.5 h-3.5" /> Связи с чатами
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { if (window.confirm('Удалить этот чат?')) { deleteChat(chatId ?? ""); navigate('/'); } }}
                className="gap-2 text-xs text-destructive focus:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" /> Удалить чат
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${sidebarOpen ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="max-w-3xl mx-auto py-4 pb-6 w-full">
            {chat.messages.map((msg) =>
              <ChatMessage
                key={msg.id}
                message={msg}
                isBookmarked={msg.isBookmarked}
                onToggleBookmark={(msgId: string) => toggleBookmark(chatId ?? "", msgId)}
                onSaveFragment={handleSaveFragment}
                onDiscussInChat={handleDiscussInChat}
                onDiscussInNewChat={handleDiscussInNewChat}
                highlightId={highlightId ?? ""} />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput onSend={handleSend} currentModel={currentModel} onModelChange={setCurrentModel} />
      </div>

      {/* Right sidebar (bookmarks) */}
      {sidebarOpen && <>
        <div className="hidden sm:block w-56 lg:w-64 flex-shrink-0">
          <BookmarksSidebar chatId={chatId ?? ""} onScrollToMessage={scrollToMessage} onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="sm:hidden fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="w-72 bg-card border-l border-border h-full overflow-y-auto">
            <BookmarksSidebar chatId={chatId ?? ""} onScrollToMessage={(id: string) => { scrollToMessage(id); setSidebarOpen(false); }} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </>}

      {/* Modals */}
      {saveModal.message && <SaveFragmentModal
        open={saveModal.open}
        onClose={() => setSaveModal({ open: false, text: '', message: null })}
        text={saveModal.text}
        sourceMessage={saveModal.message}
        sourceChatId={chatId ?? ""} />}

      <NewChatFromSelectionModal
        open={newChatModal}
        onClose={() => setNewChatModal(false)}
        chat={chat} />

      <ImportContextModal
        open={importModal}
        onClose={() => setImportModal(false)} />

      <FolderSelectorModal
        open={folderModal}
        onClose={() => setFolderModal(false)}
        chatId={chatId ?? ""} />

      <ChatLinksModal
        open={linksModal}
        onClose={() => setLinksModal(false)}
        chatId={chatId ?? ""} />
    </div>
  );
}