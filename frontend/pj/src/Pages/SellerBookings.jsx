import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const SellerBookings = () => {
  const { user, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchSellerBookings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/seller/bookings", {
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

  if (!user) return <p className="text-center mt-10">Please login to view bookings.</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-10">No bookings yet for your rooms.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Bookings for Your Rooms</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((b) => (
          <div key={b.bookingId} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Room Type: {b.roomType}</h2>
            <p className="text-gray-700"><span className="font-medium">User Name:</span> {b.userName}</p>
            <p className="text-gray-700"><span className="font-medium">Age:</span> {b.userAge}</p>
            <p className="text-gray-700"><span className="font-medium">Gender:</span> {b.userGender}</p>
            <p className="text-gray-700 mt-2"><span className="font-medium">Booking Date:</span> {b.bookingDate}</p>
            <p className="text-gray-700"><span className="font-medium">Leaving Date:</span> {b.leavingDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerBookings;
