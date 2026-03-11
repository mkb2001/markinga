import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: "h-5 w-5", text: "text-base", container: "h-8 w-8" },
  md: { icon: "h-6 w-6", text: "text-lg", container: "h-9 w-9" },
  lg: { icon: "h-8 w-8", text: "text-2xl", container: "h-12 w-12" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary",
          s.container
        )}
      >
        <GraduationCap className={cn("text-primary-foreground", s.icon)} />
      </div>
      {showText && (
        <span className={cn("font-bold text-foreground", s.text)}>
          Markinga <span className="text-accent">UG</span>
        </span>
      )}
    </div>
  );
}
