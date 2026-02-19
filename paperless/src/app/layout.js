import { Crimson_Pro, Inter } from "next/font/google";
import Sidebar from "./_components/sidebar/Sidebar";
import "./globals.css";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
});

// const gsans = Google_Sans({
//   subsets: ["latin"],
//   variable: "--font-gsans",
// });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Paperless",
  description: "Study notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <div className="grid h-screen grid-cols-1 md:grid-cols-[250px_1fr]">
          <Sidebar />
          <main className="overflow-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
