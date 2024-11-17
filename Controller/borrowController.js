const db = require('../config/config');
const nodemailer = require("nodemailer");

exports.borrowBook = (req, res) => {
    const { userId,bookId,action_type,return_date} = req.body;
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 
    if (!dateRegex.test(return_date)) {
      return res.status(400).json({ message: 'Invalid return_date format. Use YYYY-MM-DD.' });
    }
  
   
    db.query('SELECT isAvailable, book_count FROM book WHERE bid = ?', [bookId], (err, results) => {
     
      if (err || results.length === 0 || results[0].book_count == 0 || results[0].isAvailable == 0 ) {
        return res.status(400).json({ message: 'Book is not available.' });
      }
  
      let book_count = results[0].book_count - 1;
      let isAvailable = book_count > 0 ? 1 : 0;
      
      db.query('INSERT INTO borrow_record (uid, bid, action_type ,return_date) VALUES (?, ?, ? ,?)', [userId, bookId,action_type,return_date], (err) => {
        if (err) return res.status(500).json({ message: 'Error borrowing book.' });
        
        db.query('UPDATE book SET isAvailable = ?, book_count = ? WHERE bid = ?', [isAvailable,book_count,bookId], (err) => {
          if (err) return res.status(500).json({ message: 'Error updating book availability.' });
          res.status(201).json({ message: 'Book borrowed successfully.' });
        });
      });
    });
};

exports.returnBook = (req, res) => {
    const { tid } = req.body;
  
    db.query('SELECT * FROM borrow_record WHERE tid = ?', [tid], (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: 'You have not borrowed this book.' });
      }
  
      // Mark the book as returned
      db.query('UPDATE borrow_record SET return_date = NOW() ,action_type =? ,status = ? WHERE tid = ?', ["return",1,tid], (err) => {
        if (err) return res.status(500).json({ message: 'Error returning book.' });
        res.status(200).json({message : "book return successfully."})
      });
    });
};


exports.viewBorrowHistory = (req, res) => {
    const { id } = req.params;
  
    // Fetch user details to check role
    db.query('SELECT uid, user_role FROM users WHERE uid = ?', [id], (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json({ message: 'User not found.' });
      }
  
      const userRole = result[0].user_role;
  
      // Determine the query condition based on the user role
      let queryCondition = 'WHERE borrow.uid = ? AND status = 0 AND action_type = \'borrow\'';
      const queryParams = [id];
  
      if (userRole === 'admin') {
        queryCondition = 'WHERE status = 0 AND action_type = \'borrow\'';
        queryParams.pop(); // Remove the `id` parameter since it’s not needed for admin
      }
  
      // SQL Query to fetch borrow history
      const query = `
        SELECT 
          bk.bookname,
          bk.publisher,
          bk.isAvailable,
          borrow.return_date AS \`Return Date\`
        FROM 
          book bk
        INNER JOIN 
          borrow_record borrow 
        ON 
          borrow.bid = bk.bid
        ${queryCondition}
        ORDER BY 
          borrow.tid DESC
      `;
  
      // Execute the query
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error('Error fetching borrow history:', err.message);
          return res.status(500).json({ message: 'Error fetching borrow history.' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'No borrow history found.' });
        }
  
        res.status(200).json({ borrowHistory: results });
      });
    });
};
  
exports.return_list = async (req, res) => {
  const query = `
          SELECT 
              bk.bookname AS title,
              bk.publisher,
              bk.isAvailable,
              users.username,
              borrow.return_date AS due_date
          FROM 
              book bk
          LEFT JOIN 
              borrow_record borrow 
          ON 
              borrow.bid = bk.bid
          LEFT JOIN 
              users 
          ON 
              borrow.uid = users.uid
          WHERE 
              status = 0 
              AND action_type = 'borrow'
              AND borrow.return_date < CURDATE();
    `;

  db.query(query, async (err, result) => {
    if (err) {
      console.error("Error fetching borrow history:", err.message);
      return res.status(500).json({ message: "Error fetching borrow history." });
    }

    // Create an HTML table for the result
    let table = `
      <table border="1">
        <tr>
          <th>Title</th>
          <th>Publisher</th>
          <th>Username</th>
          <th>Due Date</th>
        </tr>
    `;

    result.forEach((row) => {
      const { title, due_date, username, publisher } = row;

      table += `
        <tr>
          <td>${title}</td>
          <td>${publisher}</td>
          <td>${username}</td>
          <td>${due_date}</td>
        </tr>
      `;
    });

    table += `</table>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:"psd@gmail.com",
        pass: "udbied1231no0328320dn",
      },
    });

    const mailOptions = {
      from: `"Library Admin" <cronuser@email.com>`,
      to: "adminlibrarian@email.com",
      subject: "Overdue Book List",
      html: table,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
      return res.status(200).json({ message: "Email sent successfully!" });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      return res.status(500).json({ message: "Error sending email." });
    }
  });
};



