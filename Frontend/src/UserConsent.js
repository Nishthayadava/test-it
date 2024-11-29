import React, { useEffect, useState } from "react";
import axios from "axios";

const UserConsent = () => {
  const [entries, setEntries] = useState([]);

  // Fetch entries from backend
  const fetchEntries = async () => {
    try {
      const response = await axios.get("/api/wpform-entries");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle agree button click
  const handleAgree = async (id) => {
    try {
      await axios.post(`/api/agree/${id}`);
      fetchEntries();  // Refresh entries after updating
    } catch (error) {
      console.error("Error updating agreement:", error);
    }
  };

  return (
    <div>
      <h2>WPForm Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Entry Data</th>
            <th>Agreement</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.user_email}</td>
              <td>{JSON.stringify(entry.entry_data)}</td>
              <td>
                <button
                  onClick={() => handleAgree(entry.id)}
                  style={{
                    backgroundColor: entry.has_agreed ? "green" : "red",
                    color: "white",
                  }}
                  disabled={entry.has_agreed}
                >
                  {entry.has_agreed ? "Agreed" : "Agree"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserConsent;
