"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp, Clock } from "lucide-react"

const trendingSearches = ["Neon Hoodies", "Cyber Sneakers", "LED Jackets", "Holographic Tees", "Future Pants"]

const recentSearches = ["Purple Hoodie", "Black Sneakers", "Streetwear", "Urban Style"]

const searchSuggestions = [
  { type: "product", name: "Neon Pulse Hoodie", category: "Hoodies", price: 89 },
  { type: "product", name: "Urban Glow Sneakers", category: "Shoes", price: 159 },
  { type: "category", name: "Hoodies", count: 24 },
  { type: "category", name: "Jackets", count: 12 },
  { type: "brand", name: "UrbanSpace Collection" },
]

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchSuggestions.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(searchSuggestions)
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      setQuery(searchQuery)
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setFilteredSuggestions(searchSuggestions)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.div
        className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-full transition-all duration-300 ${
          isOpen ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-gray-700"
        }`}
        whileFocus={{ scale: 1.02 }}
      >
        <div className="flex items-center px-6 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, brands, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
          {query && (
            <motion.button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown Content */}
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                {query.length === 0 ? (
                  <>
                    {/* Trending Searches */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-semibold text-white">Trending</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search) => (
                          <motion.button
                            key={search}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <h3 className="text-sm font-semibold text-white">Recent</h3>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search) => (
                          <motion.button
                            key={search}
                            onClick={() => handleSearch(search)}
                            className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <Clock className="w-4 h-4 text-gray-500 mr-3" />
                            <span className="text-gray-300">{search}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Search Results */
                  <div className="space-y-2">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleSearch(item.name)}
                          className="flex items-center justify-between w-full text-left px-3 py-3 hover:bg-gray-800 rounded-lg transition-colors duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="w-4 h-4 text-gray-500" />
                            <div>
                              <span className="text-white">{item.name}</span>
                              {item.type === "product" && (
                                <div className="text-sm text-gray-400">
                                  in {item.category} • ${item.price}
                                </div>
                              )}
                              {item.type === "category" && (
                                <div className="text-sm text-gray-400">{item.count} items</div>
                              )}
                            </div>
                          </div>
                          {item.type === "product" && (
                            <span className="text-purple-400 font-semibold">${item.price}</span>
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No results found for "{query}"</p>
                        <p className="text-sm text-gray-500 mt-1">Try searching for something else</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
