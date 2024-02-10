import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ResponsiveHelper from "@/components/responsive-helper";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swiftz",
  description: "Discover movies at the speed of Taylor Swift",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head />
        <body className={inter.className}>
          <ThemeProvider>
            <div className="overflow-clip">
              <Navigation />
              <div className="min-h-screen">{children}</div>

              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
