"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Eye, Heart, ShoppingBag, Zap } from "lucide-react"
import { Product3DViewer } from "./3d-product-viewer"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  isNew: boolean
  isLimited: boolean
  stock: number
  rating: number
  reviews: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Quantum Pulse Hoodie",
    price: 299,
    originalPrice: 399,
    images: ["/placeholder.svg?height=600&width=500", "/placeholder.svg?height=600&width=500"],
    category: "Hoodies",
    isNew: true,
    isLimited: false,
    stock: 12,
    rating: 4.9,
    reviews: 247,
  },
  {
    id: 2,
    name: "Neon Genesis Sneakers",
    price: 459,
    images: ["/placeholder.svg?height=600&width=500", "/placeholder.svg?height=600&width=500"],
    category: "Footwear",
    isNew: false,
    isLimited: true,
    stock: 3,
    rating: 4.8,
    reviews: 189,
  },
  // Add more products...
]

export function ImmersiveProductGrid() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={containerRef}
      className="py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div className="text-center mb-20" style={{ y }}>
          <motion.h2
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            FEATURED DROPS
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our most coveted pieces, crafted for the digital generation
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isHovered={hoveredProduct === product.id}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </motion.div>
  )
}

function ProductCard({
  product,
  index,
  isHovered,
  onHover,
  onLeave,
  onSelect,
}: {
  product: Product
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onSelect: () => void
}) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      whileHover={{ y: -20 }}
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50 group-hover:border-purple-500/50 transition-all duration-500">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
          {product.isNew && (
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              NEW
            </motion.div>
          )}
          {product.isLimited && (
            <motion.div
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Zap className="w-3 h-3" />
              <span>LIMITED</span>
            </motion.div>
          )}
        </div>

        {/* Product Image with 3D Effect */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateY: isHovered ? 5 : 0,
              rotateX: isHovered ? -5 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Holographic Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20"
              animate={{
                opacity: isHovered ? 1 : 0,
                background: isHovered
                  ? "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, transparent 50%, rgba(6, 182, 212, 0.3) 100%)"
                  : "linear-gradient(135deg, rgba(139, 92, 246, 0) 0%, transparent 50%, rgba(6, 182, 212, 0) 100%)",
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Hover Actions */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSelect}
            >
              <Eye className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              className="p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full hover:from-purple-700 hover:to-cyan-700 transition-all duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>

          {/* Stock Indicator */}
          {product.stock <= 5 && (
            <motion.div
              className="absolute bottom-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              Only {product.stock} left!
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-purple-400 text-sm font-medium mb-2">{product.category}</p>
            <h3 className="text-white text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600"}`}
                    whileHover={{ scale: 1.2 }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30 hover:border-purple-400/50 transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ADD TO CART
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-gray-900 rounded-3xl border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* 3D Viewer */}
          <div className="h-96 lg:h-full">
            <Product3DViewer images={product.images} productName={product.name} onFullscreen={() => {}} />
          </div>

          {/* Product Details */}
          <div className="p-8 overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
            <p className="text-purple-400 mb-6">{product.category}</p>

            <div className="text-4xl font-bold text-white mb-8">${product.price}</div>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ADD TO CART
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
