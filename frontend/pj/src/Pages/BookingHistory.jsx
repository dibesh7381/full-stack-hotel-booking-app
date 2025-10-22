import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const BookingHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [archivedBookings, setArchivedBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchArchivedBookings = async () => {
      try {
        const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/bookings/archive", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setArchivedBookings(data.data);
        } else {
          console.error("Failed to fetch archived bookings:", data.message);
        }
      } catch (err) {
        console.error("Error fetching archived bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (!loading && user) fetchArchivedBookings();
  }, [user, loading]);

  if (loading || loadingBookings) return <Loader />;
  if (!user) return <p className="text-center mt-10">Please login to view your booking history.</p>;
  if (archivedBookings.length === 0)
    return <p className="text-center mt-10">You have no past bookings.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking History</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {archivedBookings.map((booking) => {
          const status = booking.status || "ARCHIVED";
          const statusStyle =
            status === "CANCELLED"
              ? "bg-red-100 text-red-700"
              : status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700";

          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-200"
            >
              <img
                src={booking.imageUrl || "https://via.placeholder.com/400x250"}
                alt={booking.hotelName || "Hotel Image"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{booking.hotelName || "Hotel Name"}</h2>
                  <p className="text-gray-600">{booking.location || "Location not available"}</p>
                  <p className="text-gray-700 mt-1">Room Type: {booking.roomType || "N/A"}</p>
                  <p className="text-blue-600 font-semibold mt-1">₹{booking.price || "N/A"} / night</p>
                  <p className="text-gray-800 mt-2">
                    Booking Date:{" "}
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-800">
                    Leaving Date:{" "}
                    {booking.leavingDate
                      ? new Date(booking.leavingDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* 🔹 Status Badge */}
                <span
                  className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold self-start ${statusStyle}`}
                >
                  {status === "CANCELLED" ? "❌ Cancelled" : "✅ Completed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;
