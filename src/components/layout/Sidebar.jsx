import { useState } from 'react'
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'

function Sidebar() {
  const { chats, activeChatId, openChat, startNewChat, removeChat, renameChatById } =
    useChatStore()
  const { user, logout } = useAuthStore()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const startEditing = (e, chat) => {
    e.stopPropagation()
    setEditingId(chat.chatId || chat._id)
    setEditValue(chat.title || 'New chat')
  }

  const saveEdit = async (chatId) => {
    const trimmed = editValue.trim()
    if (trimmed) {
      await renameChatById(chatId, trimmed)
    }
    setEditingId(null)
  }

  return (
    <div className="w-64 flex flex-col glass !rounded-none !border-y-0 !border-l-0">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-orb-pulse" />
        <span className="text-sm font-medium tracking-wide text-[var(--color-text-muted)]">
          AI ASSISTANT
        </span>
      </div>

      <div className="p-4">
        <button
          onClick={() => startNewChat()}
          className="w-full bg-[var(--color-accent)] text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {chats.map((chat) => {
          const chatId = chat.chatId || chat._id
          const isEditing = editingId === chatId

          return (
            <div
              key={chatId}
              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                activeChatId === chatId
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]'
              }`}
              onClick={() => !isEditing && openChat(chatId)}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => saveEdit(chatId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(chatId)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-accent)] rounded px-1.5 py-0.5 text-sm text-[var(--color-text)] outline-none"
                />
              ) : (
                <>
                  <span className="truncate">{chat.title || 'New chat'}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                    <button
                      onClick={(e) => startEditing(e, chat)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      title="Rename"
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeChat(chatId)
                      }}
                      className="text-[var(--color-text-muted)] hover:text-red-400"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-sm text-[var(--color-text-muted)] truncate">{user?.name}</span>
        <button
          onClick={logout}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar