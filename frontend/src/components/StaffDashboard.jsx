import { useState, useEffect } from 'react'

const STATUS_NEXT = {
  'Pending': 'In Transit',
  'In Transit': 'Out for Delivery',
  'Out for Delivery': 'Delivered',
  'Delivered': null,
}

const STATUS_BADGE = {
  'Pending':          'bg-red-100 text-red-700 border border-red-200',
  'In Transit':       'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Out for Delivery': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Delivered':        'bg-green-100 text-green-700 border border-green-200',
}

export default function StaffDashboard({ onLogout }) {
  const [shipments, setShipments] = useState([])
  const [form, setForm] = useState({ item_name: '', sender_name: '', source: '', destination: '' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchShipments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/staff/shipments')
      setShipments(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchShipments() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setMsg(null)
    setCreating(true)
    try {
      const res = await fetch('/api/staff/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg({ type: 'success', text: `✅ Created! Tracking ID: ${data.tracking_id}` })
        setForm({ item_name: '', sender_name: '', source: '', destination: '' })
        fetchShipments()
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to create shipment' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Server error' })
    }
    setCreating(false)
  }

  const handleAdvance = async (tracking_id) => {
    try {
      const res = await fetch(`/api/staff/shipments/${tracking_id}/status`, { method: 'PATCH' })
      if (res.ok) fetchShipments()
    } catch { /* ignore */ }
  }

  const counts = {
    total: shipments.length,
    pending: shipments.filter(s => s.current_status === 'Pending').length,
    transit: shipments.filter(s => s.current_status === 'In Transit').length,
    delivered: shipments.filter(s => s.current_status === 'Delivered').length,
  }

  const fields = [
    { key: 'item_name',    label: 'Item Name',            placeholder: 'e.g. Laptop' },
    { key: 'sender_name',  label: 'Sender / Company Name',placeholder: 'e.g. Acme Corp' },
    { key: 'source',       label: 'Source',               placeholder: 'e.g. Mumbai' },
    { key: 'destination',  label: 'Destination',          placeholder: 'e.g. Delhi' },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-3 flex items-center justify-between shadow-md">
        <span className="text-white font-extrabold text-lg">
          📦 ShipTrack <span className="font-light opacity-70 text-base">| Staff Dashboard</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">🔑 Logistics Staff</span>
          <button
            onClick={onLogout}
            className="bg-white/15 border border-white/30 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-white/25 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',      num: counts.total,     color: 'text-blue-900' },
            { label: 'Pending',    num: counts.pending,   color: 'text-red-600' },
            { label: 'In Transit', num: counts.transit,   color: 'text-yellow-600' },
            { label: 'Delivered',  num: counts.delivered, color: 'text-green-600' },
          ].map(({ label, num, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className={`text-3xl font-extrabold ${color}`}>{num}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">➕ New Shipment</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              {fields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              ))}

              {msg && (
                <div className={`text-sm text-center py-2 px-3 rounded-lg ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {msg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create Shipment'}
              </button>
            </form>
          </div>

          {/* Shipments Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              📋 All Shipments
              {loading && <span className="text-xs text-gray-400 font-normal ml-2">loading…</span>}
            </h2>

            {shipments.length === 0 && !loading ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <div className="text-sm">No shipments yet. Create one!</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      {['Tracking ID', 'Item', 'Customer', 'Route', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map(sh => (
                      <tr key={sh.tracking_id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-3 py-3">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{sh.tracking_id}</span>
                        </td>
                        <td className="px-3 py-3 font-medium text-gray-700">{sh.item_name}</td>
                        <td className="px-3 py-3 text-gray-500">{sh.sender_name}</td>
                        <td className="px-3 py-3 text-gray-400 text-xs">{sh.source} → {sh.destination}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[sh.current_status]}`}>
                            {sh.current_status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {STATUS_NEXT[sh.current_status] ? (
                            <button
                              onClick={() => handleAdvance(sh.tracking_id)}
                              className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              → {STATUS_NEXT[sh.current_status]}
                            </button>
                          ) : (
                            <span className="text-green-600 text-xs font-semibold">✓ Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
