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

 Date: 07/01/2019 21:22:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book_list
-- ----------------------------
DROP TABLE IF EXISTS `book_list`;
CREATE TABLE `book_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `author` int(11) NOT NULL,
  `press` int(11) NOT NULL,
  `title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `stock` int(11) NOT NULL,
  `price` float(10, 2) NOT NULL,
  `sale_price` float(10, 2) NOT NULL,
  `is_sell`  int(1) NOT NULL DEFAULT 1,
  `image_url` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `create_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
