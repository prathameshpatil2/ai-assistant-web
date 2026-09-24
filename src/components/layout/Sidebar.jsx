import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'

function Sidebar() {
  const { chats, activeChatId, openChat, startNewChat, removeChat } = useChatStore()
  const { user, logout } = useAuthStore()

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
        {chats.map((chat) => (
          <div
            key={chat.chatId || chat._id}
            className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
              activeChatId === (chat.chatId || chat._id)
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]'
            }`}
            onClick={() => openChat(chat.chatId || chat._id)}
          >
            <span className="truncate">{chat.title || 'New chat'}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeChat(chat.chatId || chat._id)
              }}
              className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-red-400 transition-opacity ml-2"
            >
              ✕
            </button>
          </div>
        ))}
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