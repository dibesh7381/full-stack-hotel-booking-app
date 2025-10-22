import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const SellerHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchSellerHistory = async () => {
      try {
        const res = await fetch(
          "https://full-stack-hotel-booking-app-1.onrender.com/api/seller/bookings/history",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching seller history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (!loading && user && user.role === "SELLER") {
      fetchSellerHistory();
    }
  }, [user, loading]);

  if (loading || loadingHistory) return <Loader />;

  if (!user)
    return (
      <p className="text-center mt-10">
        Please login to view your booking history.
      </p>
    );

  if (history.length === 0)
    return (
      <p className="text-center mt-10">No past bookings for your rooms.</p>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Room Booking History
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {history.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col transition-transform hover:scale-105"
          >
            {b.roomImage ? (
              <img
                src={b.roomImage} // ✅ change from b.imageUrl to b.roomImage
                alt="Room"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-xl mb-4 text-gray-500">
                No Image
              </div>
            )}

            <h2 className="text-xl font-semibold mb-2">
              Room Type: {b.roomType}
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">User Name:</span> {b.userName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Age:</span> {b.userAge}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Gender:</span> {b.userGender}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Booking Date:</span> {b.bookingDate}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Leaving Date:</span> {b.leavingDate}
            </p>
            <p
              className={`mt-2 font-medium ${
                b.status === "COMPLETED" ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {b.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerHistory;
