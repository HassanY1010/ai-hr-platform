// packages/ui/src/LoadingStates/LoadingCard.tsx
import React from 'react'
import { Card, CardContent, CardHeader } from '../Card'

import { motion } from 'framer-motion'

interface LoadingCardProps {
  title?: string
  lines?: number
}

const LoadingCard: React.FC<LoadingCardProps> = ({ title, lines = 3 }) => {
  return (
    <Card className="overflow-hidden">
      {title && (
        <CardHeader
          title={title}
          description={
            <span className="inline-block h-4 w-32 bg-neutral-200 rounded animate-pulse" />
          }
        />
      )}
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <motion.div
              key={index}
              className="h-4 bg-neutral-200 rounded animate-pulse"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.1
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { LoadingCard }
