import { useState } from 'react'

export default function StaffLogin({ onSuccess, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess()
      } else {
        setError(data.message || 'Invalid password')
      }
    } catch {
      setError('Cannot connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="text-5xl mb-2">🔑</div>
          <h1 className="text-2xl font-extrabold text-gray-800">Staff Login</h1>
          <p className="text-gray-400 text-sm mt-1">Logistics team access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter staff password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="mt-4 bg-blue-50 text-blue-700 text-xs text-center py-2.5 px-3 rounded-lg">
          💡 Demo password: <strong>staff123</strong>
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
