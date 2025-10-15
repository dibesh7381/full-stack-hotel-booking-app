import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import RoomCard from "./RoomCard.jsx";

const SellerDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    hotelName: "",
    location: "",
    roomType: "",
    price: "",
    available: true,
    images: [null, null, null, null, null],
  });
  const [editingRoomId, setEditingRoomId] = useState(null);

  // ----------------- API FUNCTIONS -----------------
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/rooms", { credentials: "include" });
      const data = await res.json();
      if (data.success) setRooms(data.data);
    } catch (err) {
      console.error("Fetch Rooms Error:", err);
    }
  };

  const handleRoomAPI = async (method, id = "") => {
    const dataForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => file && dataForm.append("images", file));
      } else {
        dataForm.append(key, value);
      }
    });

    const res = await fetch(`http://localhost:8080/api/rooms${id ? `/${id}` : ""}`, {
      method,
      credentials: "include",
      body: dataForm,
    });
    return await res.json();
  };

  const deleteRoomAPI = async (id) => {
    const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  };

  // ----------------- HANDLERS -----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const data = await handleRoomAPI("POST");
    if (data?.success) {
      setFormData({ hotelName: "", location: "", roomType: "", price: "", available: true, images: [null, null, null, null, null] });
      fetchRooms();
    } else console.error("Add Room Failed:", data?.message);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    const data = await handleRoomAPI("PUT", editingRoomId);
    if (data?.success) {
      setFormData({ hotelName: "", location: "", roomType: "", price: "", available: true, images: [null, null, null, null, null] });
      setEditingRoomId(null);
      fetchRooms();
    } else console.error("Update Room Failed:", data?.message);
  };

  const handleEdit = (room) => {
    setFormData({
      hotelName: room.hotelName,
      location: room.location,
      roomType: room.roomType,
      price: room.price,
      available: room.available,
      images: [null, null, null, null, null],
    });
    setEditingRoomId(room.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this room?")) return;
    const data = await deleteRoomAPI(id);
    if (data?.success) fetchRooms();
  };

  useEffect(() => {
    if (!loading && user?.role === "SELLER") fetchRooms();
  }, [loading, user]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "SELLER") return <p>Access denied</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller Dashboard</h2>

      {/* ------------- FORM ------------- */}
      <form onSubmit={editingRoomId ? handleUpdateRoom : handleAddRoom} className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">{editingRoomId ? "Edit Room" : "Add Room"}</h3>
        <input type="text" name="hotelName" value={formData.hotelName} onChange={handleChange} placeholder="Hotel Name" required className="border p-2 w-full mb-2 rounded" />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="border p-2 w-full mb-2 rounded" />
        <select name="roomType" value={formData.roomType} onChange={handleChange} required className="border p-2 w-full mb-2 rounded">
          <option value="">Select Room Type</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
          <option value="Family">Family</option>
        </select>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="border p-2 w-full mb-2 rounded" />
        <label className="flex items-center mb-2">
          <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="mr-2" /> Available
        </label>

        {/* ------------- IMAGE UPLOADS ------------- */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
          {formData.images.map((file, idx) => (
            <label key={idx} className="w-full h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
              {file ? (
                <img src={URL.createObjectURL(file)} alt={`Room ${idx + 1}`} className="object-cover w-full h-full rounded" />
              ) : (
                <span className="text-gray-400">+ Image {idx + 1}</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, idx)} />
            </label>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingRoomId ? "Update Room" : "Add Room"}</button>
      </form>

      {/* ------------- ROOMS GRID ------------- */}
      <h3 className="text-xl font-semibold mb-2">Your Rooms</h3>
      {rooms.length === 0 && <p>No rooms added yet.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
