import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: '',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft',
  secondary: 'bg-beige-100 text-ink-900 hover:bg-beige-200',
  outline: 'border border-beige-200 bg-transparent hover:bg-beige-100 text-ink-700',
  ghost: 'hover:bg-beige-100 text-ink-700',
  link: 'text-primary-700 underline-offset-4 hover:underline',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-11 px-6 text-sm',
  sm: 'h-9 px-4 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' &&
            'bg-primary-600 text-white hover:bg-primary-700 shadow-soft',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
