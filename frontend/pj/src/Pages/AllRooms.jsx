import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // 👈 user ke role ke liye
  const isSeller = user?.role === "SELLER";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/all-rooms", {
          credentials: "include", // cookie se token send hoga
        });
        const data = await res.json();
        if (data.success) {
          setRooms(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
        Available Rooms
      </h1>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No rooms available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col"
            >
              <img
                src={
                  room.images && room.images.length > 0
                    ? room.images[0]
                    : "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={room.hotelName}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h2 className="text-xl font-semibold text-gray-800">
                {room.hotelName}
              </h2>
              <p className="text-gray-500">{room.location}</p>
              <p className="text-gray-600 capitalize mt-1">
                Room Type: {room.roomType}
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                Price:{" "}
                <span className="text-blue-600 font-bold">
                  ₹{room.price.toLocaleString("en-IN")}
                </span>{" "}
                / day
              </p>

              <p
                className={`mt-1 font-medium ${
                  room.available ? "text-green-600" : "text-red-500"
                }`}
              >
                {room.available ? "Available" : "Not Available"}
              </p>

              <button
                className={`mt-3 font-semibold py-2 px-4 rounded-xl transition-colors ${
                  isSeller
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isSeller}
                onClick={() =>
                  !isSeller && alert(`Booking room: ${room.hotelName}`)
                }
              >
                {isSeller ? "Book Now" : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRooms;

