import { useEffect, useState } from "react";
import api from "../../api/axios";

function TrainerClasses() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("schedules/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setSchedules(data);
    } catch (error) {
      console.error("Lỗi tải lớp học:", error);
    }
  };

  // ✅ FIX: group theo class_id (KHÔNG dùng object hoặc name)
  const grouped = schedules.reduce((acc, item) => {
    const key =
      item.class_id ||
      item.yoga_class_id ||
      item.yoga_class?.id;

    if (!key) return acc;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        🧘 Lớp dạy của tôi
      </h2>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500">Chưa có lớp nào.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(grouped).map(([classId, items]) => (
            <div
              key={classId}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                
                {/* ✅ FIX: lấy tên lớp từ item đầu tiên */}
                <h3 className="text-xl font-bold text-green-600">
                  {items[0]?.class_name || items[0]?.yoga_class?.name}
                </h3>

                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {items.length} buổi/tuần
                </span>
              </div>

              {/* Danh sách buổi học */}
              <div className="space-y-3">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">
                        {s.weekday_display}
                      </span>
                    </div>

                    <div className="text-gray-600 font-medium">
                      ⏰ {s.start_time} - {s.end_time}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 text-right">
                <button className="text-sm text-green-600 hover:underline">
                  Xem chi tiết →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainerClasses;