import React from "react";

const Footer = () => {
  return (
    <div className="bg-card border-t mt-12">
      <div className="container flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between h-28 sm:h-16">
        <h1
          className="font-black text-primary text-3xl"
          style={{ fontStyle: "italic" }}
        >
          Swiftz
        </h1>
        <p className="text-sm text-muted-foreground pl-1 sm:pl-0">
          Copyright © 2025 Swiftz | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
