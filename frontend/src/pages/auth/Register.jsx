import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "member",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("auth/register/", formData);

      setMessage("🎉 Đăng ký thành công! Chuyển đến trang đăng nhập...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Register Error:", err.response?.data);

      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Đăng ký thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          🧘 Đăng ký tài khoản
        </h2>

        {message && (
          <p className="text-green-600 text-center mb-3">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            className="w-full p-3 mb-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full p-3 mb-3 border rounded-lg"
            onChange={handleChange}
            required
          />

          {/* Role */}
          <select
            name="role"
            className="w-full p-3 mb-4 border rounded-lg"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="member">Học viên</option>
            <option value="trainer">Huấn luyện viên</option>
          </select>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center mt-4">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;