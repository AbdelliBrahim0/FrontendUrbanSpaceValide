"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react"

interface Product3DViewerProps {
  images: string[]
  productName: string
  onFullscreen?: () => void
}

export function Product3DViewer({ images, productName, onFullscreen }: Product3DViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const transform = useTransform(
    [springRotateX, springRotateY],
    ([x, y]) => `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${zoom})`,
  )

  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isRotating, images.length])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateXValue = (e.clientY - centerY) / 10
    const rotateYValue = (e.clientX - centerX) / 10

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const start360View = () => {
    setIsRotating(true)
    setTimeout(() => setIsRotating(false), images.length * 150)
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
      {/* 3D Container */}
      <motion.div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
        whileTap={{ cursor: "grabbing" }}
      >
        {/* Product Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotateY: isRotating ? 360 : 0 }}
          transition={{ duration: isRotating ? images.length * 0.15 : 0 }}
        >
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={productName}
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
            }}
          />
        </motion.div>

        {/* Reflection */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
          style={{
            background: `linear-gradient(to top, 
              rgba(139, 92, 246, 0.1) 0%, 
              transparent 100%)`,
            transform: "scaleY(-1)",
          }}
        >
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${productName} reflection`}
            className="w-full h-full object-contain"
            style={{ filter: "blur(1px)" }}
          />
        </motion.div>
      </motion.div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <motion.button
          onClick={start360View}
          disabled={isRotating}
          className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className={`w-5 h-5 text-white ${isRotating ? "animate-spin" : ""}`} />
        </motion.button>

        <motion.button
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </motion.button>

        <motion.button
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </motion.button>

        <motion.button
          onClick={onFullscreen}
          className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-125"
                : "bg-white/30 hover:bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Loading Overlay */}
      {isRotating && (
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-white font-semibold">360° View</div>
        </motion.div>
      )}
    </div>
  )
}
