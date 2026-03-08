import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/taskhub-logo.svg";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", data);

      login(data);

      const adminRoles = [
        "Admin",
        "Dean",
        "CEO",
        "Manager",
        "Director",
        "Boss",
        "HOD"
      ];

      if (adminRoles.includes(data.role)) {
        navigate("/admin");
      } else {
        navigate("/employee");
      }

    } catch (error) {

      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Server connection error");
      }

    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-[#020617] overflow-hidden">

      {/* Animated Gradient Lights */}

      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 blur-[140px]"
      />

      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-600/20 blur-[140px]"
      />

      {/* Subtle grid */}

      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#ffffff10_1px,transparent_1px),linear-gradient(90deg,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Main Card */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{
          rotateX: 3,
          rotateY: -3,
          scale: 1.02
        }}
        className="relative grid md:grid-cols-2 w-[900px] rounded-3xl overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.9)] border border-white/10"
      >

        {/* LEFT PANEL */}

        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] border-r border-white/10">


<div className="flex flex-col items-center justify-center mb-6">

<img
  src={logo}
  alt="TaskHub Logo"
  className="w-48 h-48 drop-shadow-[0_0_50px_rgba(99,102,241,0.9)]"
/>

<motion.h1
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="text-4xl font-bold text-white mt-4"
>
  TaskHub
</motion.h1>

</div>

          <p className="text-blue-400 font-medium mb-6">
            Organize Work. Track Progress. Empower Teams.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed">
            TaskHub is a modern productivity platform designed to streamline
            task assignments, monitor employee performance and maintain
            transparent collaboration across departments.
          </p>

          <div className="mt-10 space-y-3 text-sm text-gray-500">

            <motion.p whileHover={{ x: 6 }}>✔ Smart Task Assignment</motion.p>
            <motion.p whileHover={{ x: 6 }}>✔ Real-Time Analytics</motion.p>
            <motion.p whileHover={{ x: 6 }}>✔ Team Productivity Insights</motion.p>
            <motion.p whileHover={{ x: 6 }}>✔ Extension Request Management</motion.p>

          </div>

        </div>

        {/* LOGIN FORM */}

        <motion.form
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-center"
        >

          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Sign in to continue to your dashboard
          </p>

          {/* Email */}

          <motion.div
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            className="relative mb-4"
          >

            <FiMail className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 p-3 rounded-xl bg-[#020617] border border-blue-500/30 text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </motion.div>

          {/* Password */}

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative mb-6"
          >

            <FiLock className="absolute left-3 top-3.5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 p-3 rounded-xl bg-[#020617] border border-red-500/30 text-white focus:outline-none focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>

          </motion.div>

          {/* Login Button */}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 40px rgba(59,130,246,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="
            w-full
            p-3
            rounded-xl
            bg-gradient-to-r from-blue-600 to-red-600
            text-white
            font-semibold
            shadow-lg
            transition-all
            duration-300
            "
          >
            Login to TaskHub
          </motion.button>

          <p className="text-gray-500 text-xs mt-6 text-center">
            Secure workspace access for your organization
          </p>

          {/* Register */}

          <p className="text-gray-400 text-sm mt-4 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 cursor-pointer hover:text-blue-300 transition"
            >
              Create Account
            </span>
          </p>

        </motion.form>

      </motion.div>

    </div>
  );
}

export default Login;