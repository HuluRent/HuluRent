// This file exists for the ONE shared shape that isn't just "the
// resource": paginated list responses. Use this so every module's list
// endpoint returns the same envelope instead of each inventing its own.

function paginated(items, { page, limit, total }) {
  return { items, page, limit, total };
}

module.exports = { paginated };
