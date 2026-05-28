import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useStore, getStreak, todayISO } from '../store'
import { Card, SectionHeader } from '../components/ui'
import styles from './Page.module.css'

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

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

function fmt(n: number) {
  if (n >= 1000) return `$${Math.round(n / 1000)}k`
  return `$${Math.round(n)}`
}

export default function Summary() {
  const { habits, transactions, palette } = useStore()
  const today = todayISO()
  const weekDates = getWeekDates()

  // Habit adherence by day
  const habitData = weekDates.map((d, i) => {
    const iso = isoOf(d)
    const done = habits.filter((h) => h.completions.includes(iso)).length
    const pct = habits.length > 0 ? Math.round((done / habits.length) * 100) : 0
    return { day: DAYS[i], pct, isToday: iso === today }
  })

  // Finance by month
  const incomes = transactions.filter((t) => t.kind === 'income')
  const expenses = transactions.filter((t) => t.kind === 'expense')
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const finData = [
    { label: 'Ingresos', value: totalIncome, color: palette.accent },
    { label: 'Gastos', value: totalExpense, color: palette.error },
  ]

  // Stats
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => getStreak(h.completions))) : 0
  const weeklyAdh = habitData.reduce((s, d) => s + d.pct, 0) / 7
  const savings = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const completedToday = habits.filter((h) => h.completions.includes(today)).length

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: palette.surfaceElevated, border: `1px solid ${palette.separator}`, borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ fontSize: 12, color: palette.textTertiary }}>{label}</div>
        <div style={{ fontWeight: 700, color: palette.primary }}>{payload[0].value}%</div>
      </div>
    )
  }

  const FinTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: palette.surfaceElevated, border: `1px solid ${palette.separator}`, borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ fontSize: 12, color: palette.textTertiary }}>{label}</div>
        <div style={{ fontWeight: 700 }}>${Math.round(payload[0].value).toLocaleString('es-AR')}</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Resumen</h1>
        <span style={{ fontSize: 13, color: palette.textSecondary }}>
          {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }}>
        <div className="stat-card">
          <span className="stat-label">Mejor racha</span>
          <span className="stat-value" style={{ color: palette.warning }}>{bestStreak}d 🔥</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Adherencia semanal</span>
          <span className="stat-value" style={{ color: palette.primary }}>{Math.round(weeklyAdh)}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Ahorro del mes</span>
          <span className="stat-value" style={{ color: palette.accent }}>{savings}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hábitos hoy</span>
          <span className="stat-value">{completedToday}/{habits.length}</span>
        </div>
      </div>

      {/* Habit chart */}
      <SectionHeader title="Adherencia a hábitos" />
      <Card style={{ marginBottom: 24, padding: '20px 12px 12px' }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={habitData} barCategoryGap="30%">
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: palette.textTertiary, fontSize: 11 }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
              {habitData.map((d, i) => (
                <Cell key={i} fill={d.pct === 100 ? palette.primary : d.pct > 0 ? palette.primary + '88' : palette.separator} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Finance chart */}
      <SectionHeader title="Finanzas del mes" />
      <Card style={{ marginBottom: 24, padding: '20px 12px 12px' }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={finData} barCategoryGap="50%">
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: palette.textTertiary, fontSize: 12 }} />
            <YAxis hide />
            <Tooltip content={<FinTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {finData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          {finData.map((d) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
              <span style={{ fontSize: 12, color: palette.textSecondary }}>{d.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{fmt(d.value)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights grid */}
      <SectionHeader title="Insights" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 6, fontWeight: 500 }}>HÁBITO ESTRELLA</div>
          <div style={{ fontWeight: 700 }}>
            {habits.length > 0
              ? habits.reduce((a, b) => (getStreak(a.completions) > getStreak(b.completions) ? a : b)).name
              : '—'}
          </div>
          <div style={{ fontSize: 12, color: palette.textSecondary, marginTop: 2 }}>Racha más larga</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 6, fontWeight: 500 }}>MAYOR GASTO</div>
          <div style={{ fontWeight: 700 }}>
            {transactions.filter((t) => t.kind === 'expense').length > 0
              ? transactions.filter((t) => t.kind === 'expense').reduce((a, b) => (a.amount > b.amount ? a : b)).note
              : '—'}
          </div>
          <div style={{ fontSize: 12, color: palette.textSecondary, marginTop: 2 }}>Este mes</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 6, fontWeight: 500 }}>MEJOR DÍA</div>
          <div style={{ fontWeight: 700 }}>
            {habitData.reduce((a, b) => (a.pct > b.pct ? a : b)).day}
          </div>
          <div style={{ fontSize: 12, color: palette.textSecondary, marginTop: 2 }}>{habitData.reduce((a, b) => (a.pct > b.pct ? a : b)).pct}% adherencia</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 6, fontWeight: 500 }}>TASA AHORRO</div>
          <div style={{ fontWeight: 700, color: savings > 30 ? palette.accent : palette.warning }}>
            {savings}%
          </div>
          <div style={{ fontSize: 12, color: palette.textSecondary, marginTop: 2 }}>
            {savings > 30 ? '¡Muy bien! 💪' : 'Podés mejorar'}
          </div>
        </Card>
      </div>
    </div>
  )
}
