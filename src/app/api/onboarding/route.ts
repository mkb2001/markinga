import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { InstitutionType } from "@/types/database";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { institutionType, institutionName } = body as {
    institutionType: InstitutionType;
    institutionName?: string;
  };

  if (!institutionType) {
    return NextResponse.json(
      { error: "institutionType is required" },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.upsert({
    where: { id: userId },
    update: {
      institutionType,
      institutionName: institutionName || null,
      onboardingComplete: true,
    },
    create: {
      id: userId,
      email: "",
      fullName: "",
      institutionType,
      institutionName: institutionName || null,
      onboardingComplete: true,
      tourComplete: false,
      role: "TEACHER",
    },
  });

  return NextResponse.json({ profile });
}
