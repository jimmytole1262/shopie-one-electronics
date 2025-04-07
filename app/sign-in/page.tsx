"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  // Return null while redirecting if already signed in
  if (isSignedIn) return null;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-orange-500 hover:bg-orange-600',
            footerActionLink: 'text-orange-500 hover:text-orange-600'
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}