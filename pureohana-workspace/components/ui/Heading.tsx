import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  children: ReactNode
}

export function Heading({ level, className, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  
  const styles: Record<number, string> = {
    1: 'text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal-900 leading-tight',
    2: 'text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-tight',
    3: 'text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal-900',
    4: 'text-2xl md:text-3xl lg:text-4xl font-semibold text-charcoal-900',
    5: 'text-xl md:text-2xl lg:text-3xl font-medium text-charcoal-900',
    6: 'text-lg md:text-xl lg:text-2xl font-medium text-charcoal-900'
  }
  
  return (
    <Tag className={cn(styles[level], className)} style={{ fontFamily: 'var(--font-display)' }}>
      {children}
    </Tag>
  )
}
