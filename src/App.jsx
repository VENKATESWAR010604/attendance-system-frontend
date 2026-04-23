import { useState } from "react";
import Login from "./pages/Login";

import Student from "./pages/Student";
import Trainer from "./pages/Trainer";
import Institution from "./pages/Institution";
import Manager from "./pages/Manager";
import Monitor from "./pages/Monitor";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  // ✅ FIX (IMPORTANT)
  const role = user.role?.toLowerCase().trim();

  if (role === "student") return <Student user={user} logout={logout} />;
  if (role === "trainer") return <Trainer user={user} logout={logout} />;
  if (role === "institution") return <Institution logout={logout} />;
  if (role === "manager" || role === "programme manager")
    return <Manager logout={logout} />;
  if (role === "monitor") return <Monitor logout={logout} />;

  return <div>Invalid role</div>;
}

export default App;