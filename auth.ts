import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser, type User } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await getUserByEmail(credentials.email as string)

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers (Google), create user in database
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await getUserByEmail(profile.email)
        
        if (!existingUser) {
          await createUser({
            email: profile.email,
            name: profile.name || undefined,
            image: (profile as any).picture || undefined,
            emailVerified: new Date()
          })
        }
      }
      return true
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  },

  pages: {
    signIn: "/login",
  },

  trustHost: true,
})
