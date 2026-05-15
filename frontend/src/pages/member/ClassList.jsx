import { useEffect, useState } from "react";
import api from "../../api/axios";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [openClasses, setOpenClasses] = useState(new Set());

  useEffect(() => {
    fetchClasses();
    fetchEnrollments();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("classes/classes/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("booking/bookings/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setEnrollments(data);
    } catch (error) {
      console.error(error);
    }
  };

  // lấy enrollment theo class
  const getEnrollment = (classId) => {
    return enrollments.find((e) => {
      const id =
        typeof e.yoga_class === "object"
          ? e.yoga_class.id
          : e.yoga_class;

      return Number(id) === Number(classId);
    });
  };

  const handleEnroll = async (classId) => {
    try {
      const res = await api.post("booking/bookings/", {
        yoga_class_id: classId,
      });

      if (res.data.position) {
        alert(`Bạn đang ở vị trí #${res.data.position} trong waitlist`);
      } else {
        alert("Đăng ký thành công!");
      }

      fetchEnrollments();
    } catch (error) {
      alert(error.response?.data?.detail || "Lỗi!");
    }
  };

  const handleCancel = async (classId) => {
    try {
      const enrollment = getEnrollment(classId);
      if (!enrollment) return;

      await api.delete(`booking/bookings/${enrollment.id}/cancel/`);
      alert("Đã hủy đăng ký");
      fetchEnrollments();
    } catch (error) {
      alert(error.response?.data?.detail || "Không thể hủy!");
    }
  };

  const isClassExpired = (cls) => {
    if (!cls.start_date) return false;
    return new Date(cls.start_date) < new Date();
  };

  const isClassEnded = (cls) => {
    if (!cls.end_date) return false;
    return new Date(cls.end_date) < new Date();
  };

  const toggleClass = (id) => {
    setOpenClasses((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const renderButton = (cls) => {
    const enrollment = getEnrollment(cls.id);
    const status = enrollment?.status;

    if (isClassEnded(cls)) {
      return (
        <button disabled className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-lg">
          Đã kết thúc
        </button>
      );
    }

    if (isClassExpired(cls)) {
      return (
        <button disabled className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Đã diễn ra
        </button>
      );
    }

    if (status === "pending") {
      return (
        <button
          onClick={() => handleCancel(cls.id)}
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg"
        >
          Chờ duyệt (Hủy)
        </button>
      );
    }

    if (status === "waitlist") {
      return (
        <button
          onClick={() => handleCancel(cls.id)}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Waitlist #{enrollment?.waitlist_position} (Hủy)
        </button>
      );
    }

    if (status === "approved") {
      return (
        <button
          onClick={() => handleCancel(cls.id)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Đã đăng ký (Hủy)
        </button>
      );
    }

    if (cls.available_slots <= 0) {
      return (
        <button disabled className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Join Waitlist
        </button>
      );
    }

    return (
      <button
        onClick={() => handleEnroll(cls.id)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Đăng ký
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Danh sách lớp học
        Danh sách lớp học
      </h2>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {classes.map((cls) => {
          const isOpen = openClasses.has(cls.id);
          const enrollment = getEnrollment(cls.id);

          return (
            <div key={cls.id} className="bg-white p-5 rounded-xl shadow">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleClass(cls.id)}
              >
                <h3 className="text-lg font-bold text-green-600">
                  {cls.name}
                </h3>
                <span>{isOpen ? "▲" : "▼"}</span>
              </div>

              <p className="text-gray-500 text-sm">
                {cls.description}
              </p>

              <p className="text-sm mt-1">
                👨‍🏫 {cls.trainer_name}
              </p>

              <div onClick={(e) => e.stopPropagation()}>
                {renderButton(cls)}
              </div>

              {isOpen && (
                <div className="mt-4 border-t pt-3 space-y-2">

                  {enrollment?.status === "waitlist" && (
                    <p className="text-orange-600 text-sm">
                      ⏳ Bạn đang ở vị trí #{enrollment?.waitlist_position}
                    </p>
                  )}

                  <p className="text-sm">
                    👥 Slots: {cls.available_slots ?? "N/A"}
                  </p>

                  {cls.schedules?.map((s, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                      {s.weekday_display} | {s.start_time} - {s.end_time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClassList;