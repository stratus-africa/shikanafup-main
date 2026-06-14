"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "motion/react"
import { Cookie } from "lucide-react"
import { useCookie } from "@/context/cookie-context"

export function CookieConsent() {
    const { consent, updateConsent } = useCookie()
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Hide on admin routes
        if (!pathname.startsWith("/admin") && consent === null) {
            // Delay showing for a smoother entry
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [pathname, consent])

    const handleAction = (action: "accept" | "decline") => {
        updateConsent(action)
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[100]"
            >
                <div className="bg-white border border-border shadow-2xl rounded-xl p-6 relative overflow-hidden">
                    {/* Subtle background decoration */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-secondary/5 rounded-full w-24 h-24" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <Cookie className="text-secondary w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Cookies Policy</h3>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            Shikana Frontliners for Unity Party uses cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                            By clicking "Accept", you consent to our use of cookies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-lg"
                                onClick={() => handleAction("decline")}
                            >
                                Decline
                            </Button>
                            <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
                                onClick={() => handleAction("accept")}
                            >
                                Accept All
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
