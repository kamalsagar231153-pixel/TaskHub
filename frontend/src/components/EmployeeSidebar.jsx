import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/taskhub-logo.svg";

import {
  FiMenu,
  FiHome,
  FiClipboard,
  FiClock,
  FiUser,
  FiLogOut
} from "react-icons/fi";

function EmployeeSidebar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/employee" },
    { name: "Tasks", icon: <FiClipboard />, path: "/employee/tasks" },
    { name: "Extensions", icon: <FiClock />, path: "/employee/extensions" },
    { name: "Profile", icon: <FiUser />, path: "/profile" }
  ];

  return (

    <div
      className={`fixed top-0 left-0 h-screen z-50
      bg-gradient-to-b from-[#020617] via-[#020617] to-[#030a1a]
      border-r border-white/10
      shadow-[0_20px_80px_rgba(0,0,0,0.8)]
      backdrop-blur-xl
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}
      `}
    >

      <div className="flex flex-col h-full">

{/* ================= BRAND HEADER ================= */}

<div className="relative flex items-center justify-between px-5 py-5 border-b border-white/10">

{/* gradient top line */}

<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>

<div className="flex items-center gap-3">

<img
src={logo}
alt="TaskHub"
className={`
${collapsed ? "w-12 h-12" : "w-12 h-12"}
object-contain
drop-shadow-[0_0_20px_rgba(99,102,241,0.8)]
transition-all duration-300 hover:scale-110
`}
/>

{!collapsed && (
<h1
className="
text-xl
font-bold
bg-gradient-to-r
from-green-400
via-blue-400
to-purple-500
bg-clip-text
text-transparent
tracking-wide
"
>
TaskHub
</h1>
)}

</div>

<button
onClick={() => setCollapsed(!collapsed)}
className="
p-2 rounded-lg
text-gray-400
hover:text-white
hover:bg-white/5
transition
"
>
<FiMenu size={18} />
</button>

</div>

{/* ================= USER CARD ================= */}

{!collapsed && (

<div className="px-4 py-5 border-b border-white/10">

<div className="
bg-gradient-to-br
from-[#0f172a]
to-[#020617]
border border-white/10
rounded-xl
p-4
">

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

{/* ================= MENU ================= */}

<div className="flex-1 px-3 py-5 space-y-2">

{menuItems.map((item, index) => {

const active = location.pathname === item.path;

return (

<div
key={index}
onClick={() => navigate(item.path)}
className={`
group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
transition-all duration-200

${active
? "bg-gradient-to-r from-green-600/80 to-emerald-500 text-white shadow-lg shadow-green-500/20"
: "text-gray-400 hover:bg-white/5 hover:text-white"
}
`}
>

{/* icon container */}

<div
className={`
flex items-center justify-center
w-9 h-9
rounded-lg
transition
${active
? "bg-white/20"
: "bg-white/5 group-hover:bg-white/10"
}
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

{/* ================= LOGOUT ================= */}

<div className="p-4 border-t border-white/10">

<button
onClick={handleLogout}
className="
group
w-full
flex items-center justify-center gap-3
px-4 py-3
rounded-xl
bg-gradient-to-r
from-red-600
to-rose-600
hover:from-red-500
hover:to-rose-500
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

  );

}

export default EmployeeSidebar;