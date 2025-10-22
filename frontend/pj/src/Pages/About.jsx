import { useState, useEffect } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState({
    message: "",
    mission: "",
    vision: "",
    values: [],
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("https://full-stack-hotel-booking-app-1.onrender.com/api/about", {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching data");
        setAboutData(data.data); // data.data contains AboutDTO
      } catch (err) {
        setAboutData({
          message: err.message,
          mission: "",
          vision: "",
          values: [],
        });
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
          <p className="text-gray-700 text-lg leading-relaxed">{aboutData.message}</p>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-blue-700">Our Mission</h3>
              <p className="text-gray-600 text-sm">{aboutData.mission}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="font-semibold text-blue-700">Our Vision</h3>
              <p className="text-gray-600 text-sm">{aboutData.vision}</p>
            </div>
          </div>

          {/* Values */}
          {aboutData.values.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Values</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {aboutData.values.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
