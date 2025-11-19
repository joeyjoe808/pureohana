import { Metadata } from 'next'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Pure Ohana Treasures',
  description: 'Privacy Policy for Pure Ohana Treasures photography services.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto prose prose-charcoal">
          <Heading level={1} className="text-center mb-8">
            Privacy Policy
          </Heading>

          <p className="text-center text-charcoal-600 mb-12">
            Last Updated: November 18, 2024
          </p>

          <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Introduction</h2>
              <p className="text-charcoal-700 leading-relaxed">
                Pure Ohana Treasures LLC ("we," "us," or "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website or use our photography services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Information We Collect</h2>

              <h3 className="text-xl font-serif font-semibold text-charcoal-800 mb-3 mt-6">Personal Information</h3>
              <p className="text-charcoal-700 leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
                <li>Fill out our contact form</li>
                <li>Book photography services</li>
                <li>Subscribe to our newsletter</li>
                <li>Communicate with us via email or phone</li>
              </ul>
              <p className="text-charcoal-700 leading-relaxed mt-3">
                This information may include: name, email address, phone number, event details,
                event date, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-serif font-semibold text-charcoal-800 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-charcoal-700 leading-relaxed mb-3">
                When you visit our website, we may automatically collect certain information about your
                device and browsing activity, including:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>

              <h3 className="text-xl font-serif font-semibold text-charcoal-800 mb-3 mt-6">Cookies and Tracking Technologies</h3>
              <p className="text-charcoal-700 leading-relaxed">
                We use cookies and similar tracking technologies (including Google Analytics and Google Ads)
                to track activity on our website and hold certain information. Cookies are files with a small
                amount of data that may include an anonymous unique identifier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">How We Use Your Information</h2>
              <p className="text-charcoal-700 leading-relaxed mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
                <li>To respond to your inquiries and provide customer service</li>
                <li>To schedule and coordinate photography sessions</li>
                <li>To send you updates about your bookings</li>
                <li>To improve our website and services</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To analyze website usage and trends</li>
                <li>To comply with legal obligations</li>
                <li>To measure the effectiveness of our advertising campaigns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Google Ads and Analytics</h2>
              <p className="text-charcoal-700 leading-relaxed">
                We use Google Ads conversion tracking and Google Analytics to understand how visitors
                interact with our website and to measure the effectiveness of our advertising campaigns.
                These services may collect information about your visit, including pages viewed, time spent
                on the site, and other interaction data. This information is used to improve our services
                and advertising.
              </p>
              <p className="text-charcoal-700 leading-relaxed mt-3">
                You can opt out of Google Analytics by installing the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocean-600 hover:text-ocean-700 underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Photography and Image Rights</h2>
              <p className="text-charcoal-700 leading-relaxed">
                As a photography business, we take special care with your images. Unless otherwise agreed
                upon in writing:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2 mt-3">
                <li>We retain copyright to all photographs we create</li>
                <li>Clients receive a license to use photographs for personal purposes</li>
                <li>We may use photographs for portfolio, marketing, and promotional purposes unless you opt out</li>
                <li>We will not sell or license your images to third parties without your explicit consent</li>
              </ul>
              <p className="text-charcoal-700 leading-relaxed mt-3">
                If you do not wish for your photos to be used for marketing purposes, please let us know
                at the time of booking or contact us at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">How We Share Your Information</h2>
              <p className="text-charcoal-700 leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share
                your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with third-party service
                providers who help us operate our business (e.g., email services, payment processors,
                website hosting)</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by
                law or in response to valid legal requests</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale
                of assets, your information may be transferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Data Security</h2>
              <p className="text-charcoal-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet or electronic storage is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Data Retention</h2>
              <p className="text-charcoal-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined
                in this Privacy Policy, unless a longer retention period is required or permitted by law.
                Photography files are typically retained for a minimum of 90 days after delivery, though we
                may keep them longer for archival purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Your Rights and Choices</h2>
              <p className="text-charcoal-700 leading-relaxed mb-3">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
                <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> You can request that we correct inaccurate information</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal information</li>
                <li><strong>Opt-out:</strong> You can opt out of marketing communications at any time</li>
                <li><strong>Cookies:</strong> You can control cookies through your browser settings</li>
              </ul>
              <p className="text-charcoal-700 leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the information below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Third-Party Links</h2>
              <p className="text-charcoal-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the
                privacy practices or content of these external sites. We encourage you to read the privacy
                policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Children's Privacy</h2>
              <p className="text-charcoal-700 leading-relaxed">
                Our services are not directed to children under the age of 13. We do not knowingly collect
                personal information from children under 13. If you are a parent or guardian and believe
                your child has provided us with personal information, please contact us so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-charcoal-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last Updated" date. You are
                advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Limitation of Liability</h2>
              <p className="text-charcoal-700 leading-relaxed">
                To the fullest extent permitted by law, Pure Ohana Treasures LLC shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages resulting from your
                use of our website or services. Our total liability for any claim arising out of or relating
                to this Privacy Policy or our services shall not exceed the amount paid by you, if any,
                for accessing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-4">Contact Us</h2>
              <p className="text-charcoal-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                data practices, please contact us:
              </p>
              <div className="bg-cream-50 p-6 rounded-lg">
                <p className="text-charcoal-900 font-semibold mb-2">Pure Ohana Treasures LLC</p>
                <p className="text-charcoal-700">Email: <a href="mailto:pureohanatreasures@gmail.com" className="text-ocean-600 hover:text-ocean-700 underline">pureohanatreasures@gmail.com</a></p>
                <p className="text-charcoal-700">Location: Aiea, Oahu, Hawaii</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-charcoal-200 text-center">
              <Link
                href="/"
                className="text-ocean-600 hover:text-ocean-700 font-semibold underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
