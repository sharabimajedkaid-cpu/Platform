
import { useRef, useState, useEffect, useCallback } from 'react'
import * as fabric from 'fabric'

type Tool = 'pen' | 'line' | 'rect' | 'circle' | 'triangle' | 'diamond' | 'arrow' | 'text' | 'eraser'
type Position = 'main' | 'chat'
type AILang = 'en' | 'ar'

const COLORS = ['#000000', '#c8a84e', '#1e3a5f', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']
const STROKE_WIDTHS = [2, 4, 6, 10, 16]

const AI_LABELS: Record<AILang, { explain: string; translate: string; quiz: string; activity: string; game: string }> = {
  en: { explain: '🤖 Explain', translate: '🌐 Translate', quiz: '❓ Quiz', activity: '🎯 Activity', game: '🎮 Game' },
  ar: { explain: '🤖 شرح', translate: '🌐 ترجمة', quiz: '❓ اختبار', activity: '🎯 نشاط', game: '🎮 لعبة' },
}

interface WhiteboardAreaProps {
  onSyncDraw?: (json: string) => void
  syncDrawings?: string[]
  lang?: AILang
}

export function WhiteboardArea({ onSyncDraw, syncDrawings, lang = 'en' }: WhiteboardAreaProps) {
  const aiLabels = AI_LABELS[lang]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [showColors, setShowColors] = useState(false)
  const [showStroke, setShowStroke] = useState(false)
  const [pinnedSide, setPinnedSide] = useState<Position | null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [wbChat, setWbChat] = useState<{ sender: string; text: string }[]>([])
  const undoStack = useRef<string[]>([])

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasRef.current.parentElement?.clientWidth || 800,
      height: canvasRef.current.parentElement?.clientHeight || 500,
      isDrawingMode: true,
      backgroundColor: '#ffffff',
    })
    const brush = new fabric.PencilBrush(canvas)
    brush.color = '#000000'
    brush.width = 3
    canvas.freeDrawingBrush = brush
    fabricRef.current = canvas

    const saveState = () => {
      undoStack.current.push(JSON.stringify(canvas.toJSON()))
      if (undoStack.current.length > 50) undoStack.current.shift()
      const json = JSON.stringify(canvas.toJSON())
      onSyncDraw?.(json)
    }

    canvas.on('object:added', saveState)
    canvas.on('object:modified', saveState)

    const handleResize = () => {
      const parent = canvasRef.current?.parentElement
      if (parent) {
        canvas.setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current
    canvas.isDrawingMode = tool === 'pen'
    canvas.selection = tool === 'pen'
    if (tool === 'eraser' && canvas.getActiveObject()) {
      canvas.remove(canvas.getActiveObject()!)
    }
  }, [tool])

  useEffect(() => {
    if (!fabricRef.current?.freeDrawingBrush) return
    fabricRef.current.freeDrawingBrush.color = color
  }, [color])

  useEffect(() => {
    if (!fabricRef.current?.freeDrawingBrush) return
    fabricRef.current.freeDrawingBrush.width = strokeWidth
  }, [strokeWidth])

  const addShape = useCallback((shape: Tool) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const opts = { fill: 'transparent', stroke: color, strokeWidth, selectable: true }
    let obj: fabric.Object | null = null
    switch (shape) {
      case 'rect':
        obj = new fabric.Rect({ ...opts, width: 80, height: 60, rx: 4, ry: 4, left: 100, top: 100 })
        break
      case 'circle':
        obj = new fabric.Ellipse({ ...opts, rx: 40, ry: 40, left: 100, top: 100 })
        break
      case 'line':
        obj = new fabric.Line([100, 100, 200, 100], { ...opts })
        break
      case 'triangle':
        obj = new fabric.Triangle({ ...opts, width: 80, height: 80, left: 100, top: 100 })
        break
      case 'diamond':
        obj = new fabric.Polygon([
          { x: 100, y: 50 }, { x: 150, y: 100 },
          { x: 100, y: 150 }, { x: 50, y: 100 },
        ], { ...opts })
        break
      case 'arrow': {
        const points: [number, number, number, number] = [100, 100, 200, 100]
        const dx = points[2] - points[0], dy = points[3] - points[1]
        const angle = Math.atan2(dy, dx)
        const headLen = 12
        new fabric.Line(points, { ...opts })
        canvas.add(new fabric.Polygon([
          { x: points[2], y: points[3] },
          { x: points[2] - headLen * Math.cos(angle - 0.4), y: points[3] - headLen * Math.sin(angle - 0.4) },
          { x: points[2] - headLen * Math.cos(angle + 0.4), y: points[3] - headLen * Math.sin(angle + 0.4) },
        ], { ...opts, fill: color }))
        return
      }
      case 'text': {
        const text = new fabric.IText('Type here', {
          left: 100, top: 100, fontSize: 20, fill: color, fontFamily: 'Arial',
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        return
      }
    }
    if (obj) canvas.add(obj)
  }, [color, strokeWidth])

  const undo = () => {
    const canvas = fabricRef.current
    if (!canvas || undoStack.current.length < 2) return
    undoStack.current.pop()
    const prevState = undoStack.current[undoStack.current.length - 1]
    if (prevState) {
      canvas.loadFromJSON(JSON.parse(prevState), () => canvas.renderAll())
    }
  }

  const clearCanvas = () => {
    const canvas = fabricRef.current
    if (!canvas || !window.confirm('Clear whiteboard?')) return
    canvas.clear()
    canvas.backgroundColor = '#ffffff'
    canvas.renderAll()
    undoStack.current = []
  }

  const handleWbChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMsg.trim()) return
    setWbChat(prev => [...prev, { sender: 'You', text: chatMsg.trim() }])
    setChatMsg('')
  }

  const toolButtons: { tool: Tool; icon: string; label: string }[] = [
    { tool: 'pen', icon: '✏️', label: 'Pen' },
    { tool: 'rect', icon: '⬜', label: 'Rect' },
    { tool: 'circle', icon: '⭕', label: 'Circle' },
    { tool: 'line', icon: '📏', label: 'Line' },
    { tool: 'triangle', icon: '🔺', label: 'Tri' },
    { tool: 'diamond', icon: '🔷', label: 'Dia' },
    { tool: 'arrow', icon: '➡️', label: 'Arrow' },
    { tool: 'text', icon: '🔤', label: 'Text' },
    { tool: 'eraser', icon: '🧹', label: 'Erase' },
  ]

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="flex-1 flex flex-col bg-white relative min-w-0">
        <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {toolButtons.map(btn => (
            <button key={btn.tool} onClick={() => setTool(btn.tool)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition whitespace-nowrap
                ${tool === btn.tool ? 'bg-gold/20 text-navy border border-gold/30' : 'hover:bg-gray-200 text-gray-600'}`}>
              <span className="text-xs">{btn.icon}</span>
              <span className="hidden sm:inline">{btn.label}</span>
            </button>
          ))}
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <div className="relative">
            <button onClick={() => setShowColors(!showColors)}
              className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0" style={{ backgroundColor: color }} />
            {showColors && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border p-2 grid grid-cols-5 gap-1 z-20">
                {COLORS.map(c => (
                  <button key={c} onClick={() => { setColor(c); setShowColors(false) }}
                    className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setShowStroke(!showStroke)}
              className="px-2 py-1 rounded-lg hover:bg-gray-200 text-[10px] text-gray-600 font-medium">
              {strokeWidth}px
            </button>
            {showStroke && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border p-2 z-20 min-w-[100px]">
                {STROKE_WIDTHS.map(w => (
                  <button key={w} onClick={() => { setStrokeWidth(w); setShowStroke(false) }}
                    className={`block w-full text-left px-3 py-1.5 rounded text-xs hover:bg-gold/10 transition ${strokeWidth === w ? 'bg-gold/20 text-navy' : 'text-gray-600'}`}>
                    {w}px {w === 3 && '(Default)'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button onClick={undo} className="px-2 py-1 rounded-lg hover:bg-gray-200 text-xs text-gray-600 font-medium">
            ↩ Undo
          </button>
          <button onClick={clearCanvas} className="px-2 py-1 rounded-lg hover:bg-red-50 text-xs text-red-500 font-medium">
            🗑 Clear
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button onClick={() => setPinnedSide(pinnedSide === 'chat' ? null : 'chat')}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition ${pinnedSide === 'chat' ? 'bg-gold/20 text-navy' : 'hover:bg-gray-200 text-gray-600'}`}>
            💬 Chat Zone
          </button>
          <div className="ml-auto flex items-center gap-1 text-[9px] text-gray-400" dir={lang === 'ar' ? 'rtl' : undefined}>
            <button className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition font-medium">
              {aiLabels.explain}
            </button>
            <button className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition font-medium">
              {aiLabels.translate}
            </button>
            <button className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition font-medium">
              {aiLabels.quiz}
            </button>
            <button className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition font-medium">
              {aiLabels.activity}
            </button>
            <button className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition font-medium">
              {aiLabels.game}
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-50/50">
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
      </div>

      {pinnedSide === 'chat' && (
        <div className="w-60 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-navy">💬 Whiteboard Chat</span>
            <button onClick={() => setPinnedSide(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scroll">
            {wbChat.length === 0 && (
              <p className="text-[9px] text-gray-400 text-center py-4">Discuss the whiteboard here</p>
            )}
            {wbChat.map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-2 py-1.5">
                <p className="text-[8px] font-bold text-navy">{m.sender}</p>
                <p className="text-[10px] text-gray-600">{m.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleWbChat} className="p-2 border-t border-gray-100 flex gap-1">
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              placeholder="Type..."
              className="flex-1 border border-gray-200 rounded-full px-2.5 py-1 text-[10px] outline-none focus:border-gold" />
            <button type="submit" className="bg-gold text-navy px-2.5 py-1 rounded-full text-[9px] font-bold hover:bg-gold/90">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}
