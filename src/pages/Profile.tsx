import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Zap, CreditCard, Bell, Shield, LogOut, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

type NotificationType = {
  email: boolean;
  energy: boolean;
  updates: boolean;
};

const notificationItems = [
  {
    key: 'email',
    label: 'Email-уведомления',
    desc: 'Еженедельная сводка активности',
  },
  {
    key: 'energy',
    label: 'Энергия заканчивается',
    desc: 'Оповещение при остатке < 10%',
  },
  {
    key: 'updates',
    label: 'Новые функции',
    desc: 'Анонсы обновлений продукта',
  },
] as const;

export default function Profile() {
  const navigate = useNavigate();
  const { energy } = useStore();

  const [name, setName] = useState('Иван Петров');
  const [email, setEmail] = useState('ivan@example.com');
  const [editingName, setEditingName] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType>({ email: true, energy: true, updates: false });

  const handleSaveName = () => {
    setEditingName(false);
    toast.success('Имя обновлено');
  };

  const energyPercent = Math.round((energy.current / energy.max) * 100);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Профиль</h1>
          <p className="text-muted-foreground text-sm">Управляйте своими данными и настройками</p>
        </motion.div>

        {/* Avatar + name */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl bg-card border border-border/50 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                />
                <Button size="sm" className="h-8 px-3" onClick={handleSaveName}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)} className="text-left group">
                <h2 className="font-semibold text-base group-hover:text-primary transition-colors">{name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Нажмите, чтобы изменить</p>
              </button>
            )}
          </div>
        </motion.div>

        {/* Account info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Аккаунт</h3>
          </div>
          <div className="divide-y divide-border/30">
            <div className="flex items-center gap-4 px-5 py-4">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4">
              <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Тариф</p>
                <p className="text-sm font-medium">{energy.plan}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2" onClick={() => navigate('/pricing')}>
                Изменить <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Energy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Энергия</h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{energy.current.toLocaleString()} / {energy.max.toLocaleString()}</span>
              </div>
              <span className="text-xs text-muted-foreground">{energyPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${energyPercent}%`,
                  backgroundColor: energyPercent > 30 ? 'hsl(var(--accent))' : energyPercent > 10 ? 'hsl(35 90% 55%)' : 'hsl(var(--destructive))'
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Обновляется каждое 1-е число месяца</p>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Уведомления</h3>
          </div>
          <div className="divide-y divide-border/30">
            {notificationItems.map(item => (
              <div key={item.key} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${notifications[item.key] ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Безопасность</h3>
          </div>
          <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors text-left">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Изменить пароль</p>
              <p className="text-xs text-muted-foreground">Последнее обновление: 3 мес. назад</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Выйти из аккаунта
          </Button>
        </motion.div>
      </div>
    </div>
  );
}