'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { marketData } from '@/data/sampleData';
import { toNepaliDigits, formatNumber, cn } from '@/lib/utils';

export function MarketWidget() {
  const { isNepali, language, t } = useLanguage();

  const formatValue = (value: number, prefix: string = '', suffix: string = '') => {
    const formatted = formatNumber(value, language);
    return `${prefix}${formatted}${suffix}`;
  };

  const MarketItem = ({
    label,
    value,
    change,
    prefix = '',
    suffix = '',
  }: {
    label: string;
    value: number;
    change: number;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="bg-white dark:bg-news-card-dark rounded-lg p-4">
      <p className={cn('text-xs text-gray-500 mb-1', isNepali ? 'font-nepali' : '')}>{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formatValue(value, prefix, suffix)}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            change >= 0 ? 'text-green-600' : 'text-red-600'
          )}
        >
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {isNepali ? toNepaliDigits(Math.abs(change)) : Math.abs(change)}
        </span>
      </div>
    </div>
  );

  return (
    <section className="py-8 bg-gray-50 dark:bg-news-bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-news-red rounded-full" />
          <h2 className={cn('text-xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
            {t('market.gold')} | {t('market.forex')} | {t('market.nepse')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Gold */}
          <MarketItem
            label={`${t('market.gold')} (${t('market.perTola')})`}
            value={marketData.gold.perTola}
            change={marketData.gold.change}
            prefix="Rs. "
          />
          <MarketItem
            label={`${t('market.gold')} (${t('market.per10g')})`}
            value={marketData.gold.per10g}
            change={marketData.gold.change}
            prefix="Rs. "
          />

          {/* Silver */}
          <MarketItem
            label={`${t('market.silver')} (${t('market.perTola')})`}
            value={marketData.silver.perTola}
            change={marketData.silver.change}
            prefix="Rs. "
          />

          {/* Forex */}
          <MarketItem
            label="USD"
            value={marketData.forex.usd}
            change={marketData.forex.change}
            prefix="Rs. "
          />
          <MarketItem
            label="EUR"
            value={marketData.forex.eur}
            change={marketData.forex.change}
            prefix="Rs. "
          />

          {/* NEPSE */}
          <div className="bg-white dark:bg-news-card-dark rounded-lg p-4">
            <p className={cn('text-xs text-gray-500 mb-1', isNepali ? 'font-nepali' : '')}>
              {t('market.nepse')}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatNumber(marketData.nepse.index, language)}
              </span>
              <span
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  marketData.nepse.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {marketData.nepse.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {isNepali
                  ? toNepaliDigits(Math.abs(marketData.nepse.changePercent))
                  : Math.abs(marketData.nepse.changePercent)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
