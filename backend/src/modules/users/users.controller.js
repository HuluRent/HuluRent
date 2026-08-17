const service = require('./users.service');

const getMe = async (req, res) => {
  const user = await service.getProfile(req.user.userId); 
  return res.json(user);
};

const updateMe = async (req, res) => {
  const user = await service.updateProfile(req.user.userId, req.body);
  return res.json(user);
};

module.exports = {getMe, updateMe};
