"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface NeuralLoadingProps {
  isLoading: boolean
  progress?: number
  message?: string
}

export function NeuralLoading({ isLoading, progress = 0, message = "Loading..." }: NeuralLoadingProps) {
  const [dots, setDots] = useState<Array<{ x: number; y: number; id: number }>>([])

  useEffect(() => {
    const newDots = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: i,
    }))
    setDots(newDots)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-96 h-96">
        {/* Neural Network Visualization */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Connections */}
          {dots.map((dot, i) =>
            dots.slice(i + 1).map((otherDot, j) => {
              const distance = Math.sqrt(Math.pow(dot.x - otherDot.x, 2) + Math.pow(dot.y - otherDot.y, 2))
              if (distance < 30) {
                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={`${dot.x}%`}
                    y1={`${dot.y}%`}
                    x2={`${otherDot.x}%`}
                    y2={`${otherDot.y}%`}
                    stroke="url(#gradient)"
                    strokeWidth="1"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: (i + j) * 0.1 }}
                  />
                )
              }
              return null
            }),
          )}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Neural Nodes */}
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.id * 0.1,
            }}
          />
        ))}

        {/* Central Loading Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Spinning Ring */}
            <motion.div
              className="w-24 h-24 border-4 border-transparent border-t-purple-500 border-r-cyan-500 rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Loading Text */}
            <motion.p
              className="text-white text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {message}
            </motion.p>

            {/* Progress Percentage */}
            <motion.p
              className="text-purple-400 text-sm mt-2"
              key={progress}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
