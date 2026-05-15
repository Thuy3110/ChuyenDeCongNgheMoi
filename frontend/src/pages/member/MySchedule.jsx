import { useEffect, useState } from "react";
import api from "../../api/axios";

function Schedule() {
  const [groupedSchedules, setGroupedSchedules] = useState({});

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("schedules/");
      console.log("MY SCHEDULE:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      // ✅ GROUP THEO CLASS
      const grouped = data.reduce((acc, item) => {
        const className = item.class_name;

        if (!acc[className]) {
          acc[className] = [];
        }

        acc[className].push(item);
        return acc;
      }, {});

      setGroupedSchedules(grouped);
    } catch (error) {
      console.error("Lỗi tải lịch học:", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Lịch học của tôi
      </h2>

      {Object.keys(groupedSchedules).length === 0 ? (
        <p className="text-gray-500">Chưa có lịch học.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(groupedSchedules).map(
            ([className, schedules]) => (
              <div
                key={className}
                className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition"
              >
                {/* 🎯 Tên lớp */}
                <h3 className="text-xl font-bold text-green-600 mb-4">
                  {className}
                </h3>

                {/* 📅 Danh sách buổi học */}
                <div className="space-y-3">
                  {schedules.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          📅 {item.weekday_display}
                        </p>
                        <p className="text-sm text-gray-600">
                          ⏰ {item.start_time} - {item.end_time}
                        </p>
                        <p className="text-sm text-blue-600">
                          🏠 Phòng: {item.room_name || "Chưa có phòng"}
                        </p>
                      </div>

                      <div className="text-sm text-gray-500">
                        👩‍🏫 {item.trainer_name || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Schedule;