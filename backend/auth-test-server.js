require('dotenv').config();

const express = require('express');
const { authRouter } = require('./src/modules/auth/auth.routes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('Auth test server running on http://localhost:3000');
});
