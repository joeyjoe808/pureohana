'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    vision: '',
    referral: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        vision: '',
        referral: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-luxury shadow-luxury">
      <div>
        <label htmlFor="name" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="eventType" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Event Type *
        </label>
        <select
          id="eventType"
          required
          value={formData.eventType}
          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
        >
          <option value="">Select event type</option>
          <option value="Wedding">Wedding</option>
          <option value="Family">Family Portrait</option>
          <option value="Maternity">Maternity</option>
          <option value="Event">Event</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Event Date
        </label>
        <input
          type="date"
          id="eventDate"
          value={formData.eventDate}
          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="vision" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          Tell Us Your Vision *
        </label>
        <textarea
          id="vision"
          required
          rows={5}
          value={formData.vision}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500 resize-none"
          placeholder="Share your story and what you're hoping to capture..."
        />
      </div>

      <div>
        <label htmlFor="referral" className="block text-sm font-serif font-semibold text-charcoal-900 mb-2">
          How Did You Hear About Us?
        </label>
        <input
          type="text"
          id="referral"
          value={formData.referral}
          onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
          className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
          placeholder="Instagram, Google, friend recommendation, etc."
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-ocean-50 border border-ocean-200 text-ocean-900 px-4 py-3 rounded-lg space-y-3">
          <p className="font-semibold">Thank you! We'll be in touch soon.</p>
          <p className="text-sm">Want to schedule a consultation call right away?</p>
          <a
            href="https://calendly.com/pureohanatreasures/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
          >
            Schedule Consultation
          </a>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-lg">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  )
}
