
export function AnticheatPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">🤖 AI Anti-Cheat Monitor</h2>
      <p className="text-sm text-gray-500">Real-time detection systems protecting exam integrity.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Tab Switch Detection', status: 'active', desc: 'Detects when user leaves the exam tab', color: 'bg-green-500' },
          { name: 'Screen Recording Block', status: 'active', desc: 'Prevents screen capture during exam', color: 'bg-green-500' },
          { name: 'AI Proctoring', status: 'active', desc: 'Webcam-based behavior monitoring', color: 'bg-green-500' },
          { name: 'Keystroke Analysis', status: 'active', desc: 'Detects copy-paste and unusual input patterns', color: 'bg-green-500' },
          { name: 'IP & Device Fingerprint', status: 'active', desc: 'Flags multiple logins from different locations', color: 'bg-green-500' },
          { name: 'Time Anomaly Detection', status: 'active', desc: 'Flags suspiciously fast completion times', color: 'bg-green-500' },
        ].map((sys, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-navy">{sys.name}</h3>
              <span className={`w-2.5 h-2.5 rounded-full ${sys.color}`} />
            </div>
            <p className="text-xs text-gray-500">{sys.desc}</p>
            <p className="text-[10px] text-green-600 mt-2">● {sys.status}</p>
          </div>
        ))}
      </div>
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <p className="text-sm font-semibold text-red-700">⚠️ Recent Alerts: 3 flagged sessions today</p>
      </div>
    </div>
  )
}
