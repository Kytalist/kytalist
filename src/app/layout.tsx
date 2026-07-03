import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Kytalist — Student activities, camps & internships",
  description:
    "Discover extracurriculars, summer camps, and internships across the country in one calm, modern hub.",
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
      className={`${jakarta.variable} ${manrope.variable} h-full scroll-smooth antialiased`}
    >
      <body className="font-sans min-h-full text-foreground selection:bg-[#0B4650] selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
