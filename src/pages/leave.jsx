import React, { useEffect, useState } from "react";
import API from "../services/api";

function Leave() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee: "",
    start_date: "",
    end_date: "",
  });

  // 🔁 FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/employees/");
      setEmployees(res.data.results || []);
    } catch (err) {
      console.log("EMP ERROR:", err);
    }
  };

  // 🔁 FETCH LEAVES
  const fetchLeaves = async () => {
    try {
      const res = await API.get("leave/");
      setLeaves(res.data.results || []);
      setLoading(false);
    } catch (err) {
      console.log("LEAVE ERROR:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  // ✅ APPLY LEAVE
  const applyLeave = async () => {
    if (!form.employee || !form.start_date || !form.end_date) {
      alert("Please fill all fields ⚠️");
      return;
    }

    try {
      await API.post("leave/", {
        employee: parseInt(form.employee),
        start_date: form.start_date,
        end_date: form.end_date,
        status: "Pending",
      });

      alert("Leave Applied ✅");

      setForm({
        employee: "",
        start_date: "",
        end_date: "",
      });

      fetchLeaves();
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Failed ❌");
    }
  };

  // ✅ APPROVE / REJECT
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`leave/${id}/`, { status });

      alert(`Leave ${status} ✅`);
      fetchLeaves();
    } catch (err) {
      console.log("STATUS ERROR:", err.response?.data);
      alert("Update Failed ❌");
    }
  };

  // 🔥 🔥 FIXED SEARCH (NAME + ID)
  const filteredLeaves = leaves.filter((l) => {
    const emp = employees.find((e) => e.id === l.employee);

    const name =
      (l.employee_name ||
        (emp &&
          (emp.name ||
            `${emp.first_name || ""} ${emp.last_name || ""}`))) ||
      "";

    const id = String(l.employee || "");

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.includes(search)
    );
  });

  const totalLeaves = leaves.length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const pending = leaves.filter((l) => l.status === "Pending").length;

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary">🌈 Leave Dashboard</h2>

      {/* 📊 Analytics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white text-center p-3">
            <h6>Total</h6>
            <h2>{totalLeaves}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white text-center p-3">
            <h6>Approved</h6>
            <h2>{approved}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-warning text-dark text-center p-3">
            <h6>Pending</h6>
            <h2>{pending}</h2>
          </div>
        </div>
      </div>

      {/* 🔍 Search */}
      <input
        className="form-control mb-4"
        placeholder="🔍 Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📅 Apply Leave */}
      <div className="card p-3 mb-4">
        <h5>Apply Leave</h5>

        <select
          className="form-control mb-2"
          value={form.employee}
          onChange={(e) =>
            setForm({ ...form, employee: e.target.value })
          }
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name ||
                `${e.first_name || ""} ${e.last_name || ""}`}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control mb-2"
          value={form.start_date}
          onChange={(e) =>
            setForm({ ...form, start_date: e.target.value })
          }
        />

        <input
          type="date"
          className="form-control mb-2"
          value={form.end_date}
          onChange={(e) =>
            setForm({ ...form, end_date: e.target.value })
          }
        />

        <button className="btn btn-primary w-100" onClick={applyLeave}>
          Apply Leave
        </button>
      </div>

      {/* 👩‍💼 Manager Approval */}
      <div className="card p-3">
        <h5>Manager Approval</h5>

        {filteredLeaves.length === 0 ? (
          search ? (
            <p>No matching results</p>
          ) : (
            <p>No leave records yet</p>
          )
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((l) => {
                const emp = employees.find(
                  (e) => e.id === l.employee
                );

                const name =
                  l.employee_name ||
                  (emp &&
                    (emp.name ||
                      `${emp.first_name || ""} ${
                        emp.last_name || ""
                      }`)) ||
                  `Employee ${l.employee}`;

                return (
                  <tr key={l.id}>
                    <td>{name}</td>
                    <td>{l.start_date}</td>
                    <td>{l.end_date}</td>

                    <td>
                      <span
                        className={
                          l.status === "Approved"
                            ? "badge bg-success"
                            : l.status === "Rejected"
                            ? "badge bg-danger"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {l.status}
                      </span>
                    </td>

                    <td>
                      {l.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              updateStatus(l.id, "Approved")
                            }
                          >
                            ✔
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              updateStatus(l.id, "Rejected")
                            }
                          >
                            ✖
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Leave;