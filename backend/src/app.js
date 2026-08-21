// Express app setup — middleware chain + routes. Exported (not started)
// so tests can import it directly without binding a port.

const express = require('express');
const cors = require('cors');
const { corsOptions } = require('./config/cors');
const apiRoutes = require('./routes/index');
const { notFound } = require('./shared/middleware/not-found');
const { errorHandler } = require('./shared/middleware/error-handler');

const app = express();
const path = require('path');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
