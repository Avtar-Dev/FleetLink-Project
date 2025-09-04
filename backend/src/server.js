require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const vehiclesRoute = require("./routes/vehicles");
const bookingsRoute = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehiclesRoute);
app.use("/api/bookings", bookingsRoute);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connect error", err);
    process.exit(1);
  });
