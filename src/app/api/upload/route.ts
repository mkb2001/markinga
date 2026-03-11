import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = "submissions";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const examId = formData.get("examId") as string | null;

    if (!file || !examId) {
      return NextResponse.json(
        { error: "File and examId are required" },
        { status: 400 }
      );
    }

    // Verify the exam belongs to the user
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Use service role client for storage upload
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const storagePath = `${userId}/${examId}/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await serviceClient.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = serviceClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

    const fileType =
      ext === "pdf" ? "PDF" : ext === "images" ? "IMAGES" : "IMAGE";

    // Get next submission number for this exam
    const lastSubmission = await prisma.submission.findFirst({
      where: { examId },
      orderBy: { submissionNumber: "desc" },
      select: { submissionNumber: true },
    });
    const submissionNumber = (lastSubmission?.submissionNumber ?? 0) + 1;

    const submission = await prisma.submission.create({
      data: {
        examId,
        fileUrl: publicUrl,
        fileType: fileType as "PDF" | "IMAGE" | "IMAGES",
        originalFilename: file.name,
        ocrStatus: "PENDING",
        status: "UPLOADED",
        submissionNumber,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
