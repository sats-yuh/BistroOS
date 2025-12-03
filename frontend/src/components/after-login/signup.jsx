"use client";

import { useState } from "react";

const SignUp = ({ setIsRegister, brandColor = "#E55B00" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "cashier", // default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up Data:", formData);
    alert("Sign-up simulated!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "cashier",
    });
    if (setIsRegister) setIsRegister(false);
  };

  const roles = ["Cashier", "Kitchen", "Admin"]; // updated roles

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
      {/* Name */}
      <div>
        <label className="block text-gray-600 mb-2 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-600 mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter employee email"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-600 mb-2 font-medium">Phone</label>
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter employee phone"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-600 mb-2 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-gray-600 mb-2 font-medium">
          Select Role
        </label>
        <div className="flex gap-4">
          {roles.map((role) => {
            const isSelected = formData.role === role.toLowerCase();
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelection(role.toLowerCase())}
                className={`flex-1 py-3 rounded-xl font-semibold text-lg border transition 
                  ${isSelected ? "text-white" : "text-gray-700"} 
                  hover:bg-orange-200 hover:text-white`}
                style={{
                  backgroundColor: isSelected
                    ? "rgba(229, 92, 0, 0.39)"
                    : "#fff",
                }}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-white text-lg"
        style={{ backgroundColor: brandColor }}
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
