"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function ResponsibleAIPage() {
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
              Responsible AI Policy
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
                <h2 className="text-2xl font-bold mb-4">1. Our Commitment</h2>
                <p>
                  RunAsh is committed to developing and deploying AI systems responsibly. This policy describes the
                  principles, practices, and governance we follow to ensure our AI features are safe, fair, transparent,
                  and aligned with user rights and applicable laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Core Principles</h2>
                <ul>
                  <li><strong>Safety:</strong> Design and test systems to minimize harm and prioritize user safety.</li>
                  <li><strong>Fairness:</strong> Identify and mitigate bias to promote equitable outcomes.</li>
                  <li><strong>Transparency:</strong> Be clear about when AI is used and provide meaningful information about its behavior.</li>
                  <li><strong>Privacy:</strong> Respect data minimization, purpose limitation, and secure handling of personal data.</li>
                  <li><strong>Accountability:</strong> Maintain governance, logging, and review processes to ensure responsibility for outcomes.</li>
                  <li><strong>Human oversight:</strong> Preserve opportunities for human review and intervention for automated decisions with significant effects.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Scope</h2>
                <p>
                  This policy applies to all AI/ML components developed, integrated, or used by RunAsh, including
                  real-time processing, recommendations, moderation, personalization, and third-party models.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Data Practices</h2>
                <ul>
                  <li><strong>Minimization:</strong> We collect only the data necessary for a given AI feature.</li>
                  <li><strong>Purpose limitation:</strong> Data is used only for the stated purposes and not repurposed without legal basis or user consent.</li>
                  <li><strong>Retention:</strong> Transient processing (e.g., live audio/video) is not retained unless explicitly recorded or required for debugging and then handled per our retention schedules.</li>
                  <li><strong>Protection:</strong> Data is encrypted in transit and at rest and access is limited to authorized systems and personnel.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Bias Detection & Mitigation</h2>
                <p>
                  We actively evaluate models for disparate impacts and biases using testing datasets and monitoring in
                  production. When issues are identified we apply mitigation strategies such as reweighting, additional
                  training data, model adjustments, or human-in-the-loop review.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Safety, Testing & Monitoring</h2>
                <p>
                  AI features undergo pre-deployment testing (functional, security, adversarial, and privacy testing).
                  Post-deployment, we monitor performance, errors, and user feedback and maintain logging and alerting to
                  detect anomalies or misuse.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Human Oversight & Appeals</h2>
                <p>
                  For important automated decisions that materially affect users, we provide human review options and
                  channels to appeal decisions. Users may request review or escalation through our support channels.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Use of Third-Party Models</h2>
                <p>
                  We may integrate third-party AI services. We assess providers for security, privacy, and responsible use,
                  and document the provider and data flows where applicable. Third-party model outputs are treated as
                  assistive; we validate and post-process as needed before presenting results to users.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Explainability & Transparency</h2>
                <p>
                  We aim to make AI behavior understandable: when AI contributes to a result we provide context about the
                  capability used, limitations, and suggested user verification steps. For significant automated outcomes
                  we will provide reasonable information about the logic and data types involved.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Security & Abuse Prevention</h2>
                <p>
                  We protect AI systems from manipulation, adversarial inputs, and abuse through input validation,
                  rate-limiting, monitoring, and incident response. We maintain policies to restrict harmful uses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Governance & Roles</h2>
                <p>
                  RunAsh maintains internal governance to oversee AI development and deployment. This includes assigned
                  owners for model risk, privacy impact assessments for new features, and periodic audits of high-risk
                  systems.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. User Controls & Choices</h2>
                <ul>
                  <li><strong>Opt-in / Opt-out:</strong> Where feasible, users can enable or disable specific AI features.</li>
                  <li><strong>Recording:</strong> Users must explicitly enable recording; otherwise live processing is transient.</li>
                  <li><strong>Data requests:</strong> Users can request access, correction, or deletion of their data under our Privacy Policy.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Compliance & Legal Obligations</h2>
                <p>
                  We comply with applicable legal and regulatory requirements related to AI, data protection, and consumer
                  rights. Where required, we will provide disclosures and assessments to regulators or partners.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Reporting Issues</h2>
                <p>
                  If you discover a safety concern, bias, or other issue with our AI systems, please contact security@runash.in
                  or use the support channels in your account. We investigate reports promptly and take corrective action
                  when necessary.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">15. Changes to this Policy</h2>
                <p>
                  We may update this Responsible AI Policy as our technology, controls, and legal landscape evolve. We will
                  post material changes with an updated "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">16. Contact</h2>
                <p>
                  Questions about this policy can be sent to legal@runash.in or through the support channels in your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
