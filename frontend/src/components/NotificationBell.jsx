import { useEffect, useState } from "react";
import socket from "../socket";
import { motion } from "framer-motion";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("newTask", (data) => {
      setNotifications(prev => [...prev, data.message]);
    });
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.1 }} className="relative">
      🔔
      {notifications.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
          {notifications.length}
        </span>
      )}
    </motion.div>
  );
}

export default NotificationBell;
