import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import AdminLayout from "../layouts/AdminLayout"; 

// Student Pages
import Home from "../pages/student/Home/Home";
import Login from "../pages/student/Login";
import Register from "../pages/student/Register";
import ForgotPassword from "../pages/student/ForgotPassword";
import Learning from "../pages/student/course/Learning/Learning";
import PracticeList from "../pages/student/Practice/PracticeList";
import PracticeRoom from "../pages/student/Practice/PracticeRoom";
import PracticeResult from "../pages/student/Practice/PracticeResult";
import PracticeReview from "../pages/student/Practice/PracticeReview";
import Profile from "../pages/student/Profile/Profile";
import Course from "../pages/student/Course/Course";
import Blog from "@/pages/student/Blog/Blog";
import About from "@/pages/student/About/About";
import StudyHistory from "@/pages/student/History/StudyHistory";
import Leaderboard from "@/pages/student/Ranking/Leaderboard";

// Admin Pages
import Overview from "@/pages/admin/Overview/Overview";
import ProfileAdmin from "@/pages/admin/Profile/Profile";
import ExamList from "@/pages/admin/Exams/ExamList";
import ExamEdit from "@/pages/admin/Exams/ExamEdit";
import ExamCreate from "@/pages/admin/Exams/ExamCreate";
import ExamView from "@/pages/admin/Exams/ExamView";
import QuestionList from "@/pages/admin/Questions/QuestionList";
import QuestionEdit from "@/pages/admin/Questions/QuestionEdit";
import QuestionCreate from "@/pages/admin/Questions/QuestionCreate";
import QuestionView from "@/pages/admin/Questions/QuestionView";
import UserList from "@/pages/admin/Users/UserList";
import UserDetail from "@/pages/admin/Users/UserDetail";
import Reports from "@/pages/admin/Reports/Reports";
import Settings from "@/pages/admin/Settings/Settings";
import QnAManager from "@/pages/admin/QnA/QnAManager";

// Routes & Components
import ProtectedRoute from "@/routes/components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* 1. CÁC TRANG KHÔNG CẦN LAYOUT (Auth) */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. KHU VỰC DÀNH CHO HỌC SINH (Có Student Header/Footer) */}
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="course" element={<Course />} />
        <Route path="practice" element={<PracticeList />} />
        <Route path="blog" element={<Blog />} />
        <Route path="about" element={<About />} />

        {/* Các trang học sinh cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="course/learning/:courseId" element={<Learning />} />
          <Route path="practice/room/:examId" element={<PracticeRoom />} />
          <Route path="practice/result/:examId" element={<PracticeResult />} />
          <Route path="practice/review/:examId" element={<PracticeReview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="studyhistory" element={<StudyHistory />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Route>

      {/* 3. KHU VỰC DÀNH CHO ADMIN (Có Admin Sidebar/Header riêng) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* /admin sẽ render Overview */}
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfileAdmin />} />
        
        {/* Quản lý Đề thi */}
        <Route path="exams" element={<ExamList />} />
        <Route path="exams/create" element={<ExamCreate />} />
        <Route path="exams/edit/:id" element={<ExamEdit />} />
        <Route path="exams/view/:id" element={<ExamView />} />

        {/* Ngân hàng Câu hỏi */}
        <Route path="questions" element={<QuestionList />} />
        <Route path="questions/create" element={<QuestionCreate />} />
        <Route path="questions/edit/:id" element={<QuestionEdit />} />
        <Route path="questions/view/:id" element={<QuestionView />} />

        {/* Quản lý Học viên */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />

        {/* Quản lý Hỏi Đáp */}
        <Route path="QnA" element={<QnAManager />} />
        <Route path="QnA/:id" element={<QnAManager />} />

        {/* Báo cáo & Cài đặt */}
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;