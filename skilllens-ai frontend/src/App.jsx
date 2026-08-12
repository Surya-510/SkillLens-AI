import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import JobDescription from "./pages/JobDescription";
import History from "./pages/History";
import ATSAnalysis from "./pages/ATSAnalysis";
import SkillGap from "./pages/SkillGap";
import Interview from "./pages/Interview";
import ResumeDetails from "./pages/ResumeDetails";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="USER">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute role="USER">
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/job-description"
            element={
              <ProtectedRoute role="USER">
                <JobDescription />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute role="USER">
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ats-analysis/:id"
            element={
              <ProtectedRoute role="USER">
                <ATSAnalysis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap/:id"
            element={
              <ProtectedRoute role="USER">
                <SkillGap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute role="USER">
                <Interview />
              </ProtectedRoute>
            }
          />

         <Route
  path="/resume/:id"
  element={
    <ProtectedRoute role="USER">
      <ResumeDetails />
    </ProtectedRoute>
  }
/>


          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}