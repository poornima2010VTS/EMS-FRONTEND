import Sidebar from "./Sidebar";
import { FaUserCircle } from "react-icons/fa";

function Layout({ children }) {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Main Area */}
      <div style={styles.main}>
        {/* Top Navbar */}
        <div style={styles.navbar}>
          <h2>EMS System</h2>

          <div style={styles.profile}>
            <FaUserCircle size={28} />
            <button
              style={styles.logout}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
  },

  navbar: {
    background: "#ffffff",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  content: {
    padding: "25px",
    overflowY: "auto",
  },
};

export default Layout;