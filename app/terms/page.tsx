import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service and usage conditions for Scale Forge.',
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Terms of <span className="text-orange-500">Service</span></h1>
          <p className="text-white/50">Last Updated: May 10, 2026</p>
        </div>

        <div className="prose prose-invert prose-orange max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing and using the Scale Forge website and services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our website or services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Services Rendered</h2>
            <p className="text-white/70 leading-relaxed">
              Scale Forge provides web design, development, SEO, and content creation services. The specific deliverables, timelines, and costs for any project will be outlined in a separate Statement of Work (SOW) or contract agreed upon by both parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed">
              Unless otherwise agreed in writing, all preliminary designs, concepts, and materials created during the project remain the intellectual property of Scale Forge. Upon final payment, the client receives a license to use the final deliverables for their intended purpose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">
              In no event shall Scale Forge be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Modifications</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify these terms at any time. We will always post the most current version on our site. By continuing to use the site after changes become effective, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
