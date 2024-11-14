const db = require('../config/config');

exports.addBook = (req, res) => {
  const { bookname, book_count, publisher, isAvailiable, session_user } = req.body;

  // Check if required fields are present
  if (!bookname || !book_count || !publisher || isAvailiable == null) {
    return res.status(400).json({ error: "Details not found" });
  }

  // Check if session_user is provided
  if (!session_user) {
    return res.status(400).json({ error: "Session user ID not provided" });
  }

  // Query to check if the session user's role is librarian
  const checkLibrarian = "SELECT user_role FROM users WHERE uid = ?";
  db.query(checkLibrarian, [session_user], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Session user not found" });
    }

    // Check if the session user's role is librarian
    if (results[0].user_role !== "librarian") {
      return res.status(403).json({ message: "Only Librarians can perform this update" });
    }

    // Insert book into database
    const query = "INSERT INTO book (bookname, book_count, publisher, isAvailiable) VALUES (?, ?, ?, ?)";
    db.query(query, [bookname, book_count, publisher, isAvailiable], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log(result);
      res.status(201).json({
        message: "Book added successfully",
        bookId: result.insertId,
      });
    });
  });
};

exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { bookname, book_count, publisher, isAvailiable,session_user } = req.body;

  // Query to check if the session user's role is librarian
  const checkLibrarian = 'SELECT user_role FROM users WHERE uid = ?';
  db.query(checkLibrarian, [session_user], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Session user not found' });
    }

    // Check if the session user's role is "admin"
    if (results[0].user_role !== 'librarian') {
      return res.status(403).json({ message: 'Only Librarians can perform this update' });
    }

    // Dynamically build the update query based on provided fields
    const fields = [];
    const values = [];

    if (bookname) {
      fields.push('bookname = ?');
      values.push(bookname);
    }
    if (book_count) {
      fields.push('book_count = ?');
      values.push(book_count);
    }
    if (publisher) {
      fields.push('publisher = ?');
      values.push(publisher);
    }
    if (isAvailiable !== undefined) { // Check if isAvailiable is provided
      fields.push('isAvailiable = ?');
      values.push(isAvailiable);
    }

    // If no fields are provided to update, return an error
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Build the final update query
    const updateQuery = `UPDATE book SET ${fields.join(', ')} WHERE bid = ?`;
    values.push(id);

    // Execute the update query
    db.query(updateQuery, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Book details not found' });
      res.json({ message: 'Book details updated successfully' });
    });
  });
};


