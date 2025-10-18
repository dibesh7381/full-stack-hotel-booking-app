import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaBed, FaCalendarAlt } from "react-icons/fa";

const RoomCard = ({ room, onEdit, onDelete }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : ["https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden flex flex-col relative">
      
      {/* Image Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {images.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full snap-center">
              <img
                src={img}
                alt={`${room.hotelName} ${idx + 1}`}
                className="w-full h-56 sm:h-64 md:h-72 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left & Right Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute top-1/2 -translate-y-1/2 left-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={scrollRight}
              className="absolute top-1/2 -translate-y-1/2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-md z-10"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Room Details at Bottom Corner */}
      <div className="px-6 py-4 flex flex-col justify-end flex-1">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-800">{room.hotelName}</h4>
          <p className="text-gray-500 flex items-center mt-1">
            <FaMapMarkerAlt className="mr-1 text-blue-600" /> {room.location}
          </p>
          <p className="text-gray-600 flex items-center mt-2">
            <FaBed className="mr-1 text-gray-700" /> Room Type: {room.roomType}
          </p>
          <p className="text-lg font-bold text-blue-600 mt-2 flex items-center">
            <FaCalendarAlt className="mr-1" /> ₹{room.price.toLocaleString("en-IN")}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
              room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {room.available ? "Available" : "Not Available"}
          </span>
        </div>

        {/* Action Buttons aligned at bottom */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 cursor-pointer bg-yellow-500 px-4 py-2 rounded-2xl text-white font-semibold hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="flex-1 cursor-pointer bg-red-500 px-4 py-2 rounded-2xl text-white font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;


