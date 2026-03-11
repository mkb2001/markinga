import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            cardBox: "shadow-md",
          },
        }}
        fallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
