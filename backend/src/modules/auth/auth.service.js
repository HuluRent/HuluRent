const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRepo = require ('./auth.repository');
const { ConflictError } = require('../../shared/errors/ConflictError');
const { UnauthorizedError } = require('../../shared/errors/UnauthorizedError');
const { env } = require('../../config/env');


const register = async ({displayName, email, password, role}) => {

    const existingUser = await authRepo.findByEmail(email);
    if (existingUser) {
        throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepo.register({displayName, email, password: hashedPassword, role});
    return buildAuthResponse(user);
}

const login = async ({email, password}) => {
    const user = await authRepo.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
        throw new UnauthorizedError('Invalid email or password');
    }

    return buildAuthResponse(user);
    
} 

const logout = async () => {
    return {message: 'Logout successful'};
};



function buildAuthResponse(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    env.jwtRefreshSecret,
    { expiresIn: '7d' }
  );
  return {
    user: { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}

module.exports = {register, login, logout};