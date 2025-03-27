"use client"

import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left column - Login form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <h1 className="mb-8 text-3xl font-medium text-teal-600 text-center">FoodSync</h1>

          {/* Sign in heading */}
          <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-gray-600">Please login to continue to your account.</p>

          {/* Google Sign in button */}
          <div className="mt-8">
            <button
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
              // TODO: Implement Firebase Google authentication
              // Add onClick handler to trigger Firebase Google sign-in
              // Example: onClick={signInWithGoogle}
            >
              <Image src="/google-logo.svg" alt="Google logo" width={20} height={20} className="mr-2" />
              Sign in with Google
            </button>
          </div>

          {/* Create account link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-gray-900 underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right column - Image */}
      <div className="hidden md:block md:w-1/2">
        <Image
          src="/children-eating.jpg"
          alt="Children enjoying food"
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  )
}

