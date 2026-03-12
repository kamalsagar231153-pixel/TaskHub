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

{profileType === "Admin" && (

<div className="relative">

<Building2 size={18} className="absolute left-3 top-4 text-gray-400"/>

<select
name="department"
value={form.department}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-blue-500"
>

<option value="">Select Admin Department</option>

{/* <option value="Boss">Boss</option>
<option value="Owner">Owner</option>
<option value="Founder">Founder</option>
<option value="Co-Founder">Co-Founder</option>
<option value="Chairman">Chairman</option>
<option value="Chairperson">Chairperson</option>
<option value="Managing Director">Managing Director</option>
<option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
<option value="President">President</option>
<option value="Executive Head">Executive Head</option>
<option value="Principal">Principal</option>
<option value="Director General">Director General</option>
<option value="Chief Administrator">Chief Administrator</option>
<option value="Head of Organization">Head of Organization</option>

<option value="Administrator">Administrator</option>
<option value="System Administrator">System Administrator</option>
<option value="IT Administrator">IT Administrator</option>
<option value="Network Administrator">Network Administrator</option>
<option value="Database Administrator">Database Administrator</option>
<option value="Office Administrator">Office Administrator</option>
<option value="Academic Administrator">Academic Administrator</option>

<option value="General Manager">General Manager</option>
<option value="Operations Manager">Operations Manager</option>
<option value="Project Manager">Project Manager</option>
<option value="IT Manager">IT Manager</option>
<option value="HR Manager">HR Manager</option>
<option value="Finance Manager">Finance Manager</option>

<option value="Dean of Engineering / Technology">Dean of Engineering / Technology</option>
<option value="Dean of Arts & Humanities">Dean of Arts & Humanities</option>
<option value="Dean of Computer Science / IT">Dean of Computer Science / IT</option>
<option value="Dean of Management Studies">Dean of Management Studies</option>
<option value="Dean of Education">Dean of Education</option>
<option value="Dean of Law">Dean of Law</option>

<option value="Director of Admissions">Director of Admissions</option>
<option value="Director of Academic Affairs">Director of Academic Affairs</option>
<option value="Director of Student Affairs">Director of Student Affairs</option>
<option value="Director of Research & Development">Director of Research & Development</option>
<option value="Director of Placement & Career Services">Director of Placement & Career Services</option>

<option value="HOD - Computer Science">HOD - Computer Science</option>
<option value="HOD - Information Technology">HOD - Information Technology</option>
<option value="HOD - Mechanical Engineering">HOD - Mechanical Engineering</option>
<option value="HOD - Civil Engineering">HOD - Civil Engineering</option>
<option value="HOD - Electrical Engineering">HOD - Electrical Engineering</option> */}

<option value="Dean of Science">Dean of Science</option>
<option value="Dean of Engineering / Technology">Dean of Engineering / Technology</option>
<option value="Dean of Arts & Humanities">Dean of Arts & Humanities</option>
<option value="Dean of Commerce / Business Administration">Dean of Commerce / Business Administration</option>
<option value="Dean of Computer Science / IT">Dean of Computer Science / IT</option>
<option value="Dean of Management Studies">Dean of Management Studies</option>
<option value="Dean of Education">Dean of Education</option>
<option value="Dean of Law">Dean of Law</option>
<option value="Dean of Medical Sciences">Dean of Medical Sciences</option>
<option value="Dean of Social Sciences">Dean of Social Sciences</option>
<option value="Dean of Research & Development">Dean of Research & Development</option>
<option value="Dean of Student Affairs">Dean of Student Affairs</option>
<option value="Dean of Academic Affairs">Dean of Academic Affairs</option>
<option value="Dean of International Relations">Dean of International Relations</option>
<option value="Dean of Graduate Studies">Dean of Graduate Studies</option>

<option value="Director of Admissions">Director of Admissions</option>
<option value="Director of Academic Affairs">Director of Academic Affairs</option>
<option value="Director of Student Affairs">Director of Student Affairs</option>
<option value="Director of Research & Development">Director of Research & Development</option>
<option value="Director of Placement & Career Services">Director of Placement & Career Services</option>
<option value="Director of International Relations">Director of International Relations</option>
<option value="Director of Information Technology">Director of Information Technology</option>
<option value="Director of Library Services">Director of Library Services</option>
<option value="Director of Finance & Accounts">Director of Finance & Accounts</option>
<option value="Director of Human Resources">Director of Human Resources</option>
<option value="Director of Quality Assurance">Director of Quality Assurance</option>
<option value="Director of Innovation & Incubation">Director of Innovation & Incubation</option>
<option value="Director of Continuing Education">Director of Continuing Education</option>
<option value="Director of Distance Education">Director of Distance Education</option>
<option value="Director of Campus Facilities">Director of Campus Facilities</option>
<option value="Director of Student Welfare">Director of Student Welfare</option>
<option value="Director of Alumni Relations">Director of Alumni Relations</option>
<option value="Director of Public Relations">Director of Public Relations</option>
<option value="Director of Sports & Physical Education">Director of Sports & Physical Education</option>
<option value="Director of Cultural Activities">Director of Cultural Activities</option>

<option value="HOD - Computer Science">HOD - Computer Science</option>
<option value="HOD - Information Technology">HOD - Information Technology</option>
<option value="HOD - Mechanical Engineering">HOD - Mechanical Engineering</option>
<option value="HOD - Civil Engineering">HOD - Civil Engineering</option>
<option value="HOD - Electrical Engineering">HOD - Electrical Engineering</option>
<option value="HOD - Electronics & Communication">HOD - Electronics & Communication</option>
<option value="HOD - Artificial Intelligence">HOD - Artificial Intelligence</option>
<option value="HOD - Data Science">HOD - Data Science</option>
<option value="HOD - Mathematics">HOD - Mathematics</option>
<option value="HOD - Physics">HOD - Physics</option>
<option value="HOD - Chemistry">HOD - Chemistry</option>
<option value="HOD - English">HOD - English</option>
<option value="HOD - Commerce">HOD - Commerce</option>
<option value="HOD - Business Administration">HOD - Business Administration</option>
<option value="HOD - Economics">HOD - Economics</option>
<option value="HOD - Management Studies">HOD - Management Studies</option>
<option value="HOD - Education">HOD - Education</option>
<option value="HOD - Law">HOD - Law</option>
<option value="HOD - Medical Sciences">HOD - Medical Sciences</option>
<option value="HOD - Social Sciences">HOD - Social Sciences</option>

<option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
<option value="Chief Operating Officer (COO)">Chief Operating Officer (COO)</option>
<option value="Chief Financial Officer (CFO)">Chief Financial Officer (CFO)</option>
<option value="Chief Technology Officer (CTO)">Chief Technology Officer (CTO)</option>
<option value="Chief Information Officer (CIO)">Chief Information Officer (CIO)</option>
<option value="Chief Marketing Officer (CMO)">Chief Marketing Officer (CMO)</option>
<option value="Chief Human Resources Officer (CHRO)">Chief Human Resources Officer (CHRO)</option>
<option value="Chief Product Officer (CPO)">Chief Product Officer (CPO)</option>
<option value="Chief Strategy Officer (CSO)">Chief Strategy Officer (CSO)</option>
<option value="Chief Innovation Officer (CINO)">Chief Innovation Officer (CINO)</option>
<option value="Chief Compliance Officer (CCO)">Chief Compliance Officer (CCO)</option>
<option value="Chief Security Officer (CSO - Security)">Chief Security Officer</option>
<option value="Managing Director (MD)">Managing Director (MD)</option>
<option value="Executive Director">Executive Director</option>
<option value="President">President</option>
<option value="Vice President">Vice President</option>

<option value="General Manager">General Manager</option>
<option value="Operations Manager">Operations Manager</option>
<option value="Project Manager">Project Manager</option>
<option value="IT Manager">IT Manager</option>
<option value="HR Manager">HR Manager</option>
<option value="Finance Manager">Finance Manager</option>
<option value="Marketing Manager">Marketing Manager</option>
<option value="Sales Manager">Sales Manager</option>
<option value="Product Manager">Product Manager</option>
<option value="Development Manager">Development Manager</option>
<option value="Engineering Manager">Engineering Manager</option>
<option value="Research Manager">Research Manager</option>
<option value="Quality Assurance Manager">Quality Assurance Manager</option>
<option value="Training Manager">Training Manager</option>
<option value="Facilities Manager">Facilities Manager</option>
<option value="Library Manager">Library Manager</option>
<option value="Placement Manager">Placement Manager</option>
<option value="Student Services Manager">Student Services Manager</option>
<option value="Administrative Manager">Administrative Manager</option>
<option value="Campus Operations Manager">Campus Operations Manager</option>

<option value="Administrator">Administrator</option>
<option value="System Administrator">System Administrator</option>
<option value="IT Administrator">IT Administrator</option>
<option value="Network Administrator">Network Administrator</option>
<option value="Database Administrator">Database Administrator</option>
<option value="Office Administrator">Office Administrator</option>
<option value="Academic Administrator">Academic Administrator</option>
<option value="Department Administrator">Department Administrator</option>
<option value="Student Administration Officer">Student Administration Officer</option>
<option value="Admissions Administrator">Admissions Administrator</option>
<option value="Records Administrator">Records Administrator</option>
<option value="Facilities Administrator">Facilities Administrator</option>
<option value="HR Administrator">HR Administrator</option>
<option value="Finance Administrator">Finance Administrator</option>
<option value="Campus Administrator">Campus Administrator</option>

<option value="Boss">Boss</option>
<option value="Owner">Owner</option>
<option value="Founder">Founder</option>
<option value="Co-Founder">Co-Founder</option>
<option value="Chairman">Chairman</option>
<option value="Chairperson">Chairperson</option>
<option value="Managing Director">Managing Director</option>
<option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
<option value="President">President</option>
<option value="Executive Head">Executive Head</option>
<option value="Principal">Principal</option>
<option value="Director General">Director General</option>
<option value="Chief Administrator">Chief Administrator</option>
<option value="Head of Organization">Head of Organization</option>


</select>



</div>

)}

