const service = require('./reviews.service');

async function create(req, res) {
  const review = await service.createReview(req.user.userId, req.body);
  return res.status(201).json(review);
}

async function list(req, res) {
  const { subjectId, bookingId } = req.query;

  if (subjectId) {
    const reviews = await service.getReviewsForSubject(subjectId);
    const stats = await service.getSubjectStats(subjectId);
    return res.json({ stats, reviews });
  }

  if (bookingId) {
    const reviews = await service.getReviewsForBooking(bookingId);
    return res.json({ reviews });
  }

  return res.json({ reviews: [] });
}

module.exports = {
  create,
  list
};
