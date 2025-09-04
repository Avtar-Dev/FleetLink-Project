function isOverlapping(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

module.exports = { isOverlapping };
