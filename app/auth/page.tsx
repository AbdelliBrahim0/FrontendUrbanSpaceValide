"use client"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { ParticleSystem } from "@/components/advanced/particle-system"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [tab, setTab] = useState("login")
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  })
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState("")

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupLoading(true)
    setSignupError("")
    setSignupSuccess("")
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: signupData.name,
          email: signupData.email,
          telephone: signupData.phone,
          adresse: signupData.address,
          password: signupData.password,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setSignupError(errorData.message || "Erreur lors de l'inscription.")
      } else {
        setSignupSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.")
        setSignupData({ name: "", email: "", phone: "", address: "", password: "" })
      }
    } catch (err) {
      setSignupError("Erreur réseau ou serveur.")
    } finally {
      setSignupLoading(false)
    }
  }

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  const router = useRouter();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")
    setLoginSuccess(false)
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setLoginError(errorData.message || "Erreur lors de la connexion.")
      } else {
        setLoginSuccess(true)
        setLoginData({ email: "", password: "" })
        if (typeof window !== "undefined") {
          localStorage.setItem('showWelcome', '1');
        }
        router.push("/boutique")
      }
    } catch (err) {
      setLoginError("Erreur réseau ou serveur.")
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#181824] to-[#101014]">
      <ParticleSystem className="absolute inset-0 z-0" />
      <div>
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center z-10 relative animate-fade-in">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="UrbanSpace Logo" className="w-24 h-24 mb-2 drop-shadow-xl animate-bounce" />
            <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg flex items-center gap-2">
              UrbanSpace <Sparkles className="text-purple-400 animate-pulse" />
            </span>
            <span className="text-base text-gray-200 mt-1 text-center">Rejoins la communauté UrbanSpace et découvre la mode du futur !</span>
          </motion.div>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full flex justify-center mb-8 bg-white/10 border border-white/20 rounded-full shadow-inner backdrop-blur-xl">
              <TabsTrigger value="login" className="flex-1 text-lg font-bold py-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 text-lg font-bold py-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                Inscription
              </TabsTrigger>
            </TabsList>
            <div className="relative min-h-[340px] w-full">
              <AnimatePresence mode="wait">
                {tab === "login" && (
                  <motion.div key="login" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }} className="w-full">
                    {loginSuccess ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center gap-6 py-12">
                        <div className="text-2xl font-bold text-green-400 text-center animate-pulse">Vous êtes connecté !</div>
                      </motion.div>
                    ) : (
                      <>
                        <form className="flex flex-col gap-5 w-full" onSubmit={handleLoginSubmit}>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              autoComplete="username"
                              required
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="password"
                              name="password"
                              placeholder="Mot de passe"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              autoComplete="current-password"
                              required
                            />
                          </div>
                          <motion.button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 active:scale-95"
                            disabled={loginLoading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {loginLoading ? "Connexion..." : "Se connecter"}
                          </motion.button>
                          <AnimatePresence>
                            {loginError && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-red-400 text-sm text-center">
                                {loginError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="text-right text-sm text-gray-300 hover:underline cursor-pointer transition-all">Mot de passe oublié ?</div>
                        </form>
                        <div className="my-6 flex items-center justify-center gap-2">
                          <span className="h-px w-16 bg-gray-700" />
                          <span className="text-gray-500 text-sm">ou continuer avec</span>
                          <span className="h-px w-16 bg-gray-700" />
                        </div>
                        <div className="flex gap-4 justify-center pb-2">
                          <motion.button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black font-semibold shadow hover:bg-gray-100 transition-all text-base"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FcGoogle className="w-6 h-6" /> Google
                          </motion.button>
                          <motion.button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-base"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaFacebook className="w-6 h-6" /> Facebook
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
                {tab === "signup" && (
                  <motion.div key="signup" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.5 }} className="w-full max-h-[420px] overflow-y-auto pr-2">
                    {signupSuccess ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center gap-6 py-12">
                        <div className="text-2xl font-bold text-green-400 text-center animate-pulse">Vous êtes inscrit dans UrbanSpace !</div>
                        <motion.button
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 active:scale-95"
                          onClick={() => window.location.href = "/boutique"}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Consulter la boutique
                        </motion.button>
                      </motion.div>
                    ) : (
                      <>
                        <form className="flex flex-col gap-5 w-full" onSubmit={handleSignupSubmit}>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              placeholder="Nom complet"
                              value={signupData.name}
                              onChange={handleSignupChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              required
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={signupData.email}
                              onChange={handleSignupChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              required
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Téléphone"
                              value={signupData.phone}
                              onChange={handleSignupChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              required
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              name="address"
                              placeholder="Adresse à domicile"
                              value={signupData.address}
                              onChange={handleSignupChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-green-400 focus:ring-2 focus:ring-green-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              required
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="password"
                              name="password"
                              placeholder="Mot de passe"
                              value={signupData.password}
                              onChange={handleSignupChange}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all placeholder:text-gray-300 shadow-inner backdrop-blur-md"
                              required
                            />
                          </div>
                          <motion.button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 active:scale-95"
                            disabled={signupLoading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {signupLoading ? "Création..." : "Créer un compte"}
                          </motion.button>
                          <AnimatePresence>
                            {signupError && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-red-400 text-sm text-center">
                                {signupError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </form>
                        <div className="my-6 flex items-center justify-center gap-2">
                          <span className="h-px w-16 bg-gray-700" />
                          <span className="text-gray-500 text-sm">ou continuer avec</span>
                          <span className="h-px w-16 bg-gray-700" />
                        </div>
                        <div className="flex gap-4 justify-center pb-2">
                          <motion.button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black font-semibold shadow hover:bg-gray-100 transition-all text-base"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FcGoogle className="w-6 h-6" /> Google
                          </motion.button>
                          <motion.button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-base"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaFacebook className="w-6 h-6" /> Facebook
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
