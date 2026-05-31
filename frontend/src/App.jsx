import { useState } from 'react'
import LandingPage from './components/LandingPage'
import StaffLogin from './components/StaffLogin'
import CustomerLogin from './components/CustomerLogin'
import StaffDashboard from './components/StaffDashboard'
import CustomerDashboard from './components/CustomerDashboard'

export default function App() {
  const [view, setView] = useState('landing') // landing | staff-login | customer-login | staff-dashboard | customer-dashboard
  const [session, setSession] = useState(null) // { role, company_name? }

  const logout = () => {
    setSession(null)
    setView('landing')
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onStaffClick={() => setView('staff-login')}
        onCustomerClick={() => setView('customer-login')}
      />
    )
  }

  if (view === 'staff-login') {
    return (
      <StaffLogin
        onSuccess={() => { setSession({ role: 'staff' }); setView('staff-dashboard') }}
        onBack={() => setView('landing')}
      />
    )
  }

  if (view === 'customer-login') {
    return (
      <CustomerLogin
        onSuccess={(company_name) => { setSession({ role: 'customer', company_name }); setView('customer-dashboard') }}
        onBack={() => setView('landing')}
      />
    )
  }

  if (view === 'staff-dashboard') {
    return <StaffDashboard onLogout={logout} />
  }

  if (view === 'customer-dashboard') {
    return <CustomerDashboard companyName={session.company_name} onLogout={logout} />
  }

  return null
}
