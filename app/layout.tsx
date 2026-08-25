import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://intreatment-therapy-calculator.dr-loginovah.chatgpt.site";

export const metadata: Metadata = {
  title: "Ориентир по длительности терапии",
  description: "Предварительный ориентир по количеству встреч, длительности терапии и возможному бюджету от InTreatment.",
  openGraph: {
    title: "Сколько времени может занять терапия?",
    description: "Предварительный ориентир по количеству встреч, сроку и бюджету.",
    url: siteUrl,
    siteName: "InTreatment",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Сколько времени может занять терапия?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Сколько времени может занять терапия?",
    description: "Предварительный ориентир по количеству встреч, сроку и бюджету.",
    images: [`${siteUrl}/og.jpg`],
  },
  icons: {
    icon: `${siteUrl}/favicon.svg`,
    shortcut: `${siteUrl}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
