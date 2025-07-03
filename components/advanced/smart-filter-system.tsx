"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, Star, Palette, Ruler, Tag, Zap } from "lucide-react"

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  ratings: number
  brands: string[]
  features: string[]
}

interface SmartFilterSystemProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
}

export function SmartFilterSystem({ isOpen, onClose, onApplyFilters }: SmartFilterSystemProps) {
  const [activeTab, setActiveTab] = useState("categories")
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 500],
    sizes: [],
    colors: [],
    ratings: 0,
    brands: [],
    features: [],
  })

  const categories = [
    { name: "Hoodies & Sweatshirts", count: 156, icon: "👕" },
    { name: "T-Shirts & Tops", count: 234, icon: "👔" },
    { name: "Jackets & Coats", count: 89, icon: "🧥" },
    { name: "Pants & Jeans", count: 167, icon: "👖" },
    { name: "Footwear", count: 198, icon: "👟" },
    { name: "Accessories", count: 145, icon: "🎒" },
    { name: "Tech Wear", count: 67, icon: "⚡" },
    { name: "Luxury Collection", count: 34, icon: "💎" },
    { name: "Limited Edition", count: 23, icon: "🔥" },
    { name: "Sustainable", count: 78, icon: "🌱" },
    { name: "Streetwear", count: 189, icon: "🏙️" },
    { name: "Athletic", count: 123, icon: "🏃" },
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Cyan", hex: "#06B6D4" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Green", hex: "#10B981" },
    { name: "Yellow", hex: "#F59E0B" },
    { name: "Orange", hex: "#F97316" },
    { name: "Gray", hex: "#6B7280" },
    { name: "Navy", hex: "#1E3A8A" },
  ]

  const brands = [
    "UrbanSpace",
    "NeonTech",
    "CyberWear",
    "FutureStyle",
    "HoloFashion",
    "TechStreet",
    "QuantumWear",
    "NeoStyle",
  ]

  const features = [
    "LED Integration",
    "Waterproof",
    "Breathable",
    "Anti-Microbial",
    "Temperature Control",
    "Reflective",
    "Glow-in-Dark",
    "Smart Fabric",
  ]

  const priceRanges = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "$200 - $300", min: 200, max: 300 },
    { label: "Over $300", min: 300, max: 1000 },
  ]

  const tabs = [
    { id: "categories", label: "Categories", icon: Filter },
    { id: "price", label: "Price", icon: Tag },
    { id: "size", label: "Size", icon: Ruler },
    { id: "color", label: "Color", icon: Palette },
    { id: "rating", label: "Rating", icon: Star },
    { id: "features", label: "Features", icon: Zap },
  ]

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSizeToggle = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }))
  }

  const handleColorToggle = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }))
  }

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      sizes: [],
      colors: [],
      ratings: 0,
      brands: [],
      features: [],
    })
  }

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.sizes.length +
      filters.colors.length +
      filters.brands.length +
      filters.features.length +
      (filters.ratings > 0 ? 1 : 0)
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Filter className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Smart Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-800">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-purple-400 border-b-2 border-purple-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === "categories" && (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {categories.map((category) => (
                      <motion.button
                        key={category.name}
                        onClick={() => handleCategoryToggle(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          filters.categories.includes(category.name)
                            ? "bg-purple-600/20 border-purple-500 text-purple-300"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "price" && (
                  <motion.div
                    key="price"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      {priceRanges.map((range) => (
                        <motion.button
                          key={range.label}
                          onClick={() => setFilters((prev) => ({ ...prev, priceRange: [range.min, range.max] }))}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                              ? "bg-purple-600/20 border-purple-500 text-purple-300"
                              : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium">{range.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "size" && (
                  <motion.div
                    key="size"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`p-3 rounded-lg border font-medium transition-all ${
                          filters.sizes.includes(size)
                            ? "bg-purple-600/20 border-purple-500 text-purple-300"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "color" && (
                  <motion.div
                    key="color"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-4 gap-3"
                  >
                    {colors.map((color) => (
                      <motion.button
                        key={color.name}
                        onClick={() => handleColorToggle(color.name)}
                        className={`relative p-3 rounded-lg border transition-all ${
                          filters.colors.includes(color.name)
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="w-8 h-8 rounded-full mx-auto mb-2 border border-gray-600"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs text-gray-300">{color.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "rating" && (
                  <motion.div
                    key="rating"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <motion.button
                        key={rating}
                        onClick={() => setFilters((prev) => ({ ...prev, ratings: rating }))}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          filters.ratings === rating
                            ? "bg-purple-600/20 border-purple-500 text-purple-300"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">& Up</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "features" && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {features.map((feature) => (
                      <motion.button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          filters.features.includes(feature)
                            ? "bg-purple-600/20 border-purple-500 text-purple-300"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-medium">{feature}</span>
                        <Zap className="w-4 h-4" />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => onApplyFilters(filters)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
