import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-teal-500 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-teal-500/30 mb-4">
          HB
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join HealthBridge</h1>
        <p className="text-gray-500 mt-2">Create your secure healthcare account</p>
      </div>
      
      <SignUp 
        routing="path" 
        path="/sign-up" 
        appearance={{
          elements: {
            formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-sm normal-case",
            socialButtonsBlockButton: "border-gray-200 dark:border-zinc-700",
            card: "shadow-xl border border-gray-100 dark:border-zinc-800 rounded-2xl",
          }
        }}
      />
    </div>
  );
}
