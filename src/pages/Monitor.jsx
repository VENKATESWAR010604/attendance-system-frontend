import { useEffect, useState } from "react";

function Monitor({ logout }) {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data || []));

    // ✅ real attendance data
    fetch(`${import.meta.env.VITE_API_URL}/attendance`)
      .then(res => res.json())
      .then(data => setAttendance(data || []));
  }, []);

  // ✅ FIXED CALCULATION
  const total = attendance.length;

  const present = attendance.filter(
    a => a.status === "present"
  ).length;

  const absent = attendance.filter(
    a => a.status === "absent"
  ).length;

  const percentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-400">
          Monitoring Dashboard
        </h1>

        <button
          className="bg-red-500 px-4 py-2 rounded shadow hover:scale-105 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ATTENDANCE SUMMARY */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>Total Records</p>
          <h2 className="text-xl">{total}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>Present</p>
          <h2 className="text-green-400 text-xl">{present}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>Absent</p>
          <h2 className="text-red-400 text-xl">{absent}</h2>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p>Attendance %</p>
          <h2 className="text-blue-400 text-xl">{percentage}%</h2>
        </div>

      </div>

      {/* USERS TABLE (READ ONLY) */}
      <div className="bg-white/10 p-6 rounded-xl overflow-x-auto">

        <h2 className="mb-4 text-lg">All Users (Read Only)</h2>

        <table className="w-full text-left border border-white/20">
          <thead className="bg-white/10">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Monitor;