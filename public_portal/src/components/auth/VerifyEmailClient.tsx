'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail, resendVerificationEmail } from '@/lib/api/auth';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isNepali, t } = useLanguage();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      // No token provided, show resend option
      setStatus('resend');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : t('auth.verificationFailed'));
      }
    };

    verify();
  }, [token, t]);

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      await resendVerificationEmail(email);
      alert(t('auth.verificationResent'));
    } catch (error) {
      alert(t('auth.resendFailed'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-news-bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-16 w-16 text-news-red" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.emailVerification')}
          </h2>
        </div>

        <div className="bg-white dark:bg-news-card-dark py-8 px-6 shadow-lg rounded-lg">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {t('auth.verifyingEmail')}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('auth.emailVerified')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('auth.verificationSuccess')}
              </p>
              <div className="mt-6">
                <Link href="/login">
                  <Button className="w-full">
                    {t('auth.continueToLogin')}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('auth.verificationFailed')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {errorMessage || t('auth.verificationError')}
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full"
                >
                  {t('auth.backToLogin')}
                </Button>
                <Button
                  onClick={() => setStatus('resend')}
                  className="w-full"
                >
                  {t('auth.resendVerification')}
                </Button>
              </div>
            </div>
          )}

          {status === 'resend' && (
            <div className="text-center">
              <Mail className="mx-auto h-16 w-16 text-news-red" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('auth.checkYourEmail')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('auth.verificationSent')} {email}
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleResend}
                  disabled={resending || !email}
                  className="w-full"
                >
                  {resending ? t('auth.resending') : t('auth.resendVerification')}
                </Button>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    {t('auth.backToLogin')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}