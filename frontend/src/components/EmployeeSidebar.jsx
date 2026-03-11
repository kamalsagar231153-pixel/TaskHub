import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/taskhub-logo.svg";

import {
  FiMenu,
  FiHome,
  FiClipboard,
  FiClock,
  FiLogOut,
  FiX
} from "react-icons/fi";

function EmployeeSidebar({ collapsed, setCollapsed }) {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

const menuItems = [
  { name: "Dashboard", icon: <FiHome />, path: "/employee" },
  { name: "Completed Tasks", icon: <FiClipboard />, path: "/employee?view=completed" },
  { name: "Failed Tasks", icon: <FiClock />, path: "/employee?view=failed" }
];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
        md:hidden
        fixed top-4 left-4 z-50
        p-3
        rounded-xl
        bg-[#020617]
        border border-white/10
        text-white
        shadow-lg
        "
      >
        <FiMenu size={20} />
      </button>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed top-0 left-0 h-screen z-50
        bg-gradient-to-b from-[#020617] via-[#020617] to-[#030a1a]
        border-r border-white/10
        shadow-[0_20px_80px_rgba(0,0,0,0.8)]
        backdrop-blur-xl
        transition-all duration-300

        ${collapsed ? "md:w-20" : "md:w-64"}

        w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        <div className="flex flex-col h-full">

{/* HEADER */}

<div className="relative flex items-center justify-between px-5 py-5 border-b border-white/10">

<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>

<div className="flex items-center gap-3">

<img
src={logo}
alt="TaskHub"
className="w-10 h-10 object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.8)]"
/>

{!collapsed && (
<h1 className="text-lg font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
TaskHub
</h1>
)}

</div>

<div className="flex items-center gap-2">

<button
onClick={() => setCollapsed(!collapsed)}
className="hidden md:block p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
>
<FiMenu size={18} />
</button>

<button
onClick={() => setMobileOpen(false)}
className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
>
<FiX size={18} />
</button>

</div>

</div>

{/* USER CARD */}

{!collapsed && (
<div className="px-4 py-5 border-b border-white/10">

<div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 rounded-xl p-4">

<p className="text-xs text-gray-400">
Welcome back
</p>

<p className="text-white font-semibold text-lg mt-1">
{user?.name}
</p>

<p className="text-green-400 text-sm mt-1">
{user?.designation}
</p>

</div>

</div>
)}

{/* MENU */}

<div className="flex-1 px-3 py-5 space-y-2">

{menuItems.map((item, index) => {

const active =
location.pathname + location.search === item.path ||
location.pathname === item.path;

return (

<div
key={index}
onClick={() => {
navigate(item.path);
setMobileOpen(false);
}}
className={`
group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
transition-all duration-200

${active
? "bg-gradient-to-r from-green-600/80 to-emerald-500 text-white shadow-lg shadow-green-500/20"
: "text-gray-400 hover:bg-white/5 hover:text-white"}
`}
>

<div
className={`
flex items-center justify-center
w-9 h-9 rounded-lg
${active ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"}
`}
>
{item.icon}
</div>

{!collapsed && (
<span className="text-sm font-medium tracking-wide">
{item.name}
</span>
)}

</div>

);

})}

</div>

{/* LOGOUT */}

<div className="p-4 border-t border-white/10">

<button
onClick={handleLogout}
className="
group
w-full
flex items-center justify-center gap-3
px-4 py-3
rounded-xl
bg-gradient-to-r from-red-600 to-rose-600
hover:from-red-500 hover:to-rose-500
text-white
font-medium
shadow-lg shadow-red-500/20
transition
"
>

<FiLogOut className="group-hover:rotate-12 transition" />

{!collapsed && "Logout"}

</button>

</div>

        </div>
      </div>
    </>
  );
}

export default EmployeeSidebar;