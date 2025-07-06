"use client"

import React from "react"
import Image from "next/image"

interface LogoScrollingBannerProps {
  logos: {
    src: string
    alt: string
  }[]
}

export function LogoScrollingBanner({ logos }: LogoScrollingBannerProps) {
  return (
    <div className="w-full overflow-x-hidden bg-transparent py-8 mb-8">
      <div className="relative whitespace-nowrap w-full">
        <div
          className="inline-block animate-scroll-banner w-full"
          style={{ animation: "scroll-banner 40s linear infinite" }}
        >
          {logos.map((logo, idx) => (
            <div key={idx} className="inline-block mx-8 md:mx-12 lg:mx-16">
              <div className="relative w-24 h-12 md:w-32 md:h-16 lg:w-40 lg:h-20 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            </div>
          ))}
          {/* Repeat for seamless loop */}
          {logos.map((logo, idx) => (
            <div key={"repeat-" + idx} className="inline-block mx-8 md:mx-12 lg:mx-16">
              <div className="relative w-24 h-12 md:w-32 md:h-16 lg:w-40 lg:h-20 flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes scroll-banner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
} 