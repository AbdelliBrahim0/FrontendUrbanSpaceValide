"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { categoriesApi, subcategoriesApi, type Category as ApiCategory, type Subcategory as ApiSubcategory } from "@/lib/api"
import { Loader2, ChevronRight } from "lucide-react"

interface SubCategory {
  id: number
  name: string
  slug?: string
  productCount?: number
  categoryId?: number
  categoryName?: string
}

interface Category {
  id: number
  name: string
  slug?: string
  description?: string
  subcategories: SubCategory[]
  productCount?: number
  icon?: string
  color?: string
}

// Mappage des icônes par catégorie
const categoryIcons: Record<string, string> = {
  "homme": "👔",
  "femme": "👚",
  "enfant": "👶",
  "accessoires": "🕶️",
  "chaussures": "👟",
  "nouveautes": "✨",
  "tendances": "🔥",
  "soldes": "🏷️",
  "collections": "🛍️"
}

// Couleurs dégradées pour les catégories
const categoryColors: Record<string, string> = {
  "homme": "from-blue-500 to-cyan-500",
  "femme": "from-pink-500 to-purple-500",
  "enfant": "from-green-400 to-emerald-500",
  "accessoires": "from-amber-500 to-orange-500",
  "chaussures": "from-red-500 to-pink-500",
  "nouveautes": "from-yellow-400 to-orange-500",
  "tendances": "from-purple-500 to-pink-500",
  "soldes": "from-red-500 to-yellow-500",
  "collections": "from-indigo-500 to-purple-600",
  "default": "from-gray-500 to-gray-700"
}

// Fonction pour obtenir l'icône en fonction du nom de la catégorie
const getCategoryIcon = (categoryName: string): string => {
  if (!categoryName) return "📦"
  const lowerName = categoryName.toLowerCase()
  
  // Vérifier les correspondances partielles
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (lowerName.includes(key)) {
      return icon
    }
  }
  
  return "📦"
}

// Fonction pour obtenir la couleur en fonction du nom de la catégorie
const getCategoryColor = (categoryName: string): string => {
  if (!categoryName) return categoryColors["default"]
  const lowerName = categoryName.toLowerCase()
  
  // Vérifier les correspondances partielles
  for (const [key, color] of Object.entries(categoryColors)) {
    if (lowerName.includes(key)) {
      return color
    }
  }
  
  return categoryColors["default"]
}

interface DynamicCategoriesMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function DynamicCategoriesMenu({ isOpen, onClose }: DynamicCategoriesMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        // Récupérer d'abord toutes les catégories
        const categoriesData = await categoriesApi.list()
        // Puis toutes les sous-catégories
        const allSubcategories = await subcategoriesApi.list()
        
        // Transformer les données de l'API en format attendu
        const formattedCategories = categoriesData.map((category: ApiCategory) => {
          // Filtrer les sous-catégories pour cette catégorie
          const categorySubcategories = allSubcategories.filter(
            (sub: ApiSubcategory) => 
              sub.categories?.some(cat => cat.id === category.id)
          )
          
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            productCount: category.subCategories?.length || 0,
            icon: getCategoryIcon(category.name),
            color: getCategoryColor(category.name),
            subcategories: categorySubcategories.map((sub: ApiSubcategory) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              productCount: sub.products?.length || 0,
              categoryId: category.id,
              categoryName: category.name
            }))
          }
        })
        
        setCategories(formattedCategories)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 pt-24 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Toutes les catégories</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Liste des catégories */}
                  <div className="md:col-span-1 space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                          selectedCategory?.id === category.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Sous-catégories */}
                  <div className="md:col-span-3 bg-gray-800/50 rounded-xl p-6">
                    {selectedCategory ? (
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="text-2xl">{selectedCategory.icon}</span>
                          <h3 className="text-xl font-bold text-white">{selectedCategory.name}</h3>
                          {selectedCategory.productCount && (
                            <span className="text-sm text-gray-400">
                              {selectedCategory.productCount} produits
                            </span>
                          )}
                        </div>
                        
                        {selectedCategory.description && (
                          <p className="text-gray-300 mb-6">{selectedCategory.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cons-3 gap-4">
                          {selectedCategory.subcategories.map((subcategory) => (
                            <a
                              key={subcategory.id}
                              href={`/boutique?category=${selectedCategory.slug || selectedCategory.id}&subcategory=${subcategory.slug || subcategory.id}`}
                              className="block p-4 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                    {subcategory.name}
                                  </h4>
                                  {subcategory.productCount && (
                                    <span className="text-xs text-gray-400">
                                      {subcategory.productCount} produits
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        Sélectionnez une catégorie pour voir les sous-catégories
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
