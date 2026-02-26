import { Routes, Route } from "react-router";
import Home from "./Home";
import LoginPage from "./components/auth/login";
import SignupPage from "./components/auth/signup";
import DashboardLayout from "./components/dashboard/Dashboard";
import DashboardHome from "./components/dashboard/pages/DashboardHome";
import ApiKeys from "./components/dashboard/pages/ApiKeys";
import Credits from "./components/dashboard/pages/Credits";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="credits" element={<Credits />} />  
        </Route>
      </Routes>
    </>
  );
}

export default App;
