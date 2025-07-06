"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TrendingUp, FlameIcon as Fire, ArrowRight, Sparkles, Crown } from "lucide-react"

interface Collection {
  id: string
  name: string
  description: string
  video: string
  products: number
  trending: boolean
  isNew?: boolean
  isLimited?: boolean
  category: string
  colors: string[]
  priceRange: string
}

const collections: Collection[] = [
  {
    id: "short",
    name: "Summer Shorts Collection",
    description: "Collection de shorts tendance pour un style urbain moderne",
    video: "/collections/short.mp4",
    products: 24,
    trending: true,
    isNew: true,
    category: "Shorts",
    colors: ["#8B5CF6", "#06B6D4", "#EC4899"],
    priceRange: "89 DT - 299 DT",
  },
  {
    id: "swatch",
    name: "Luxury Watch Collection",
    description: "Montres et accessoires de luxe pour un look sophistiqué",
    video: "/collections/swatch.mp4",
    products: 18,
    trending: true,
    isLimited: true,
    category: "Accessoires",
    colors: ["#000000", "#8B5CF6", "#F59E0B"],
    priceRange: "129 DT - 459 DT",
  },
  {
    id: "chaussure",
    name: "Urban Sneakers Collection",
    description: "Sneakers et chaussures urbaines pour tous les styles",
    video: "/collections/chaussure.mp4",
    products: 15,
    trending: true,
    category: "Chaussures",
    colors: ["#FFFFFF", "#EC4899", "#10B981"],
    priceRange: "199 DT - 599 DT",
  },
  {
    id: "casquette",
    name: "Streetwear Caps Collection",
    description: "Casquettes et headwear pour compléter votre look streetwear",
    video: "/collections/casquette.mp4",
    products: 32,
    trending: false,
    isNew: true,
    category: "Headwear",
    colors: ["#000000", "#FFFFFF", "#6B7280"],
    priceRange: "49 DT - 149 DT",
  },
  {
    id: "tshirt",
    name: "Comfort Hoodies Collection",
    description: "Pulls et sweatshirts confortables pour un style urbain",
    video: "/collections/tshirt.mp4",
    products: 21,
    trending: true,
    isLimited: true,
    category: "Pulls",
    colors: ["#8B5CF6", "#06B6D4", "#000000"],
    priceRange: "159 DT - 399 DT",
  },
  {
    id: "pulls",
    name: "Graphic Tees Collection",
    description: "T-shirts graphiques et basiques pour un style décontracté",
    video: "/collections/pulls.mp4",
    products: 27,
    trending: false,
    category: "T-Shirts",
    colors: ["#92400E", "#F59E0B", "#FFFFFF"],
    priceRange: "249 DT - 799 DT",
  },
]

