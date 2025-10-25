/**
 * Contact Page - Pure Ohana Treasures
 *
 * Luxury contact page with inquiry form that integrates with
 * external email automation server via hot link.
 *
 * Features:
 * - Elegant contact form with validation
 * - Email hot link integration
 * - Inquiry saved to Supabase
 * - Success/error handling with Result pattern
 * - Form state management
 */

import { useState } from 'react';
import {
  Hero,
  Section,
  Container,
  Grid,
  Button,
  Body,
  Heading2,
  Heading3,
} from '../design-system';
import { Input, Textarea } from '../design-system/components/Input';
import { useInquiryRepository } from '../infrastructure/container';
import { InquiryFormSchema } from '../domain/validation/schemas';
import { isSuccess } from '../domain/core/Result';
import { z } from 'zod';

/**
 * Contact Page Component
 */
export default function Contact() {
  const inquiryRepo = useInquiryRepository();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle form field change
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  /**
   * Validate form data
   */
  function validateForm(): boolean {
    try {
      InquiryFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Save inquiry to Supabase
      const result = await inquiryRepo.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        event_type: formData.eventType || null,
        event_date: formData.eventDate || null,
        message: formData.message,
        status: 'pending',
      });

      if (isSuccess(result)) {
        // Trigger email automation via hot link
        // This opens mailto: which your external server will intercept
        const emailSubject = `New Inquiry from ${formData.name} - ${formData.eventType}`;
        const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Event Type: ${formData.eventType || 'Not specified'}
Event Date: ${formData.eventDate || 'Not specified'}

Message:
${formData.message}

---
Inquiry ID: ${result.value.id}
Submitted: ${new Date().toLocaleString()}
        `.trim();

        // Create hot link for email automation
        const mailtoLink = `mailto:inquiries@pureohanatreasures.com?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`;

        // Trigger the mailto link (your external server will intercept this)
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.click();

        // Show success message
        setSubmitStatus('success');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          message: '',
        });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl" className="bg-cream-50">
        <Container className="text-center">
          <Hero className="mb-6">Let's Create Something Beautiful</Hero>
          <Body size="lg" className="text-charcoal-600 max-w-2xl mx-auto">
            Ready to capture your special moments? We'd love to hear about your vision
            and discuss how we can bring it to life with artistry and elegance.
          </Body>
        </Container>
      </Section>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <Section spacing="md" className="bg-green-50 border-t-4 border-green-500">
          <Container>
            <div className="text-center">
              <Heading2 className="text-green-800 mb-4">Thank You!</Heading2>
              <Body className="text-green-700">
                Your inquiry has been received. We'll respond within 24 hours.
              </Body>
            </div>
          </Container>
        </Section>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <Section spacing="md" className="bg-red-50 border-t-4 border-red-500">
          <Container>
            <div className="text-center">
              <Heading2 className="text-red-800 mb-4">Oops!</Heading2>
              <Body className="text-red-700">{errorMessage}</Body>
            </div>
          </Container>
        </Section>
      )}

      {/* Contact Form */}
      <Section spacing="2xl">
        <Container>
          <Grid cols={{ sm: 1, lg: 2 }} gap="2xl">
            {/* Form */}
            <div>
              <Heading2 className="mb-8">Send Us an Inquiry</Heading2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Jane Doe"
                  required
                />

                {/* Email */}
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="jane@example.com"
                  required
                />

                {/* Phone */}
                <Input
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="(808) 555-0123"
                />

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-md focus:ring-2 focus:ring-sunset-500 focus:border-sunset-500 transition-all"
                  >
                    <option value="">Select an event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="family">Family Photos</option>
                    <option value="event">Special Event</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
                  )}
                </div>

                {/* Event Date */}
                <Input
                  label="Preferred Date (Optional)"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  error={errors.eventDate}
                />

                {/* Message */}
                <Textarea
                  label="Tell Us About Your Vision"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="Share details about your event, what you're looking for, and any questions you have..."
                  rows={6}
                  required
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-cream-50 p-8 rounded-lg h-fit">
              <Heading3 className="mb-6">Get in Touch</Heading3>

              <div className="space-y-6">
                <ContactInfo
                  icon="📧"
                  label="Email"
                  value="inquiries@pureohanatreasures.com"
                  href="mailto:inquiries@pureohanatreasures.com"
                />

                <ContactInfo
                  icon="📍"
                  label="Location"
                  value="Honolulu, Hawaii"
                />

                <ContactInfo
                  icon="⏰"
                  label="Response Time"
                  value="Within 24 hours"
                />
              </div>

              <div className="mt-8 pt-8 border-t border-charcoal-200">
                <Body size="sm" className="text-charcoal-600">
                  We're excited to learn about your vision and discuss how we can
                  create beautiful, timeless photographs that you'll treasure forever.
                </Body>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}

/**
 * Contact Info Item Component
 */
interface ContactInfoProps {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

function ContactInfo({ icon, label, value, href }: ContactInfoProps) {
  const content = (
    <div className="flex items-start space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <Body size="sm" className="text-charcoal-500 mb-1">
          {label}
        </Body>
        <Body className="text-charcoal-900">{value}</Body>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block hover:bg-cream-100 p-2 -m-2 rounded transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}
