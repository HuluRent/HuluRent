// Central route aggregator — mounts every module's router under its
// base path. This is the only file that needs to change when a new
// module is added.

const { Router } = require('express');

const { authRouter } = require('../modules/auth/auth.routes');
const { usersRouter } = require('../modules/users/users.routes');
const { identityRouter } = require('../modules/identity-verification/identity.routes');
const { categoriesRouter } = require('../modules/categories/categories.routes');
const { listingsRouter } = require('../modules/listings/listings.routes');
const { searchRouter } = require('../modules/search/search.routes');
const { availabilityRouter } = require('../modules/availability/availability.routes');
const { bookingsRouter } = require('../modules/bookings/bookings.routes');
const { agreementsRouter } = require('../modules/agreements/agreements.routes');
const { inspectionsRouter } = require('../modules/inspections/inspections.routes');
const { messagingRouter } = require('../modules/messaging/messaging.routes');
const { evidenceRouter } = require('../modules/evidence/evidence.routes');
const { reviewsRouter } = require('../modules/reviews/reviews.routes');
const { reportsRouter } = require('../modules/reports/reports.routes');
const { adminRouter } = require('../modules/admin/admin.routes');
const { notificationsRouter } = require('../modules/notifications/notifications.routes');
const { savedListRouter } = require('../modules/savedList/savedList.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/identity-verification', identityRouter);
router.use('/categories', categoriesRouter);
router.use('/listings', listingsRouter);
router.use('/search', searchRouter);
router.use('/availability', availabilityRouter);
router.use('/bookings', bookingsRouter);
router.use('/agreements', agreementsRouter);
router.use('/inspections', inspectionsRouter);
router.use('/messaging', messagingRouter);
router.use('/evidence', evidenceRouter);
router.use('/reviews', reviewsRouter);
router.use('/reports', reportsRouter);
router.use('/admin', adminRouter);
router.use('/notifications', notificationsRouter);
router.use('/saved-list', savedListRouter);

module.exports = router;
