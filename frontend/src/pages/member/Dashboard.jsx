import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const [overview, setOverview] = useState({
    registered_classes: 0,
    this_week_schedule: 0,
    total_attended_sessions: 0,
  });

  // ATTENDANCE
  const [attendance, setAttendance] = useState({
    total_sessions: 0,
    attended: 0,
    absent: 0,
    records: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    fetchAttendance();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await api.get("dashboard/member/");
      setOverview(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // FETCH ATTENDANCE
  const fetchAttendance = async () => {
    try {
      const res = await api.get("attendance/member/");

      setAttendance({
        total_sessions: res.data.total_sessions || 0,
        attended: res.data.attended || 0,
        absent: res.data.absent || 0,
        records: res.data.records || [],
      });

    } catch (error) {
      console.error("Attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Lớp đã đăng ký",
      value: overview.registered_classes,
      icon: "📚",
    },
    {
      title: "Lịch học tuần này",
      value: overview.this_week_schedule,
      icon: "📅",
    },
    {
      title: "Tổng buổi tham gia",
      value: overview.total_attended_sessions,
      icon: "⭐",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-green-600">
          Member Dashboard
        </h2>

        <div className="text-sm text-gray-500">
          Theo dõi lớp học & điểm danh
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-300">
                  {item.title}
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {item.value}
                </p>
              </div>

              <div className="text-5xl opacity-80">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ATTENDANCE */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h3 className="text-2xl font-bold mb-6 text-blue-600">
          📊 Thống kê điểm danh
        </h3>

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
            <p className="text-gray-500 dark:text-gray-300">
              Tổng buổi
            </p>

            <p className="text-4xl font-bold mt-2">
              {attendance.total_sessions}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900 rounded-xl p-5 text-center">
            <p className="text-green-600 font-semibold">
              Có mặt
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {attendance.attended}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900 rounded-xl p-5 text-center">
            <p className="text-red-500 font-semibold">
              Vắng
            </p>

            <p className="text-4xl font-bold text-red-500 mt-2">
              {attendance.absent}
            </p>
          </div>

        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h3 className="text-2xl font-bold mb-5">
          📋 Lịch sử điểm danh
        </h3>

        {attendance.records.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            Chưa có dữ liệu điểm danh
          </div>
        ) : (
          <div className="space-y-3">

            {attendance.records.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {item.class_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.date}
                  </p>
                </div>

                <div>
                  {item.status === "present" ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Có mặt
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                      Vắng
                    </span>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* QUICK ACTION */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h3 className="text-xl font-bold mb-4">
          ⚡ Hành động nhanh
        </h3>

        <div className="flex flex-wrap gap-4">

          <Link
            to="/member/classes"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
          >
            Đăng ký lớp
          </Link>

          <Link
            to="/member/schedule"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Xem lịch học
          </Link>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;