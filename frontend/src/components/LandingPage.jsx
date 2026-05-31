export default function LandingPage({ onStaffClick, onCustomerClick }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 px-4">
      <div className="text-6xl mb-2">📦</div>
      <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">ShipTrack</h1>
      <p className="text-blue-200 text-lg mb-10">Real-time shipment tracking for logistics & customers</p>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome</h2>
        <p className="text-gray-400 text-sm mb-6">Choose how you'd like to continue</p>

        <button
          onClick={onStaffClick}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150"
        >
          🔑 Staff Login
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={onCustomerClick}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150"
        >
          🏢 Customer Portal
        </button>
      </div>
    </div>
  )
}
