-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: komentar-db:3306
-- Generation Time: Jul 28, 2020 at 12:40 PM
-- Server version: 5.7.29
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `komentar`
--
CREATE DATABASE IF NOT EXISTS `komentar` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `komentar`;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `id` varchar(50) NOT NULL COMMENT 'Comment ID',
  `parent_id` varchar(50) NOT NULL DEFAULT '0' COMMENT 'Parent Comment ID',
  `author` varchar(50) NOT NULL COMMENT 'Authors',
  `content` longtext NOT NULL COMMENT 'Comment Content',
  `url` varchar(255) NOT NULL COMMENT 'Post location',
  `status` enum('showed','hidden') NOT NULL DEFAULT 'showed' COMMENT 'Comment status',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `comment`
--

TRUNCATE TABLE `comment`;
--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `parent_id`, `author`, `content`, `url`, `status`, `created_date`) VALUES
('f672852a-8284-4920-8297-8c0c0aa6ef55-1595859848226', '0', 'Ari Maulana', 'Test Comment 3', 'arimaulana.com/first-post', 'showed', '2020-07-27 14:23:25');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(50) NOT NULL COMMENT 'User ID',
  `username` varchar(20) NOT NULL COMMENT 'Username',
  `hash_password` varchar(100) NOT NULL COMMENT 'User hashed password',
  `role` enum('admin','member') NOT NULL DEFAULT 'member' COMMENT 'User role (admin, member)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `user`
--

TRUNCATE TABLE `user`;
--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `hash_password`, `role`) VALUES
('966333fc-5ae1-49aa-8ba9-9fc5a78ffead-1595937455825', 'arimaulana', '$2b$10$cTGkH2JHsDLbdNsvRYtNI.2AJZ80qK5X7SCKDvUIqJyc00u8vxBUK', 'admin');
COMMIT;
