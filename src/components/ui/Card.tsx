import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

export default function Card({
  className,
  accent,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border-4 border-black bg-white",
        accent && "border-l-8 border-l-accent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
