// packages/ui/src/animations/AnimatedRoute.tsx
import React from 'react'
import { motion } from 'framer-motion'

export interface AnimatedRouteProps {
    children: React.ReactNode
}

export const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    )
}
