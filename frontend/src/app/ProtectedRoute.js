// components/ProtectedRoute.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      if (allowedRoles.length > 0) {
        const userRole = getUserRole();
        if (!allowedRoles.includes(userRole)) {
          router.push("/unauthorized");
        }
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (!isAuthenticated()) {
    return null; // or a loading spinner
  }

  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      return null; // or an unauthorized message
    }
  }

  return children;
};

export default ProtectedRoute;
