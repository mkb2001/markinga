import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { questionSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ examId: string; questionId: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId, questionId } = await params;

  try {
    // Verify exam belongs to user
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = questionSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const question = await prisma.question.updateMany({
      where: { id: questionId, examId },
      data: parsed.data,
    });

    if (question.count === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const updated = await prisma.question.findUnique({ where: { id: questionId } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId, questionId } = await params;

  try {
    // Verify exam belongs to user
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const result = await prisma.question.deleteMany({
      where: { id: questionId, examId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
