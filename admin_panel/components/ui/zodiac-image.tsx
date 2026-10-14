/* eslint-disable @next/next/no-img-element */
import { DynamicIcon } from '@/components/ui/dynamic-icon'

const ZODIAC_IMAGES = new Set([
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra',
  'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
])

interface ZodiacImageProps {
  sign: string
  icon?: string
  className?: string
}

// Shows the zodiac artwork from /zodiac, falling back to the Lucide icon (e.g. Libra).
export function ZodiacImage({ sign, icon, className }: ZodiacImageProps) {
  if (ZODIAC_IMAGES.has(sign)) {
    return <img src={`/zodiac/${sign}.jpeg`} alt={sign} className={`${className ?? ''} rounded-full object-cover`} />
  }
  return <DynamicIcon name={icon || 'Sparkles'} className={`${className ?? ''} text-purple-500`} />
}
