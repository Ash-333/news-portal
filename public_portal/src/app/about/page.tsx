import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { AboutPageJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about HTC Media, your trusted source for news from Nepal and around the world.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={AboutPageJsonLd()} />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'About Us', url: `${SITE_URL}/about` },
        ])}
      />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            About Us
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to HTC Media, your trusted source for comprehensive news coverage 
              from Nepal and around the world. Since our establishment, we have been committed to 
              delivering accurate, timely, and unbiased news to our readers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our mission is to provide reliable and comprehensive news coverage that informs, 
              educates, and empowers our readers. We believe in the power of journalism to create 
              positive change in society and hold those in power accountable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Our Values
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Accuracy:</strong> We verify all information before publication to ensure 
                our readers receive factual and reliable news.
              </li>
              <li>
                <strong>Independence:</strong> We maintain editorial independence and are not 
                influenced by political or commercial interests.
              </li>
              <li>
                <strong>Fairness:</strong> We present multiple perspectives on issues and give 
                all parties the opportunity to respond.
              </li>
              <li>
                <strong>Transparency:</strong> We are open about our sources and methods, and 
                correct errors promptly.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Our Team
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our team consists of experienced journalists, editors, and media professionals who 
              are passionate about delivering quality news content. With diverse backgrounds and 
              expertise, we bring comprehensive coverage of politics, business, sports, 
              entertainment, and more.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We value your feedback and suggestions. If you have any questions, comments, or 
              news tips, please don&apos;t hesitate to reach out to us through our{' '}
              <a href="/contact" className="text-news-red hover:underline">contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
