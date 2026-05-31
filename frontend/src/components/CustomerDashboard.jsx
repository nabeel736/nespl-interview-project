import { useState, useEffect } from 'react'

const STATUS_STEPS = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered']

const STATUS_BADGE = {
  'Pending':          'bg-red-100 text-red-700 border border-red-200',
  'In Transit':       'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Out for Delivery': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Delivered':        'bg-green-100 text-green-700 border border-green-200',
}

const STATUS_DOT = {
  'Pending':          'bg-red-500',
  'In Transit':       'bg-yellow-500',
  'Out for Delivery': 'bg-blue-500',
  'Delivered':        'bg-green-500',
}

function ShipmentDetail({ shipment, onClose }) {
  const statusIndex = STATUS_STEPS.indexOf(shipment.current_status)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">{shipment.item_name}</h2>
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">
              {shipment.tracking_id}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition">×</button>
        </div>

        {/* Progress stepper */}
        <div className="mb-6">
          <div className="relative flex justify-between items-start">
            {/* connector line */}
            <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-gray-200 z-0">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(statusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STATUS_STEPS.map((step, i) => {
              const done   = i < statusIndex
              const active = i === statusIndex
              return (
                <div key={step} className="flex flex-col items-center z-10 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${done   ? 'bg-green-500 border-green-500 text-white' :
                      active ? 'bg-blue-600 border-blue-200 text-white ring-4 ring-blue-100' :
                               'bg-white border-gray-300 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-center mt-1.5 text-xs leading-tight max-w-[64px]
                    ${done ? 'text-green-600 font-semibold' : active ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Details */}
        <div className="bg-slate-50 rounded-xl p-4 text-sm mb-5 space-y-2">
          {[
            ['Route',   `${shipment.source} → ${shipment.destination}`],
            ['Status',  shipment.current_status],
            ['Created', shipment.created_at],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">{label}</span>
              <span className="text-gray-700 font-medium">{val}</span>
            </div>
          ))}
        </div>

        {/* History */}
        {shipment.history?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-600 mb-3">Status History</h3>
            <div className="space-y-3">
              {shipment.history.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${STATUS_DOT[h.status] || 'bg-gray-400'}`} />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{h.status}</div>
                    <div className="text-xs text-gray-400">{h.updated_at}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CustomerDashboard({ companyName, onLogout }) {
  const [shipments, setShipments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`/api/customer/shipments?company_name=${encodeURIComponent(companyName)}`)
      .then(r => r.json())
      .then(data => { setShipments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [companyName])

  const handleSelect = async (tracking_id) => {
    try {
      const res = await fetch(`/api/customer/shipments/${tracking_id}?company_name=${encodeURIComponent(companyName)}`)
      const data = await res.json()
      if (res.ok) setSelected(data)
    } catch { /* ignore */ }
  }

  const filtered = shipments.filter(sh =>
    search === '' || sh.tracking_id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-900 to-green-600 px-6 py-3 flex items-center justify-between shadow-md">
        <span className="text-white font-extrabold text-lg">
          📦 ShipTrack <span className="font-light opacity-70 text-base">| Customer Portal</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">🏢 {companyName}</span>
          <button
            onClick={onLogout}
            className="bg-white/15 border border-white/30 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-white/25 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="🔍 Search by Tracking ID (e.g. TRK-ABCD1234)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 shadow-sm transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 text-sm hover:bg-gray-50 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Shipment list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">Loading shipments…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-3">{search ? '🔍' : '📭'}</div>
            <div className="text-sm">{search ? `No shipments matching "${search}"` : `No shipments found for ${companyName}`}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(sh => (
              <div
                key={sh.tracking_id}
                onClick={() => handleSelect(sh.tracking_id)}
                className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 text-base truncate">{sh.item_name}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-mono text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{sh.tracking_id}</span>
                    <span className="text-xs text-gray-400">{sh.source} → {sh.destination}</span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">{sh.created_at}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[sh.current_status]}`}>
                    {sh.current_status}
                  </span>
                  <span className="text-gray-300 text-xl">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <ShipmentDetail shipment={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
