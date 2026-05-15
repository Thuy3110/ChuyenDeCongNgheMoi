import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SearchResults from "./pages/SearchResults";
import { Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Classes from "./pages/admin/Classes";
import Trainers from "./pages/admin/Trainers";
import Users from "./pages/admin/Users";
import Rooms from "./pages/admin/Rooms";

// Trainer Pages
import TrainerClasses from "./pages/trainer/TrainerClasses";
import Attendance from "./pages/trainer/Attendance";
import Dashboard from "./pages/trainer/Dashboard";
import AttendanceHistory from "./pages/trainer/AttendanceHistory";
import TrainerSchedule from "./pages/trainer/TrainerSchedule";
import TrainerStudents from "./pages/trainer/TrainerStudents";

// Member Pages
import MemberDashboard from "./pages/member/Dashboard";
import ClassList from "./pages/member/ClassList";
import MyBookings from "./pages/member/MyBookings";
import MySchedule from "./pages/member/MySchedule";
import MemberAttendance from "./pages/member/MemberAttendance";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
      offset: 100,    
    });
  }, []);
  return (
    <>
      <Navbar />
      

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="users" element={<Users />} />
          <Route path="rooms" element={<Rooms />} />
        </Route>

        {/* Trainer Routes */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute role="trainer">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<TrainerClasses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="history" element={<AttendanceHistory />} />
          <Route path="schedule" element={<TrainerSchedule />} />
          <Route path="students" element={<TrainerStudents />} />
        </Route>

        {/* Member Routes */}
        <Route
          path="/member"
          element={
            <ProtectedRoute role="member">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="attendance" element={<MemberAttendance />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;