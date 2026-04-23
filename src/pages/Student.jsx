import { useEffect, useState } from "react";

function StudentDashboard({ user, logout }) {
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // attendance
    fetch(`${import.meta.env.VITE_API_URL}/attendance/${user.id}`)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));

    // sessions
    fetch(`${import.meta.env.VITE_API_URL}/sessions`)
      .then(res => res.json())
      .then(res => setSessions(res || []))
      .catch(err => console.error(err));

  }, [user?.id]);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-white text-xl">
        ⏳ Loading...
      </div>
    );
  }

  const totalDays = data?.totalDays || 0;
  const present = data?.present || 0;
  const absent = data?.absent || 0;
  const history = data?.history || [];

  const percentage =
    totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

  // ✅ ADD STATUS WITHOUT CHANGING STRUCTURE
  const sessionWithStatus = sessions.map((s, i) => ({
    ...s,
    status: history[i] ? "present" : "absent"
  }));

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_10px_#3b82f6]">
          Student Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg shadow-[0_0_10px_red] hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* USER */}
      <div className="bg-[#0f172a] p-5 rounded-xl mb-6 shadow-[0_0_15px_#0ea5e9]">
        <h2 className="text-lg">
          Welcome,{" "}
          <span className="text-blue-400 font-semibold">
            {user.clerk_user_id}
          </span>
        </h2>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0f172a] p-4 rounded-xl text-center shadow-[0_0_15px_#3b82f6]">
          <p className="text-gray-400">Total Days</p>
          <h2 className="text-2xl font-bold mt-2">{totalDays}</h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl text-center shadow-[0_0_15px_#22c55e]">
          <p className="text-gray-400">Present</p>
          <h2 className="text-2xl font-bold text-green-400 mt-2">
            {present}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl text-center shadow-[0_0_15px_#ef4444]">
          <p className="text-gray-400">Absent</p>
          <h2 className="text-2xl font-bold text-red-400 mt-2">
            {absent}
          </h2>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-[#0f172a] p-6 rounded-xl mb-6 shadow-[0_0_20px_#9333ea]">
        <p className="mb-3 text-gray-400">Attendance Percentage</p>

        <div className="w-full bg-gray-800 h-4 rounded-full">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full shadow-[0_0_10px_#3b82f6]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="mt-2 text-right text-blue-400 font-semibold">
          {percentage}%
        </p>
      </div>

      {/* HISTORY */}
      <div className="bg-[#0f172a] p-6 rounded-xl shadow-[0_0_20px_#22c55e] mb-6">
        <p className="mb-4 text-gray-400">Recent Attendance</p>

        <div className="flex gap-2 flex-wrap">
          {history.length === 0 ? (
            <p className="text-gray-500">No attendance data</p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-md ${
                  h
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              ></div>
            ))
          )}
        </div>
      </div>

      {/* ACTIVE SESSIONS */}
      <div className="bg-[#0f172a] p-6 rounded-xl shadow-[0_0_20px_#f59e0b]">
        <p className="mb-4 text-gray-400">Active Sessions</p>

        {sessionWithStatus.length === 0 ? (
          <p className="text-gray-500">No active sessions</p>
        ) : (
          sessionWithStatus.map(s => (
            <div
              key={s.id}
              className="border border-white/10 p-3 mb-2 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-blue-400">{s.title}</p>
                <p className="text-sm text-gray-400">
                  {s.date} | {s.start_time} - {s.end_time}
                </p>
              </div>

              {/* ✅ STATUS */}
              <span
                className={`px-3 py-1 rounded text-sm ${
                  s.status === "present"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default StudentDashboard;