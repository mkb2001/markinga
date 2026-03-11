"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExamTableToolbar } from "@/components/dashboard/exam-table-toolbar";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { MoreHorizontal, Eye, Pencil, Trash2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ExamWithCounts {
  id: string;
  title: string;
  subject: string;
  level: string;
  status: string;
  totalMarks: number;
  submissionCount: number;
  gradedCount: number;
  gradesPublished: boolean;
  createdAt: Date;
  _count: { questions: number; submissions: number };
}

interface ExamTableProps {
  exams: ExamWithCounts[];
  onAutogradeExam?: (examId: string) => void;
  onAutogradeAll?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  ACTIVE: { label: "Active", variant: "default" },
  GRADING: { label: "Grading", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "secondary" },
};

export function ExamTable({
  exams,
  onAutogradeExam,
  onAutogradeAll,
}: ExamTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleAll() {
    if (selectedIds.length === exams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(exams.map((e) => e.id));
    }
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleAutogradeSelected() {
    if (onAutogradeExam && selectedIds.length > 0) {
      onAutogradeExam(selectedIds[0]);
    }
  }

  function handleAutogradeAll() {
    onAutogradeAll?.();
  }

  const allChecked = exams.length > 0 && selectedIds.length === exams.length;
  const someChecked = selectedIds.length > 0 && selectedIds.length < exams.length;

  return (
    <div className="flex flex-col gap-3">
      <ExamTableToolbar
        selectedIds={selectedIds}
        onAutogradeSelected={handleAutogradeSelected}
        onAutogradeAll={handleAutogradeAll}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked}
                  data-state={someChecked ? "indeterminate" : undefined}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="min-w-[140px]">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-muted-foreground"
                >
                  No exams yet. Create your first exam to get started.
                </TableCell>
              </TableRow>
            )}
            {exams.map((exam) => {
              const isSelected = selectedIds.includes(exam.id);
              const totalSubs = exam._count.submissions || exam.submissionCount;
              const autogradedPercent =
                totalSubs > 0 ? (exam.gradedCount / totalSubs) * 100 : 0;
              const reviewedPercent = 0; // extend when reviewed count available
              const statusConfig =
                STATUS_CONFIG[exam.status] ?? { label: exam.status, variant: "outline" as const };

              return (
                <TableRow
                  key={exam.id}
                  data-state={isSelected ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => router.push(`/exams/${exam.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(exam.id)}
                      aria-label={`Select ${exam.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/exams/${exam.id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {exam.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.subject}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.level}
                  </TableCell>
                  <TableCell className="text-center">
                    {exam._count.questions}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ProgressBar
                      autogradedPercent={autogradedPercent}
                      reviewedPercent={reviewedPercent}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(exam.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Open actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {onAutogradeExam && (
                          <DropdownMenuItem
                            onClick={() => onAutogradeExam(exam.id)}
                          >
                            <Bot className="h-4 w-4" />
                            Autograde
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
