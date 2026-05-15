import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({
    total_classes: 0,
    total_students: 0,
    today_sessions: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await api.get("dashboard/trainer/");
        if (isMounted) setStats(res.data);
      } catch (error) {
        console.error("Lỗi load dashboard:", error);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // 👉 mapping lại UI
  const statList = [
    {
      title: "Lớp đang giảng dạy",
      value: stats.total_classes,
      icon: "🧘",
    },
    {
      title: "Học viên",
      value: stats.total_students,
      icon: "👥",
    },
    {
      title: "Buổi học hôm nay",
      value: stats.today_sessions,
      icon: "📅",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Trainer Dashboard
      </h2>

      {/* ✅ THỐNG KÊ */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statList.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="text-gray-500 mt-2">{item.title}</h3>
            <p className="text-2xl font-bold text-green-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ QUICK ACTION */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Quản lý nhanh</h3>

        <div className="flex gap-4 flex-wrap">
          <Link
            to="/trainer/classes"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Xem lớp học
          </Link>

          <Link
            to="/trainer/attendance"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Điểm danh
          </Link>

          <Link
            to="/trainer/history"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Lịch sử điểm danh
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;