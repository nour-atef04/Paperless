import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const crimson = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson" });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Paperless",
  description: "Study notes app",
};

export default function RootLayout({
  children,
}: Readonly<{ // Readonly for convention for the Root Layout (prevent mutation)
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}