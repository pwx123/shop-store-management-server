/*
 Navicat Premium Data Transfer

 Source Server         : shop_store_management
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : shop_store_management

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 07/01/2019 21:21:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book_category_map
-- ----------------------------
DROP TABLE IF EXISTS `book_category_map`;
CREATE TABLE `book_category_map`  (
  `book_id` int(11) NULL DEFAULT NULL,
  `category_id` int(11) NULL DEFAULT NULL
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Fixed;

SET FOREIGN_KEY_CHECKS = 1;
