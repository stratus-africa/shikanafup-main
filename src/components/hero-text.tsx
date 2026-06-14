"use client"

import { motion } from "motion/react"

interface Data {
  title: string
}

export function Herotext({ title }: Data) {
  return (
    <motion.h1
      className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-balance"
      initial={{ color: "#40ffaa" }}
      animate={{
        color: [
          "#0a0a0a",
          "#874b00",
          "#8b4513",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {title}
    </motion.h1>
  )
}
