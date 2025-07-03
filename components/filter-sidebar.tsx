"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown } from "lucide-react"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const filterCategories = {
  Category: ["Hoodies", "T-Shirts", "Jackets", "Pants", "Shoes", "Accessories"],
  Size: ["XS", "S", "M", "L", "XL", "XXL"],
  Color: ["Black", "White", "Purple", "Cyan", "Pink", "Green"],
  Price: ["Under $50", "$50 - $100", "$100 - $150", "$150 - $200", "Over $200"],
}

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Category", "Size"])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleFilter = (category: string, filter: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(filter)
        ? prev[category].filter((f) => f !== filter)
        : [...(prev[category] || []), filter],
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
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

          {/* Filter Sidebar */}
          <motion.div
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-gray-900 z-50 shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Filters</h2>
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
              <div className="flex-1 overflow-y-auto p-6">
                {Object.entries(filterCategories).map(([category, options]) => (
                  <motion.div
                    key={category}
                    className="mb-6"
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
                          className="space-y-2"
                        >
                          {options.map((option) => (
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
                >
                  <span className="relative z-10">Apply Filters</span>

                  {/* Beam Effect */}
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
