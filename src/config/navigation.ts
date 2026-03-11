import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of all exams and grading progress",
  },
  {
    title: "Exams",
    href: "/exams",
    icon: FileText,
    description: "Create and manage exams",
  },
  {
    title: "Rubrics",
    href: "/exams",
    icon: BookOpen,
    description: "Create and manage grading rubrics",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and app settings",
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Documentation and support",
  },
];
