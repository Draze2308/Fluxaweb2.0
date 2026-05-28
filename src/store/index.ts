import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Habit, DayTask, Transaction, Budget, UserProfile } from '../types'
import { palettes, type ThemeVariant, type Palette } from '../theme'

const today = new Date()
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const daysAgo = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return iso(d)
}

const seedHabits: Habit[] = [
  {
    id: 'h1',
    name: 'Meditar',
    icon: 'brain',
    color: '#8B5CF6',
    completions: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(6)],
  },
  {
    id: 'h2',
    name: 'Leer',
    icon: 'book-open',
    color: '#34D399',
    completions: [daysAgo(0), daysAgo(1), daysAgo(2)],
  },
  {
    id: 'h3',
    name: 'Ejercicio',
    icon: 'dumbbell',
    color: '#F5B544',
    completions: [daysAgo(1), daysAgo(3), daysAgo(5)],
  },
]

const seedTasks: DayTask[] = [
  { id: 't1', title: 'Pagar Netflix', date: iso(today), done: true, origin: 'planned_expense', transactionId: 'tx3' },
  { id: 't2', title: 'Revisar proyecto Fluxa', date: iso(today), done: false, origin: 'manual' },
]

const seedTransactions: Transaction[] = [
  {
    id: 'tx1', kind: 'income', amount: 280000,
    category: 'Sueldo', categoryIcon: 'briefcase', categoryColor: '#34D399',
    note: 'Sueldo mayo', date: daysAgo(3),
  },
  {
    id: 'tx2', kind: 'income', amount: 70000,
    category: 'Freelance', categoryIcon: 'laptop', categoryColor: '#A78BFA',
    note: 'Proyecto web', date: daysAgo(7),
  },
  {
    id: 'tx3', kind: 'planned', amount: 4200,
    category: 'Entretenimiento', categoryIcon: 'tv', categoryColor: '#F87171',
    note: 'Netflix', date: iso(today), plannedPaid: false, overdue: true,
  },
  {
    id: 'tx4', kind: 'planned', amount: 83333,
    category: 'Tecnología', categoryIcon: 'laptop', categoryColor: '#8B5CF6',
    note: 'Notebook', date: iso(today), plannedPaid: false,
    installmentIndex: 2, installmentTotal: 6,
  },
  {
    id: 'tx5', kind: 'expense', amount: 12400,
    category: 'Supermercado', categoryIcon: 'shopping-cart', categoryColor: '#F5B544',
    note: 'Compras semanales', date: daysAgo(1),
  },
  {
    id: 'tx6', kind: 'expense', amount: 8200,
    category: 'Transporte', categoryIcon: 'car', categoryColor: '#60A5FA',
    note: 'Uber', date: daysAgo(2),
  },
  {
    id: 'tx7', kind: 'expense', amount: 5500,
    category: 'Entretenimiento', categoryIcon: 'film', categoryColor: '#F87171',
    note: 'Cine', date: daysAgo(4),
  },
]

const seedBudgets: Budget[] = [
  { id: 'b1', name: 'Comida', category: 'Supermercado', amount: 50000, spent: 12400, period: 'monthly' },
]

interface AppState {
  profile: UserProfile
  habits: Habit[]
  tasks: DayTask[]
  transactions: Transaction[]
  budgets: Budget[]
  palette: Palette
  // actions
  toggleHabit: (id: string) => void
  toggleTask: (id: string) => void
  addHabit: (h: Omit<Habit, 'id' | 'completions'>) => void
  addTask: (title: string) => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  deleteHabit: (id: string) => void
  deleteTask: (id: string) => void
  setTheme: (t: ThemeVariant) => void
  upgradePro: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: { name: 'Tobi', isPro: false, theme: 'violet', streak: 7 },
      habits: seedHabits,
      tasks: seedTasks,
      transactions: seedTransactions,
      budgets: seedBudgets,
      palette: palettes.violet,

      toggleHabit: (id) => {
        const todayStr = iso(new Date())
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id !== id
              ? h
              : {
                  ...h,
                  completions: h.completions.includes(todayStr)
                    ? h.completions.filter((c) => c !== todayStr)
                    : [...h.completions, todayStr],
                }
          ),
        }))
      },

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      addHabit: (h) =>
        set((s) => ({
          habits: [
            ...s.habits,
            { ...h, id: `h${Date.now()}`, completions: [] },
          ],
        })),

      addTask: (title) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: `t${Date.now()}`, title, date: iso(new Date()), done: false, origin: 'manual' },
          ],
        })),

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ ...tx, id: `tx${Date.now()}` }, ...s.transactions],
        })),

      deleteHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      setTheme: (theme) =>
        set((s) => ({
          profile: { ...s.profile, theme },
          palette: palettes[theme],
        })),

      upgradePro: () =>
        set((s) => ({ profile: { ...s.profile, isPro: true } })),
    }),
    {
      name: 'fluxa-storage',
      partialize: (s) => ({
        profile: s.profile,
        habits: s.habits,
        tasks: s.tasks,
        transactions: s.transactions,
        budgets: s.budgets,
      }),
    }
  )
)

export const todayISO = () => iso(new Date())

export const getStreak = (completions: string[]): number => {
  if (!completions.length) return 0
  const set = new Set(completions)
  let s = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const key = iso(d)
    if (set.has(key)) s++
    else if (i > 0) break
    d.setDate(d.getDate() - 1)
  }
  return s
}
