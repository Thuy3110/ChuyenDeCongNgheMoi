import { useEffect, useState } from "react";
import api from "../../api/axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const res = await api.get("users/");

      console.log("USERS API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      const members = data.filter(
        (user) => user.role === "member"
      );

      setUsers(members);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Học viên
        </h1>

        <p className="text-gray-500 mt-2">
          Danh sách học viên hệ thống
        </p>

      </div>

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

              <th className="p-5 text-left">
                Vai trò
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

            ) : users.length === 0 ? (

              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">
                  Không có học viên
                </td>
              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-5 font-semibold">
                    {user.username}
                  </td>

                  <td className="p-5">
                    {user.email}
                  </td>

                  <td className="p-5">
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm">
                      Member
                    </span>
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

export default Users;