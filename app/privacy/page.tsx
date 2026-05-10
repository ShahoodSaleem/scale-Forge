import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data collection practices for Scale Forge.',
  robots: { index: false, follow: true }, // Keep it out of index but crawlable
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Privacy <span className="text-orange-500">Policy</span></h1>
          <p className="text-white/50">Last Updated: May 10, 2026</p>
        </div>

        <div className="prose prose-invert prose-orange max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed">
              We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide. We also automatically collect certain information about your device and how you interact with our website using analytics tools.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to process your requests, and to communicate with you. We do not sell, rent, or share your personal information with third parties except as described in this privacy policy or as required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Cookies and Tracking Technologies</h2>
            <p className="text-white/70 leading-relaxed">
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
            <p className="text-white/70 leading-relaxed">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us via our <a href="/contact" className="text-orange-500 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
