import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Prism",
  description: "DevelopedByUsama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <Toaster richColors position="bottom-right" />
        <RootProvider>
          <body className={inter.className}>
            <Navbar />
            {children}
            <Footer />
          </body>
        </RootProvider>
      </html>
    </ClerkProvider>
  );
}
