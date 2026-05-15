import { useEffect, useState } from "react";
import api from "../../api/axios";

function Attendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("attendance/attendance/today/");
        const data = res.data.map((s) => ({
          ...s,
          checked: !!s.attendance_status,
        }));
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []); // chạy 1 lần khi mount

  const handleCheckIn = async (enrollmentId, scheduleId, status) => {
    try {
      await api.post("attendance/", {
        enrollment_id: enrollmentId,
        schedule_id: scheduleId,
        status: status,
        date: new Date().toISOString().split("T")[0],
      });

      // ✅ update UI + lưu trạng thái
      setStudents((prev) =>
        prev.map((s) =>
          s.enrollment_id === enrollmentId && s.schedule_id === scheduleId
            ? { ...s, checked: true, attendance_status: status }
            : s
        )
      );
      
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi điểm danh!");
    }
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Điểm danh học viên
      </h2>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3">Học viên</th>
            <th className="p-3">Lớp</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Kết quả</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 p-4">
                Hôm nay không có lớp học
              </td>
            </tr>
          )}
          {students.map((s) => (
            <tr
              key={`${s.enrollment_id}-${s.schedule_id}`}
              className="text-center border-t hover:bg-gray-50"
            >
              <td className="p-3 font-medium">{s.student_name}</td>
              
              <td className="p-3">{s.class_name}</td>
              
              <td className="p-3">
                {s.weekday} ({s.start_time} - {s.end_time})
              </td>

              <td className="p-3">
                <button
                  disabled={s.attendance_status}
                  onClick={() =>
                    handleCheckIn(s.enrollment_id, s.schedule_id, "Present")
                  }
                  className={`px-3 py-1 rounded mr-2 ${
                    s.attendance_status
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Có mặt
                </button>

                <button
                  disabled={s.attendance_status}
                  onClick={() =>
                    handleCheckIn(s.enrollment_id, s.schedule_id, "Absent")
                  }
                  className={`px-3 py-1 rounded ${
                    s.attendance_status
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Vắng
                </button>
              </td>

              <td className="p-3">
                {s.attendance_status === "Present" && (
                  <span className="text-green-600 font-semibold">✅ Có mặt</span>
                )}
                {s.attendance_status === "Absent" && (
                  <span className="text-red-500 font-semibold">❌ Vắng</span>
                )}
                {!s.attendance_status && (
                  <span className="text-gray-400">Chưa điểm danh</span>
                )}
                {s.absent_count >= 3 && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ Nghỉ quá 3 buổi!
                  </p>
                )}
              </td>

            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;