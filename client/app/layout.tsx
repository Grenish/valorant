import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valorant Agents",
  description: "Explore Valorant agents and their abilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
