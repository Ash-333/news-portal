import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for HTC Media.',
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Last updated: March 19, 2024
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            HTC Media (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may collect information about you in a variety of ways, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Personal Data:</strong> Name, email address, and other information you 
              voluntarily provide when registering or contacting us.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website, including 
              your IP address, browser type, and pages visited.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to enhance your experience on our website.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our services</li>
            <li>To monitor the usage of our services</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may use third-party services, such as Google Analytics, to analyze how users use 
            our website. These third parties may use cookies and other tracking technologies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us through our{' '}
            <a href="/contact" className="text-news-red hover:underline">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
