import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import BecomeSeller from "./Pages/BecomeSeller";
import SellerDashboard from "./components/SellerDashboard";
import AllRooms from "./Pages/AllRooms"; 
import BookingForm from "./components/BookingForm";
import MyBookings from "./Pages/MyBookings";
import SellerBookings from "./Pages/SellerBookings"; // 🔹 Import SellerBookings
import BookingHistory from "./Pages/BookingHistory"; // 🔹 Import BookingHistory
import SellerHistory from "./Pages/SellerHistory";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/all-rooms" element={<AllRooms />} /> 
        <Route path="/booking-form/:roomId" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/seller-bookings" element={<SellerBookings />} /> {/* 🔹 Seller bookings route */}
        <Route path="/booking-history" element={<BookingHistory />} /> {/* 🔹 Booking history route */}
        <Route path="/seller/history" element={<SellerHistory />} />
      </Routes>
    </>
  );
}

export default App;


