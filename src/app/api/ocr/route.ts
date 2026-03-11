import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { processOcr } from "@/lib/ocr/processor";

const BUCKET_NAME = "submissions";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let submissionId: string | undefined;

  try {
    const body = await request.json();
    submissionId = body.submissionId;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        exam: { userId },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update status to processing
    await prisma.submission.update({
      where: { id: submissionId },
      data: { ocrStatus: "PROCESSING", status: "OCR_PROCESSING" },
    });

    // Use service role client to download from Supabase Storage
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Extract the storage path from the public URL
    const urlParts = submission.fileUrl.split(`/${BUCKET_NAME}/`);
    const storagePath = urlParts[1];

    const { data: fileData, error: downloadError } = await serviceClient.storage
      .from(BUCKET_NAME)
      .download(storagePath);

    if (downloadError || !fileData) {
      throw new Error(
        `Failed to download file: ${downloadError?.message || "Unknown error"}`
      );
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { text, confidence } = await processOcr(buffer);

    // Update submission with OCR results
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        ocrText: text,
        ocrConfidence: confidence,
        ocrStatus: "COMPLETED",
        status: "READY",
      },
    });

    return NextResponse.json({ text, confidence });
  } catch (error) {
    console.error("OCR error:", error);

    // Mark OCR as failed
    if (submissionId) {
      await prisma.submission
        .update({
          where: { id: submissionId },
          data: { ocrStatus: "FAILED" },
        })
        .catch(() => {});
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "OCR failed" },
      { status: 500 }
    );
  }
}
