import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Matcher from "./pages/Matcher";
import Interview from "./pages/Interview";
import Chat from "./pages/Chat";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import AnalysisDashboard from "./pages/AnalysisDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 PROTECTED ROUTES WITH LAYOUT */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/resume"    element={<ProtectedRoute><MainLayout><Resume /></MainLayout></ProtectedRoute>} />
        <Route path="/matcher"   element={<ProtectedRoute><MainLayout><Matcher /></MainLayout></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><MainLayout><Interview /></MainLayout></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><MainLayout><Chat /></MainLayout></ProtectedRoute>} />
        <Route path="/feedback"  element={<ProtectedRoute><MainLayout><Feedback /></MainLayout></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><MainLayout><History /></MainLayout></ProtectedRoute>} />
        <Route path="/analysis"  element={<ProtectedRoute><MainLayout><AnalysisDashboard /></MainLayout></ProtectedRoute>} />

        {/* 🔁 DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;