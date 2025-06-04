import { ALL_FONTS } from "@/constants/fonts";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Text Behind Image Editor - 100% Free | No Login Required",
  description: "Instantly add text behind subjects in your images using AI. Completely free with no signups or watermarks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the Google Fonts URL with all fonts
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${ALL_FONTS.map(font => 
    `family=${encodeURIComponent(font)}:wght@400;700`
  ).join('&')}&display=swap`;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={googleFontsUrl}
          rel="stylesheet"
          media="all"
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white antialiased flex flex-col min-h-screen`}>
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-50 overflow-hidden animate-gradient">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
        </div>

        {/* Value proposition banner */}
        <div className="w-full bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex flex-wrap justify-center items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-bold text-green-400">100% FREE</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span className="font-bold text-blue-400">NO LOGIN REQUIRED</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span className="font-bold text-yellow-400">INSTANT RESULTS</span>
            </div>
          </div>
        </div>

        {/* Main content area - will flex grow */}
        <div className="relative flex-grow">
          {children}
        </div>

        {/* Why choose us section */}
        <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                Why Choose Our Editor?
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-pink-500/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-pink-400">No Hidden Costs</h3>
                <p className="text-white/80">We believe in transparent, free tools. No subscriptions, no paywalls, no surprise charges.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-blue-400">Zero Login Hassle</h3>
                <p className="text-white/80">Start editing immediately without creating accounts or sharing personal information.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Powerful AI Technology</h3>
                <p className="text-white/80">Professional-grade background removal and text placement with simple controls.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with navigation */}
        <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                © 2025 All rights reserved.{' '}
                <a
                  href="https://uyyalasrikanth.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  @uyyalasrikanth
                </a>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}