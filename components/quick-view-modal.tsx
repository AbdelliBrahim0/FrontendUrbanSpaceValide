"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Heart, Star, Plus, Minus } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating: number
  reviews: number
  description: string
  sizes: string[]
  colors: string[]
  category: string
  isNew: boolean
  inStock: boolean
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    console.log("Added to cart:", { product, selectedSize, selectedColor, quantity })
    // Add to cart logic here
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-bold text-white">Quick View</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={product.images[selectedImage] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.isNew && (
                        <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          New
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Sale</span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <motion.button
                      className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </motion.button>
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <motion.button
                          key={index}
                          className={`aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            selectedImage === index ? "border-purple-500" : "border-transparent hover:border-gray-600"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">{product.category}</p>
                    <h1 className="text-2xl font-bold text-white mt-1">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">
                          Save ${product.originalPrice - product.price}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>

                  {/* Color Selection */}
                  {product.colors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-2">Color</h3>
                      <div className="flex space-x-2">
                        {product.colors.map((color) => (
                          <motion.button
                            key={color}
                            className={`px-3 py-1 rounded border-2 transition-all duration-300 text-sm ${
                              selectedColor === color
                                ? "border-purple-500 bg-purple-500/20"
                                : "border-gray-600 hover:border-gray-500"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedColor(color)}
                          >
                            {color}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white mb-2">Size</h3>
                      <div className="grid grid-cols-6 gap-2">
                        {product.sizes.map((size) => (
                          <motion.button
                            key={size}
                            className={`py-2 rounded border-2 transition-all duration-300 text-sm ${
                              selectedSize === size
                                ? "border-purple-500 bg-purple-500/20"
                                : "border-gray-600 hover:border-gray-500"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="font-semibold text-white mb-2">Quantity</h3>
                    <div className="flex items-center border border-gray-600 rounded-lg w-fit">
                      <motion.button
                        className="p-2 hover:bg-gray-800 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                      <motion.button
                        className="p-2 hover:bg-gray-800 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="space-y-3">
                    <motion.button
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={!product.inStock || (product.sizes.length > 0 && !selectedSize)}
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span>
                          {!product.inStock
                            ? "Out of Stock"
                            : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
                        </span>
                      </span>

                      {/* Beam Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>

                    {product.sizes.length > 0 && !selectedSize && (
                      <p className="text-red-400 text-sm">Please select a size</p>
                    )}

                    <motion.button
                      className="w-full py-2 text-purple-400 hover:text-white transition-colors duration-300 text-sm"
                      whileHover={{ scale: 1.02 }}
                      onClick={onClose}
                    >
                      View Full Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
