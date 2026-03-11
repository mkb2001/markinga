"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExamSchema } from "@/lib/validations";

const EXAMS_KEY = ["exams"] as const;

async function fetchExams() {
  const res = await fetch("/api/exams");
  if (!res.ok) throw new Error("Failed to fetch exams");
  return res.json();
}

async function fetchExam(id: string) {
  const res = await fetch(`/api/exams/${id}`);
  if (!res.ok) throw new Error("Failed to fetch exam");
  return res.json();
}

async function createExam(data: ExamSchema) {
  const res = await fetch("/api/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create exam");
  }
  return res.json();
}

async function updateExam({ id, data }: { id: string; data: Partial<ExamSchema> }) {
  const res = await fetch(`/api/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update exam");
  }
  return res.json();
}

async function deleteExam(id: string) {
  const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete exam");
  }
  return res.json();
}

export function useExams() {
  return useQuery({ queryKey: EXAMS_KEY, queryFn: fetchExams });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: [...EXAMS_KEY, id],
    queryFn: () => fetchExam(id),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExam,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, id] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
    },
  });
}
