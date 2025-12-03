"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = ({ brandColor = "#E55B00", secondaryColor = "#FFA040" }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user types
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password");
      }

      // Make API call to login endpoint
      const response = await fetch("http://localhost:3375/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies (refreshToken)
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      // Success - handle tokens and user data
      if (data.success && data.data) {
        // Store access token in localStorage for Authorization header
        if (data.data.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
        }

        // Store user data
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }

        // Store refresh token if returned (optional for mobile apps)
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        setSuccess("Login successful! Redirecting...");

        // Redirect based on user role after a short delay
        setTimeout(() => {
          const userRole = data.data.user?.role;
          switch (userRole) {
            case "admin":
              router.push("/dashboard");
              break;
            case "cashier":
              router.push("/dashboard");
              break;
            case "kitchenStaff":
              router.push("/dashboard");
              break;
            default:
              router.push("/dashboard");
          }
        }, 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Forgot password handler
  const handleForgotPassword = () => {
    // Implement forgot password flow
    alert("Forgot password feature coming soon!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold text-lg">
          Email
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="example@restro.com"
          className="w-full px-5 py-4 rounded-2xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-700 text-base transition"
          style={{ borderColor: "#DDD" }}
          disabled={loading}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-gray-700 font-semibold text-lg">
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-gray-500 hover:text-orange-600 transition"
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Enter your password"
          className="w-full px-5 py-4 rounded-2xl border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-700 text-base transition"
          style={{ borderColor: "#DDD" }}
          disabled={loading}
          required
          minLength="6"
          autoComplete="current-password"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-semibold text-white text-xl shadow-lg transition
          ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:opacity-90 hover:shadow-xl"
          }`}
        style={{ backgroundColor: brandColor }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing In...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
