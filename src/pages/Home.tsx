import { useState } from 'react'
import { Plus, X, Check, Trash2 } from 'lucide-react'
import { useStore, todayISO, getStreak } from '../store'
import { Card, SectionHeader, ProgressBar, HabitIcon, StreakBadge, Modal, EmptyState } from '../components/ui'
import styles from './Page.module.css'

function greeting(name: string): string {
  const h = new Date().getHours()
  if (h < 12) return `Buenos días, ${name} ☀️`
  if (h < 20) return `Buenas tardes, ${name} 🌤️`
  return `Buenas noches, ${name} 🌙`
}

export default function Home() {
  const { profile, habits, tasks, palette, toggleHabit, toggleTask, addTask, deleteTask } = useStore()
  const [addOpen, setAddOpen] = useState(false)
  const [newTask, setNewTask] = useState('')

  const today = todayISO()
  const todayTasks = tasks.filter((t) => t.date === today)
  const completedHabits = habits.filter((h) => h.completions.includes(today)).length
  const completedTasks = todayTasks.filter((t) => t.done).length
  const total = habits.length + todayTasks.length
  const completed = completedHabits + completedTasks
  const progress = total > 0 ? completed / total : 0

  const handleAddTask = () => {
    if (!newTask.trim()) return
    addTask(newTask.trim())
    setNewTask('')
    setAddOpen(false)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{greeting(profile.name)}</h1>
          <p style={{ color: palette.textSecondary, fontSize: 14, marginTop: 4 }}>
            {total > 0 ? `${completed} de ${total} completados hoy` : 'Empezá tu día con foco ✨'}
          </p>
        </div>
        {!profile.isPro && (
          <span className="tag tag-violet">FREE</span>
        )}
      </div>

      {total > 0 && (
        <div style={{ marginBottom: 28 }}>
          <ProgressBar value={progress} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: palette.textTertiary }}>{Math.round(progress * 100)}%</span>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <div className="stat-card">
          <span className="stat-label">Hábitos hoy</span>
          <span className="stat-value" style={{ color: palette.primary }}>
            {completedHabits}/{habits.length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tareas hoy</span>
          <span className="stat-value" style={{ color: palette.accent }}>
            {completedTasks}/{todayTasks.length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Racha</span>
          <span className="stat-value" style={{ color: palette.warning }}>
            {profile.streak}d 🔥
          </span>
        </div>
      </div>

      {/* Tasks */}
      <SectionHeader
        title="Tareas del día"
        action={
          <button
            onClick={() => setAddOpen(true)}
            style={{ color: palette.primary, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nueva
          </button>
        }
      />
      {todayTasks.length === 0 ? (
        <EmptyState icon="📋" title="Sin tareas hoy" sub="Agregá una para empezar" />
      ) : (
        <div className={styles.list}>
          {todayTasks.map((t) => (
            <Card key={t.id} style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => toggleTask(t.id)}
                  style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${t.done ? palette.accent : palette.textTertiary}`,
                    background: t.done ? palette.accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.done && <Check size={14} color="#0B0717" strokeWidth={3} />}
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 15,
                    color: t.done ? palette.textTertiary : palette.text,
                    textDecoration: t.done ? 'line-through' : 'none',
                  }}>
                    {t.title}
                  </span>
                  {t.origin === 'planned_expense' && (
                    <div style={{ marginTop: 4 }}>
                      <span className="tag tag-violet">GASTO PLANEADO</span>
                    </div>
                  )}
                </div>
                <button onClick={() => deleteTask(t.id)} style={{ color: palette.textTertiary, lineHeight: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Habits */}
      <SectionHeader title="Hábitos del día" />
      {habits.length === 0 ? (
        <EmptyState icon="🔥" title="Sin hábitos aún" sub="Creá tu primer hábito en la sección Hábitos" />
      ) : (
        <div className={styles.list}>
          {habits.map((h) => {
            const done = h.completions.includes(today)
            const streak = getStreak(h.completions)
            return (
              <Card key={h.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HabitIcon icon={h.icon} color={h.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{h.name}</div>
                    <StreakBadge days={streak} />
                  </div>
                  <button
                    onClick={() => toggleHabit(h.id)}
                    style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${done ? palette.accent : palette.textTertiary}`,
                      background: done ? palette.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {done && <Check size={16} color="#0B0717" strokeWidth={3} />}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add task modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nueva tarea">
        <input
          className="field"
          placeholder="¿Qué tenés que hacer hoy?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          autoFocus
        />
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleAddTask}>
          Agregar tarea
        </button>
      </Modal>
    </div>
  )
}
