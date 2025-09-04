import React, { useState } from "react";
import { searchAvailable, createBooking } from "../api";

export default function SearchBookPage() {
  const [capacityRequired, setCapacityRequired] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startTime, setStartTime] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [searched, setSearched] = useState(false);

  const onSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setMsg("");
    setSearched(true);
    try {
      const res = await searchAvailable({
        capacityRequired: Number(capacityRequired),
        fromPincode: from,
        toPincode: to,
        startTime,
      });
      setResults(res.data.vehicles || []);
      setMsg(`Duration hours: ${res.data.estimatedRideDurationHours}`);
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const book = async (vehicleId) => {
    setMsg("Booking...");
    try {
      const res = await createBooking({
        vehicleId,
        fromPincode: from,
        toPincode: to,
        startTime,
        customerId: "cust-001",
      });
      setMsg("Booked: " + res.data._id);
      setResults((prev) => prev.filter((v) => v._id !== vehicleId));
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="search-container">
      <h2>Search & Book</h2>
      <form onSubmit={onSearch} className="search-form">
        <div>
          <label>
            Capacity required
            <input
              value={capacityRequired}
              onChange={(e) => setCapacityRequired(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            From Pincode
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            To Pincode
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Start Time
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          Check Availability
        </button>
      </form>

      <div className="results">
        {searched && results.length === 0 && (
          <div className="no-results">
            No Vehicles available according to your requirement
          </div>
        )}
        {results.map((v) => (
          <div key={v._id} className="vehicle-card">
            <div className="vehicle-name">
              <strong>{v.name}</strong>
            </div>
            <div>
              Capacity: {v.capacityKg} KG | Tyres: {v.tyres}
            </div>
            <div>Estimated Duration: {v.estimatedRideDurationHours} hours</div>
            <button onClick={() => book(v._id)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
