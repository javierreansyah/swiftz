import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 border-t bg-card">
      <div className="container flex h-28 flex-col justify-center sm:h-16 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-3xl font-black text-primary"
          style={{ fontStyle: "italic" }}
        >
          Swiftz
        </h1>
        <p className="pl-1 text-sm text-muted-foreground sm:pl-0">
          Copyright © 2025 Swiftz | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
