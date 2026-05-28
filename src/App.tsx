import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Habits from './pages/Habits'
import Finance from './pages/Finance'
import Summary from './pages/Summary'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="habits" element={<Habits />} />
        <Route path="finance" element={<Finance />} />
        <Route path="summary" element={<Summary />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
