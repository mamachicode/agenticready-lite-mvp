"use client";

import { useEffect } from "react";

export default function AdminGuard() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) window.location.replace("/admin/login");
  }, []);

  return null;
}
