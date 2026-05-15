import { useEffect, useState } from "react";
import api from "../../api/axios";

function TrainerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await api.get("attendance/trainer/students/");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => await fetchStudents();
    fetchData();
  }, []);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-600">
          👨‍🎓 Học viên đăng ký
        </h2>

        <p className="text-gray-500 mt-1">
          Danh sách học viên thuộc lớp của bạn
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-400">
          Chưa có học viên đăng ký
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Học viên</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Lớp học</th>
                <th className="p-4 text-left">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, index) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 font-semibold">
                    {s.student_name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {s.email}
                  </td>

                  <td className="p-4">
                    {s.class_name}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

export default TrainerStudents;