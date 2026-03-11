import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  // Ensure profile exists
  let profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: userId,
        email: user?.emailAddresses[0]?.emailAddress ?? "",
        fullName:
          user?.fullName ||
          user?.firstName ||
          user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
          "User",
      },
    });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userEmail={profile.email} userName={profile.fullName} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
