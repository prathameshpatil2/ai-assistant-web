import { useState, useRef, useEffect } from 'react'
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'

function Sidebar() {
  const { chats, activeChatId, openChat, startNewChat, removeChat, renameChatById } =
    useChatStore()
  const { user, logout } = useAuthStore()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const startEditing = (chat) => {
    setEditingId(chat.chatId || chat._id)
    setEditValue(chat.title || 'New chat')
    setMenuOpenId(null)
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
          const isMenuOpen = menuOpenId === chatId

          return (
            <div
              key={chatId}
              className={`relative flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
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
                  <span className="truncate flex-1">{chat.title || 'New chat'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(isMenuOpen ? null : chatId)
                    }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] px-1.5"
                  >
                    ⋮
                  </button>

                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      onClick={(e) => e.stopPropagation()}
                      className="glass absolute right-0 top-full mt-1 w-36 rounded-lg overflow-hidden z-20 shadow-xl"
                    >
                      <button
                        onClick={() => startEditing(chat)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-raised)] transition-colors"
                      >
                        ✎ Rename
                      </button>
                      <button
                        onClick={() => {
                          removeChat(chatId)
                          setMenuOpenId(null)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[var(--color-surface-raised)] transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
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