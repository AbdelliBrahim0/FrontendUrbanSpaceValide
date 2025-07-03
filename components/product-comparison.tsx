"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Star, Check } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  features: string[]
  specs: Record<string, string>
}

interface ProductComparisonProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Neon Pulse Hoodie",
    price: 89,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 124,
    features: ["LED Technology", "Water Resistant", "Premium Cotton"],
    specs: {
      Material: "Cotton Blend",
      Weight: "450g",
      Care: "Machine Wash",
      Origin: "Made in USA",
    },
  },
  {
    id: 2,
    name: "Cyber Glow Hoodie",
    price: 99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 89,
    features: ["Fiber Optic", "Breathable", "Eco-Friendly"],
    specs: {
      Material: "Recycled Polyester",
      Weight: "420g",
      Care: "Hand Wash",
      Origin: "Made in Europe",
    },
  },
]

export function ProductComparison({ isOpen, onClose, products = sampleProducts }: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products.slice(0, 2))

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 3 && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
  }

  const allFeatures = Array.from(new Set(selectedProducts.flatMap((p) => p.features)))
  const allSpecs = Array.from(new Set(selectedProducts.flatMap((p) => Object.keys(p.specs))))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Comparison Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Product Comparison</h2>
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
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="text-left py-4 px-4 text-white font-semibold w-48">Features</th>
                        {selectedProducts.map((product) => (
                          <th key={product.id} className="text-center py-4 px-4 min-w-[250px]">
                            <div className="space-y-4">
                              {/* Product Image */}
                              <div className="relative">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                                />
                                <motion.button
                                  onClick={() => removeProduct(product.id)}
                                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-300"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-3 h-3 text-white" />
                                </motion.button>
                              </div>

                              {/* Product Info */}
                              <div>
                                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                                <p className="text-2xl font-bold text-purple-400 mb-2">${product.price}</p>
                                <div className="flex items-center justify-center space-x-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">({product.reviews})</span>
                                </div>
                              </div>
                            </div>
                          </th>
                        ))}
                        {selectedProducts.length < 3 && (
                          <th className="text-center py-4 px-4 min-w-[250px]">
                            <motion.button
                              className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-purple-500 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="w-8 h-8 text-gray-400" />
                            </motion.button>
                            <p className="text-gray-400 mt-2">Add Product</p>
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {/* Features Comparison */}
                      <tr className="border-t border-gray-800">
                        <td colSpan={selectedProducts.length + 2} className="py-3 px-4">
                          <h4 className="font-semibold text-purple-400">Key Features</h4>
                        </td>
                      </tr>
                      {allFeatures.map((feature) => (
                        <tr key={feature} className="border-t border-gray-800/50">
                          <td className="py-3 px-4 text-gray-300">{feature}</td>
                          {selectedProducts.map((product) => (
                            <td key={product.id} className="py-3 px-4 text-center">
                              {product.features.includes(feature) ? (
                                <Check className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}

                      {/* Specifications */}
                      <tr className="border-t border-gray-800">
                        <td colSpan={selectedProducts.length + 2} className="py-3 px-4">
                          <h4 className="font-semibold text-cyan-400">Specifications</h4>
                        </td>
                      </tr>
                      {allSpecs.map((spec) => (
                        <tr key={spec} className="border-t border-gray-800/50">
                          <td className="py-3 px-4 text-gray-300">{spec}</td>
                          {selectedProducts.map((product) => (
                            <td key={product.id} className="py-3 px-4 text-center text-gray-300">
                              {product.specs[spec] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                  {selectedProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">Add {product.name} to Cart</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
