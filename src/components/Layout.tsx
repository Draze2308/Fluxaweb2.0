import { NavLink, Outlet } from 'react-router-dom'
import { Home, Flame, Wallet, BarChart3, User } from 'lucide-react'
import { useStore } from '../store'
import styles from './Layout.module.css'

const NAV = [
  { to: '/home',    label: 'Inicio',   Icon: Home },
  { to: '/habits',  label: 'Hábitos',  Icon: Flame },
  { to: '/finance', label: 'Finanzas', Icon: Wallet },
  { to: '/summary', label: 'Resumen',  Icon: BarChart3 },
  { to: '/profile', label: 'Perfil',   Icon: User },
]

export default function Layout() {
  const { palette } = useStore()

  return (
    <div className={styles.root}>
      {/* Sidebar — desktop */}
      <nav className={styles.sidebar} style={{ borderColor: palette.separator }}>
        <div className={styles.logo}>
          <span className={styles.logoText} style={{ color: palette.primary }}>fluxa</span>
        </div>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? palette.primary : palette.textTertiary,
              background: isActive ? palette.primary + '15' : 'transparent',
            })}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className={styles.sidebarFooter} style={{ color: palette.textTertiary }}>
          <span style={{ fontSize: 11 }}>Fluxa v2.0</span>
        </div>
      </nav>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Bottom nav — mobile */}
      <nav className={styles.bottomNav} style={{ background: palette.surface, borderColor: palette.separator }}>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.bottomItem} ${isActive ? styles.bottomActive : ''}`
            }
            style={({ isActive }) => ({ color: isActive ? palette.primary : palette.textTertiary })}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
