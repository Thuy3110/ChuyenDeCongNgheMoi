import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminDashboard() {

  const [stats, setStats] = useState({
    classes: 0,
    trainers: 0,
    members: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res = await api.get("dashboard/admin/");
      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Lớp học",
      value: stats.classes,
      icon: "📚",
      color: "bg-blue-500",
    },
    {
      title: "Huấn luyện viên",
      value: stats.trainers,
      icon: "🏋️",
      color: "bg-green-500",
    },
    {
      title: "Học viên",
      value: stats.members,
      icon: "👥",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-lg"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 text-lg">
                  {card.title}
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} text-white w-20 h-20 rounded-3xl flex items-center justify-center text-4xl`}
              >
                {card.icon}
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminDashboard;