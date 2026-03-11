import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Download,
  Mail,
  CalendarDays,
  ClipboardList,
  Upload,
  Send,
  Building2,
  Code2,
  Users,
  User,
  LineChart,
  DollarSign,
  Megaphone,
  ShoppingCart,
  Settings,
  ShieldCheck,
  Scale,
  Cpu,
  FlaskConical,
  GraduationCap,
  Headphones,
  PenTool,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Network,
  UserCheck,
  Calendar,
  Trash2,
  CheckCircle,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,

  // Newly added icons for departments
  TrendingUp,
  Landmark,
  Shield,
  Search,
  Building,
  Truck,
  Package,
  Archive,
  Kanban,
  Layers,
  Eye,
  Palette,
  GitBranch,
  Cloud,
  Brain,
  Smartphone,
  Globe,
  Wrench,
  Laptop,
  Server,
  Cog,
  Zap,
  Dna,
  Atom,
  Sigma,
  BookOpen,
  Wallet,
  Library,
  FileCheck,
  Users2,
  UserPlus,
  Home,
  Trophy,
  Music,
  Microscope,
  BookMarked,
  UsersRound,
  Globe2,
  UserCog,
  Lightbulb,
} from "lucide-react";
import html2canvas from "html2canvas";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFile,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminDashboard() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [instruction, setInstruction] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);

const location = useLocation();

