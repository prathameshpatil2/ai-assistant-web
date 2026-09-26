import { useEffect, useRef } from 'react'
import Sidebar from '../components/layout/Sidebar'
import MessageBubble from '../components/chat/MessageBubble'
import MessageInput from '../components/chat/MessageInput'
import TypingIndicator from '../components/common/TypingIndicator'
import useChatStore from '../store/chatStore'
import useAuthStore from '../store/authStore'
import Orb from '../components/common/Orb'

function ChatPage() {
  const { chats, messages, fetchChats, sendChatMessageStream, sending, provider, setProvider } =
    useChatStore()
  const { isAuthenticated } = useAuthStore()
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated) fetchChats()
  }, [isAuthenticated])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, sending])

  return (
    <div className="flex h-screen relative overflow-hidden">
      <div
        className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          filter: 'blur(120px)',
          opacity: 0.15,
        }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between px-6 py-4 glass !rounded-none !border-t-0 !border-x-0">
          <h2 className="text-[var(--color-text)] font-medium">Chat</h2>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
          >
            <option value="gemini">Gemini</option>
            <option value="groq">Groq</option>
          </select>
        </div>

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 md:px-12 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Orb size={120} />
              <h3 className="text-[var(--color-text)] font-medium mt-4">
                How can I help you today?
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">
                Ask me anything — I can write, explain, debug, or brainstorm with you.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} text={msg.parts?.[0]?.text} />
          ))}
        </div>

        <MessageInput onSend={sendChatMessageStream} sending={sending} />
      </div>
    </div>
  )
}

export default ChatPage