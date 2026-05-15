import { Link } from "react-router-dom";
import aboutImg from "../assets/yoga-benefits.jpg";

function About() {
  const stats = [
    { number: "500+", label: "Học viên" },
    { number: "20+", label: "Huấn luyện viên" },
    { number: "50+", label: "Lớp Yoga" },
    { number: "5★", label: "Đánh giá" },
  ];

  const values = [
    {
      icon: "🧘",
      title: "Sức khỏe",
      desc: "Giúp học viên cải thiện thể chất và tinh thần mỗi ngày.",
    },
    {
      icon: "💚",
      title: "Cộng đồng",
      desc: "Xây dựng môi trường luyện tập thân thiện và tích cực.",
    },
    {
      icon: "🔥",
      title: "Động lực",
      desc: "Truyền cảm hứng để bạn duy trì thói quen luyện tập.",
    },
  ];

  const trainers = [
    {
      name: "Nguyễn Minh Anh",
      role: "Yoga Trainer",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Trần Hoàng Nam",
      role: "Meditation Coach",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Lê Thu Hà",
      role: "Fitness Yoga",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white">

      {/* HERO */}
      <section className="relative py-24 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Về <span className="text-green-600">Yoga Studio</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-8">
              Chúng tôi mang đến môi trường luyện tập Yoga hiện đại,
              giúp học viên cải thiện sức khỏe, cân bằng tinh thần
              và xây dựng lối sống tích cực mỗi ngày.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <Link
                to="/member/classes"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
              >
                Khám phá lớp học
              </Link>

              <Link
                to="/register"
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-xl transition"
              >
                Tham gia ngay
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={aboutImg}
              alt=""
              className="rounded-3xl shadow-2xl"
            />

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold text-green-600">
                10+
              </p>
              <p className="text-gray-500 text-sm">
                Năm kinh nghiệm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">

            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center hover:-translate-y-2 transition"
              >
                <h2 className="text-4xl font-bold text-green-600">
                  {s.number}
                </h2>

                <p className="mt-2 text-gray-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

          <img
            src={aboutImg}
            alt=""
            className="rounded-3xl shadow-xl"
          />

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Hành trình của chúng tôi
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-8">
              Yoga Studio được xây dựng với mong muốn tạo ra một
              không gian luyện tập chuyên nghiệp, hiện đại và thân thiện.
              Chúng tôi không chỉ giúp học viên nâng cao sức khỏe mà còn
              giúp cân bằng cuộc sống và cải thiện tinh thần.
            </p>

            <p className="mt-5 text-gray-600 dark:text-gray-300 leading-8">
              Với đội ngũ huấn luyện viên giàu kinh nghiệm cùng hệ thống
              quản lý lớp học thông minh, học viên có thể dễ dàng đăng ký,
              theo dõi lịch học và tham gia các lớp Yoga phù hợp.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-xl">
                ✔ Không gian hiện đại
              </div>

              <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-xl">
                ✔ HLV chuyên nghiệp
              </div>

              <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-xl">
                ✔ Lịch học linh hoạt
              </div>

              <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-xl">
                ✔ Hỗ trợ 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-green-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-12">
            Giá trị cốt lõi
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-md hover:-translate-y-2 transition"
              >
                <div className="text-5xl mb-5">
                  {v.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {v.title}
                </h3>

                <p className="text-gray-500 leading-7">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-12">
            Đội ngũ huấn luyện viên
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {trainers.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 transition"
              >
                <img
                  src={t.image}
                  alt=""
                  className="h-80 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold">
                    {t.name}
                  </h3>

                  <p className="text-green-600 mt-2">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-green-600 text-white text-center">
        <div className="container mx-auto px-6">

          <h2 className="text-5xl font-bold">
            Bắt đầu hành trình Yoga ngay hôm nay
          </h2>

          <p className="mt-6 text-lg max-w-2xl mx-auto">
            Tham gia cùng hàng trăm học viên để cải thiện
            sức khỏe, tinh thần và xây dựng lối sống tích cực.
          </p>

          <Link
            to="/register"
            className="inline-block mt-10 bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;