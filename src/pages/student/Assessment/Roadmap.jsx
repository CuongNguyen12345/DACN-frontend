import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import api from "@/services/api";
import {
  Lock, CheckCircle2, AlertTriangle, HelpCircle,
  RefreshCw, BookOpen, Map, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Config màu sắc theo trạng thái ─────────────────────────────────────────
const STATUS_CONFIG = {
  MASTERED: {
    bg: "#dcfce7", border: "#16a34a", text: "#15803d",
    icon: CheckCircle2, label: "Vững vàng", glow: "0 0 16px rgba(22,163,74,0.45)",
  },
  MEDIUM: {
    bg: "#fefce8", border: "#ca8a04", text: "#a16207",
    icon: AlertTriangle, label: "Cần ôn thêm", glow: "0 0 16px rgba(202,138,4,0.4)",
  },
  WEAK: {
    bg: "#fff1f2", border: "#e11d48", text: "#be123c",
    icon: AlertTriangle, label: "Cần vá lỗ hổng", glow: "0 0 16px rgba(225,29,72,0.45)",
  },
  UNTESTED: {
    bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8",
    icon: HelpCircle, label: "Chưa kiểm tra", glow: "0 0 12px rgba(59,130,246,0.3)",
  },
  LOCKED: {
    bg: "#f8fafc", border: "#cbd5e1", text: "#94a3b8",
    icon: Lock, label: "Chưa mở khóa", glow: "none",
  },
};

// ─── Custom Node Component ────────────────────────────────────────────────────
const TopicNode = ({ data }) => {
  const cfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.LOCKED;
  const Icon = cfg.icon;
  const isLocked = data.status === "LOCKED";
  const pct = data.masteryScore >= 0 ? Math.round(data.masteryScore * 100) : null;

  return (
    <div
      className="rounded-2xl border-2 px-4 py-3 w-52 cursor-pointer select-none transition-transform duration-200 hover:scale-105"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        boxShadow: cfg.glow,
        opacity: isLocked ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 shrink-0" style={{ color: cfg.text }} />
        <span className="text-xs font-semibold" style={{ color: cfg.text }}>
          {cfg.label}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-800 leading-snug">{data.name}</p>
      {pct !== null && (
        <div className="mt-2">
          <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
            <span>Độ thành thạo</span>
            <span className="font-bold" style={{ color: cfg.text }}>{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: cfg.border }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const nodeTypes = { topicNode: TopicNode };

// ─── Bố cục: xếp node thành lưới snake ──────────────────────────────────────
const COLS = 4;
const H_GAP = 260;
const V_GAP = 140;

function buildGraph(topics) {
  const nodes = topics.map((t, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = row % 2 === 0 ? col * H_GAP : (COLS - 1 - col) * H_GAP; // snake
    return {
      id: String(t.id),
      type: "topicNode",
      position: { x, y: row * V_GAP },
      data: t,
    };
  });

  const edges = [];
  for (let i = 0; i < topics.length - 1; i++) {
    edges.push({
      id: `e${i}`,
      source: String(topics[i].id),
      target: String(topics[i + 1].id),
      style: { stroke: "#cbd5e1", strokeWidth: 2, strokeDasharray: "6 3" },
      animated: topics[i].status === "MASTERED",
    });
  }
  return { nodes, edges };
}

// ─── Subjects / Grades cứng (có thể fetch từ API nếu muốn) ──────────────────
const SUBJECTS = ["Toán", "Vật lý", "Hóa học", "Sinh học", "Tiếng Anh"];
const GRADES   = ["Lớp 10", "Lớp 11", "Lớp 12"];

// ─── Main Page ────────────────────────────────────────────────────────────────
const Roadmap = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("Toán");
  const [grade, setGrade]     = useState("Lớp 12");
  const [topics, setTopics]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const loadRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/roadmap", { params: { subject, grade } });
      setTopics(res.data);
      const { nodes: n, edges: e } = buildGraph(res.data);
      setNodes(n);
      setEdges(e);
    } catch (err) {
      setError("Không thể tải lộ trình. Vui lòng đăng nhập và thử lại.");
    } finally {
      setLoading(false);
    }
  }, [subject, grade]);

  useEffect(() => { loadRoadmap(); }, [loadRoadmap]);

  // Stats tổng hợp
  const stats = useMemo(() => ({
    mastered: topics.filter(t => t.status === "MASTERED").length,
    weak:     topics.filter(t => t.status === "WEAK").length,
    medium:   topics.filter(t => t.status === "MEDIUM").length,
    locked:   topics.filter(t => t.status === "LOCKED").length,
    total:    topics.length,
  }), [topics]);

  const overallPct = stats.total > 0
    ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Lộ trình cá nhân hóa</h1>
              <p className="text-xs text-slate-500">Bản đồ kiến thức của bạn</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject select */}
            <div className="relative">
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 pr-9 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Grade select */}
            <div className="relative">
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 pr-9 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadRoadmap}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Tải lại
            </Button>

            <Button
              size="sm"
              onClick={() => navigate("/assessment")}
              className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4" />
              Đánh giá năng lực
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Stats bar ─── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Tổng chủ đề",  value: stats.total,   color: "text-slate-700",  bg: "bg-white" },
            { label: "Vững vàng",    value: stats.mastered, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Cần ôn",       value: stats.medium,  color: "text-amber-600",  bg: "bg-amber-50" },
            { label: "Cần vá",       value: stats.weak,    color: "text-rose-600",   bg: "bg-rose-50" },
            { label: "Chưa mở",     value: stats.locked,  color: "text-slate-400",  bg: "bg-slate-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={cn("rounded-2xl border border-slate-100 p-4 text-center", bg)}>
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="mt-3 bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Tiến độ tổng quan</span>
            <span className="font-bold text-blue-600">{overallPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Legend ─── */}
      <div className="max-w-7xl mx-auto px-6 pb-2">
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{ background: cfg.bg, borderColor: cfg.border }}
                />
                <Icon className="h-3 w-3" style={{ color: cfg.text }} />
                <span className="text-slate-600">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Graph ─── */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div
          className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
          style={{ height: "70vh", minHeight: 480 }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3 text-slate-400">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span>Đang tải bản đồ kiến thức...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <AlertTriangle className="h-10 w-10 text-rose-400" />
              <p className="text-sm">{error}</p>
              <Button size="sm" variant="outline" onClick={loadRoadmap}>Thử lại</Button>
            </div>
          ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <Map className="h-10 w-10 text-blue-300" />
              <p className="text-sm">Không tìm thấy chủ đề nào cho môn này.</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.3}
              maxZoom={2}
            >
              <Background color="#e2e8f0" gap={20} />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={(n) => {
                  const cfg = STATUS_CONFIG[n.data?.status];
                  return cfg ? cfg.border : "#cbd5e1";
                }}
                maskColor="rgba(241,245,249,0.7)"
              />
            </ReactFlow>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
