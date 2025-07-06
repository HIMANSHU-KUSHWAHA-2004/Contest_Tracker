import React, { useEffect, useState } from "react";
import "./InformMe.css";

const InformMe = () => {
  const [contests, setContests] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedContest, setSelectedContest] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/contests")
      .then((res) => res.json())
      .then((data) => setContests(data))
      .catch((err) => console.error("Error fetching contests:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !selectedContest) {
      setMessage("Please select a contest and enter your number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/inform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          contest: selectedContest,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "You will be informed 1 hour before the contest.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="inform-container">
      <h2>Inform Me Before a Contest</h2>
      <form onSubmit={handleSubmit} className="inform-form">
        <label htmlFor="contest">Choose a contest:</label>
        <select
          id="contest"
          value={selectedContest || ""}
          onChange={(e) => setSelectedContest(e.target.value)}
        >
          <option value="">-- Select Contest --</option>
          {contests.map((contest, index) => (
            <option key={index} value={contest.event}>
              {contest.event} ({new Date(contest.start).toLocaleString()})
            </option>
          ))}
        </select>

        <label htmlFor="phone">Your Mobile Number:</label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 9876543210"
          required
        />

        <button type="submit">Notify Me</button>
        {message && <p className="inform-message">{message}</p>}
      </form>
    </div>
  );
};

export default InformMe;
