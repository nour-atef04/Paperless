import Sidebar from "./_components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Paperless",
  description: "Study notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="grid min-h-screen gap-3 p-3 md:grid-cols-[200px_1fr]">
          <Sidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
