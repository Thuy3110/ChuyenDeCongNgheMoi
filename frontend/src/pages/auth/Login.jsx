import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("auth/login/", formData);

      // Lưu JWT Token
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Lưu thông tin người dùng từ backend
      const userData = response.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.user.username,
          role: response.data.user.role,
        })
      );

      // Cập nhật Navbar
      window.dispatchEvent(new Event("authChanged"));

      // Điều hướng theo vai trò
      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "trainer":
          navigate("/trainer/dashboard");
          break;
        case "member":
          navigate("/member/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
        console.log("LOGIN ERROR:", err.response?.data);

        setError(
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Sai tài khoản hoặc mật khẩu"
        );
      }finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧘 QUANLYYOGA</h2>
        <h3>Đăng Nhập</h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <p>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={styles.link}>
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    color: "#16a34a",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  link: {
    color: "#16a34a",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Login;