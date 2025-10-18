import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import {
  FaMapMarkerAlt,
  FaBed,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const isSeller = user?.role === "SELLER";
  const carouselRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/all-rooms", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setRooms(data.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    const fetchUserBookings = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:8080/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setUserBookings(data.data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      }
    };

    Promise.all([fetchRooms(), fetchUserBookings()]).finally(() => setLoading(false));
  }, [user]);

  const scrollLeft = (id) => {
    if (!carouselRefs.current[id]) return;
    carouselRefs.current[id].scrollBy({
      left: -carouselRefs.current[id].offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = (id) => {
    if (!carouselRefs.current[id]) return;
    carouselRefs.current[id].scrollBy({
      left: carouselRefs.current[id].offsetWidth,
      behavior: "smooth",
    });
  };

  const hasBookedRoom = (roomId) => {
    return userBookings.some((booking) => booking.roomId === roomId);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Available Rooms
      </h1>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No rooms available.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const alreadyBooked = hasBookedRoom(room.id);

            return (
              <div
                key={room.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden flex flex-col relative"
              >
                <div className="relative">
                  <div
                    ref={(el) => (carouselRefs.current[room.id] = el)}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                  >
                    {(room.images && room.images.length > 0
                      ? room.images
                      : ["https://via.placeholder.com/600x400?text=No+Image"]
                    ).map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 w-full snap-center">
                        <img
                          src={img}
                          alt={`${room.hotelName} ${idx + 1}`}
                          className="w-full h-56 sm:h-64 md:h-72 object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {room.images && room.images.length > 1 && (
                    <>
                      <button
                        onClick={() => scrollLeft(room.id)}
                        className="absolute top-1/2 cursor-pointer -translate-y-1/2 left-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md z-10"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => scrollRight(room.id)}
                        className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md z-10"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>

                <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl mt-2 font-semibold text-gray-800">
                      {room.hotelName}
                    </h2>
                    <p className="text-gray-500 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1 text-blue-600" /> {room.location}
                    </p>
                    <p className="text-gray-600 flex items-center mt-2">
                      <FaBed className="mr-1 text-gray-700" /> Room Type: {room.roomType}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2 flex items-center">
                      <FaCalendarAlt className="mr-1" /> ₹{room.price.toLocaleString("en-IN")} / day
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                        room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.available ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <button
                    className={`mt-4 w-full cursor-pointer py-3 rounded-2xl font-semibold transition-colors ${
                      isSeller || alreadyBooked || !room.available
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isSeller || alreadyBooked || !room.available}
                    onClick={() => !isSeller && !alreadyBooked && room.available && navigate(`/booking-form/${room.id}`)}
                  >
                    {alreadyBooked
                      ? "You already booked"
                      : room.available
                      ? "Book Now"
                      : "Not Available"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllRooms;
