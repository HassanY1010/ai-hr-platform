// packages/ui/src/Card/CardHeader.tsx
import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, title, description, action, children, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge('relative flex flex-col space-y-1.5 p-6', className)}
            {...props}
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1.5">
                    {title && (
                        <h3 className="text-2xl font-semibold leading-none tracking-tight text-neutral-900">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-neutral-500">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div className="ml-4 flex-shrink-0">{action}</div>}
            </div>
            {children}
        </div>
    )
)

CardHeader.displayName = 'CardHeader'

export { CardHeader }
