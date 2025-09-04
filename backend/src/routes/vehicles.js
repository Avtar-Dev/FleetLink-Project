const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const { estimatedRideDurationHours } = require("../utils/duration");

router.post("/", async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || typeof capacityKg !== "number" || typeof tyres !== "number") {
      return res.status(400).json({ msg: "Missing or invalid fields" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    return res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/available", async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ msg: "Missing required query parameters" });
    }

    const capacity = Number(capacityRequired);
    const start = new Date(startTime);
    if (isNaN(start.getTime()))
      return res.status(400).json({ msg: "Invalid startTime" });

    const durationHours = estimatedRideDurationHours(fromPincode, toPincode);
    const endTime = new Date(start.getTime() + durationHours * 3600 * 1000);

    const candidates = await Vehicle.find({
      capacityKg: { $gte: capacity },
      status: "active",
    }).lean();
    const candidateIds = candidates.map((v) => v._id);

    const overlapping = await Booking.find({
      vehicleId: { $in: candidateIds },
      startTime: { $lt: endTime },
      endTime: { $gt: start },
    }).lean();

    const bookedVehicleIds = new Set(
      overlapping.map((b) => String(b.vehicleId))
    );

    const available = candidates.filter(
      (v) => !bookedVehicleIds.has(String(v._id))
    );

    const result = available.map((v) => ({
      ...v,
      estimatedRideDurationHours: durationHours,
    }));
    return res.json({
      estimatedRideDurationHours: durationHours,
      vehicles: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
