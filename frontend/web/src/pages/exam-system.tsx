'use client'

export function ExamSystemPage() {
  const models = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const examTypes = [
    { type: 'Quiz1_ReadingListeningWriting', pts: 20 },
    { type: 'Quiz2_GrammarVocabSpeakingWriting', pts: 30 },
    { type: 'Speaking_ListeningDescription', pts: 20 },
    { type: 'Final_AllSections', pts: 30 },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">📝 Exam System — 100 Exams</h2>
      <p className="text-sm text-gray-500">
        10 Models (A–J) × 10 Sub-tests = 100 Exams | Timer: 30 min | Auto-save | PDF Certificate at 70%+
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {models.map(m => (
          <div key={m} className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold text-lg text-navy">Model {m}</h3>
            <div className="space-y-1 mt-2">
              {Array.from({ length: 5 }, (_, i) => {
                const et = examTypes[Math.floor(Math.random() * examTypes.length)]
                return (
                  <div key={i} className="flex justify-between text-xs py-1 border-b">
                    <span>📄 exam-{m}-{i + 1} — {et.type.replace(/_/g, ' ')}</span>
                    <span className="font-bold">{et.pts}pts</span>
                    <button className="text-gold underline ml-2">Start</button>
                  </div>
                )
              })}
              <p className="text-[10px] text-gray-400 mt-1">+5 more in Model {m}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gold/10 rounded-xl p-4 border border-gold">
        <h3 className="font-semibold">🎓 Exam Types</h3>
        <p className="text-xs">Quiz 1: Reading + Listening + Writing (20pts) | Quiz 2: Grammar + Vocabulary + Speaking + Writing (30pts) | Speaking: 3 Listen & Speak + Describe Image + Read Sentence (20pts) | Final: All Sections No Writing (30pts)</p>
      </div>
    </div>
  )
}
