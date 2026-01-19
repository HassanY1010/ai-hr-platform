import React from "react"
import { twMerge } from "tailwind-merge"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
    {
        variants: {
            size: {
                sm: "h-8 w-8",
                md: "h-10 w-10",
                lg: "h-12 w-12",
                xl: "h-16 w-16",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
)

export interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> { }

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, size, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(avatarVariants({ size }), className)}
            {...props}
        />
    )
)
Avatar.displayName = "Avatar"

export interface AvatarImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> { }

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
    ({ className, ...props }, ref) => (
        <img
            ref={ref}
            className={twMerge("aspect-square h-full w-full object-cover", className)}
            {...props}
        />
    )
)
AvatarImage.displayName = "AvatarImage"

export interface AvatarFallbackProps
    extends React.HTMLAttributes<HTMLDivElement> { }

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge(
                "flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-medium",
                className
            )}
            {...props}
        />
    )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
