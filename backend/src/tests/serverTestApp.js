const express = require("express");
const bodyParser = require("body-parser");

const vehicleRoutes = require("../routes/vehicles");
const bookingRoutes = require("../routes/bookings");

const app = express();
app.use(bodyParser.json());

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;
