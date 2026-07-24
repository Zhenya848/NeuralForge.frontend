import { useNavigate } from 'react-router-dom';
import { MessageSquare, FolderOpen, Zap, ArrowRight, Hash, Briefcase } from 'lucide-react';
import { useStore } from '@/shared/lib/store';
import { AI_MODELS } from '@/shared/lib/mockData';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { chats, clusters, projects, energy, createChat, setActiveChat } = useStore();

  const handleNewChat = (modelId: string) => {
    const id = createChat('Новый чат', modelId, []);
    navigate(`/chat/${id}`);
  };

  const totalFragments = clusters.reduce((sum, c) => sum + c.fragments.length, 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Рабочее пространство
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Системная работа с нейросетями — организуйте, сохраняйте, исследуйте.
          </p>
        </motion.div>

        {/* Quick start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Быстрый старт</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.values(AI_MODELS).map(model => (
              <button
                key={model.id}
                onClick={() => handleNewChat(model.id)}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: model.color + '15', border: `1.5px solid ${model.color}30` }}
                >
                  {model.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{model.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: 'Чатов', value: chats.length, icon: MessageSquare, color: 'text-primary' },
            { label: 'Фрагментов', value: totalFragments, icon: FolderOpen, color: 'text-yellow-500' },
            { label: 'Кластеров', value: clusters.filter(c => !c.isSystem).length, icon: Hash, color: 'text-accent' },
            { label: 'Проектов', value: projects.filter(p => !p.isSystem).length, icon: Briefcase, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border/50">
              <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Recent chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Недавние чаты</h2>
          </div>
          <div className="space-y-2">
            {chats.slice(0, 5).map(chat => (
              <button
                key={chat.id}
                onClick={() => { setActiveChat(chat.id); navigate(`/chat/${chat.id}`); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all text-left group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{chat.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {chat.messages.length} сообщений
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 hover:border-primary/30 transition-all text-left group"
          >
            <FolderOpen className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors" />
            <div>
              <h3 className="text-sm font-semibold">Библиотека</h3>
              <p className="text-xs text-muted-foreground">{totalFragments} фрагментов в {clusters.length} кластерах</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10 hover:border-accent/30 transition-all text-left group"
          >
            <Zap className="w-8 h-8 text-accent/60 group-hover:text-accent transition-colors" />
            <div>
              <h3 className="text-sm font-semibold">Тариф {energy.plan}</h3>
              <p className="text-xs text-muted-foreground">{energy.current.toLocaleString()} энергии осталось</p>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}