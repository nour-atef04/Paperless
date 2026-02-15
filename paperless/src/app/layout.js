import Sidebar from "./_components/sidebar/Sidebar";
import { Crimson_Pro, Google_Sans } from "next/font/google";
import "./globals.css";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
});

const gsans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-gsans",
});

export const metadata = {
  title: "Paperless",
  description: "Study notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gsans.variable} ${crimson.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <div className="grid min-h-screen grid-cols-1 gap-3 p-3 md:grid-cols-[250px_1fr]">
          <Sidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
