"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "accent" | "dark" | "white";
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({
  href,
  variant = "accent",
  children,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const variantClass =
    variant === "dark"
      ? "animated-btn-dark"
      : variant === "white"
      ? "animated-btn-white"
      : "animated-btn-accent";

  const content = (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="arr-icon arr-2 fill-current" viewBox="0 0 24 24">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="btn-text flex items-center justify-center gap-2">{children}</span>
      <span className="btn-circle" />
      <svg xmlns="http://www.w3.org/2000/svg" className="arr-icon arr-1 fill-current" viewBox="0 0 24 24">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "animated-btn select-none",
          variantClass,
          disabled && "opacity-60 pointer-events-none cursor-not-allowed",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={cn(
        "animated-btn select-none",
        variantClass,
        disabled && "opacity-60 pointer-events-none cursor-not-allowed",
        className
      )}
      {...props}
    >
      {content}
    </button>
  );
}