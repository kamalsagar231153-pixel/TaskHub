import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/taskhub-logo.svg";

import {
  FiMenu,
  FiHome,
  FiClipboard,
  FiBarChart2,
  FiUser,
  FiLogOut
} from "react-icons/fi";

function Sidebar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin" },
    { name: "Tasks", icon: <FiClipboard />, path: "/admin/tasks" },
    { name: "Analytics", icon: <FiBarChart2 />, path: "/admin/analytics" },
    { name: "Profile", icon: <FiUser />, path: "/profile" }
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50
      ${collapsed ? "w-20" : "w-72"}
      transition-all duration-300
      bg-[#020617]
      border-r border-white/10
      shadow-[0_25px_80px_rgba(0,0,0,0.9)]
      `}
    >

      <div className="flex flex-col h-full">

{/* ================= HEADER ================= */}



<div className="flex items-center justify-between px-5 py-4 border-b border-white/10">



<div className="flex items-center gap-3">

<img
src={logo}
alt="TaskHub"
className={`transition-all duration-300
${collapsed ? "w-14 h-14 mx-auto" : "w-16 h-16"}
drop-shadow-[0_0_18px_rgba(99,102,241,0.9)]`}
/>

{!collapsed && (
<h1
className="
text-lg
font-semibold
tracking-wide
bg-gradient-to-r from-red-400 via-blue-400 to-green-400
bg-clip-text
text-transparent
"
>
TaskHub
</h1>
)}

</div>

<button
onClick={() => setCollapsed(!collapsed)}
className="text-gray-400 hover:text-white transition"
>
<FiMenu size={20}/>
</button>

</div>

{/* ================= NAVIGATION ================= */}

<div className="flex-1 px-3 py-6 space-y-2">

{menuItems.map((item, index) => {

const active = location.pathname === item.path;

return (

<div
key={index}
onClick={() => navigate(item.path)}
className={`
relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
transition-all duration-300 group

${active
? "bg-gradient-to-r from-red-500/20 to-blue-500/20 text-white border border-white/10"
: "text-gray-400 hover:bg-white/5 hover:text-white"
}
`}
>

{active && (
<div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-red-500 to-blue-500 rounded-full"/>
)}

<div className="text-lg group-hover:scale-110 transition">
{item.icon}
</div>

{!collapsed && (
<span className="font-medium tracking-wide">
{item.name}
</span>
)}

</div>

);

})}

</div>

{/* ================= ADMIN WELCOME CARD ================= */}

{!collapsed && (

<div className="px-4 mb-4">

<div
className="
relative
p-5
rounded-2xl
bg-gradient-to-br from-[#0f172a] to-[#020617]
border border-white/10
shadow-[0_15px_60px_rgba(0,0,0,0.8)]
overflow-hidden
transition-all duration-300
hover:scale-[1.03]
hover:shadow-[0_25px_80px_rgba(0,0,0,1)]
"
>

{/* glow effects */}

<div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/20 blur-2xl rounded-full"></div>
<div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>

<div className="relative flex items-center gap-4">

{/* avatar */}

<div className="
w-12 h-12
rounded-full
bg-gradient-to-br from-blue-500 to-purple-600
flex items-center justify-center
text-white font-semibold
shadow-md
">

{user?.name?.charAt(0)}

</div>

<div>

<p className="text-gray-400 text-sm">
Welcome,
</p>

<p className="text-white font-semibold text-lg">
{user?.name || "Admin"}
</p>

<p className="text-blue-400 text-sm">
{user?.role || "Administrator"}
</p>

</div>

</div>

</div>

</div>

)}

{/* ================= LOGOUT ================= */}

<div className="p-4 border-t border-white/10">

<button
onClick={handleLogout}
className="
w-full flex items-center justify-center gap-3
px-4 py-3 rounded-xl
bg-gradient-to-r from-red-600 to-red-500
text-white font-medium
shadow-lg
hover:shadow-red-500/40
hover:scale-[1.03]
active:scale-[0.96]
transition
"
>

<FiLogOut/>

{!collapsed && "Logout"}

</button>

</div>

      </div>

    </div>
  );
}

export default Sidebar;