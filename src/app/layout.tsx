import { GeistSans } from "geist/font/sans"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import React from "react"
import "./globals.css"
import "react-datepicker/dist/react-datepicker.css"
import { Toaster } from "@/components/Toaster"
import OnboardingLayoutClient from "@/features/registration/components/OnboardingLayoutClient"
import { RegistrationProvider } from "@/context/RegisterationContext"
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "Lx1",
  description: "Lx1 - Transporation Management System",
  authors: [{ name: "Lx1 - Manage Logistics With Ease" }],
  openGraph: {
    title: "Lx1",
    description: "Lx1 - Transporation Management System",
    url: "https://lxone-onboarding.vercel.app",
    siteName: "lxone-onboarding",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 48,
        height: 48,
        alt: "Lx1 - Manage Logistics With Ease",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} overflow-x-hidden overflow-y-scroll scroll-auto bg-gray-50 antialiased selection:bg-blue-100 selection:text-blue-700`}
      >
        {/* <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        > */}
        <NuqsAdapter>
          <Toaster />
          {children}
        </NuqsAdapter>
        {/* </ThemeProvider> */}
        <Analytics />
      </body>
    </html>
  )
}
