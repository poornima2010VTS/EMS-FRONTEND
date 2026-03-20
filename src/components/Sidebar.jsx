import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBill,
  FaClipboardList,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div style={styles.container}>
      <h2 style={styles.logo}>EMS</h2>

      <NavLink to="/dashboard" style={styles.link} className="nav-link">
        <FaHome /> <span>Dashboard</span>
      </NavLink>

      <NavLink to="/employees" style={styles.link} className="nav-link">
        <FaUsers /> <span>Employees</span>
      </NavLink>

      <NavLink to="/attendance" style={styles.link} className="nav-link">
        <FaCalendarCheck /> <span>Attendance</span>
      </NavLink>

      <NavLink to="/leave" style={styles.link} className="nav-link">
        <FaClipboardList /> <span>Leave</span>
      </NavLink>

      <NavLink to="/payroll" style={styles.link} className="nav-link">
        <FaMoneyBill /> <span>Payroll</span>
      </NavLink>
    </div>
  );
}

const styles = {
  container: {
    width: "220px",
    height: "100vh",
    background: "linear-gradient(180deg, #1e293b, #0f172a)",
    color: "white",
    padding: "20px 10px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    borderRadius: "10px",
    color: "#cbd5f5",
    textDecoration: "none",
    marginBottom: "10px",
    transition: "0.3s",
  },
};

export default Sidebar;