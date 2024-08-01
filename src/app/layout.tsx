import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/providers/RootProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PROJECT PRISM",
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
        <RootProvider>
          <body className={inter.className}>{children}</body>
        </RootProvider>
      </html>
    </ClerkProvider>
  );
}
