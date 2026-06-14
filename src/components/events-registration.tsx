'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, Send, Loader2 } from 'lucide-react'
import api from "@/lib/axios"
import { useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

interface EventsRegistrationProps {
  eventId?: string | number
}

function RegistrationForm({ eventId }: EventsRegistrationProps) {
  const searchParams = useSearchParams()

  // Get event details from URL parameters
  const event = {
    title: searchParams.get('title') || 'Event',
    event_date: searchParams.get('date') || '',
    location: searchParams.get('location') || '',
    isPaid: searchParams.get('isPaid') === 'true',
    amount: Number(searchParams.get('amount')) || 0
  }

  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '254',
  })

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | ''>('')
  const [consent, setConsent] = useState(false)

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim().length >= 9 &&
    consent &&
    (event.isPaid ? paymentMethod !== "" : true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      toast.error("You must agree to the Terms & Conditions")
      return
    }
    if (event.isPaid && !paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        event_id: eventId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        payment_method: paymentMethod || null,
      }

      // Note: In a real app, you might want to validate the ID or handle the submission 
      // even if the event details weren't fetched. The ID is passed from the route.
      await api.post('/api/events/book-event', payload)
      toast.success("Registration successful!")
      setFormData({ firstName: '', lastName: '', email: '', phone: '254' })
      setPaymentMethod('')
      setConsent(false)
    } catch (error) {
      console.error("Registration failed", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="px-4 py-8 md:py-12">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Register for {event.title}</h1>
          <p className="text-muted-foreground text-lg">{event.event_date} {event.location && `at ${event.location}`}</p>
          {event.isPaid && <p className="text-secondary font-bold mt-2">Registration Fee: KES {event.amount}</p>}
        </div>
      </div>
      <Card className="max-w-2xl mx-auto border border-border shadow-none p-8">
        <h3 className="text-xl font-bold text-foreground mb-6">Your Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
              <Input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
              <Input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <Input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
            <Input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "")
                setFormData(prev => ({
                  ...prev,
                  phone: val.startsWith("0") ? "254" + val.substring(1) : val
                }))
              }}
              className="h-10 border-border rounded-lg bg-background px-4 transition-colors focus:border-secondary"
              placeholder="2547XXXXXXXX"
            />
          </div>

          {/* Conditional Payment Options */}
          {event.isPaid && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground mb-2">Payment Method *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all shadow-none ${paymentMethod === 'mpesa' ? 'border-secondary' : 'border-border hover:bg-muted/10'}`}
                >
                  <span className="font-bold">M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all shadow-none ${paymentMethod === 'airtel' ? 'border-secondary' : 'border-border hover:bg-muted/10'}`}
                >
                  <span className="font-bold">Airtel Money</span>
                </button>
              </div>
            </div>
          )}

          {/* Consent */}
          <div className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/10 transition-colors">
            <input
              type="checkbox"
              id="consent"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 rounded mt-1 accent-secondary"
            />
            <label htmlFor="consent" className="text-sm text-foreground cursor-pointer">
              I agree to the <Link href="/shared-ui/terms" className="text-secondary hover:underline">Terms & Conditions</Link> and <Link href="/shared-ui/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className="w-full bg-secondary text-white h-10 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {event.isPaid ? 'Proceed to Pay' : 'Submit Registration'}
          </button>
        </form>
      </Card>
    </main>
  )
}

export default function EventsRegistration(props: EventsRegistrationProps) {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
      <RegistrationForm {...props} />
    </Suspense>
  )
}
