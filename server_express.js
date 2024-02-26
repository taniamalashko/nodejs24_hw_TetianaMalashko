const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const usersRouter = require('./routes/users');

const server = express();
const PORT = 3000;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
server.use(morgan('common', { stream: accessLogStream }));

server.use(express.json());

server.use('/users', usersRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
