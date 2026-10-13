import Link from "next/link";
import Logo from "@/public/assets/svg-components/logo";

interface RouteLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: RouteLink[];
}

const navigationSections: FooterSection[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Movies", href: "/movie" },
      { label: "TV Shows", href: "/tv" },
      { label: "People & Stars", href: "/person" },
      { label: "Search Catalog", href: "/search" },
      { label: "My Library", href: "/library" },
    ],
  },
  {
    title: "Movies",
    links: [
      { label: "Popular Movies", href: "/movie/popular" },
      { label: "Trending Today", href: "/movie/trending-today" },
      { label: "Top Rated", href: "/movie/top-rated" },
      { label: "Now Playing", href: "/movie/now-playing" },
      { label: "Upcoming Releases", href: "/movie/upcoming" },
    ],
  },
  {
    title: "TV Shows",
    links: [
      { label: "Popular TV Shows", href: "/tv/popular" },
      { label: "Trending Today", href: "/tv/trending-today" },
      { label: "Top Rated", href: "/tv/top-rated" },
      { label: "Airing Today", href: "/tv/airing-today" },
      { label: "On The Air", href: "/tv/on-the-air" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="container py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Brand & Copyright Section */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div className="space-y-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Swiftz Home"
              >
                <Logo className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-9" />
                <span className="font-sans text-3xl font-black tracking-tight text-foreground italic transition-colors duration-300 group-hover:text-primary sm:text-4xl">
                  Swiftz
                </span>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Discover movies and tv series in the speed of light.
              </p>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
                © {new Date().getFullYear()} Swiftz. Film and television data
                provided by TMDB.
              </p>
            </div>
          </div>

          {/* Navigation Columns (Beside brand on desktop) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-8">
              {navigationSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h3 className="font-sans text-xs font-bold tracking-wider text-foreground uppercase">
                    {section.title}
                  </h3>

                  <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded-sm text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
