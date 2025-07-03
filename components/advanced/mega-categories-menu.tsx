"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Flame,
  Heart,
  ShoppingBag,
  Users,
  Baby,
  Crown,
  Zap,
  Snowflake,
  Sun,
  Target,
  RefreshCw,
} from "lucide-react"

interface SubCategory {
  id: string
  name: string
  count: number
  isNew?: boolean
  isTrending?: boolean
  isPopular?: boolean
  image?: string
}

interface Category {
  id: string
  name: string
  icon: any
  description: string
  color: string
  subcategories: SubCategory[]
  featured?: {
    title: string
    description: string
    image: string
    badge?: string
  }
}

const mainCategories: Category[] = [
  {
    id: "nouveautes",
    name: "Nouveautés",
    icon: Sparkles,
    description: "Les dernières tendances urbaines",
    color: "from-yellow-500 to-orange-500",
    subcategories: [
      { id: "cette-semaine", name: "Cette semaine", count: 45, isNew: true },
      { id: "ce-mois", name: "Ce mois", count: 156 },
      { id: "pre-commandes", name: "Pré-commandes", count: 23, isTrending: true },
      { id: "exclusivites", name: "Exclusivités", count: 34, isPopular: true },
    ],
    featured: {
      title: "Collection Neon Dreams",
      description: "Nouvelle collection avec technologie LED intégrée",
      image: "/placeholder.svg?height=200&width=300",
      badge: "NOUVEAU",
    },
  },
  {
    id: "homme",
    name: "Homme",
    icon: Users,
    description: "Mode masculine urbaine",
    color: "from-blue-500 to-cyan-500",
    subcategories: [
      { id: "t-shirts-homme", name: "T-shirts & Polos", count: 234, isPopular: true },
      { id: "sweats-homme", name: "Sweats & Hoodies", count: 156, isTrending: true },
      { id: "chemises-homme", name: "Chemises", count: 89 },
      { id: "vestes-homme", name: "Vestes & Manteaux", count: 123 },
      { id: "pantalons-homme", name: "Pantalons", count: 167 },
      { id: "jeans-homme", name: "Jeans", count: 145, isPopular: true },
      { id: "shorts-homme", name: "Shorts", count: 78 },
      { id: "ensembles-homme", name: "Ensembles", count: 56 },
      { id: "costumes-homme", name: "Costumes & Blazers", count: 67 },
      { id: "sport-homme", name: "Vêtements de sport", count: 134, isTrending: true },
      { id: "loungewear-homme", name: "Loungewear", count: 98 },
    ],
    featured: {
      title: "Urban Professional",
      description: "Collection business casual pour l'homme moderne",
      image: "/placeholder.svg?height=200&width=300",
      badge: "TENDANCE",
    },
  },
  {
    id: "femme",
    name: "Femme",
    icon: Heart,
    description: "Mode féminine contemporaine",
    color: "from-pink-500 to-purple-500",
    subcategories: [
      { id: "t-shirts-femme", name: "T-shirts & Polos", count: 267, isPopular: true },
      { id: "sweats-femme", name: "Sweats & Hoodies", count: 189, isTrending: true },
      { id: "chemises-femme", name: "Chemises & Blouses", count: 134 },
      { id: "vestes-femme", name: "Vestes & Manteaux", count: 156 },
      { id: "pantalons-femme", name: "Pantalons", count: 198 },
      { id: "jeans-femme", name: "Jeans", count: 167, isPopular: true },
      { id: "shorts-femme", name: "Shorts", count: 89 },
      { id: "robes", name: "Robes", count: 123, isTrending: true },
      { id: "jupes", name: "Jupes", count: 78 },
      { id: "ensembles-femme", name: "Ensembles", count: 67 },
      { id: "sport-femme", name: "Vêtements de sport", count: 145, isTrending: true },
      { id: "loungewear-femme", name: "Loungewear", count: 112 },
    ],
    featured: {
      title: "Cyber Goddess",
      description: "Collection futuriste pour la femme d'aujourd'hui",
      image: "/placeholder.svg?height=200&width=300",
      badge: "EXCLUSIF",
    },
  },
  {
    id: "unisexe",
    name: "Unisexe",
    icon: Target,
    description: "Mode sans genre",
    color: "from-green-500 to-teal-500",
    subcategories: [
      { id: "t-shirts-unisexe", name: "T-shirts", count: 178, isPopular: true },
      { id: "sweats-unisexe", name: "Sweats & Hoodies", count: 134, isTrending: true },
      { id: "vestes-unisexe", name: "Vestes", count: 89 },
      { id: "pantalons-unisexe", name: "Pantalons", count: 123 },
      { id: "shorts-unisexe", name: "Shorts", count: 67 },
      { id: "ensembles-unisexe", name: "Ensembles", count: 45 },
      { id: "sport-unisexe", name: "Activewear", count: 98, isTrending: true },
    ],
    featured: {
      title: "Gender Free Zone",
      description: "Mode inclusive pour tous",
      image: "/placeholder.svg?height=200&width=300",
      badge: "INCLUSIF",
    },
  },
  {
    id: "enfants",
    name: "Enfants",
    icon: Baby,
    description: "Mode pour les plus jeunes",
    color: "from-orange-500 to-red-500",
    subcategories: [
      { id: "bebe", name: "Bébé (0-2 ans)", count: 89, isNew: true },
      { id: "garcon", name: "Garçon (3-12 ans)", count: 134, isPopular: true },
      { id: "fille", name: "Fille (3-12 ans)", count: 123, isPopular: true },
      { id: "ado", name: "Ado (13-17 ans)", count: 156, isTrending: true },
    ],
    featured: {
      title: "Mini Urban",
      description: "Style urbain adapté aux enfants",
      image: "/placeholder.svg?height=200&width=300",
      badge: "FAMILLE",
    },
  },
  {
    id: "accessoires",
    name: "Accessoires",
    icon: Crown,
    description: "Complétez votre look",
    color: "from-purple-500 to-indigo-500",
    subcategories: [
      { id: "casquettes", name: "Casquettes & Bonnets", count: 145, isPopular: true },
      { id: "sacs", name: "Sacs & Sacs à dos", count: 167, isTrending: true },
      { id: "lunettes", name: "Lunettes de soleil", count: 89 },
      { id: "bijoux", name: "Bijoux & Montres", count: 234, isPopular: true },
      { id: "ceintures", name: "Ceintures", count: 78 },
      { id: "chaussettes", name: "Chaussettes", count: 123 },
      { id: "tech-accessories", name: "Accessoires Tech", count: 56, isNew: true },
    ],
    featured: {
      title: "Tech Accessories",
      description: "Accessoires connectés et intelligents",
      image: "/placeholder.svg?height=200&width=300",
      badge: "TECH",
    },
  },
  {
    id: "chaussures",
    name: "Chaussures",
    icon: ShoppingBag,
    description: "Footwear urbain",
    color: "from-gray-600 to-gray-800",
    subcategories: [
      { id: "sneakers", name: "Sneakers", count: 298, isPopular: true },
      { id: "bottes", name: "Bottes & Boots", count: 134, isTrending: true },
      { id: "sandales", name: "Sandales & Slides", count: 89 },
      { id: "habillees", name: "Chaussures habillées", count: 67 },
      { id: "running", name: "Running & Training", count: 156, isTrending: true },
      { id: "led-shoes", name: "Chaussures LED", count: 45, isNew: true },
    ],
    featured: {
      title: "Glow Runners",
      description: "Sneakers avec technologie LED intégrée",
      image: "/placeholder.svg?height=200&width=300",
      badge: "INNOVATION",
    },
  },
]

