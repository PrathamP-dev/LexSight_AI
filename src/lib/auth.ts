import { cookies } from 'next/headers'
import { getUserById } from './db'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Simple in-memory session storage (in production, use Redis or database)
const sessions = new Map<string, { userId: string; expiresAt: number }>()

export async function createSession(userId: string): Promise<string> {
  const sessionToken = crypto.randomUUID()
  const expiresAt = Date.now() + SESSION_DURATION
  
  sessions.set(sessionToken, { userId, expiresAt })
  
  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
  
  return sessionToken
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionToken) {
    return null
  }
  
  const session = sessions.get(sessionToken)
  
  if (!session) {
    return null
  }
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionToken)
    return null
  }
  
  const user = await getUserById(session.userId)
  
  if (!user) {
    sessions.delete(sessionToken)
    return null
  }
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (sessionToken) {
    sessions.delete(sessionToken)
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME)
}
