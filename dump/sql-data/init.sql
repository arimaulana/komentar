-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: komentar-db:3306
-- Generation Time: Jul 27, 2020 at 02:32 PM
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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` varchar(50) NOT NULL COMMENT 'Comment ID',
  `parent_id` varchar(50) NOT NULL DEFAULT '0' COMMENT 'Parent Comment ID',
  `author` varchar(50) NOT NULL COMMENT 'Authors',
  `content` longtext NOT NULL COMMENT 'Comment Content',
  `url` varchar(255) NOT NULL COMMENT 'Post location',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation Comment Time',
  `status` enum('showed','hidden') NOT NULL DEFAULT 'showed' COMMENT 'Comment status',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `comments`
--

TRUNCATE TABLE `comments`;
--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `parent_id`, `author`, `content`, `url`, `date`, `status`) VALUES
('f672852a-8284-4920-8297-8c0c0aa6ef55-1595859848226', '0', 'Ari Maulana', 'Test Comment 3', 'arimaulana.com/first-post', '2020-07-27 14:23:25', 'showed');
COMMIT;
