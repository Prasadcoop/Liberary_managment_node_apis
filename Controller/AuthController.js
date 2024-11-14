const db = require('../config/config');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { name, password } = req.body;
  if (!name || !password ) {
    return res.status(400).json({ error: "Name, password are required." });
}
  console.log(req.body);

  db.query('SELECT * FROM users WHERE username = ?', [name], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'User not found' }); // Corrected here
    }

    const user = results[0];
    

    if (password !== user.password) {
      return res.status(401).json({ message: 'Password is wrong.' }); // Corrected here
    }

    const token = jwt.sign({ id: user.uid, role: user.user_role }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.json({ token });
  });
};
