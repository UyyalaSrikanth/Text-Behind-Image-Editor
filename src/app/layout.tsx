import type { Metadata } from "next";
import { Dancing_Script, Great_Vibes, Inter, Lato, Lobster, Merriweather, Montserrat, Open_Sans, Pacifico, Playfair_Display, Poppins, Raleway, Roboto, Satisfy, Shadows_Into_Light, Source_Sans_3, Tangerine, Ubuntu, Yellowtail } from "next/font/google";
import "./globals.css";

// Initialize fonts with proper configuration
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const openSans = Open_Sans({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const montserrat = Montserrat({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const raleway = Raleway({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const ubuntu = Ubuntu({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const playfair = Playfair_Display({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const sourceSans = Source_Sans_3({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const dancingScript = Dancing_Script({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const pacifico = Pacifico({ weight: ['400'], subsets: ['latin'], display: 'swap' });
const greatVibes = Great_Vibes({ weight: ['400'], subsets: ['latin'], display: 'swap' });
const satisfy = Satisfy({ weight: ['400'], subsets: ['latin'], display: 'swap' });
const lobster = Lobster({ weight: ['400'], subsets: ['latin'], display: 'swap' });
const shadowsIntoLight = Shadows_Into_Light({ weight: ['400'], subsets: ['latin'], display: 'swap' });
const tangerine = Tangerine({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const yellowtail = Yellowtail({ weight: ['400'], subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "Text Behind Image Editor - 100% Free | No Login Required",
  description: "Instantly add text behind subjects in your images using AI. Completely free with no signups or watermarks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style jsx global>{`
          /* System fonts */
          @font-face {
            font-family: 'Impact';
            src: local('Impact');
            font-display: swap;
          }
          @font-face {
            font-family: 'Arial';
            src: local('Arial');
            font-display: swap;
          }
          @font-face {
            font-family: 'Helvetica';
            src: local('Helvetica');
            font-display: swap;
          }
          @font-face {
            font-family: 'Times New Roman';
            src: local('Times New Roman');
            font-display: swap;
          }
          @font-face {
            font-family: 'Georgia';
            src: local('Georgia');
            font-display: swap;
          }
          @font-face {
            font-family: 'Courier New';
            src: local('Courier New');
            font-display: swap;
          }
          @font-face {
            font-family: 'Verdana';
            src: local('Verdana');
            font-display: swap;
          }
          @font-face {
            font-family: 'Tahoma';
            src: local('Tahoma');
            font-display: swap;
          }
          @font-face {
            font-family: 'Trebuchet MS';
            src: local('Trebuchet MS');
            font-display: swap;
          }
          @font-face {
            font-family: 'Arial Black';
            src: local('Arial Black');
            font-display: swap;
          }
          @font-face {
            font-family: 'Brush Script MT';
            src: local('Brush Script MT');
            font-display: swap;
          }

          /* Font loading classes */
          .font-loading {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          /* Force font loading */
          .force-font-load {
            position: absolute;
            visibility: hidden;
            height: 0;
            width: 0;
            overflow: hidden;
          }

          /* Apply Next.js font classes */
          .font-roboto { font-family: ${roboto.style.fontFamily}; }
          .font-open-sans { font-family: ${openSans.style.fontFamily}; }
          .font-lato { font-family: ${lato.style.fontFamily}; }
          .font-montserrat { font-family: ${montserrat.style.fontFamily}; }
          .font-poppins { font-family: ${poppins.style.fontFamily}; }
          .font-raleway { font-family: ${raleway.style.fontFamily}; }
          .font-ubuntu { font-family: ${ubuntu.style.fontFamily}; }
          .font-playfair { font-family: ${playfair.style.fontFamily}; }
          .font-merriweather { font-family: ${merriweather.style.fontFamily}; }
          .font-source-sans { font-family: ${sourceSans.style.fontFamily}; }
          .font-dancing-script { font-family: ${dancingScript.style.fontFamily}; }
          .font-pacifico { font-family: ${pacifico.style.fontFamily}; }
          .font-great-vibes { font-family: ${greatVibes.style.fontFamily}; }
          .font-satisfy { font-family: ${satisfy.style.fontFamily}; }
          .font-lobster { font-family: ${lobster.style.fontFamily}; }
          .font-shadows-into-light { font-family: ${shadowsIntoLight.style.fontFamily}; }
          .font-tangerine { font-family: ${tangerine.style.fontFamily}; }
          .font-yellowtail { font-family: ${yellowtail.style.fontFamily}; }
        `}</style>
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white antialiased`}>
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

        {/* Main content with glowing text effect */}
        <div className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl animate-float1"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl animate-float2"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-pink-600/20 blur-3xl animate-float3"></div>
          </div>
          
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

        <footer className="text-center text-gray-500 py-6 border-t border-gray-700">
  © 2025 All rights reserved.{' '}
  <a
    href="https://uyyalasrikanth.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline"
  >
    @uyyalasrikanth
  </a>
</footer>

      </body>
    </html>
  );
}