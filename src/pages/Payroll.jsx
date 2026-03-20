import React, { useEffect, useState } from "react";
import API from "../services/api";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await API.get("payroll/salary/");
      const data = res.data.results || res.data || [];
      setPayroll(data);
    } catch (err) {
      console.error("Error fetching payroll", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePayroll = async () => {
    try {
      setMessage("Generating payroll...");
      await API.get("/payroll/generate/");
      setMessage("✅ Payroll generated successfully");
      fetchPayroll();
    } catch (err) {
      setMessage("❌ Error generating payroll");
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div style={{ padding: "25px", background: "#f5f6fa", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Payroll Management</h2>
          <p style={{ color: "gray" }}>March 2026</p>
        </div>

        <button
          onClick={generatePayroll}
          style={{
            padding: "10px 18px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Generate Payroll
        </button>
      </div>

      {message && <p>{message}</p>}

      {/* TABLE */}
      <div style={{
        background: "white",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
      }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f2f6", textAlign: "left" }}>
                <th>Employee</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Basic</th>
                <th>HRA</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
              </tr>
            </thead>

            <tbody>
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan="8">No payroll data</td>
                </tr>
              ) : (
                payroll.map((p) => {
                  const present = p.present_days || 0;
                  const totalDays = 30;

                  const totalSalary =
                    (p.basic || 0) +
                    (p.hra || 0) +
                    (p.allowances || 0);

                  const perDay = totalSalary / totalDays;
                  const net = Math.round(perDay * present);

                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>
                        {p.employee_name || "N/A"}
                      </td>

                      <td>{present} / 30</td>

                      {/* STATUS BADGE */}
                      <td>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor: present === 0 ? "#ff6b6b" : "#2ecc71",
                          color: "white",
                          fontSize: "12px"
                        }}>
                          {present === 0 ? "Absent" : "Active"}
                        </span>
                      </td>

                      <td>{p.basic}</td>
                      <td>{p.hra}</td>
                      <td>{p.allowances}</td>
                      <td>{p.deductions}</td>

                      {/* NET SALARY */}
                      <td style={{
                        fontWeight: "bold",
                        color: present === 0 ? "red" : "green"
                      }}>
                        ₹ {net}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Payroll;