import { Routes, Route } from "react-router";
import Home from "./Home";
import LoginPage from "./components/auth/login";
import SignupPage from "./components/auth/signup";
import type { App } from "pgrid-be/app"; 
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
