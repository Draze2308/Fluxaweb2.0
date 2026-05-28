import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { useStore, todayISO, getStreak } from '../store'
import { Card, SectionHeader, HabitIcon, StreakBadge, Modal, EmptyState } from '../components/ui'
import styles from './Page.module.css'

type Seg = 'hoy' | 'semana' | 'todos'

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const ICONS = ['brain', 'book-open', 'dumbbell', 'flame', 'heart', 'music', 'code', 'pencil', 'coffee', 'moon', 'sun', 'droplets']
const COLORS = ['#8B5CF6', '#34D399', '#F5B544', '#F87171', '#60A5FA', '#F97316', '#EC4899', '#14B8A6']
const ICON_LABELS: Record<string, string> = {
  brain: '🧠', 'book-open': '📖', dumbbell: '💪', flame: '🔥',
  heart: '❤️', music: '🎵', code: '💻', pencil: '✏️',
  coffee: '☕', moon: '🌙', sun: '☀️', droplets: '💧',
}

function getWeekDates(): Date[] {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function isoOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Habits() {
  const { habits, palette, toggleHabit, addHabit, deleteHabit } = useStore()
  const [seg, setSeg] = useState<Seg>('hoy')
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('brain')
  const [color, setColor] = useState('#8B5CF6')

  const today = todayISO()
  const weekDates = getWeekDates()
  const todayIdx = (new Date().getDay() + 6) % 7

  const handleAdd = () => {
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color })
    setName('')
    setAddOpen(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Hábitos</h1>
        <button
          onClick={() => setAddOpen(true)}
          style={{ color: palette.primary, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Segmented control */}
      <div style={{ display: 'flex', background: palette.surface, borderRadius: 10, padding: 3, marginBottom: 24, border: `1px solid ${palette.separator}` }}>
        {(['hoy', 'semana', 'todos'] as Seg[]).map((s) => (
          <button
            key={s}
            onClick={() => setSeg(s)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: seg === s ? palette.primary : 'transparent',
              color: seg === s ? '#fff' : palette.textTertiary,
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {habits.length === 0 ? (
        <EmptyState icon="🔥" title="Sin hábitos aún" sub="Creá tu primer hábito para empezar a trackear" />
      ) : (
        <div className={styles.list}>
          {habits.map((h) => {
            const done = h.completions.includes(today)
            const streak = getStreak(h.completions)
            const weeklyPct = Math.round(
              (weekDates.filter((d) => h.completions.includes(isoOf(d))).length / 7) * 100
            )

            return (
              <Card key={h.id} style={{ padding: 16 }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: seg !== 'hoy' ? 14 : 0 }}>
                  <HabitIcon icon={h.icon} color={h.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{h.name}</div>
                    <StreakBadge days={streak} />
                  </div>
                  {seg === 'hoy' ? (
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
                  ) : (
                    <button onClick={() => deleteHabit(h.id)} style={{ color: palette.textTertiary, lineHeight: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Week strip */}
                {seg === 'semana' && (
                  <div className={styles.weekStrip}>
                    {weekDates.map((d, i) => {
                      const iso = isoOf(d)
                      const isDone = h.completions.includes(iso)
                      const isToday = i === todayIdx
                      return (
                        <div key={i} className={styles.dayDot}>
                          <div
                            className={`${styles.dayCircle} ${isDone ? styles.done : ''} ${isToday && !isDone ? styles.today : ''}`}
                            style={isDone ? { background: h.color, borderColor: h.color } : {}}
                          >
                            {DAYS[i]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Todos — weekly stat */}
                {seg === 'todos' && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: palette.textSecondary }}>
                      <span>Esta semana</span>
                      <span style={{ color: palette.primary, fontWeight: 700 }}>{weeklyPct}%</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: `${weeklyPct}%`, background: `linear-gradient(90deg, ${h.color}, ${h.color}88)` }} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: palette.textTertiary }}>
                      {h.completions.length} completions totales
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Stats */}
      {habits.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <div className="stat-card">
            <span className="stat-label">Mejor racha</span>
            <span className="stat-value" style={{ color: palette.warning }}>
              {Math.max(...habits.map((h) => getStreak(h.completions)))}d 🔥
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completados hoy</span>
            <span className="stat-value" style={{ color: palette.primary }}>
              {habits.filter((h) => h.completions.includes(today)).length}/{habits.length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total hábitos</span>
            <span className="stat-value">{habits.length}</span>
          </div>
        </div>
      )}

      {/* Add habit modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nuevo hábito">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            className="field"
            placeholder="Nombre del hábito"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div>
            <div style={{ fontSize: 13, color: palette.textSecondary, marginBottom: 8 }}>Ícono</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    width: 40, height: 40, borderRadius: 10, fontSize: 20,
                    background: icon === ic ? palette.primary + '33' : palette.surfaceElevated,
                    border: `1.5px solid ${icon === ic ? palette.primary : palette.separator}`,
                    transition: 'all 0.15s',
                  }}
                >
                  {ICON_LABELS[ic]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: palette.textSecondary, marginBottom: 8 }}>Color</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: c,
                    border: `3px solid ${color === c ? '#fff' : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            Crear hábito
          </button>
        </div>
      </Modal>
    </div>
  )
}
