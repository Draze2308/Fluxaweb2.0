export type ThemeVariant = 'violet' | 'ocean' | 'sunset' | 'forest' | 'mono'

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  completions: string[] // YYYY-MM-DD
}

export interface DayTask {
  id: string
  title: string
  date: string
  done: boolean
  origin: 'manual' | 'planned_expense'
  transactionId?: string
}

export type TxKind = 'income' | 'expense' | 'planned'

export interface Transaction {
  id: string
  kind: TxKind
  amount: number
  category: string
  categoryIcon: string
  categoryColor: string
  note: string
  date: string
  plannedPaid?: boolean
  installmentIndex?: number
  installmentTotal?: number
  overdue?: boolean
}

export interface Budget {
  id: string
  name: string
  category: string
  amount: number
  spent: number
  period: 'monthly' | 'weekly'
}

export interface UserProfile {
  name: string
  isPro: boolean
  theme: ThemeVariant
  streak: number
}

export const PRO_LIMITS = {
  habits: 3,
  plannedActive: 2,
  budgets: 1,
} as const
