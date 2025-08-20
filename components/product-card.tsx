"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "./ui/button"

interface ProductCardProps {
  id: number
  name: string
  price: string
  imageUrl: string
  hoverImageUrl?: string
  inStock: boolean
  discount?: number
  rating?: number
  reviewCount?: number
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  hoverImageUrl,
  inStock,
  discount,
  rating = 4.5,
  reviewCount = 0,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const displayPrice = parseFloat(price).toFixed(2)
  const displayRating = rating.toFixed(1)

  return (
    <Link href={`/product/${id}`} className="group block">
      <motion.div
        className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
        whileHover={{ y: -4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col space-y-2">
          {discount && (
            <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="inline-flex items-center justify-center rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-medium text-white">
              Rupture
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-gray-100 dark:bg-gray-800/80 dark:hover:bg-gray-700"
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Product Images */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={isHovered && hoverImageUrl ? hoverImageUrl : imageUrl}
            alt={name}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isHovered && hoverImageUrl ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {hoverImageUrl && (
            <Image
              src={hoverImageUrl}
              alt={name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/90 text-gray-900 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Implement quick view
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/90 text-gray-900 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Add to cart logic
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-2 dark:text-gray-100">
            {name}
          </h3>
          
          {/* Price */}
          <div className="mb-2 flex items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {displayPrice} TND
            </span>
            {discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {(parseFloat(price) * (1 + discount / 100)).toFixed(2)} TND
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({reviewCount})
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
