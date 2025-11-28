"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function TrademarkPolicyPage() {
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
              Trademark & DMCA Policy
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
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p>
                  RunAsh respects the intellectual property rights of others and expects users of the Service to do the same.
                  This page describes our approach to trademarks and provides a DMCA takedown procedure for copyright
                  owners to report infringing content. It also explains how to submit counter-notifications and how we handle repeat
                  infringers.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Trademark Use</h2>
                <p>
                  Trademarks (including logos and brand names) identify the source of goods or services. Unauthorized use can
                  cause confusion. Unless you have permission from the trademark owner, do not use trademarks in a way that implies
                  endorsement, affiliation, or sponsorship by the trademark owner.
                </p>
                <p>
                  If you believe someone is using your trademark in a way that infringes your rights, please contact us with the
                  details described in Section 4 (Reporting Infringement). For trademark-related notices, use: trademark@runash.in.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. What We Will Do</h2>
                <p>
                  When we receive a valid trademark or copyright report, we will review the notice and may take actions such as:
                </p>
                <ul>
                  <li>Removing or disabling access to the allegedly infringing content;</li>
                  <li>Notifying the user who posted the content;</li>
                  <li>Suspending or terminating accounts of repeat infringers;</li>
                  <li>Requesting a counter-notification if the user disputes the claim.</li>
                </ul>
                <p>
                  We process notices in accordance with applicable law and our policies. Submitting a false or fraudulent notice may carry legal penalties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Reporting Infringement</h2>
                <p>
                  To report alleged trademark misuse or copyright infringement (DMCA), provide a written notice containing the information below.
                  For DMCA/copyright takedowns, send notices to: dmca@runash.in. For trademark-specific claims, send notices to: trademark@runash.in.
                </p>
                <h3 className="text-xl font-semibold mt-4">Information to include in a DMCA Takedown Notice</h3>
                <p>
                  A proper DMCA notice should include the following elements (17 U.S.C. §512(c)):
                </p>
                <ol>
                  <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed. If multiple works are claimed, provide a representative list.</li>
                  <li>Identification of the material that is claimed to be infringing and where it is located on the Service (provide URLs or other precise location information).</li>
                  <li>Contact information for the complaining party (name, address, telephone number, and email address).</li>
                  <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement, under penalty of perjury, that the information in the notice is accurate, and that the complaining party is authorized to act on behalf of the copyright owner.</li>
                </ol>

                <p className="mt-4">
                  Sample DMCA notice template (include all required elements above):
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
{`[Your Name]
[Your Company (if applicable)]
[Your Address]
[Your Phone]
[Your Email]

Date: [Date]

To: RunAsh DMCA Agent (dmca@runash.in)

I am the owner (or an agent authorized to act on behalf of the owner) of certain copyrighted material that is being infringed.

1. Description of the copyrighted work: [Describe the copyrighted work(s) you claim are being infringed]

2. Location of the infringing material on the RunAsh Service: [Provide precise URLs or other identifying information]

3. I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.

4. I declare, under penalty of perjury, that the information in this notice is accurate and that I am authorized to act on behalf of the copyright owner.

Signature: [Electronic or physical signature]`}
                </pre>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Counter-Notification</h2>
                <p>
                  If you submitted content that was removed in response to a DMCA notice and you believe it was removed by mistake or
                  misidentification, you may submit a counter-notification. A proper counter-notice must include:
                </p>
                <ol>
                  <li>Your physical or electronic signature;</li>
                  <li>Identification of the material removed and its previous location;</li>
                  <li>A statement, under penalty of perjury, that you have a good faith belief the material was removed as a result of mistake or misidentification;</li>
                  <li>Your name, address, and telephone number, and a statement consenting to the jurisdiction of the federal district court for your address (or if outside the U.S., consenting to a U.S. jurisdiction) and consenting to accept service of process from the person who provided the original DMCA notice.</li>
                </ol>
                <p>
                  Send counter-notifications to dmca@runash.in. After receiving a valid counter-notice, we may restore the material in accordance with the DMCA.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Repeat Infringer Policy</h2>
                <p>
                  We terminate accounts of users who are repeat infringers in appropriate circumstances. Repeat infringement
                  is assessed on a case-by-case basis and may result in suspension or termination of access to the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Good Faith & Misuse</h2>
                <p>
                  We expect notices and counter-notices to be submitted in good faith. Misrepresentations in a notice or
                  counter-notice may expose the submitter to liability, including damages and attorneys’ fees under applicable law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Privacy of Notices</h2>
                <p>
                  We may disclose information contained in takedown or counter-notifications to the user who posted the content and
                  relevant third parties (including the complaining party) as necessary to resolve the claim or as required by law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
                <p>
                  For trademark-related inquiries: <a href="mailto:trademark@runash.in">trademark@runash.in</a><br />
                  For DMCA / Copyright takedown notices and counter-notices: <a href="mailto:dmca@runash.in">dmca@runash.in</a><br />
                  For general legal inquiries: <a href="mailto:legal@runash.in">legal@runash.in</a>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Changes to this Policy</h2>
                <p>
                  We may update this Trademark & DMCA Policy periodically. Material changes will be posted with an updated
                  "Last updated" date at the top of this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
 }
