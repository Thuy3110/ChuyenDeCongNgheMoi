import { useEffect, useState } from "react";
import api from "../../api/axios";

function Trainers() {

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORM
  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  // =========================
  // LOAD TRAINERS
  // =========================
  const fetchTrainers = async () => {

    try {

      const res = await api.get("users/");

      console.log("TRAINERS API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      const trainerUsers = data.filter(
        (user) => user.role === "trainer"
      );

      setTrainers(trainerUsers);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // CREATE TRAINER
  // =========================
  const handleCreate = async () => {

    try {

      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: "trainer"
      };

      console.log("SEND DATA:", payload);

      const res = await api.post(
        "auth/register/",
        payload
      );

      console.log("CREATE SUCCESS:", res.data);

      alert("Tạo trainer thành công");

      fetchTrainers();

      setForm({
        username: "",
        email: "",
        password: ""
      });

      setShowForm(false);

    } catch (error) {

      console.log("CREATE ERROR:", error.response?.data);

      alert(
        JSON.stringify(error.response?.data)
      );
    }
  };

  // =========================
  // EDIT CLICK
  // =========================
  const handleEdit = (trainer) => {

    setShowForm(true);

    setEditId(trainer.id);

    setForm({
      username: trainer.username,
      email: trainer.email,
      password: ""
    });
  };

  // =========================
  // UPDATE TRAINER
  // =========================
  const handleUpdate = async () => {

    try {

      await api.patch(
        `users/crud/${editId}/`,
        {
          username: form.username,
          email: form.email
        }
      );

      alert("Cập nhật thành công");

      fetchTrainers();

      setEditId(null);

      setForm({
        username: "",
        email: "",
        password: ""
      });

      setShowForm(false);

    } catch (error) {

      console.log(error);

      alert("Cập nhật thất bại");
    }
  };

  // =========================
  // DELETE TRAINER
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa trainer?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`users/crud/${id}/`);

      alert("Xóa thành công");

      fetchTrainers();

    } catch (error) {

      console.log(error);

      alert("Xóa thất bại");
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Huấn luyện viên
          </h1>

          <p className="text-gray-500 mt-2">
            Danh sách huấn luyện viên hệ thống
          </p>

        </div>

        <button
          onClick={() => {

            setShowForm(!showForm);

            if (showForm) {

              setEditId(null);

              setForm({
                username: "",
                email: "",
                password: ""
              });
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-lg"
        >
          + Thêm Trainer
        </button>

      </div>

      {/* FORM */}
      {showForm && (

        <div className="bg-white p-6 rounded-3xl shadow-lg mb-6">

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value
                })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              className="border p-3 rounded-xl"
            />

            {!editId && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                className="border p-3 rounded-xl"
              />
            )}

          </div>

          {editId ? (

            <button
              onClick={handleUpdate}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Cập nhật Trainer
            </button>

          ) : (

            <button
              onClick={handleCreate}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Lưu Trainer
            </button>

          )}

        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-600 text-white">

            <tr>

              <th className="p-5 text-left">
                Username
              </th>

              <th className="p-5 text-left">
                Email
              </th>

              <th className="p-5 text-center">
                Thao tác
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="3" className="p-6 text-center">
                  Đang tải...
                </td>
              </tr>

            ) : trainers.length === 0 ? (

              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">
                  Không có huấn luyện viên
                </td>
              </tr>

            ) : (

              trainers.map((trainer) => (

                <tr
                  key={trainer.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-5 font-semibold">
                    {trainer.username}
                  </td>

                  <td className="p-5">
                    {trainer.email}
                  </td>

                  {/* ACTION */}
                  <td className="p-5">

                    <div className="flex gap-3 justify-center">

                      <button
                        onClick={() => handleEdit(trainer)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(trainer.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
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

export default Trainers;