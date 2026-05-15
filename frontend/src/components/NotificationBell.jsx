import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios";

function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // useEffect fetch notifications khi mount
  useEffect(() => {
    let isMounted = true; // tránh setState khi unmount
    const fetchData = async () => {
      try {
        const res = await api.get("notifications/");
        if (isMounted) setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">

      {/* ICON CHUÔNG */}
      <button
        onClick={async () => {

          // mở dropdown
          setOpen(!open);

          // nếu đang có thông báo chưa đọc
          if (unreadCount > 0) {

            try {

              // gọi backend update đã đọc
              await api.post("notifications/read-all/");

              // update state frontend
              setNotifications(prev =>
                prev.map(n => ({
                  ...n,
                  is_read: true
                }))
              );

            } catch (error) {
              console.error(error);
            }

          }

        }}
        className="relative"
      >
        <FaBell className="text-2xl cursor-pointer text-gray-700 hover:text-green-600 transition" />

        {unreadCount > 0 && (
          <span className="
            absolute -top-2 -right-2
            bg-red-500 text-white
            text-xs rounded-full
            min-w-[18px] h-[18px]
            flex items-center justify-center
            px-1
          ">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="
          absolute right-0 mt-3
          w-96 max-h-[500px]
          overflow-y-auto
          bg-white shadow-2xl
          rounded-2xl border
          z-50
        ">

          {/* HEADER */}
          <div className="
            p-4 border-b
            font-bold text-lg
            text-green-600
          ">
            🔔 Thông báo
          </div>

          {/* EMPTY */}
          {notifications.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              Không có thông báo
            </div>
          )}

          {/* LIST */}
          <div className="divide-y">

            {notifications.map((n) => (

              <div
                key={n.id}
                className={`
                  p-4 hover:bg-gray-50
                  transition cursor-pointer
                  ${!n.is_read ? "bg-green-50" : ""}
                `}
              >

                {/* TITLE */}
                <div className="flex items-start gap-3">

                  <div className="
                    w-10 h-10 rounded-full
                    bg-green-100
                    flex items-center justify-center
                    text-xl
                  ">
                    {n.type === "attendance_present" && "✅"}
                    {n.type === "attendance_absent" && "❌"}
                    {n.type === "warning" && "⚠️"}
                    {!n.type && "🔔"}
                  </div>

                  <div className="flex-1">

                    {/* MESSAGE */}
                    <p className="text-sm text-gray-800">
                      {n.message}
                    </p>

                    {/* TIME */}
                    <p className="text-xs text-gray-400 mt-1">
                      {n.created_at}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default NotificationBell;