const analyticsRef = useRef(null);
const assignRef = useRef(null);
const downloadRef = useRef(null);
const tasksRef = useRef(null);
const extensionsRef = useRef(null);

  const [form, setForm] = useState({
    employeeEmail: "",
    department: "",
    startDate: "",
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {

  const params = new URLSearchParams(location.search);
  const view = params.get("view");

  const scrollOptions = { behavior: "smooth", block: "start" };

  if (!view) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (view === "analytics" && analyticsRef.current)
    analyticsRef.current.scrollIntoView(scrollOptions);

  if (view === "assign" && assignRef.current)
    assignRef.current.scrollIntoView(scrollOptions);

  if (view === "download" && downloadRef.current)
    downloadRef.current.scrollIntoView(scrollOptions);

  if (view === "tasks" && tasksRef.current)
    tasksRef.current.scrollIntoView(scrollOptions);

  if (view === "extensions" && extensionsRef.current)
    extensionsRef.current.scrollIntoView(scrollOptions);

}, [location.search]);

  const fetchAll = async () => {
    try {
      const tasksRes = await API.get("/tasks");
      const extRes = await API.get("/extensions");

      setTasks(tasksRes.data);
      setExtensions(extRes.data);
      setLoading(false);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (new Date(form.dueDate) < new Date(form.startDate)) {
      return toast.error("Deadline must be after assigned date");
    }

    try {
      const formData = new FormData();
      formData.append("employeeEmail", form.employeeEmail);
      formData.append("department", form.department);
      formData.append("startDate", form.startDate);
      formData.append("dueDate", form.dueDate);
      formData.append("description", form.description);
      files.forEach((file) => {
        formData.append("files", file);
      });

      await API.post("/tasks/assign", formData);

      toast.success("Task Assigned Successfully");

      setForm({
        employeeEmail: "",
        department: "",
        startDate: "",
        dueDate: "",
        description: "",
      });

      setFiles([]);
      fetchAll();
    } catch {
      toast.error("Assignment failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task removed");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleExtensionDecision = async (id, status) => {
    const message = instruction[id];

    // 🚨 Block if instruction empty
    if (!message || message.trim() === "") {
      toast.error("Admin instruction is required before approving/rejecting.");
      return;
    }

    try {
      await API.put(`/extensions/${id}`, {
        status,
        newDueDate: new Date(),
        adminInstruction: message,
      });

      toast.success(`Extension ${status}`);
      fetchAll();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // ===== HEADER =====
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("TaskHub Analytics Report", 14, 16);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 16);

    doc.setTextColor(0, 0, 0);

    // ===== KPI SECTION =====
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const failed = tasks.filter((t) => t.status === "Failed").length;

    doc.setFontSize(14);
    doc.text("Key Performance Indicators", 14, 40);

    doc.setFontSize(11);
    doc.text(`Total Tasks: ${total}`, 14, 50);
    doc.text(`Completed Tasks: ${completed}`, 70, 50);
    doc.text(`Pending Tasks: ${pending}`, 120, 50);
    doc.text(`Failed Tasks: ${failed}`, 170, 50);

    // ===== STATUS SUMMARY TABLE =====
    autoTable(doc, {
      startY: 65,
      head: [["Status", "Count"]],
      body: [
        ["Completed", completed],
        ["Pending", pending],
        ["Failed", failed],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    // ===== DEPARTMENT ANALYTICS =====
    const departmentData = Object.values(
      tasks.reduce((acc, task) => {
        acc[task.department] = acc[task.department] || {
          department: task.department,
          total: 0,
        };
        acc[task.department].total += 1;
        return acc;
      }, {}),
    );

    doc.text("Department Task Distribution", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Department", "Total Tasks"]],
      body: departmentData.map((d) => [d.department, d.total]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // ===== EMPLOYEE PERFORMANCE TABLE =====
    doc.text("Employee Task Performance", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Employee Email", "Department", "Status", "Due Date"]],
      body: tasks.map((t) => [
        t.employeeEmail,
        t.department,
        t.status,
        new Date(t.dueDate).toLocaleDateString(),
      ]),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 },
    });

    // ===== FOOTER =====
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Generated by TaskHub Task Management System",
      14,
      pageHeight - 10,
    );

    doc.save("TaskHub_Analytics_Report.pdf");
  };

  const statusData = [
    {
      name: "Pending",
      value: Math.max(tasks.filter((t) => t.status === "Pending").length, 0.1),
    },
    {
      name: "Completed",
      value: Math.max(
        tasks.filter((t) => t.status === "Completed").length,
        0.1,
      ),
    },
    {
      name: "Failed",
      value: Math.max(tasks.filter((t) => t.status === "Failed").length, 0.1),
    },
  ];

  const COLORS = [
    "#facc15", // Pending (yellow)
    "#22c55e", // Completed (green)
    "#ef4444", // Failed (red)
  ];

  const departmentGrouped = tasks.reduce((acc, task) => {
    acc[task.department] = acc[task.department] || [];
    acc[task.department].push(task);
    return acc;
  }, {});

  if (loading) return <Loader />;

  const getFileIcon = (filename) => {
    if (!filename) return <FaFile className="text-gray-400" />;

    const ext = filename.split(".").pop().toLowerCase();

    if (ext === "pdf") return <FaFilePdf className="text-red-500 text-lg" />;

    if (ext === "doc" || ext === "docx")
      return <FaFileWord className="text-blue-500 text-lg" />;

    if (ext === "xls" || ext === "xlsx")
      return <FaFileExcel className="text-green-500 text-lg" />;

    if (ext === "ppt" || ext === "pptx")
      return <FaFilePowerpoint className="text-orange-500 text-lg" />;

    return <FaFile className="text-gray-400 text-lg" />;
  };

  const STATUS_CONFIG = {
    Completed: {
      gradient: "from-[#052e1b] via-[#052e1b] to-[#020617]",
      glow: "shadow-[0_0_40px_rgba(34,197,94,0.5)]",
      border: "border-green-500/40",
      badge: "bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.9)]",
      button:
        "bg-green-500 hover:bg-green-600 shadow-[0_0_25px_rgba(34,197,94,0.7)]",
    },

    Pending: {
      gradient: "from-[#3b2f00] via-[#1f1b02] to-[#020617]",
      glow: "shadow-[0_0_40px_rgba(250,204,21,0.45)]",
      border: "border-yellow-400/40",
      badge:
        "bg-yellow-400 text-black shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-pulse",
      button:
        "bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_0_25px_rgba(250,204,21,0.7)]",
    },

    Failed: {
      gradient: "from-[#3a0d0d] via-[#1a0a0a] to-[#020617]",
      glow: "shadow-[0_0_40px_rgba(239,68,68,0.45)]",
      border: "border-red-500/40",
      badge: "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.9)]",
      button:
        "bg-red-500 hover:bg-red-600 shadow-[0_0_25px_rgba(239,68,68,0.7)]",
    },
  };

  const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  const departments = [
    { name: "IT", icon: Code2 },
    { name: "HR", icon: Users },
    { name: "Finance", icon: DollarSign },
    { name: "Marketing", icon: Megaphone },
    { name: "Sales", icon: ShoppingCart },
    { name: "Operations", icon: Settings },
    { name: "Management", icon: Briefcase },
    { name: "Support", icon: Headphones },
    { name: "Product Design", icon: Cpu },
    { name: "Design", icon: PenTool },
    { name: "Customer Success", icon: UserCheck },
    { name: "Data Analytics", icon: BarChart3 },
    { name: "Cyber Security", icon: ShieldCheck },
    { name: "Legal", icon: Scale },
    { name: "Procurement", icon: ClipboardCheck },
    { name: "Public Relations", icon: Megaphone },
    { name: "Quality Assurance", icon: ClipboardCheck },
    { name: "Research", icon: FlaskConical },
    { name: "Strategy", icon: Network },
    { name: "Training", icon: GraduationCap },

    // Corporate / Business

    { name: "Business Development", icon: TrendingUp },
    { name: "Investor Relations", icon: Landmark },
    { name: "Compliance", icon: Shield },
    { name: "Risk Management", icon: AlertTriangle },
    { name: "Internal Audit", icon: Search },
    { name: "Administration", icon: Building2 },
    { name: "Facilities Management", icon: Building },
    { name: "Logistics", icon: Truck },
    { name: "Supply Chain", icon: Package },
    { name: "Inventory", icon: Archive },
    { name: "Project Management", icon: Kanban },
    { name: "Product Management", icon: Layers },
    { name: "UX Research", icon: Eye },
    { name: "UI Design", icon: Palette },
    { name: "DevOps", icon: GitBranch },
    { name: "Cloud Engineering", icon: Cloud },
    { name: "AI & Machine Learning", icon: Brain },
    { name: "Mobile Development", icon: Smartphone },
    { name: "Web Development", icon: Globe },
    { name: "Technical Support", icon: Wrench },

    // Education / College

    { name: "Computer Science", icon: Laptop },
    { name: "Information Technology", icon: Server },
    { name: "Mechanical Engineering", icon: Cog },
    { name: "Civil Engineering", icon: Building },
    { name: "Electrical Engineering", icon: Zap },
    { name: "Electronics Engineering", icon: Cpu },
    { name: "Biotechnology", icon: Dna },
    { name: "Physics", icon: Atom },
    { name: "Chemistry", icon: FlaskConical },
    { name: "Mathematics", icon: Sigma },
    { name: "English Department", icon: BookOpen },
    { name: "Economics", icon: LineChart },
    { name: "Commerce", icon: Wallet },
    { name: "Business Administration", icon: Briefcase },
    { name: "Management Studies", icon: Network },
    { name: "Library", icon: Library },
    { name: "Examination Cell", icon: FileCheck },
    { name: "Student Affairs", icon: Users2 },
    { name: "Placement Cell", icon: GraduationCap },
    { name: "Admissions", icon: UserPlus },
    { name: "Hostel Management", icon: Home },
    { name: "Sports Department", icon: Trophy },
    { name: "Cultural Activities", icon: Music },
    { name: "Research & Development", icon: Microscope },
    { name: "Academic Coordination", icon: BookMarked },
    { name: "Alumni Relations", icon: UsersRound },
    { name: "International Programs", icon: Globe2 },
    { name: "Career Services", icon: Briefcase },
    { name: "Faculty Affairs", icon: UserCog },
    { name: "Innovation Lab", icon: Lightbulb },
  ];
  const departmentIcons = {
    IT: Code2,
    HR: Users,
    Finance: DollarSign,
    Marketing: Megaphone,
    Sales: ShoppingCart,
    Operations: Settings,
    Management: Briefcase,
    Support: Headphones,
  };
  // ===== Card Animation =====
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.08,
        duration: 0.45,
        ease: "easeOut",
      },
    }),
  };

  return (
<div className="flex flex-col md:flex-row">
  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
<div
className={`
relative w-full
transition-all duration-300
${collapsed ? "md:ml-20" : "md:ml-72"}
p-4 sm:p-6 md:p-10
min-h-screen space-y-10
bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827]
overflow-hidden
`}
>
        {/* Background ambient glow */}
        <div
          className="absolute inset-0 -z-10
bg-[radial-gradient(circle_at_20%_20%,#3b82f630,transparent_40%),
radial-gradient(circle_at_80%_70%,#9333ea30,transparent_40%)]"
        />

{/* ================= ULTRA PREMIUM ADMIN HEADER ================= */}

{/* ================= PREMIUM ADMIN DASHBOARD HEADER ================= */}

<div
className="
relative
rounded-3xl
p-5 sm:p-8 md:p-10
mb-10
bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#022c22]
border border-white/10
shadow-[0_35px_100px_rgba(0,0,0,0.9)]
backdrop-blur-xl
overflow-hidden
"
>

{/* Top Animated Gradient Line */}

<div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-green-500 to-blue-600"/>

{/* Ambient Glow Effects */}

<div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-500/20 blur-[160px] rounded-full"/>
<div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-green-500/20 blur-[160px] rounded-full"/>

<div className="relative z-10 flex flex-col xl:flex-row gap-8 xl:items-center xl:justify-between">

{/* ================= LEFT CONTENT ================= */}

<div className="flex flex-col gap-6 max-w-3xl">

{/* TITLE ROW */}

<div className="flex items-center gap-4">

{/* Icon */}

<div
className="
flex items-center justify-center
w-12 h-12 sm:w-14 sm:h-14
rounded-xl
bg-gradient-to-br from-blue-500/20 to-green-500/20
border border-white/10
shadow-lg
"
>
<span className="text-xl sm:text-2xl">🧑‍💻</span>
</div>

{/* Title */}

<div>

<div className="flex items-center gap-2">

<span className="text-lg">⚡</span>

<h1
className="
text-lg sm:text-xl md:text-2xl lg:text-3xl
font-bold
bg-gradient-to-r
from-blue-400
via-green-400
to-blue-500
bg-clip-text
text-transparent
tracking-wide
"
>
Admin Control Dashboard
</h1>

</div>

<p className="text-gray-400 text-xs sm:text-sm mt-1">
Manage employees, monitor tasks, and analyze performance insights across departments.
</p>

</div>

</div>

{/* ================= ADMIN PROFILE CARD ================= */}

<div
className="
w-full
max-w-xl
p-5
rounded-2xl
bg-gradient-to-r from-white/5 to-white/[0.02]
border border-white/10
shadow-[0_20px_60px_rgba(0,0,0,0.7)]
backdrop-blur-xl
"
>

<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

{/* Avatar */}

<div
className="
w-12 h-12
flex items-center justify-center
rounded-full
bg-gradient-to-br from-blue-500 to-green-500
text-white font-semibold
shadow-lg
"
>
{user?.name?.charAt(0)}
</div>

{/* User Info */}

<div className="flex-1">

<p className="text-white font-semibold text-sm sm:text-base">
{user?.name}
</p>

<p className="text-green-300 text-xs sm:text-sm">
{user?.email}
</p>

</div>

{/* Role */}

<div>

<p className="text-[10px] text-gray-400 uppercase tracking-wider">
Role
</p>

<p className="text-blue-400 text-sm font-medium">
{user?.role}
</p>

</div>

{/* Department */}

<div>

<p className="text-[10px] text-gray-400 uppercase tracking-wider">
Department
</p>

<p className="text-green-400 text-sm font-medium">
{user?.department}
</p>

</div>

</div>

</div>

{/* Description */}

<p className="text-gray-400 text-xs sm:text-sm max-w-xl">
Monitor employee productivity, manage departmental tasks and track real-time performance metrics from one centralized control panel.
</p>

</div>


{/* ================= RIGHT BADGE ================= */}

<div
className="
hidden xl:flex
items-center gap-2
px-5 py-2
rounded-lg
bg-gradient-to-r from-blue-500/10 to-green-500/10
border border-green-500/20
text-green-400
text-xs font-semibold
tracking-wider
backdrop-blur-xl
shadow-[0_0_30px_rgba(34,197,94,0.25)]
"
>

<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

ADMIN PANEL

</div>

</div>

</div>

        {/* ================= DASHBOARD INSIGHTS ================= */}

        <div className="relative mb-10">
          {/* Glow Border */}
          <div
            className="
  absolute inset-0 rounded-2xl
  bg-gradient-to-r from-blue-600 via-blue-500 to-green-500
  opacity-20 blur-xl
  "
          ></div>

          <div
            className="
  relative
  rounded-2xl
  p-8
  bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#052e16]
  border border-blue-500/20
  backdrop-blur-xl
  shadow-[0_20px_60px_rgba(0,0,0,0.7)]
  "
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="
    w-10 h-10
    flex items-center justify-center
    rounded-lg
    bg-blue-500/10
    border border-blue-500/30
    "
              >
                <BarChart3 className="text-blue-400" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white tracking-wide">
                  Performance Insights
                </h2>

                <p className="text-gray-300 text-sm mt-1 max-w-xl">
                  Monitor task productivity, analyze department workload, and
                  track real-time performance metrics across your organization.
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {/* TOTAL TASKS */}
              <div
                className="
    p-6 rounded-xl
    bg-[#0f172a]
    border border-blue-500/20
    hover:border-blue-400/40
    transition-all
    "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      TOTAL TASKS
                    </p>

                    <p className="text-3xl font-semibold text-white mt-1">
                      {tasks.length}
                    </p>
                  </div>

                  <div
                    className="
        w-10 h-10 rounded-lg
        flex items-center justify-center
        bg-blue-500/10
        border border-blue-500/30
        "
                  >
                    <BarChart3 className="text-blue-400" />
                  </div>
                </div>
              </div>

              {/* COMPLETED */}
              <div
                className="
    p-6 rounded-xl
    bg-[#052e16]
    border border-green-500/20
    hover:border-green-400/40
    transition-all
    "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      COMPLETED
                    </p>

                    <p className="text-3xl font-semibold text-green-400 mt-1">
                      {tasks.filter((t) => t.status === "Completed").length}
                    </p>
                  </div>

                  <div
                    className="
        w-10 h-10 rounded-lg
        flex items-center justify-center
        bg-green-500/10
        border border-green-500/30
        "
                  >
                    <CheckCircle2 className="text-green-400" />
                  </div>
                </div>
              </div>

              {/* PENDING */}
              <div
                className="
    p-6 rounded-xl
    bg-[#1e293b]
    border border-yellow-500/20
    hover:border-yellow-400/40
    transition-all
    "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      PENDING
                    </p>

                    <p className="text-3xl font-semibold text-yellow-400 mt-1">
                      {tasks.filter((t) => t.status === "Pending").length}
                    </p>
                  </div>

                  <div
                    className="
        w-10 h-10 rounded-lg
        flex items-center justify-center
        bg-yellow-500/10
        border border-yellow-500/30
        "
                  >
                    <Clock className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ANALYTICS SECTION ================= */}
<div ref={analyticsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-10">
          {/* ================= PIE CHART CARD ================= */}
          <div
            className="
    relative group
    rounded-2xl
    p-8
    bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827]
    border border-white/10
    shadow-[0_25px_80px_rgba(0,0,0,0.9)]
    hover:-translate-y-1
    transition-all duration-300
  "
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-t-2xl"></div>

            {/* Glow Effects */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  📊 Task Status Distribution
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  Overview of task completion performance
                </p>
              </div>

              {/* Chart Container */}
              <div
className="
relative
flex justify-center items-center
rounded-xl
bg-black/30
border border-white/10
p-4 sm:p-6
h-auto
"
>
              
                <div id="taskPieChart">
                  <PieChart width={280} height={240}>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      stroke="#0f172a"
                      strokeWidth={3}
                      label={renderLabel}
                      labelLine={false}
                      animationDuration={900}
                      activeIndex={activeIndex}
                      activeOuterRadius={110}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {statusData.map((entry, index) => {
                        const colorMap = {
                          Pending: "#facc15",
                          Completed: "#22c55e",
                          Failed: "#ef4444",
                        };

                        return <Cell key={index} fill={colorMap[entry.name]} />;
                      })}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        padding: "8px 12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                      }}
                      itemStyle={{
                        color: "#e5e7eb",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      labelStyle={{
                        color: "#9ca3af",
                      }}
                    />
                  </PieChart>

                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xs text-gray-400">Total Tasks</p>
                    <p className="text-xl font-semibold text-white">
                      {tasks.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BAR CHART CARD ================= */}
          <div
            className="
    relative group
    rounded-2xl
    p-8
    bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827]
    border border-white/10
    shadow-[0_25px_80px_rgba(0,0,0,0.9)]
    hover:-translate-y-1
    transition-all duration-300
  "
          >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-400 rounded-t-2xl"></div>

            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  🏛 Department Task Count
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  Distribution of tasks across departments
                </p>
              </div>

              <div
                className="
        flex justify-center
        rounded-xl
        bg-black/30
        border border-white/10
        p-6
      "
              >
                <div id="departmentBarChart">
<BarChart
  width={320}
  height={260}
                    data={Object.values(
                      tasks.reduce((acc, task) => {
                        acc[task.department] = acc[task.department] || {
                          department: task.department,
                          total: 0,
                        };

                        acc[task.department].total += 1;

                        return acc;
                      }, {}),
                    )}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />

                    <XAxis
                      dataKey="department"
                      stroke="#9ca3af"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />

                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#fff",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                    />

                    <Bar
                      dataKey="total"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={900}
                    />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DOWNLOAD REPORT CARD ================= */}

        <div ref={downloadRef}
          className="
  relative flex flex-col md:flex-row
items-start md:items-center
flex-wrap
  justify-between
  gap-4
  mt-10
  px-8 py-6
  rounded-2xl
  bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#111827]
  border border-blue-500/20
  shadow-[0_25px_80px_rgba(0,0,0,0.9)]
  hover:border-blue-400/40
  transition-all duration-300
"
        >
          {/* Glow */}
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-500/20 blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              📄 Download Dashboard Report
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Export analytics including tasks, department statistics and
              employee performance.
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="
    relative z-10
    flex items-center gap-2
    px-6 py-3
    rounded-lg
    bg-blue-600
    hover:bg-blue-700
    text-white
    text-sm
    font-medium
    shadow-[0_15px_40px_rgba(37,99,235,0.4)]
    transition-all
  "
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        {/* ================= TASK ASSIGNMENT HEADER ================= */}

        <div ref={assignRef} className="relative mb-10 group">
          {/* Animated Border Glow */}
          <div
            className="
  absolute inset-0 rounded-2xl
  bg-gradient-to-r from-red-600 via-purple-600 to-green-600
  opacity-30 blur-xl
  group-hover:opacity-60
  transition duration-500
  "
          ></div>

          {/* Main Card */}
          <div
            className="
  relative
  flex items-center justify-between
  px-8 py-6
  rounded-2xl
  bg-gradient-to-r from-[#2b0a0a] via-[#0f172a] to-[#052e16]
  border border-white/10
  backdrop-blur-xl
  shadow-[0_25px_70px_rgba(0,0,0,0.8)]
  hover:-translate-y-1
  hover:shadow-[0_35px_90px_rgba(0,0,0,0.9)]
  transition-all duration-500
  overflow-hidden
  "
          >
            {/* Floating Glow Effects */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-500/20 blur-3xl"></div>

            {/* LEFT CONTENT */}
            <div className="relative flex items-center gap-5">
              {/* Animated Icon */}
              <div
                className="
    w-14 h-14
    flex items-center justify-center
    rounded-xl
    bg-gradient-to-br from-red-500/20 to-green-500/20
    border border-white/10
    text-2xl
    shadow-lg
    group-hover:scale-110
    group-hover:rotate-6
    transition-all duration-500
    "
              >
                🧠
              </div>

              {/* Title + Message */}
              <div>
                <h2
                  className="
      text-xl md:text-2xl
      font-semibold
      text-white
      tracking-wide
      group-hover:text-green-400
      transition
      "
                >
                  Task Assignment Center
                </h2>

                <p className="text-gray-400 text-sm mt-1 max-w-xl leading-relaxed">
                  Efficiently create, assign and monitor tasks across
                  departments. Maintain real-time productivity insights and
                  streamline collaboration across your organization.
                </p>
              </div>
            </div>

            {/* RIGHT STATUS PILL */}
            <div
              className="
  hidden md:flex
  items-center gap-2
  px-4 py-2
  rounded-lg
  bg-green-500/10
  border border-green-500/30
  text-green-400
  text-sm
  font-medium
  backdrop-blur
  group-hover:scale-105
  transition-all duration-300
  "
            >
              ⚡ Live Task Control
            </div>
          </div>
        </div>

        {/* Assign Task Form */}
        <form
          onSubmit={handleAssign}
          className="
  relative max-w-4xl mx-auto mb-16
  rounded-3xl p-10
  bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827]
  border border-white/10
  shadow-[0_35px_120px_rgba(0,0,0,0.9)]
  overflow-hidden
"
        >
          {/* Blue Glow */}
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-600/20 blur-[160px] rounded-full"></div>

          {/* Purple Glow */}
          <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-purple-600/20 blur-[160px] rounded-full"></div>

          <div className="relative z-10">
            {/* Header */}
            <div
              className="
      rounded-2xl px-8 py-6 mb-10
      bg-gradient-to-r from-blue-900/30 to-purple-900/30
      border border-white/10
      backdrop-blur-xl
      shadow-lg
      "
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-600/20">
                  <Briefcase size={22} className="text-blue-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Assign New Task
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    Create and distribute tasks across departments.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Employee Email */}
              <div className="relative col-span-2">
                <Mail
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />

                <input
                  type="email"
                  value={form.employeeEmail}
                  onChange={(e) =>
                    setForm({ ...form, employeeEmail: e.target.value })
                  }
                  placeholder="Employee Email"
                  className="
          w-full pl-12 pr-4 py-3
          rounded-xl
          bg-[#0f172a]
          text-white
          border border-white/10
          focus:border-blue-500
          focus:ring-1 focus:ring-blue-500
          outline-none
          transition
          "
                  required
                />
              </div>

              {/* Department */}
              <div className="relative col-span-2">
                <Building2
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />

                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="
    w-full pl-12 pr-4 py-3
    rounded-xl
    bg-[#0f172a]
    text-white
    border border-white/10
    focus:border-purple-500
    outline-none
    transition
    "
                  required
                >
                  <option value="">Select Department</option>

                  {departments.map((dept) => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned Date */}
              <div className="relative">
                <CalendarDays
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="
          w-full pl-12 pr-4 py-3
          rounded-xl
          bg-[#0f172a]
          text-white
          border border-white/10
          focus:border-blue-500
          outline-none
          transition
          "
                  required
                />
              </div>

              {/* Deadline Date */}
              <div className="relative">
                <CalendarDays
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="
          w-full pl-12 pr-4 py-3
          rounded-xl
          bg-[#0f172a]
          text-white
          border border-white/10
          focus:border-purple-500
          outline-none
          transition
          "
                  required
                />
              </div>

              {/* Description */}
              <div className="relative col-span-2">
                <ClipboardList
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />

                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Task Description"
                  className="
          w-full pl-12 pr-4 py-3
          rounded-xl
          bg-[#0f172a]
          text-white
          border border-white/10
          focus:border-purple-500
          outline-none
          transition
          "
                  required
                />
              </div>

              {/* File Upload */}
<div className="col-span-2 space-y-3">

<label
className="
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
w-full px-4 py-3
rounded-xl
bg-[#0f172a]
border border-white/10
hover:border-blue-500
transition
cursor-pointer
"
>

<div className="flex items-center gap-2 text-gray-400">
<Upload size={16}/>
<span>
{files.length > 0
? `${files.length} file(s) selected`
: "Upload Task Files"}
</span>
</div>

<span className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white">
Browse
</span>

<input
type="file"
multiple
onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
className="hidden"
/>

</label>

{/* Selected Files List */}

{files.length > 0 && (

<div className="space-y-2">

{files.map((file,index)=>(
<div
key={index}
className="
flex items-center justify-between
bg-[#020617]
border border-white/10
rounded-lg
px-3 py-2
text-sm
"
>

<div className="flex items-center gap-2 text-gray-300 truncate">
<FileText size={16}/>
<span className="truncate">{file.name}</span>
</div>

<button
type="button"
onClick={() => setFiles(files.filter((_,i)=>i!==index))}
className="
text-red-400
hover:text-red-300
transition
"
>
<Trash2 size={16}/>
</button>

</div>
))}

</div>

)}

</div>

              {/* Assign Button */}
              <button
                type="submit"
                className="
        col-span-2 mt-6
        flex items-center justify-center gap-2
        py-3.5
        rounded-xl
        bg-gradient-to-r from-blue-600 to-purple-600
        text-white font-semibold
        shadow-[0_20px_50px_rgba(59,130,246,0.35)]
        hover:scale-[1.02]
        hover:shadow-[0_25px_70px_rgba(147,51,234,0.35)]
        transition-all duration-300
        "
              >
                <Send size={18} />
                Assign Task
              </button>
            </div>
          </div>
        </form>

        {/* ======================= TASK CARDS SECTION ======================= */}
        <div ref={tasksRef} className="mt-16">
          {/* Section Header */}
          <div
            className="
    relative overflow-hidden
    rounded-2xl p-8 mb-10
    bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#020617]
    border border-white/10
    shadow-[0_25px_80px_rgba(0,0,0,0.8)]
  "
          >
            <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-600/20 blur-3xl"></div>
            <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-600/20 blur-3xl"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-wide flex items-center gap-2">
                  📋 Task Management Cards
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Department wise task overview and employee submissions
                </p>
              </div>

              <div
                className="
        hidden md:flex
        px-4 py-2
        rounded-lg
        bg-blue-600/20
        text-blue-400
        text-sm
      "
              >
                Admin Control
              </div>
            </div>
          </div>

          {/* Department Groups */}
          {Object.entries(departmentGrouped).map(([dept, deptTasks]) => {
            const DeptIcon = departmentIcons?.[dept] || Briefcase;

            return (
              <div key={dept} className="mb-12">
                {/* Department Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

                  <h3 className="text-lg font-semibold text-blue-400 tracking-wide flex items-center gap-2">
                    <DeptIcon size={18} />
                    {dept} Department
                  </h3>
                </div>

                {/* Responsive Task Grid */}
                <div
                  className="
          grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-2
xl:grid-cols-3
gap-5 md:gap-6
        "
                >
                  {deptTasks.map((task, index) => {
                    const style =
                      STATUS_CONFIG[task.status] || STATUS_CONFIG.Pending;

                    return (
                      <motion.div
                        key={task._id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`
  relative
  rounded-2xl
  p-6
  overflow-hidden
  border
  transition-all duration-300

  ${
    task.status === "Completed"
      ? "bg-gradient-to-br from-[#052e1b] via-[#052e1b] to-[#020617] border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.45)]"
      : task.status === "Pending"
        ? "bg-gradient-to-br from-[#3b2f00] via-[#1f1b02] to-[#020617] border-yellow-400/40 shadow-[0_0_40px_rgba(250,204,21,0.45)]"
        : "bg-gradient-to-br from-[#3a0d0d] via-[#1a0a0a] to-[#020617] border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.45)]"
  }
  `}
                      >
                        {/* Neon Status Glow */}
                        <div
                          className={`
                  absolute inset-0 opacity-30 blur-3xl
                  ${
                    task.status === "Completed"
                      ? "bg-green-500/30"
                      : task.status === "Pending"
                        ? "bg-yellow-400/30"
                        : "bg-red-500/30"
                  }
                  `}
                        ></div>

                        {/* Glass Overlay */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                        {/* Card Content */}
                        <div className="relative z-10 space-y-6">
                          {/* Title */}
                          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            📌 <span className="break-words">{task.description}</span>
                          </h3>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              {task.employeeEmail}
                            </div>

                            <div className="flex items-center gap-2">
                              <Building2 size={16} />
                              {task.department}
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>

                            {/* Status */}
                            <div>
                              <span
                                className={`
                        px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit

                        ${
                          task.status === "Completed"
                            ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                            : task.status === "Pending"
                              ? "bg-yellow-400 text-black animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.9)]"
                              : "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                        }
                        `}
                              >
                                {task.status === "Completed" && (
                                  <CheckCircle size={14} />
                                )}

                                {task.status}
                              </span>
                            </div>
                          </div>

                          {/* Admin Attachments */}

                          {task.adminFiles && task.adminFiles.length > 0 && (
                            <div
                              className="
p-4
rounded-xl
bg-black/40
border border-white/10
space-y-2
"
                            >
                              <p className="text-xs text-gray-400">
                                Admin Attachments
                              </p>

                              {task.adminFiles.map((file, index) => (
                                <a
                                  key={index}
                                  href={`https://taskhub-3-i600.onrender.com/uploads/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  {getFileIcon(file)}

                                  <span className="truncate">{file}</span>
                                </a>
                              ))}
                            </div>
                          )}

{/* Employee Submissions */}
{task.employeeSubmissions && task.employeeSubmissions.length > 0 && (

<div
className="
p-4
rounded-xl
bg-black/40
border border-white/10
space-y-3
"
>

<p className="text-xs text-gray-400 mb-1">
Employee Submissions
</p>

{task.employeeSubmissions.map((file, index) => (

<div
key={index}
className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
>

<a
href={`https://taskhub-3-i600.onrender.com/uploads/${file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-green-400 text-sm hover:text-green-300"
>

{getFileIcon(file)}

<span className="truncate">{file}</span>

</a>

<div className="flex gap-3">

<a
href={`https://taskhub-3-i600.onrender.com/uploads/${file}`}
target="_blank"
className="text-green-400 hover:text-green-300"
>

<Download size={18}/>

</a>

<button className="text-red-400 hover:text-red-300">

<Trash2 size={18}/>

</button>

</div>

</div>

))}

</div>

)}
                          {/* Remove Button */}
                          <button
                            onClick={() => handleDelete(task._id)}
                            className={`
                    w-full py-3 rounded-xl font-medium text-white transition-all

                    ${
                      task.status === "Completed"
                        ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:bg-green-600"
                        : task.status === "Pending"
                          ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.7)] hover:bg-yellow-500"
                          : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] hover:bg-red-600"
                    }
                    `}
                          >
                            Remove Task
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= EXTENSION REQUESTS HEADER ================= */}

        <div className="relative mb-10 group">
          {/* Animated Border Glow */}
          <div
            className="
  absolute inset-0 rounded-2xl
  bg-gradient-to-r from-red-600 via-green-600 to-red-600
  opacity-30 blur-xl
  group-hover:opacity-60
  transition duration-500
  "
          ></div>

          {/* Main Card */}
          <div
            className="
  relative
  flex items-center justify-between
  px-8 py-6
  rounded-2xl
  bg-gradient-to-r from-[#052e16] via-[#0f172a] to-[#2b0a0a]
  border border-white/10
  backdrop-blur-xl
  shadow-[0_25px_70px_rgba(0,0,0,0.8)]
  hover:-translate-y-1
  hover:shadow-[0_35px_90px_rgba(0,0,0,0.9)]
  transition-all duration-500
  overflow-hidden
  "
          >
            {/* Floating Glow Effects */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-red-500/20 blur-3xl"></div>

            {/* LEFT CONTENT */}
            <div className="relative flex items-center gap-5">
              {/* Animated Icon */}
              <div
                className="
    w-14 h-14
    flex items-center justify-center
    rounded-xl
    bg-gradient-to-br from-green-500/20 to-red-500/20
    border border-white/10
    text-2xl
    shadow-lg
    group-hover:scale-110
    group-hover:-rotate-6
    transition-all duration-500
    "
              >
                📂
              </div>

              {/* Title + Message */}
              <div>
                <h2
                  className="
      text-xl md:text-2xl
      font-semibold
      text-white
      tracking-wide
      group-hover:text-green-400
      transition
      "
                >
                  Extension Management
                </h2>

                <p className="text-gray-400 text-sm mt-1 max-w-xl leading-relaxed">
                  Review employee extension requests, evaluate task constraints,
                  and provide approvals or instructions to ensure workflow
                  continuity and deadline transparency across teams.
                </p>
              </div>
            </div>

            {/* RIGHT STATUS PILL */}
            <div
              className="
  hidden md:flex
  items-center gap-2
  px-4 py-2
  rounded-lg
  bg-red-500/10
  border border-red-500/30
  text-red-400
  text-sm
  font-medium
  backdrop-blur
  group-hover:scale-105
  transition-all duration-300
  "
            >
              ⚠ Pending Reviews
            </div>
          </div>
        </div>

        {/* ================= EXTENSION PANEL ================= */}

       <div ref={extensionsRef} className="mt-16">

{/* Header */}
<div
className="
relative
mb-10
p-5 md:p-6
rounded-2xl
bg-gradient-to-r from-[#0b1a35] via-[#0e234a] to-[#0b1a35]
border border-blue-900
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
overflow-hidden
"
>

{/* Top Accent Line */}
<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"/>

{/* Background glow */}
<div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 blur-3xl"></div>
<div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 blur-3xl"></div>

<div className="relative flex items-center justify-between flex-wrap gap-4">

{/* LEFT SIDE */}
<div className="flex items-center gap-4">

{/* Icon */}
<div
className="
w-11 h-11
flex items-center justify-center
rounded-xl
bg-blue-600/20
border border-blue-500/40
shadow-md
"
>
<FileText size={20} className="text-blue-400"/>
</div>

{/* Title */}
<div>

<h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
Extension Requests
</h2>

<p className="text-gray-400 text-sm">
Review employee extension requests and approve or reject them.
</p>

</div>

</div>


{/* RIGHT SIDE BADGE */}
<div
className="
flex items-center gap-2
px-4 py-2
rounded-lg
bg-blue-600/15
border border-blue-500/30
text-blue-400
text-xs font-semibold
tracking-wider
"
>

<span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>

PENDING REQUESTS

</div>

</div>

</div>

{/* Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
{extensions
.filter((ext) => ext.status === "Pending")
.map((ext) => (

<div
key={ext._id}
className="
group relative rounded-2xl p-6
bg-[#0b1a35]
border border-blue-900
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
transition-all duration-300
hover:-translate-y-1
hover:shadow-[0_30px_90px_rgba(0,0,0,0.9)]
"
>

<div className="space-y-6 text-sm">

{/* EMPLOYEE + DATE */}
<div className="flex items-center justify-between">

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-900 border border-blue-700">
<Mail size={18} className="text-blue-300" />
</div>

<div>
<p className="text-xs text-gray-100 uppercase tracking-wider">
Employee Mail
</p>

<p className="text-white font-semibold text-lg">
{ext.employee?.email ||
ext.task?.employeeEmail ||
"N/A"}
</p>
</div>

</div>

{/* DEMAND DATE */}
<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#10244d] border border-blue-700">

<CalendarDays size={14} className="text-blue-300"/>

<div>
<p className="text-[10px] text-gray-100 leading-none">
Demand Date
</p>

<p className="text-blue-300 text-xs font-medium">
{ext.requestedDate
? new Date(ext.requestedDate).toLocaleDateString()
: "N/A"}
</p>

</div>

</div>

</div>


{/* EMPLOYEE DEPARTMENT */}
<div className="
flex items-center gap-3
p-4 rounded-xl
bg-[#0e234a]
border border-blue-900
">

<Building2 size={18} className="text-purple-400" />

<div>
<p className="text-xs text-blue-400">
Employee Department
</p>

<p className="text-white font-medium">
{ext.task?.department || "N/A"}
</p>
</div>

</div>


{/* REASON */}
<div className="
p-4 rounded-xl
bg-[#0e234a]
border border-blue-900
">

<p className="text-gray-100 text-xs mb-2 flex items-center gap-2">

<MessageSquare size={14} />

Reason for Extension

</p>

<p className="text-gray-200 leading-relaxed">
{ext.reason}
</p>

</div>


{/* EXTENSION SUPPORTING DOCS */}
{ext.proofFile && (

<div className="space-y-2">

<p className="text-xs text-gray-100 uppercase tracking-wider">
Extension Supporting Docs
</p>

<a
href={`https://taskhub-3-i600.onrender.com/uploads/${ext.proofFile}`}
target="_blank"
rel="noopener noreferrer"
className="
flex items-center gap-3 px-4 py-3 rounded-xl
bg-[#10244d]
border border-blue-700
hover:bg-[#153067]
transition
"
>

<FileText size={16} className="text-blue-300" />

<span className="text-blue-300 text-sm truncate">
{ext.proofFile}
</span>

</a>

</div>

)}


{/* ENTER MESSAGE */}
<div className="space-y-2">

<p className="text-xs text-gray-100 uppercase tracking-wider">
Enter Your Message
</p>

<textarea
placeholder="Write instruction for employee..."
value={instruction[ext._id] || ""}
onChange={(e) =>
setInstruction({
...instruction,
[ext._id]: e.target.value,
})
}
className="
w-full p-3 rounded-xl
bg-[#0e234a]
text-white
border border-blue-900
focus:outline-none
focus:border-blue-500
transition
"
/>

</div>


{/* BUTTONS */}
<div className="flex gap-4 pt-2">

<button
onClick={() =>
handleExtensionDecision(ext._id, "Approved")
}
disabled={
!instruction[ext._id] ||
instruction[ext._id].trim() === ""
}
className={`flex-1 py-3 rounded-xl font-semibold
flex items-center justify-center gap-2
transition-all

${
instruction[ext._id] &&
instruction[ext._id].trim() !== ""
? "bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/40"
: "bg-gray-700 text-gray-400 cursor-not-allowed"
}
`}
>

<CheckCircle2 size={18} />
Approve

</button>


<button
onClick={() =>
handleExtensionDecision(ext._id, "Rejected")
}
disabled={
!instruction[ext._id] ||
instruction[ext._id].trim() === ""
}
className={`flex-1 py-3 rounded-xl font-semibold
flex items-center justify-center gap-2
transition-all

${
instruction[ext._id] &&
instruction[ext._id].trim() !== ""
? "bg-red-600 hover:bg-red-500 shadow-lg hover:shadow-red-500/40"
: "bg-gray-700 text-gray-400 cursor-not-allowed"
}
`}
>

<XCircle size={18} />
Reject

</button>

</div>

</div>

</div>

))}
</div>
        </div>
      </div>{" "}
      {/* END Dashboard Content */}
    </div>
  );
}

export default AdminDashboard;
