import type { Chat } from "@/entities/chats/Chat";
import type { FragmentFolder } from '@/entities/folders/FragmentFolder';
import type { ChatFolder } from "@/entities/folders/ChatFolder";
import type { Project } from "@/entities/projects/Project";
import { AI_MODELS } from '@/entities/shared/Constants';

// Re-export AI_MODELS for backward compatibility
export { AI_MODELS };

// GUID helper
const G = (n: number) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
export const MOCK_USER_ID = G(0);

// ─── Projects ────────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: Project[] = [
  { id: G(1), userId: G(0), name: 'NeuralHub App', description: 'Разработка основного продукта', emojiId: 6, colorId: 0, chatFolders: [], fragmentFolders: [] },
  { id: G(2), userId: G(0), name: 'Контент-маркетинг', description: 'Стратегия продвижения', emojiId: 10, colorId: 2, chatFolders: [], fragmentFolders: [] },
];

// ─── Chat folders ────────────────────────────────────────────────────────────

export const MOCK_CHAT_FOLDERS: ChatFolder[] = [
  { id: G(101), userId: G(0), parentId: null, name: 'Разработка', emojiId: 24, projectId: G(1), chats: [] },
  { id: G(102), userId: G(0), parentId: G(101), name: 'Frontend', emojiId: 14, projectId: G(1), chats: [] },
  { id: G(103), userId: G(0), parentId: G(101), name: 'Backend', emojiId: 12, projectId: G(1), chats: [] },
  { id: G(104), userId: G(0), parentId: G(101), name: 'DevOps', emojiId: 6, projectId: G(1), chats: [] },
  { id: G(105), userId: G(0), parentId: null, name: 'Маркетинг', emojiId: 10, projectId: G(2), chats: [] },
];

// ─── Chats (with embedded messages for mock store) ───────────────────────────

const M1 = 'Расскажи про основные паттерны проектирования микросервисной архитектуры. Какие есть подходы к декомпозиции монолита?';
const A1 = 'Основные паттерны проектирования микросервисной архитектуры:\n\n**1. API Gateway Pattern**\nЕдиная точка входа для всех клиентских запросов.\n\n**2. Service Mesh (Istio, Linkerd)**\nИнфраструктурный слой для управления коммуникацией между сервисами.\n\n**3. Event-Driven Architecture**\nСервисы взаимодействуют через события (Kafka, RabbitMQ).\n\n**4. CQRS**\nРазделение операций чтения и записи.\n\n**5. Saga Pattern**\nУправление распределёнными транзакциями.\n\n**Подходы к декомпозиции монолита:**\n- По бизнес-доменам (DDD)\n- Strangler Fig Pattern — постепенная замена модулей';
const M2 = 'А как насчёт подхода Database per Service? Какие плюсы и минусы?';
const A2 = 'Database per Service — каждый микросервис владеет своей БД.\n\n**Преимущества:**\n- 🔹 Автономность — сервис выбирает оптимальную СУБД\n- 🔹 Изоляция данных\n- 🔹 Независимое масштабирование\n\n**Недостатки:**\n- ⚠️ Распределённые транзакции\n- ⚠️ Eventual consistency\n- ⚠️ JOIN между сервисами невозможен\n\n**Решения:** Saga, Event Sourcing, API Composition';
const M3 = 'Помоги разработать стратегию контент-маркетинга для SaaS-стартапа в сфере HR-tech. Бюджет ограничен.';
const A3 = 'Стратегия контент-маркетинга для HR-tech SaaS:\n\n## Фаза 1: Фундамент\n- Определение ICP: HR-директора 50-500 человек\n- SEO-ядро: 30-50 ключевых запросов\n\n## Фаза 2: Контент-машина\n- Блог: 2 статьи/неделю\n- LinkedIn: личный бренд фаундера\n\n## Фаза 3: Масштабирование\n- Вебинары с HR-экспертами\n- Email-nurturing серии\n\n**Бюджет: ~$500-1000/мес** на старте';
const M4 = 'Мой React-проект стал тормозить. 200+ компонентов, сложный state management на Redux. Как оптимизировать?';
const A4 = 'Системный подход к оптимизации React:\n\n### 1. Профилирование\nReact DevTools Profiler → найти «дорогие» рендеры\n\n### 2. Мемоизация\n```jsx\nconst Component = React.memo(({ items }) => ...);\nconst filtered = useMemo(() => items.filter(...), [items]);\n```\n\n### 3. Redux оптимизация\n- Нормализация стейта\n- Reselect для мемоизированных селекторов\n- Гранулярные подписки\n\n### 4. Code Splitting\n```jsx\nconst Dashboard = lazy(() => import("./Dashboard"));\n```';
const M5 = 'А что скажет Claude по этому вопросу?';
const A5 = 'Дополню рекомендации:\n\n**Архитектурные паттерны:**\n1. **Compound Components** — композиция вместо проброса пропсов\n2. **State Colocation** — стейт близко к использованию\n3. **Оптимистичные обновления**\n\n**Метрики:**\n- LCP < 2.5s\n- Bundle size < 200KB gzipped';

