
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
import { RecordingIndicator } from './recording-indicator'
import { TeacherPanel } from './teacher-panel'
import { PollWidget } from './poll-widget'
import { BreakoutManager } from './breakout-manager'
import { ResourceBrowser } from './resource-browser'

type WbLayout = 'grid' | 'full' | 'minimized'

interface ChatMessage {
  id: string; sender: string; text: string; timestamp: number
}
interface ClassroomInteriorProps {
  roomId: number; onClose: () => void; dir?: 'ltr' | 'rtl'
}

export function ClassroomInterior({ roomId, onClose, dir = 'ltr' }: ClassroomInteriorProps) {
  const { user } = useAuth()
  const {
    isConnected, isMuted, isCameraOn, isScreenSharing, localStream, remoteParticipants,
    joinClassroom, leaveClassroom, toggleMic, toggleCamera, toggleScreenShare,
  } = useWebRTC()

  const [seconds, setSeconds] = useState(0)
  const [handRaised, setHandRaised] = useState(false)
  const [sideTab, setSideTab] = useState<'chat' | 'participants' | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', sender: 'System', text: 'Welcome to the classroom!', timestamp: Date.now() }
  ])
  const [showTimer, setShowTimer] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showMonkey, setShowMonkey] = useState(false)
  const [fullscreenTile, setFullscreenTile] = useState<string | null>(null)
  const [wbLayout, setWbLayout] = useState<WbLayout>('grid')
  const [showBreakoutManager, setShowBreakoutManager] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingQuality] = useState('1080p')
  const [isRecordingPaused, setIsRecordingPaused] = useState(false)
  const [roomLocked, setRoomLocked] = useState(false)
  const [showTeacherPanel, setShowTeacherPanel] = useState(false)
  const [showPollCreate, setShowPollCreate] = useState(false)
  const [activePoll, setActivePoll] = useState<any>(null)
  const [liveResults, setLiveResults] = useState<any>(null)
  const [arabicAlertBanner, setArabicAlertBanner] = useState<{ student: string; phrase: string } | null>(null)
  const joinedRef = useRef(false)
  const chatIdCounter = useRef(1)

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Guest'
  const userId = user?.id || user?.email || 'guest'
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!isRecording || isRecordingPaused) return
    const t = setInterval(() => setRecordingTime(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [isRecording, isRecordingPaused])

  useEffect(() => {
    if (!user || joinedRef.current) return
    joinedRef.current = true
    joinClassroom(roomId, userId, userName).catch((err: Error) => setJoinError(err.message))
    return () => { leaveClassroom(); joinedRef.current = false }
  }, [user, roomId, userId, userName, joinClassroom, leaveClassroom])

  // Auto-dismiss Arabic alert after 5s
  useEffect(() => {
    if (!arabicAlertBanner) return
    const t = setTimeout(() => setArabicAlertBanner(null), 5000)
    return () => clearTimeout(t)
  }, [arabicAlertBanner])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const allParticipants: TileParticipant[] = useMemo(() => {
    const list: TileParticipant[] = []
    if (user) {
      list.push({
        id: 'local', name: userName, role: user.role,
        isTeacher: user.role === 'teacher', isLocal: true,
        stream: localStream, isMuted, isCameraOn, handRaised,
      })
    }
    remoteParticipants.forEach(p => {
      list.push({ id: p.id, name: p.name || p.userId, role: 'student', stream: p.stream, isMuted: false, isCameraOn: true })
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

  const handleWbSync = useCallback((_json: string) => {}, [])

  const cycleWbLayout = useCallback(() => {
    setWbLayout(prev =>
      prev === 'grid' ? 'full' : prev === 'full' ? 'minimized' : 'grid'
    )
  }, [])

  const handleStartRecording = useCallback(() => {
    setIsRecording(true); setRecordingTime(0); setIsRecordingPaused(false)
  }, [])
  const handleStopRecording = useCallback(() => {
    setIsRecording(false); setRecordingTime(0); setIsRecordingPaused(false)
  }, [])

  const handleCreatePoll = useCallback((question: string, options: string[]) => {
    setActivePoll({
      id: `poll-${Date.now()}`, question,
      options: options.map(text => ({ id: `opt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, text, votes: 0 })),
      totalVotes: 0, isActive: true,
    })
    setShowPollCreate(false)
  }, [])

  const handleVote = useCallback((pollId: string, optionId: string) => {
    if (!activePoll) return
    const updated = {
      ...activePoll,
      options: activePoll.options.map((o: any) => o.id === optionId ? { ...o, votes: o.votes + 1 } : o),
      totalVotes: activePoll.totalVotes + 1,
    }
    setActivePoll(updated)
    setLiveResults({
      id: updated.id,
      options: updated.options.map((o: any) => ({
        text: o.text, votes: o.votes,
        percent: updated.totalVotes > 0 ? Math.round((o.votes / updated.totalVotes) * 100) : 0,
      })),
      totalVotes: updated.totalVotes,
    })
  }, [activePoll])

  const handleEndPoll = useCallback((pollId: string) => {
    setActivePoll(null)
  }, [])

  const wbIcon = wbLayout === 'grid' ? '⊟' : wbLayout === 'full' ? '⊞' : '▭'
  const wbTitle = wbLayout === 'grid' ? 'Expand whiteboard' : wbLayout === 'full' ? 'Minimize to resources' : 'Restore grid view'

  return (
    <div dir={dir} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gold/20">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gold/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-white text-[9px] font-black shadow-sm">BC</div>
          <div>
            <h2 className="font-semibold text-navy text-sm">Classroom {roomId}</h2>
            <p className="text-[9px] text-gray-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-amber-400'} inline-block`} />
              {isConnected ? 'Live' : 'Connecting...'} · {formatTime(seconds)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <RecordingIndicator isRecording={isRecording} elapsed={recordingTime} quality={recordingQuality}
            isPaused={isRecordingPaused} isTeacher={isTeacher}
            onPause={() => setIsRecordingPaused(true)} onResume={() => setIsRecordingPaused(false)} onStop={handleStopRecording} />

          <button onClick={() => setShowBreakoutManager(!showBreakoutManager)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition
              ${showBreakoutManager ? 'bg-orange-200 text-orange-700' : 'hover:bg-gray-100 text-gray-500'}`}>
            🏠 Breakout
          </button>

          <button onClick={() => setShowTimer(!showTimer)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition
              ${showTimer ? 'bg-gold/20 text-navy' : 'hover:bg-gray-100 text-gray-500'}`}>
            ⏱ Timer
          </button>

          <button onClick={cycleWbLayout} title={wbTitle}
            className={`px-2 py-1 rounded-full text-sm transition
              ${wbLayout === 'minimized' ? 'bg-navy text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
            {wbIcon}
          </button>

          <button onClick={() => setSideTab(sideTab === 'chat' ? null : 'chat')}
            className={`p-1.5 rounded-full transition text-sm ${sideTab === 'chat' ? 'bg-gold/20' : 'hover:bg-gray-100 text-gray-500'}`}>
            💬
          </button>
          <button onClick={() => setSideTab(sideTab === 'participants' ? null : 'participants')}
            className={`p-1.5 rounded-full transition text-sm ${sideTab === 'participants' ? 'bg-gold/20' : 'hover:bg-gray-100 text-gray-500'}`}>
            👥
          </button>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition text-xs">✕</button>
        </div>
      </header>

      {/* ── Banners ── */}
      {joinError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-700 flex items-center gap-2 shrink-0">
          <span>⚠</span>
          <span>Camera/mic unavailable — you are in the classroom without video. {joinError}</span>
        </div>
      )}

      {arabicAlertBanner && (
        <div className="bg-red-50 border-b border-red-300 px-4 py-1.5 text-xs text-red-700 flex items-center gap-2 shrink-0 animate-pulse">
          <span>🛑</span>
          <span><strong>{arabicAlertBanner.student}</strong> spoke Arabic: <em dir="rtl">{arabicAlertBanner.phrase}</em></span>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── MINIMIZED: compact tile strip + resource browser ── */}
          {wbLayout === 'minimized' && (
            <>
              {/* Compact participant strip at top */}
              <div className="h-20 bg-gray-900 flex items-center gap-2 px-2 overflow-x-auto shrink-0 border-b border-gray-700">
                {allParticipants.map(p => (
                  <div key={p.id} className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-navy/20 border border-white/10">
                    {p.stream ? (
                      <video autoPlay playsInline muted={p.isLocal} ref={el => { if (el && p.stream) el.srcObject = p.stream }}
                        className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                          ${p.isTeacher ? 'bg-gold' : 'bg-navy/60'}`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                      <span className="text-white text-[8px] truncate block">{p.name.split(' ')[0]}</span>
                    </div>
                    {p.isMuted && <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                ))}
                <div className="ml-auto px-2 shrink-0">
                  <button onClick={() => setWbLayout('grid')}
                    className="text-[9px] text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition">
                    ⊟ Restore Whiteboard
                  </button>
                </div>
              </div>
              {/* Resource browser fills rest */}
              <div className="flex-1 overflow-hidden">
                <ResourceBrowser onMinimize={() => setWbLayout('grid')} />
              </div>
            </>
          )}

          {/* ── FULL: whiteboard only ── */}
          {wbLayout === 'full' && (
            <WhiteboardArea onSyncDraw={handleWbSync} />
          )}

          {/* ── GRID: participant tiles + whiteboard strip ── */}
          {wbLayout === 'grid' && (
            <div className="flex flex-1 min-h-0">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-2 p-2 bg-gray-50/80">
                  {allParticipants.map(p => (
                    <ParticipantTile key={p.id} participant={p}
                      onDoubleClick={() => setFullscreenTile(fullscreenTile === p.id ? null : p.id)}
                      className={fullscreenTile === p.id ? 'col-span-4 row-span-2 row-start-1 z-10' : ''}
                      style={fullscreenTile && fullscreenTile !== p.id ? { display: 'none' } : undefined} />
                  ))}
                  {allParticipants.length === 0 && (
                    <div className="col-span-4 row-span-2 flex items-center justify-center text-gray-400 text-xs">
                      Waiting for participants…
                    </div>
                  )}
                </div>
                <div className="h-44 border-t border-gray-200 bg-white shrink-0">
                  <WhiteboardArea onSyncDraw={handleWbSync} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Side panels ── */}
        {sideTab && (
          <SidePanel tab={sideTab} messages={messages} participants={allParticipants}
            onSendMessage={handleSendMessage} onClose={() => setSideTab(null)} />
        )}
        {showTeacherPanel && (
          <TeacherPanel isOpen={showTeacherPanel} onClose={() => setShowTeacherPanel(false)}
            participants={allParticipants}
            onMuteAll={() => {}} onSpotlight={() => {}} onLockRoom={setRoomLocked} onEject={() => {}}
            roomLocked={roomLocked} />
        )}
      </div>

      {/* ── Control bar ── */}
      <div className="h-16 bg-gradient-to-r from-navy to-navy/95 backdrop-blur border-t border-gold/20 flex items-center justify-center gap-1 px-3 shrink-0">
        {[
          { icon: isMuted ? '🔇' : '🎤', label: isMuted ? 'Unmute' : 'Mute', active: !isMuted, onClick: toggleMic },
          { icon: isCameraOn ? '📹' : '🚫', label: isCameraOn ? 'Camera' : 'Cam Off', active: isCameraOn, onClick: toggleCamera },
          { icon: isScreenSharing ? '🖥️' : '💻', label: isScreenSharing ? 'Stop Share' : 'Share', active: isScreenSharing, onClick: toggleScreenShare },
          { icon: '✋', label: handRaised ? 'Lower' : 'Hand', active: handRaised, onClick: () => setHandRaised(!handRaised) },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-white text-[10px] font-medium transition
              ${btn.active ? 'bg-gold text-navy font-bold shadow-md' : 'hover:bg-white/10 text-white/80'}`}>
            <span className="text-lg leading-none">{btn.icon}</span>
            <span className="leading-none">{btn.label}</span>
          </button>
        ))}

        {isTeacher && (
          <>
            <button onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[10px] font-medium transition
                ${isRecording ? 'bg-red-500 text-white' : 'hover:bg-white/10 text-white/80'}`}>
              <span className="text-lg">{isRecording ? '⏹' : '🔴'}</span>
              <span>{isRecording ? 'Stop' : 'Record'}</span>
            </button>
            <button onClick={() => setShowTeacherPanel(!showTeacherPanel)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[10px] font-medium transition
                ${showTeacherPanel ? 'bg-gold text-navy' : 'hover:bg-white/10 text-white/80'}`}>
              <span className="text-lg">👨‍🏫</span>
              <span>Manage</span>
            </button>
            <button onClick={() => setShowPollCreate(!showPollCreate)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[10px] font-medium transition
                ${showPollCreate || activePoll ? 'bg-purple-500 text-white' : 'hover:bg-white/10 text-white/80'}`}>
              <span className="text-lg">📊</span>
              <span>Poll</span>
            </button>
            <button
              onClick={() => setWbLayout(prev => prev === 'minimized' ? 'grid' : 'minimized')}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[10px] font-medium transition
                ${wbLayout === 'minimized' ? 'bg-indigo-500 text-white' : 'hover:bg-white/10 text-white/80'}`}>
              <span className="text-lg">🖥️</span>
              <span>Resources</span>
            </button>
          </>
        )}

        <EmojiReaction onReact={handleReact} />

        <button onClick={() => setShowMonkey(!showMonkey)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-white text-[10px] font-medium transition
            ${showMonkey ? 'bg-gold text-navy' : 'hover:bg-white/10 text-white/80'}`}>
          <span className="text-lg">🐵</span>
          <span>Quiz</span>
        </button>

        <button onClick={() => setShowModal(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl hover:bg-white/10 text-white/80 text-[10px] font-medium transition">
          <span className="text-lg">📱</span>
          <span>More</span>
        </button>

        <button onClick={onClose}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl hover:bg-red-500/20 text-red-300 text-[10px] font-medium transition ml-auto">
          <span className="text-lg">🚪</span>
          <span>Leave</span>
        </button>
      </div>

      {/* ── Floating overlays ── */}
      {showBreakoutManager && (
        <BreakoutManager
          teacherName={userName}
          onArabicAlert={alert => setArabicAlertBanner({ student: alert.student, phrase: alert.phrase })}
        />
      )}

      <PollWidget isOpen={showPollCreate || !!activePoll}
        onClose={() => { setShowPollCreate(false); setActivePoll(null) }}
        isTeacher={isTeacher} activePoll={activePoll} liveResults={liveResults}
        onCreatePoll={handleCreatePoll} onVote={handleVote} onEndPoll={handleEndPoll} />

      <TimerPopup isOpen={showTimer} onClose={() => setShowTimer(false)} />
      <ComponentModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <MonkeyBot isOpen={showMonkey} onClose={() => setShowMonkey(false)} />
    </div>
  )
}
