import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" }); // 🔹 message for success/error
  const navigate = useNavigate();

  const handleChange = (e) => {
    // 🔹 Hide message whenever user edits any input
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" }); // clear old message

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // 🔹 Backend sends error message for invalid login
        throw new Error(data.message || "Login failed");
      }

      // 🔹 Show success message
      setMessage({ text: data.message, type: "success" });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      // 🔹 Show error message in form
      setMessage({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Login
      </h2>

      {/* 🔹 Message Display */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-center text-sm font-medium transition-opacity duration-300 ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
