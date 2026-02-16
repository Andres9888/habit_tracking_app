export default function Privacy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Last updated: February 16, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            ChainDay (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how your personal information is collected, used, and 
            disclosed by ChainDay when you use our mobile application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Information We Collect
          </h2>
          
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Account Information
          </h3>
          <p className="text-gray-700 mb-4">
            When you create an account, we collect your email address and optional username 
            for authentication purposes. This information is provided by you through our 
            authentication provider, Clerk.
          </p>

          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Usage Data
          </h3>
          <p className="text-gray-700 mb-4">
            We collect usage data to improve app quality, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Crash reports and error information</li>
            <li>Performance data (app responsiveness, load times)</li>
            <li>Habit tracking data you enter (habits, streaks, completions)</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Purchase Information
          </h3>
          <p className="text-gray-700 mb-4">
            If you subscribe to ChainDay Premium, purchase information is processed by 
            RevenueCat. We do not store payment information directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Provide and maintain the ChainDay service</li>
            <li>Authenticate your account</li>
            <li>Process your subscriptions</li>
            <li>Improve app performance and fix bugs</li>
            <li>Send you important updates about the app</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-700 mb-4">
            ChainDay uses the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>
              <strong>Clerk</strong> - Authentication and user management. 
              See their <a href="https://clerk.com/legal/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
            </li>
            <li>
              <strong>RevenueCat</strong> - Subscription management. 
              See their <a href="https://www.revenuecat.com/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
            </li>
            <li>
              <strong>Sentry</strong> - Error tracking and performance monitoring. 
              See their <a href="https://sentry.io/legal/privacy/" className="text-emerald-600 hover:underline">Privacy Policy</a>.
            </li>
            <li>
              <strong>Convex</strong> - Backend database and real-time sync. 
              See their <a href="https://www.convex.dev/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your 
            personal information. All data is transmitted over HTTPS, and sensitive data 
            is encrypted at rest.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Access your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of non-essential data collection</li>
            <li>Export your data</li>
          </ul>
          <p className="text-gray-700 mb-4">
            To exercise these rights, please contact us at support@chainday.app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 mb-4">
            ChainDay is not intended for children under 13. We do not knowingly collect 
            personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of 
            any changes by posting the new policy on this page and updating the 
            &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:support@chainday.app" className="text-emerald-600 hover:underline">
              support@chainday.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
