import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import Home from "../pages/student/Home/Home";
import ForgotPassword from "../pages/student/ForgotPassword";
import Learning from "../pages/student/Learning";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="/learning/:subjectId" element={<Learning />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
