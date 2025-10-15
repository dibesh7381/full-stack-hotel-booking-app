import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";

const Profile = () => {
  const { user, setUser, fetchProfile, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "", image: null });
  const [imageFile, setImageFile] = useState(null);
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });

  useEffect(() => {
    if (!user) fetchProfile();
    else setProfile(user);
  }, [user, fetchProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      if (password.trim()) formData.append("password", password);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update profile");

      const updatedUser = data.data;
      const updatedImage = updatedUser.image ? `${updatedUser.image}?v=${Date.now()}` : null;

      setUser((prev) => ({ ...prev, name: updatedUser.name, image: updatedImage }));
      setProfile((prev) => ({ ...prev, name: updatedUser.name, image: updatedImage }));
      setPassword("");
      setImageFile(null);

      setModal({ open: true, title: "Profile Updated", message: "Your profile was updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setModal({ open: true, title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const renderProfileImage = () => {
    const displayImage = profile.image ? profile.image : null;

    if (displayImage) {
      return (
        <img
          key={displayImage}
          src={displayImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
        />
      );
    }

    const initial = profile.name?.charAt(0).toUpperCase() || "?";
    return (
      <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
        {initial}
      </div>
    );
  };

  if (authLoading) return <Loader />;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg relative">
      {updating && <Loader />}
      
      <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>

      <div className="flex flex-col items-center space-y-3 mb-4">
        {renderProfileImage()}
        <label className="cursor-pointer text-blue-600 hover:underline">
          Change Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email || ""}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
        >
          Update Profile
        </button>
      </form>

      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default Profile;
