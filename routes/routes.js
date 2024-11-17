const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');
const authController = require('../Controller/AuthController');
const bookController = require('../Controller/BookController');
const borrowController = require('../Controller/borrowController');
const { authenticateToken } = require('../mid/auth');

router.post('/login', authController.login);

// Admin Routes
// router.get('/borrow-records', authenticateToken, authorizeRoles('Admin'), borrowController.viewAllBorrowRecords);
router.post('/users',authenticateToken,UserController.createUser);
router.get('/users/:id',authenticateToken,UserController.getUserById);
router.get('/users',authenticateToken, UserController.getAllUsers); 
router.put('/users/:id/:session_user', authenticateToken, UserController.getUserUpdate);

// Librarian Routes
router.post('/books', authenticateToken, bookController.addBook);
router.put('/books/:id/', authenticateToken, bookController.updateBook);


// Member Routes
// router.post('/borrow', authenticateToken, borrowController.borrowBook);
router.post('/borrow',authenticateToken, borrowController.borrowBook);
router.put('/return',authenticateToken, borrowController.returnBook);
router.get('/borrow-history/:id',authenticateToken, borrowController.viewBorrowHistory);

router.get('/return_list', borrowController.return_list);

module.exports = router;
