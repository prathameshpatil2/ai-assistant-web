import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

function MessageBubble({ role, text }) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[min(75%,640px)] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? 'bg-[var(--color-accent)] text-white rounded-br-md'
            : 'bg-[var(--color-surface-raised)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-md'
        }`}
      >
        {isUser ? (
          text
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble