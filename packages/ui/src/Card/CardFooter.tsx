// packages/ui/src/Card/CardFooter.tsx
import React from 'react'
import { twMerge } from 'tailwind-merge'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge('flex items-center p-6 pt-0', className)}
            {...props}
        />
    )
)

CardFooter.displayName = 'CardFooter'

export { CardFooter }
