import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Nepali digits conversion
const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliDigits(num: number | string): string {
  const str = num.toString();
  return str.replace(/[0-9]/g, (match) => nepaliDigits[parseInt(match)]);
}

export function toEnglishDigits(str: string): string {
  return str.replace(/[०-९]/g, (match) => {
    return nepaliDigits.indexOf(match).toString();
  });
}

// Date formatting
export function formatDate(date: Date | string, locale: 'ne' | 'en' = 'ne'): string {
  const d = new Date(date);
  
  if (locale === 'ne') {
    // For Nepali locale, we'll use Bikram Sambat (simplified)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatted = d.toLocaleDateString('ne-NP', options);
    return toNepaliDigits(formatted);
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string, locale: 'ne' | 'en' = 'ne'): string {
  const d = new Date(date);
  
  if (locale === 'ne') {
    const formatted = d.toLocaleString('ne-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return toNepaliDigits(formatted);
  }
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Relative time
export function getRelativeTime(date: Date | string, locale: 'ne' | 'en' = 'ne'): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return locale === 'ne' ? 'केही सेकेन्ड अघि' : 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === 'ne' 
      ? `${toNepaliDigits(diffInMinutes)} मिनेट अघि`
      : `${diffInMinutes} min ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === 'ne'
      ? `${toNepaliDigits(diffInHours)} घण्टा अघि`
      : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return locale === 'ne' ? 'हिजो' : 'Yesterday';
  }
  if (diffInDays < 7) {
    return locale === 'ne'
      ? `${toNepaliDigits(diffInDays)} दिन अघि`
      : `${diffInDays} days ago`;
  }
  
  return formatDate(date, locale);
}

// Slug generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

// Reading time calculation
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Share URLs
export function getShareUrls(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    viber: `viber://forward?text=${encodedTitle}%20${encodedUrl}`,
  };
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Local storage helpers
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set localStorage:', err);
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Scroll to element
export function scrollToElement(elementId: string, offset: number = 80): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// Format number with commas
export function formatNumber(num: number, locale: 'ne' | 'en' = 'ne'): string {
  const formatted = num.toLocaleString(locale === 'ne' ? 'ne-NP' : 'en-US');
  return locale === 'ne' ? toNepaliDigits(formatted) : formatted;
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'NPR',
  locale: 'ne' | 'en' = 'ne'
): string {
  const formatted = new Intl.NumberFormat(locale === 'ne' ? 'ne-NP' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
  return locale === 'ne' ? toNepaliDigits(formatted) : formatted;
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
