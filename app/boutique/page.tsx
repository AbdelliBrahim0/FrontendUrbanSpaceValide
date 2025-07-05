"use client"

import { useState } from "react"
import { AnimatedHeroCarousel } from "@/components/animated-hero-carousel"
import { PromotionalBanner } from "@/components/promotions/promotional-banner"
import { ProductShowcaseCarousel } from "@/components/advanced/product-showcase-carousel"
import { TrendingCollections } from "@/components/advanced/trending-collections"
import { CategoryGrid } from "@/components/category-grid"
import { ProductCards } from "@/components/product-cards"
import { Footer } from "@/components/footer"
import { ScrollingBanner } from "@/components/scrolling-banner"
import { motion } from "framer-motion"

const products = [
  {
    id: 101,
    name: "UNDERCOVER jun takahashi contrast-panel short-sleeve shirt",
    price: 199,
    image: "/produits/p1.jpg",
    hoverImage: "/produits/p11.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.7,
    reviews: 87,
    description: "Découvrez notre nouveauté tendance.",
    inStock: true,
  },
  {
    id: 102,
    name: "Bones Logo Tee - Black – Feature",
    price: 249,
    image: "/produits/p2.jpg",
    hoverImage: "/produits/P22.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.6,
    reviews: 65,
    description: "Style et confort réunis dans ce modèle.",
    inStock: true,
  },
  {
    id: 103,
    name: "GUESS Noir",
    price: 179,
    image: "/produits/P3.jpg",
    hoverImage: "/produits/P33.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.5,
    reviews: 54,
    description: "Un classique revisité pour la saison.",
    inStock: true,
  },
  {
    id: 104,
    name: "Cotton Poplin Shirt - Yellow",
    price: 299,
    image: "/produits/P4.jpg",
    hoverImage: "/produits/P44.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.8,
    reviews: 102,
    description: "L'élégance à l'état pur.",
    inStock: true,
  },
  {
    id: 105,
    name: "Neighborhood BB Varsity Jacket Green",
    price: 159,
    image: "/produits/P5.jpg",
    hoverImage: "/produits/P55.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.4,
    reviews: 39,
    description: "Un must-have pour votre collection.",
    inStock: true,
  },
  {
    id: 106,
    name: "Sweatshirts Heron Preston Hoodie Black/ Yellow",
    price: 219,
    image: "/produits/P6.jpg",
    hoverImage: "/produits/P66.png",
    isNew: false,
    category: "Nouveautés",
    rating: 4.9,
    reviews: 120,
    description: "Performance et style réunis.",
    inStock: true,
  },
]

export default function BoutiquePage() {
  const [bannerVisible, setBannerVisible] = useState(true)
  return (
    <main className="min-h-screen bg-black">
      <AnimatedHeroCarousel />
      {bannerVisible && (
        <PromotionalBanner onClose={() => setBannerVisible(false)} />
      )}
      <ProductShowcaseCarousel />
      <ScrollingBanner messages={[
        "🔥 Livraison offerte dès 50€ d'achat !",
        "✨ Nouveautés chaque semaine !",
        "🎁 10% de réduction avec le code URBAN10",
        "🚀 Expédition en 24h !",
        "💎 Qualité premium garantie !"
      ]} />
      <TrendingCollections />
      <CategoryGrid />
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent text-center">Nos Produits</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCards key={product.id} product={product} />
            ))}
          </div>
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="px-12 py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-green-500 rounded-xl font-bold text-white text-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Consulter tous les produits</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
} 