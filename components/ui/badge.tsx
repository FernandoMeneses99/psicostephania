import * as React from 'react'

import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success'
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary-100 text-primary-700',
  secondary: 'bg-beige-100 text-ink-700',
  outline: 'border border-beige-200 text-ink-700 bg-transparent',
  success: 'bg-sage-100 text-sage-700',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
