// packages/ui/src/Card/Card.tsx
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'

import type { HTMLMotionProps } from 'framer-motion'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hoverable?: boolean
  bordered?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, bordered = true, padding = 'md', shadow = 'md', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={twMerge(
          'rounded-xl bg-white',
          bordered && 'border border-neutral-200',
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-6',
          padding === 'lg' && 'p-8',
          shadow === 'sm' && 'shadow-sm',
          shadow === 'md' && 'shadow-md',
          shadow === 'lg' && 'shadow-lg',
          shadow === 'xl' && 'shadow-xl',
          hoverable && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
          className
        )}
        whileHover={hoverable ? { y: -2 } : {}}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }
