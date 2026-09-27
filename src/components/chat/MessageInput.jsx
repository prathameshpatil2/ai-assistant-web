import { useState, useRef } from 'react'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function MessageInput({ onSend, sending }) {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [listening, setListening] = useState(false)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((!text.trim() && !imageFile) || sending) return

    let image = null
    if (imageFile) {
      const base64 = await fileToBase64(imageFile)
      image = { data: base64, mimeType: imageFile.type }
    }

    onSend(text || 'Describe this image', image)
    setText('')
    clearImage()
  }

  return (
    <div className="border-t border-[var(--color-border)]">
      {imagePreview && (
        <div className="px-4 pt-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Attached" className="h-16 w-16 object-cover rounded-lg" />
            <button
              onClick={clearImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full w-5 h-5 flex items-center justify-center text-xs text-[var(--color-text-muted)] hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          title="Attach image"
        >
          📎
        </button>

        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`border rounded-lg px-3 transition-colors ${
            listening
              ? 'bg-red-500/20 border-red-400 text-red-400 animate-pulse'
              : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
          title={listening ? 'Stop listening' : 'Voice input'}
        >
          🎤
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={listening ? 'Listening...' : 'Message your AI assistant...'}
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
    </div>
  )
}

export default MessageInput