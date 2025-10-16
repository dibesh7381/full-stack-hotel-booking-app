import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const MyBookings = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (!loading && user) {
      fetchBookings();
    }
  }, [user, loading]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        // Remove the canceled booking from state
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      } else {
        alert("Failed to cancel booking: " + data.message);
      }
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("Something went wrong while canceling booking.");
    }
  };

  if (loading || loadingBookings) return <Loader />;

  if (!user) return <p className="text-center mt-10">Please login to view your bookings.</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-10">You have not booked any rooms yet.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            <img
              src={booking.imageUrl || "https://via.placeholder.com/400x250"}
              alt={booking.hotelName || "Hotel Image"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h2 className="text-xl font-semibold">{booking.hotelName || "Hotel Name"}</h2>
              <p className="text-gray-600">{booking.location || "Location not available"}</p>
              <p className="text-gray-700 mt-1">Room Type: {booking.roomType || "N/A"}</p>
              <p className="text-blue-600 font-semibold mt-1">₹{booking.price || "N/A"} / night</p>
              <p className="text-gray-800 mt-2">
                Booking Date: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-800">
                Leaving Date: {booking.leavingDate ? new Date(booking.leavingDate).toLocaleDateString() : "N/A"}
              </p>
              <button
                onClick={() => cancelBooking(booking.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
