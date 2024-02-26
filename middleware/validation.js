const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validateUserData = (req, res, next) => {
  const { username, email } = req.body;
  
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

const validateUserId = (req, res, next) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId) || userId < 0) {
    return res.status(400).json({ error: 'Invalid userId' });
  }
  
  next();
};

module.exports = {
  validateEmail,
  validateUserData,
  validateUserId
};
