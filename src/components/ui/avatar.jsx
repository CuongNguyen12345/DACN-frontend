import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar" // Wait, need to check if installed. 
// If not installed, I'll mock it or install it. 
// Safest is to implement a simple span based Avatar if I don't want to install more deps, 
// OR run npm install @radix-ui/react-avatar.
// Given previous install issues, I'll try to stick to basic HTML/CSS implementation for Avatar if possible,
// but real Shadcn uses Radix. 
// Let's try to implement a pure React version of Avatar to avoid Radix dependency for now.

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
    // Simple img tag replacement for AvatarImage
    if (!src) return null;
    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn("aspect-square h-full w-full", className)}
            {...props}
        />
    )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
