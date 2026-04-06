import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/components/ProtectedRoute";
import StudentLayout from "../layouts/StudentLayout";
import ManagerLayout from "../layouts/ManagerLayout";

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
import NotificationsList from "@/pages/student/Notification/NotificationsList";

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

const USER_ROLES = ["user", "teacher", "admin"];
const TEACHER_ROLES = ["teacher", "admin"];
const ADMIN_ROLES = ["admin"];

const sharedManagerRoutes = [
  { path: "exams", element: <ExamList /> },
  { path: "exams/create", element: <ExamCreate /> },
  { path: "exams/edit/:id", element: <ExamEdit /> },
  { path: "exams/view/:id", element: <ExamView /> },

  { path: "questions", element: <QuestionList /> },
  { path: "questions/create", element: <QuestionCreate /> },
  { path: "questions/edit/:id", element: <QuestionEdit /> },
  { path: "questions/view/:id", element: <QuestionView /> },

  { path: "qna", element: <QnAManager /> },
  { path: "qna/:id", element: <QnAManager /> },
];

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

        {/* Khu user: user + teacher + admin */}
        <Route element={<ProtectedRoute allowedRoles={USER_ROLES} />}>
          <Route path="course/learning/:courseId" element={<Learning />} />
          <Route path="practice/room/:examId" element={<PracticeRoom />} />
          <Route path="practice/result/:examId" element={<PracticeResult />} />
          <Route path="practice/review/:examId" element={<PracticeReview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="studyhistory" element={<StudyHistory />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="notification" element={<NotificationsList />} />
        </Route>
      </Route>

      {/* Dành cho Giáo viên */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<ManagerLayout />}>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfileAdmin />} />

          {/* Tự động render các route dùng chung */}
          {sharedManagerRoutes.map((route) => (
            <Route key={`teacher-${route.path}`} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      {/* Dành cho Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<ManagerLayout />}>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfileAdmin />} />

          {/* Tự động render các route dùng chung */}
          {sharedManagerRoutes.map((route) => (
            <Route key={`admin-${route.path}`} path={route.path} element={route.element} />
          ))}

          {/* Các route CHỈ dành cho Admin */}
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default AppRoutes;