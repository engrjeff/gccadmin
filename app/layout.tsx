import "@/styles/globals.css"
import { Metadata } from "next"
import AuthProvider from "@/providers/auth-provider"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import UnverifiedAccountView from "@/components/unverified-account-view"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUser()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "h-full overflow-hidden bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {user?.discipleId ? (
              <>
                <AuthProvider>{children}</AuthProvider>
                <Toaster />
              </>
            ) : (
              <UnverifiedAccountView />
            )}
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
