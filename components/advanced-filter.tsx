"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, Star, Sliders } from "lucide-react"

interface AdvancedFilterProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
}

const filterOptions = {
  Category: {
    type: "checkbox",
    options: ["Hoodies", "T-Shirts", "Jackets", "Pants", "Shoes", "Accessories"],
  },
  Size: {
    type: "checkbox",
    options: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  Color: {
    type: "color",
    options: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Purple", value: "#8B5CF6" },
      { name: "Cyan", value: "#06B6D4" },
      { name: "Pink", value: "#EC4899" },
      { name: "Green", value: "#10B981" },
    ],
  },
  Price: {
    type: "range",
    min: 0,
    max: 500,
  },
  Brand: {
    type: "checkbox",
    options: ["UrbanSpace", "NeonWear", "CyberStyle", "FutureThreads", "GlowFashion"],
  },
  Rating: {
    type: "rating",
    options: [5, 4, 3, 2, 1],
  },
  Material: {
    type: "checkbox",
    options: ["Cotton", "Polyester", "Blend", "Denim", "Leather", "Synthetic"],
  },
  Style: {
    type: "checkbox",
    options: ["Casual", "Formal", "Streetwear", "Vintage", "Modern", "Minimalist"],
  },
}

export function AdvancedFilter({ isOpen, onClose, onApplyFilters }: AdvancedFilterProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Category", "Size", "Price"])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [priceRange, setPriceRange] = useState([0, 500])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleFilter = (category: string, filter: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(filter)
        ? prev[category].filter((f: string) => f !== filter)
        : [...(prev[category] || []), filter],
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setPriceRange([0, 500])
  }

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, filters) => {
      if (Array.isArray(filters)) {
        return count + filters.length
      }
      return count
    }, 0)
  }

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

          {/* Filter Panel */}
          <motion.div
            className="fixed left-0 top-0 h-full w-full max-w-md bg-gray-900 z-50 shadow-2xl border-r border-gray-800"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <Sliders className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {Object.entries(filterOptions).map(([category, config]) => (
                  <motion.div
                    key={category}
                    className="border border-gray-800 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      className="flex items-center justify-between w-full text-left mb-3"
                      onClick={() => toggleSection(category)}
                      whileHover={{ x: 5 }}
                    >
                      <h3 className="text-white font-semibold">{category}</h3>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(category) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedSections.includes(category) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Checkbox Options */}
                          {config.type === "checkbox" && (
                            <div className="space-y-2">
                              {config.options.map((option: string) => (
                                <motion.label
                                  key={option}
                                  className="flex items-center space-x-3 cursor-pointer group"
                                  whileHover={{ x: 5 }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedFilters[category]?.includes(option) || false}
                                    onChange={() => toggleFilter(category, option)}
                                    className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                                  />
                                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                    {option}
                                  </span>
                                </motion.label>
                              ))}
                            </div>
                          )}

                          {/* Color Options */}
                          {config.type === "color" && (
                            <div className="grid grid-cols-3 gap-3">
                              {config.options.map((color: any) => (
                                <motion.button
                                  key={color.name}
                                  className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                                    selectedFilters[category]?.includes(color.name)
                                      ? "border-purple-500"
                                      : "border-gray-600 hover:border-gray-500"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleFilter(category, color.name)}
                                >
                                  <div
                                    className="w-8 h-8 rounded-full mx-auto mb-1"
                                    style={{ backgroundColor: color.value }}
                                  />
                                  <span className="text-xs text-gray-300">{color.name}</span>
                                </motion.button>
                              ))}
                            </div>
                          )}

                          {/* Price Range */}
                          {config.type === "range" && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-300">${priceRange[0]}</span>
                                <span className="text-gray-300">${priceRange[1]}</span>
                              </div>
                              <div className="relative">
                                <input
                                  type="range"
                                  min={config.min}
                                  max={config.max}
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                          )}

                          {/* Rating Options */}
                          {config.type === "rating" && (
                            <div className="space-y-2">
                              {config.options.map((rating: number) => (
                                <motion.label
                                  key={rating}
                                  className="flex items-center space-x-3 cursor-pointer group"
                                  whileHover={{ x: 5 }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedFilters[category]?.includes(rating) || false}
                                    onChange={() => toggleFilter(category, rating)}
                                    className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                                  />
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                        }`}
                                      />
                                    ))}
                                    <span className="text-gray-300 ml-2">& up</span>
                                  </div>
                                </motion.label>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800 space-y-3">
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onApplyFilters({ ...selectedFilters, priceRange })
                    onClose()
                  }}
                >
                  <span className="relative z-10">Apply Filters ({getActiveFiltersCount()})</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>

                <motion.button
                  className="w-full py-2 text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
