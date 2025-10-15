import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import RoomCard from "./RoomCard.jsx";
import Loader from "./Loader.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

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
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "success" });
  const [roomToDelete, setRoomToDelete] = useState(null); // 🔹 Track room for deletion

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
      if (key === "images") value.forEach((file) => { if (file instanceof File) dataForm.append("images", file); });
      else dataForm.append(key, value);
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

  // ----------------- ADD / UPDATE -----------------
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (formData.images.some((img) => !img)) {
      setModal({ open: true, title: "Upload Error", message: "Please upload all 5 images before submitting.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const data = await handleRoomAPI("POST");
      if (data?.success) {
        setFormData({ hotelName: "", location: "", roomType: "", price: "", available: true, images: [null, null, null, null, null] });
        fetchRooms();
        setModal({ open: true, title: "Room Added", message: "Room added successfully!", type: "success" });
      } else setModal({ open: true, title: "Add Failed", message: data?.message || "Failed to add room.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (formData.images.some((img) => !img)) {
      setModal({ open: true, title: "Upload Error", message: "Please upload all 5 images before updating.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const data = await handleRoomAPI("PUT", editingRoomId);
      if (data?.success) {
        setFormData({ hotelName: "", location: "", roomType: "", price: "", available: true, images: [null, null, null, null, null] });
        setEditingRoomId(null);
        fetchRooms();
        setModal({ open: true, title: "Room Updated", message: "Room updated successfully!", type: "success" });
      } else setModal({ open: true, title: "Update Failed", message: data?.message || "Failed to update room.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (room) => {
    const existingImages = room.images && room.images.length > 0 ? [...room.images] : [];
    while (existingImages.length < 5) existingImages.push(null);

    setFormData({
      hotelName: room.hotelName,
      location: room.location,
      roomType: room.roomType,
      price: room.price,
      available: room.available,
      images: existingImages,
    });
    setEditingRoomId(room.id);
  };

  // 🔹 Open modal for delete confirmation
  const handleDelete = (id) => {
    setRoomToDelete(id);
    setModal({
      open: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this room?",
      type: "error",
    });
  };

  // 🔹 Confirm deletion
  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setSubmitting(true);
    setModal({ ...modal, open: false });
    try {
      const data = await deleteRoomAPI(roomToDelete);
      if (data?.success) fetchRooms();
    } finally {
      setSubmitting(false);
      setRoomToDelete(null);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "SELLER") fetchRooms();
  }, [loading, user]);

  if (loading) return <Loader />;
  if (!user || user.role !== "SELLER") return <p>Access denied</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      {submitting && <Loader />}

      <h2 className="text-2xl font-bold mb-4 text-center">Seller Dashboard</h2>

      {/* ---------------- FORM ---------------- */}
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
          {formData.images.map((file, idx) => (
            <label key={idx} className="w-full h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition relative">
              {file ? (
                <img
                  src={file instanceof File ? URL.createObjectURL(file) : file}
                  alt={`Room ${idx + 1}`}
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <span className="text-gray-400">+ Image {idx + 1}</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, idx)} />
            </label>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingRoomId ? "Update Room" : "Add Room"}
        </button>
      </form>

      {/* ---------------- ROOMS GRID ---------------- */}
      <h3 className="text-xl font-semibold mb-2">Your Rooms</h3>
      {rooms.length === 0 && <p>No rooms added yet.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* ---------------- CONFIRM MODAL ---------------- */}
      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false, title: "", message: "" })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={confirmDelete} // 🔹 Only called when user clicks OK
      />
    </div>
  );
};

export default SellerDashboard;
