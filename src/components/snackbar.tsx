"use client"

import { useEffect, useState } from "react"

interface SnackbarProps {
  message: string
  type: "success" | "error"
  duration?: number
  onClose: () => void
}

export default function Snackbar({
  message,
  type,
  duration = 3000,
  onClose,
}: SnackbarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show snackbar
    setVisible(true)

    // Hide after duration
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // allow animation to finish
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`
        fixed top-4 left-1/2 
        -translate-x-1/2
        px-6 py-3 rounded-xl shadow-xl z-50 text-white text-center
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "-translate-y-16 opacity-0"}
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  )
}
