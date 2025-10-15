import { useState, useEffect } from "react";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/home", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching data");
        setMessage(data.message);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchHome();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6">
          <h1 className="text-3xl font-bold">Welcome to HotelApp</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>

          {/* Optional: Quick Highlights / Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-green-700">Easy Booking</h3>
              <p className="text-gray-600 text-sm">
                Find and book your favorite hotels in just a few clicks.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-green-700">Trusted Hotels</h3>
              <p className="text-gray-600 text-sm">
                We partner with top-rated hotels to ensure quality stays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


