import { useState, useEffect } from "react";

const About = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/about", {
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
    fetchAbout();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
          <h1 className="text-3xl font-bold">About HotelApp</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>

          {/* Optional: Add some cards / highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-blue-700">Our Mission</h3>
              <p className="text-gray-600 text-sm">
                Providing the best hotel booking experience with simplicity and trust.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-blue-700">Our Vision</h3>
              <p className="text-gray-600 text-sm">
                To be the most reliable platform for travelers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
