import { useEffect, useState } from "react";
import api from "../../api/axios";

function AttendanceHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("attendance/history/");
      setRecords(res.data);
    } catch (error) {
      console.error("Lỗi load lịch sử:", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Lịch sử điểm danh
      </h2>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3">Học viên</th>
            <th className="p-3">Lớp</th>
            <th className="p-3">Thời gian</th>
            <th className="p-3">Ngày</th>
            <th className="p-3">Kết quả</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, index) => (
            <tr key={index} className="text-center border-t">
              <td className="p-3">{r.student_name}</td>
              <td className="p-3">{r.class_name}</td>

              <td className="p-3">
                {r.weekday} ({r.start_time} - {r.end_time})
              </td>

              <td className="p-3">{r.date}</td>

              <td className="p-3">
                {r.status === "Present" && (
                  <span className="text-green-600 font-semibold">
                    ✅ Có mặt
                  </span>
                )}
                {r.status === "Absent" && (
                  <span className="text-red-500 font-semibold">
                    ❌ Vắng
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceHistory;