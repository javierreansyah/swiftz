import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="container py-8 text-center text-sm text-muted-foreground">
      <p>
        Built by{" "}
        <Link
          href="https://github.com/javierreansyah"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Rean
        </Link>
        . The source code is available on{" "}
        <Link
          href="https://github.com/javierreansyah/Swiftz"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </Link>
        .
      </p>
    </footer>
  );
}
