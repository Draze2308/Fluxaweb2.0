import { useState } from 'react'
import { Crown, ChevronRight, Bell, Repeat, Wallet, PieChart, Palette, LogOut } from 'lucide-react'
import { useStore, getStreak, todayISO } from '../store'
import { Card, SectionHeader, Modal } from '../components/ui'
import { themeMeta, type ThemeVariant } from '../theme'
import styles from './Page.module.css'

const NAV_ITEMS = [
  { icon: Palette, label: 'Temas', sub: '5 temas disponibles' },
  { icon: Bell, label: 'Recordatorios', sub: 'Notificaciones diarias' },
  { icon: Repeat, label: 'Recurrentes', sub: 'Gastos automáticos' },
  { icon: Wallet, label: 'Cuentas', sub: 'Banco, efectivo…' },
  { icon: PieChart, label: 'Presupuestos', sub: 'Control por categoría' },
]

export default function Profile() {
  const { profile, habits, transactions, palette, setTheme, upgradePro } = useStore()
  const [themeOpen, setThemeOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const today = todayISO()

  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => getStreak(h.completions))) : 0
  const totalDays = habits.length > 0
    ? Math.max(...habits.map((h) => h.completions.length))
    : 0
  const completedToday = habits.filter((h) => h.completions.includes(today)).length

  const handleNavClick = (label: string) => {
    if (label === 'Temas') { setThemeOpen(true); return }
    setActiveNav(label)
    setTimeout(() => setActiveNav(null), 300)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Perfil</h1>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: '#fff',
          margin: '0 auto 12px',
          border: profile.isPro ? `3px solid ${palette.gold}` : `3px solid ${palette.separator}`,
        }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{profile.name}</div>
        <div style={{ marginTop: 6 }}>
          {profile.isPro ? (
            <span className="tag tag-gold"><Crown size={10} /> PRO</span>
          ) : (
            <span className="tag tag-violet">FREE</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <span className="stat-label">Hábitos</span>
          <span className="stat-value" style={{ color: palette.primary }}>{habits.length}</span>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <span className="stat-label">Racha</span>
          <span className="stat-value" style={{ color: palette.warning }}>{bestStreak}d 🔥</span>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <span className="stat-label">Días activo</span>
          <span className="stat-value" style={{ color: palette.accent }}>{totalDays}</span>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <span className="stat-label">Hoy</span>
          <span className="stat-value">{completedToday}/{habits.length}</span>
        </div>
      </div>

      {/* Nav list */}
      <SectionHeader title="Configuración" />
      <Card style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, sub }, i) => (
          <button
            key={label}
            onClick={() => handleNavClick(label)}
            style={{
              width: '100%', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: activeNav === label ? palette.primary + '10' : 'none',
              borderBottom: i < NAV_ITEMS.length - 1 ? `1px solid ${palette.separator}` : 'none',
              transition: 'background 0.15s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: palette.primary + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color={palette.primary} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
              <div style={{ fontSize: 12, color: palette.textTertiary, marginTop: 1 }}>{sub}</div>
            </div>
            <ChevronRight size={16} color={palette.textTertiary} />
          </button>
        ))}
      </Card>

      {/* Pro upgrade banner */}
      {!profile.isPro && (
        <button
          onClick={upgradePro}
          style={{
            width: '100%', padding: '20px 20px',
            background: `linear-gradient(135deg, ${palette.surfaceElevated}, #2A1F4A)`,
            border: `1px solid ${palette.primary}55`,
            borderRadius: 16, textAlign: 'center', marginBottom: 24,
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <Crown size={18} color={palette.gold} />
            <span style={{ fontWeight: 700, fontSize: 16, color: palette.gold }}>Pasate a Pro</span>
          </div>
          <div style={{ fontSize: 13, color: palette.textSecondary }}>
            Hábitos ilimitados · Temas premium · Exportar datos
          </div>
          <div style={{
            marginTop: 12, padding: '8px 20px', borderRadius: 99,
            background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
            display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            Ver planes
          </div>
        </button>
      )}

      {/* Sign out mock */}
      <button
        style={{
          width: '100%', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: palette.error, fontWeight: 600, fontSize: 14, borderRadius: 12,
          border: `1px solid ${palette.error}33`, background: 'transparent',
        }}
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>

      {/* Theme modal */}
      <Modal open={themeOpen} onClose={() => setThemeOpen(false)} title="Elegí tu tema">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(Object.entries(themeMeta) as [ThemeVariant, typeof themeMeta[ThemeVariant]][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { if (!meta.pro || profile.isPro) { setTheme(key); setThemeOpen(false) } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                borderRadius: 12, background: palette.surfaceElevated,
                border: `1.5px solid ${profile.theme === key ? palette.primary : palette.separator}`,
                opacity: meta.pro && !profile.isPro ? 0.5 : 1,
                transition: 'all 0.15s', cursor: meta.pro && !profile.isPro ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
              }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>{meta.name}</div>
                {meta.pro && <div style={{ fontSize: 11, color: palette.textTertiary }}>Pro</div>}
              </div>
              {profile.theme === key && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: palette.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
                </div>
              )}
              {meta.pro && !profile.isPro && <Crown size={14} color={palette.gold} />}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
