import SignUpForm from "../SignUpForm";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen">
        {/* Background Image */}
        <Image
          src="/home.jpg"
          alt="Restaurant"
          fill
          className="object-cover"
          priority
        />

        {/* Logo on Top-Left */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/logo.png"
            alt="BISTROOS Logo"
            width={200}
            height={200}
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Register as a new employee</p>
          </div>
          <SignUpForm />
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-orange-600 font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
