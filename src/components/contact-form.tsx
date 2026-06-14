"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "./ui/spinner"
import { Input } from "./ui/input"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  // Check if all fields are filled
  const isValid = Object.values(formData).every((value) => value.trim() !== "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) return

    setLoading(true)

    try {
      const response = await api.post("/api/contact/submit", formData)

      if (response.status === 200 || response.status === 201) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        toast.error("Failed to send message. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Contact Information</h2>
              <p className="text-foreground/70">Have questions? We're here to help and would love to hear from you.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="text-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email</h3>
                  <a href="mailto:shikana@gmail.co.ke" className="text-foreground/70 hover:text-secondary transition-colors block">
                    shikana@gmail.co.ke
                  </a>
                  <a href="mailto:info@shikana.co.ke" className="text-foreground/70 hover:text-secondary transition-colors block">
                    info@shikana.co.ke
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Phone</h3>
                  <a href="tel:+254706357064" className="text-foreground/70 hover:text-secondary transition-colors">
                    0706357064
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-secondary flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Address</h3>
                  <p className="text-foreground/70">
                    Kikinga House, Kiambu Road
                    <br />
                    Opposite Kiambu Referrals Hospital
                    <br />
                    Kiambu County
                    <br />
                    <br />
                    P.O BOX 18234 – 00100
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-secondary bg-background"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full bg-secondary text-white h-10 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
