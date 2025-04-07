import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <SignUp appearance={{
        elements: {
          formButtonPrimary: 'bg-orange-500 hover:bg-orange-600',
          footerActionLink: 'text-orange-500 hover:text-orange-600'
        }
      }} />
    </div>
  );
}