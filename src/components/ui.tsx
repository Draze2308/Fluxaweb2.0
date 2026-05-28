import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../store'

/* ─── Card ─────────────────────────────────── */
export function Card({
  children,
  style,
  className = '',
  elevated = false,
}: {
  children: ReactNode
  style?: React.CSSProperties
  className?: string
  elevated?: boolean
}) {
  return (
    <div className={`${elevated ? 'glass-el' : 'glass'} ${className}`} style={{ padding: 16, ...style }}>
      {children}
    </div>
  )
}

/* ─── Section header ────────────────────────── */
export function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{title}</span>
      {action}
    </div>
  )
}

/* ─── Progress bar ──────────────────────────── */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="prog-track">
      <div className="prog-fill" style={{ width: `${Math.min(100, Math.round(value * 100))}%` }} />
    </div>
  )
}

/* ─── Habit icon bubble ─────────────────────── */
export function HabitIcon({ icon, color, size = 36 }: { icon: string; color: string; size?: number }) {
  const ICON_MAP: Record<string, string> = {
    brain: '🧠',
    'book-open': '📖',
    dumbbell: '💪',
    flame: '🔥',
    heart: '❤️',
    music: '🎵',
    code: '💻',
    pencil: '✏️',
    coffee: '☕',
    moon: '🌙',
    sun: '☀️',
    droplets: '💧',
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: color + '22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {ICON_MAP[icon] || '⭐'}
    </div>
  )
}

/* ─── Category icon ─────────────────────────── */
export function CatIcon({ icon, color }: { icon: string; color: string }) {
  const MAP: Record<string, string> = {
    briefcase: '💼', laptop: '💻', tv: '📺', 'shopping-cart': '🛒',
    car: '🚗', film: '🎬', coffee: '☕', utensils: '🍽️',
    heart: '❤️', home: '🏠', plane: '✈️', gift: '🎁',
    music: '🎵', book: '📚', phone: '📱', zap: '⚡',
  }
  return (
    <div
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}
    >
      {MAP[icon] || '💰'}
    </div>
  )
}

/* ─── Modal sheet ───────────────────────────── */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ color: 'var(--text-3)', lineHeight: 0 }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ─── Empty state ───────────────────────────── */
export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <Card style={{ textAlign: 'center', padding: '28px 16px', borderStyle: 'dashed', background: 'transparent' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{sub}</div>
    </Card>
  )
}

/* ─── FAB ───────────────────────────────────── */
export function FAB({ onClick, open }: { onClick: () => void; open: boolean }) {
  const { palette } = useStore()
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
        color: '#fff',
        fontSize: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 20px ${palette.primary}55`,
        transition: 'transform 0.2s',
        transform: open ? 'rotate(45deg)' : 'none',
        zIndex: 50,
      }}
    >
      +
    </button>
  )
}

/* ─── Streak badge ──────────────────────────── */
export function StreakBadge({ days }: { days: number }) {
  if (!days) return null
  return (
    <span className="tag tag-warn" style={{ fontSize: 11 }}>
      🔥 {days}d
    </span>
  )
}
