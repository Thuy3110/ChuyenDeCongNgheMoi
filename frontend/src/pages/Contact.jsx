import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Gửi liên hệ thành công!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white">

      {/* HERO */}
      <section className="py-24 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Liên hệ với{" "}
            <span className="text-green-600">
              Yoga Studio
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình
            luyện tập Yoga và chăm sóc sức khỏe.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <div>

            <h2 className="text-4xl font-bold mb-6">
              Thông tin liên hệ
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-8 mb-8">
              Nếu bạn có bất kỳ câu hỏi nào về lớp học,
              lịch tập hoặc đăng ký tài khoản,
              hãy liên hệ với chúng tôi.
            </p>

            <div className="space-y-6">

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex items-center gap-4">
                <div className="text-4xl">📍</div>

                <div>
                  <h3 className="font-bold text-lg">
                    Địa chỉ
                  </h3>

                  <p className="text-gray-500">
                    Đà Nẵng, Việt Nam
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex items-center gap-4">
                <div className="text-4xl">📞</div>

                <div>
                  <h3 className="font-bold text-lg">
                    Điện thoại
                  </h3>

                  <p className="text-gray-500">
                    0123 456 789
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex items-center gap-4">
                <div className="text-4xl">✉</div>

                <div>
                  <h3 className="font-bold text-lg">
                    Email
                  </h3>

                  <p className="text-gray-500">
                    yogastudio@gmail.com
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex items-center gap-4">
                <div className="text-4xl">⏰</div>

                <div>
                  <h3 className="font-bold text-lg">
                    Giờ hoạt động
                  </h3>

                  <p className="text-gray-500">
                    06:00 AM - 09:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

            <h2 className="text-3xl font-bold mb-6">
              Gửi tin nhắn
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>
                <label className="block mb-2 font-medium">
                  Họ và tên
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ tên..."
                  className="w-full border dark:border-gray-700 dark:bg-gray-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email..."
                  className="w-full border dark:border-gray-700 dark:bg-gray-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Tin nhắn
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Nhập nội dung..."
                  className="w-full border dark:border-gray-700 dark:bg-gray-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
              >
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="pb-20">
        <div className="container mx-auto px-6">

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.163673861598!2d108.202167!3d16.054407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219b5df5b3b0b%3A0x7e0d1b6c6b5b7e6!2zxJDDoCBO4bq1bmc!5e0!3m2!1svi!2s!4v1715600000000!5m2!1svi!2s"
              width="100%"
              height="450"
              allowFullScreen=""
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;