const express = require('express');
const router = express.Router();
const { validateUserData, validateUserId } = require('../middleware/validation');
const fs = require('fs');
const path = require('path');

const knexLib = require('knex');
const knexConfig = require('../knexfile');
const knex = knexLib(knexConfig);

router.post('/', validateUserData, async (req, resp) => {
  try {
    const [user] = await knex('users').insert(req.body).returning('*');
    console.log('user', user);
    
    resp.status(201).json(user);
  } catch (error) {
    resp.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await knex('users').select();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId', validateUserId, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await knex('users').where('id', userId).first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId', validateUserId, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const rowsDeleted = await knex('users').where('id', userId).del();

    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