const specialCollections: Category[] = [
  {
    id: "streetwear-limited",
    name: "Streetwear Édition Limitée",
    icon: Flame,
    description: "Pièces exclusives en quantité limitée",
    color: "from-red-500 to-pink-500",
    subcategories: [
      { id: "artist-collab", name: "Collaborations Artistes", count: 23, isNew: true },
      { id: "designer-collab", name: "Collaborations Designers", count: 34, isTrending: true },
      { id: "limited-drops", name: "Drops Limités", count: 45, isPopular: true },
    ],
    featured: {
      title: "Artist Series Vol.3",
      description: "Collaboration exclusive avec des artistes urbains",
      image: "/placeholder.svg?height=200&width=300",
      badge: "LIMITÉ",
    },
  },
  {
    id: "eco-responsable",
    name: "Capsule Éco-responsable",
    icon: RefreshCw,
    description: "Mode durable et éthique",
    color: "from-green-600 to-emerald-600",
    subcategories: [
      { id: "bio-cotton", name: "Coton Bio", count: 89, isNew: true },
      { id: "recycled", name: "Matières Recyclées", count: 67, isTrending: true },
      { id: "vegan", name: "Vegan Friendly", count: 45 },
    ],
    featured: {
      title: "Earth Collection",
      description: "Mode respectueuse de l'environnement",
      image: "/placeholder.svg?height=200&width=300",
      badge: "ÉCO",
    },
  },
  {
    id: "urban-tech",
    name: "Urban x Tech",
    icon: Zap,
    description: "Textiles intelligents et connectés",
    color: "from-cyan-500 to-blue-600",
    subcategories: [
      { id: "smart-fabric", name: "Tissus Intelligents", count: 34, isNew: true },
      { id: "led-integration", name: "Intégration LED", count: 56, isTrending: true },
      { id: "temperature-control", name: "Contrôle Température", count: 23 },
    ],
    featured: {
      title: "Future Wear",
      description: "Vêtements du futur disponibles aujourd'hui",
      image: "/placeholder.svg?height=200&width=300",
      badge: "FUTUR",
    },
  },
  {
    id: "festivals-ete",
    name: "Festivals & Été",
    icon: Sun,
    description: "Looks parfaits pour l'été",
    color: "from-yellow-400 to-orange-500",
    subcategories: [
      { id: "festival-wear", name: "Festival Wear", count: 78, isTrending: true },
      { id: "beach-wear", name: "Beach Wear", count: 89 },
      { id: "summer-essentials", name: "Essentiels Été", count: 134, isPopular: true },
    ],
    featured: {
      title: "Summer Vibes",
      description: "Collection estivale électrisante",
      image: "/placeholder.svg?height=200&width=300",
      badge: "SAISON",
    },
  },
  {
    id: "hiver-outdoor",
    name: "Hiver / Outdoor",
    icon: Snowflake,
    description: "Équipement pour l'hiver urbain",
    color: "from-blue-600 to-indigo-700",
    subcategories: [
      { id: "winter-coats", name: "Manteaux d'Hiver", count: 67, isTrending: true },
      { id: "ski-wear", name: "Ski & Snow", count: 45 },
      { id: "outdoor-gear", name: "Équipement Outdoor", count: 89 },
    ],
    featured: {
      title: "Arctic Urban",
      description: "Style urbain pour conditions extrêmes",
      image: "/placeholder.svg?height=200&width=300",
      badge: "HIVER",
    },
  },
]

