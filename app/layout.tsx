import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MovieNavProvider } from "@/components/providers/movie-nav-provider";
import Navigation from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const loraHeading = Lora({subsets:['latin'],variable:'--font-heading'});

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
