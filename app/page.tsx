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

const products = [
  {
    id: 1,
    name: "Neon Pulse Hoodie",
    price: 89,
    originalPrice: 120,
    discount: 25,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "Hoodies",
    rating: 4.8,
    reviews: 124,
    description: "Premium neon hoodie with LED technology and ultra-soft fabric",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Purple", "Cyan"],
    inStock: true,
  },
  {
    id: 2,
    name: "Urban Glow Sneakers",
    price: 159,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Shoes",
    rating: 4.6,
    reviews: 89,
    description: "Futuristic sneakers with glow-in-the-dark soles",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Blue"],
    inStock: true,
  },
  {
    id: 3,
    name: "Street Beam Jacket",
    price: 199,
    originalPrice: 249,
    discount: 20,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "Jackets",
    rating: 4.9,
    reviews: 156,
    description: "Weather-resistant jacket with integrated LED strips",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
    inStock: true,
  },
  {
    id: 4,
    name: "Cyber Cargo Pants",
    price: 129,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Pants",
    rating: 4.4,
    reviews: 67,
    description: "Multi-pocket cargo pants with tech-inspired design",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Olive", "Gray"],
    inStock: false,
  },
  {
    id: 5,
    name: "Holographic Tee",
    price: 59,
    image: "/placeholder.svg?height=400&width=300",
    isNew: true,
    category: "T-Shirts",
    rating: 4.7,
    reviews: 203,
    description: "Color-shifting holographic print on premium cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Silver"],
    inStock: true,
  },
  {
    id: 6,
    name: "Future Boots",
    price: 189,
    originalPrice: 220,
    discount: 15,
    image: "/placeholder.svg?height=400&width=300",
    isNew: false,
    category: "Shoes",
    rating: 4.5,
    reviews: 78,
    description: "High-tech boots with smart temperature control",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Red"],
    inStock: true,
  },
]

export default function HomePage() {
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
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCards key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
