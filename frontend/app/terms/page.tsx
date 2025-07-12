import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: December 12, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using ReWear ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                ReWear is a platform that facilitates clothing and accessory exchanges between users. We provide the
                technology and infrastructure to connect users who wish to swap items, but we are not a party to the
                actual exchanges between users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <div className="text-gray-700 space-y-3">
                <p>As a user of ReWear, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and truthful information about items you list</li>
                  <li>Only list items that you own and have the right to swap</li>
                  <li>Meet other users in safe, public locations for exchanges</li>
                  <li>Treat other users with respect and courtesy</li>
                  <li>Not use the platform for commercial purposes without authorization</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Prohibited Items</h2>
              <div className="text-gray-700 space-y-3">
                <p>The following items are prohibited on ReWear:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Counterfeit or replica items</li>
                  <li>Items that violate intellectual property rights</li>
                  <li>Damaged items not disclosed as such</li>
                  <li>Items that are illegal to sell or possess</li>
                  <li>Undergarments and swimwear for hygiene reasons</li>
                  <li>Items with offensive or inappropriate content</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Safety and Liability</h2>
              <p className="text-gray-700 mb-4">
                ReWear is not responsible for the safety of users during exchanges or the quality, condition, or
                authenticity of items swapped. Users engage in swaps at their own risk and are encouraged to take
                appropriate safety precautions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Points System</h2>
              <p className="text-gray-700 mb-4">
                ReWear operates a points system to facilitate exchanges. Points have no monetary value and cannot be
                exchanged for cash. We reserve the right to modify the points system at any time with reasonable notice
                to users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via
                email or through the platform. Continued use of the Service after such modifications constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at legal@ReWear.com or through
                our contact page.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
