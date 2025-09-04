function estimatedRideDurationHours(fromPincode, toPincode) {
  const a = parseInt(fromPincode || "0", 10);
  const b = parseInt(toPincode || "0", 10);
  if (isNaN(a) || isNaN(b)) {
    return 1;
  }
  return Math.abs(a - b) % 24;
}

module.exports = { estimatedRideDurationHours };
