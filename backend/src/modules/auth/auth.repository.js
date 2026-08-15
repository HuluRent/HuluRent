const { prisma } = require('../../config/database');

const register = async ({ email, password, role }) => {
    return await prisma.user.create({ 
        data: { 
            email, 
            passwordHash: password, 
            role: role ? role.toUpperCase() : 'USER' 
        } 
    });
};
const findByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};
module.exports = { register, findByEmail };
