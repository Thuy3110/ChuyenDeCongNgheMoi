import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatDate, formatTime } from "../../utils/dateUtils";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("booking/bookings/");
      console.log("MY BOOKINGS:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setBookings(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đăng ký:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Lớp học đã đăng ký
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">
          Bạn chưa đăng ký lớp học nào.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const yogaClass = booking.yoga_class;

            return (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <h3 className="text-xl font-bold text-green-600">
                  {yogaClass?.name || "Chưa có tên lớp"}
                </h3>

                {/* 📅 LỊCH HỌC */}
                <div className="mt-2 space-y-1">
                  {yogaClass?.schedules && yogaClass.schedules.length > 0 ? (
                    yogaClass.schedules.map((s, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        📅 {s.weekday_display} | ⏰ {s.start_time} - {s.end_time}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Chưa có lịch</p>
                  )}
                </div>
                <p>
                  👩‍🏫 Trainer:{" "}
                  {yogaClass?.trainer_name || "Chưa có HLV"}
                </p>

                <p className="mt-2">
                  Trạng thái:{" "}
                  <span
                    className={`font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;