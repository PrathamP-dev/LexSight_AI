import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  password?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  userId: string
  name: string
  content: string
  type: string
  created_at: Date
}

// In-memory storage (temporary until database is enabled)
let users: User[] = []
let documents: Document[] = []

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = users.find(u => u.email === email)
  return user || null
}

export async function getUserById(id: string): Promise<User | null> {
  const user = users.find(u => u.id === id)
  return user || null
}

export async function createUser(data: {
  email: string
  name?: string
  image?: string
  password?: string
  emailVerified?: Date
}): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    image: data.image,
    password: data.password,
    emailVerified: data.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  users.push(user)
  return user
}

export async function createUserWithPassword(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  return createUser({
    email,
    password: hashedPassword,
    name,
    emailVerified: new Date()
  })
}

// Document operations
export async function createDocument(data: {
  userId: string
  name: string
  content: string
  type: string
}): Promise<Document> {
  const doc: Document = {
    id: crypto.randomUUID(),
    userId: data.userId,
    name: data.name,
    content: data.content,
    type: data.type,
    created_at: new Date()
  }
  
  documents.push(doc)
  return doc
}

export async function getDocumentsByUserId(userId: string): Promise<Document[]> {
  return documents.filter(doc => doc.userId === userId)
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const doc = documents.find(d => d.id === id)
  return doc || null
}

export async function deleteDocumentById(id: string): Promise<void> {
  documents = documents.filter(doc => doc.id !== id)
}
