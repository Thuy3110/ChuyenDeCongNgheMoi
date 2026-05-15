import { useEffect, useState } from "react";
import api from "../../api/axios";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    capacity: ""
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // GET ROOMS
  const fetchRooms = async () => {
    try {
      const res = await api.get("classes/rooms/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setRooms(data);

    } catch (err) {
      console.log("ERROR:", err.response?.status, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreate = async () => {
    try {
      await api.post("classes/rooms/", form);

      fetchRooms();

      setForm({
        name: "",
        capacity: ""
      });

      setShowForm(false);

    } catch (err) {
      console.log(err);
      alert("Tạo phòng thất bại");
    }
  };

  // EDIT CLICK
  const handleEdit = (room) => {
    setShowForm(true);
    setEditId(room.id);

    setForm({
      name: room.name,
      capacity: room.capacity
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      await api.patch(`classes/rooms/${editId}/`, form);

      fetchRooms();

      setForm({
        name: "",
        capacity: ""
      });

      setEditId(null);
      setShowForm(false);

    } catch (err) {
      console.log(err);
      alert("Cập nhật thất bại");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`classes/rooms/${id}/`);
      fetchRooms();
    } catch (err) {
      console.log(err);
      alert("Xóa thất bại");
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Quản lý phòng
          </h1>
          <p className="text-gray-500 mt-2">
            Tạo và quản lý phòng tập
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);

            if (showForm) {
              setEditId(null);
              setForm({ name: "", capacity: "" });
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg"
        >
          {showForm ? "Đóng" : "+ Tạo phòng"}
        </button>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Tên phòng"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Sức chứa"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
              className="border p-3 rounded-xl"
            />

          </div>

          <button
            onClick={editId ? handleUpdate : handleCreate}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            {editId ? "Cập nhật phòng" : "Lưu phòng"}
          </button>

        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-5 text-left">Tên phòng</th>
              <th className="p-5 text-left">Sức chứa</th>
              <th className="p-5 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="3" className="p-8 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-400">
                  Không có phòng
                </td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">

                  <td className="p-5 font-semibold">{r.name}</td>
                  <td className="p-5">{r.capacity}</td>

                  <td className="p-5">
                    <div className="flex gap-3 justify-center">

                      <button
                        onClick={() => handleEdit(r)}
                        className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-500 text-white px-5 py-2 rounded-xl"
                      >
                        Xóa
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Rooms;