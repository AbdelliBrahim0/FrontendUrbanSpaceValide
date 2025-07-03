"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, Clock, Zap } from "lucide-react"

interface Promotion {
  id: string
  type: "sale" | "flash" | "new" | "limited"
  title: string
  description: string
  discount?: string
  code?: string
  endTime?: Date
  bgGradient: string
  textColor: string
}

const promotions: Promotion[] = [
  {
    id: "flash-sale",
    type: "flash",
    title: "⚡ Flash Sale",
    description: "50% OFF on all hoodies - Limited time only!",
    discount: "50%",
    code: "FLASH50",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    bgGradient: "from-red-600 to-orange-600",
    textColor: "text-white",
  },
  {
    id: "new-collection",
    type: "new",
    title: "🆕 New Collection",
    description: "Discover our latest cyber streetwear collection",
    bgGradient: "from-purple-600 to-cyan-600",
    textColor: "text-white",
  },
  {
    id: "free-shipping",
    type: "sale",
    title: "🚚 Free Shipping",
    description: "Free shipping on orders over $100",
    code: "FREESHIP",
    bgGradient: "from-green-600 to-blue-600",
    textColor: "text-white",
  },
  // Ajoute d'autres bannières ici si besoin
  {
    id: "limited-edition",
    type: "limited",
    title: "🎉 Limited Edition",
    description: "Exclusive drops every Friday!",
    bgGradient: "from-pink-600 to-yellow-500",
    textColor: "text-white",
  },
  {
    id: "summer-sale",
    type: "sale",
    title: "🌞 Summer Sale",
    description: "Up to 70% off on selected items!",
    bgGradient: "from-yellow-400 to-orange-500",
    textColor: "text-black",
  },
]

const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
    width: "100%"
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
    width: "100%"
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: "absolute" as const,
    width: "100%"
  })
}

export function PromotionalBanner() {
  const [currentPromo, setCurrentPromo] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentPromo((prev) => (prev + 1) % promotions.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const promotion = promotions[currentPromo]

  return (
    <div className="relative min-h-[56px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={promotion.id}
          className={`relative bg-gradient-to-r ${promotion.bgGradient} py-3 px-4 overflow-hidden`}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)
                `,
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon based on promotion type */}
              <div className="flex items-center space-x-2">
                {promotion.type === "flash" && <Zap className="w-5 h-5 text-yellow-300" />}
                {promotion.type === "sale" && <Tag className="w-5 h-5 text-white" />}
                {promotion.type === "new" && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                {promotion.type === "limited" && <Tag className="w-5 h-5 text-pink-200" />}
              </div>

              <div className="flex items-center space-x-4">
                <motion.span
                  className={`font-bold ${promotion.textColor}`}
                  key={promotion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {promotion.title}
                </motion.span>

                <span className={`${promotion.textColor} opacity-90`}>{promotion.description}</span>

                {promotion.code && (
                  <motion.div
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-sm font-mono ${promotion.textColor}`}>Code: {promotion.code}</span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Countdown Timer */}
              {promotion.endTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white" />
                  {/* Le timer n'est plus dynamique, mais tu peux le réactiver si besoin */}
                  <span className={`text-sm font-mono ${promotion.textColor}`}>Limited Time</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
