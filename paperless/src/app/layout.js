import { Crimson_Pro, Inter } from "next/font/google";
import Sidebar from "./_components/sidebar/Sidebar";
import "./globals.css";

const crimson = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson" });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Paperless",
  description: "Study notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
