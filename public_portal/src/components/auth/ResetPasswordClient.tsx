'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api/auth';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isNepali, t } = useLanguage();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token!, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.resetPasswordFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (invalidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-news-bg-dark px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-news-card-dark rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className={isNepali ? 'font-nepali text-2xl font-bold' : 'text-2xl font-bold'}>
              {t('auth.invalidToken')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 mb-6">
              {t('auth.invalidTokenDesc')}
            </p>
            <Link
              href="/forgot-password"
              className="inline-block py-2 px-6 bg-news-red hover:bg-news-red-dark text-white rounded-lg transition-colors"
            >
              {t('auth.requestNewLink')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-news-bg-dark px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-news-card-dark rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className={isNepali ? 'font-nepali text-2xl font-bold' : 'text-2xl font-bold'}>
              {t('auth.passwordResetSuccess')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 mb-6">
              {t('auth.passwordResetSuccessDesc')}
            </p>
            <Link
              href="/login"
              className="inline-block py-2 px-6 bg-news-red hover:bg-news-red-dark text-white rounded-lg transition-colors"
            >
              {t('user.login')}
            </Link>
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
              {t('auth.resetPassword')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t('auth.resetPasswordDesc')}
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
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.newPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isNepali ? 'नयाँ पासवर्ड' : 'New password'}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isNepali ? 'पासवर्ड पुष्टि गर्नुहोस्' : 'Confirm password'}
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
              {isLoading ? t('common.loading') : t('auth.resetPassword')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}