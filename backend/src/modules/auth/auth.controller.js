const authService = require('./auth.service');

async function register(req, res) {
  const { displayName, email, password, role } = req.body;
  const result = await authService.register({ displayName, email, password, role });
  return res.status(201).json(result);
}
async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return res.status(200).json(result);
}
async function logout(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  await authService.logout(token);
  return res.status(200).json({ message: 'Logout successful' });
}
module.exports = { register, login, logout };
