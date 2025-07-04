"use client"

import React from "react"

interface ScrollingBannerProps {
  messages: string[]
}

export function ScrollingBanner({ messages }: ScrollingBannerProps) {
  return (
    <div className="w-full overflow-x-hidden bg-transparent py-3 mb-8">
      <div className="relative whitespace-nowrap">
        <div
          className="inline-block animate-scroll-banner text-white text-2xl md:text-4xl font-bold tracking-wide font-gliker"
          style={{ animation: "scroll-banner 30s linear infinite" }}
        >
          {messages.map((msg, idx) => (
            <span key={idx} className="mx-8">
              {msg}
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {messages.map((msg, idx) => (
            <span key={"repeat-" + idx} className="mx-8">
              {msg}
            </span>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Gliker&display=swap');
        .font-gliker {
          font-family: 'Gliker', cursive !important;
        }
        @keyframes scroll-banner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
} 