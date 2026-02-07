import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "error";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
        variant === "default" && "bg-white text-black",
        variant === "accent" && "bg-accent text-black",
        variant === "success" && "bg-green-600 text-white border-green-600",
        variant === "error" && "bg-red-600 text-white border-red-600",
        className
      )}
    >
      {children}
    </span>
  );
}
