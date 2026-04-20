'use client';

import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'floating_button_position';
const VIEWPORT_PADDING = 20;
const DEFAULT_BUTTON_WIDTH = 160;
const DEFAULT_BUTTON_HEIGHT = 52;

interface Position {
    x: number;
    y: number;
}

function getDefaultPosition(viewportWidth: number, viewportHeight: number): Position {
    return {
        x: Math.max(VIEWPORT_PADDING, viewportWidth - DEFAULT_BUTTON_WIDTH - VIEWPORT_PADDING),
        y: Math.max(VIEWPORT_PADDING, viewportHeight - DEFAULT_BUTTON_HEIGHT - VIEWPORT_PADDING),
    };
}

export function FloatingWatchButton() {
    const { isNepali } = useLanguage();
    const [position, setPosition] = useState<Position>({ x: VIEWPORT_PADDING, y: VIEWPORT_PADDING });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || 'https://www.youtube.com';

    // Load position from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const defaultPosition = getDefaultPosition(window.innerWidth, window.innerHeight);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                    setPosition(parsed);
                } else {
                    setPosition(defaultPosition);
                }
            } catch {
                setPosition(defaultPosition);
            }
        } else {
            setPosition(defaultPosition);
        }
        setIsLoaded(true);
    }, []);

    // Save position to localStorage
    const savePosition = (pos: Position) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
        setPosition(pos);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;

            // Clamp to viewport with some padding
            const padding = VIEWPORT_PADDING;
            const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || DEFAULT_BUTTON_WIDTH) - padding;
            const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || DEFAULT_BUTTON_HEIGHT) - padding;

            const clampedX = Math.max(padding, Math.min(newX, maxX));
            const clampedY = Math.max(padding, Math.min(newY, maxY));

            savePosition({ x: clampedX, y: clampedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Touch support for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        
        const touch = e.touches[0];
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const newX = touch.clientX - dragOffset.current.x;
            const newY = touch.clientY - dragOffset.current.y;

            const padding = VIEWPORT_PADDING;
            const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || DEFAULT_BUTTON_WIDTH) - padding;
            const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || DEFAULT_BUTTON_HEIGHT) - padding;

            const clampedX = Math.max(padding, Math.min(newX, maxX));
            const clampedY = Math.max(padding, Math.min(newY, maxY));

            savePosition({ x: clampedX, y: clampedY });
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    if (!isLoaded) return null;

    return (
        <a
            ref={buttonRef}
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={cn(
                "fixed z-50 flex items-center gap-2 px-4 py-2.5",
                "bg-news-red text-white font-semibold rounded-full",
                "shadow-lg hover:shadow-xl hover:bg-news-red-dark",
                "transition-all duration-300",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                "select-none"
            )}
            style={{
                left: position.x,
                top: position.y,
            }}
            aria-label={isNepali ? 'यूट्यूबमा हेर्नुहोस्' : 'Watch on YouTube'}
        >
            <Play className="w-5 h-5 fill-current" />
            <span className="hidden sm:inline">
                {isNepali ? 'हेर्नुहोस्' : 'Watch Now'}
            </span>
        </a>
    );
}
