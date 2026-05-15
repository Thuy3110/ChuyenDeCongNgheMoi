import { useEffect, useState } from "react";
import api from "../../api/axios";

function MemberAttendance() {
  const [data, setData] = useState({
    total: 0,
    present: 0,
    absent: 0,
    data: [],
  });
  const [attendance, setAttendance] = useState([]);

    useEffect(() => {
    api.get("/attendance/member/")
        .then(res => setAttendance(res.data));
    }, []);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/attendance/member/");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const Card = ({ title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        📊 Điểm danh của tôi
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <Card title="Tổng buổi" value={data.total} color="text-gray-800" />
        <Card title="Có mặt" value={data.present} color="text-green-600" />
        <Card title="Vắng" value={data.absent} color="text-red-500" />

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Lớp</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {data.data.map((item) => (
              <tr key={item.id} className="border-t dark:border-gray-700">
                <td className="p-3">{item.class__name}</td>
                <td className="p-3">{item.date}</td>
                <td className="p-3">
                  {item.status === "present" ? (
                    <span className="text-green-600 font-semibold">Có mặt</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Vắng</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default MemberAttendance;