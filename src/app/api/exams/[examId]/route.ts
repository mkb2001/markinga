import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { examSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ examId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;

  try {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
      include: {
        questions: { orderBy: { questionNumber: "asc" } },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { questions: true, submissions: true, rubrics: true },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;

  try {
    const body = await request.json();
    const parsed = examSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.updateMany({
      where: { id: examId, userId },
      data: parsed.data,
    });

    if (exam.count === 0) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const updated = await prisma.exam.findUnique({ where: { id: examId } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;

  try {
    const result = await prisma.exam.deleteMany({
      where: { id: examId, userId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}
