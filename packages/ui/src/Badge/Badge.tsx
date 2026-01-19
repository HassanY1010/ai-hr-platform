// packages/ui/src/Badge/Badge.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-800',
        info: 'bg-blue-100 text-blue-800',
        neutral: 'bg-neutral-100 text-neutral-800',
        outline: 'border border-neutral-300 bg-white text-neutral-700',
        ai: 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface BadgeProps
  extends Omit<HTMLMotionProps<'div'>, 'variant' | 'children' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationEnd' | 'onAnimationIteration'>,
  VariantProps<typeof badgeVariants> {
  children?: React.ReactNode
  pulse?: boolean
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse, icon, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={twMerge(badgeVariants({ variant, size, className }))}
        animate={pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </motion.div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }