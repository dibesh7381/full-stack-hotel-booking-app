import React from "react";

const RoomCard = ({ room, onEdit, onDelete }) => {
  const imageUrl = room.images && room.images.length > 0 ? room.images[0] : null;

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={room.hotelName} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">
          No Image
        </div>
      )}
      <div className="p-4">
        <h4 className="font-bold text-lg">{room.hotelName}</h4>
        <p className="text-gray-600">{room.location}</p>
        <p className="mt-1">Type: {room.roomType}</p>
       <p>Price: ₹{room.price}</p>
        <p>Available: {room.available ? "Yes" : "No"}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(room)}
            className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
