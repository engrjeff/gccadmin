import "@/styles/globals.css"

import { Metadata, Viewport } from "next"
import AuthProvider from "@/providers/auth-provider"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            fontSans.variable,
            "h-full overflow-hidden bg-background font-sans antialiased"
          )}
        >
          {/* <NextTopLoader color="#6467F2" showSpinner={false} /> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* {user?.discipleId ? (
              <>
                <AuthProvider>{children}</AuthProvider>
                <Toaster />
              </>
            ) : (
              <UnverifiedAccountView />
            )} */}
            <>
              <AuthProvider>{children}</AuthProvider>
              <Toaster />
            </>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
