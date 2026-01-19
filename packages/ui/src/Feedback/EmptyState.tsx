import React from 'react';
import { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon: Icon,
    action,
    className
}) => {
    return (
        <div className={twMerge("flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50", className)}>
            {Icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                    <Icon className="h-6 w-6 text-neutral-400" aria-hidden="true" />
                </div>
            )}
            <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
            )}
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
};
