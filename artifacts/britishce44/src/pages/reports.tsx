
export function ReportsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📊 Triple Reports</h2>
      <p className="text-sm text-gray-500">Parent, Teacher, and Management report views.</p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow border-t-4 border-green-500">
          <h3 className="font-semibold text-navy">👨‍👩‍👧 Parent Report</h3>
          <p className="text-xs text-gray-400 mt-1">Student progress, attendance, and grades</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>📈 Attendance: <strong>94%</strong></p>
            <p>📝 Avg Grade: <strong className="text-green-600">87%</strong></p>
            <p>📚 Completed: <strong>12/15</strong> assignments</p>
          </div>
          <button className="mt-3 text-gold text-sm underline">Download PDF</button>
        </div>
        <div className="bg-white rounded-xl p-5 shadow border-t-4 border-blue-500">
          <h3 className="font-semibold text-navy">🧑‍🏫 Teacher Report</h3>
          <p className="text-xs text-gray-400 mt-1">Class performance and teaching metrics</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>👥 Class Avg: <strong>82%</strong></p>
            <p>⭐ Eval Score: <strong className="text-blue-600">88%</strong></p>
            <p>📋 Lessons: <strong>48/50</strong> delivered</p>
          </div>
          <button className="mt-3 text-gold text-sm underline">Download PDF</button>
        </div>
        <div className="bg-white rounded-xl p-5 shadow border-t-4 border-gold">
          <h3 className="font-semibold text-navy">🏢 Management Report</h3>
          <p className="text-xs text-gray-400 mt-1">Institution-wide analytics and KPIs</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>🎓 Total Students: <strong>50</strong></p>
            <p>💰 Revenue: <strong className="text-gold">$24,500</strong></p>
            <p>📊 Growth: <strong>+15%</strong> vs last quarter</p>
          </div>
          <button className="mt-3 text-gold text-sm underline">Download PDF</button>
        </div>
      </div>
    </div>
  )
}
