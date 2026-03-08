const authorize = (role) => {
  return (req, res, next) => {

    const adminRoles = [
      "Admin",
      "Dean",
      "CEO",
      "Manager",
      "Director",
      "Boss",
      "HOD"

    ];

    if (role === "admin" && !adminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (role === "employee" && req.user.role !== "Employee") {
      return res.status(403).json({ message: "Employee access required" });
    }

    next();
  };
};

export default authorize;