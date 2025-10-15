import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <nav className="bg-blue-600 text-white fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold tracking-wide">
              <Link to="/" className="hover:text-gray-200 transition">
                HotelApp
              </Link>
            </div>

            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="hover:text-gray-200 transition">
                Home
              </Link>
              <Link to="/about" className="hover:text-gray-200 transition">
                About
              </Link>

              {!loading && user && (
                <Link to="/all-rooms" className="hover:text-gray-200 transition">
                  All Rooms
                </Link>
              )}

              {!loading && !user && (
                <>
                  <Link to="/signup" className="hover:text-gray-200 transition">
                    Sign Up
                  </Link>
                  <Link to="/login" className="hover:text-gray-200 transition">
                    Login
                  </Link>
                </>
              )}

              {!loading && user && (
                <>
                  <Link to="/profile" className="hover:text-gray-200 transition">
                    Profile
                  </Link>

                  {user.role === "SELLER" && (
                    <Link
                      to="/seller-dashboard"
                      className="hover:text-gray-200 transition"
                    >
                      Seller Dashboard
                    </Link>
                  )}

                  <Link
                    to="/become-seller"
                    className="hover:text-gray-200 transition"
                  >
                    Become Seller
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md font-medium transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none z-50 relative"
              >
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-5 right-0 h-full w-64 bg-blue-700 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="flex flex-col mt-16 space-y-6 px-6">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 transition text-lg"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 transition text-lg"
          >
            About
          </Link>

          {!loading && user && (
            <Link
              to="/all-rooms"
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 transition text-lg"
            >
              All Rooms
            </Link>
          )}

          {!loading && !user && (
            <>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition text-lg"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition text-lg"
              >
                Login
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition text-lg"
              >
                Profile
              </Link>

              {user.role === "SELLER" && (
                <Link
                  to="/seller-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-gray-200 transition text-lg"
                >
                  Seller Dashboard
                </Link>
              )}

              <Link
                to="/become-seller"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition text-lg"
              >
                Become Seller
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition text-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        ></div>
      )}

      <div className="h-16 md:h-16"></div>
    </>
  );
};

export default Navbar;
