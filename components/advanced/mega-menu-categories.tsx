"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Crown, Sparkles } from "lucide-react"

interface SubCategory {
  id: string
  name: string
  count: number
  isNew?: boolean
  isTrending?: boolean
  image: string
}

interface Category {
  id: string
  name: string
  icon: string
  description: string
  image: string
  subcategories: SubCategory[]
  featured: {
    title: string
    description: string
    image: string
    price: string
  }
}

const categories: Category[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    icon: "👕",
    description: "Urban fashion for the modern rebel",
    image: "/placeholder.svg?height=400&width=600",
    subcategories: [
      {
        id: "hoodies",
        name: "Hoodies & Sweatshirts",
        count: 156,
        isTrending: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "graphic-tees", name: "Graphic T-Shirts", count: 234, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "oversized",
        name: "Oversized Fits",
        count: 89,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "joggers", name: "Joggers & Sweatpants", count: 167, image: "/placeholder.svg?height=200&width=200" },
      { id: "caps", name: "Caps & Beanies", count: 78, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "sneakers",
        name: "Street Sneakers",
        count: 198,
        isTrending: true,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    featured: {
      title: "Neon Pulse Collection",
      description: "Limited edition glow-in-the-dark streetwear",
      image: "/placeholder.svg?height=300&width=300",
      price: "From $89",
    },
  },
  {
    id: "techwear",
    name: "Tech Wear",
    icon: "🤖",
    description: "Futuristic fashion meets functionality",
    image: "/placeholder.svg?height=400&width=600",
    subcategories: [
      {
        id: "smart-jackets",
        name: "Smart Jackets",
        count: 45,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "led-clothing",
        name: "LED Clothing",
        count: 67,
        isTrending: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "tactical-pants", name: "Tactical Pants", count: 123, image: "/placeholder.svg?height=200&width=200" },
      { id: "cyber-accessories", name: "Cyber Accessories", count: 89, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "holographic",
        name: "Holographic Pieces",
        count: 34,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "wearable-tech", name: "Wearable Tech", count: 56, image: "/placeholder.svg?height=200&width=200" },
    ],
    featured: {
      title: "Quantum Series",
      description: "Next-gen wearable technology",
      image: "/placeholder.svg?height=300&width=300",
      price: "From $299",
    },
  },
  {
    id: "luxury",
    name: "Luxury",
    icon: "👑",
    description: "Premium pieces for the elite",
    image: "/placeholder.svg?height=400&width=600",
    subcategories: [
      { id: "designer-hoodies", name: "Designer Hoodies", count: 78, image: "/placeholder.svg?height=200&width=200" },
      { id: "premium-denim", name: "Premium Denim", count: 134, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "luxury-sneakers",
        name: "Luxury Sneakers",
        count: 89,
        isTrending: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "silk-pieces", name: "Silk & Satin", count: 45, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "limited-edition",
        name: "Limited Edition",
        count: 23,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "couture", name: "Haute Couture", count: 12, image: "/placeholder.svg?height=200&width=200" },
    ],
    featured: {
      title: "Royal Collection",
      description: "Handcrafted luxury streetwear",
      image: "/placeholder.svg?height=300&width=300",
      price: "From $599",
    },
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "💎",
    description: "Complete your look with style",
    image: "/placeholder.svg?height=400&width=600",
    subcategories: [
      { id: "bags", name: "Bags & Backpacks", count: 167, image: "/placeholder.svg?height=200&width=200" },
      { id: "jewelry", name: "Jewelry", count: 234, isTrending: true, image: "/placeholder.svg?height=200&width=200" },
      { id: "watches", name: "Smart Watches", count: 89, image: "/placeholder.svg?height=200&width=200" },
      { id: "sunglasses", name: "Sunglasses", count: 156, image: "/placeholder.svg?height=200&width=200" },
      { id: "belts", name: "Belts & Chains", count: 78, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "phone-cases",
        name: "Phone Cases",
        count: 123,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    featured: {
      title: "Cyber Accessories",
      description: "Tech-enhanced accessories",
      image: "/placeholder.svg?height=300&width=300",
      price: "From $49",
    },
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: "👟",
    description: "Step into the future",
    image: "/placeholder.svg?height=400&width=600",
    subcategories: [
      {
        id: "sneakers",
        name: "Sneakers",
        count: 298,
        isTrending: true,
        image: "/placeholder.svg?height=200&width=200",
      },
      { id: "boots", name: "Boots", count: 134, image: "/placeholder.svg?height=200&width=200" },
      { id: "sandals", name: "Sandals", count: 67, image: "/placeholder.svg?height=200&width=200" },
      { id: "led-shoes", name: "LED Shoes", count: 45, isNew: true, image: "/placeholder.svg?height=200&width=200" },
      { id: "platform", name: "Platform Shoes", count: 89, image: "/placeholder.svg?height=200&width=200" },
      {
        id: "smart-shoes",
        name: "Smart Shoes",
        count: 23,
        isNew: true,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    featured: {
      title: "Glow Runners",
      description: "Self-illuminating performance shoes",
      image: "/placeholder.svg?height=300&width=300",
      price: "From $199",
    },
  },
]

interface MegaMenuCategoriesProps {
  isOpen: boolean
  onClose: () => void
}

export function MegaMenuCategories({ isOpen, onClose }: MegaMenuCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mega Menu */}
          <motion.div
            className="fixed top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50 shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Categories List */}
                <div className="lg:col-span-1 space-y-2">
                  <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-xs opacity-75">{category.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Category Content */}
                <div className="lg:col-span-4">
                  <AnimatePresence mode="wait">
                    {activeCategory && (
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {(() => {
                          const category = categories.find((c) => c.id === activeCategory)
                          if (!category) return null

                          return (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Subcategories */}
                              <div className="lg:col-span-2">
                                <h4 className="text-xl font-bold text-white mb-6">{category.name}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  {category.subcategories.map((subcategory) => (
                                    <motion.div
                                      key={subcategory.id}
                                      className="group cursor-pointer"
                                      onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                                      onMouseLeave={() => setHoveredSubcategory(null)}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      <div className="relative overflow-hidden rounded-lg mb-3">
                                        <img
                                          src={subcategory.image || "/placeholder.svg"}
                                          alt={subcategory.name}
                                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex space-x-1">
                                          {subcategory.isNew && (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                              NEW
                                            </span>
                                          )}
                                          {subcategory.isTrending && (
                                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                                              <TrendingUp className="w-3 h-3" />
                                              <span>HOT</span>
                                            </span>
                                          )}
                                        </div>

                                        {/* Hover Overlay */}
                                        <motion.div
                                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: hoveredSubcategory === subcategory.id ? 1 : 0 }}
                                        />
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <h5 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                                          {subcategory.name}
                                        </h5>
                                        <span className="text-sm text-gray-400">{subcategory.count}</span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Featured Product */}
                              <div className="lg:col-span-1">
                                <motion.div
                                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="flex items-center space-x-2 mb-4">
                                    <Crown className="w-5 h-5 text-yellow-400" />
                                    <span className="text-yellow-400 font-semibold">Featured</span>
                                  </div>

                                  <img
                                    src={category.featured.image || "/placeholder.svg"}
                                    alt={category.featured.title}
                                    className="w-full h-32 object-cover rounded-lg mb-4"
                                  />

                                  <h5 className="text-lg font-bold text-white mb-2">{category.featured.title}</h5>
                                  <p className="text-gray-400 text-sm mb-4">{category.featured.description}</p>

                                  <div className="flex items-center justify-between">
                                    <span className="text-purple-400 font-bold">{category.featured.price}</span>
                                    <motion.button
                                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white text-sm font-medium"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Shop Now
                                    </motion.button>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          )
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Default State */}
                  {!activeCategory && (
                    <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-2xl font-bold text-white mb-2">Explore Our Collections</h4>
                      <p className="text-gray-400">Hover over a category to discover amazing products</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
