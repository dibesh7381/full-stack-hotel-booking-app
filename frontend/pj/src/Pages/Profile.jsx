import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const { user, setUser, fetchProfile, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🔹 Fetch profile if not already loaded
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        try {
          await fetchProfile();
        } catch (err) {
          console.error("❌ Error loading profile:", err);
        }
      }
    };
    loadProfile();
  }, [user, fetchProfile]);

  // 🔹 Sync profile state with context user
  useEffect(() => {
    if (user) setProfile({ name: user.name || "", email: user.email || "" });
  }, [user]);

  // ✅ Update profile function
  const updateProfile = async () => {
    if (!profile.name.trim()) return alert("Name cannot be empty");

    setUpdating(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: profile.name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating profile");

      alert("✅ Profile updated successfully");
      setPassword("");

      // Update context user immediately
      setUser(prev => ({ ...prev, name: profile.name }));
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) return <p className="text-center mt-10">Checking login...</p>;
  if (!user) return <p className="text-center mt-10">Please login to see your profile.</p>;

  // 🔹 Role-based message styles
  const roleMessage = () => {
    if (user.role === "CUSTOMER") {
      return (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center font-semibold">
          🎉 Congratulations, valued Customer!
        </div>
      );
    } else if (user.role === "SELLER") {
      return (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-4 text-center font-semibold">
          🚀 Welcome, esteemed Seller!
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

      {/* 🔹 Role-based congratulation message */}
      {roleMessage()}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={updateProfile}
          disabled={updating}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded mt-4 transition"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;

