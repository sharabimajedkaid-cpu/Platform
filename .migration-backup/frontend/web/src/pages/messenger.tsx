'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export function MessengerPage() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const contacts = [
    { id: '1', name: 'Admin Britishce44', role: 'admin', online: true },
    { id: '2', name: 'T.Suhair Almojahid', role: 'teacher', online: true },
    { id: '3', name: 'T.Shihab Alomary', role: 'teacher', online: false },
    { id: '4', name: 'Student 1', role: 'student', online: true },
    { id: '5', name: 'Supervisor', role: 'supervisor', online: true },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">💬 CE4 Messenger</h2>
      <p className="text-sm text-gray-500">Built-in enterprise messaging — alternative to WhatsApp</p>
      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="lg:w-1/3 bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto custom-scroll">
          <input placeholder="🔍 Search contacts..."
            className="w-full border rounded-full px-4 py-2 text-sm mb-3" />
          {contacts.map(c => (
            <div key={c.id} onClick={() => setActiveChat(c.id)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${activeChat === c.id ? 'bg-gold/10' : 'hover:bg-gray-100'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${c.online ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium text-sm">{c.name}</span>
              <span className="text-[10px] text-gray-400 ml-auto">{c.role}</span>
            </div>
          ))}
        </div>
        <div className="lg:w-2/3 bg-white rounded-xl p-4 shadow flex flex-col min-h-[400px]">
          {activeChat ? (
            <>
              <div className="font-semibold text-navy mb-2 pb-2 border-b">
                Chat with {contacts.find(c => c.id === activeChat)?.name}
              </div>
              <div className="flex-1 overflow-y-auto custom-scroll space-y-2 mb-3 text-sm text-gray-400 flex items-center justify-center">
                💬 Start a conversation
              </div>
              <div className="flex gap-2">
                <input value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm"
                  onKeyDown={e => e.key === 'Enter' && setMessage('')} />
                <button className="bg-navy text-white px-5 py-2 rounded-full text-sm">Send</button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
