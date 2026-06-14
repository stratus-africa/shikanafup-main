"use client"

import { useState } from "react"
import { Plus, Minus, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

const faqs = [
    {
        question: "What is Shikana Frontliners for Unity Party (SFUP)?",
        answer: "SFUP is a democratic political party founded on the principles of unity, justice, and economic progress. We aim to foster a community where every Kenyan's voice is heard and every citizen has the opportunity to thrive through inclusive governance."
    },
    {
        question: "How can I become a registered member of SFUP?",
        answer: "Joining is easy! You can register online through our 'Become a Member' page. You'll need to provide your basic details, a valid phone number, and choose a membership level (Free, Ordinary, or Life). Alternatively, you can visit any of our regional offices."
    },
    {
        question: "What are the benefits of membership?",
        answer: "As a member, you get to participate in party decision-making, vote in internal elections, attend exclusive forums, and stay informed about our latest policies and events. Members also have the opportunity to serve in leadership roles at various levels."
    },
    {
        question: "How do I pay my membership fees?",
        answer: "For paid memberships (Ordinary and Life), you can process your payment directly on the registration portal using M-Pesa or Airtel Money. Simply enter your payment phone number, and you will receive a prompt on your phone to authorize the transaction."
    },
    {
        question: "How can I volunteer for the party?",
        answer: "We are always looking for passionate individuals to support our cause. You can sign up through our Volunteers page or reach out to us at info@shikana.co.ke. We have roles ranging from community outreach and event organizing to digital media and policy research."
    },
    {
        question: "Is my personal data secure with the party?",
        answer: "Yes, we prioritize data privacy and adhere to the Data Protection Act of Kenya. Your information is stored securely and used exclusively for party-related communications and membership administration."
    }
]

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section className="w-full py-20 bg-background relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto px-4">

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = activeIndex === index
                        return (
                            <div
                                key={index}
                                className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                                    ? "border-secondary/30 bg-secondary/[0.02] shadow-sm"
                                    : "border-border hover:border-secondary/20 hover:bg-muted/30"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`text-lg font-bold transition-colors ${isOpen ? "text-secondary" : "text-foreground group-hover:text-secondary/80"
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 ml-4 transition-transform duration-300 rounded-full p-2 ${isOpen ? "bg-secondary text-white" : "bg-muted text-foreground/50"
                                        }`}>
                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-6 pt-0 text-foreground/70 leading-relaxed border-t border-transparent">
                                                <div className="pt-4 border-t border-secondary/10">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-16 text-center">
                    <div className="p-8 rounded-3xl bg-primary text-white shadow-xl relative overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                            <p className="text-white/80 mb-6 max-w-lg mx-auto">
                                Our support team is ready to help you with any further inquiries or assistance you may need.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a
                                    href="/shared-ui/contact"
                                    className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    Contact Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
