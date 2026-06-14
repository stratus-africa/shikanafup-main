"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

type ConsentState = "accept" | "decline" | null

interface CookieContextType {
    consent: ConsentState
    updateConsent: (state: ConsentState) => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

export function CookieProvider({
    children,
    initialConsent,
}: {
    children: React.ReactNode
    initialConsent: ConsentState
}) {
    const [consent, setConsent] = useState<ConsentState>(initialConsent)

    const updateConsent = (state: ConsentState) => {
        if (state === null) {
            Cookies.remove("cookie-consent")
        } else {
            // Set cookie for 365 days
            Cookies.set("cookie-consent", state, { expires: 365, path: "/" })
        }
        setConsent(state)
    }

    return (
        <CookieContext.Provider value={{ consent, updateConsent }}>
            {children}
        </CookieContext.Provider>
    )
}

export function useCookie() {
    const context = useContext(CookieContext)
    if (context === undefined) {
        throw new Error("useCookie must be used within a CookieProvider")
    }
    return context
}
