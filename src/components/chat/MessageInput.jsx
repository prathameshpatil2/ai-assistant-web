import { useState } from 'react'

function MessageInput({ onSend, sending }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-[var(--color-border)]">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message your AI assistant..."
        className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-[var(--color-text)] text-[var(--color-bg)] rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {sending ? '...' : 'Send'}
      </button>
    </form>
  )
}

export default MessageInput