import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../services/api";

function LeaveCalendar() {
  const [leaves, setLeaves] = useState([]);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("leave/");
      setLeaves(res.data.results || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CHECK IF DATE HAS LEAVE
  const getLeaveForDate = (date) => {
    return leaves.filter((l) => {
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);

      return date >= start && date <= end;
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">📅 Leave Calendar</h2>

      <div className="card p-3 shadow">
        <Calendar
          onChange={setValue}
          value={value}
          tileContent={({ date }) => {
            const dayLeaves = getLeaveForDate(date);

            if (dayLeaves.length === 0) return null;

            return (
              <div style={{ marginTop: "5px" }}>
                {dayLeaves.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "10px",
                      background:
                        l.status === "Approved"
                          ? "green"
                          : l.status === "Rejected"
                          ? "red"
                          : "orange",
                      color: "white",
                      borderRadius: "4px",
                      padding: "2px",
                      marginBottom: "2px",
                    }}
                  >
                    {l.employee_name || l.employee}
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export default LeaveCalendar;