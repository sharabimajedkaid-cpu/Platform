
export function PlacementsPage() {
  const levels = [
    { label: 'A1 Beginner', color: 'bg-green-100 text-green-700', range: '1–12' },
    { label: 'A2 Elementary', color: 'bg-blue-100 text-blue-700', range: '13–24' },
    { label: 'B1 Intermediate', color: 'bg-yellow-100 text-yellow-700', range: '25–36' },
    { label: 'B2 Upper Intermediate', color: 'bg-orange-100 text-orange-700', range: '37–48' },
    { label: 'C1 Advanced', color: 'bg-red-100 text-red-700', range: '49–60' },
    { label: 'C2 Proficiency', color: 'bg-purple-100 text-purple-700', range: '61–76' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📝 Placement Test — 76 Items</h2>
      <p className="text-sm text-gray-500">Comprehensive assessment covering A1 through C2 levels.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((lvl) => (
          <div key={lvl.label} className="bg-white rounded-xl p-5 shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy">{lvl.label}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${lvl.color}`}>Items {lvl.range}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="w-7 h-7 flex items-center justify-center text-[10px] bg-gray-100 rounded text-gray-500 font-medium">
                  {parseInt(lvl.range.split('–')[0]) + i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gold/10 rounded-xl p-4 border border-gold">
        <p className="text-sm">⏱️ Duration: 90 min · Auto-scored · Results mapped to CEFR levels</p>
      </div>
    </div>
  )
}
