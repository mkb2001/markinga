"use client";

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { UgandaFlagIcon } from "@/components/shared/uganda-flag-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInstitutionMode } from "@/hooks/use-institution-mode";

interface TopbarProps {
  userEmail?: string;
  userName?: string;
}

export function Topbar({ userEmail, userName }: TopbarProps) {
  const { institutionType, institutionName } = useInstitutionMode();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <UgandaFlagIcon size={28} />
        {institutionType && (
          <Badge variant="outline" className="text-xs">
            {institutionType === "PRIMARY_SECONDARY"
              ? "Primary / Secondary"
              : "University"}
            {institutionName && ` - ${institutionName}`}
          </Badge>
        )}
        {userName && (
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {userName}
            {userEmail && ` (${userEmail})`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
