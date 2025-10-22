import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const MyBookings = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();

  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "error" });
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setBookings(data.data);
        else console.error(data.message);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (!loading && user) fetchBookings();
  }, [user, loading]);

  const handleCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setModal({
      open: true,
      title: "Confirm Cancel",
      message: "Are you sure you want to cancel this booking?",
      type: "error",
    });
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      const res = await fetch(`https://full-stack-hotel-booking-app-1.onrender.com/api/bookings/${bookingToCancel}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingToCancel));
      } else {
        alert("Failed to cancel booking: " + data.message);
      }
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("Something went wrong while canceling booking.");
    } finally {
      setModal({ ...modal, open: false });
      setBookingToCancel(null);
    }
  };

  if (loading || loadingBookings) return <Loader />;
  if (!user) return <p className="text-center mt-10 text-gray-700">Please login to view your bookings.</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Header + View History Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex-1 text-center sm:text-left">
          My Bookings
        </h1>
        <button
          onClick={() => navigate("/booking-history")}
          className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          View Booking History
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center mt-10 text-gray-700">
          <p>You have no active bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 hover:shadow-xl">
              <img
                src={booking.imageUrl || "https://via.placeholder.com/400x250"}
                alt={booking.hotelName || "Hotel Image"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{booking.hotelName || "Hotel Name"}</h2>
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
                  onClick={() => handleCancelBooking(booking.id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium transition"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={confirmCancelBooking}
      />
    </div>
  );
};

export default MyBookings;

