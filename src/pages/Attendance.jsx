import React, { useEffect, useState } from "react";
import API from "../services/api";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [status, setStatus] = useState("Present");

  // ✅ Fetch Employees (FIXED)
  const fetchEmployees = async () => {
    try {
   const res = await API.get("/employees/employees/");// ✅ correct endpoint
      console.log("EMP API:", res.data);

      const data = res.data;

      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (Array.isArray(data.results)) {
        setEmployees(data.results);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error("EMP ERROR:", err);
    }
  };

  // ✅ Fetch Attendance
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/");
      console.log("ATT API:", res.data);

      const data = res.data;

      if (Array.isArray(data)) {
        setRecords(data);
      } else if (Array.isArray(data.results)) {
        setRecords(data.results);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("ATT ERROR:", err);
    }
  };

  // ✅ Check if already marked today
  const isAlreadyMarked = () => {
    const today = new Date().toISOString().split("T")[0];

    return records.some(
      (r) =>
        String(r.employee) === String(selectedEmp) &&
        r.date === today
    );
  };

  // ✅ Mark Attendance
  const markAttendance = async () => {
    if (!selectedEmp) {
      alert("Please select employee");
      return;
    }

    if (isAlreadyMarked()) {
      alert("⚠️ Attendance already marked for today");
      return;
    }

    try {
      await API.post("/attendance/", {
        employee: selectedEmp,
        status: status,
      });

      alert("✅ Attendance marked successfully");

      setSelectedEmp("");
      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert("Error marking attendance");
    }
  };

  // ✅ Load once
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  return (
    <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>📅 Attendance Management</h2>

      {/* ✅ MARK ATTENDANCE CARD */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Mark Attendance</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Employee Dropdown */}
          <select
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "220px",
            }}
          >
            <option value="">Select Employee</option>

            {employees.length > 0 ? (
              employees.map((emp, index) => (
                <option key={emp.id || index} value={emp.id}>
                  {emp.name ||
                    `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
                    emp.username ||
                    "No Name"}
                </option>
              ))
            ) : (
              <option disabled>⚠️ No Employees Found</option>
            )}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Present">✅ Present</option>
            <option value="Absent">❌ Absent</option>
          </select>

          {/* Button */}
          <button
            onClick={markAttendance}
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* ✅ ATTENDANCE TABLE */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Attendance Records</h3>

        <table width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#007bff", color: "#fff" }}>
              <th style={{ padding: "10px" }}>Employee</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                  No records found
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "10px" }}>
                    {r.employee_name || r.employee}
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        color: "#fff",
                        background:
                          r.status === "Present" ? "#28a745" : "#dc3545",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;