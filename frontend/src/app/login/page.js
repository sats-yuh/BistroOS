import LoginForm from "../LoginForm";
import Image from "next/image";

export default function LoginPage() {
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
          <div className="flex items-center">
            <div className="w-auto">
              <Image
                src="/logo.png"
                alt="BISTROOS Logo"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          <LoginForm />
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-orange-600 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
