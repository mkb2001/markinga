"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, Bot, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalExams: number;
    totalSubmissions: number;
    autograded: number;
    reviewed: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Exams",
      value: stats.totalExams,
      icon: FileText,
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      title: "Total Submissions",
      value: stats.totalSubmissions,
      icon: Users,
      iconClass: "text-blue-600",
      bgClass: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Autograded",
      value: stats.autograded,
      icon: Bot,
      iconClass: "text-green-600",
      bgClass: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Reviewed",
      value: stats.reviewed,
      icon: CheckCircle,
      iconClass: "text-violet-600",
      bgClass: "bg-violet-100 dark:bg-violet-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="py-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgClass}`}
                >
                  <Icon className={`h-4 w-4 ${card.iconClass}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
