import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import BecomeSeller from "./Pages/BecomeSeller";
import SellerDashboard from "./components/SellerDashboard";

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
        <Route path="/seller-dashboard" element={<SellerDashboard />} /> {/* ✅ Seller Dashboard */}
      </Routes>
    </>
  );
}

export default App;

