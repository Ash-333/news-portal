'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ContactPageJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { useQuery } from '@tanstack/react-query';
import { getContactInfo } from '@/lib/api/settings';

import { cn } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: contactResponse, isLoading } = useQuery({
    queryKey: ['contact-info'],
    queryFn: getContactInfo,
  });

  const contactInfo = contactResponse?.data;
  const address = contactInfo?.contactAddress || 'Kathmandu, Nepal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
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
               सम्पर्क
             </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                   सम्पर्क जानकारी
                 </h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-8">
                   के छ प्रश्न, समाचार सुझाव वा सम्पर्क गर्नु पर्ने? हामी तपाईंबाट सुन्न पाउँदा खुसी हुनेछौं। फारम भर्नुहोस् वा तल दिइएका माध्यमबाट हामीलाई सम्पर्क गर्नुहोस्।
                 </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                       <h3 className="font-medium text-gray-900 dark:text-white">
                         ठेगाना
                       </h3>
                      {isLoading ? (
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                       <h3 className="font-medium text-gray-900 dark:text-white">
                         इमेल
                       </h3>
                      <a
                        href={`mailto:${contactInfo?.contactEmail || 'info@htcmedia.com'}`}
                        className="text-news-red hover:underline"
                      >
                        {contactInfo?.contactEmail || 'info@htcmedia.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                       <h3 className="font-medium text-gray-900 dark:text-white">
                         फोन
                       </h3>
                      <a
                        href={`tel:${contactInfo?.contactPhone || '+977-1-1234567'}`}
                        className="text-news-red hover:underline"
                      >
                        {contactInfo?.contactPhone || '+977-1-1234567'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-news-card-dark rounded-xl p-6 shadow-sm">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                   हामीलाई सन्देश पठाउनुहोस्
                 </h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                       Message Sent!
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400">
                       सम्पर्क गर्नु भएकोमा धन्यवाद। हामी चाँडै तपाईंलाई जवाफ दिनेछौं।
                     </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         नाम
                       </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-news-bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-news-red"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         इमेल
                       </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-news-bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-news-red"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         विषय
                       </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-news-bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-news-red"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         सन्देश
                       </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-news-bg-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-news-red resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-news-red text-white rounded-lg font-medium hover:bg-news-red-dark transition-colors flex items-center justify-center gap-2"
                    >
                       <Send className="h-4 w-4" />
                       सन्देश पठाउनुहोस्
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
