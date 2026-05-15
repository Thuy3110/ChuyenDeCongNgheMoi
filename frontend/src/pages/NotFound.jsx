import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <p className="text-gray-600 mb-4">Trang không tồn tại</p>
      <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded">
        Quay về Trang chủ
      </Link>
    </div>
  );
}

export default NotFound;