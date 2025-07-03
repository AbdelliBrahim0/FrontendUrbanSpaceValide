"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TrendingUp, FlameIcon as Fire, ArrowRight, Sparkles, Crown } from "lucide-react"

interface Collection {
  id: string
  name: string
  description: string
  image: string
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
    id: "neon-nights",
    name: "Neon Nights",
    description: "Glow in the dark streetwear collection with LED technology",
    image: "/placeholder.svg?height=600&width=800",
    products: 24,
    trending: true,
    isNew: true,
    category: "Tech Wear",
    colors: ["#8B5CF6", "#06B6D4", "#EC4899"],
    priceRange: "$89 - $299",
  },
  {
    id: "cyber-punk",
    name: "Cyber Punk",
    description: "Futuristic designs inspired by cyberpunk aesthetics",
    image: "/placeholder.svg?height=600&width=800",
    products: 18,
    trending: true,
    isLimited: true,
    category: "Streetwear",
    colors: ["#000000", "#8B5CF6", "#F59E0B"],
    priceRange: "$129 - $459",
  },
  {
    id: "holographic-dreams",
    name: "Holographic Dreams",
    description: "Iridescent pieces that shift colors in different lights",
    image: "/placeholder.svg?height=600&width=800",
    products: 15,
    trending: true,
    category: "Luxury",
    colors: ["#FFFFFF", "#EC4899", "#10B981"],
    priceRange: "$199 - $599",
  },
  {
    id: "quantum-basics",
    name: "Quantum Basics",
    description: "Essential pieces with a futuristic twist",
    image: "/placeholder.svg?height=600&width=800",
    products: 32,
    trending: false,
    isNew: true,
    category: "Basics",
    colors: ["#000000", "#FFFFFF", "#6B7280"],
    priceRange: "$49 - $149",
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description: "AI-inspired patterns and smart fabric technology",
    image: "/placeholder.svg?height=600&width=800",
    products: 21,
    trending: true,
    isLimited: true,
    category: "Tech Wear",
    colors: ["#8B5CF6", "#06B6D4", "#000000"],
    priceRange: "$159 - $399",
  },
  {
    id: "digital-renaissance",
    name: "Digital Renaissance",
    description: "Classic silhouettes meet digital age innovation",
    image: "/placeholder.svg?height=600&width=800",
    products: 27,
    trending: false,
    category: "Luxury",
    colors: ["#92400E", "#F59E0B", "#FFFFFF"],
    priceRange: "$249 - $799",
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
            Discover our most popular and innovative collections that are setting trends worldwide
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
                {/* Collection Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    animate={hoveredCollection === collection.id ? { scale: 1.1 } : { scale: 1 }}
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
                  <motion.h3
                    className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300"
                    animate={hoveredCollection === collection.id ? { scale: 1.05 } : { scale: 1 }}
                  >
                    {collection.name}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">{collection.description}</p>

                  {/* Color Palette */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">Colors:</span>
                    <div className="flex space-x-2">
                      {collection.colors.map((color, colorIndex) => (
                        <motion.div
                          key={colorIndex}
                          className="w-6 h-6 rounded-full border-2 border-gray-600"
                          style={{ backgroundColor: color }}
                          whileHover={{ scale: 1.2 }}
                          animate={hoveredCollection === collection.id ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ delay: colorIndex * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-semibold text-white relative overflow-hidden group/btn opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Explore Collection</span>
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
              <span>View All Collections</span>
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
