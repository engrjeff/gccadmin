import "./globals.css"

import { Metadata, Viewport } from "next"
import AuthProvider from "@/providers/auth-provider"
import ReactQueryProvider from "@/providers/react-query-provider"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"

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
    template: `%s - Staging | ${siteConfig.name}`,
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
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className={cn(fontSans.variable, "h-full font-sans antialiased")}>
        <NextTopLoader color="#6D28D9" showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <AuthProvider>
            <NuqsAdapter>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </NuqsAdapter>
          </AuthProvider>
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
