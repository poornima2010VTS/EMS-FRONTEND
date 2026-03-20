import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBill,
  FaClipboardList,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [dark, setDark] = useState(false);
  const [time, setTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]); // ✅ NEW

  const navigate = useNavigate();

  // ⏱ CLOCK
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔁 FETCH DASHBOARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/core/");
        setStats(res.data);
      } catch (err) {
        localStorage.clear();
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // 🔁 FETCH EMPLOYEES
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees/employees/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setEmployees(data);
      } catch (err) {
        console.log("EMP ERROR:", err);
      }
    };

    fetchEmployees();
  }, []);

  // 🔁 FETCH ATTENDANCE (FOR PIE CHART)
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get("/attendance/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        const present = data.filter(d => d.status === "Present").length;
        const absent = data.filter(d => d.status === "Absent").length;

        setAttendanceData([
          { name: "Present", value: present },
          { name: "Absent", value: absent },
        ]);

        console.log("ATT DATA:", data);

      } catch (err) {
        console.log("Attendance error:", err);
      }
    };

    fetchAttendance();
  }, []);

  // ✅ ATTENDANCE
  const handleAttendance = async () => {
    try {
      await Promise.all(
        employees.map((emp) =>
          API.post("/attendance/", {
            employee: emp.id,
            status: "Present",
            check_in: "09:00:00",
            date: new Date().toISOString().split("T")[0],
          })
        )
      );

      alert("Attendance marked ✅");
    } catch (err) {
      alert("Error marking attendance");
    }
  };

  // ✅ PAYROLL
  const handlePayroll = async () => {
    try {
      await Promise.all(
        employees.map((emp) =>
          API.post("/payroll/", {
            employee: emp.id,
            basic_salary: emp.salary || 30000,
            bonus: 2000,
            deductions: 500,
          })
        )
      );

      alert("Payroll processed ✅");
    } catch (err) {
      alert("Error processing payroll");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div
          style={{
            padding: "25px",
            minHeight: "100vh",
            background: dark ? "#1e293b" : "#f1f5f9",
            color: dark ? "white" : "black",
          }}
        >
          <h2>Welcome Admin 👋</h2>
          <p>{time.toLocaleTimeString()}</p>

          <button onClick={() => setDark(!dark)} style={styles.btn}>
            Toggle Theme
          </button>

          {!stats ? (
            <h3>Loading Dashboard...</h3>
          ) : (
            <>
              {/* 🔥 KPI CARDS */}
              <div style={styles.cardContainer}>
                <Card title="Employees" value={stats.total_employees} icon={<FaUsers />} color="#4f46e5" path="/employees" />
                <Card title="Attendance" value={stats.total_attendance_records} icon={<FaCalendarCheck />} color="#10b981" path="/attendance" />
                <Card title="Leaves" value={stats.total_leaves || 0} icon={<FaClipboardList />} color="#f59e0b" path="/leave" />
                <Card title="Payroll" value={stats.total_payroll_records} icon={<FaMoneyBill />} color="#ef4444" path="/payroll" />
                <Card title="Calendar" value="📅" icon={"📆"} color="#6366f1" path="/leave-calendar" />
              </div>

              {/* 🆕 PIE CHART */}
              <div style={styles.chartBox}>
                <h3>📊 Attendance Overview</h3>

                {attendanceData.length === 0 ? (
                  <p>No attendance data</p>
                ) : (
                  <PieChart width={400} height={300}>
                    <Pie
                      data={attendanceData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </div>

              {/* ⚡ QUICK ACTIONS */}
              <div style={styles.box}>
                <h3>Quick Actions</h3>

                <button style={styles.btn} onClick={() => navigate("/employees")}>
                  ➕ Add Employee
                </button>

                <button style={styles.btn} onClick={handleAttendance}>
                  📅 Mark Attendance (All)
                </button>

                <button style={styles.btn} onClick={handlePayroll}>
                  💰 Run Payroll (All)
                </button>
              </div>

              {/* 🚪 LOGOUT */}
              <button
                style={styles.logout}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ CARD COMPONENT
const Card = ({ color, title, value, icon, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => path && navigate(path)}
      style={{
        background: color,
        color: "white",
        padding: "25px",
        borderRadius: "18px",
        flex: "1 1 200px",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <h3>{title}</h3>
      <p style={{ fontSize: "20px" }}>{value}</p>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  chartBox: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
  },

  box: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
  },

  btn: {
    margin: "5px",
    padding: "10px 15px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logout: {
    marginTop: "25px",
    padding: "12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default Dashboard;