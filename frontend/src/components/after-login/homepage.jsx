"use client";

import React, { useState } from "react";
import Image from "next/image";

import Login from "./login";
import Register from "./signup";

const HomePage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = (data) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 h-96 md:h-auto relative">
        <Image
          src="/home.jpg"
          alt="Restaurant Dish"
          fill
          className="object-cover"
          priority
        />

        {/* Logo on top-left */}
        <div className="absolute top-4 left-4 flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-12">
          <h2
            className="text-4xl font-bold text-center mb-4 tracking-wide"
            style={{ color: "#E55B00" }}
          >
            {isRegister ? "Employee Registration" : "Employee Login"}
          </h2>

          <p className="text-center text-gray-500 mb-8">
            {isRegister
              ? "Create an employee account to access the POS."
              : "Enter your credentials to access the POS."}
          </p>

          {/* Login/Register Toggle */}
          {isRegister ? (
            <Register setIsRegister={setIsRegister} />
          ) : (
            <Login
              onLogin={handleLogin}
              brandColor="#E55B00"
              secondaryColor="#FFA040"
            />
          )}

          <div className="flex justify-center mt-8">
            <p className="text-sm text-gray-500">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="font-semibold hover:opacity-80 transition"
                style={{ color: "#FFA040" }}
              >
                {isRegister ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
