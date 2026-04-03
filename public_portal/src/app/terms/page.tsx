import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for HTC Media.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Use
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Last updated: March 19, 2024
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and using HTC Media, you accept and agree to be bound by the 
            terms and provisions of this agreement. If you do not agree to these terms, please 
            do not use our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Use of Content
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            All content on this website, including articles, images, videos, and other materials, 
            is protected by copyright and other intellectual property laws. You may:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Read and view content for personal, non-commercial use</li>
            <li>Share links to our content on social media</li>
            <li>Print articles for personal use</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            You may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Reproduce, distribute, or modify our content without permission</li>
            <li>Use our content for commercial purposes without authorization</li>
            <li>Remove copyright notices or other proprietary information</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            User Conduct
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            When using our website, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Post or transmit any unlawful, threatening, or harassing content</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with the operation of our website</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use our website for any illegal purpose</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Comments and User Content
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By posting comments or other content on our website, you grant us a non-exclusive, 
            royalty-free license to use, reproduce, and distribute your content. We reserve 
            the right to remove any content that violates these terms or is otherwise objectionable.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Disclaimer
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The content on this website is provided for informational purposes only. While we 
            strive for accuracy, we make no warranties about the completeness, reliability, or 
            accuracy of this information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Changes to Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to modify these terms at any time. Please review these terms 
            periodically for changes. Your continued use of our website constitutes acceptance 
            of any modifications.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms of Use, please contact us through our{' '}
            <a href="/contact" className="text-news-red hover:underline">contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
