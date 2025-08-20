import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/ClientLayout"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UrbanSpace - Premium Streetwear",
  description: "Discover the future of streetwear with our exclusive collections",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Gestion globale des erreurs d'animation
              window.addEventListener('error', function(e) {
                if (e.message.includes('play()') || e.message.includes('interrupted')) {
                  console.warn('Animation error caught and handled:', e.message);
                  e.preventDefault();
                  return false;
                }
              });
              
              // Gestion des erreurs de navigation
              window.addEventListener('beforeunload', function() {
                // Annuler toutes les animations en cours
                if (window.requestAnimationFrame) {
                  // Cette fonction sera appelée avant la navigation
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
