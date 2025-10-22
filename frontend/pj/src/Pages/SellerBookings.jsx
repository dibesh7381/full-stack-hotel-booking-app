import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const SellerBookings = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerBookings = async () => {
      try {
        const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/seller/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching seller bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (!loading && user && user.role === "SELLER") {
      fetchSellerBookings();
    }
  }, [user, loading]);

  if (loading || loadingBookings) return <Loader />;

  if (!user) return <p className="text-center mt-10 text-gray-700">Please login to view bookings.</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-10 text-gray-700">No bookings yet for your rooms.</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Header + History Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left text-gray-800 flex-1">
          Bookings for Your Rooms
        </h1>
        <button
          onClick={() => navigate("/seller/history")}
          className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          View History
        </button>
      </div>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b.bookingId}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 hover:shadow-xl"
          >
            {/* Room Image */}
            {b.roomImage ? (
              <img
                src={b.roomImage}
                alt="Room"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Room Type: {b.roomType}</h2>
              <p className="text-gray-700"><span className="font-medium">User Name:</span> {b.userName}</p>
              <p className="text-gray-700"><span className="font-medium">Age:</span> {b.userAge}</p>
              <p className="text-gray-700"><span className="font-medium">Gender:</span> {b.userGender}</p>
              <p className="text-gray-700 mt-2"><span className="font-medium">Booking Date:</span> {b.bookingDate}</p>
              <p className="text-gray-700"><span className="font-medium">Leaving Date:</span> {b.leavingDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerBookings;
