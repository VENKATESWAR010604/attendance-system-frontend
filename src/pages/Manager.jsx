import { useEffect, useState } from "react";

function Manager({ logout }) {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // ✅ USERS (SAFE FORMAT HANDLING)
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        console.log("USERS RAW:", data);
        const userArray = Array.isArray(data) ? data : data.data;
        setUsers(userArray || []);
      });

    // ✅ ATTENDANCE (SAFE FORMAT HANDLING)
    fetch(`${import.meta.env.VITE_API_URL}/attendance`)
      .then(res => res.json())
      .then(data => {
        console.log("ATTENDANCE RAW:", data);
        const attArray = Array.isArray(data) ? data : data.data;
        setAttendance(attArray || []);
      });

  }, []);

  // ✅ CALCULATIONS
  const totalUsers = users.length;
  const totalAttendance = attendance.length;

  const presentCount = attendance.filter(
    a => a.status === "present"
  ).length;

  const percentage =
    totalAttendance > 0
      ? ((presentCount / totalAttendance) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_#facc15]">
          Programme Manager Dashboard
        </h1>

        <button
          className="bg-red-500 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white/10 p-5 rounded-xl text-center shadow-lg">
          <p className="text-gray-300">Total Users</p>
          <h2 className="text-2xl mt-2">{totalUsers}</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl text-center shadow-lg">
          <p className="text-gray-300">Attendance Records</p>
          <h2 className="text-2xl mt-2">{totalAttendance}</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl text-center shadow-lg">
          <p className="text-gray-300">Present</p>
          <h2 className="text-2xl text-green-400 mt-2">
            {presentCount}
          </h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl text-center shadow-lg">
          <p className="text-gray-300">Attendance %</p>
          <h2 className="text-2xl text-blue-400 mt-2">
            {percentage}%
          </h2>
        </div>

      </div>

      {/* PROGRESS */}
      <div className="bg-white/10 p-6 rounded-xl shadow-lg">
        <p className="mb-3 text-gray-300">Overall Attendance Rate</p>

        <div className="w-full bg-gray-800 h-4 rounded-full">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="mt-2 text-right text-blue-400 font-semibold">
          {percentage}%
        </p>
      </div>

    </div>
  );
}

export default Manager;
