// Checks if two date ranges overlap
function doDatesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  
  return s1 < e2 && s2 < e1;
}

// Checks if a date is in the past
function isPast(date) {
  return new Date(date).getTime() < Date.now();
}

// Adds days to a date and returns a new Date object
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Calculates difference in days between two dates
function diffInDays(start, end) {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = {
  doDatesOverlap,
  isPast,
  addDays,
  diffInDays,
};
