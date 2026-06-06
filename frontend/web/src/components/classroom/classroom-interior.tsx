'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useWebRTC } from '../webrtc/webrtc-provider'
import { useAuth } from '../providers/auth-provider'
import { ParticipantTile } from './participant-tile'
import type { TileParticipant } from './participant-tile'
import { SidePanel } from './side-panel'
import { WhiteboardArea } from './whiteboard-area'
import { TimerPopup } from './timer-popup'
import { ComponentModal } from './component-modal'
import { MonkeyBot } from './monkey-bot'
import { EmojiReaction } from './emoji-reaction'

interface ChatMessage {
  id: string
  sender: string
  text: string
  timestamp: number
}

interface ClassroomInteriorProps {
  roomId: number
  onClose: () => void
  dir?: 'ltr' | 'rtl'
}

export function ClassroomInterior({ roomId, onClose, dir = 'ltr' }: ClassroomInteriorProps) {
  const { user } = useAuth()
  const { isConnected, isMuted, isCameraOn, isScreenSharing, localStream, remoteParticipants, breakouts, currentBreakoutId, joinClassroom, leaveClassroom, toggleMic, toggleCamera, toggleScreenShare, createBreakout, joinBreakout, leaveBreakout, refreshBreakouts, restartIce } = useWebRTC()
  const [seconds, setSeconds] = useState(0)
  const [handRaised, setHandRaised] = useState(false)
  const [sideTab, setSideTab] = useState<'chat' | 'participants' | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '0', sender: 'System', text: 'Welcome to the classroom!', timestamp: Date.now() }])
  const [showTimer, setShowTimer] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showMonkey, setShowMonkey] = useState(false)
  const [fullscreenTile, setFullscreenTile] = useState<string | null>(null)
  const [wbLayout, setWbLayout] = useState<'grid' | 'full'>('grid')
  const [showBreakoutPanel, setShowBreakoutPanel] = useState(false)
  const [breakoutName, setBreakoutName] = useState('')
  const [breakoutAutoClose, setBreakoutAutoClose] = useState(15)
  const joinedRef = useRef(false)
  const chatIdCounter = useRef(1)

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Guest'
  const userId = user?.id || user?.email || 'guest'

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!user || joinedRef.current) return
    joinedRef.current = true
    joinClassroom(roomId, userId, userName)
      .catch((err: Error) => setJoinError(err.message))
    return () => { leaveClassroom(); joinedRef.current = false }
  }, [user, roomId, userId, userName, joinClassroom, leaveClassroom])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const allParticipants: TileParticipant[] = useMemo(() => {
    const list: TileParticipant[] = []
    if (user) {
      list.push({
        id: 'local',
        name: userName,
        role: user.role,
        isTeacher: user.role === 'teacher',
        isLocal: true,
        stream: localStream,
        isMuted,
        isCameraOn,
        handRaised,
      })
    }
    remoteParticipants.forEach(p => {
      list.push({
        id: p.id,
        name: p.name || p.userId,
        role: 'student',
        stream: p.stream,
        isMuted: false,
        isCameraOn: true,
      })
    })
    return list
  }, [user, userName, localStream, remoteParticipants, isMuted, isCameraOn, handRaised])

  const handleSendMessage = useCallback((text: string) => {
    const id = String(chatIdCounter.current++)
    setMessages(prev => [...prev, { id, sender: userName, text, timestamp: Date.now() }])
  }, [userName])

  const handleReact = useCallback((emoji: string) => {
    const id = String(chatIdCounter.current++)
    setMessages(prev => [...prev, { id, sender: 'System', text: `${userName} reacted ${emoji}`, timestamp: Date.now() }])
  }, [userName])

  const handleWbSync = useCallback((json: string) => {
    // In production, emit whiteboard-update via socket
  }, [])

  return (
    <div dir={dir} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
      <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-white text-[9px] font-black shadow-sm">
            BC
          </div>
          <div>
            <h2 className="font-semibold text-navy text-sm">Classroom {roomId}</h2>
            <p className="text-[9px] text-gray-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-amber-400'} inline-block`} />
              {isConnected ? 'Live' : 'Connecting...'} · {formatTime(seconds)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { refreshBreakouts(); setShowBreakoutPanel(!showBreakoutPanel) }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition ${showBreakoutPanel ? 'bg-orange-200 text-orange-700' : 'hover:bg-gray-100 text-gray-500'}`}>
            🏠 Breakout
            {breakouts.length > 0 && <span className="ml-1 text-[8px]">({breakouts.length})</span>}
          </button>
          {currentBreakoutId && (
            <span className="text-[8px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              Breakout
            </span>
          )}
          <button onClick={() => setShowTimer(!showTimer)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition ${showTimer ? 'bg-gold/20 text-navy' : 'hover:bg-gray-100 text-gray-500'}`}>
            ⏱ Timer
          </button>
          <button onClick={() => setWbLayout(wbLayout === 'full' ? 'grid' : 'full')} title="Toggle whiteboard layout"
            className="px-2 py-1 rounded-full hover:bg-gray-100 text-gray-500 text-xs">
            {wbLayout === 'full' ? '⊞' : '⊟'}
          </button>
          <button onClick={() => setSideTab(sideTab === 'chat' ? null : 'chat')}
            className={`p-1.5 rounded-full transition text-sm ${sideTab === 'chat' ? 'bg-gold/20' : 'hover:bg-gray-100 text-gray-500'}`}>
            💬
          </button>
          <button onClick={() => setSideTab(sideTab === 'participants' ? null : 'participants')}
            className={`p-1.5 rounded-full transition text-sm ${sideTab === 'participants' ? 'bg-gold/20' : 'hover:bg-gray-100 text-gray-500'}`}>
            👥
          </button>
          <button onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition text-xs">
            ✕
          </button>
        </div>
      </header>

      {joinError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-600">
          ⚠ {joinError}
        </div>
      )}

      {showBreakoutPanel && (
        <div className="border-b border-orange-200 bg-orange-50/80 px-4 py-2 flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-orange-700">🏠 Breakout Rooms</span>
          <div className="flex items-center gap-2 flex-wrap">
            <input value={breakoutName} onChange={e => setBreakoutName(e.target.value)}
              placeholder="Room name..." className="border border-orange-200 rounded px-2 py-0.5 text-[10px] w-28 outline-none focus:border-orange-400" />
            <input type="number" min={1} max={120} value={breakoutAutoClose}
              onChange={e => setBreakoutAutoClose(parseInt(e.target.value) || 15)}
              className="border border-orange-200 rounded px-2 py-0.5 text-[10px] w-12 outline-none" />
            <span className="text-[9px] text-orange-500">min</span>
            <button onClick={async () => {
              if (!breakoutName.trim()) return
              await createBreakout(breakoutName.trim(), breakoutAutoClose)
              setBreakoutName('')
              refreshBreakouts()
            }} className="bg-orange-500 text-white px-3 py-0.5 rounded text-[10px] font-bold hover:bg-orange-600 transition">
              Create
            </button>
            <span className="text-[9px] text-orange-400">|</span>
            <button onClick={leaveBreakout} className="text-[10px] text-orange-600 hover:text-orange-800 font-medium">
              {currentBreakoutId ? '⬅ Leave Breakout' : '⟳ Refresh'}
            </button>
          </div>
          {breakouts.map(b => (
            <button key={b.id} onClick={() => joinBreakout(b.id)}
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border transition
                ${currentBreakoutId === b.id ? 'bg-orange-200 text-orange-800 border-orange-300' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-100'}`}>
              {b.name} ({b.participantCount})
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {wbLayout === 'full' ? (
            <WhiteboardArea onSyncDraw={handleWbSync} />
          ) : (
            <div className="flex flex-1 min-h-0">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-2 p-2 bg-gray-50/80">
                  {allParticipants.map((p, i) => (
                    <ParticipantTile
                      key={p.id}
                      participant={p}
                      onDoubleClick={() => setFullscreenTile(fullscreenTile === p.id ? null : p.id)}
                      className={fullscreenTile === p.id ? 'col-span-4 row-span-2 row-start-1 z-10' : ''}
                      style={fullscreenTile && fullscreenTile !== p.id ? { display: 'none' } : undefined}
                    />
                  ))}
                  {allParticipants.length === 0 && (
                    <div className="col-span-4 row-span-2 flex items-center justify-center text-gray-400 text-xs">
                      Waiting for participants...
                    </div>
                  )}
                </div>

                <div className="h-40 border-t border-gray-200 bg-white">
                  <WhiteboardArea onSyncDraw={handleWbSync} />
                </div>
              </div>
            </div>
          )}
        </div>

        {sideTab && (
          <SidePanel
            tab={sideTab}
            messages={messages}
            participants={allParticipants}
            onSendMessage={handleSendMessage}
            onClose={() => setSideTab(null)}
          />
        )}
      </div>

      <div className="h-16 bg-gradient-to-r from-navy to-navy/95 backdrop-blur border-t border-gold/20 flex items-center justify-center gap-1 px-3">
        {[
          { icon: isMuted ? '🔇' : '🎤', label: isMuted ? 'Unmute' : 'Mute', active: !isMuted, onClick: toggleMic },
          { icon: isCameraOn ? '📹' : '🚫📹', label: isCameraOn ? 'Camera' : 'Off', active: isCameraOn, onClick: toggleCamera },
          { icon: isScreenSharing ? '🖥️' : '💻', label: isScreenSharing ? 'Stop Share' : 'Share', active: isScreenSharing, onClick: toggleScreenShare },
          { icon: '✋', label: handRaised ? 'Lower' : 'Hand', active: handRaised, onClick: () => setHandRaised(!handRaised) },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl text-white text-[10px] font-medium transition
              ${btn.active ? 'bg-gold text-navy font-bold shadow-md' : 'hover:bg-white/10 text-white/80'}`}>
            <span className="text-lg leading-none">{btn.icon}</span>
            <span className="leading-none">{btn.label}</span>
          </button>
        ))}

        <EmojiReaction onReact={handleReact} />

        <button onClick={() => setShowMonkey(!showMonkey)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-white text-[10px] font-medium transition
            ${showMonkey ? 'bg-gold text-navy' : 'hover:bg-white/10 text-white/80'}`}>
          <span className="text-lg">🐵</span>
          <span>Quiz</span>
        </button>

        <button onClick={() => setShowModal(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl hover:bg-white/10 text-white text-[10px] font-medium transition text-white/80">
          <span className="text-lg">📱</span>
          <span>More</span>
        </button>

        <button onClick={onClose}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl hover:bg-red-500/20 text-red-300 text-[10px] font-medium transition ml-auto">
          <span className="text-lg">🚪</span>
          <span>Leave</span>
        </button>
      </div>

      <TimerPopup isOpen={showTimer} onClose={() => setShowTimer(false)} />
      <ComponentModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <MonkeyBot isOpen={showMonkey} onClose={() => setShowMonkey(false)} />
    </div>
  )
}
