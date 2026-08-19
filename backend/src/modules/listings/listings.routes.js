const { Router } = require('express');
const controller = require('./listings.controller');
const authenticate = require('../../shared/middleware/authenticate');
const ownershipGuard = require('../../shared/middleware/ownership-guard');
const validateRequest = require('../../shared/middleware/validate-request');
const upload = require('../../shared/middleware/upload');
const { createListingSchema, updateListingSchema } = require('./listings.validation');

const listingsRouter = Router();

listingsRouter.get('/', controller.list);
listingsRouter.get('/:id', controller.getById);

listingsRouter.post(
  '/',
  authenticate,
  upload.array('images', 5),
  validateRequest(createListingSchema),
  controller.create
);

const itemRepo = require('./listings.repository');

listingsRouter.put(
  '/:id',
  authenticate,
  ownershipGuard(async (id) => {
    const item = await itemRepo.findById(id);
    return item ? item.ownerId : null;
  }),
  validateRequest(updateListingSchema),
  controller.update
);

listingsRouter.delete(
  '/:id',
  authenticate,
  ownershipGuard(async (id) => {
    const item = await itemRepo.findById(id);
    return item ? item.ownerId : null;
  }),
  controller.remove
);

module.exports = { listingsRouter };
