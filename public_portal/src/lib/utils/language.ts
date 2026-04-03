import { headers } from 'next/headers';
import { Language } from '@/types';

/**
 * Get the current language from request headers
 * Reads from x-language header set by middleware
 * Falls back to 'ne' (Nepali) as default
 */
export function getServerLanguage(): Language {
  try {
    const headersList = headers();
    const language = headersList.get('x-language');
    
    if (language === 'en' || language === 'ne') {
      return language;
    }
    
    return 'ne';
  } catch {
    // If headers() fails (e.g., not in a server context), default to Nepali
    return 'ne';
  }
}

/**
 * Get language from request headers for use in server components
 * Compatible with Next.js App Router
 */
export async function getLanguage(): Promise<Language> {
  return getServerLanguage();
}