{/* EMPLOYEE DEPARTMENT */}

{profileType === "Employee" && (

<div className="relative">

<Building2 size={18} className="absolute left-3 top-4 text-gray-400"/>

<select
name="department"
value={form.department}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-green-500"
>

<option value="">Select Employee Department</option>

<option value="University Administration">University Administration</option>
<option value="Academic Affairs">Academic Affairs</option>
<option value="Student Affairs">Student Affairs</option>
<option value="Admissions Office">Admissions Office</option>
<option value="Registrar Office">Registrar Office</option>
<option value="Examination Cell">Examination Cell</option>
<option value="Research & Development">Research & Development</option>
<option value="Innovation & Incubation Center">Innovation & Incubation Center</option>
<option value="Placement & Career Services">Placement & Career Services</option>
<option value="Alumni Relations">Alumni Relations</option>
<option value="International Relations Office">International Relations Office</option>
<option value="Distance Education">Distance Education</option>
<option value="Continuing Education">Continuing Education</option>
<option value="Library Services">Library Services</option>
<option value="Laboratory Services">Laboratory Services</option>
<option value="Campus IT Services">Campus IT Services</option>
<option value="E-Learning Center">E-Learning Center</option>
<option value="Quality Assurance Cell">Quality Assurance Cell</option>
<option value="Accreditation & Compliance">Accreditation & Compliance</option>
<option value="Curriculum Development">Curriculum Development</option>

<option value="Faculty Affairs">Faculty Affairs</option>
<option value="Teaching & Learning Center">Teaching & Learning Center</option>
<option value="Student Counseling">Student Counseling</option>
<option value="Student Welfare">Student Welfare</option>
<option value="Sports Department">Sports Department</option>
<option value="Cultural Activities">Cultural Activities</option>
<option value="Hostel Administration">Hostel Administration</option>
<option value="Campus Security">Campus Security</option>
<option value="Campus Maintenance">Campus Maintenance</option>
<option value="Facilities Management">Facilities Management</option>

<option value="Medical Services">Medical Services</option>
<option value="University Hospital">University Hospital</option>
<option value="Transport Services">Transport Services</option>
<option value="Food & Cafeteria Services">Food & Cafeteria Services</option>
<option value="Student Clubs & Societies">Student Clubs & Societies</option>
<option value="Entrepreneurship Cell">Entrepreneurship Cell</option>
<option value="Technology Transfer Office">Technology Transfer Office</option>
<option value="Grant Management">Grant Management</option>
<option value="Public Relations Office">Public Relations Office</option>
<option value="Community Outreach">Community Outreach</option>

<option value="Human Resources">Human Resources</option>
<option value="Finance">Finance</option>
<option value="Accounting">Accounting</option>
<option value="Marketing">Marketing</option>
<option value="Sales">Sales</option>
<option value="Customer Support">Customer Support</option>
<option value="Technical Support">Technical Support</option>
<option value="Information Technology">Information Technology</option>
<option value="Software Development">Software Development</option>
<option value="Web Development">Web Development</option>
<option value="Mobile App Development">Mobile App Development</option>
<option value="Data Science">Data Science</option>
<option value="Artificial Intelligence">Artificial Intelligence</option>
<option value="Cyber Security">Cyber Security</option>
<option value="Network Engineering">Network Engineering</option>
<option value="Cloud Computing">Cloud Computing</option>
<option value="Database Administration">Database Administration</option>
<option value="Quality Assurance">Quality Assurance</option>
<option value="Product Management">Product Management</option>
<option value="Project Management">Project Management</option>

<option value="Operations">Operations</option>
<option value="Supply Chain">Supply Chain</option>
<option value="Logistics">Logistics</option>
<option value="Procurement">Procurement</option>
<option value="Inventory Management">Inventory Management</option>
<option value="Manufacturing">Manufacturing</option>
<option value="Production">Production</option>
<option value="Maintenance">Maintenance</option>
<option value="Facilities Management">Facilities Management</option>
<option value="Administration">Administration</option>

<option value="Legal">Legal</option>
<option value="Compliance">Compliance</option>
<option value="Risk Management">Risk Management</option>
<option value="Corporate Affairs">Corporate Affairs</option>
<option value="Public Relations">Public Relations</option>
<option value="Communications">Communications</option>
<option value="Brand Management">Brand Management</option>
<option value="Content Creation">Content Creation</option>
<option value="Graphic Design">Graphic Design</option>
<option value="UI/UX Design">UI/UX Design</option>

<option value="Research & Development">Research & Development</option>
<option value="Innovation">Innovation</option>
<option value="Business Development">Business Development</option>
<option value="Strategy">Strategy</option>
<option value="Consulting">Consulting</option>
<option value="Training & Development">Training & Development</option>
<option value="Learning & Development">Learning & Development</option>
<option value="Talent Acquisition">Talent Acquisition</option>
<option value="Recruitment">Recruitment</option>
<option value="Employee Relations">Employee Relations</option>

<option value="Healthcare Services">Healthcare Services</option>
<option value="Medical Research">Medical Research</option>
<option value="Pharmacy">Pharmacy</option>
<option value="Nursing">Nursing</option>
<option value="Hospital Administration">Hospital Administration</option>
<option value="Education">Education</option>
<option value="Teaching">Teaching</option>
<option value="Academic Affairs">Academic Affairs</option>
<option value="Student Services">Student Services</option>
<option value="Library Services">Library Services</option>

<option value="Sports Management">Sports Management</option>
<option value="Event Management">Event Management</option>
<option value="Hospitality">Hospitality</option>
<option value="Tourism">Tourism</option>
<option value="Retail Management">Retail Management</option>
<option value="E-Commerce">E-Commerce</option>
<option value="Digital Marketing">Digital Marketing</option>
<option value="Advertising">Advertising</option>
<option value="Media Production">Media Production</option>
<option value="Film Production">Film Production</option>

<option value="Agriculture">Agriculture</option>
<option value="Food Production">Food Production</option>
<option value="Food Safety">Food Safety</option>
<option value="Environmental Management">Environmental Management</option>
<option value="Energy Management">Energy Management</option>
<option value="Renewable Energy">Renewable Energy</option>
<option value="Construction">Construction</option>
<option value="Civil Engineering">Civil Engineering</option>
<option value="Mechanical Engineering">Mechanical Engineering</option>
<option value="Electrical Engineering">Electrical Engineering</option>

<option value="Automotive Engineering">Automotive Engineering</option>
<option value="Aerospace Engineering">Aerospace Engineering</option>
<option value="Chemical Engineering">Chemical Engineering</option>
<option value="Mining">Mining</option>
<option value="Oil & Gas">Oil & Gas</option>
<option value="Banking">Banking</option>
<option value="Insurance">Insurance</option>
<option value="Investment Management">Investment Management</option>
<option value="Real Estate">Real Estate</option>
<option value="Property Management">Property Management</option>

<option value="Security Services">Security Services</option>
<option value="Law Enforcement">Law Enforcement</option>
<option value="Government Affairs">Government Affairs</option>
<option value="Nonprofit Services">Nonprofit Services</option>
<option value="Community Development">Community Development</option>
<option value="Social Services">Social Services</option>
<option value="Transportation">Transportation</option>
<option value="Shipping">Shipping</option>
<option value="Warehouse Management">Warehouse Management</option>
<option value="Customer Experience">Customer Experience</option>

</select>



</div>
)}

{/* EMPLOYEE DESIGNATION */}

{profileType === "Employee" && (

<div className="relative">

<Briefcase size={18} className="absolute left-3 top-4 text-gray-400"/>

<input
type="text"
name="designation"
placeholder="Designation (Product Eng / Developer)"
value={form.designation}
onChange={handleChange}
required
className="w-full pl-10 p-4 rounded-xl bg-[#020617] border border-white/10 text-white focus:outline-none focus:border-green-500"
/>

</div>

)}

{/* REGISTER BUTTON */}

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