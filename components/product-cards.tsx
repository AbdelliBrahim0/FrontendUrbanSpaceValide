"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Eye } from "lucide-react"
import { WishlistButton } from "./wishlist-button"

interface Product {
  id: number
  name: string
  price: number
  image: string
  hoverImage?: string
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

const ProductCard = ({ product }: ProductCardsProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Early return if product is undefined
  if (!product) {
    return (
      <div className="relative bg-[#06090e] rounded-2xl overflow-hidden border border-gray-800/50 p-6">
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
    hoverImage = image,
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
      <div className="relative bg-[#06090e] rounded-2xl overflow-hidden border border-gray-800/50 group-hover:border-purple-500/50 transition-all duration-300">
        {/* New Badge */}
        {isNew && (
          <motion.div
            className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            New
          </motion.div>
        )}

        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-opacity duration-300"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isHovered && hoverImage ? 0 : 1,
            }}
          />
          {hoverImage && (
            <motion.img
              src={hoverImage}
              alt={`${name} hover`}
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Quick Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-sm transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="relative overflow-hidden rounded-full p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-white relative z-10" />
              {inStock && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </button>
            <button className="relative overflow-hidden rounded-full p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Eye className="w-5 h-5 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </button>
            <WishlistButton
              isLiked={isLiked}
              onClick={() => setIsLiked(!isLiked)}
            />
          </div>
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
            className="text-white text-lg font-semibold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {name}
          </motion.h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              ({reviews} {reviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-bold">{price.toFixed(2)} TND</span>
            {originalPrice && (
              <span className="text-gray-400 text-sm line-through">
                {originalPrice.toFixed(2)} TND
              </span>
            )}
            {discount && (
              <span className="text-green-400 text-sm font-medium">
                {discount}% OFF
              </span>
            )}
            {!inStock && (
              <span className="text-red-400 text-sm font-medium ml-auto">
                Out of Stock
              </span>
            )}
          </div>
          
          <div className="mt-4">
            <motion.button
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                inStock
                  ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30 hover:border-purple-400/50"
                  : "bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
              whileHover={{ scale: inStock ? 1.02 : 1 }}
              whileTap={{ scale: inStock ? 0.98 : 1 }}
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
