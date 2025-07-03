"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Sparkles, TrendingUp, User, Zap } from "lucide-react"

interface RecommendationData {
  id: string
  type: "trending" | "personalized" | "similar" | "ai-curated"
  title: string
  products: Array<{
    id: number
    name: string
    price: number
    image: string
    confidence: number
    reason: string
  }>
  confidence: number
  reasoning: string
}

const mockRecommendations: RecommendationData[] = [
  {
    id: "ai-curated",
    type: "ai-curated",
    title: "AI Curated For You",
    confidence: 94,
    reasoning: "Based on your style preferences and recent browsing behavior",
    products: [
      {
        id: 1,
        name: "Quantum Mesh Hoodie",
        price: 299,
        image: "/placeholder.svg?height=300&width=300",
        confidence: 96,
        reason: "Matches your preference for tech-wear aesthetics",
      },
      {
        id: 2,
        name: "Neural Link Sneakers",
        price: 459,
        image: "/placeholder.svg?height=300&width=300",
        confidence: 91,
        reason: "Complements your recent hoodie purchases",
      },
    ],
  },
  {
    id: "trending",
    type: "trending",
    title: "Trending Now",
    confidence: 87,
    reasoning: "Popular among users with similar style profiles",
    products: [
      {
        id: 3,
        name: "Holographic Jacket",
        price: 399,
        image: "/placeholder.svg?height=300&width=300",
        confidence: 89,
        reason: "Viral on social media this week",
      },
    ],
  },
]

export function AIRecommendationEngine() {
  const [activeRecommendation, setActiveRecommendation] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    // Simulate AI analysis
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          setIsAnalyzing(false)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "ai-curated":
        return Brain
      case "trending":
        return TrendingUp
      case "personalized":
        return User
      default:
        return Sparkles
    }
  }

  const getGradient = (type: string) => {
    switch (type) {
      case "ai-curated":
        return "from-purple-600 to-pink-600"
      case "trending":
        return "from-green-600 to-teal-600"
      case "personalized":
        return "from-blue-600 to-cyan-600"
      default:
        return "from-orange-600 to-red-600"
    }
  }

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <motion.div
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI STYLIST
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our neural network analyzes millions of style combinations to curate the perfect pieces for you
          </p>
        </motion.div>

        {/* AI Analysis Loading */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              className="mb-12 p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <motion.div
                  className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="text-white font-semibold">AI is analyzing your style preferences...</span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mt-2 text-sm text-gray-400">
                Processing: Style patterns, color preferences, fit history...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        {!isAnalyzing && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Recommendation Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {mockRecommendations.map((rec, index) => {
                const Icon = getIcon(rec.type)
                const gradient = getGradient(rec.type)

                return (
                  <motion.button
                    key={rec.id}
                    onClick={() => setActiveRecommendation(index)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                      activeRecommendation === index
                        ? `bg-gradient-to-r ${gradient} border-transparent text-white`
                        : "border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{rec.title}</span>
                    <div className="bg-white/20 px-2 py-1 rounded-full text-xs">{rec.confidence}%</div>
                  </motion.button>
                )
              })}
            </div>

            {/* Active Recommendation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRecommendation}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {mockRecommendations[activeRecommendation] && (
                  <RecommendationSection recommendation={mockRecommendations[activeRecommendation]} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function RecommendationSection({ recommendation }: { recommendation: RecommendationData }) {
  const gradient = getGradient(recommendation.type)

  return (
    <div className={`p-8 bg-gradient-to-br ${gradient}/10 rounded-2xl border border-gray-800`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{recommendation.title}</h3>
          <p className="text-gray-400">{recommendation.reasoning}</p>
        </div>

        <div className="text-right">
          <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {recommendation.confidence}%
          </div>
          <div className="text-sm text-gray-400">Confidence</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendation.products.map((product, index) => (
          <motion.div
            key={product.id}
            className="group relative bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* AI Confidence Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-white font-medium">{product.confidence}%</span>
                </div>
              </div>

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium mb-2">AI Reasoning:</p>
                  <p className="text-gray-300 text-xs">{product.reason}</p>
                </div>
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="text-white font-semibold mb-2">{product.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">${product.price}</span>
                <motion.button
                  className={`px-4 py-2 bg-gradient-to-r ${gradient} rounded-lg text-white text-sm font-medium`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getGradient(type: string) {
  switch (type) {
    case "ai-curated":
      return "from-purple-600 to-pink-600"
    case "trending":
      return "from-green-600 to-teal-600"
    case "personalized":
      return "from-blue-600 to-cyan-600"
    default:
      return "from-orange-600 to-red-600"
  }
}
