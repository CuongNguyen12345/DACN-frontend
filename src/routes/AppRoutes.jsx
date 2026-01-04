import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import Home from "../pages/student/Home/Home";
import ForgotPassword from "../pages/student/ForgotPassword";
import Learning from "../pages/student/Learning/Learning";
import PracticeList from "../pages/student/Practice/PracticeList";
import PracticeRoom from "../pages/student/Practice/PracticeRoom";
import PracticeResult from "../pages/student/Practice/PracticeResult";
import Profile from "../pages/student/Profile/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="/learning/:subjectId" element={<Learning />} />
        <Route path="/practice" element={<PracticeList />} />
        <Route path="/practice/room/:examId" element={<PracticeRoom />} />
        <Route path="/practice/room/:examId" element={<PracticeRoom />} />
        <Route path="/practice/result/:examId" element={<PracticeResult />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
