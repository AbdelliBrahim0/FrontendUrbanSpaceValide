"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Eye } from "lucide-react"
import { WishlistButton } from "./wishlist-button"

interface Product {
  id: number
  name: string
  price: number
  image: string
  isNew?: boolean
  category: string
  rating?: number
  reviews?: number
  description?: string
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  originalPrice?: number
  discount?: number
}

interface ProductCardsProps {
  product?: Product
}

export function ProductCards({ product }: ProductCardsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Early return if product is undefined
  if (!product) {
    return (
      <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 p-6">
        <div className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-800 rounded mb-2"></div>
          <div className="h-6 bg-gray-800 rounded mb-3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  // Safe property access with defaults
  const {
    id,
    name = "Product Name",
    price = 0,
    image = "/placeholder.svg?height=400&width=300",
    category = "Category",
    isNew = false,
    rating = 4.5,
    reviews = 0,
    description = "Premium quality streetwear piece",
    sizes = ["S", "M", "L", "XL"],
    colors = ["Black", "White"],
    inStock = true,
    originalPrice,
    discount,
  } = product

  const handleAddToCart = () => {
    console.log("Added to cart:", name)
  }

  return (
    <motion.div
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -10,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Card Container */}
      <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 group-hover:border-purple-500/50 transition-all duration-300">
        {/* New Badge */}
        {isNew && (
          <motion.div
            className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            New
          </motion.div>
        )}

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <motion.div
            className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginTop: isNew ? "2.5rem" : "0" }}
          >
            -{discount}%
          </motion.div>
        )}

        {/* Stock Status */}
        {!inStock && (
          <motion.div
            className="absolute top-4 right-16 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Out of Stock
          </motion.div>
        )}

        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.8 }}
          />

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: inStock ? 1.1 : 1 }}
              whileTap={{ scale: inStock ? 0.9 : 1 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag className="w-5 h-5 text-white relative z-10" />

              {/* Beam Effect */}
              {inStock && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <motion.p
            className="text-purple-400 text-sm font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {category}
          </motion.p>

          <motion.h3
            className="text-white text-lg font-semibold mb-3 group-hover:text-purple-300 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {name}
          </motion.h3>

          {/* Rating */}
          {reviews > 0 && (
            <motion.div
              className="flex items-center space-x-2 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-600"}`}
                    whileHover={{ scale: 1.2 }}
                  >
                    ★
                  </motion.div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">({reviews})</span>
            </motion.div>
          )}

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">${price}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  inStock
                    ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30 hover:border-purple-400/50"
                    : "bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={{ scale: inStock ? 1.05 : 1 }}
                whileTap={{ scale: inStock ? 0.95 : 1 }}
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </motion.button>
              <WishlistButton productId={id} className="ml-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
