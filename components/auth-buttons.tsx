"use client";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { isSignedIn } = useUser();
  
  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }
  
  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
      </SignUpButton>
    </div>
  );
}
