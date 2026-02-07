"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "border-4 border-black font-mono uppercase font-bold tracking-wider transition-all active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variant === "primary" &&
            "bg-black text-white hover:bg-accent hover:text-black",
          variant === "secondary" &&
            "bg-white text-black hover:bg-black hover:text-white",
          variant === "accent" &&
            "bg-accent text-black hover:bg-black hover:text-accent",
          variant === "ghost" &&
            "border-transparent bg-transparent hover:border-black",
          size === "sm" && "px-3 py-1 text-xs",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-8 py-4 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
