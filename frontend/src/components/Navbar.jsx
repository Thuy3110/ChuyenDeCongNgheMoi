import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
// import api from "../api/axios";
import { useGlobalSearch } from "../GlobalSearchContext";

function Navbar() {
  const navigate = useNavigate();
  
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const { keyword, setKeyword } = useGlobalSearch();

  const [results, setResults] = useState([]);

  // DARK MODE
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // USER UPDATE
  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("authChanged", updateUser);
    return () => window.removeEventListener("authChanged", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-600 font-semibold"
      : "text-gray-700 dark:text-gray-200 hover:text-green-600";

  // ⭐ SEARCH FIX
  const handleSearch = (e) => {
    const value = e.target.value;

    setKeyword(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }
  
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      navigate("/search");
    }
  };


  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="text-xl font-bold text-green-600">
          YogaStudio
        </Link>

        {/* SEARCH GLOBAL */}
        <div className="flex-1 mx-6 relative">

          <input
            value={keyword || ""}
            onChange={handleSearch}
            onKeyDown={handleSearchKey}
            placeholder="Search..."
            className="w-full px-3 py-2 border rounded"
          />

          {/* DROPDOWN */}
          {results.length > 0 && (
            <div className="absolute bg-white dark:bg-gray-800 w-full mt-1 shadow-lg rounded">
              {results.slice(0, 5).map((item, i) => (
                <div key={i} className="p-2 border-b text-sm">
                  {item.name || item.yoga_class_name || "Result"}
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>

          {user && (
            <>
              {user.role === "member" && (
                <>
                  <NavLink to="/member/classes" className={linkClass}>Classes</NavLink>
                  <NavLink to="/about" className={linkClass}>About</NavLink>
                  <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                </>
              )}

              {user.role === "trainer" && (
                <>
                  <NavLink to="/trainer/classes" className={linkClass}>Classes</NavLink>
                  <NavLink to="/trainer/attendance" className={linkClass}>Attendance</NavLink>
                  <NavLink to="/trainer/students" className={linkClass}>Students</NavLink>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                  <NavLink to="/admin/classes" className={linkClass}>Classes</NavLink>
                  <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
                </>
              )}
            </>
          )}

          {user && <NotificationBell />}

          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xl"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {!user ? (
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;