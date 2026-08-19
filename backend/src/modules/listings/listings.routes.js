const { Router } = require('express');
const controller = require('./listings.controller');

const listingsRouter = Router();

listingsRouter.get('/:id', controller.getById);

module.exports = { listingsRouter };
