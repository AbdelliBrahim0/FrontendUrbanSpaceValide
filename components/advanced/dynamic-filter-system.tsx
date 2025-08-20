"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, ChevronDown, ChevronUp, Check } from "lucide-react"
import { categoriesApi, subcategoriesApi } from "@/lib/api"

interface FilterOptions {
  categories: number[]
  subcategories: number[]
  priceRange: [number, number]
}

interface DynamicFilterSystemProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
}

interface Category {
  id: number
  name: string
  slug?: string
  subcategories: Array<{
    id: number
    name: string
    slug?: string
    productCount?: number
  }>
}

export function DynamicFilterSystem({ isOpen, onClose, onApplyFilters }: DynamicFilterSystemProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
    priceRange: [0, 1000],
  })

  // Charger les catégories et sous-catégories
  useEffect(() => {
    const loadCategories = async () => {
      if (!isOpen) return
      
      try {
        setLoading(true)
        const [categoriesData, subcategoriesData] = await Promise.all([
          categoriesApi.list(),
          subcategoriesApi.list()
        ])

        // Transformer les données pour les adapter à notre interface
        const formattedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          subcategories: subcategoriesData
            .filter(sub => sub.categories?.some(cat => cat.id === category.id))
            .map(sub => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              productCount: sub.products?.length || 0
            }))
        }))

        setCategories(formattedCategories)
        
        // Développer la première catégorie par défaut
        if (formattedCategories.length > 0 && expandedCategory === null) {
          setExpandedCategory(formattedCategories[0].id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [isOpen])

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const toggleSubcategory = (subcategoryId: number) => {
    setFilters(prev => {
      const newSubcategories = prev.subcategories.includes(subcategoryId)
        ? prev.subcategories.filter(id => id !== subcategoryId)
        : [...prev.subcategories, subcategoryId]
      
      // Mettre à jour les catégories sélectionnées en fonction des sous-catégories
      const categoryIds = new Set<number>()
      categories.forEach(cat => {
        if (cat.subcategories.some(sub => newSubcategories.includes(sub.id))) {
          categoryIds.add(cat.id)
        }
      })

      return {
        ...prev,
        subcategories: newSubcategories,
        categories: Array.from(categoryIds)
      }
    })
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      priceRange: [0, 1000],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filtres</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Catégories */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white mb-3">Catégories</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category.id} className="border-b border-gray-800 last:border-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex justify-between items-center py-3 px-2 rounded-lg transition-colors ${
                        expandedCategory === category.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="font-medium text-white">{category.name}</span>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedCategory === category.id && category.subcategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 py-1 space-y-1 overflow-hidden"
                        >
                          {category.subcategories.map(subcategory => (
                            <label 
                              key={subcategory.id}
                              className={`flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors ${
                                filters.subcategories.includes(subcategory.id)
                                  ? 'bg-cyan-500/10 text-cyan-400'
                                  : 'hover:bg-gray-800/50 text-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={filters.subcategories.includes(subcategory.id)}
                                onChange={() => toggleSubcategory(subcategory.id)}
                                className="sr-only"
                              />
                              <div className={`flex items-center justify-center w-5 h-5 border rounded mr-3 ${
                                filters.subcategories.includes(subcategory.id)
                                  ? 'bg-cyan-500 border-cyan-500'
                                  : 'border-gray-600'
                              }`}>
                                {filters.subcategories.includes(subcategory.id) && (
                                  <Check className="h-3.5 w-3.5 text-white" />
                                )}
                              </div>
                              <span className="text-sm">
                                {subcategory.name}
                                {subcategory.productCount !== undefined && (
                                  <span className="ml-2 text-xs text-gray-400">
                                    ({subcategory.productCount})
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plage de prix */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Prix (TND)</h3>
            <div className="px-2">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{filters.priceRange[0]} TND</span>
                <span>{filters.priceRange[1]} TND</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value)
                  setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], newValue]
                  }))
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-between space-x-3">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
          >
            Appliquer les filtres
            {filters.subcategories.length > 0 && (
              <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {filters.subcategories.length}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
