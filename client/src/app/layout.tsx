import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanetType",
  description: "A Minimal Space For Typing",
  icons:"/public/svgs/planet.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-fourth px-4 md:p-8 md:h-screen my-auto grid md:grid-cols-[auto_1fr] grid-cols-1 gap-10 antialiased`}
      >
        <Header/>
        <div className="md:my-4 flex flex-col items-center my-20 w-full">
        {children}
        </div>
        <Toaster position={"bottom-center"} toastOptions={{
            className: 'font-JetBrainsMono text-secondary',
            style: {
              width:'fit-content',
              color:"var(--primary)",
              backgroundColor:'var(--third)',
              borderRadius: '16px',
            },
  }}
/>
      </body>
    </html>
  );
}
