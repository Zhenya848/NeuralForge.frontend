import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Вход выполнен (мок)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">NeuralHub</span>
        </div>

        <div className="rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-bold text-center mb-1">С возвращением</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Войдите в аккаунт</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-secondary/50 border-border/50 rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Пароль</Label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/50 border-border/50 rounded-xl h-11 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary hover:underline">Забыли пароль?</button>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 gap-2">
              Войти <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground uppercase">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary/80 transition-colors text-sm">
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Google
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Зарегистрироваться</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}