import { useEffect, useState } from "react";
import api from "../../api/axios";

const weekdayMap = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật"
];

function TrainerSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState({
    yoga_class: "",
    weekday: 0,
    start_time: "",
    end_time: ""
  });

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
  }, []);
  
  useEffect(() => {
    fetchSchedules(keyword);
  }, [keyword]);

  useEffect(() => {
    const handleSearch = (e) => {
      setKeyword((e.detail || "").trim());
    };

    window.addEventListener("globalSearch", handleSearch);

    return () =>
      window.removeEventListener("globalSearch", handleSearch);
  }, []);

  // GET SCHEDULES (ĐÚNG API)
 const fetchSchedules = async (search = "") => {
    try {
      const res = await api.get(
        `/schedules/trainer/schedules/?search=${search}`
      );

      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // GET CLASSES (QUAN TRỌNG)
  const fetchClasses = async () => {
    try {
      const res = await api.get("classes/trainer/");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE
  const handleCreate = async () => {
  try {
    await api.post("schedules/trainer/schedules/", form);

    fetchSchedules();

    setForm({
      yoga_class: "",
      weekday: 0,
      start_time: "",
      end_time: ""
    });

  } catch (err) {
    console.error(err);

    alert(err.response?.data?.detail || "Tạo lịch thất bại");
  }
};

  // UPDATE
  const handleUpdate = async (id) => {
    await api.patch( `schedules/trainer/schedules/${id}/`, form);
    setEditId(null);
    fetchSchedules();
  };

  const handleDelete = async (id) => {
  try {
    await api.delete(`schedules/trainer/schedules/${id}/`);

    fetchSchedules();

  } catch (err) {
    console.error(err);

    alert(err.response?.data?.detail || "Xóa thất bại");
  }
};

  // EDIT
  const handleEdit = (item) => {
  setEditId(item.id);

  setForm({
    yoga_class:
      typeof item.yoga_class === "object"
        ? item.yoga_class.id
        : item.yoga_class,

    weekday: item.weekday,

    start_time: item.start_time,

    end_time: item.end_time
  });
};

  const grouped = weekdayMap.map((day, index) => ({
    day,
    items: schedules.filter(s => s.weekday === index)
  }));

  return (
    <div className="p-6">

      {/* FORM */}
      <div className="mb-6 bg-white p-4 shadow rounded">

        {/* CHỌN LỚP */}
        <select
          value={form.yoga_class}
          onChange={(e) =>
            setForm({ ...form, yoga_class: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option>-- Chọn lớp --</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* CHỌN THỨ */}
        <select
          value={form.weekday}
          onChange={(e) =>
            setForm({ ...form, weekday: Number(e.target.value) })
          }
          className="border p-2 mr-2"
        >
          {weekdayMap.map((d, i) => (
            <option key={i} value={i}>{d}</option>
          ))}
        </select>

        <input
          type="time"
          value={form.start_time}
          onChange={(e) =>
            setForm({ ...form, start_time: e.target.value })
          }
          className="border p-2 mr-2"
        />

        <input
          type="time"
          value={form.end_time}
          onChange={(e) =>
            setForm({ ...form, end_time: e.target.value })
          }
          className="border p-2 mr-2"
        />

        {editId ? (
          <button
            onClick={() => handleUpdate(editId)}
            className="bg-blue-500 text-white px-3 py-2"
          >
            Lưu
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-3 py-2"
          >
            ➕ Tạo lịch
          </button>
        )}
      </div>

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        📅 Lịch dạy của Trainer
      </h2>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-4">

        {grouped.map((group, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-3">

            <div className="font-bold text-center text-green-700 mb-2">
              {group.day}
            </div>

            <div className="space-y-2">

              {group.items.length === 0 && (
                <p className="text-gray-400 text-sm text-center">
                  Không có lịch
                </p>
              )}

              {group.items.map(item => (
                <div key={item.id} className="bg-green-50 p-2 rounded">

                  <div className="font-semibold">
                    {item.yoga_class_name}
                  </div>

                  <div className="text-xs text-blue-600">
                    Phòng: {item.room_name || "Chưa có phòng"}
                  </div>

                  <div className="text-sm text-gray-600">
                    {item.start_time} - {item.end_time}
                  </div>

                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleEdit(item)} className="text-blue-500">
                      Sửa
                    </button>

                    <button onClick={() => handleDelete(item.id)} className="text-red-500">
                      Xóa
                    </button>
                  </div>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default TrainerSchedule; 