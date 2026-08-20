const { prisma } = require('../../config/database');

const register = async ({ displayName, email, password, role }) => {
    return await prisma.user.create({
        data: {
            email,
            passwordHash: password,
            role: role ? role.toUpperCase() : 'USER',
            profile: {
                create: {
                    displayName
                }
            }
        },
        include: {
            profile: true
        }
    });
};

const findByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

module.exports = { register, findByEmail };
