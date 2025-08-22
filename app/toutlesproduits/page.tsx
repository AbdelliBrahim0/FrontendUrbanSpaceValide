"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  ShoppingCart,
  Eye,
  SlidersHorizontal,
  X,
  Zap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { productsApi, publicCategoriesApi as categoriesApi, publicSubcategoriesApi as subcategoriesApi, type Product, type Category, type Subcategory } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

interface FilterState {
  categories: number[]
  subcategories: number[]
  priceRange: [number, number]
  searchQuery: string
  sortBy: string
}

export default function TousLesProduitsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // États principaux
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États de l'interface
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])

  // États des filtres
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    priceRange: [0, 1000],
    searchQuery: searchParams.get("search") || "",
    sortBy: "newest",
  })

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData, subcategoriesData] = await Promise.all([
          productsApi.list(),
          categoriesApi.list(),
          subcategoriesApi.list(),
        ])

        setProducts(productsData)
        setCategories(categoriesData)
        setSubcategories(subcategoriesData)

        // Calculer la plage de prix automatiquement
        if (productsData.length > 0) {
          const prices = productsData.map((p) => Number.parseFloat(p.price))
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setFilters((prev) => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
          }))
        }
      } catch (err) {
        setError("Erreur lors du chargement des produits")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Gérer les paramètres URL pour les filtres intelligents
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const subcategoryParam = searchParams.get("subcategory")
    const searchParam = searchParams.get("search")

    if (categoryParam || subcategoryParam || searchParam) {
      setFilters((prev) => ({
        ...prev,
        categories: categoryParam ? [Number.parseInt(categoryParam)] : [],
        subcategories: subcategoryParam ? [Number.parseInt(subcategoryParam)] : [],
        searchQuery: searchParam || "",
      }))
    }
  }, [searchParams])

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filtre par recherche
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query),
      )
    }

    // Filtre par catégories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => product.categories?.some((cat) => filters.categories.includes(cat.id)))
    }

    // Filtre par sous-catégories
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.subCategories?.some((sub) => filters.subcategories.includes(sub.id)),
      )
    }

    // Filtre par prix
    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(product.price)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Tri
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
        break
      case "price-desc":
        filtered.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }, [products, filters])

  // Gestion de la wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  // Composant de carte produit
  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          {/* Image du produit */}
          <motion.img
            src={product.urlImage || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          />

          {/* Image hover */}
          {product.urlImageHover && (
            <motion.img
              src={product.urlImageHover}
              alt={`${product.name} hover`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Overlay avec actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedProduct(product)}
              className="bg-card/90 hover:bg-primary text-card-foreground hover:text-primary-foreground"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toggleWishlist(product.id)}
              className={`bg-card/90 hover:bg-secondary text-card-foreground hover:text-secondary-foreground ${
                wishlist.includes(product.id) ? "bg-secondary text-secondary-foreground" : ""
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-card/90 hover:bg-primary text-card-foreground hover:text-primary-foreground"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Badge stock faible */}
          {product.stock < 5 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              <Zap className="w-3 h-3 mr-1" />
              Stock faible
            </Badge>
          )}

          {/* Badge nouveau */}
          {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
              <Sparkles className="w-3 h-3 mr-1" />
              Nouveau
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">{Number.parseFloat(product.price).toFixed(2)} TND</span>

              {product.size && (
                <Badge variant="outline" className="text-xs">
                  {product.size}
                </Badge>
              )}
            </div>

            {/* Catégories */}
            {product.subCategories && product.subCategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.subCategories.slice(0, 2).map((sub) => (
                  <Badge key={sub.id} variant="outline" className="text-xs">
                    {sub.name}
                  </Badge>
                ))}
                {product.subCategories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.subCategories.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Erreur</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header de la page */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Tous nos Produits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Découvrez notre collection complète de streetwear premium.
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} disponible
              {filteredProducts.length > 1 ? "s" : ""}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 ${isFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <Card className="bg-sidebar border-sidebar-border sticky top-4">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-sidebar-primary" />
                    Filtres
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Recherche */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-sidebar-foreground">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                      className="pl-10 bg-input border-border text-foreground"
                    />
                  </div>
                </div>

                <Separator className="bg-sidebar-border" />

                {/* Catégories */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sidebar-foreground">Catégories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            setFilters((prev) => ({
                              ...prev,
                              categories: checked
                                ? [...prev.categories, category.id]
                                : prev.categories.filter((id) => id !== category.id),
                            }))
                          }}
                          className="border-sidebar-border data-[state=checked]:bg-sidebar-primary"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm text-sidebar-foreground cursor-pointer hover:text-sidebar-primary transition-colors"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-sidebar-border" />

                {/* Sous-catégories */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sidebar-foreground">Sous-catégories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subcategory-${subcategory.id}`}
                          checked={filters.subcategories.includes(subcategory.id)}
                          onCheckedChange={(checked) => {
                            setFilters((prev) => ({
                              ...prev,
                              subcategories: checked
                                ? [...prev.subcategories, subcategory.id]
                                : prev.subcategories.filter((id) => id !== subcategory.id),
                            }))
                          }}
                          className="border-sidebar-border data-[state=checked]:bg-sidebar-accent"
                        />
                        <label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="text-sm text-sidebar-foreground cursor-pointer hover:text-sidebar-accent transition-colors"
                        >
                          {subcategory.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-sidebar-border" />

                {/* Plage de prix */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sidebar-foreground">Prix (TND)</h4>
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                      }
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-sidebar-foreground">
                      <span>{filters.priceRange[0]} TND</span>
                      <span>{filters.priceRange[1]} TND</span>
                    </div>
                  </div>
                </div>

                {/* Bouton reset */}
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      categories: [],
                      subcategories: [],
                      priceRange: [0, 1000],
                      searchQuery: "",
                      sortBy: "newest",
                    })
                  }
                  className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'outils */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                    }
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
                </span>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger className="w-48 bg-input border-border text-foreground">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="newest" className="text-popover-foreground hover:bg-accent">
                      Plus récents
                    </SelectItem>
                    <SelectItem value="price-asc" className="text-popover-foreground hover:bg-accent">
                      Prix croissant
                    </SelectItem>
                    <SelectItem value="price-desc" className="text-popover-foreground hover:bg-accent">
                      Prix décroissant
                    </SelectItem>
                    <SelectItem value="name" className="text-popover-foreground hover:bg-accent">
                      Nom A-Z
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Grille des produits */}
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Aucun produit trouvé</h3>
                    <p className="text-muted-foreground">Essayez de modifier vos filtres ou votre recherche</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal de détail produit */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl bg-popover border-border">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-popover-foreground">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={
                      selectedProduct.urlImage ||
                      `/placeholder.svg?height=500&width=500&query=${encodeURIComponent(selectedProduct.name)}`
                    }
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  {selectedProduct.urlImageHover && (
                    <img
                      src={selectedProduct.urlImageHover || "/placeholder.svg"}
                      alt={`${selectedProduct.name} hover`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-popover-foreground mb-2">{selectedProduct.name}</h2>
                    <p className="text-3xl font-bold text-primary">
                      {Number.parseFloat(selectedProduct.price).toFixed(2)} TND
                    </p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h3 className="font-semibold text-popover-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedProduct.description}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {selectedProduct.size && (
                      <div>
                        <span className="font-semibold text-popover-foreground">Taille: </span>
                        <Badge variant="outline">{selectedProduct.size}</Badge>
                      </div>
                    )}

                    <div>
                      <span className="font-semibold text-popover-foreground">Stock: </span>
                      <span className={`${selectedProduct.stock < 5 ? "text-destructive" : "text-primary"}`}>
                        {selectedProduct.stock} disponible{selectedProduct.stock > 1 ? "s" : ""}
                      </span>
                    </div>

                    {selectedProduct.subCategories && selectedProduct.subCategories.length > 0 && (
                      <div>
                        <span className="font-semibold text-popover-foreground mb-2 block">Catégories:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.subCategories.map((sub) => (
                            <Badge key={sub.id} variant="secondary">
                              {sub.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`border-border ${
                        wishlist.includes(selectedProduct.id)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-popover-foreground hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
