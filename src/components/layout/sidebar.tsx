"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/navigation";
import { Logo } from "@/components/shared/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r bg-card",
        className
      )}
    >
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard">
          <Logo size="md" />
        </Link>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="lg"
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "font-semibold"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.description}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <p className="text-xs text-muted-foreground text-center">
          Markinga UG v0.1.0
        </p>
      </div>
    </aside>
  );
}
