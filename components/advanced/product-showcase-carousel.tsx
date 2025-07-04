"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Eye, Star, Zap } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  isLimited?: boolean
  isBestseller?: boolean
  colors: string[]
  description: string
}

const showcaseProducts: Product[] = [
  {
    id: 1,
    name: "PEGASUS WAVE – Nike Shoes",
    price: 299,
    originalPrice: 399,
    image: "/soushero/vd1.mp4",
    category: "Footwear d’exception",
    rating: 4.9,
    reviews: 247,
    isNew: true,
    colors: ["#000000", "#8B5CF6", "#06B6D4"],
    description: `Plongez dans l’innovation ultime avec la Pegasus Wave :\n- Semelle réactive à mémoire de forme\n- Design futuriste inspiré de l’aérodynamisme\n- Légèreté extrême, maintien parfait\n- Performance et style réunis pour les esprits conquérants\n- Édition limitée, réservée aux leaders de demain`,
  },
  {
    id: 2,
    name: "JORDAN BASKETS MONTANTES AIR JORDAN 1 ELEVATE HIGH",
    price: 459,
    image: "/soushero/vd2.mp4",
    category: "Sneakers Iconiques",
    rating: 4.8,
    reviews: 189,
    isLimited: true,
    colors: ["#FFFFFF", "#EC4899", "#10B981"],
    description: `Découvrez l'icône par excellence avec les Air Jordan 1 Elevate High :\n- Design montant légendaire, silhouette reconnaissable entre toutes\n- Qualité premium, finitions impeccables\n- Confort exceptionnel, maintien parfait\n- Pour les passionnés de sneakers et les connaisseurs du style urbain\n- L'héritage Jordan, porté par une nouvelle génération`,
  },
  {
    id: 3,
    name: "NIKE SONIC FLY",
    price: 399,
    originalPrice: 499,
    image: "/soushero/vd3.mp4",
    category: "Sneakers Performance",
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
    colors: ["#000000", "#8B5CF6", "#F59E0B"],
    description: `Découvrez la vitesse incarnée avec les Nike Sonic Fly :\n- Design aérodynamique pour une performance maximale\n- Technologie de pointe, légèreté exceptionnelle\n- Confort optimal, réactivité inégalée\n- Pour les athlètes et les coureurs exigeants\n- L'innovation Nike au service de votre performance`,
  },
  {
    id: 4,
    name: "ADIDAS HANDBALL SPEZIAL",
    price: 199,
    image: "/soushero/vd4.mp4",
    category: "Sneakers Iconiques Adidas",
    rating: 4.6,
    reviews: 134,
    isNew: true,
    colors: ["#000000", "#374151", "#06B6D4"],
    description: `Découvrez l'icône urbaine par excellence avec les Adidas Handball Spezial :\n- Design rétro authentique, silhouette intemporelle\n- Qualité premium, finitions impeccables\n- Confort légendaire, style urbain assumé\n- Pour les connaisseurs et les passionnés de sneakers vintage\n- L'héritage Adidas, porté par une nouvelle génération`,
  },
  {
    id: 5,
    name: "NIKE AIR MAX",
    price: 599,
    originalPrice: 799,
    image: "/soushero/vd5.mp4",
    category: "Sneakers Iconiques Nike",
    rating: 4.9,
    reviews: 89,
    isLimited: true,
    colors: ["#000000", "#8B5CF6"],
    description: `Découvrez l'icône du confort avec les Nike Air Max :\n- Technologie Air révolutionnaire, amorti exceptionnel\n- Design intemporel, silhouette reconnaissable\n- Confort légendaire, style urbain premium\n- Pour les passionnés de sneakers et les connaisseurs du confort\n- L'innovation Nike qui a révolutionné le monde des sneakers`,
  },
]

export function ProductShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<Record<number, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    // Les boutons de navigation restent, mais sans gestion d'autoplay
  }, [])

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseProducts.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length)
  }

  const currentProduct = showcaseProducts[currentIndex]

  return (
    <motion.div
      ref={containerRef}
      className="py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
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
          <motion.h2
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            SHOWCASE
          </motion.h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our most innovative and sought-after pieces
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative">
          {/* Product Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <motion.div
              className="relative"
              key={currentIndex}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                {/* Background Effects */}
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20"
                    animate={{
                      background: [
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>

                {/* Product Image */}
                <video
                  ref={videoRef}
                  src={currentProduct.image}
                  className="relative z-10 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  onEnded={nextProduct}
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 z-20 flex flex-col space-y-2">
                  {currentProduct.isNew && (
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      NEW
                    </motion.div>
                  )}
                  {currentProduct.isLimited && (
                    <motion.div
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Zap className="w-3 h-3" />
                      <span>LIMITED</span>
                    </motion.div>
                  )}
                  {currentProduct.isBestseller && (
                    <motion.div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      BESTSELLER
                    </motion.div>
                  )}
                </div>

                {/* Quick Actions */}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="space-y-8"
              key={`info-${currentIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">{currentProduct.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(currentProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">({currentProduct.reviews})</span>
                </div>
              </div>

              {/* Product Name */}
              <motion.h3
                className="text-4xl md:text-5xl font-black leading-tight bg-clip-text text-transparent uppercase tracking-widest drop-shadow-lg"
                style={{ backgroundImage: currentProduct.id === 2 ? 'linear-gradient(to right, #1e3a8a, #ffffff)' : currentProduct.id === 3 ? 'linear-gradient(to right, #c7fc04, #6b7280)' : currentProduct.id === 4 ? 'linear-gradient(to right, #6f9f84, #ffffff)' : currentProduct.id === 5 ? 'linear-gradient(to right, #f97316, #8b5cf6, #06b6d4)' : 'linear-gradient(to right, #38bdf8, #83d57a)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {currentProduct.name}
              </motion.h3>

              {/* Description */}
              <motion.p
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {currentProduct.description}
              </motion.p>

              {/* Price & Actions */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex space-x-4">
                  <motion.button
                    className={`flex-1 py-4 rounded-xl font-bold text-white text-lg relative overflow-hidden group ${
                      currentProduct.id === 2 
                        ? 'bg-gradient-to-r from-blue-800 to-white' 
                        : currentProduct.id === 3
                        ? 'bg-gradient-to-r from-[#c7fc04] to-gray-500'
                        : currentProduct.id === 4
                        ? 'bg-gradient-to-r from-[#6f9f84] to-white'
                        : currentProduct.id === 5
                        ? 'bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500'
                        : 'bg-gradient-to-r from-sky-400 to-[#83d57a]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Consulter</span>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevProduct}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={nextProduct}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Product Indicators */}
        <div className="flex justify-center space-x-4 mt-12">
          {showcaseProducts.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-2 rounded-full overflow-hidden ${
                index === currentIndex ? "bg-white/30" : "bg-white/10"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Thumbnail Preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          {showcaseProducts.map((product, index) => (
            <motion.button
              key={product.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex ? "border-purple-500 scale-105" : "border-gray-700 hover:border-gray-600"
              }`}
              whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
            >
              <video
                src={product.image}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h5 className="text-white text-sm font-semibold truncate">{product.name}</h5>
                <p className="text-purple-400 text-xs">${product.price}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
