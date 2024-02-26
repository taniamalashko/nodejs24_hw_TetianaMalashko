const express = require('express');
const router = express.Router();
const { validateUserData, validateUserId } = require('../middleware/validation');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const ensureUsersFile = () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '[]', 'utf8');
  }
};

ensureUsersFile();

let users = [];

const usersData = fs.readFileSync(usersFilePath, 'utf8');
users = JSON.parse(usersData);

const generateUserId = () => {
  return users.length > 0 ? users[users.length - 1].id + 1 : 1;
};

router.post('/', validateUserData, (req, res) => {
  const { username, email } = req.body;
  const userId = generateUserId();
  const newUser = { id: userId, username, email };
  users.push(newUser);
  res.status(200).json(newUser);
});

router.get('/', (req, res) => {
  if (users.length === 0) {
    return res.status(404).json({ error: 'No users found' });
  }

  res.json(users);
});

router.get('/:userId', validateUserId, (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

router.delete('/:userId', validateUserId, (req, res) => {
  const userId = parseInt(req.params.userId);
  const index = users.findIndex(user => user.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.sendStatus(200);
});

process.on('SIGINT', () => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users), 'utf8');
  process.exit();
});

module.exports = router;
