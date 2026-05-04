'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, User, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useComments, usePostComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface CommentSectionProps {
  articleId: string;
  articleSlug: string;
}

export function CommentSection({ articleId, articleSlug }: CommentSectionProps) {

  const { isAuthenticated, login } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: comments = [], isLoading, error } = useComments(articleSlug);
  const createComment = usePostComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment.mutateAsync({ articleId, articleSlug, content: newComment });
      setNewComment('');
    } catch { }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      // Login successful - close modal
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'त्रुटि भयो');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Check if user can comment
  const canComment = isAuthenticated;

  return (
    <div id="comments" className="mt-12 pt-8 border-t border-news-border dark:border-news-border-dark">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-news-red" />
        <h3 className={cn('font-bold text-gray-900 dark:text-white', 'font-nepali')}>
          ({comments.length})
        </h3>
      </div>

      {/* Comment form - ONLY for authenticated + verified users */}
      {canComment ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6 mb-8">
          <h4 className={cn('font-medium text-gray-900 dark:text-white mb-4', 'font-nepali')}>

          </h4>
          <div className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={'तपाईंको टिप्पणी लेख्नुहोस्...'}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-news-bg-dark resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={createComment.isPending || !newComment.trim()}
              className="px-6 py-2 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors disabled:opacity-60"
            >
              {createComment.isPending ? 'पठाउँदै...' : 'टिप्पणी पठाउनुहोस्'}
            </button>
          </div>
        </form>
      ) : (
        // Prompts for non-authenticated or unverified users
        <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6 mb-8">
          {!isAuthenticated ? (
            <div className="text-center py-4">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {'टिप्पणी गर्न लगइन गर्नुहोस्'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-news-red hover:bg-news-red-dark"
                >
                  लगइन गर्नुहोस् 
                </Button>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-news-red text-news-red rounded-lg hover:bg-news-red/5 transition-colors inline-flex items-center"
                >दर्ता गर्नुहोस्

                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {'टिप्पणी गर्न इमेल प्रमाणित गर्नुहोस्'}
              </p>
              <Link
                href="/verify-email"
                className="px-4 py-2 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors inline-block"
              >
                {'इमेल प्रमाणित गर्नुहोस्'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{'लगइन गर्नुहोस्'}</DialogTitle>
            <DialogDescription>
              {'टिप्पणी लेख्नको लागि लगइन गर्नुहोस्'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="login-email"></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={'तपाईंको इमेल'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password"></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={'••••••••'}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-news-red hover:underline"
                onClick={() => setShowLoginModal(false)}
              >

              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-news-red hover:bg-news-red-dark"
            >
              {isLoggingIn ? 'लगइन गर्दै...' : 'लगइन गर्नुहोस्'}
            </Button>
          </form>

          <DialogFooter className="sm:justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {'खाता छैन? '}
              <Link
                href="/register"
                className="text-news-red hover:underline font-medium"
                onClick={() => setShowLoginModal(false)}
              >

              </Link>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {createComment.error ? (
        <p className="text-sm text-red-600 mb-4">
          {createComment.error instanceof Error ? createComment.error.message : 'त्रुटि भयो'}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 mb-4">
          {error instanceof Error ? error.message : 'त्रुटि भयो'}
        </p>
      ) : null}

      {/* Comments list - VISIBLE TO ALL (including guests) */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-gray-500 text-center py-8"></p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {'अहिलेसम्म कुनै टिप्पणी छैन। पहिलो बनुनुहोस्!'}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {comment.user?.image || comment.user?.profilePhoto ? (
                  <img
                    src={comment.user?.image || comment.user?.profilePhoto || '/images/default-avatar.png'}
                    alt={comment.user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{comment.user?.name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>

                {/* Reply count */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                      {comment.replies.length} {'जवाफहरू'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
