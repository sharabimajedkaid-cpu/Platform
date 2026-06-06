'use client'

import { useState, useEffect, useCallback } from 'react'

interface ClassroomInteriorProps {
  roomId: number
  onClose: () => void
}

export function ClassroomInterior({ roomId, onClose }: ClassroomInteriorProps) {
  const [seconds, setSeconds] = useState(30 * 60 + 13)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [sidePanel, setSidePanel] = useState<'chat' | 'participants' | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const participants = [
    { id: 'teacher', name: 'Prof. Anderson', role: 'Teacher', isTeacher: true },
    { id: 's1', name: 'Emma', role: 'Student' },
    { id: 's2', name: 'Liam', role: 'Student' },
    { id: 's3', name: 'Sofia', role: 'Student' },
    { id: 's4', name: 'Noah', role: 'Student' },
    { id: 's5', name: 'Olivia', role: 'Student' },
    { id: 's6', name: 'Ava', role: 'Student' },
    { id: 's7', name: 'Ethan', role: 'Student' },
    { id: 's8', name: 'Mia', role: 'Student' },
  ]

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="brand-shield"><span>BC</span></div>
          <div>
            <h2 className="font-semibold text-navy text-sm">BritishCe44 - Classroom {roomId}</h2>
            <p className="text-[10px] text-gold">Grade {Math.floor((roomId - 1) / 20) + 1} · Interactive</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-gold">
            ⏱ {formatTime(seconds)}
          </span>
          <button onClick={() => setSidePanel(sidePanel === 'chat' ? null : 'chat')}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            💬
          </button>
          <button onClick={() => setSidePanel(sidePanel === 'participants' ? null : 'participants')}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            👥
          </button>
          <button onClick={onClose}
            className="p-2 hover:bg-red-50 rounded-full text-red-500">
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 grid grid-cols-5 grid-rows-4 gap-1 p-2 bg-gray-50/80">
          {participants.map((p, i) => {
            const pos = i === 0 ? 'row-span-1 col-span-1' :
              i <= 4 ? 'row-span-1 col-span-1' : 'row-span-1 col-span-1'
            return (
              <div key={p.id}
                className={`rounded-xl bg-white shadow-sm border flex flex-col items-center justify-center relative
                  ${p.isTeacher ? 'border-2 border-gold shadow-gold/20' : 'border-gray-100'}
                  ${p.id === 's1' || p.id === 's2' ? 'cursor-pointer' : ''}`}
                style={{ gridRow: i < 5 ? 1 : i < 7 ? 2 : 3, gridColumn: i === 0 ? 1 : i <= 4 ? i + 1 : i === 5 ? 1 : 5 }}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white text-xs font-bold">
                  {p.name[0]}
                </div>
                <span className="text-[9px] font-medium text-navy mt-0.5">{p.name}</span>
              </div>
            )
          })}
          <div className="col-span-3 row-span-3 col-start-2 row-start-2 bg-white rounded-xl shadow-lg border border-gold/20 overflow-hidden">
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Whiteboard</title>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"><\/script>
                <style>body{margin:0;background:#fff;height:100vh;}canvas{width:100%;height:100%;display:block;}</style>
                </head><body><canvas id="c"></canvas>
                <script>
                  const c=new fabric.Canvas('c',{width:800,height:500,isDrawingMode:true});
                  c.freeDrawingBrush.color='#000';c.freeDrawingBrush.width=3;
                  window.addEventListener('resize',()=>c.setDimensions({width:window.innerWidth-40,height:window.innerHeight-40}));
                <\/script></body></html>`}
              className="w-full h-full border-none"
              title="Whiteboard"
            />
          </div>
        </div>

        {sidePanel && (
          <div className="w-72 bg-white border-l border-gold/20 flex flex-col">
            <div className="p-3 border-b border-gold/10 font-semibold text-sm flex justify-between">
              <span>{sidePanel === 'chat' ? '💬 Chat' : '👥 Participants'}</span>
              <button onClick={() => setSidePanel(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scroll">
              {sidePanel === 'chat' ? (
                <>
                  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                    <strong>System:</strong> Welcome to the classroom!
                  </div>
                  <div className="flex gap-2 mt-auto pt-2 border-t">
                    <input placeholder="Type message..."
                      className="flex-1 border rounded-full px-3 py-1.5 text-xs" />
                    <button className="bg-gold text-navy px-3 py-1.5 rounded-full text-xs font-bold">Send</button>
                  </div>
                </>
              ) : (
                participants.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm p-1.5 hover:bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                      {p.name[0]}
                    </div>
                    <span className="text-xs">{p.name} {p.isTeacher ? '👑' : ''}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-16 bg-navy/90 backdrop-blur border-t border-gold/20 flex items-center justify-center gap-3 px-4">
        {[
          { icon: isMuted ? '🔇' : '🎤', label: isMuted ? 'Unmute' : 'Mute', active: !isMuted, onClick: () => setIsMuted(!isMuted) },
          { icon: isCameraOn ? '📹' : '🚫📹', label: isCameraOn ? 'Camera' : 'Off', active: isCameraOn, onClick: () => setIsCameraOn(!isCameraOn) },
          { icon: '✋', label: handRaised ? 'Lower' : 'Raise', active: handRaised, onClick: () => setHandRaised(!handRaised) },
          { icon: '👍', label: 'React' },
          { icon: '📱', label: 'More' },
          { icon: '🚪', label: 'Leave', danger: true, onClick: onClose },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-white text-[10px] font-medium transition
              ${btn.danger ? 'hover:bg-red-500/20 text-red-300' :
                btn.active ? 'bg-gold text-navy font-bold' : 'hover:bg-white/10'}`}>
            <span className="text-lg">{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
