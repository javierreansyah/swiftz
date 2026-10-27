"use client";
import { useEffect, useRef } from "react";

/** Update the existing transform without rendering React trees while scrolling. */
export function useParallax(factor = 0.38) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number | undefined;
    const update = () => {
      ref.current?.style.setProperty(
        "--parallax-offset",
        `${window.scrollY * factor}px`,
      );
      frame = undefined;
    };
    const onScroll = () => {
      frame ??= window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [factor]);

  return ref;
}
