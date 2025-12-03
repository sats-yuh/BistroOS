"use client";
import React, { useState } from "react";

const Login = ({
  onLogin,
  brandColor = "#E55B00",
  secondaryColor = "#FFA040",
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "cashier",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      {/* Role Selection */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold text-lg">
          Login as
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-5 py-4 rounded-2xl border bg-white shadow-md focus:outline-none text-gray-700 text-base"
          style={{ borderColor: secondaryColor }}
        >
          <option value="cashier">Cashier</option>
          <option value="kitchenStaff">Kitchen Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

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
          className="w-full px-5 py-4 rounded-2xl border bg-white shadow-md focus:outline-none text-gray-700 text-base"
          style={{ borderColor: "#DDD" }}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-semibold text-lg">
          Password
        </label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Enter your password"
          className="w-full px-5 py-4 rounded-2xl border bg-white shadow-md focus:outline-none text-gray-700 text-base"
          style={{ borderColor: "#DDD" }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl font-semibold text-white text-xl shadow-lg transition hover:opacity-90"
        style={{ backgroundColor: brandColor }}
      >
        Sign In
      </button>
    </form>
  );
};

export default Login;
