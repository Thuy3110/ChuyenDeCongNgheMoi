import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import api from "../api/axios";
import { useGlobalSearch } from "../GlobalSearchContext";

import heroImg from "../assets/hero.png";
import benefitsImg from "../assets/yoga-benefits.jpg";

function Home() {
  const { keyword } = useGlobalSearch();

  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: false,
      mirror: true,
      offset: 80,
    });

    setTimeout(() => {
      AOS.refreshHard();
    }, 500);
  }, []);

  useEffect(() => {
    fetchClasses(keyword);
  }, [keyword]);

  const fetchClasses = async (search = "") => {
  try {
    const res = await api.get(
      `classes/classes/?search=${search}`
    );

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.results || [];

    setClassesData(data.slice(0, 3));
  } catch (err) {
    console.error(err);
  }
};

  const features = [
    {
      icon: "🧘",
      title: "Quản lý lớp học",
      desc: "Đăng ký lớp Yoga nhanh chóng",
      link: "/member/classes",
    },
    {
      icon: "📅",
      title: "Lịch học",
      desc: "Theo dõi lịch học cá nhân",
      link: "/member/schedule",
    },
    {
      icon: "📚",
      title: "Đăng ký của tôi",
      desc: "Quản lý lớp đã tham gia",
      link: "/member/bookings",
    },
    {
      icon: "📊",
      title: "Dashboard",
      desc: "Thống kê học tập",
      link: "/member/dashboard",
    },
  ];

  const testimonials = [
    {
      name: "Lan Anh",
      text: "Hệ thống rất dễ dùng và tiện lợi!",
    },
    {
      name: "Minh Tuấn",
      text: "Tôi cải thiện sức khỏe rõ rệt sau 2 tuần.",
    },
    {
      name: "Ngọc Hân",
      text: "Lịch học rõ ràng, không bị trùng.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white overflow-hidden">

      {/* HERO */}
      <section className="py-24 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-10">

          <div data-aos="fade-up">
            <h1 className="text-5xl font-bold leading-tight">
              Yoga Studio{" "}
              <span className="text-green-600">System</span>
            </h1>

            <p className="mt-5 text-gray-600 dark:text-gray-300 text-lg">
              Hệ thống quản lý lớp Yoga hiện đại giúp bạn
              đăng ký – theo dõi – luyện tập dễ dàng.
            </p>

            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-xl shadow"
                to="/register"
              >
                Bắt đầu
              </Link>

              <Link
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition px-6 py-3 rounded-xl"
                to="/member/classes"
              >
                Xem lớp
              </Link>
            </div>
          </div>

          <img
            data-aos="zoom-in"
            src={heroImg}
            alt=""
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">

          <h2
            className="text-3xl font-bold mb-10"
            data-aos="fade-up"
          >
            Tính năng nổi bật
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {features.map((f, i) => (
              <Link
                key={i}
                to={f.link}
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:-translate-y-2 transition duration-300"
              >
                <div className="text-5xl">{f.icon}</div>

                <h3 className="font-bold mt-4 text-lg">
                  {f.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {f.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="py-20 bg-green-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">

          <h2
            className="text-3xl font-bold mb-10"
            data-aos="fade-up"
          >
            Lớp học phổ biến
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {classesData.length > 0 ? (
              classesData.map((c, i) => (
                <div
                  key={c.id}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:-translate-y-2 transition duration-300"
                >
                  <h3 className="text-green-600 font-bold text-2xl">
                    {c.name}
                  </h3>

                  <p className="mt-3 text-gray-600 dark:text-gray-300 min-h-[60px]">
                    {c.description || "Chưa có mô tả"}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-500">
                    <p>
                      👨‍🏫 HLV:{" "}
                      {c.trainer_name || "Chưa cập nhật"}
                    </p>
                  </div>

                  <Link
                    className="inline-block mt-5 text-green-600 font-semibold hover:underline"
                    to="/member/classes"
                  >
                    Đăng ký →
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3">
                <p className="text-gray-500">
                  Không tìm thấy lớp học
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <img
            data-aos="fade-right"
            src={benefitsImg}
            alt=""
            className="rounded-2xl shadow-xl"
          />

          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-5">
              Lợi ích Yoga
            </h2>

            <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-lg">
              <li>✔ Giảm stress và căng thẳng</li>
              <li>✔ Tăng sức khỏe và sự dẻo dai</li>
              <li>✔ Giảm cân hiệu quả</li>
              <li>✔ Cải thiện giấc ngủ</li>
              <li>✔ Nâng cao tinh thần tích cực</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">

          <h2
            className="text-3xl font-bold mb-12"
            data-aos="fade-up"
          >
            Học viên nói gì?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {testimonials.map((t, i) => (
              <div
                key={i}
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow"
              >
                <div className="text-5xl mb-4">💬</div>

                <p className="italic text-gray-600 dark:text-gray-300">
                  "{t.text}"
                </p>

                <h4 className="mt-4 font-bold text-green-600">
                  {t.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600 text-white text-center">
        <div className="container mx-auto px-6">

          <h2
            className="text-4xl font-bold"
            data-aos="fade-up"
          >
            Bắt đầu hành trình Yoga ngay hôm nay
          </h2>

          <p
            className="mt-4 text-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Đăng ký tài khoản và tham gia các lớp Yoga chất lượng.
          </p>

          <Link
            data-aos="zoom-in"
            data-aos-delay="200"
            className="inline-block mt-8 bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            to="/register"
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-2xl font-bold text-white">
              Yoga Studio
            </h3>

            <p className="mt-4 text-sm leading-6">
              Hệ thống quản lý lớp Yoga hiện đại giúp
              học viên theo dõi và đăng ký lớp học dễ dàng.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Liên kết
            </h4>

            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-green-400">
                  Trang chủ
                </Link>
              </li>

              <li>
                <Link
                  to="/member/classes"
                  className="hover:text-green-400"
                >
                  Lớp học
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-green-400"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Liên hệ
            </h4>

            <ul className="space-y-2 text-sm">
              <li>📍 Đà Nẵng, Việt Nam</li>
              <li>📞 0123 456 789</li>
              <li>✉ yogastudio@gmail.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Theo dõi
            </h4>

            <div className="flex gap-4 text-2xl">
              <span className="hover:text-blue-400 cursor-pointer">
                🌐
              </span>

              <span className="hover:text-pink-400 cursor-pointer">
                📸
              </span>

              <span className="hover:text-blue-500 cursor-pointer">
                👍
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          © 2026 Yoga Studio System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;