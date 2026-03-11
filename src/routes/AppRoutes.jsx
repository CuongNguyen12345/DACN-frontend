import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import Home from "../pages/student/Home/Home";
import Login from "../pages/student/Login";
import Register from "../pages/student/Register";
import ForgotPassword from "../pages/student/ForgotPassword";
import Learning from "../pages/student/course/Learning/Learning";
import PracticeList from "../pages/student/Practice/PracticeList";
import PracticeRoom from "../pages/student/Practice/PracticeRoom";
import PracticeResult from "../pages/student/Practice/PracticeResult";
import Profile from "../pages/student/Profile/Profile";
import Course from "../pages/student/Course/Course";
import Blog from "@/pages/student/Blog/Blog";
import About from "@/pages/student/About/About";
import ProtectedRoute from "@/routes/components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="course" element={<Course />} />
        <Route path="practice" element={<PracticeList />} />
        <Route path="blog" element={<Blog />} />
        <Route path="about" element={<About />} />

        <Route element={<ProtectedRoute />}>
          <Route path="course/learning/:subjectId" element={<Learning />} />
          <Route path="practice/room/:examId" element={<PracticeRoom />} />
          <Route path="practice/result/:examId" element={<PracticeResult />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;