import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import Home from "../pages/student/Home";
import Login from "../pages/student/Login";
import ForgotPassword from "../pages/student/ForgotPassword";
import Learning from "../pages/student/Learning";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="/learning/:subjectId" element={<Learning />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
