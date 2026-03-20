import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
// import Leave from "./pages/Leave";
import Leave from "./pages/leave";
import LeaveCalendar from "./pages/LeaveCalendar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Employees />
            </PrivateRoute>
          }
        />

        {/* ATTENDANCE */}
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />

        {/* PAYROLL */}
        <Route
          path="/payroll"
          element={
            <PrivateRoute>
              <Payroll />
            </PrivateRoute>
          }
        />
         {/* leave */}
       <Route
  path="/leave"
  element={
    <PrivateRoute>
      <Leave />
    </PrivateRoute>
  }
/>

         {/* CL- leave */}
       <Route
  path="/leave-calendar"
  element={
    <PrivateRoute>
      <LeaveCalendar />
    </PrivateRoute>
  }
/>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;