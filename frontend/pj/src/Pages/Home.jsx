import { useState, useEffect } from "react";

const Home = () => {
  const [homeData, setHomeData] = useState({
    welcomeMessage: "",
    tagline: "",
    highlights: [],
    featuredDestinations: [],
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/home", {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching data");
        setHomeData(data.data); // data.data contains HomeDTO
      } catch (err) {
        setHomeData({
          welcomeMessage: err.message,
          tagline: "",
          highlights: [],
          featuredDestinations: [],
        });
      }
    };

    fetchHome();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6">
          <h1 className="text-3xl font-bold">{homeData.welcomeMessage}</h1>
          {homeData.tagline && (
            <p className="mt-2 text-lg">{homeData.tagline}</p>
          )}
        </div>

        {/* Highlights */}
        {homeData.highlights.length > 0 && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {homeData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <p className="text-gray-700 text-sm">{highlight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Featured Destinations */}
        {homeData.featuredDestinations.length > 0 && (
          <div className="p-6 mt-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Featured Destinations
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {homeData.featuredDestinations.map((destination, index) => (
                <li key={index}>{destination}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
