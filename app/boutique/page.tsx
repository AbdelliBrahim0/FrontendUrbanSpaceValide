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
import { LogoScrollingBanner } from "@/components/logo-scrolling-banner"
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
  const brandLogos = [
    { src: "/marquesLogo/rolex-logo-png_seeklogo-509964-removebg-preview.png", alt: "Rolex" },
    { src: "/marquesLogo/prada.png", alt: "Prada" },
    { src: "/marquesLogo/dior-removebg-preview.png", alt: "Dior" },
    { src: "/marquesLogo/chanel-removebg-preview.png", alt: "Chanel" },
    { src: "/marquesLogo/calvin-removebg-preview.png", alt: "Calvin Klein" },
    { src: "/marquesLogo/adidas-removebg-preview.png", alt: "Adidas" },
    { src: "/marquesLogo/nike-removebg-preview.png", alt: "Nike" },
    { src: "/marquesLogo/gucci-removebg-preview.png", alt: "Gucci" },
    { src: "/marquesLogo/luis-removebg-preview.png", alt: "Louis Vuitton" },
    { src: "/marquesLogo/hermes-removebg-preview.png", alt: "Hermès" },
  ]

  return (
    <main className="min-h-screen bg-black">
      <AnimatedHeroCarousel />
      <PromotionalBanner />
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

          {/* Animation BlackFriday */}
          <motion.div
            className="flex flex-col items-center justify-center my-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.span
              className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-600 to-black bg-clip-text text-transparent drop-shadow-lg mb-10"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            >
              BlackFriday
            </motion.span>
            <div className="flex flex-wrap gap-8 justify-center items-center mb-8">
              {["BF1.jpg", "BF2.jpg", "BF3.jpg", "BF4.png"].map((img, idx) => (
                <motion.div
                  key={img}
                  className="relative group overflow-hidden rounded-3xl shadow-2xl border-4 border-yellow-400 bg-black"
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ duration: 0.7, delay: idx * 0.2, type: 'spring', bounce: 0.4 }}
                >
                  <img
                    src={`/blackfriday/${img}`}
                    alt={`Produit Black Friday ${idx + 1}`}
                    className="w-64 h-80 object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <motion.div
                    className="absolute top-4 left-4 bg-gradient-to-r from-red-600 via-yellow-400 to-black text-white font-black px-4 py-2 rounded-full text-lg shadow-xl animate-pulse"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + idx * 0.2 }}
                  >
                    -70% Black Friday
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 right-4 bg-black/80 text-yellow-400 font-bold px-3 py-1 rounded-xl text-base shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + idx * 0.2 }}
                  >
                    Offre Limitée !
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.button
              className="mt-4 px-10 py-4 bg-gradient-to-r from-yellow-400 via-red-600 to-black text-white font-black text-2xl rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = '/blackfriday'}
            >
              Consulter toutes les offres Black Friday
            </motion.button>
          </motion.div>
          
        </div>
      </section>

      {/* Vidéo avec background rgb(82, 77, 76) sur toute la largeur */}
      <motion.div 
        className="w-full px-0 flex justify-between items-center h-[80vh] -mr-16"
        style={{ backgroundColor: 'rgb(82, 77, 76)' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Animation texte Nike Air Jordan - Design Ultra-Professionnel */}
        <motion.div 
          className="flex-1 max-w-2xl px-6 md:px-12 lg:px-20 text-white z-10 relative mx-auto text-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* Badge Premium Ultra-Professionnel */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-6 py-3 rounded-full text-sm font-black tracking-widest shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <motion.div
                className="w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>ÉDITION LIMITÉE 2024</span>
              <motion.div
                className="w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* Titre Principal Ultra-Moderne */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.3 }}
            >
              <motion.h1
                className="text-7xl md:text-9xl font-black leading-none"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                  AIR
                </span>
              </motion.h1>
              <motion.h1
                className="text-7xl md:text-9xl font-black leading-none"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.8 }}
              >
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent drop-shadow-2xl">
                  JORDAN
                </span>
              </motion.h1>
            </motion.div>

            {/* Caractéristiques Ultra-Professionnelles */}
            <div className="flex flex-col items-center space-y-4 w-full">
              <motion.div
                className="flex items-center justify-center space-x-4 text-gray-200 w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.7 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-lg font-medium">Technologie Air révolutionnaire</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-gray-200 w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.9 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-lg font-medium">Design intemporel et reconnaissable</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-gray-200 w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 4.1 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-lg font-medium">Confort et performance exceptionnels</span>
              </motion.div>
            </div>

            {/* CTA Button Ultra-Professionnel */}
            <motion.button
              className="mt-10 px-12 py-5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-xl rounded-full relative overflow-hidden group shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 tracking-wider">DÉCOUVRIR LA COLLECTION</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.button>

            {/* Prix Ultra-Professionnel */}
            <motion.div
              className="flex items-baseline space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 4.6 }}
            >
              <span className="text-4xl font-black text-white">599 DT</span>
              <span className="text-xl text-gray-400 line-through">799 DT</span>
              <motion.span 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-lg font-black shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                -25%
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="h-full w-auto max-h-full rounded-lg object-contain"
        >
          <source src="/nike/alone.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </motion.div>

      {/* SECTION PROMO T-SHIRT SUN */}
      <motion.div 
        className="w-full px-0 flex justify-between items-center h-[80vh] -mr-16"
        style={{ backgroundColor: 'rgb(255, 0, 54)' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Animation texte T-Shirt SUN */}
        <motion.div 
          className="flex-1 max-w-2xl px-6 md:px-12 lg:px-20 text-white z-10 relative mx-auto text-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* Badge Nouveauté */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 text-black px-6 py-3 rounded-full text-sm font-black tracking-widest shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <motion.div
                className="w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>NOUVEAUTÉ 2024</span>
              <motion.div
                className="w-2 h-2 bg-black rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* Titre SUN */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.3 }}
            >
              <motion.h1
                className="text-7xl md:text-9xl font-black leading-none"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                  SUN
                </span>
              </motion.h1>
            </motion.div>

            {/* Slogan */}
            <motion.p
              className="text-2xl md:text-3xl text-white font-light max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
            >
              Exprime ta lumière. T-Shirt SUN, la nouvelle vague urbaine.
            </motion.p>

            {/* Caractéristiques */}
            <div className="flex flex-col items-center space-y-4 w-full">
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.7 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-lg font-medium">Coton premium ultra-doux</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.9 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-lg font-medium">Coupe moderne et confortable</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 4.1 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-lg font-medium">Impression résistante au soleil</span>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.button
              className="mt-10 px-12 py-5 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 text-black font-black text-xl rounded-full relative overflow-hidden group shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 tracking-wider">DÉCOUVRIR LE T-SHIRT</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-transparent"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.button>

            {/* Prix */}
            <motion.div
              className="flex items-baseline space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 4.6 }}
            >
              <span className="text-4xl font-black text-white">89 DT</span>
              <span className="text-xl text-white/70 line-through">119 DT</span>
              <motion.span 
                className="bg-gradient-to-r from-yellow-300 to-orange-400 text-black px-4 py-2 rounded-full text-lg font-black shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                -25%
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="h-full w-auto max-h-full rounded-lg object-contain"
        >
          <source src="/nike/alone2.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </motion.div>

      {/* SECTION PROMO HOODIE */}
      <motion.div 
        className="w-full px-0 flex justify-between items-center h-[80vh] -mr-16"
        style={{ backgroundColor: 'black' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Animation texte HOODIE */}
        <motion.div 
          className="flex-1 max-w-2xl px-6 md:px-12 lg:px-20 text-white z-10 relative mx-auto text-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* Badge Collection Hiver */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white px-6 py-3 rounded-full text-sm font-black tracking-widest shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>COLLECTION HIVER</span>
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* Titre HOODIE */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.3 }}
            >
              <motion.h1
                className="text-7xl md:text-9xl font-black leading-none"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <span className="bg-gradient-to-r from-white via-gray-400 to-gray-800 bg-clip-text text-transparent drop-shadow-2xl">
                  HOODIE
                </span>
              </motion.h1>
            </motion.div>

            {/* Slogan */}
            <motion.p
              className="text-2xl md:text-3xl text-white font-light max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
            >
              Chaleur, style et confort. Le hoodie ultime pour l’hiver urbain.
            </motion.p>

            {/* Caractéristiques */}
            <div className="flex flex-col items-center space-y-4 w-full">
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.7 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-800 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-lg font-medium">Molleton épais premium</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.9 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-800 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-lg font-medium">Capuche ajustable et poche kangourou</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center space-x-4 text-white w-full"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 4.1 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-800 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-lg font-medium">Style oversize tendance</span>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.button
              className="mt-10 px-12 py-5 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-black text-xl rounded-full relative overflow-hidden group shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 tracking-wider">DÉCOUVRIR LES HOODIES</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-transparent"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.button>

            {/* Prix */}
            <motion.div
              className="flex items-baseline space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 4.6 }}
            >
              <span className="text-4xl font-black text-white">149 DT</span>
              <span className="text-xl text-white/70 line-through">199 DT</span>
              <motion.span 
                className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-full text-lg font-black shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                -25%
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="h-full w-auto max-h-full rounded-lg object-contain"
        >
          <source src="/nike/alone3.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </motion.div>

      {/* Logo Scrolling Banner déplacé en bas */}
      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.h3 
          className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Nos Marques Partenaires
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <LogoScrollingBanner logos={brandLogos} />
        </motion.div>
      </motion.div>

      <Footer />
    </main>
  )
} 