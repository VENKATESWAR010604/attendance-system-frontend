import { useState, useEffect } from "react";

function Trainer({ user, logout }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [batch, setBatch] = useState(2);

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const onlyStudents = data.filter(u => u.role === "student");
        setStudents(onlyStudents);
      });
  }, []);

  const createSession = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: batch,
          trainer_id: user.id,
          title,
          date,
          start_time: start,
          end_time: end
        })
      });

      const session = await res.json();

      for (let student of students) {
        await fetch(`${import.meta.env.VITE_API_URL}/attendance/mark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: session.id,
            student_id: student.id,
            status: "present"
          })
        });
      }

      alert("Session + Attendance created ✅");

      fetch(`${import.meta.env.VITE_API_URL}/attendance`)
        .then(res => res.json())
        .then(data => setAttendance(data || []));

    } catch (err) {
      alert("Error creating session");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/attendance`)
      .then(res => res.json())
      .then(data => setAttendance(data || []));
  }, []);

  const inviteLink = `https://your-frontend.vercel.app/join?batch_id=${batch}`;

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
      <div className={`
        bg-[#0f172a] p-5 border-r border-white/10 fixed h-full z-20
        flex flex-col justify-between
        transition-all duration-300
        ${open ? "left-0" : "-left-60"}
        w-60 md:left-0
      `}>

        <div>
          <h2 className="text-xl font-bold mb-6 text-blue-400">Trainer</h2>

          <p onClick={() => { setActiveTab("dashboard"); setOpen(false); }}
            className={`mb-3 cursor-pointer ${activeTab==="dashboard"?"text-blue-400":"hover:text-blue-400"}`}>
            Dashboard
          </p>

          <p onClick={() => { setActiveTab("create"); setOpen(false); }}
            className={`mb-3 cursor-pointer ${activeTab==="create"?"text-blue-400":"hover:text-blue-400"}`}>
            Create Session
          </p>

          <p onClick={() => { setActiveTab("attendance"); setOpen(false); }}
            className={`mb-3 cursor-pointer ${activeTab==="attendance"?"text-blue-400":"hover:text-blue-400"}`}>
            Attendance
          </p>

          <p onClick={() => { setActiveTab("invite"); setOpen(false); }}
            className={`mb-3 cursor-pointer ${activeTab==="invite"?"text-blue-400":"hover:text-blue-400"}`}>
            Invite Link
          </p>
        </div>

        <button onClick={logout} className="w-full bg-red-500 py-2 rounded-lg">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 md:ml-60 mt-16">

        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-[#0f172a] p-4 border-b border-white/10 fixed md:left-60 left-0 right-0 top-0 z-10">

          <div className="flex items-center gap-3">
            <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>☰</button>
            <h2 className="text-xl text-blue-400 font-bold">Trainer Dashboard</h2>
          </div>

          {/* PROFILE */}
          <div className="relative">
            <div onClick={() => setProfileOpen(!profileOpen)}
              className="cursor-pointer bg-blue-500 w-10 h-10 flex items-center justify-center rounded-full">
              {user.clerk_user_id?.charAt(0).toUpperCase()}
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 bg-[#0f172a] border border-white/10 rounded shadow-lg w-48">

                <div className="p-3 border-b border-white/10">
                  <p className="text-sm text-gray-300">Signed in as</p>
                  <p className="text-blue-400 font-semibold">{user.clerk_user_id}</p>
                </div>

                <p className="px-3 py-2 hover:bg-white/10 cursor-pointer">👤 Profile</p>
                <p className="px-3 py-2 hover:bg-white/10 cursor-pointer">⚙️ Settings</p>
                <p className="px-3 py-2 hover:bg-white/10 cursor-pointer">🔔 Notifications</p>

                <div className="border-t border-white/10"></div>

                <p onClick={logout}
                  className="px-3 py-2 hover:bg-red-500/20 text-red-400 cursor-pointer">
                  🚪 Logout
                </p>
              </div>
            )}
          </div>

        </div>

        {/* CONTENT */}
        <div className="p-6">

          {activeTab === "dashboard" && (
            <div className="bg-white/10 p-6 rounded-xl mb-6">
              <h2 className="text-lg text-blue-400">Welcome Trainer</h2>
            </div>
          )}

          {activeTab === "create" && (
            <div className="bg-white/10 p-6 rounded-xl mb-6">
              <h3 className="mb-4">Create Session</h3>

              {/* FIXED INPUTS */}
              <input
                className="w-full p-2 mb-2 bg-[#020617] border text-white placeholder-gray-400"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="date"
                className="w-full p-2 mb-2 bg-[#020617] border text-white"
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                className="w-full p-2 mb-2 bg-[#020617] border text-white"
                onChange={(e) => setStart(e.target.value)}
              />

              <input
                type="time"
                className="w-full p-2 mb-2 bg-[#020617] border text-white"
                onChange={(e) => setEnd(e.target.value)}
              />

              <input
                type="number"
                className="w-full p-2 mb-2 bg-[#020617] border text-white"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />

              <button className="bg-green-500 px-4 py-2 mt-2 rounded"
                onClick={createSession}>
                Create Session
              </button>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white/10 p-6 rounded-xl mb-6">
              <h3 className="mb-4">Attendance Records</h3>

              {attendance.length === 0 ? (
                <p>No attendance records</p>
              ) : (
                attendance.map((a, i) => (
                  <div key={i} className="border p-2 mb-2 flex justify-between">
                    <span>{a.student_id}</span>
                    <span className={
                      a.status === "present" ? "text-green-400" : "text-red-400"
                    }>
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "invite" && (
            <div className="bg-white/10 p-4 rounded-xl">
              <p>Invite Link:</p>
              <p className="text-blue-400">{inviteLink}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Trainer;
