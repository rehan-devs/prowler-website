"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ProwlerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const ProwlerButton = forwardRef<HTMLButtonElement, ProwlerButtonProps>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref
  ) => {
    const base =
      "relative font-body font-semibold tracking-wide uppercase rounded-full cursor-pointer border-0 transition-all duration-300 overflow-hidden";

    const sizes = {
      sm: "px-6 py-3 text-xs",
      md: "px-10 py-4 text-sm",
      lg: "px-12 py-5 text-base",
    };

    const variants = {
      primary:
        "bg-white text-bg-deep hover:bg-accent-primary hover:text-white hover:shadow-[0_7px_29px_rgba(102,126,234,0.5)] hover:tracking-widest active:translate-y-2 active:shadow-none",
      secondary:
        "bg-bg-surface text-text-primary border border-border hover:border-accent-primary hover:text-accent-primary hover:tracking-widest",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:tracking-widest",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(base, sizes[size], variants[variant], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

ProwlerButton.displayName = "ProwlerButton";
export { ProwlerButton };