const dynamicFilters = [
  { id: "best-sellers", name: "Best-sellers", icon: Star, count: 156, color: "text-yellow-400" },
  { id: "tendances", name: "Tendances du moment", icon: TrendingUp, count: 89, color: "text-red-400" },
  { id: "nouveautes-semaine", name: "Nouveautés de la semaine", icon: Sparkles, count: 45, color: "text-green-400" },
  { id: "back-in-stock", name: "De retour en stock", icon: RefreshCw, count: 67, color: "text-blue-400" },
  { id: "recommande", name: "Recommandé pour vous", icon: Heart, count: 78, color: "text-pink-400" },
  { id: "dernieres-pieces", name: "Dernières pièces", icon: Clock, count: 34, color: "text-orange-400" },
]

interface MegaCategoriesMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MegaCategoriesMenu({ isOpen, onClose }: MegaCategoriesMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"main" | "special" | "filters">("main")

  const getCurrentCategories = () => {
    switch (activeTab) {
      case "special":
        return specialCollections
      case "main":
      default:
        return mainCategories
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mega Menu */}
          <motion.div
            className="fixed top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50 shadow-2xl max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("main")}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === "main" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Catégories Principales
                </button>
                <button
                  onClick={() => setActiveTab("special")}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === "special"
                      ? "text-white border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Collections Spéciales
                </button>
                <button
                  onClick={() => setActiveTab("filters")}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === "filters"
                      ? "text-white border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Filtres Dynamiques
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh]">
                {/* Dynamic Filters Tab */}
                {activeTab === "filters" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    {dynamicFilters.map((filter) => {
                      const Icon = filter.icon
                      return (
                        <motion.div
                          key={filter.id}
                          className="group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <Icon className={`w-6 h-6 ${filter.color}`} />
                              <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                                {filter.name}
                              </h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{filter.count} produits disponibles</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Mis à jour récemment</span>
                              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}

                {/* Categories Tabs */}
                {(activeTab === "main" || activeTab === "special") && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories List */}
                    <div className="lg:col-span-1 space-y-2">
                      {getCurrentCategories().map((category) => {
                        const Icon = category.icon
                        return (
                          <motion.button
                            key={category.id}
                            onMouseEnter={() => setActiveCategory(category.id)}
                            className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 group ${
                              activeCategory === category.id
                                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                : "text-gray-300 hover:text-white hover:bg-gray-800"
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            <Icon className="w-6 h-6" />
                            <div className="text-left flex-1">
                              <div className="font-semibold">{category.name}</div>
                              <div className="text-xs opacity-75">{category.description}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Category Content */}
                    <div className="lg:col-span-3">
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
                              const category = getCurrentCategories().find((c) => c.id === activeCategory)
                              if (!category) return null

                              return (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                  {/* Subcategories */}
                                  <div className="lg:col-span-2">
                                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                                      <category.icon className="w-8 h-8" />
                                      <span>{category.name}</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {category.subcategories.map((subcategory) => (
                                        <motion.div
                                          key={subcategory.id}
                                          className="group cursor-pointer p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
                                          whileHover={{ scale: 1.02, y: -2 }}
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                              {subcategory.name}
                                            </h5>
                                            <span className="text-sm text-gray-400">({subcategory.count})</span>
                                          </div>

                                          {/* Badges */}
                                          <div className="flex space-x-2">
                                            {subcategory.isNew && (
                                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                NOUVEAU
                                              </span>
                                            )}
                                            {subcategory.isTrending && (
                                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>TENDANCE</span>
                                              </span>
                                            )}
                                            {subcategory.isPopular && (
                                              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                                                <Star className="w-3 h-3" />
                                                <span>POPULAIRE</span>
                                              </span>
                                            )}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Featured Product */}
                                  {category.featured && (
                                    <div className="lg:col-span-1">
                                      <motion.div
                                        className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white relative overflow-hidden`}
                                        whileHover={{ scale: 1.02 }}
                                      >
                                        <div className="relative z-10">
                                          {category.featured.badge && (
                                            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-bold mb-4">
                                              {category.featured.badge}
                                            </span>
                                          )}

                                          <h5 className="text-xl font-bold mb-3">{category.featured.title}</h5>
                                          <p className="text-white/80 text-sm mb-6">{category.featured.description}</p>

                                          <motion.button
                                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            Découvrir
                                          </motion.button>
                                        </div>

                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
                                          <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full" />
                                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full" />
                                        </div>
                                      </motion.div>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Default State */}
                      {!activeCategory && (
                        <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                          <h4 className="text-3xl font-bold text-white mb-4">Explorez Nos Collections</h4>
                          <p className="text-gray-400 text-lg">
                            Survolez une catégorie pour découvrir tous nos produits
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
