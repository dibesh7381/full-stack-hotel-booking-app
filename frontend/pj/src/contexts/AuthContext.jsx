import { createContext, useState, useEffect } from "react";

// ✅ Create Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// ✅ Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/auth/profile", {
        credentials: "include", // send cookies
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data.data); // assuming { data: { id, name, email } }
      return data.data;
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Fetch and set profile after login
      await fetchProfile();
      return data;
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("❌ Error logging out:", err);
    } finally {
      setUser(null);
    }
  };

  // ✅ Context value
  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

