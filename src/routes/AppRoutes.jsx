import { Routes, Route } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import Home from "../pages/student/Home";
import Login from "../pages/student/Login";
import Register from "../pages/student/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
