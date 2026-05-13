'use client'

import { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Message {
  id: string
  sender_id: string
  sender_name: string
  content: string
  created_at: string
}

interface Props {
  roomId: string
  currentUserId: string
  currentUserName: string
  initialMessages: Message[]
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ChatWindow({ roomId, currentUserId, currentUserName, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseBrowserClient()

  // 실시간 구독
  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  // 새 메시지 오면 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setSending(true)
    setInput('')

    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      content: text,
    })

    setSending(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <span className="text-4xl mb-2">💬</span>
            <p className="text-sm">첫 메시지를 보내보세요!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              {!isMine && (
                <span className="text-xs text-gray-500 mb-1 ml-1">🧑‍🌾 {msg.sender_name}</span>
              )}
              <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                    ${isMine
                      ? 'bg-[#2E7D32] text-white rounded-br-sm'
                      : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-sm'
                    }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <form
        onSubmit={handleSend}
        className="border-t-2 border-[#FFD600] bg-white p-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 border-2 border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#2E7D32]"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-[#2E7D32] text-white font-bold px-5 py-2 rounded-full text-sm
            hover:bg-[#1B5E20] active:scale-95 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </form>
    </div>
  )
}
