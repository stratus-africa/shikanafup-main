
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "@/lib/next-shims"
import { supabase } from "@/integrations/supabase/client"
import type { Session } from "@supabase/supabase-js"

interface User {
    id: string
    username: string
    email: string
    first_name?: string
    last_name?: string
    phone?: string
    role?: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const toUser = (session: Session | null): User | null => {
    if (!session?.user) return null
    const meta = (session.user.user_metadata ?? {}) as Record<string, any>
    return {
        id: session.user.id,
        email: session.user.email ?? "",
        username: session.user.email ?? session.user.id,
        first_name: meta.first_name,
        last_name: meta.last_name,
        phone: meta.phone ?? session.user.phone ?? undefined,
        ...meta,
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Kept for API compatibility: the Supabase session is the source of truth,
    // so an explicit login() call only primes state ahead of the auth event.
    const login = useCallback((userData: User, authToken: string) => {
        setUser(userData)
        setToken(authToken)
    }, [])

    const logout = useCallback(async () => {
        await supabase.auth.signOut()
        setUser(null)
        setToken(null)
        router.push("/login")
    }, [router])

    useEffect(() => {
        let active = true

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!active) return
            setUser(toUser(session))
            setToken(session?.access_token ?? null)
            setIsLoading(false)
        })

        supabase.auth.getSession().then(({ data }) => {
            if (!active) return
            setUser(toUser(data.session))
            setToken(data.session?.access_token ?? null)
            setIsLoading(false)
        })

        return () => {
            active = false
            sub.subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const handler = () => logout()
        if (typeof window === "undefined") return
        window.addEventListener("auth:logout", handler)
        return () => window.removeEventListener("auth:logout", handler)
    }, [logout])

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
