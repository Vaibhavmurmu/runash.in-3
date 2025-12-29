"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-orange-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
              <span className="text-orange-600 dark:text-orange-400">Legal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Return & Refund Policy
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Last updated: Nov 27, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert prose-orange">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
                <p>
                  We want you to be satisfied with purchases made through RunAsh. This Return & Refund Policy explains
                  eligibility, the return process, refunds, and related terms. By placing an order you agree to the
                  terms outlined here and in our Terms of Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Scope</h2>
                <p>
                  This policy applies to physical goods and digital purchases sold directly through RunAsh unless a
                  product page or explicit agreement states otherwise. Third-party sellers or marketplaces may have
                  separate policies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Return Eligibility</h2>
                <ul>
                  <li>Returns must be initiated within 30 days of delivery unless otherwise specified on the product page.</li>
                  <li>Items must be returned in original condition, unused, and in original packaging (if applicable).</li>
                  <li>Proof of purchase (order number or receipt) is required for all returns.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Non-Returnable Items</h2>
                <p>
                  The following are generally non-returnable unless defective or otherwise specified:
                </p>
                <ul>
                  <li>Opened digital goods, software license keys, or redeemed codes</li>
                  <li>Personalized, custom-made, or one-of-a-kind items</li>
                  <li>Products marked as final sale</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Defective, Damaged, or Incorrect Items</h2>
                <p>
                  If you receive a defective, damaged, or incorrect item, contact us immediately at support@runash.in
                  with photos and your order details. We will evaluate and — where appropriate — offer a replacement,
                  free return shipping, or a full refund.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Returns Process</h2>
                <ol>
                  <li><strong>Request a return:</strong> Open a return request via your account or contact support@runash.in with order details.</li>
                  <li><strong>Receive instructions:</strong> We’ll provide return authorization and packaging/label instructions when required.</li>
                  <li><strong>Ship the item:</strong> Pack securely and ship per the instructions. Keep tracking information.</li>
                  <li><strong>Inspection and confirmation:</strong> We’ll inspect the returned item and notify you of approval or rejection.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Refunds</h2>
                <p>
                  Once a return is approved, refunds will be processed to the original payment method within 7–14
                  business days after we receive the item and complete inspection. Timing depends on your bank or
                  payment provider. Shipping charges are refundable only if the return is due to our error or a defective item.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Exchanges</h2>
                <p>
                  If you need an exchange (e.g., different size or color), contact support@runash.in. Exchanges are
                  subject to availability; when not available, we will process a refund per Section 7.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Return Shipping Costs & Restocking Fees</h2>
                <p>
                  Unless the return is due to our error, you are responsible for return shipping costs. We may apply
                  a restocking fee for certain items; any fee will be disclosed during the return process.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. International Returns</h2>
                <p>
                  For international orders, you are responsible for customs, duties, and taxes on returned items unless
                  the return is due to our error. Additional time may be required for customs processing.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Fraud Prevention</h2>
                <p>
                  We reserve the right to deny returns or refunds in cases of suspected fraud, abuse, or violation of
                  our Terms of Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Changes to this Policy</h2>
                <p>
                  We may update this policy occasionally. Material changes will be posted with an updated "Last updated"
                  date. Continued use after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Contact</h2>
                <p>
                  For questions or to start a return, contact support@runash.in or use the support channels in your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
 }
