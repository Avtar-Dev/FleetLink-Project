const { estimatedRideDurationHours } = require("../utils/duration");

test("duration basic", () => {
  expect(estimatedRideDurationHours("100000", "100005")).toBe(5);
  expect(estimatedRideDurationHours("560001", "110001")).toBe(
    Math.abs(560001 - 110001) % 24
  );
});

test("non numeric fallback", () => {
  expect(estimatedRideDurationHours("abc", "100")).toBe(1);
});
