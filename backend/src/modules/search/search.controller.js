const service = require('./search.service');

async function list(req, res) {

  const results = await service.searchItems(req.query);
  
  return res.json({
    data: results.items,
    meta: {
      total: results.total,
      page: req.query.page,
      limit: req.query.limit,
      totalPages: Math.ceil(results.total / req.query.limit)
    }
  });
}

module.exports = {
  list
};
