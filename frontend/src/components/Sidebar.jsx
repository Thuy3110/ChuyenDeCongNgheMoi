import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Quản lý người dùng", path: "/admin/users" },
    { name: "Quản lý lớp học", path: "/admin/classes" },
    { name: "Quản lý phòng", path: "/admin/rooms" },
    { name: "Huấn luyện viên", path: "/admin/trainers" },
  ];

  const trainerMenu = [
    { name: "Dashboard", path: "/trainer/dashboard" },
    { name: "Lớp học của tôi", path: "/trainer/classes" },
    { name: "Điểm danh", path: "/trainer/attendance" },
    { name: "Lịch dạy", path: "/trainer/schedule" },
  ];

  const memberMenu = [
    { name: "Dashboard", path: "/member/dashboard" },
    { name: "Lớp học", path: "/member/classes" },
    { name: "Lịch học", path: "/member/schedule" },
    { name: "Đăng ký của tôi", path: "/member/bookings" },
  ];

  let menu = [];
  if (user?.role === "admin") menu = adminMenu;
  else if (user?.role === "trainer") menu = trainerMenu;
  else if (user?.role === "member") menu = memberMenu;

  return (
    <aside className="w-64 min-h-screen bg-green-600 text-white">
      <h2 className="text-2xl font-bold p-6 border-b border-green-400">
        Dashboard
      </h2>
      <nav className="p-4 space-y-2">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block p-3 rounded-lg hover:bg-green-500"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;