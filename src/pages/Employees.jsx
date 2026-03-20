import React, { useEffect, useState } from "react";
import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // ✅ LOAD ALL DATA
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchDepartments()]);
    setLoading(false);
  };

  // ✅ FETCH EMPLOYEES (FIXED)
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees/employees/");

      console.log("EMP API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setEmployees(data);

    } catch (err) {
      console.log("❌ Employee Fetch Error:", err);
      setEmployees([]);
    }
  };

  // ✅ FETCH DEPARTMENTS (FIXED)
  const fetchDepartments = async () => {
  try {
    const res = await API.get("/departments/departments/");  // ✅ FIXED URL

    console.log("DEPT API:", res.data);  // 👈 DEBUG

    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.results || [];

    setDepartments(data);

  } catch (err) {
    console.log("❌ Department Fetch Error:", err);
    setDepartments([]);
  }
};

  // ✅ SEARCH SAFE
  const filteredEmployees = (employees || []).filter((emp) =>
    (emp?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ SUBMIT (ADD / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      alert("Name & Email required");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department ? Number(form.department) : null,
        salary: form.salary ? Number(form.salary) : 0,
      };

      if (editingId) {
        await API.patch(`/employees/employees/${editingId}/`, payload);
      } else {
        await API.post("/employees/employees/", payload);
      }

      alert("Saved ✅");

      resetForm();
      fetchEmployees();

    } catch (err) {
      console.log("❌ Save Error:", err.response?.data);
      alert("Save failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;

    try {
      await API.delete(`/employees/employees/${id}/`);

      alert("Deleted ✅");
      fetchEmployees();

    } catch (err) {
      console.log("❌ Delete Error:", err);
      alert("Delete failed ❌");
    }
  };

  // ✅ EDIT (FIXED)
  const handleEdit = (emp) => {
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",   // ✅ FIX
      salary: emp.salary || "",
    });

    setEditingId(emp.id);
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">

      <h2 className="text-primary mb-3">👩‍💼 Employee Management</h2>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="🔍 Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <div className="card p-3 mb-4">
        <h5>{editingId ? "Update" : "Add"} Employee</h5>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          {/* ✅ DEPARTMENT DROPDOWN */}
          <select
            className="form-control mb-2"
            value={form.department || ""}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          >
            <option value="">Select Department</option>

            {(departments || []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name || `Dept ${d.id}`}
              </option>
            ))}
          </select>

          <input
            className="form-control mb-2"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />

          <button className="btn btn-success w-100">
            {editingId ? "Update Employee" : "Add Employee"}
          </button>

        </form>
      </div>

      {/* TABLE */}
      <div className="card p-3">
        <h5>Employee List</h5>

        {loading ? (
          <p>Loading...</p>
        ) : filteredEmployees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>

                  <td>
                    {emp.department_name ||
                      emp.department ||
                      "—"}
                  </td>

                  <td>₹ {emp.salary || 0}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
}

export default Employees;