import React, { createContext, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { motion, HTMLMotionProps } from 'framer-motion'

interface TabsContextType {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string
    value?: string
    onValueChange?: (value: string) => void
}

export const Tabs: React.FC<TabsProps> = ({
    defaultValue,
    value,
    onValueChange,
    children,
    className,
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue)

    const handleValueChange = (newValue: string) => {
        if (onValueChange) {
            onValueChange(newValue)
        } else {
            setInternalValue(newValue)
        }
    }

    const currentValue = value !== undefined ? value : internalValue

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={twMerge('w-full', className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    fullWidth?: boolean
}

export const TabsList: React.FC<TabsListProps> = ({ children, className, fullWidth, ...props }) => {
    return (
        <div
            className={twMerge(
                'inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, className, value, ...props }) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsTrigger must be used within Tabs')

    const isActive = context.value === value

    return (
        <button
            type="button"
            className={twMerge(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
                isActive
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50'
                    : 'hover:bg-gray-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100',
                className
            )}
            onClick={() => context.onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    )
}

interface TabsContentProps extends HTMLMotionProps<'div'> {
    value: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, className, value, ...props }) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsContent must be used within Tabs')

    if (context.value !== value) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={twMerge(
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    )
}
