
import { useState } from 'react'

interface ClassroomDoorProps {
  id: number; grade: string; teacher: string; link: string
  onEnter: (id: number) => void
}

function ClassroomDoor({ id, grade, teacher, link, onEnter }: ClassroomDoorProps) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-gray-500 mb-1 truncate">🔗 {link}</div>
      <div className="classroom-door" onClick={() => onEnter(id)}>
        <span className="door-number">{id}</span>
        <span className="text-white font-bold text-sm">{grade}</span>
        <div className="door-handle" />
      </div>
      <p className="text-[10px] mt-1 text-gray-600">{teacher}</p>
      <button onClick={(e) => { e.stopPropagation(); onEnter(id) }}
        className="text-[10px] text-gold underline mt-1">Enter →</button>
    </div>
  )
}

export function ClassroomsPage({ onEnterClassroom }: { onEnterClassroom: (id: number) => void }) {
  const [page, setPage] = useState(0)
  const pageSize = 20
  const totalPages = Math.ceil(40 / pageSize)

  const classrooms = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    grade: `Grade ${Math.ceil((i + 1) / 4)}`,
    teacher: `T.${['Suhair Almojahid', "Wa'ad Alhammadi", 'Jamal Alshameeri', 'Amani Alsharabi', 'Khadeejah Alghaily', 'Shihab Alomary'][i % 6]}`,
    link: `https://britishce44.edu/classroom/${i + 1}`,
  }))

  const current = classrooms.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">🚪 40 Classrooms</h2>
      <p className="text-sm text-gray-500">Click any door to enter the live classroom.</p>
      <div className="flex gap-2 flex-wrap mb-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)}
            className={`px-3 py-1 rounded-full text-xs border transition hover:bg-gold
              ${page === i ? 'bg-gold text-navy font-bold' : ''}`}>
            {i * pageSize + 1}-{Math.min((i + 1) * pageSize, 240)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {current.map(r => (
          <ClassroomDoor key={r.id} {...r} onEnter={onEnterClassroom} />
        ))}
      </div>
    </div>
  )
}
