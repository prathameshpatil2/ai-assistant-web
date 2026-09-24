import { API_URL } from './config'
import useAuthStore from '../store/authStore'

function authHeaders() {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function createChat() {
  const res = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to create chat')
  return res.json()
}

export async function getChats() {
  const res = await fetch(`${API_URL}/chats`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load chats')
  return res.json()
}

export async function getChat(chatId) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to load chat')
  return res.json()
}

export async function renameChat(chatId, title) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to rename chat')
  return res.json()
}

export async function sendMessage(chatId, message, provider) {
  const res = await fetch(`${API_URL}/chats/${chatId}/message`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message, provider }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function deleteChat(chatId) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete chat')
  return res.json()
}