"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "cashier",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleRoleSelection = (selectedRole) => {
    const roleMap = {
      kitchen: "kitchenStaff",
    };
    setFormData({ ...formData, role: roleMap[selectedRole] || selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_DEV}/users/signUp`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);

      // Axios error message handling
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { display: "Cashier", value: "cashier" },
    { display: "Kitchen Staff", value: "kitchen" },
    { display: "Admin", value: "admin" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="employee@restro.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone number"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 6 characters"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          required
          disabled={loading}
          minLength="6"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Role</label>
        <div className="flex gap-3">
          {roles.map((role) => {
            const isSelected =
              formData.role ===
              (role.value === "kitchen" ? "kitchenStaff" : role.value);
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleSelection(role.value)}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium border transition
                  ${
                    isSelected
                      ? "bg-orange-100 text-orange-600 border-orange-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {role.display}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition
          ${
            loading
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
