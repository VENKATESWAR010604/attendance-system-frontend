import { useEffect, useState } from "react";

function StudentDashboard({ user, logout }) {
  const [data, setData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [open, setOpen] = useState(false); // ✅ mobile menu

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/attendance/${user.id}`)
        .then(res => res.json())
        .then(res => setData(res))
        .catch(err => console.error(err));

      fetch(`${import.meta.env.VITE_API_URL}/sessions`)
        .then(res => res.json())
        .then(res => setSessions(res || []))
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [user?.id]);

  if (!data) return null;

  const totalDays = data?.totalDays || 0;
  const present = data?.present || 0;
  const absent = data?.absent || 0;
  const history = data?.history || [];

  const percentage =
    totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

  const sessionWithStatus = sessions.map((s, i) => ({
    ...s,
    status: history[i] ? "present" : "absent"
  }));

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
          bg-[#0f172a] p-5 border-r border-white/10 fixed h-full z-20
          transition-all duration-300
          ${open ? "left-0" : "-left-60"}
          w-60 md:left-0
        `}
      >
        <h2 className="text-xl font-bold mb-6 text-blue-400">Student</h2>

        <p
          onClick={() => {
            setActiveTab("dashboard");
            setOpen(false);
          }}
          className={`mb-3 cursor-pointer ${
            activeTab === "dashboard" ? "text-blue-400" : "hover:text-blue-400"
          }`}
        >
          Dashboard
        </p>

        <p
          onClick={() => {
            setActiveTab("attendance");
            setOpen(false);
          }}
          className={`mb-3 cursor-pointer ${
            activeTab === "attendance" ? "text-blue-400" : "hover:text-blue-400"
          }`}
        >
          Attendance
        </p>

        <p
          onClick={() => {
            setActiveTab("sessions");
            setOpen(false);
          }}
          className={`mb-3 cursor-pointer ${
            activeTab === "sessions" ? "text-blue-400" : "hover:text-blue-400"
          }`}
        >
          Sessions
        </p>
      </div>

      {/* MAIN */}
      <div className="flex-1 md:ml-60 mt-16">

        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-[#0f172a] p-4 border-b border-white/10 fixed md:left-60 left-0 right-0 top-0 z-10">

          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-xl"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>

            <h1 className="text-xl font-bold text-blue-400">
              Student Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="bg-[#0f172a] p-5 rounded-xl mb-6">
                <h2 className="text-lg">
                  Welcome,{" "}
                  <span className="text-blue-400 font-semibold">
                    {user.clerk_user_id}
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                  <p className="text-gray-400">Total Days</p>
                  <h2 className="text-2xl font-bold mt-2">{totalDays}</h2>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                  <p className="text-gray-400">Present</p>
                  <h2 className="text-2xl font-bold text-green-400 mt-2">
                    {present}
                  </h2>
                </div>

                <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                  <p className="text-gray-400">Absent</p>
                  <h2 className="text-2xl font-bold text-red-400 mt-2">
                    {absent}
                  </h2>
                </div>

              </div>

              <div className="bg-[#0f172a] p-6 rounded-xl mb-6">
                <p className="mb-3 text-gray-400">Attendance Percentage</p>

                <div className="w-full bg-gray-800 h-4 rounded-full">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="mt-2 text-right text-blue-400 font-semibold">
                  {percentage}%
                </p>
              </div>
            </>
          )}

          {/* ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="bg-[#0f172a] p-6 rounded-xl mb-6">
              <p className="mb-4 text-gray-400">Recent Attendance</p>

              <div className="flex gap-2 flex-wrap">
                {history.length === 0 ? (
                  <p className="text-gray-500">No attendance data</p>
                ) : (
                  history.map((h, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-md ${
                        h ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SESSIONS */}
          {activeTab === "sessions" && (
            <div className="bg-[#0f172a] p-6 rounded-xl">
              <p className="mb-4 text-gray-400">Active Sessions</p>

              {sessionWithStatus.length === 0 ? (
                <p className="text-gray-500">No active sessions</p>
              ) : (
                sessionWithStatus.map(s => (
                  <div
                    key={s.id}
                    className="border border-white/10 p-3 mb-2 rounded-lg flex justify-between"
                  >
                    <div>
                      <p className="font-semibold text-blue-400">{s.title}</p>
                      <p className="text-sm text-gray-400">
                        {s.date} | {s.start_time} - {s.end_time}
                      </p>
                    </div>

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
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
