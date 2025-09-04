const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const { estimatedRideDurationHours } = require("../utils/duration");

router.post("/", async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } =
      req.body;
    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ msg: "Vehicle not found" });

    const start = new Date(startTime);
    if (isNaN(start.getTime()))
      return res.status(400).json({ msg: "Invalid startTime" });

    const dur = estimatedRideDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + dur * 3600 * 1000);

    const conflict = await Booking.findOne({
      vehicleId: vehicle._id,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ msg: "Vehicle already booked in this time window" });
    }

    const newBooking = await Booking.create({
      vehicleId: vehicle._id,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });

    return res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
