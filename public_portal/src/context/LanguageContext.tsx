'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isNepali: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import enTranslations from '@/locales/en/common.json';
import neTranslations from '@/locales/ne/common.json';

const translations: Record<Language, Record<string, any>> = {
  en: enTranslations,
  ne: neTranslations,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ne');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = getLocalStorage<Language>('language', 'ne');
    setLanguageState(savedLanguage);
  }, []);

  useEffect(() => {
    if (mounted) {
      setLocalStorage('language', language);
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ne' ? 'en' : 'ne'));
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        let fallbackValue: any = translations.en;
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key;
          }
        }
        return typeof fallbackValue === 'string' ? fallbackValue : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isNepali: language === 'ne',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useNepaliText() {
  const { language, isNepali } = useLanguage();
  
  const getText = (nepaliText: string, englishText: string): string => {
    return isNepali ? nepaliText : englishText;
  };

  const getFontClass = (): string => {
    return isNepali ? 'font-nepali' : 'font-body';
  };

  return {
    getText,
    getFontClass,
    isNepali,
    language,
  };
}