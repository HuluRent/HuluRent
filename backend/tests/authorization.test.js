const test = require('node:test');
const assert = require('node:assert');
const requireVerifiedUserMiddleware = require('../src/shared/middleware/requireVerifiedUser');
const authRepo = require('../src/modules/auth/auth.repository');
const { prisma } = require('../src/config/database');

test('Authorization and Identity Verification', async (t) => {
  let createdUserId;

  await t.test('New registration is unverified by default', async () => {
    const user = await authRepo.register({
      displayName: 'Test User',
      email: 'testauth@example.com',
      password: 'password123'
    });
    createdUserId = user.id;
    assert.ok(user.id);

    const identity = await prisma.identityVerification.findUnique({
      where: { userId: user.id }
    });
    
    // Explicitly reject VERIFIED
    assert.notStrictEqual(identity?.status, 'VERIFIED', 'Newly registered user must not be VERIFIED');
  });

  await t.test('Unverified user cannot create a listing', async () => {
    
    let errorPassed;
    const req = { user: { userId: createdUserId } };
    const res = {};
    const next = (err) => { errorPassed = err; };

    await requireVerifiedUserMiddleware(req, res, next);
    
    assert.strictEqual(errorPassed.statusCode, 403);
    assert.strictEqual(errorPassed.message, 'Verify your identity first to continue.');
  });

  await t.test('Verified user can pass authorization', async () => {
    // Manually verify user
    await prisma.identityVerification.create({
      data: {
        userId: createdUserId,
        status: 'VERIFIED'
      }
    });
    
    let errorPassed;
    const req = { user: { userId: createdUserId } };
    const res = {};
    const next = (err) => { errorPassed = err; };

    await requireVerifiedUserMiddleware(req, res, next);
    
    assert.strictEqual(errorPassed, undefined);
  });
  
  // Cleanup
  await prisma.identityVerification.deleteMany({ where: { userId: createdUserId } });
  await prisma.profile.deleteMany({ where: { user: { id: createdUserId } } });
  await prisma.user.deleteMany({ where: { id: createdUserId } });
});
