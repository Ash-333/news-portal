'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/api/auth';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { isNepali, t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.forgotPasswordFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-news-bg-dark px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-news-card-dark rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className={isNepali ? 'font-nepali text-2xl font-bold' : 'text-2xl font-bold'}>
              {t('auth.checkEmail')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t('auth.resetLinkSent')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-news-bg-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-news-card-dark rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={isNepali ? 'font-nepali text-2xl font-bold' : 'text-2xl font-bold'}>
              {t('auth.forgotPassword')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t('auth.forgotPasswordDesc')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('user.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isNepali ? 'तपाईंको इमेल' : 'your@email.com'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-news-red hover:bg-news-red-dark text-white font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {isLoading ? t('common.loading') : t('auth.sendResetLink')}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-news-red hover:underline">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}