import "./globals.css"

import { Metadata, Viewport } from "next"
import AuthProvider from "@/providers/auth-provider"
import ReactQueryProvider from "@/providers/react-query-provider"
import NextTopLoader from "nextjs-toploader"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const viewport: Viewport = {
  themeColor: siteConfig.bgColor,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" className="dark h-full" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            fontSans.variable,
            "h-full bg-background font-sans antialiased"
          )}
        >
          <NextTopLoader color="#6467F2" showSpinner={false} />
          {/* <NextTopLoader color="#FDB21C" showSpinner={false} /> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <AuthProvider>
              <ReactQueryProvider>
                <div className="absolute inset-0 mx-auto flex max-w-xs flex-col items-center justify-center">
                  <h1>
                    I already decided to kill this app since it is not really
                    being used.
                  </h1>

                  <p>-jeff</p>
                </div>
              </ReactQueryProvider>
            </AuthProvider>
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
