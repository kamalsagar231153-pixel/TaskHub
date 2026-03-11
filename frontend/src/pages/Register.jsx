import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import {
Mail,
Lock,
User,
Briefcase,
Building2,
ShieldCheck,
ArrowLeft
} from "lucide-react";
import Tilt from "react-parallax-tilt";

function Register() {

const navigate = useNavigate();

const [profileType,setProfileType] = useState("Employee");

const [form,setForm] = useState({
name:"",
email:"",
password:"",
role:"",
department:"",
designation:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit = async (e)=>{
e.preventDefault();

/* ---------- VALIDATION ---------- */

if(!form.name || !form.email || !form.password || !form.department){
toast.error("Please fill all required fields");
return;
}

if(profileType === "Admin" && !form.role){
toast.error("Please select Admin Role");
return;
}

if(profileType === "Employee" && !form.designation){
toast.error("Please enter designation");
return;
}

try{

const payload =
profileType === "Admin"
? {
name: form.name,
email: form.email,
password: form.password,
role: form.role,
department: form.department
}
: {
name: form.name,
email: form.email,
password: form.password,
role: "Employee",
department: form.department,
designation: form.designation
};

await API.post("/auth/register",payload);

toast.success("Account created successfully");

navigate("/login");

}catch(error){

console.log(error.response?.data);
toast.error(error.response?.data?.message || "Registration failed");

}

};

return (

<div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4 sm:px-6">

{/* floating particles */}

<div className="absolute inset-0 z-0 opacity-30">

<div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping top-10 left-20"></div>
<div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping top-40 right-40"></div>
<div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-ping bottom-32 left-32"></div>
<div className="absolute w-2 h-2 bg-indigo-400 rounded-full animate-ping bottom-20 right-20"></div>

</div>

{/* background glow */}

<div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-600/20 blur-[200px]" />
<div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-purple-600/20 blur-[200px]" />

{/* grid background */}

<div className="absolute inset-0 opacity-10 bg-[linear-gradient(#ffffff10_1px,transparent_1px),linear-gradient(90deg,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

{/* MAIN CONTAINER */}

<div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center max-w-[1200px] w-full justify-center">

{/* LEFT INFO CARD */}

<Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000} transitionSpeed={1500} scale={1.03}>

<div className="flex flex-col justify-center items-center text-center w-full lg:w-[520px] p-10 rounded-3xl
bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a]
border border-blue-500/20
shadow-[0_0_80px_rgba(59,130,246,0.35)]
backdrop-blur-xl">

<div className="w-20 h-20 rounded-full flex items-center justify-center
bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-xl">

<ShieldCheck size={36} />

</div>

<h3 className="text-white font-semibold text-xl mb-4">
Secure & Easy Registration
</h3>

<p className="text-gray-400 text-sm leading-relaxed max-w-[380px]">
Quickly create your TaskHub account with secure authentication,
modern UI and role-based access system.
</p>

</div>

</Tilt>

{/* REGISTER CARD */}

<Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1200} transitionSpeed={1500} scale={1.02}>

<div className="relative w-full max-w-[520px]">

<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur opacity-40 animate-pulse"></div>

<div className="relative backdrop-blur-xl bg-gradient-to-br from-[#020617]/90 via-[#0f172a]/90 to-[#020617]/90
border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_40px_140px_rgba(0,0,0,0.9)]">

{/* HEADER WITH BACK BUTTON */}

<div className="flex items-center justify-between mb-8">

<button
type="button"
onClick={() => navigate("/login")}
className="
flex items-center gap-2
px-4 py-2
rounded-lg
bg-blue-600/20
border border-blue-500/40
text-blue-400
hover:bg-blue-600/30
hover:text-blue-300
transition-all duration-300
"
>

<ArrowLeft size={18}/>
<span className="hidden sm:inline">Back</span>

</button>

<h2 className="flex-1 text-center text-2xl sm:text-3xl font-bold text-white">
✨ Create TaskHub Account
</h2>

