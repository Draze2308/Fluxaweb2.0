import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { useStore, todayISO } from '../store'
import { Card, SectionHeader, CatIcon, Modal } from '../components/ui'
import styles from './Page.module.css'

const fmt = (n: number) =>
  '$' + Math.round(n).toLocaleString('es-AR')

export default function Finance() {
  const { transactions, palette, addTransaction } = useStore()
  const [addOpen, setAddOpen] = useState(false)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [form, setForm] = useState({
    kind: 'expense' as 'income' | 'expense' | 'planned',
    amount: '',
    note: '',
    category: 'Otros',
    categoryIcon: 'zap',
    categoryColor: '#8B5CF6',
  })

  const today = todayISO()
  const incomes = transactions.filter((t) => t.kind === 'income')
  const expenses = transactions.filter((t) => t.kind === 'expense')
  const planned = transactions.filter((t) => t.kind === 'planned')
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const totalPlanned = planned.filter((t) => !t.plannedPaid).reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense - totalPlanned
  const overdue = planned.filter((t) => t.overdue && !t.plannedPaid)

  const handleAdd = () => {
    if (!form.amount || !form.note) return
    addTransaction({
      kind: form.kind,
      amount: parseFloat(form.amount),
      note: form.note,
      category: form.category,
      categoryIcon: form.categoryIcon,
      categoryColor: form.categoryColor,
      date: today,
      plannedPaid: false,
    })
    setForm({ kind: 'expense', amount: '', note: '', category: 'Otros', categoryIcon: 'zap', categoryColor: '#8B5CF6' })
    setAddOpen(false)
  }

  const recent = [...incomes, ...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Finanzas</h1>
        <button
          onClick={() => setAddOpen(true)}
          style={{ color: palette.primary, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Balance card */}
      <Card style={{ textAlign: 'center', padding: '24px 16px', marginBottom: 24, background: palette.surfaceElevated }}>
        <div style={{ fontSize: 12, color: palette.textTertiary, marginBottom: 8, fontWeight: 500, letterSpacing: '0.05em' }}>
          BALANCE DEL MES
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: balance >= 0 ? palette.accent : palette.error, letterSpacing: -1, marginBottom: 16 }}>
          {fmt(balance)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 2 }}>Ingresos</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: palette.accent }}>{fmt(totalIncome)}</div>
          </div>
          <div style={{ width: 1, background: palette.separator }} />
          <div>
            <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 2 }}>Gastos</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: palette.error }}>{fmt(totalExpense)}</div>
          </div>
          <div style={{ width: 1, background: palette.separator }} />
          <div>
            <div style={{ fontSize: 11, color: palette.textTertiary, marginBottom: 2 }}>Planeado</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: palette.warning }}>{fmt(totalPlanned)}</div>
          </div>
        </div>
      </Card>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <Card style={{ marginBottom: 24, padding: 14, borderColor: palette.error + '55', background: palette.error + '08' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} color={palette.error} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: palette.error }}>Pagos atrasados</div>
              <div style={{ fontSize: 12, color: palette.textSecondary, marginTop: 2 }}>
                {overdue.map((t) => t.note).join(', ')} — {fmt(overdue.reduce((s, t) => s + t.amount, 0))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Planned expenses */}
      {planned.length > 0 && (
        <>
          <SectionHeader title="Gastos planeados" />
          <div className={styles.list}>
            {planned.map((t) => {
              const expanded = expandedPlan === t.id
              return (
                <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    style={{ width: '100%', padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'none' }}
                    onClick={() => setExpandedPlan(expanded ? null : t.id)}
                  >
                    <CatIcon icon={t.categoryIcon} color={t.categoryColor} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{t.note}</div>
                      {t.installmentTotal && (
                        <div style={{ fontSize: 12, color: palette.textTertiary, marginTop: 2 }}>
                          Cuota {t.installmentIndex} de {t.installmentTotal}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: t.overdue ? palette.error : palette.warning }}>
                        {fmt(t.amount)}
                      </div>
                      {t.overdue && <span className="tag tag-red" style={{ marginTop: 4 }}>ATRASADO</span>}
                      {!t.overdue && t.date === today && <span className="tag tag-warn" style={{ marginTop: 4 }}>VENCE HOY</span>}
                    </div>
                    {expanded ? <ChevronUp size={16} color={palette.textTertiary} /> : <ChevronDown size={16} color={palette.textTertiary} />}
                  </button>
                  {expanded && (
                    <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${palette.separator}` }}>
                      <div style={{ paddingTop: 12, fontSize: 13, color: palette.textSecondary }}>
                        Categoría: {t.category}
                      </div>
                      {t.installmentTotal && (
                        <div style={{ marginTop: 8 }}>
                          <div className="prog-track">
                            <div className="prog-fill" style={{ width: `${((t.installmentIndex || 1) / t.installmentTotal) * 100}%` }} />
                          </div>
                          <div style={{ fontSize: 11, color: palette.textTertiary, marginTop: 4 }}>
                            {t.installmentIndex} de {t.installmentTotal} cuotas
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Recent movements */}
      <SectionHeader title="Movimientos recientes" />
      <div className={styles.list}>
        {recent.map((t) => (
          <Card key={t.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CatIcon icon={t.categoryIcon} color={t.categoryColor} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{t.note}</div>
                <div style={{ fontSize: 12, color: palette.textTertiary, marginTop: 2 }}>{t.category} · {t.date}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: t.kind === 'income' ? palette.accent : palette.error }}>
                {t.kind === 'income' ? '+' : '-'}{fmt(t.amount)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nuevo movimiento">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['income', 'expense', 'planned'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setForm((f) => ({ ...f, kind: k }))}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: form.kind === k ? palette.primary : palette.surfaceElevated,
                  color: form.kind === k ? '#fff' : palette.textTertiary,
                  border: `1px solid ${form.kind === k ? palette.primary : palette.separator}`,
                  transition: 'all 0.15s',
                }}
              >
                {k === 'income' ? 'Ingreso' : k === 'expense' ? 'Gasto' : 'Planeado'}
              </button>
            ))}
          </div>
          <input
            className="field"
            type="number"
            placeholder="Monto"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <input
            className="field"
            placeholder="Descripción"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn-primary" onClick={handleAdd}>
            Agregar
          </button>
        </div>
      </Modal>
    </div>
  )
}
