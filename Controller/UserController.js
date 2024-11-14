const db = require('../config/config');

exports.createUser = (req, res) => {
    const { name, password, user_role, isActive } = req.body;

    if (!name || !password || !user_role || typeof isActive === 'undefined') {
        return res.status(400).json({ error: "Name, password,user_role, and isActive are required." });
    }

    const query = 'INSERT INTO users (username, password, user_role, isActive) VALUES (?, ?, ?, ?)';
    db.query(query, [name, password,user_role, isActive], (err, result) => {
        if (err) {
            console.error(err);  
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created', userId: result.insertId });
    });
}



exports.getAllUsers = (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            'result':results,
            'code' :200,
            'status':'success'
    });
    });
}; 

exports.getUserById =(req,res)=>{
    const { id } =req.params;
    const query ='SELECT * FROM users where id= ?';

    db.query( query,[id], (err , result) =>{
        if(err) return res.json({ error : err.message});
        if(result.length === 0) return res.status(404).json({ message: 'User not found'});
        res.json(result[0]);
    })
}

exports.getUserUpdate = (req, res) => {
    const { id, session_user } = req.params; // `session_user` is the ID of the user making the request
    const { name, user_role, password } = req.body;

    // Query to check if the session user is an admin
    const checkAdminUser = 'SELECT user_role FROM users WHERE uid = ?';
    db.query(checkAdminUser, [session_user], (err, results) => {
        if (err) return res.json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Session user not found' });
        }

        // Check if the session user's role is "admin"
        if (results[0].user_role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can perform this update' });
        }

        // Dynamically build the update query based on provided fields
        const fields = [];
        const values = [];

        if (name) {
            fields.push('username = ?');
            values.push(name);
        }
        if (user_role) {
            fields.push('user_role = ?');
            values.push(user_role);
        }
        if (password) {
            fields.push('password = ?');
            values.push(password);
        }

        // If no fields are provided, return a 400 error
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        // Construct the full update query
        const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE uid = ?`;
        values.push(id); // Add the `id` as the last parameter

        // Execute the update query
        db.query(updateQuery, values, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User updated' });
        });
    });
};
