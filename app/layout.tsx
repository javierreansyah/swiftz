import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { MovieNavProvider } from "@/components/providers/movie-nav-provider";
import { Navbar as Navigation } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { siteUrl, isPreview } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Swiftz — Movies, TV Shows & People",
    template: "%s | Swiftz",
  },
  description:
    "Discover movies, television series, cast, trailers, and recommendations. Build your watchlist with Swiftz.",
  robots: { index: !isPreview, follow: !isPreview },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, loraHeading.variable)}
    >
      <head />
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider delayDuration={200}>
                <MovieNavProvider>
                  <div className="overflow-clip">
                    <Navigation />
                    <div className="min-h-screen">{children}</div>
                    <Footer />
                  </div>
                </MovieNavProvider>
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