export function TrendingCollections() {
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={containerRef}
      className="py-32 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-hidden"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          style={{ y }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center justify-center space-x-3 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Fire className="w-8 h-8 text-orange-500" />
            <span className="text-orange-500 font-bold text-lg">TRENDING NOW</span>
            <Fire className="w-8 h-8 text-orange-500" />
          </motion.div>

          <motion.h2
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            COLLECTIONS
          </motion.h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez nos collections les plus populaires et innovantes qui définissent les tendances mondiales
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCollection(collection.id)}
              onMouseLeave={() => setHoveredCollection(null)}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 group-hover:border-purple-500/50 transition-all duration-500">
                {/* Collection Video */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <video
                    src={collection.video}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {collection.trending && (
                      <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>TRENDING</span>
                      </motion.div>
                    )}
                    {collection.isNew && (
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        NEW
                      </motion.div>
                    )}
                    {collection.isLimited && (
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Crown className="w-3 h-3" />
                        <span>LIMITED</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCollection === collection.id ? 1 : 0 }}
                  />

                  {/* Collection Stats */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                      {collection.products} items
                    </div>
                  </div>
                </div>

                {/* Collection Info */}
                <div className="p-6 space-y-4">
                  {/* Category & Price */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400 font-semibold">{collection.category}</span>
                    <span className="text-gray-400">{collection.priceRange}</span>
                  </div>

                  {/* Collection Name */}
                  <motion.div
                    className="relative overflow-hidden"
                    animate={hoveredCollection === collection.id ? { scale: 1.02 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3
                      className={`text-2xl md:text-3xl font-black bg-clip-text text-transparent relative z-10 ${
                        collection.id === "short" 
                          ? "bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 group-hover:from-orange-300 group-hover:via-yellow-300 group-hover:to-orange-400"
                          : collection.id === "swatch"
                          ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 group-hover:from-yellow-300 group-hover:via-amber-400 group-hover:to-yellow-500"
                          : collection.id === "chaussure"
                          ? "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 group-hover:from-blue-300 group-hover:via-cyan-400 group-hover:to-blue-500"
                          : collection.id === "casquette"
                          ? "bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 group-hover:from-green-300 group-hover:via-emerald-400 group-hover:to-green-500"
                          : collection.id === "tshirt"
                          ? "bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 group-hover:from-purple-300 group-hover:via-pink-400 group-hover:to-purple-500"
                          : "bg-gradient-to-r from-red-400 via-pink-500 to-red-600 group-hover:from-red-300 group-hover:via-pink-400 group-hover:to-red-500"
                      }`}
                      animate={hoveredCollection === collection.id ? { 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        textShadow: collection.id === "short" 
                          ? "0 0 20px rgba(251, 146, 60, 0.5)"
                          : collection.id === "swatch"
                          ? "0 0 20px rgba(251, 191, 36, 0.5)"
                          : collection.id === "chaussure"
                          ? "0 0 20px rgba(96, 165, 250, 0.5)"
                          : collection.id === "casquette"
                          ? "0 0 20px rgba(74, 222, 128, 0.5)"
                          : collection.id === "tshirt"
                          ? "0 0 20px rgba(139, 92, 246, 0.5)"
                          : "0 0 20px rgba(239, 68, 68, 0.5)"
                      } : { 
                        backgroundPosition: "0% 50%",
                        textShadow: "none"
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                        filter: hoveredCollection === collection.id ? 
                          (collection.id === "short" 
                            ? "drop-shadow(0 0 10px rgba(251, 146, 60, 0.3))"
                            : collection.id === "swatch"
                            ? "drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))"
                            : collection.id === "chaussure"
                            ? "drop-shadow(0 0 10px rgba(96, 165, 250, 0.3))"
                            : collection.id === "casquette"
                            ? "drop-shadow(0 0 10px rgba(74, 222, 128, 0.3))"
                            : collection.id === "tshirt"
                            ? "drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))"
                            : "drop-shadow(0 0 10px rgba(239, 68, 68, 0.3))")
                          : "none"
                      }}
                      transition={{ 
                        duration: 0.5,
                        backgroundPosition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                      }}
                    >
                      {collection.name}
                    </motion.h3>
                    
                    {/* Animated underline with collection-specific colors */}
                    <motion.div
                      className={`absolute bottom-0 left-0 h-0.5 ${
                        collection.id === "short" 
                          ? "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600"
                          : collection.id === "swatch"
                          ? "bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-700"
                          : collection.id === "chaussure"
                          ? "bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-700"
                          : collection.id === "casquette"
                          ? "bg-gradient-to-r from-green-500 via-emerald-600 to-green-700"
                          : collection.id === "tshirt"
                          ? "bg-gradient-to-r from-purple-500 via-pink-600 to-purple-700"
                          : "bg-gradient-to-r from-red-500 via-pink-600 to-red-700"
                      }`}
                      initial={{ width: 0 }}
                      animate={hoveredCollection === collection.id ? { width: "100%" } : { width: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                    
                    {/* Glow effect with collection-specific colors */}
                    <motion.div
                      className={`absolute inset-0 blur-xl opacity-0 ${
                        collection.id === "short" 
                          ? "bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-600/20"
                          : collection.id === "swatch"
                          ? "bg-gradient-to-r from-yellow-500/20 via-amber-600/20 to-yellow-700/20"
                          : collection.id === "chaussure"
                          ? "bg-gradient-to-r from-blue-500/20 via-cyan-600/20 to-blue-700/20"
                          : collection.id === "casquette"
                          ? "bg-gradient-to-r from-green-500/20 via-emerald-600/20 to-green-700/20"
                          : collection.id === "tshirt"
                          ? "bg-gradient-to-r from-purple-500/20 via-pink-600/20 to-purple-700/20"
                          : "bg-gradient-to-r from-red-500/20 via-pink-600/20 to-red-700/20"
                      }`}
                      animate={hoveredCollection === collection.id ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">{collection.description}</p>

                  {/* Action Button */}
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group/btn opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Explorer la Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </div>

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #8B5CF6, #EC4899, #06B6D4)",
                    backgroundClip: "padding-box, border-box",
                    backgroundOrigin: "padding-box, border-box",
                  }}
                  animate={
                    hoveredCollection === collection.id
                      ? {
                          background: [
                            "linear-gradient(45deg, #8B5CF6, #EC4899, #06B6D4)",
                            "linear-gradient(45deg, #06B6D4, #8B5CF6, #EC4899)",
                            "linear-gradient(45deg, #EC4899, #06B6D4, #8B5CF6)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold text-white text-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Voir Toutes les Collections</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
