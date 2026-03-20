import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("SENDING:", username, password); // 🔍 DEBUG

      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username: username.trim(),   // 🔥 FIX
          password: password.trim(),   // 🔥 FIX
        },
        {
          headers: {
            "Content-Type": "application/json", // 🔥 FIX
          },
        }
      );

      console.log("LOGIN SUCCESS:", res.data); // 🔍 DEBUG

      // 🔥 SAVE TOKEN
     localStorage.setItem("token", res.data.access);

      // 🔥 REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err); // 🔍 DEBUG
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bg}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>EMS Login</h1>
        <p style={styles.subtitle}>Employee Management System</p>

        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <div style={{ position: "relative" }}>
          <input
            type={show ? "text" : "password"}
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <span onClick={() => setShow(!show)} style={styles.eye}>
            {show ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Remember Me */}
        <div style={styles.remember}>
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <span> Remember me</span>
        </div>

        <button onClick={handleLogin} style={styles.button}>
          Login 🚀
        </button>

        <p style={styles.footer}>© EMS | Smart Workforce System</p>
      </div>
    </div>
  );
}

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    fontFamily: "sans-serif",
  },

  bg: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background: "linear-gradient(270deg, #667eea, #764ba2, #ff7eb3)",
    animation: "gradientMove 8s ease infinite",
    zIndex: -1,
  },

  card: {
    backdropFilter: "blur(15px)",
    background: "rgba(255,255,255,0.15)",
    padding: "40px",
    borderRadius: "20px",
    width: "320px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
    opacity: 0.8,
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    marginTop: "10px",
    gap: "5px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(45deg, #ff7eb3, #ff758c)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },

  footer: {
    marginTop: "15px",
    fontSize: "12px",
    opacity: 0.7,
  },
};

export default Login;