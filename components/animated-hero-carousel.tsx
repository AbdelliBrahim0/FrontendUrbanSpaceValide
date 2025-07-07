"use client"

import { useState, useEffect, useRef } from "react"
import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  { id: 1, type: "blackfriday" },
  { id: 2, type: "hero2" },
  { id: 3, type: "hero3" },
  { id: 4, type: "hero4" }, // Changement ici
]

export function AnimatedHeroCarousel() {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [bgColor, setBgColor] = useState("rgb(251, 165, 26)")
  const hero2VideoRef = useRef<HTMLVideoElement | null>(null)
  const [showUrbanSpaceText, setShowUrbanSpaceText] = useState(false)
  const hero4VideoRef = useRef<HTMLVideoElement | null>(null)
  const [showHero4Text, setShowHero4Text] = useState(false)

  // Fonction pour passer au slide suivant
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])
  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Gestion du passage auto après 10s si la vidéo ne se termine pas
  useEffect(() => {
    if (slides[current].type === "blackfriday") {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        next()
      }, 8000)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
    // Pour les slides vides, pas d'auto-transition
    if (timerRef.current) clearTimeout(timerRef.current)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, next])

  // Gestion de la vidéo hero2 (couleur de fond + fin de vidéo)
  useEffect(() => {
    if (slides[current].type === "hero2") {
      setShowUrbanSpaceText(false)
      
      if (hero2VideoRef.current) {
        const video = hero2VideoRef.current
        
        // Gestion du changement de couleur de background
        const handleTimeUpdate = () => {
          const currentTime = video.currentTime
          if (currentTime < 2) {
            setBgColor("rgb(251, 165, 26)")
          } else if (currentTime >= 2 && currentTime < 6) {
            setBgColor("black")
          } else {
            setBgColor("rgb(251, 165, 26)")
          }
        }
        
        // Gestion de la fin de vidéo
        const handleEnded = () => {
          console.log("Vidéo hero2 terminée")
          setShowUrbanSpaceText(true)
          setTimeout(() => {
            next()
          }, 3000)
        }
        
        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('ended', handleEnded)
        
        return () => {
          video.removeEventListener('timeupdate', handleTimeUpdate)
          video.removeEventListener('ended', handleEnded)
        }
      }
    }
  }, [current, next])

  // Gestion de la vidéo hero4 (fin de vidéo)
  useEffect(() => {
    if (slides[current].type === "hero4") {
      setShowHero4Text(false)
      if (hero4VideoRef.current) {
        const video = hero4VideoRef.current
        const handleEnded = () => {
          setShowHero4Text(true)
          setTimeout(() => {
            next()
          }, 3000 + 3200) // 3s d'affichage après l'apparition du logo (delay logo = 3.2s)
        }
        video.addEventListener('ended', handleEnded)
        return () => {
          video.removeEventListener('ended', handleEnded)
        }
      }
    }
  }, [current, next])

  useEffect(() => {
    if (slides[current].type === "hero3") {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        next()
      }, 7000)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
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
              {/* Images cadeaux flottantes */}
              <motion.img
                src="/hero/cadeau.png"
                alt="cadeau gauche"
                className="absolute left-8 top-1/3 w-28 md:w-40 z-20 pointer-events-none select-none"
                initial={{ y: -30, rotate: -10, opacity: 0 }}
                animate={{ y: [ -30, 10, -30 ], rotate: [ -10, 10, -10 ], opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              />
              <motion.img
                src="/hero/cadeau2.png"
                alt="cadeau droite"
                className="absolute right-8 bottom-1/4 w-24 md:w-32 z-20 pointer-events-none select-none"
                initial={{ y: 30, rotate: 10, opacity: 0 }}
                animate={{ y: [ 30, -10, 30 ], rotate: [ 10, -10, 10 ], opacity: 1 }}
                transition={{ duration: 4.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 1.2 }}
              />
              <motion.img
                src="/hero/cadeau3.png"
                alt="cadeau haut centre"
                className="absolute right-16 bottom-10 w-28 md:w-40 z-20 pointer-events-none select-none"
                initial={{ y: -30, scale: 0.9, opacity: 0 }}
                animate={{ y: [ -30, 10, -30 ], scale: [0.9, 1.05, 0.9], opacity: 1 }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 2 }}
              />
              <motion.img
                src="/hero/offrespeciale.png"
                alt="offre spéciale"
                className="absolute right-8 top-8 w-20 md:w-28 z-30 pointer-events-none select-none"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear', repeatType: 'loop', opacity: { delay: 0.2, duration: 0.8 } }}
              />
              {/* Vidéo en background à gauche (plus petite) */}
              <div className="flex flex-col md:flex-row items-stretch w-full min-h-[260px] md:min-h-[320px] h-full relative z-10 gap-0 md:gap-0">
                {/* Vidéo à gauche, occupe toute la hauteur */}
                <div className="flex-1 flex items-center justify-center md:pr-0">
                  <motion.video
                    ref={videoRef}
                    className="rounded-xl w-[95vw] h-[480px] md:w-[420px] md:h-[700px] object-contain bg-transparent"
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
                <div className="flex-1 flex flex-col items-start justify-center px-4 md:px-0 bg-transparent">
                  {/* Ligne titre + badges */}
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    {/* Badge EXCLUSIF */}
                    <motion.div
                      className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 text-black font-black text-xs md:text-base shadow-lg border-2 border-yellow-300 animate-pulse"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.4, type: 'spring', bounce: 0.5 }}
                    >
                      EXCLUSIF
                    </motion.div>
                    {/* Badge -70% */}
                    <motion.div
                      className="ml-2 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-200 to-yellow-500 text-black font-black text-3xl md:text-4xl shadow-2xl border-4 border-yellow-300 animate-pulse animate-glow"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1.2, 1, 1.1, 1], opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.8, type: 'tween', ease: 'easeInOut' }}
                      style={{ boxShadow: '0 0 32px 8px #ffe06699, 0 2px 8px #000' }}
                    >
                      -70%
                    </motion.div>
                  </motion.div>
                  {/* Sous-titre */}
                  <motion.div
                    className="text-xl md:text-2xl font-extrabold text-right mb-6 text-yellow-300 animate-pulse drop-shadow-lg"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.1 }}
                  >
                    URBAN SPACE<br />OFFRES EXCLUSIVES
                  </motion.div>
                  {/* Encadré glassmorphism pour le texte descriptif */}
                  <motion.div
                    className="relative max-w-xl text-base md:text-lg font-semibold text-white mb-6 border border-yellow-400 pl-4 pr-4 py-4 rounded-2xl bg-black/60 backdrop-blur-md shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 1.4 }}
                  >
                    <span className="text-yellow-400 font-black">Black Friday chez Urban Space</span> — Des offres exclusives jusqu'à <span className="text-yellow-400 font-black text-2xl md:text-3xl animate-pulse">-70%</span> sur nos collections mode & lifestyle.<br />L'élégance urbaine n'a jamais été aussi accessible.
                    <CountdownToNextFriday className="mt-4 block text-2xl md:text-3xl font-extrabold text-yellow-400 text-center tracking-widest bg-black/80 rounded-lg py-2 px-4 shadow-lg border-2 border-yellow-400 animate-glow font-digital" />
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
          ) : slides[current].type === "hero2" ? (
            <div className="w-full h-full flex items-center justify-center transition-colors duration-500" style={{ background: "rgb(249, 165, 22)" }}>
              {!showUrbanSpaceText ? (
                <motion.video
                  ref={hero2VideoRef}
                  className="rounded-xl w-[95vw] h-[480px] md:w-[420px] md:h-[700px] object-contain bg-transparent"
                  autoPlay
                  muted
                  playsInline
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  onEnded={() => {
                    setShowUrbanSpaceText(true);
                    setTimeout(() => { next(); }, 3000);
                  }}
                >
                  <source src="/hero/hero2.mp4" type="video/mp4" />
                </motion.video>
              ) : (
                <motion.h2
                  className="text-6xl md:text-8xl font-black text-center mb-6 bg-gradient-to-r from-black via-gray-700 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Urban Space
                  <br />
                  <AnimatedTypeText text="where style meets identity" className="block text-2xl md:text-4xl font-semibold text-center bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent mt-8 animate-gradient-x" />
                  <motion.img
                    src="/logo.png"
                    alt="Urban Space Logo"
                    className="w-24 md:w-32 mx-auto mt-8 drop-shadow-2xl border-4 border-yellow-400 rounded-full bg-black p-2 animate-glow"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 2.2, type: 'spring', bounce: 0.4 }}
                  />
                </motion.h2>
              )}
            </div>
          ) : slides[current].type === "hero3" ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="flex flex-col md:flex-row items-stretch w-full min-h-[260px] md:min-h-[320px] h-full relative z-10 gap-2 md:gap-4">
                {/* Vidéo à gauche */}
                <div className="flex-1 flex items-center justify-center md:pr-2">
                  <motion.video
                    className="rounded-xl w-[95vw] h-[480px] md:w-[420px] md:h-[700px] object-contain bg-transparent"
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                  >
                    <source src="/hero/hero3.mp4" type="video/mp4" />
                  </motion.video>
                </div>
                {/* Texte animé à droite */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-2 bg-transparent">
                  <motion.div
                    className="text-6xl md:text-8xl font-black mb-4 text-center drop-shadow-lg bg-gradient-to-r from-[#6B3F1D] via-[#C97E48] to-[#6B3F1D] bg-clip-text text-transparent animate-gradient-x"
                    style={{
                      background: 'linear-gradient(90deg, #6B3F1D 0%, #C97E48 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 24px rgba(107,63,29,0.25), 0 1px 0 #fff8',
                    }}
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Urban Space
                  </motion.div>
                  <motion.div
                    className="text-2xl md:text-4xl font-semibold text-center mb-6 text-[#C97E48] animate-pulse drop-shadow-lg"
                    style={{ color: '#C97E48' }}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Des pièces aussi addictives que du chocolat.<br />À consommer sans modération.
                  </motion.div>
                  <motion.img
                    src="/logo.png"
                    alt="Urban Space Logo"
                    className="w-40 md:w-56 mt-8 drop-shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
              </div>
            </div>
          ) : slides[current].type === "hero4" ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              {!showHero4Text ? (
                <motion.video
                  key={showHero4Text ? 'text' : 'video'}
                  ref={hero4VideoRef}
                  className="rounded-xl w-[95vw] h-[80vh] md:w-[1100px] md:h-[90vh] object-cover bg-black shadow-2xl"
                  autoPlay
                  muted
                  playsInline
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  onEnded={() => {
                    setShowHero4Text(true);
                    setTimeout(() => { next(); }, 3000 + 3200); // 3s d'affichage après l'apparition du logo (delay logo = 3.2s)
                  }}
                >
                  <source src="/hero/hero4.mp4" type="video/mp4" />
                </motion.video>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                >
                  <motion.h2
                    className="text-4xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-2xl bg-gradient-to-r from-yellow-200 via-white to-yellow-400 bg-clip-text text-transparent animate-gradient-x"
                    initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1.1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 2, type: 'spring', bounce: 0.5 }}
                  >
                    Urban Space isn't just fashion,<br />
                    it's a lifestyle shaped by meaning.
                  </motion.h2>
                  <motion.div
                    className="w-32 h-1 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 rounded-full mt-4 mb-2 animate-pulse"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '8rem', opacity: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                  <motion.div
                    className="text-lg md:text-2xl text-yellow-100 text-center font-light mt-2 drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 2 }}
                  >
                    #UrbanSpace #Lifestyle
                  </motion.div>
                  <motion.img
                    src="/logo.png"
                    alt="Urban Space Logo"
                    className="w-32 md:w-40 mt-8 drop-shadow-2xl"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 3.2, type: 'spring', bounce: 0.4 }}
                  />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center"></div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Shimmer effect */}
      <style jsx global>{`
        .shimmer-mask {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.2) 60%, transparent 100%);
          mix-blend-mode: lighten;
          animation: shimmer-move 2.2s infinite linear;
          pointer-events: none;
        }
        @keyframes shimmer-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

function AnimatedTypeText({ text, className = "" }) {
  const letters = text.split("");
  return (
    <span className={className} style={{ display: "inline-block", overflow: "hidden" }}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.045 }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function CountdownToNextFriday({ className = "" }) {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeToNextFriday());
  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setTimeLeft(getTimeToNextFriday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  if (!isClient) return <span className={className}>--:--:--:--</span>;
  return (
    <span className={className}>
      {formatTime(timeLeft)}
    </span>
  );
}

function getTimeToNextFriday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7; // 5 = Friday
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(0, 0, 0, 0);
  return nextFriday - now;
}

function formatTime(ms) {
  if (ms <= 0) return "00:00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
