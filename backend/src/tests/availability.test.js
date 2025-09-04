const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const request = require("supertest");
let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = require("./serverTestApp");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Vehicle.deleteMany({});
  await Booking.deleteMany({});
});

test("booking conflict prevents new booking", async () => {
  const vehicle = await Vehicle.create({
    name: "T1",
    capacityKg: 1000,
    tyres: 4,
  });
  const start = new Date("2025-09-10T10:00:00Z");

  await Booking.create({
    vehicleId: vehicle._id,
    fromPincode: "100001",
    toPincode: "100003",
    startTime: start,
    endTime: new Date(start.getTime() + 2 * 3600 * 1000),
    customerId: "c1",
  });

  const res = await request(app)
    .post("/api/bookings")
    .send({
      vehicleId: String(vehicle._id),
      fromPincode: "100002",
      toPincode: "100004",
      startTime: "2025-09-10T11:00:00Z",
      customerId: "c2",
    })
    .set("Content-Type", "application/json");

  expect(res.status).toBe(409);
});
