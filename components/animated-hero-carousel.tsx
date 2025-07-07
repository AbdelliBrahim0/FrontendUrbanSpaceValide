"use client"

import { useState, useEffect, useRef } from "react"
import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  { id: 1, type: "blackfriday" },
  { id: 2, type: "empty" },
  { id: 3, type: "empty" },
  { id: 4, type: "empty" },
]

export function AnimatedHeroCarousel() {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction pour passer au slide suivant
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])
  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Gestion du passage auto après 10s si la vidéo ne se termine pas
  useEffect(() => {
    if (slides[current].type === "blackfriday" && videoRef.current) {
      // Nettoie tout timer précédent
      if (timerRef.current) clearTimeout(timerRef.current)
      // Si la vidéo ne boucle pas, on passe au slide suivant après 10s
      timerRef.current = setTimeout(() => {
        next()
      }, 10000)
      // Ajoute un event listener pour passer au slide suivant à la fin de la vidéo
      const handleEnded = () => next()
      const vid = videoRef.current
      vid.addEventListener('ended', handleEnded)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        vid.removeEventListener('ended', handleEnded)
      }
    }
    // Pour les slides vides, pas d'auto-transition
    if (timerRef.current) clearTimeout(timerRef.current)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next])

  return (
    <div className="relative w-full h-screen overflow-hidden pt-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {slides[current].type === "blackfriday" ? (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ background: "rgb(24,24,24)" }}>
              {/* Vidéo en background à gauche (plus petite) */}
              <div className="flex flex-col md:flex-row items-stretch w-full min-h-[260px] md:min-h-[320px] h-full relative z-10">
                {/* Vidéo à gauche, occupe toute la hauteur */}
                <div className="flex-1 flex items-center justify-center">
                  <motion.video
                    ref={videoRef}
                    className="rounded-xl shadow-2xl w-[95vw] h-[480px] md:w-[420px] md:h-[700px] object-contain bg-transparent"
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                  >
                    <source src="/hero/hero1.mp4" type="video/mp4" />
                  </motion.video>
                </div>
                {/* Texte à droite, même hauteur que la vidéo */}
                <div className="flex-1 flex flex-col items-start justify-center px-4 md:px-12 bg-transparent">
                  <motion.div
                    className="text-3xl md:text-5xl font-black mb-4"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ color: "rgb(255,199,0)", textShadow: "0 2px 16px #000" }}
                  >
                    BLACK FRIDAY
                  </motion.div>
                  <motion.div
                    className="text-xl md:text-2xl font-extrabold text-right mb-6"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ color: "rgb(255,199,0)", textShadow: "0 2px 16px #000" }}
                  >
                    URBAN SPACE<br />OFFRES EXCLUSIVES
                  </motion.div>
                  <motion.div
                    className="relative max-w-xl text-base md:text-lg font-semibold text-white drop-shadow-lg mb-6"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.9 }}
                  >
                    <span className="text-yellow-400 font-black">Black Friday chez Urban Space</span> — Des offres exclusives jusqu’à <span className="text-yellow-400 font-black">-70%</span> sur nos collections mode & lifestyle.<br />L’élégance urbaine n’a jamais été aussi accessible.
                  </motion.div>
                  <motion.button
                    className="mt-2 px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-black text-lg rounded-full shadow-2xl hover:scale-105 hover:shadow-yellow-400/50 transition-transform duration-300 border-2 border-yellow-200"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  >
                    Voir les offres Black Friday
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center"></div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Contrôles */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition">&#8592;</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition">&#8594;</button>
      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full ${i === current ? 'bg-yellow-400' : 'bg-gray-600'} transition`} />
        ))}
      </div>
    </div>
  )
}
