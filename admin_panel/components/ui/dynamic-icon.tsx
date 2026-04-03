'use client'

import * as LucideIcons from 'lucide-react'
import { ComponentType } from 'react'

interface DynamicIconProps {
    name: string
    className?: string
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
    // Try to find the icon in lucide-react
    const IconComponent = (LucideIcons[name as keyof typeof LucideIcons] || LucideIcons.Sparkles) as ComponentType<{ className?: string }>

    if (!IconComponent) {
        // Fallback to Sparkles if icon not found
        return <LucideIcons.Sparkles className={className} />
    }

    return <IconComponent className={className} />
}