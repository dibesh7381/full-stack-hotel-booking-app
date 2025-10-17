import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    bookingDate: "",
    leavingDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // ✅ for showing message
  const [messageType, setMessageType] = useState(""); // ✅ "success" or "error"

  const today = new Date();
  const localDate = today.toLocaleDateString("en-CA");

  // 🔹 Fetch specific room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/all-rooms`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          const selectedRoom = data.data.find((r) => r.id.toString() === roomId);
          setRoom(selectedRoom);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔸 Validate date range
    if (form.bookingDate && form.leavingDate && form.leavingDate <= form.bookingDate) {
      setMessage("⚠️ Leaving date must be after booking date.");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          roomId: room.id,
          name: form.name,
          age: form.age,
          gender: form.gender,
          bookingDate: form.bookingDate,
          leavingDate: form.leavingDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Booking successful!");
        setMessageType("success");

        // optional: navigate after short delay
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setMessage(`❌ Booking failed: ${data.message}`);
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong! Please try again.");
      setMessageType("error");
    }
  };

  if (loading) return <Loader />;
  if (!room) return <p className="text-center mt-10">Room not found.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
        {/* 🔹 Room Info */}
        <div className="mb-6 border rounded-2xl overflow-hidden shadow-md">
          <img
            src={
              room.images && room.images.length > 0
                ? room.images[0]
                : "https://via.placeholder.com/400x250"
            }
            alt={room.hotelName}
            className="w-full h-56 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold">{room.hotelName}</h2>
            <p className="text-gray-600">{room.location}</p>
            <p className="text-blue-600 font-semibold mt-2">
              ₹{room.price} / night
            </p>
          </div>
        </div>

        {/* 🔹 Booking Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>

          <label>
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Booking Date
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              min={localDate}
              required
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>

          <label>
            Leaving Date
            <input
              type="date"
              name="leavingDate"
              value={form.leavingDate}
              onChange={handleChange}
              min={form.bookingDate || localDate}
              required
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </label>

          {/* 🔹 Message Box */}
          {message && (
            <div
              className={`text-center font-medium p-2 rounded-lg ${
                messageType === "success"
                  ? "text-green-600 bg-green-50 border border-green-200"
                  : "text-red-600 bg-red-50 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-2xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
