import { useEffect, useState } from "react";

function Institution({ logout }) {
  const [batches, setBatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // ✅ SAFE FETCH BATCHES (handles both formats)
    fetch(`${import.meta.env.VITE_API_URL}/batches`)
      .then(res => res.json())
      .then(data => {
        console.log("BATCHES RAW:", data);
        const batchArray = Array.isArray(data) ? data : data.data;
        setBatches(batchArray || []);
      })
      .catch(err => console.error("Batches error:", err));

    // ✅ SAFE FETCH USERS (handles both formats)
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        console.log("USERS RAW:", data);
        const userArray = Array.isArray(data) ? data : data.data;
        setUsers(userArray || []);
      })
      .catch(err => console.error("Users error:", err));

    // ✅ ATTENDANCE
    fetch(`${import.meta.env.VITE_API_URL}/attendance`)
      .then(res => res.json())
      .then(data => {
        console.log("ATTENDANCE:", data);
        setAttendance(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Attendance error:", err));

  }, []);

  // ✅ TRAINERS (SAFE FILTER)
  const trainers = users.filter(
    u => u.role && u.role.toLowerCase().trim() === "trainer"
  );

  // ✅ ATTENDANCE SUMMARY
  const getBatchAttendance = (batchId) => {
    const batchRecords = attendance;

    const total = batchRecords.length;

    const present = batchRecords.filter(
      a => a.status === "present"
    ).length;

    const percent =
      total ? Math.round((present / total) * 100) : 0;

    return { total, present, percent };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-400">
          Institution Dashboard
        </h1>

        <button
          className="bg-red-500 px-4 py-2 rounded shadow hover:scale-105 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* TRAINERS */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h2 className="text-lg mb-4 text-blue-300">Trainers</h2>

        <div className="grid grid-cols-2 gap-3">
          {trainers.length ? (
            trainers.map(t => (
              <div
                key={t.id}
                className="bg-[#020617] p-3 rounded-lg border border-white/10"
              >
                {t.name || t.clerk_user_id}
              </div>
            ))
          ) : (
            <p>No trainers found</p>
          )}
        </div>
      </div>

      {/* BATCHES */}
      <div className="bg-white/10 p-6 rounded-xl">
        <h2 className="text-lg mb-4 text-green-300">Batches</h2>

        <div className="grid grid-cols-2 gap-4">
          {batches.length ? (
            batches.map(b => {
              const stats = getBatchAttendance(b.id);

              return (
                <div
                  key={b.id}
                  className="bg-[#020617] p-4 rounded-xl border border-white/10 shadow"
                >
                  <h3 className="text-lg mb-2">{b.name}</h3>

                  <p className="text-sm text-gray-400">
                    Total: {stats.total}
                  </p>

                  <p className="text-green-400 text-sm">
                    Present: {stats.present}
                  </p>

                  <p className="text-blue-400 text-sm">
                    {stats.percent}% Attendance
                  </p>

                  {/* Progress */}
                  <div className="w-full bg-gray-800 h-2 rounded mt-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded"
                      style={{ width: `${stats.percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No batches found</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Institution;