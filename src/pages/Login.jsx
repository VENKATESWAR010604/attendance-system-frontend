import { useState } from "react";

function Login({ setUser }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const handleLogin = async () => {
    if (!userId || !password || !role) {
      alert("Fill all fields");
      return;
    }

    setLoading(true); // ✅ instant response

    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clerk_user_id: userId.trim(),
          password: password.trim(),
          role: role.trim().toLowerCase()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setLoading(false);
        return;
      }

      // ✅ slight delay for smooth transition feel
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser({ ...data });
      }, 300);

    } catch (err) {
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/bg.jpg')"
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* card */}
      <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 rounded-2xl w-80 shadow-2xl text-white transition-all duration-300">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          className="border-b border-white/50 bg-transparent p-2 w-full mb-4 outline-none placeholder-white focus:scale-[1.02] transition"
          placeholder="User ID"
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          className="border-b border-white/50 bg-transparent p-2 w-full mb-4 outline-none placeholder-white focus:scale-[1.02] transition"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border border-white/50 bg-transparent p-2 w-full mb-4 rounded text-white focus:scale-[1.02] transition"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" className="text-black">Select Role</option>
          <option value="student" className="text-black">Student</option>
          <option value="trainer" className="text-black">Trainer</option>
          <option value="institution" className="text-black">Institution</option>
          <option value="manager" className="text-black">Programme Manager</option>
          <option value="monitor" className="text-black">Monitoring Officer</option>
        </select>

        <button
          className={`w-full py-2 rounded-lg transition-all duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-900/80 hover:bg-blue-900 hover:scale-[1.03]"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}

export default Login;