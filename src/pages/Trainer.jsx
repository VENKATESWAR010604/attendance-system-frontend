import { useState, useEffect } from "react";

function Trainer({ user, logout }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [batch, setBatch] = useState(2);

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]); // ✅ NEW

  // ✅ fetch students (so we can mark attendance)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const onlyStudents = data.filter(
          u => u.role === "student"
        );
        setStudents(onlyStudents);
      });
  }, []);

  // ✅ create session + auto attendance
  const createSession = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

      // ✅ AUTO ADD ATTENDANCE FOR ALL STUDENTS
      for (let student of students) {
        await fetch(`${import.meta.env.VITE_API_URL}/attendance/mark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            session_id: session.id,
            student_id: student.id,
            status: "present" // default
          })
        });
      }

      alert("Session + Attendance created ✅");

      // 🔄 refresh attendance list
      fetch(`${import.meta.env.VITE_API_URL}/attendance`)
        .then(res => res.json())
        .then(data => setAttendance(data || []));

    } catch (err) {
      console.error(err);
      alert("Error creating session");
    }
  };

  // ✅ fetch attendance
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/attendance`)
      .then(res => res.json())
      .then(data => setAttendance(data || []));
  }, []);

  const trainerAttendance = attendance;

  const inviteLink = `http://localhost:5173/join?batch_id=${batch}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl text-blue-400 font-bold">
          Trainer Dashboard
        </h2>

        <button
          className="bg-red-500 px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* CREATE SESSION */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h3 className="mb-4">Create Session</h3>

        <input
          className="w-full p-2 mb-2 bg-transparent border"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 mb-2 bg-transparent border"
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          className="w-full p-2 mb-2 bg-transparent border"
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="time"
          className="w-full p-2 mb-2 bg-transparent border"
          onChange={(e) => setEnd(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 mb-2 bg-transparent border"
          placeholder="Batch ID"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />

        <button
          className="bg-green-500 px-4 py-2 mt-2 rounded"
          onClick={createSession}
        >
          Create Session
        </button>
      </div>

      {/* ATTENDANCE VIEW */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h3 className="mb-4">Attendance Records</h3>

        {trainerAttendance.length === 0 ? (
          <p>No attendance records</p>
        ) : (
          trainerAttendance.map((a, i) => (
            <div key={i} className="border p-2 mb-2 flex justify-between">
              <span>{a.student_id}</span>

              <span
                className={
                  a.status === "present"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {a.status === "present" ? "Present" : "Absent"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* INVITE LINK */}
      <div className="bg-white/10 p-4 rounded-xl">
        <p>Invite Link:</p>
        <p className="text-blue-400">{inviteLink}</p>
      </div>

    </div>
  );
}

export default Trainer;