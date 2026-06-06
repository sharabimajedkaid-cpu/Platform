'use client'

export function TeacherEvalPage() {
  const criteria = [
    { name: 'Lesson Preparation', score: 92, max: 100, color: 'text-green-600' },
    { name: 'Classroom Management', score: 85, max: 100, color: 'text-blue-600' },
    { name: 'Student Engagement', score: 78, max: 100, color: 'text-yellow-600' },
    { name: 'Assessment & Feedback', score: 90, max: 100, color: 'text-green-600' },
    { name: 'Communication Skills', score: 88, max: 100, color: 'text-blue-600' },
    { name: 'Professional Development', score: 95, max: 100, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">⭐ Teacher Evaluation</h2>
      <p className="text-sm text-gray-500">Performance scoring across key teaching criteria.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((c) => (
          <div key={c.name} className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold text-navy">{c.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${c.color}`}>{c.score}</span>
              <span className="text-gray-400 text-sm">/ {c.max}</span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${c.score >= 90 ? 'bg-green-500' : c.score >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${c.score}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gold/10 rounded-xl p-4 border border-gold">
        <p className="text-sm font-semibold">📊 Overall Score: <span className="text-gold">88%</span> — Excellent performance</p>
      </div>
    </div>
  )
}
