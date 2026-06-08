
export function DailyPerfPage() {
  const items = [
    { label: 'Completed homework on time', done: true },
    { label: 'Participated in class discussion', done: true },
    { label: 'Achieved 80%+ on quiz', done: false },
    { label: 'Submitted writing assignment', done: true },
    { label: 'Reviewed previous lesson notes', done: false },
    { label: 'Attended all scheduled classes', done: true },
    { label: 'Completed extra practice exercises', done: false },
    { label: 'Maintained positive behavior', done: true },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📋 Daily Performance</h2>
      <p className="text-sm text-gray-500">Track and review daily student performance criteria.</p>
      <div className="bg-white rounded-xl p-5 shadow">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-navy">📌 Today&apos;s Checklist</h3>
          <span className="text-sm text-gold font-bold">{items.filter(i => i.done).length}/{items.length}</span>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {item.done ? '✓' : '○'}
              </span>
              <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-royal-blue/5 rounded-xl p-4 border border-royal-blue/20">
        <p className="text-sm">📈 Weekly Completion Rate: <strong className="text-royal-blue">72%</strong></p>
      </div>
    </div>
  )
}
