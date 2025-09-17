import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
})

export const metadata: Metadata = {
  title: "소아 항생제 용량 계산기",
  description: "의료 전문가를 위한 정확한 소아 항생제 용량 계산 도구",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
