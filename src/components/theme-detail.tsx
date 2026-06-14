'use client'

import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "motion/react"

interface ThemeDetailProps {
    theme: {
        title: string
        subtitle: string
        content: string // HTML string
    }
}

export function ThemeDetail({ theme }: ThemeDetailProps) {
    return (
        <main className="w-full">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-primary py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        {theme.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/90 font-light"
                    >
                        {theme.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <Link
                        href="/shared-ui/about"
                        className="inline-flex items-center text-secondary hover:text-secondary/80 mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to About Us
                    </Link>
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary/80"
                        dangerouslySetInnerHTML={{ __html: theme.content }}
                    />

                    <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                        <Link href="/shared-ui/about">
                            <Button variant="outline">
                                <ArrowLeft size={16} className="mr-2" /> Back to About Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    )
}
