
export function LiveAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📈 Live Analytics Dashboard</h2>
      <p className="text-sm text-gray-500">Real-time platform metrics and insights.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '42', change: '+8%', color: 'text-green-600' },
          { label: 'Exams Running', value: '7', change: 'steady', color: 'text-blue-600' },
          { label: 'Submissions Today', value: '156', change: '+23%', color: 'text-green-600' },
          { label: 'Avg Response Time', value: '1.2s', change: '-0.3s', color: 'text-gold' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow">
            <p className="text-xs text-gray-400">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-gray-400">{m.change}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy mb-3">📊 Hourly Activity</h3>
          <div className="flex items-end gap-2 h-24">
            {[30, 55, 40, 70, 85, 60, 90, 75, 50, 65, 45, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gold/60 rounded-t" style={{ height: `${h}%` }} />
                <span className="text-[8px] text-gray-400">{i + 1}h</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy mb-3">🌍 Geographic Distribution</h3>
          <div className="space-y-2">
            {[
              { country: 'Yemen', pct: 78, color: 'bg-navy' },
              { country: 'Saudi Arabia', pct: 12, color: 'bg-gold' },
              { country: 'UAE', pct: 6, color: 'bg-royal-blue' },
              { country: 'Other', pct: 4, color: 'bg-gray-400' },
            ].map(g => (
              <div key={g.country} className="flex items-center gap-2 text-xs">
                <span className="w-24">{g.country}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className={`${g.color} h-2 rounded-full`} style={{ width: `${g.pct}%` }} />
                </div>
                <span className="font-bold">{g.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
