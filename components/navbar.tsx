"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingBag, User, Menu, X, Filter, Heart, Bell, Grid3X3, Settings, LogOut, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { CartPreview } from "./cart-preview"
import { SmartFilterSystem } from "./advanced/smart-filter-system"
import { MegaCategoriesMenu } from "./advanced/mega-categories-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AuthDialog } from "./user-account/auth-dialog"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingSearches, setTrendingSearches] = useState(["Neon Hoodies", "Cyber Sneakers", "LED Jackets", "Holographic Tees", "Future Pants"])
  const [recentSearches, setRecentSearches] = useState(["Purple Hoodie", "Black Sneakers", "Streetwear", "Urban Style"])
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    // Fermer d'abord le dropdown pour éviter les animations en cours
    setIsUserDropdownOpen(false)
    
    // Déconnecter l'utilisateur
    logout()
    
    // Utiliser window.location.href pour éviter les conflits d'animation
    // et forcer un rechargement propre de la page
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }

  const handleLogin = () => {
    router.push('/auth')
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? "bg-black/90 backdrop-blur-md border-b border-gray-800" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a href="/" className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
              <span className="text-2xl font-black text-white">UrbanSpace</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <motion.a
                href="/boutique"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Boutique
              </motion.a>
              <motion.button
                onClick={() => setIsCategoriesOpen(true)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <Grid3X3 className="w-5 h-5" />
                <span>Catégories</span>
              </motion.button>
              <motion.a
                href="/collection"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Collections
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Nouveautés
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold relative"
                whileHover={{ scale: 1.05 }}
              >
                Soldes
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  -50%
                </span>
              </motion.a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div className="relative">
                <motion.button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className="w-6 h-6" />
                </motion.button>
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 p-6">
                    {/* Champ de recherche */}
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery || ""}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full mb-4 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-purple-500 outline-none"
                      autoFocus
                    />
                    {/* Trending Searches */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
                        <h3 className="text-sm font-semibold text-white">Trending</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.filter(s => s.toLowerCase().includes((searchQuery || "").toLowerCase())).map(search => (
                          <button key={search} className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30 transition-all duration-300">{search}</button>
                        ))}
                      </div>
                    </div>
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
                        <h3 className="text-sm font-semibold text-white">Recent</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.filter(s => s.toLowerCase().includes((searchQuery || "").toLowerCase())).map(search => (
                          <button key={search} className="flex items-center px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300">
                            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>{search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Filter */}
              <motion.button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Filter className="w-6 h-6" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Notifications */}
              <motion.button
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
                  2
                </span>
              </motion.button>

              {/* Cart */}
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  4
                </span>
              </motion.button>

              {/* User */}
              <div className="relative">
                {user ? (
                  // Utilisateur connecté - Dropdown
                  <motion.div className="relative">
                    <motion.button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">{user.name || 'Utilisateur'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-800">
                            <div className="text-white font-semibold">{user.name || 'Utilisateur'}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                          
                          <div className="p-2">
                            <motion.a
                              href="/account"
                              className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                              whileHover={{ x: 5 }}
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              <span>Paramètres</span>
                            </motion.a>
                            
                            <motion.button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200 w-full text-left"
                              whileHover={{ x: 5 }}
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Se déconnecter</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  // Utilisateur non connecté - Bouton Compte
                  <motion.button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">Compte</span>
                  </motion.button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                <motion.a
                  href="/boutique"
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-semibold py-2"
                  whileHover={{ x: 10 }}
                >
                  Boutique
                </motion.a>
                <motion.button
                  onClick={() => {
                    setIsCategoriesOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 font-semibold py-2 w-full text-left"
                  whileHover={{ x: 10 }}
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span>Catégories</span>
                </motion.button>
                <motion.a
                  href="/collection"
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-semibold py-2"
                  whileHover={{ x: 10 }}
                >
                  Collections
                </motion.a>
                <motion.a
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-semibold py-2"
                  whileHover={{ x: 10 }}
                >
                  Nouveautés
                </motion.a>
                <motion.a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 font-semibold py-2"
                  whileHover={{ x: 10 }}
                >
                  <span>Soldes</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-50%</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Preview */}
      <CartPreview isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Smart Filter System */}
      <SmartFilterSystem
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => console.log("Filters:", filters)}
      />

      {/* Mega Categories Menu */}
      <MegaCategoriesMenu isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} />

      {/* Auth Dialog désactivé, redirection vers /auth */}
    </>
  )
}
