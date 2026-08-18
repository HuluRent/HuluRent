// Parses page/limit query params consistently across every module's
// list endpoint. Pair with response.js's paginated() helper for the
// response side. See Hulurent-docs' technical/api-reference.md
// "Conventions" — page defaults to 1, limit to 20, capped at 100.

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { parsePagination };
