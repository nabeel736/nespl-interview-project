import { useState } from 'react'

export default function CustomerLogin({ onSuccess, onBack }) {
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!companyName.trim()) { setError('Please enter your company name'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess(data.company_name)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Cannot connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-500 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="text-5xl mb-2">🏢</div>
          <h1 className="text-2xl font-extrabold text-gray-800">Customer Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Track your shipments</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'View My Shipments →'}
          </button>
        </form>

        <div className="mt-4 bg-green-50 text-green-700 text-xs text-center py-2.5 px-3 rounded-lg">
          ℹ️ Enter the company name used when your shipment was created
        </div>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-gray-400 text-sm underline hover:text-gray-600 transition"
        >
          ← Back to home
        </button>
      </div>
    </div>
  )
}