export const MOCK_CHATS: Chat[] = [
  {
    id: G(201), userId: G(0), folderId: G(103), name: 'Архитектура микросервисов', connections: [G(202)], usedAiModels: ['chatgpt'],
    messages: [
      { id: G(301), chatId: G(201), serialNumber: 1, value: M1, createdAt: '2026-05-20T10:30:00', isBookmarked: false },
      { id: G(302), chatId: G(201), serialNumber: 2, value: A1, createdAt: '2026-05-20T10:31:00', isBookmarked: true, model: 'chatgpt' },
      { id: G(303), chatId: G(201), serialNumber: 3, value: M2, createdAt: '2026-05-20T10:35:00', isBookmarked: false },
      { id: G(304), chatId: G(201), serialNumber: 4, value: A2, createdAt: '2026-05-20T10:36:00', isBookmarked: true, model: 'chatgpt' },
    ],
  },
  {
    id: G(202), userId: G(0), folderId: G(105), name: 'Стратегия контент-маркетинга', connections: [G(201)], usedAiModels: ['gemini'],
    messages: [
      { id: G(305), chatId: G(202), serialNumber: 1, value: M3, createdAt: '2026-05-19T14:00:00', isBookmarked: false },
      { id: G(306), chatId: G(202), serialNumber: 2, value: A3, createdAt: '2026-05-19T14:02:00', isBookmarked: false, model: 'gemini' },
    ],
  },
  {
    id: G(203), userId: G(0), folderId: G(102), name: 'Оптимизация React-приложения', connections: [], usedAiModels: ['chatgpt', 'claude'],
    messages: [
      { id: G(307), chatId: G(203), serialNumber: 1, value: M4, createdAt: '2026-05-18T09:00:00', isBookmarked: false },
      { id: G(308), chatId: G(203), serialNumber: 2, value: A4, createdAt: '2026-05-18T09:02:00', isBookmarked: true, model: 'chatgpt' },
      { id: G(309), chatId: G(203), serialNumber: 3, value: M5, createdAt: '2026-05-18T09:10:00', isBookmarked: false },
      { id: G(310), chatId: G(203), serialNumber: 4, value: A5, createdAt: '2026-05-18T09:11:00', isBookmarked: false, model: 'claude' },
    ],
  },
];

// ─── Fragment folders ─────────────────────────────────────────────────────────

export const MOCK_FRAGMENT_FOLDERS: FragmentFolder[] = [
  {
    id: G(401), userId: G(0), parentId: null, name: 'Архитектурные паттерны', emojiId: 4, projectId: G(1),
    fragments: [
      { id: G(501), userId: G(0), folderId: G(401), name: 'Паттерны микросервисов', content: A1, messageId: G(302), aiModel: 'chatgpt' },
      { id: G(502), userId: G(0), folderId: G(401), name: 'Database per Service', content: 'Database per Service — каждый микросервис владеет своей БД. Преимущества: автономность, изоляция данных. Недостатки: распределённые транзакции.', messageId: G(304), aiModel: 'chatgpt' },
    ],
  },
  {
    id: G(402), userId: G(0), parentId: null, name: 'React оптимизация', emojiId: 5, projectId: G(1),
    fragments: [
      { id: G(503), userId: G(0), folderId: G(402), name: 'Мемоизация в React', content: 'React.memo для чистых компонентов, useMemo для вычислений, useCallback для коллбэков', messageId: G(308), aiModel: 'chatgpt' },
    ],
  },
  {
    id: G(403), userId: G(0), parentId: null, name: 'Маркетинг стратегии', emojiId: 10, projectId: G(2),
    fragments: [],
  },
];

// ─── Energy (frontend-only) ──────────────────────────────────────────────────

export const MOCK_ENERGY = {
  current: 7340,
  max: 10000,
  plan: 'Pro',
  costPerMessage: { min: 2, max: 6 },
};

// ─── Pricing plans (frontend-only) ───────────────────────────────────────────

export const PRICING_PLANS = [
  { id: 'free', name: 'Free', price: 0, energy: 500, features: ['500 единиц энергии/мес', '3 чата одновременно', '1 нейросеть', '5 кластеров', 'Базовый поиск'], popular: false },
  { id: 'pro', name: 'Pro', price: 15, energy: 10000, features: ['10 000 энергии/мес', 'Безлимитные чаты', 'Все нейросети', 'Безлимитные кластеры', 'Умный поиск', 'Импорт контекста'], popular: true },
  { id: 'team', name: 'Team', price: 45, energy: 50000, features: ['50 000 энергии/мес', 'Всё из Pro', 'Общие кластеры', 'Совместная работа', 'API доступ', 'Приоритетная поддержка'], popular: false },
];