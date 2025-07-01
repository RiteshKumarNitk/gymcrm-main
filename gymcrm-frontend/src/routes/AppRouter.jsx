import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../pages/App";
import PhoneLogin from "../components/PhoneLogin";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import MemberDashboard from "../pages/MemberDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/superadmin" element={<div>Super Admin Page</div>} />
        <Route path="/admin" element={<div>Gym Admin Page</div>} />
        <Route path="/trainer" element={<div>Trainer Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
