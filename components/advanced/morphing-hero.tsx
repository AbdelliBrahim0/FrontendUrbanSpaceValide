"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ParticleSystem } from "./particle-system"

const heroContent = [
  {
    id: 1,
    title: "FUTURE",
    subtitle: "STREETWEAR",
    description: "Experience tomorrow's fashion today",
    gradient: "from-purple-600 via-pink-600 to-red-600",
    accent: "from-cyan-400 to-blue-600",
  },
  {
    id: 2,
    title: "NEON",
    subtitle: "REVOLUTION",
    description: "Illuminate your style with cutting-edge design",
    gradient: "from-green-600 via-teal-600 to-cyan-600",
    accent: "from-yellow-400 to-orange-600",
  },
  {
    id: 3,
    title: "CYBER",
    subtitle: "ELEGANCE",
    description: "Where technology meets haute couture",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    accent: "from-emerald-400 to-teal-600",
  },
]

export function MorphingHero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroContent.length)
        setIsTransitioning(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const current = heroContent[currentIndex]

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Particle Background */}
      <ParticleSystem
        particleCount={100}
        colors={["#8B5CF6", "#06B6D4", "#EC4899", "#10B981", "#F59E0B"]}
        interactive={true}
      />

      {/* Morphing Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-20`}
        animate={{
          background: `linear-gradient(135deg, ${current.gradient.split(" ").join(", ")})`,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-64 h-64 bg-gradient-to-r ${current.accent} opacity-10 rounded-full blur-3xl`}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-6xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 1.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Main Title */}
              <motion.h1
                className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-4 leading-none"
                style={{
                  background: `linear-gradient(135deg, ${current.gradient.split(" ").join(", ")})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {current.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {current.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {current.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  className={`relative px-12 py-4 bg-gradient-to-r ${current.gradient} rounded-full font-bold text-xl text-white overflow-hidden group`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">EXPLORE COLLECTION</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>

                <motion.button
                  className="px-12 py-4 border-2 border-white/30 rounded-full font-bold text-xl text-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  WATCH LOOKBOOK
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {heroContent.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-16 h-1 rounded-full overflow-hidden ${
              index === currentIndex ? "bg-white/30" : "bg-white/10"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {index === currentIndex && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${current.accent} rounded-full`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center space-y-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <span className="text-white/60 text-sm font-medium rotate-90 origin-center">SCROLL</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </div>
  )
}
