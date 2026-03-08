function TaskCard({ task, onDelete }) {
  const BASE_URL = "https://taskhub-3-i600.onrender.com";

  const getStatusStyle = () => {
    if (task.status === "Completed")
      return "bg-green-500/20 text-green-300";
    if (task.status === "Pending")
      return "bg-yellow-400/20 text-yellow-300";
    if (task.status === "Failed")
      return "bg-red-500/20 text-red-300";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div
      className="
      relative rounded-2xl p-6
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]
      border border-white/10
      shadow-[0_20px_60px_rgba(0,0,0,0.7)]
      hover:-translate-y-1 hover:shadow-2xl
      transition-all duration-300
    "
    >
      {/* STATUS BADGE */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle()}`}
      >
        {task.status}
      </span>

      {/* TASK TITLE */}
      <h2 className="text-xl font-semibold text-blue-400 mb-6">
        Task : {task.description}
      </h2>

      {/* GRID DETAILS */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        <div className="bg-black/20 border border-white/10 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Admin Email</p>
          <p className="text-white font-medium">
            {task.assignedBy?.adminEmail || "admin@taskhub.com"}
          </p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Admin Role</p>
          <p className="text-white font-medium">
            {task.assignedBy?.designation || "Administrator"}
          </p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Department</p>
          <p className="text-white font-medium">{task.department}</p>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Due Date</p>
          <p className="text-white font-medium">
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>

      </div>

      {/* FILE SECTION */}
      <div className="mt-6 space-y-3">

        {/* ADMIN FILE */}
        {task.adminFile && (
          <a
            href={`${BASE_URL}/uploads/${task.adminFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
            flex items-center gap-2
            text-blue-300 text-sm
            hover:text-blue-200
            underline
          "
          >
            📎 View Assigned File
          </a>
        )}

        {/* EMPLOYEE SUBMISSION */}
        {task.employeeSubmission && (
          <a
            href={`${BASE_URL}/uploads/${task.employeeSubmission}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
            flex items-center gap-2
            text-green-300 text-sm
            hover:text-green-200
            underline
          "
          >
            📂 View Employee Submission
          </a>
        )}

        {/* EXTENSION PROOF */}
        {task.extension?.proofFile && (
          <a
            href={`${BASE_URL}/uploads/${task.extension.proofFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
            flex items-center gap-2
            text-yellow-300 text-sm
            hover:text-yellow-200
            underline
          "
          >
            📄 View Extension Proof
          </a>
        )}
      </div>

      {/* DELETE BUTTON */}
      {onDelete && (
        <button
          onClick={() => onDelete(task._id)}
          className="
          mt-6 w-full py-2 rounded-xl
          bg-black/40 hover:bg-black/60
          text-sm
          transition-all duration-300
        "
        >
          Remove Task
        </button>
      )}
    </div>
  );
}

export default TaskCard;