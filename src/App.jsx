import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadLists from "./pages/LeadLists";
import Leads from "./pages/Leads";
import Invitations from "./pages/Invitations";
import Invite from "./pages/Invite";
import Signup from "./pages/signup";
import CreateLeadList from "./pages/CreateLeadList";
export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateLeadList/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lists/:type" element={<LeadLists />} />
        <Route path="/leads/:leadListId" element={<Leads />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/invite/:leadListId" element={<Invite />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}