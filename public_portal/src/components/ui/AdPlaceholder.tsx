import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'banner' | 'fluid';
  className?: string;
  text?: string;
}

export function AdPlaceholder({ format = 'fluid', className, text = 'Advertisement' }: AdPlaceholderProps) {
  const formatStyles = {
    leaderboard: 'w-full max-w-[728px] h-[90px]',
    rectangle: 'w-full max-w-[300px] h-[250px]',
    banner: 'w-full max-w-[320px] h-[50px]',
    fluid: 'w-full h-full min-h-[100px]',
  };

  return (
    <div
      className={cn(
        'bg-gray-100 dark:bg-news-card-dark border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg',
        'flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden relative group',
        formatStyles[format],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xs sm:text-sm font-medium tracking-wider uppercase">
          {text}
        </span>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-black/5 dark:via-white/5 dark:to-transparent pointer-events-none" />
    </div>
  );
}
