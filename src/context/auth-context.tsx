"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

const parseJwtPayload = (token: string): { exp?: number } | null => {
    try {
        const payload = token.split(".")[1]
        if (!payload) return null
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
        const json = atob(padded)
        return JSON.parse(json)
    } catch (error) {
        return null
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const login = useCallback((userData: User, authToken: string) => {
        setUser(userData)
        setToken(authToken)
        sessionStorage.setItem("user", JSON.stringify(userData))
        sessionStorage.setItem("token", authToken)
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("token")
        router.push("/login")
    }, [router])

    useEffect(() => {
        // Check storage on mount
        const storedUser = sessionStorage.getItem("user")
        const storedToken = sessionStorage.getItem("token")

        if (storedUser && storedToken) {
            try {
                const payload = parseJwtPayload(storedToken)
                if (payload?.exp && Date.now() >= payload.exp * 1000) {
                    sessionStorage.removeItem("user")
                    sessionStorage.removeItem("token")
                    setIsLoading(false)
                    return
                }
                setUser(JSON.parse(storedUser))
                setToken(storedToken)
            } catch (e) {
                console.error("Failed to parse user data", e)
                sessionStorage.removeItem("user")
                sessionStorage.removeItem("token")
            }
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (!token) return

        const payload = parseJwtPayload(token)
        if (!payload?.exp) return

        const expiresAtMs = payload.exp * 1000
        const msUntilExpiry = expiresAtMs - Date.now()

        if (msUntilExpiry <= 0) {
            logout()
            return
        }

        const timeoutId = window.setTimeout(() => {
            logout()
        }, msUntilExpiry)

        return () => window.clearTimeout(timeoutId)
    }, [token, logout])

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
