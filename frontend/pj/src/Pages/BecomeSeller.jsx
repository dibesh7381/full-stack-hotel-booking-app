import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const BecomeSeller = () => {
  const { user, fetchProfile, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!user) await fetchProfile();
      setLoading(false);
    };
    loadUser();
  }, [user, fetchProfile]);

  const handleBecomeSeller = async () => {
    setUpdating(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/become-seller", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating role");

      alert("🎉 You are now a seller!");
      setUser(prev => ({ ...prev, role: "SELLER" }));
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddRooms = () => {
    navigate("/seller-dashboard"); // Redirect to add rooms page
  };

  if (loading) return <Loader/>
  if (!user) return <p className="text-center mt-10">Please login to access this page.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      {user.role === "SELLER" ? (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-600">🎉 Congratulations!</h2>
          <p>You are already a seller.</p>
          <button
            onClick={handleAddRooms}
            className="bg-blue-600  cursor-pointer hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Add Your Rooms
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-600">Become a Seller</h2>
          <p>Click the button below to start selling your rooms.</p>
          <button
            onClick={handleBecomeSeller}
            disabled={updating}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition"
          >
            {updating ? "Updating..." : "Become Seller"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BecomeSeller;
