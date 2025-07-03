"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface WishlistButtonProps {
  productId: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function WishlistButton({ productId, className = "", size = "md" }: WishlistButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const handleToggle = () => {
    setIsLiked(!isLiked)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)

    // Here you would typically make an API call to add/remove from wishlist
    console.log(`${isLiked ? "Removed from" : "Added to"} wishlist:`, productId)
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`relative p-2 rounded-full transition-colors duration-300 ${
        isLiked ? "bg-red-500/20 hover:bg-red-500/30" : "bg-black/50 hover:bg-black/70"
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
          rotate: isAnimating ? [0, 15, -15, 0] : 0,
        }}
        transition={{ duration: 0.6 }}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors duration-300 ${
            isLiked ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </motion.div>

      {/* Floating hearts animation */}
      {isAnimating && isLiked && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 1, scale: 0.5 }}
              animate={{
                opacity: 0,
                scale: 1.5,
                y: -20,
                x: (i - 1) * 10,
              }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            </motion.div>
          ))}
        </>
      )}
    </motion.button>
  )
}
