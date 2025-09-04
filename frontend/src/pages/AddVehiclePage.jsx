import React, { useState } from "react";
import { createVehicle } from "../api";
import "../App.css";

export default function AddVehiclePage() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tyres, setTyres] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Saving...");
    try {
      const res = await createVehicle({
        name,
        capacityKg: Number(capacity),
        tyres: Number(tyres),
      });
      setMsg("✅ Vehicle Saved (ID: " + res.data._id + ")");
      setName("");
      setCapacity("");
      setTyres("");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="vehicle-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={submit} className="vehicle-form">
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Capacity (KG)
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </label>

        <label>
          Tyres
          <input
            type="number"
            value={tyres}
            onChange={(e) => setTyres(e.target.value)}
            required
          />
        </label>

        <button type="submit">Add Vehicle</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
}
