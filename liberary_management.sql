-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Nov 14, 2024 at 04:20 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `liberary_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `bid` int(50) NOT NULL,
  `bookname` varchar(255) DEFAULT NULL,
  `book_count` int(50) NOT NULL DEFAULT 0,
  `publisher` varchar(255) DEFAULT NULL,
  `isAvailiable` int(10) NOT NULL DEFAULT 1,
  `iscreated` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`bid`, `bookname`, `book_count`, `publisher`, `isAvailiable`, `iscreated`) VALUES
(1, 'testing user', 12, 'test', 1, '2024-11-14 02:29:44'),
(2, 'world toutist', 12, 'test publisher', 1, '2024-11-14 03:02:29'),
(3, 'world toutist', 12, 'test publisher', 0, '2024-11-14 03:02:50'),
(4, 'world toutist test', 12, 'test publisher', 0, '2024-11-14 03:03:02');

-- --------------------------------------------------------

--
-- Table structure for table `borrow_record`
--

CREATE TABLE `borrow_record` (
  `tid` int(50) NOT NULL,
  `uid` int(50) NOT NULL,
  `bid` int(50) NOT NULL,
  `action_type` varchar(255) DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(50) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_role` varchar(100) DEFAULT 'Member',
  `isActive` int(20) DEFAULT 0,
  `iscreated` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `user_role`, `isActive`, `iscreated`) VALUES
(1, 'testing user', 'randomPassword123', 'admin', 1, '2024-11-13 02:19:32'),
(2, 'testing user 2', 'randomPassword123', 'member', 1, '2024-11-13 02:27:21'),
(3, 'testing user 3', 'randomPassword123', 'librarian', 1, '2024-11-13 02:27:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`bid`);

--
-- Indexes for table `borrow_record`
--
ALTER TABLE `borrow_record`
  ADD PRIMARY KEY (`tid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `bid` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `borrow_record`
--
ALTER TABLE `borrow_record`
  MODIFY `tid` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