<div className="w-[70px] hidden sm:block"></div>

</div>

{/* PROFILE SWITCH */}

<div className="flex flex-col sm:flex-row gap-3 mb-6">

<button
type="button"
onClick={()=>setProfileType("Admin")}
className={`flex-1 py-3 rounded-xl font-semibold transition-all
${profileType==="Admin"
?"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
:"bg-white/10 text-gray-300 hover:bg-white/20"}`}
>
Register as Admin
</button>

<button
type="button"
onClick={()=>setProfileType("Employee")}
className={`flex-1 py-3 rounded-xl font-semibold transition-all
${profileType==="Employee"
?"bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
:"bg-white/10 text-gray-300 hover:bg-white/20"}`}
>
Register as Employee
</button>

</div>

<form onSubmit={handleSubmit} className="space-y-5">

{/* NAME */}

<div className="relative">

<User size={18} className="absolute left-3 top-4 text-gray-400"/>

<input
type="text"
name="name"
placeholder="Full Name"
value={form.name}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
/>

</div>

{/* EMAIL */}

<div className="relative">

<Mail size={18} className="absolute left-3 top-4 text-gray-400"/>

<input
type="email"
name="email"
placeholder="Email Address"
value={form.email}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
/>

</div>

{/* PASSWORD */}

<div className="relative">

<Lock size={18} className="absolute left-3 top-4 text-gray-400"/>

<input
type="password"
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
/>

</div>

{/* ADMIN ROLE */}

{profileType==="Admin" && (

<div className="relative">

<Briefcase size={18} className="absolute left-3 top-4 text-gray-400"/>

<select
name="role"
value={form.role}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
>

<option value="">Select Admin Role</option>
<option value="Admin">Admin</option>
<option value="Dean">Dean</option>
<option value="CEO">CEO</option>
<option value="Manager">Manager</option>
<option value="Director">Director</option>
<option value="Boss">Boss</option>
<option value="HOD">HOD</option>

</select>

</div>

)}

{/* DEPARTMENT */}

<div className="relative">

<Building2 size={18} className="absolute left-3 top-4 text-gray-400"/>

<select
name="department"
value={form.department}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
>

<option value="">Select Department</option>

<option value="Research & Development">Research & Development</option>
<option value="Information Technology">Information Technology</option>
<option value="Product Engineering">Product Engineering</option>
<option value="Software Development">Software Development</option>
<option value="Human Resources">Human Resources</option>
<option value="Finance">Finance</option>
<option value="Accounting">Accounting</option>
<option value="Marketing">Marketing</option>
<option value="Sales">Sales</option>
<option value="Customer Support">Customer Support</option>
<option value="Business Development">Business Development</option>
<option value="Operations">Operations</option>
<option value="Quality Assurance">Quality Assurance</option>
<option value="Cyber Security">Cyber Security</option>
<option value="AI & Machine Learning">AI & Machine Learning</option>
<option value="Data Science">Data Science</option>
<option value="Cloud Infrastructure">Cloud Infrastructure</option>
<option value="DevOps">DevOps</option>
<option value="UI/UX Design">UI/UX Design</option>
<option value="Legal & Compliance">Legal & Compliance</option>
<option value="Administration">Administration</option>

</select>

</div>

{/* DESIGNATION */}

{profileType==="Employee" && (

<div className="relative">

<Briefcase size={18} className="absolute left-3 top-4 text-gray-400"/>

<input
type="text"
name="designation"
placeholder="Designation (Product Eng / Developer)"
value={form.designation}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
/>

</div>

)}

<button
type="submit"
className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
text-white font-semibold tracking-wide shadow-xl hover:shadow-blue-500/30
hover:scale-[1.04] transition-all duration-300"
>
Register
</button>

<p className="text-center text-gray-400 text-xs mt-2">
Secure account creation for TaskHub workspace
</p>

</form>

</div>

</div>

</Tilt>

</div>

</div>

);

}

export default Register;