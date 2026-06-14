'use client'

export function HomeworkPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📚 Homework Dropbox</h2>
      <p className="text-sm text-gray-500">Upload assignments and track student submissions.</p>
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="font-semibold text-navy mb-3">📤 Upload New Assignment</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gold font-medium">Drag & drop files here</p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOC, or images (max 50MB)</p>
          <button className="mt-3 bg-navy text-white px-5 py-2 rounded-full text-sm">Browse Files</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="font-semibold text-navy mb-3">📋 Recent Submissions</h3>
        {[
          { student: 'Ahmed Al-Farsi', assignment: 'Unit 5 Essay', date: '2026-06-05', status: 'graded' },
          { student: 'Mona Hassan', assignment: 'Grammar Quiz', date: '2026-06-04', status: 'pending' },
          { student: 'Omar Saleh', assignment: 'Reading Report', date: '2026-06-03', status: 'graded' },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-medium text-sm">{s.student}</p>
              <p className="text-xs text-gray-400">{s.assignment} · {s.date}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${s.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
