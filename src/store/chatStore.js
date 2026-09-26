import { create } from 'zustand'
import { sendMessageStream } from '../api/chats'
import {
  createChat,
  getChats,
  getChat,
  renameChat,
  sendMessage,
  deleteChat,
} from '../api/chats'

const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  provider: 'gemini',
  loadingChats: false,
  loadingMessages: false,
  sending: false,

  setProvider: (provider) => set({ provider }),

  fetchChats: async () => {
    set({ loadingChats: true })
    try {
      const chats = await getChats()
      set({ chats, loadingChats: false })
    } catch (err) {
      console.error(err)
      set({ loadingChats: false })
    }
  },

  openChat: async (chatId) => {
    set({ activeChatId: chatId, loadingMessages: true, messages: [] })
    try {
      const chat = await getChat(chatId)
      set({ messages: chat.history || [], loadingMessages: false })
    } catch (err) {
      console.error(err)
      set({ loadingMessages: false })
    }
  },

  startNewChat: async () => {
    const newChat = await createChat()
    set((state) => ({
      chats: [{ ...newChat, title: 'New chat' }, ...state.chats],
      activeChatId: newChat.chatId,
      messages: [],
    }))
    return newChat.chatId
  },

  sendChatMessage: async (text) => {
    const { activeChatId, provider, messages } = get()
    if (!activeChatId) return

    const userMsg = { role: 'user', parts: [{ text }] }
    set({ messages: [...messages, userMsg], sending: true })

    try {
      const data = await sendMessage(activeChatId, text, provider)
      const aiMsg = { role: 'model', parts: [{ text: data.reply }] }
      set((state) => ({ messages: [...state.messages, aiMsg], sending: false }))
      get().fetchChats()
    } catch (err) {
      console.error(err)
      set({ sending: false })
    }
  },


  sendChatMessageStream: async (text) => {
    const { activeChatId, provider, messages } = get()
    if (!activeChatId) return

    const userMsg = { role: 'user', parts: [{ text }] }
    const aiMsgIndex = messages.length + 1

    set({
      messages: [...messages, userMsg, { role: 'model', parts: [{ text: '' }] }],
      sending: true,
    })

    try {
      await sendMessageStream(
        activeChatId,
        text,
        provider,
        (token) => {
          set((state) => {
            const updated = [...state.messages]
            updated[aiMsgIndex] = {
              role: 'model',
              parts: [{ text: updated[aiMsgIndex].parts[0].text + token }],
            }
            return { messages: updated }
          })
        },
        () => {
          set({ sending: false })
          get().fetchChats()
        }
      )
    } catch (err) {
      console.error(err)
      set({ sending: false })
    }
  },

  renameChatById: async (chatId, title) => {
  const { chats } = get()
  await renameChat(chatId, title)
  set({
      chats: chats.map((c) =>
        (c.chatId || c._id) === chatId ? { ...c, title } : c
      ),
    })
  },

  removeChat: async (chatId) => {
  await deleteChat(chatId)
  set((state) => ({
      chats: state.chats.filter((c) => (c.chatId || c._id) !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
      messages: state.activeChatId === chatId ? [] : state.messages,
    }))
  },
  
}))

export default useChatStore