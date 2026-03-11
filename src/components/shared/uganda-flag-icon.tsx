import { cn } from "@/lib/utils";

interface UgandaFlagIconProps {
  className?: string;
  size?: number;
}

export function UgandaFlagIcon({ className, size = 24 }: UgandaFlagIconProps) {
  return (
    <svg
      width={size}
      height={size * 0.67}
      viewBox="0 0 36 24"
      className={cn("inline-block", className)}
      aria-label="Uganda flag"
    >
      <rect width="36" height="4" y="0" fill="#000000" />
      <rect width="36" height="4" y="4" fill="#FCDC04" />
      <rect width="36" height="4" y="8" fill="#D90000" />
      <rect width="36" height="4" y="12" fill="#000000" />
      <rect width="36" height="4" y="16" fill="#FCDC04" />
      <rect width="36" height="4" y="20" fill="#D90000" />
      <circle cx="18" cy="12" r="5" fill="#FFFFFF" />
      <text
        x="18"
        y="14"
        textAnchor="middle"
        fontSize="6"
        fill="#000000"
        fontWeight="bold"
      >
        UG
      </text>
    </svg>
  );
}
