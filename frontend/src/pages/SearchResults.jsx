import { useEffect, useState } from "react";
import api from "../api/axios";
import { useGlobalSearch } from "../GlobalSearchContext";

function SearchResults() {
  const { keyword } = useGlobalSearch();

  const [data, setData] = useState({
    classes: [],
    schedules: [],
    trainers: [],
    students: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) {
        setData({
          classes: [],
          schedules: [],
          trainers: [],
          students: [],
        });
        return;
      }

      setLoading(true);

      try {
        const res = await api.get(`/search/?search=${keyword}`);
        setData(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  const Card = ({ children }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-800">
      {children}
    </div>
  );

  const SectionTitle = ({ title, color }) => (
    <h2 className={`text-lg font-bold mb-4 border-l-4 pl-3 ${color}`}>
      {title}
    </h2>
  );

  const Empty = ({ text }) => (
    <p className="text-gray-400 text-sm italic">{text}</p>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          🔎 Kết quả tìm kiếm:
          <span className="text-green-600 ml-2">{keyword}</span>
        </h1>

        {loading && (
          <p className="text-gray-500 mt-2">Đang tìm kiếm...</p>
        )}
      </div>

      {/* GRID LAYOUT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ===== CLASSES ===== */}
        <div>
          <SectionTitle title="📚 Lớp học" color="border-green-500 text-green-600" />

          {data.classes.length === 0 ? (
            <Empty text="Không có lớp học" />
          ) : (
            <div className="space-y-3">
              {data.classes.map((c) => (
                <Card key={c.id}>
                  <h3 className="font-semibold text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.description || "Không có mô tả"}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ===== TRAINERS ===== */}
        <div>
          <SectionTitle title="🏋️ Huấn luyện viên" color="border-purple-500 text-purple-600" />

          {data.trainers.length === 0 ? (
            <Empty text="Không có huấn luyện viên" />
          ) : (
            <div className="space-y-3">
              {data.trainers.map((t) => (
                <Card key={t.id}>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Trainer
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ===== STUDENTS ===== */}
        <div>
          <SectionTitle title="👨‍🎓 Học viên" color="border-blue-500 text-blue-600" />

          {data.students.length === 0 ? (
            <Empty text="Không có học viên" />
          ) : (
            <div className="space-y-3">
              {data.students.map((s) => (
                <Card key={s.id}>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Member
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ===== SCHEDULES ===== */}
        <div>
          <SectionTitle title="📅 Lịch học" color="border-blue-500 text-blue-600" />

          {data.schedules.length === 0 ? (
            <Empty text="Không có lịch học" />
          ) : (
            <div className="space-y-3">
              {data.schedules.map((s) => (
                <Card key={s.id}>
                  <h3 className="font-semibold text-green-600">
                    {s.yoga_class_name || "Class"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Thứ: {s.weekday}
                  </p>

                  <p className="text-sm text-gray-600">
                    {s.start_time} - {s.end_time}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SearchResults;