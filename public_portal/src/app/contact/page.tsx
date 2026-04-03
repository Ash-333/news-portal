'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ContactPageJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={ContactPageJsonLd()} />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Contact Us', url: `${SITE_URL}/contact` },
        ])}
      />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Contact Us
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Have a question, comment, or news tip? We&apos;d love to hear from you. 
                  Fill out the form or reach out to us through any of the channels below.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Kathmandu, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        +977 1 4XXXXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        info@yoursite.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Send a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Thank you for reaching out. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-news-bg-dark"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-news-bg-dark"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-news-bg-dark"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-news-bg-dark resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
