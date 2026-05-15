// src/utils/dateUtils.js

// Định dạng ngày
export const formatDate = (datetime) => {
  if (!datetime) return "Chưa có";
  return new Date(datetime).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Định dạng giờ
export const formatTime = (datetime) => {
  if (!datetime) return "Chưa có";
  return new Date(datetime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Định dạng ngày giờ đầy đủ
export const formatDateTime = (datetime) => {
  if (!datetime) return "Chưa có";
  return new Date(datetime).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};