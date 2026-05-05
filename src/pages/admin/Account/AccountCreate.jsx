import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, User, Mail, Lock, BookOpen,
  CheckCircle2, AlertCircle, GraduationCap,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/services/api";

const SUBJECTS = [
  { value: "Toán",       label: "Toán học" },
  { value: "Vật Lý",    label: "Vật Lý" },
  { value: "Hóa Học",   label: "Hóa Học" },
  { value: "Tiếng Anh", label: "Tiếng Anh" },
];

const GRADES = ["Lớp 10", "Lớp 11", "Lớp 12"];

// ─── Grade Checkbox ───────────────────────────────────────────────
const GradeCheckbox = ({ grade, checked, onChange, subjectLabel }) => (
  <label
    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer select-none transition-all
      ${checked
        ? "border-blue-500 bg-blue-50 shadow-sm"
        : "border-gray-200 bg-white hover:border-gray-300"
      }`}
  >
    {/* Custom checkbox */}
    <div
      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border-2
        ${checked
          ? "bg-blue-500 border-blue-500"
          : "bg-white border-gray-300"
        }`}
    >
      {checked && (
        <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
          <path d="M1 5l3.5 4L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>

    <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />

    <div>
      <p className={`text-sm font-semibold ${checked ? "text-blue-700" : "text-gray-700"}`}>
        {grade}
      </p>
      {subjectLabel && (
        <p className="text-xs text-gray-400 mt-0.5">{subjectLabel}</p>
      )}
    </div>

    {checked && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-auto" />}
  </label>
);

// ─── Main Component ───────────────────────────────────────────────
const AccountCreate = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subject: "Toán",
  });

  // Danh sách lớp được chọn (mặc định chọn tất cả)
  const [selectedGrades, setSelectedGrades] = useState(["Lớp 10", "Lớp 11", "Lớp 12"]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGrade = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const toggleAll = () => {
    setSelectedGrades(selectedGrades.length === GRADES.length ? [] : [...GRADES]);
  };

  const validate = () => {
    if (!formData.name.trim()) return "Vui lòng nhập họ tên giáo viên.";
    if (!formData.email.trim()) return "Vui lòng nhập email đăng nhập.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Email không hợp lệ.";
    if (!formData.password.trim()) return "Vui lòng nhập mật khẩu.";
    if (formData.password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (selectedGrades.length === 0) return "Vui lòng chọn ít nhất một lớp để phân công.";
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) { showToast("error", error); return; }

    setIsSaving(true);
    try {
      await api.post("/api/admin/create-teacher", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        subject: formData.subject,
        grades: selectedGrades,
      });
      showToast("success", "Tạo tài khoản giáo viên thành công!");
      setTimeout(() => navigate("/admin/accounts"), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || "Tạo tài khoản thất bại. Vui lòng thử lại!";
      showToast("error", typeof msg === "string" ? msg : "Đã có lỗi xảy ra.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSubjectLabel = SUBJECTS.find((s) => s.value === formData.subject)?.label ?? "";
  const allChecked = selectedGrades.length === GRADES.length;
  const someChecked = selectedGrades.length > 0 && !allChecked;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success"
            ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            : <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          }
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/accounts")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản Giáo viên</h2>
            <p className="text-sm text-gray-500">Điền thông tin để cấp tài khoản cho giáo viên mới.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/accounts")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 outline-none"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">

        {/* ── Thông tin tài khoản ── */}
        <div className="p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-800">Thông tin tài khoản</h3>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <User className="h-4 w-4 text-gray-400" />
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Nhập họ tên đầy đủ của giáo viên"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Mail className="h-4 w-4 text-gray-400" />
                Email đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="VD: teacher@edu.vn"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Lock className="h-4 w-4 text-gray-400" />
                Mật khẩu khởi tạo <span className="text-red-500">*</span>
              </label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="Ít nhất 8 ký tự"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Phân công lớp ── */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Phân công giảng dạy</h3>
            <p className="text-xs text-gray-500">Chọn môn học và các lớp giáo viên sẽ phụ trách.</p>
          </div>

          {/* Môn học */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <BookOpen className="h-4 w-4 text-gray-400" />
              Môn học
            </label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
            >
              <SelectTrigger className="w-full md:w-64 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chọn lớp */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                Lớp phụ trách
                {selectedGrades.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">
                    {selectedGrades.length}/{GRADES.length}
                  </span>
                )}
              </label>

              {/* Chọn / bỏ chọn tất cả */}
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {GRADES.map((grade) => (
                <GradeCheckbox
                  key={grade}
                  grade={grade}
                  checked={selectedGrades.includes(grade)}
                  onChange={() => toggleGrade(grade)}
                  subjectLabel={selectedSubjectLabel}
                />
              ))}
            </div>

            {selectedGrades.length === 0 && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Cần chọn ít nhất một lớp.
              </p>
            )}
          </div>

          {/* Summary badge */}
          {selectedGrades.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedGrades.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {selectedSubjectLabel} — {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountCreate;
