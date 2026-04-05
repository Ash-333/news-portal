'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ContactPageJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { useQuery } from '@tanstack/react-query';
import { getContactInfo } from '@/lib/api/settings';
import { useLanguage } from '@/context/LanguageContext';
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
  const { isNepali, t } = useLanguage();

  const { data: contactResponse, isLoading } = useQuery({
    queryKey: ['contact-info'],
    queryFn: getContactInfo,
  });

  const contactInfo = contactResponse?.data;
  const address = isNepali ? (contactInfo?.contactAddressNe || contactInfo?.contactAddress || 'Kathmandu, Nepal') : (contactInfo?.contactAddress || 'Kathmandu, Nepal');

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
          { name: isNepali ? 'सम्पर्क' : 'Contact Us', url: `${SITE_URL}/contact` },
        ])}
      />

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className={cn(
              "text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center",
              isNepali ? "font-nepali" : ""
            )}>
              {isNepali ? 'हामीलाई सम्पर्क गर्नुहोस्' : 'Contact Us'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className={cn(
                  "text-xl font-bold text-gray-900 dark:text-white mb-6",
                  isNepali ? "font-nepali" : ""
                )}>
                  {isNepali ? 'हामीसँग सम्पर्क गर्नुहोस्' : 'Get in Touch'}
                </h2>
                <p className={cn(
                  "text-gray-600 dark:text-gray-400 mb-8",
                  isNepali ? "font-nepali" : ""
                )}>
                  {isNepali 
                    ? 'प्रश्न, टिप्पणी वा समाचार टिप छ? हामी तपाईंबाट सुन्न रुचाउछौं। तलको फारम भर्नुहोस् वा तलको कुनै पनि च्यानल मार्फत हामीलाई सम्पर्क गर्नुहोस्।'
                    : 'Have a question, comment, or news tip? We\'d love to hear from you. Fill out the form or reach out to us through any of the channels below.'
                  }
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {isNepali ? 'ठेगाना' : 'Address'}
                      </h3>
                      {isLoading ? (
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
                      ) : (
                        <p className={cn(
                          "text-gray-600 dark:text-gray-400",
                          isNepali ? "font-nepali" : ""
                        )}>
                          {address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-news-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {isNepali ? 'फोन' : 'Phone'}
                      </h3>
                      {isLoading ? (
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {contactInfo?.contactPhone || '+977 1 4XXXXXX'}
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
                        {isNepali ? 'इमेल' : 'Email'}
                      </h3>
                      {isLoading ? (
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {contactInfo?.contactEmail || 'info@yoursite.com'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-8">
                <h2 className={cn(
                  "text-xl font-bold text-gray-900 dark:text-white mb-6",
                  isNepali ? "font-nepali" : ""
                )}>
                  {isNepali ? 'सन्देश पठाउनुहोस्' : 'Send a Message'}
                </h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {isNepali ? 'सन्देश पठाइयो!' : 'Message Sent!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isNepali ? 'धन्यवाद। हामी चाँडै तपाईंलाई सम्पर्क गर्नेछौं।' : 'Thank you for reaching out. We\'ll get back to you soon.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {isNepali ? 'तपाईंको नाम' : 'Your Name'}
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
                        {isNepali ? 'इमेल ठेगाना' : 'Email Address'}
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
                        {isNepali ? 'विषय' : 'Subject'}
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
                        {isNepali ? 'सन्देश' : 'Message'}
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
                      {isNepali ? 'पठाउनुहोस्' : 'Send Message'}
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