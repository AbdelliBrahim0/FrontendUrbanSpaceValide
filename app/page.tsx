"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const videos = Array.from({ length: 13 }, (_, i) => `/firstpage/${i + 1}.mp4`)

export default function Home() {
  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleEnded = () => {
      setCurrent((prev) => (prev + 1) % videos.length)
    }
    video.addEventListener("ended", handleEnded)
    // Pause and cleanup on unmount to avoid play() interruption during route changes
    return () => {
      video.removeEventListener("ended", handleEnded)
      try {
        video.pause()
        // Release src to stop loading
        video.removeAttribute("src")
        video.load()
      } catch {}
    }
  }, [current])

  useEffect(() => {
    // Safe reload and play when current changes
    const video = videoRef.current
    if (!video) return

    let cancelled = false
    // Pause before switching source to avoid race
    try { video.pause() } catch {}
    // Force reload, then wait for data before attempting play
    try { video.load() } catch {}

    const tryPlay = () => {
      if (cancelled) return
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.catch(() => {
          // Ignore play interruption (e.g., during navigation)
        })
      }
    }

    if (video.readyState >= 2) {
      tryPlay()
    } else {
      const onLoaded = () => {
        video.removeEventListener("loadeddata", onLoaded)
        tryPlay()
      }
      video.addEventListener("loadeddata", onLoaded)
    }

    // Pause when tab hidden to reduce interruptions
    const onVisibility = () => {
      if (document.hidden) {
        try { video.pause() } catch {}
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [current])

  return (
    <main className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Video background */}
      <video
        key={current}
        ref={videoRef}
        src={videos[current]}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: "none" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Animated Text */}
      <div className="relative z-20 flex flex-col items-center mt-0">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg text-center"
        >
          <motion.span
            initial={{ letterSpacing: "-0.5em" }}
            animate={{ letterSpacing: "normal" }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="block"
          >
            Urban Space
          </motion.span>
        </motion.h1>
        <a
          href="/boutique"
          className="mt-8 inline-block px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-400 text-white text-2xl font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-green-500 transition-all duration-300"
        >
          Boutique
        </a>
      </div>
    </main>
  )
}
