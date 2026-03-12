import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import EmployeeSidebar from "../components/EmployeeSidebar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Calendar,
  Building2,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  ClipboardList,
  Send,
  Trash2
} from "lucide-react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFile
} from "react-icons/fa";

function EmployeeDashboard() {
  const location = useLocation();
const query = new URLSearchParams(location.search);
const view = query.get("view");
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [extensionData, setExtensionData] = useState({});
  const [reason, setReason] = useState({});
  const [extensionFile, setExtensionFile] = useState({});
const [completionFiles, setCompletionFiles] = useState({});
const completedRef = useRef(null);
const failedRef = useRef(null);

const fetchTasks = async () => {
  try {
    const res = await API.get("/tasks");
    setTasks(res.data);
  } catch (error) {
    toast.error("Failed to load tasks");
  }
};

useEffect(() => {

  if (view === "completed" && completedRef.current) {
    completedRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  else if (view === "failed" && failedRef.current) {
    failedRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  else {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

}, [view]);

useEffect(() => {
  fetchTasks();
}, []);

  const handleComplete = async (id) => {
    try {
      const formData = new FormData();

      // attach file if employee selected one
      if (completionFiles[id]) {
  completionFiles[id].forEach((file) => {
    formData.append("files", file);
  });
}

      await API.put(`/tasks/complete/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Task marked as completed");

      fetchTasks();
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const handleExtensionRequest = async (id) => {
    if (!extensionData[id] || !reason[id]) {
      return toast.error("Please select date and enter reason");
    }

    try {
      const formData = new FormData();
      formData.append("requestedDate", extensionData[id]);
      formData.append("reason", reason[id]);

      // ✅ Attach file if selected
      if (extensionFile[id]) {
        formData.append("file", extensionFile[id]);
      }

      await API.post(`/extensions/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Extension requested");
      fetchTasks();
    } catch (error) {
      toast.error("Extension request failed");
    }
  };

  // ✅ Premium Gradient Status Colors
  const getStatusColor = (status) => {
    if (status === "Completed")
      return "bg-gradient-to-br from-green-600 to-green-800 text-white";

    if (status === "Pending")
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black";

    if (status === "Awaiting Approval")
      return "bg-gradient-to-br from-orange-500 to-orange-700 text-white";

    if (status === "Failed")
      return "bg-gradient-to-br from-red-600 to-red-800 text-white";

    return "bg-gray-700 text-white";
  };

 // Split tasks into two groups
const activeTasks = tasks.filter(
  task => task.status === "Pending" || task.status === "Awaiting Approval"
);

const completedTasks = tasks.filter(
  task => task.status === "Completed"
);

const failedTasks = tasks.filter(
  task => task.status === "Failed"
);

const getFileIcon = (filename) => {

  if (!filename) return <FaFile className="text-gray-400" />;

  const ext = filename.split(".").pop().toLowerCase();

  if (ext === "pdf")
    return <FaFilePdf className="text-red-500 text-lg" />;

  if (ext === "doc" || ext === "docx")
    return <FaFileWord className="text-blue-500 text-lg" />;

  if (ext === "xls" || ext === "xlsx")
    return <FaFileExcel className="text-green-500 text-lg" />;

  if (ext === "ppt" || ext === "pptx")
    return <FaFilePowerpoint className="text-orange-500 text-lg" />;

  return <FaFile className="text-gray-400 text-lg" />;
};

const secureComplete = (taskId) => {

const confirmStep1 = window.confirm(
"Do you really want to mark this task as completed?"
);

if (!confirmStep1) return;

const confirmStep2 = window.confirm(
"Final confirmation: Once marked completed, the task cannot be changed.\nProceed?"
);

if (confirmStep2) {
handleComplete(taskId);
}

};


  return (
<div className="min-h-screen w-full">
<EmployeeSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

<div
className={`

transition-all duration-300 ease-in-out
${collapsed ? "md:ml-[80px]" : "md:ml-[256px]"}
ml-0
p-4 sm:p-6 md:p-8
`}
>

{/* ================= PREMIUM EMPLOYEE DASHBOARD HEADER ================= */}

<div
className="
relative
group
overflow-hidden
rounded-3xl
p-5 sm:p-8 md:p-10
mb-12
bg-gradient-to-r from-[#092058] via-[#0f172a] to-[#052e16]
border border-white/10
shadow-[0_30px_90px_rgba(0,0,0,0.9)]
transition-all duration-500
hover:shadow-[0_40px_120px_rgba(0,0,0,1)]
hover:scale-[1.01]
"
>

{/* top accent line */}
<div className="
absolute top-0 left-0 w-full h-[3px]
bg-gradient-to-r from-blue-500 via-purple-500 to-green-500
"/>

{/* glow lights */}
<div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/20 blur-[140px] rounded-full"></div>
<div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/20 blur-[140px] rounded-full"></div>

<div className="relative z-10 flex items-center justify-between flex-wrap gap-8">

{/* LEFT SIDE */}
<div className="flex items-center gap-6">

{/* avatar */}
<div
className="
relative
w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
flex items-center justify-center
rounded-full
bg-gradient-to-br from-blue-500 to-purple-600
text-white text-xl font-semibold
shadow-lg
transition-all duration-300
group-hover:scale-110
group-hover:rotate-6
"
>
{user?.name?.charAt(0)}

<span className="
absolute bottom-0 right-0
w-3 h-3
bg-green-400
rounded-full
border border-[#020617]
"/>
</div>


{/* HEADER TEXT */}
<div>

<h1
className="
flex items-center gap-3
text-xl sm:text-2xl md:text-3xl font-bold
tracking-wide
bg-gradient-to-r from-red-400 via-blue-400 to-green-400
bg-clip-text
text-transparent
transition-all duration-300
group-hover:tracking-wider
"
>
👨‍💻 Employee Dashboard
</h1>

<p
className="
text-gray-400 text-sm mt-1
transition-all duration-300
group-hover:text-gray-300
"
>
Track assigned tasks, submit work, and manage deadline extensions.
</p>

{/* animated line */}
<div className="mt-3 h-[2px] w-24 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 rounded-full transition-all duration-500 group-hover:w-40" />

{/* ================= EMPLOYEE INFO ================= */}

<div className="flex items-center gap-3 mt-6 flex-wrap">

  {/* name + email */}
  <div className="flex items-center gap-3 bg-blue-950/60 border border-blue-800/40 rounded-2xl px-4 py-2.5 hover:bg-blue-900/60 hover:border-blue-600/50 hover:scale-105 transition-all duration-200 cursor-default">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
    <div>
      <p className="text-white font-bold text-sm leading-tight">{user?.name}</p>
      <p className="text-blue-300 text-xs font-medium mt-0.5">{user?.email}</p>
    </div>
  </div>

  {/* role */}
  <div className="flex items-center gap-2.5 bg-indigo-950/60 border border-indigo-700/30 rounded-2xl px-4 py-2.5 hover:bg-indigo-900/60 hover:border-indigo-500/50 hover:scale-105 transition-all duration-200 cursor-default">
    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    </div>
    <div>
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-indigo-400/60">Role</p>
      <p className="text-indigo-200 font-bold text-sm leading-tight">{user?.role}</p>
    </div>
  </div>

  {/* designation */}
  <div className="flex items-center gap-2.5 bg-purple-950/60 border border-purple-700/30 rounded-2xl px-4 py-2.5 hover:bg-purple-900/60 hover:border-purple-500/50 hover:scale-105 transition-all duration-200 cursor-default">
    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    </div>
    <div>
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-400/60">Designation</p>
      <p className="text-purple-200 font-bold text-sm leading-tight">{user?.designation}</p>
    </div>
  </div>

  {/* department */}
  <div className="flex items-center gap-2.5 bg-violet-950/60 border border-violet-700/30 rounded-2xl px-4 py-2.5 hover:bg-violet-900/60 hover:border-violet-500/50 hover:scale-105 transition-all duration-200 cursor-default">
    <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
    <div>
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-violet-400/60">Department</p>
      <p className="text-violet-200 font-bold text-sm leading-tight">{user?.department}</p>
    </div>
  </div>

</div>

</div>

</div>

{/* RIGHT BADGE */}
<div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-600/15 to-purple-600/10 border border-purple-500/25 text-purple-300 text-[11px] font-extrabold tracking-widest uppercase hover:from-blue-600/25 hover:to-purple-600/20 hover:border-purple-400/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/15 transition-all duration-200 cursor-default whitespace-nowrap group-hover:scale-105">
  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50 shrink-0" />
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
  EMPLOYEE PANEL
</div>

</div>

</div>

{/* ================= ACTIVE TASK SECTION HEADER ================= */}

<div className="mb-10">

<div
className="
group
relative
rounded-2xl
p-6
bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617]
border border-white/10
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:shadow-[0_30px_100px_rgba(59,130,246,0.35)]
hover:-translate-y-1
overflow-hidden
"
>

{/* glow */}
<div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>

<div className="flex items-center gap-4">

{/* icon */}
<div className="
w-12 h-12
flex items-center justify-center
rounded-xl
bg-gradient-to-br from-blue-500 to-purple-600
text-white
shadow-lg
group-hover:scale-110
transition
">

<svg
className="w-6 h-6"
fill="none"
stroke="currentColor"
strokeWidth="2"
viewBox="0 0 24 24"
>
<path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-6 4h6m-7 4h8m-9 4h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
</svg>

</div>

{/* text */}
<div>

<h2 className="text-xl font-bold text-white tracking-wide">
Your Active Tasks
</h2>

<p className="text-sm text-gray-400">
Review assigned tasks, upload your work, or request deadline extensions.
</p>

{/* NO ACTIVE TASK MESSAGE */}

{activeTasks.length === 0 && (

<div className="flex justify-center mt-10">

<div
className="
relative p-8 w-full max-w-xl
rounded-2xl
border border-blue-500/20
bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
overflow-hidden
group
transition-all duration-500
hover:-translate-y-1
hover:shadow-[0_25px_80px_rgba(59,130,246,0.35)]
"
>

{/* glow background */}

<div className="absolute -top-16 -right-16 w-60 h-60 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>
<div className="absolute -bottom-16 -left-16 w-60 h-60 bg-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>

{/* content */}

<div className="relative flex flex-col items-center text-center">

{/* icon */}

<div
className="
w-16 h-16 mb-4
flex items-center justify-center
rounded-xl
bg-gradient-to-br from-blue-500 to-purple-600
text-white
shadow-lg
group-hover:scale-110
transition
"
>
<ClipboardList size={28} />
</div>

{/* title */}

<p className="text-blue-400 font-semibold text-lg">
No Active Tasks
</p>

{/* description */}

<p className="text-gray-400 text-sm mt-2 max-w-md">
You currently have no tasks assigned. Once an admin assigns tasks,
they will appear here for you to review and submit.
</p>

{/* line */}

<div className="mt-4 h-[2px] w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-400 rounded-full"></div>

</div>

</div>

</div>

)}

</div>

</div>

</div>

</div>


<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">

{activeTasks.map((task) => (

<div
key={task._id}
className={`
group relative w-full
${task.status === "Completed" ? "p-4 sm:p-5" : "p-5 sm:p-6 md:p-8"}
rounded-3xl
bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
border border-white/10
shadow-[0_30px_80px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-3 hover:shadow-[0_40px_120px_rgba(0,0,0,0.9)]
overflow-hidden
`}
>

{/* animated gradient line */}

<div className="absolute top-0 left-0 w-full h-[2px]
bg-gradient-to-r from-blue-500 via-purple-500 to-green-500
opacity-80 group-hover:opacity-100 transition"/>


{/* glow */}

<div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 blur-3xl"></div>
<div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 blur-3xl"></div>


{/* STATUS BADGE */}

<div
className={`absolute top-5 right-5 px-3 py-1 text-xs rounded-full font-semibold backdrop-blur

${task.status === "Completed" && "bg-green-500/20 text-green-400"}
${task.status === "Pending" && "bg-yellow-500/20 text-yellow-400"}
${task.status === "Awaiting Approval" && "bg-orange-500/20 text-orange-400"}
${task.status === "Failed" && "bg-red-500/20 text-red-400"}

`}
>
{task.status}
</div>


{/* TASK TITLE */}

<h2 className={`font-bold text-white flex items-center gap-2 pr-24 ${
task.status === "Completed" ? "text-base mb-3" : "text-lg md:text-xl mb-6"
}`}>
<span className="text-blue-400">Task Notes:</span>
<span className="break-words leading-relaxed">{task.description}</span>
</h2>


{/* INFO GRID */}

<div className={`grid grid-cols-1 md:grid-cols-2 ${task.status === "Completed" ? "p-4 sm:p-5" : "p-5 sm:p-6 md:p-8"}`}>

<div
className={`flex items-center gap-3 bg-black/30 ${
task.status === "Completed" ? "p-3" : "p-4"
} rounded-xl border border-white/10 hover:border-blue-500/40 transition`}
>

{/* ICON */}
<div className="flex-shrink-0">
<Mail size={18} className="text-blue-400"/>
</div>

{/* TEXT */}
<div className="min-w-0 flex-1">

<p className="text-xs text-gray-400">
Admin Email
</p>

<p className="text-white text-sm break-all">
{task.assignedBy?.adminEmail || "Not available"}
</p>

</div>

</div>

{/* ROLE */}

<div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10 hover:border-purple-500/40 transition">

<ShieldCheck size={18} className="text-purple-400"/>

<div>
<p className="text-xs text-gray-400">Admin Role</p>
<p className="text-white text-sm font-medium capitalize">
{task.assignedBy?.adminRole || task.assignedBy?.designation || "Admin"}
</p>
</div>

</div>


{/* DEPARTMENT */}

<div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10 hover:border-cyan-500/40 transition">

<Building2 size={18} className="text-cyan-400"/>

<div>
<p className="text-xs text-gray-400">Your Department</p>
<p className="text-white text-sm">
{task.department}
</p>
</div>

</div>


{/* DUE DATE */}

<div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10 hover:border-pink-500/40 transition">

<Calendar size={18} className="text-pink-400"/>

<div>
<p className="text-xs text-gray-400">Delivery Date</p>
<p className="text-white text-sm">
{task.dueDate
? new Date(task.dueDate).toLocaleDateString()
: "N/A"}
</p>
</div>

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
href={`http://localhost:4000/uploads/${file}`}
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



{/* ADMIN INSTRUCTION */}

{task.extension && (

<div className={`relative rounded-xl overflow-hidden ${
task.status === "Completed" ? "p-3 mb-3" : "p-5 mb-6"
}`}>

<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>

<div className="relative bg-[#0f172a] p-4 rounded-xl border border-blue-500/30">

<p className="text-sm font-semibold text-blue-400">
Admin Instruction
</p>

<p className="text-gray-300 mt-2 text-sm">
{task.extension.adminInstruction || "No instruction provided"}
</p>

</div>

</div>

)}



{/* ACTION PANEL */}

{task.status === "Pending" && (

<div className="space-y-6">


{/* COMPLETE BUTTON */}

<button
onClick={() => secureComplete(task._id)}
className="w-full py-3 rounded-xl
bg-gradient-to-r from-green-500 to-emerald-600
text-white font-semibold
flex items-center justify-center gap-2
shadow-lg hover:shadow-emerald-500/40
hover:scale-[1.02]
transition
"
>

<CheckCircle2 size={18}/>
Mark as Completed

</button>



{/* FILE UPLOAD */}

{/* FILE UPLOAD */}
<div className="space-y-2">

<label
className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#111827] p-3 rounded-lg border border-white/10 cursor-pointer
hover:border-blue-500/40 hover:bg-[#0f172a] transition"
>

<div>

<p className="text-gray-400 text-sm">
Attach Task File
</p>

<p className="text-xs text-gray-500">

{completionFiles?.[task._id]?.length
? `${completionFiles[task._id].length} file(s) selected`
: "Attach files or docs"}

</p>

</div>

<Upload size={16} className="text-gray-400"/>

<input
type="file"
multiple
onChange={(e) =>
setCompletionFiles({
...completionFiles,
[task._id]: [
...(completionFiles?.[task._id] || []),
...Array.from(e.target.files),
],
})
}
className="hidden"
/>

</label>


{/* SELECTED FILE LIST */}

{completionFiles?.[task._id]?.length > 0 && (

<div className="space-y-2">

{completionFiles[task._id].map((file,index)=>(

<div
key={index}
className="flex items-center justify-between bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm"
>

<div className="flex items-center gap-2 text-gray-300 truncate">

<FileText size={16}/>
<span className="truncate">{file.name}</span>

</div>

<button
type="button"
onClick={() =>
setCompletionFiles({
...completionFiles,
[task._id]: completionFiles[task._id].filter((_,i)=>i!==index)
})
}
className="text-red-400 hover:text-red-300 transition"
>

<Trash2 size={16}/>

</button>

</div>

))}

</div>

)}

</div>



{/* EXTENSION CARD */}

<div
className="rounded-2xl p-6 border border-red-500/20
bg-gradient-to-br from-[#14001f] via-[#1b0033] to-[#220018]
shadow-lg hover:shadow-red-500/20 transition
"
>


{/* HEADER */}

<div className="flex items-center gap-3 mb-4">

<div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-purple-600 text-white">

<Clock size={16}/>

</div>

<h3 className="text-sm font-semibold text-red-400">
Request Extension
</h3>

</div>

{/* EXTENSION STATUS */}

{task.extension?.status && (

<div className="mb-4">

<div className="flex items-center gap-3 mb-2">

<div className={`
w-3 h-3 rounded-full animate-pulse

${task.extension.status === "Pending" && "bg-yellow-400"}
${task.extension.status === "Approved" && "bg-green-400"}
${task.extension.status === "Rejected" && "bg-red-400"}

`} />

<p className={`
text-xs font-medium

${task.extension.status === "Pending" && "text-yellow-400"}
${task.extension.status === "Approved" && "text-green-400"}
${task.extension.status === "Rejected" && "text-red-400"}

`}>

{task.extension.status === "Pending" && "Awaiting Admin Approval"}
{task.extension.status === "Approved" && "Extension Approved"}
{task.extension.status === "Rejected" && "Extension Rejected"}

</p>

</div>


{/* PROGRESS BAR */}

<div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">

<div className={`
h-full transition-all duration-700

${task.extension.status === "Pending" && "w-2/3 bg-yellow-400 animate-pulse"}
${task.extension.status === "Approved" && "w-full bg-green-400"}
${task.extension.status === "Rejected" && "w-full bg-red-400"}

`} />

</div>

</div>

)}






{/* DATE */}

<input
type="date"
onChange={(e) =>
setExtensionData({
...extensionData,
[task._id]: e.target.value,
})
}
className="w-full px-3 py-2 mb-3 rounded-lg bg-[#0b0b18] text-white border border-white/10 focus:border-red-500 outline-none"
/>



{/* REASON */}

<textarea
placeholder="Reason for extension"
onChange={(e) =>
setReason({
...reason,
[task._id]: e.target.value,
})
}
className="w-full px-3 py-2 mb-3 rounded-lg bg-[#0b0b18] text-white border border-white/10 focus:border-red-500 outline-none"
/>



{/* EXTENSION FILE */}

<input
type="file"
onChange={(e) =>
setExtensionFile({
...extensionFile,
[task._id]: e.target.files[0],
})
}
className="w-full mb-4 px-3 py-2 rounded-lg bg-[#0b0b18] text-white border border-white/10"
/>



{/* BUTTON */}

<button
onClick={() => handleExtensionRequest(task._id)}
className="w-full py-3 rounded-xl
bg-gradient-to-r from-purple-600 to-red-500
text-white font-semibold
hover:scale-[1.02]
shadow-lg hover:shadow-red-500/30
transition
"
>

Submit Extension

</button>

</div>

</div>

)}

</div>

))}

</div>


{/* ================= COMPLETED TASKS ================= */}

{/* ================= COMPLETED TASKS HEADER ================= */}

<div ref={completedRef} className="mt-16 mb-8">

<div
className="
group
relative
rounded-2xl
p-5
bg-gradient-to-r from-[#02120a] via-[#052e16] to-[#020617]
border border-green-500/20
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-1
hover:shadow-[0_30px_90px_rgba(34,197,94,0.35)]
overflow-hidden
"
>

{/* glow */}
<div className="absolute -top-16 -right-16 w-48 h-48 bg-green-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>

<div className="flex items-center gap-4">

{/* icon */}
<div
className="
w-12 h-12
flex items-center justify-center
rounded-xl
bg-gradient-to-br from-green-500 to-emerald-600
text-white
shadow-lg
group-hover:scale-110
transition
"
>
<CheckCircle2 size={24}/>
</div>

{/* text */}
<div>

<h2 className="text-xl font-bold text-green-400 tracking-wide">
Completed Tasks
</h2>

<p className="text-sm text-gray-400">
Tasks you have successfully completed and submitted.
</p>

</div>

</div>

</div>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">

{completedTasks.map((task) => (

<div
key={task._id}
className="
group relative
p-6
rounded-3xl
bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
border border-green-500/20
shadow-[0_20px_70px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-2
hover:border-green-400/40
hover:shadow-[0_30px_120px_rgba(16,185,129,0.35)]
overflow-hidden
"
>

<div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>

<div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-semibold">
Completed
</div>

<h3 className="text-lg font-bold text-white mb-4 pr-24 leading-relaxed">
<span className="text-green-400 mr-1">Task:</span>
<span className="break-words">{task.description}</span>
</h3>

<div className="grid grid-cols-2 gap-3 mb-4">

<div className="flex items-center gap-2 text-sm text-gray-300">
<Mail size={16} className="text-blue-400"/>
{task.assignedBy?.adminEmail}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<ShieldCheck size={16} className="text-purple-400"/>
{task.assignedBy?.designation}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<Building2 size={16} className="text-cyan-400"/>
{task.department}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<Calendar size={16} className="text-pink-400"/>
{task.dueDate
? new Date(task.dueDate).toLocaleDateString()
: "N/A"}
</div>

</div>

{/* FILE SECTION */}

<div className="space-y-3 border-t border-white/10 pt-3">

{/* ADMIN FILES */}

{task.adminFiles && task.adminFiles.length > 0 && (

<div>

<p className="text-xs text-gray-400 mb-1">
Admin Attachments
</p>

{task.adminFiles.map((file, index) => (

<a
key={index}
href={`http://localhost:4000/uploads/${file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition"
>

{getFileIcon(file)}

<span className="truncate">{file}</span>

</a>

))}

</div>

)}

{/* EMPLOYEE SUBMISSIONS */}

{task.employeeSubmissions && task.employeeSubmissions.length > 0 && (

<div>

<p className="text-xs text-gray-400 mb-1">
Employee Submission
</p>

{task.employeeSubmissions.map((file, index) => (

<a
key={index}
href={`http://localhost:4000/uploads/${file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-green-400 text-sm hover:text-green-300 transition"
>

{getFileIcon(file)}

<span className="truncate">{file}</span>

</a>

))}

</div>

)}

</div>

</div>

))}

</div>


{/* ================= FAILED TASKS ================= */}

<div ref={failedRef} className="mt-16 mb-8">

<div
className="
group
relative
rounded-2xl
p-5
bg-gradient-to-r from-[#1a0202] via-[#140909] to-[#020617]
border border-red-500/20
shadow-[0_20px_60px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-1
hover:shadow-[0_30px_90px_rgba(239,68,68,0.35)]
overflow-hidden
"
>

<div className="absolute -top-16 -right-16 w-48 h-48 bg-red-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition"></div>

<div className="flex items-center gap-4">

<div
className="
w-12 h-12
flex items-center justify-center
rounded-xl
bg-gradient-to-br from-red-500 to-rose-600
text-white
shadow-lg
group-hover:scale-110
transition
"
>
<Clock size={24}/>
</div>

<div>

<h2 className="text-xl font-bold text-red-400 tracking-wide">
Failed Tasks
</h2>

<p className="text-sm text-gray-400">
Tasks that missed their deadline or were rejected by the admin.
</p>

</div>

</div>

</div>

</div>


<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">

{failedTasks.length === 0 && (
<p className="text-gray-400">No failed tasks</p>
)}

{failedTasks.map((task) => (

<div
key={task._id}
className="
group relative
p-6
rounded-3xl
bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
border border-red-500/20
shadow-[0_20px_70px_rgba(0,0,0,0.8)]
transition-all duration-500
hover:-translate-y-2
hover:border-red-400/40
hover:shadow-[0_30px_120px_rgba(239,68,68,0.35)]
overflow-hidden
"
>

<div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 font-semibold">
Failed
</div>

<h3 className="text-lg font-bold text-white mb-4 pr-24 leading-relaxed">
<span className="text-red-400 mr-1">Task:</span>
<span className="break-words">{task.description}</span>
</h3>

<div className="grid grid-cols-2 gap-3 mb-4">

<div className="flex items-center gap-2 text-sm text-gray-300">
<Mail size={16} className="text-blue-400"/>
{task.assignedBy?.adminEmail}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<ShieldCheck size={16} className="text-purple-400"/>
{task.assignedBy?.designation}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<Building2 size={16} className="text-cyan-400"/>
{task.department}
</div>

<div className="flex items-center gap-2 text-sm text-gray-300">
<Calendar size={16} className="text-pink-400"/>
{task.dueDate
? new Date(task.dueDate).toLocaleDateString()
: "N/A"}
</div>

</div>

{/* ADMIN FILES */}

{task.adminFiles && task.adminFiles.length > 0 && (

<div className="space-y-2 border-t border-white/10 pt-3">

<p className="text-xs text-gray-400">
Admin Attachments
</p>

{task.adminFiles.map((file, index) => (

<a
key={index}
href={`http://localhost:4000/uploads/${file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition"
>

{getFileIcon(file)}

<span className="truncate">{file}</span>

</a>

))}

</div>

)}

</div>

))}

</div>


</div>
</div>
);

}

export default EmployeeDashboard;