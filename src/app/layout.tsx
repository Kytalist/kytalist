import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Hind_Siliguri, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kytalist — Student activities, camps & internships",
  description:
    "Discover extracurriculars, summer camps, and internships across the country in one calm, modern hub.",
  manifest: "/favicon_io/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${manrope.variable} ${hindSiliguri.variable} h-full scroll-smooth antialiased`}
    >
      <body className="font-sans min-h-full text-foreground selection:bg-[#0B4650] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
