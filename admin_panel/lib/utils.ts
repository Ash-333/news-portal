import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { transliterate } from 'transliteration'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  const transliterated = transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return transliterated
}
