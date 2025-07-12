import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 12, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="text-gray-700 space-y-4">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create an account</li>
                  <li>List items for swapping</li>
                  <li>Communicate with other users</li>
                  <li>Contact our support team</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This may include your name, email address, phone number, location, and profile information.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="text-gray-700 space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, investigate, and prevent fraudulent transactions</li>
                  <li>Personalize and improve your experience</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <div className="text-gray-700 space-y-4">
                <p>We may share your information in the following situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>With other users:</strong> Your profile information and listed items are visible to other
                    users to facilitate swaps
                  </li>
                  <li>
                    <strong>With service providers:</strong> We may share information with third-party vendors who
                    perform services on our behalf
                  </li>
                  <li>
                    <strong>For legal reasons:</strong> We may disclose information if required by law or to protect our
                    rights
                  </li>
                  <li>
                    <strong>Business transfers:</strong> Information may be transferred in connection with a merger,
                    acquisition, or sale of assets
                  </li>
                </ul>
                <p>We do not sell your personal information to third parties for their marketing purposes.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <div className="text-gray-700 space-y-3">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> You can request access to your personal information
                  </li>
                  <li>
                    <strong>Correction:</strong> You can update or correct your information through your account
                    settings
                  </li>
                  <li>
                    <strong>Deletion:</strong> You can request deletion of your account and personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> You can request a copy of your data in a portable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> You can opt out of marketing communications at any time
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to collect and use personal information about you. You
                can control cookies through your browser settings, but disabling cookies may affect the functionality of
                our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that
                such transfers comply with applicable data protection laws and provide appropriate safeguards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@ReWear.com or through
                our contact page.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
