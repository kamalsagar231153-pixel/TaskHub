function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-yellow-500",
    Completed: "bg-green-600",
    Failed: "bg-red-600",
    "Awaiting Approval": "bg-blue-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
