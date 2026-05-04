'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('पासवर्ड मेल खाँदैन');
      return;
    }

    if (password.length < 8) {
      setError('पासवर्ड कम्तिमा ८ अक्षर हुनुपर्छ');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password, confirmPassword });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'दर्ता गर्न असफल');
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
            <h1 className='text-2xl font-bold'>
              दर्ता सफल भयो!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 mb-6">
              तपाईंको खाता सिर्जना भयो। अब तपाईं लगइन गर्न सक्नुहुन्छ।
            </p>
            <Link 
              href="/login"
              className="inline-block py-2 px-6 bg-news-red hover:bg-news-red-dark text-white rounded-lg transition-colors"
            >
              लगइनमा जानुहोस्
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
            <h1 className='text-2xl font-bold'>
              खाता सिर्जना गर्नुहोस्
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              दर्ता गर्न तलका विवरणहरू भर्नुहोस्
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
               <Label htmlFor="name">पूरा नाम</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={'तपाईंको नाम'}
                    className="pl-10"
                    required
                  />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">इमेल</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={'तपाईंको इमेल'}
                    className="pl-10"
                    required
                  />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <Label htmlFor="password">पासवर्ड</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={'••••••••'}
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
              <Label htmlFor="confirmPassword">पासवर्ड पुष्टि गर्नुहोस्</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={'पासवर्ड पुष्टि गर्नुहोस्'}
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
                {isLoading ? 'प्रस्तुत गर्दै...' : 'दर्ता गर्नुहोस्'}
              </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                खाता छ? 
                <Link href="/login" className="text-news-red hover:underline font-medium">
                  लगइन गर्नुहोस्
                </Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
