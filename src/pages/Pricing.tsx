import { useState } from 'react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS } from '@/shared/lib/mockData';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Тарифные планы</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Выберите свой <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">тариф</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Начните бесплатно. Масштабируйтесь когда будете готовы.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Месячно</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-12 h-6 rounded-full transition-colors relative ${annual ? 'bg-primary' : 'bg-secondary'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${annual ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Годовой <span className="text-xs text-primary font-medium">-20%</span>
            </span>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-6 md:p-8 border transition-all hover:scale-[1.02] ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary/10 to-card border-primary/30 shadow-lg shadow-primary/5'
                  : 'bg-card border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                  Популярный
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">
                    ${annual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-muted-foreground mb-1">/мес</span>}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-muted-foreground">{plan.energy.toLocaleString()} энергии/мес</span>
                </div>
              </div>

              <Button
                className={`w-full rounded-xl mb-6 gap-2 ${
                  plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
                onClick={() => toast.success(`Выбран тариф ${plan.name} (мок)`)}
              >
                Начать <ArrowRight className="w-4 h-4" />
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm text-muted-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}