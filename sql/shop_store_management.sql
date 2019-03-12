/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : shop_store_management

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 12/03/2019 16:13:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pwd` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatarUrl` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'pwx', '123', NULL, NULL, '2019-01-07 21:28:26', '2019-03-11 15:16:16');
INSERT INTO `admin_user` VALUES (4, '15553509117', '827ccb0eea8a706c4c34a16891f84e7b', '', '', '2019-01-17 22:17:07', '2019-03-11 15:16:16');
INSERT INTO `admin_user` VALUES (5, '15553598117', '9c67e149bf846087c5b0043bb40eb35f', '管理员2', 'http://127.0.0.1/images/admin/15553598117.jpg', '2019-01-20 22:14:43', '2019-03-11 15:16:16');
INSERT INTO `admin_user` VALUES (6, '15553598112', '9c67e149bf846087c5b0043bb40eb35f', NULL, NULL, '2019-03-11 15:33:20', '2019-03-11 15:33:20');

-- ----------------------------
-- Table structure for book_category
-- ----------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_category
-- ----------------------------
INSERT INTO `book_category` VALUES (1, '科幻');
INSERT INTO `book_category` VALUES (2, '儿童');
INSERT INTO `book_category` VALUES (3, '地理');
INSERT INTO `book_category` VALUES (4, '农业');
INSERT INTO `book_category` VALUES (5, 'JAVA');
INSERT INTO `book_category` VALUES (6, '历史');
INSERT INTO `book_category` VALUES (7, '文学');
INSERT INTO `book_category` VALUES (8, '微生物');
INSERT INTO `book_category` VALUES (9, '天文地理');
INSERT INTO `book_category` VALUES (10, '文学列别');

-- ----------------------------
-- Table structure for book_list
-- ----------------------------
DROP TABLE IF EXISTS `book_list`;
CREATE TABLE `book_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL DEFAULT 0,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `author` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `press` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `classify` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` float(10, 2) NOT NULL,
  `salePrice` float(10, 2) NOT NULL,
  `isSell` int(1) NOT NULL DEFAULT 1,
  `imageUrl` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 160 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_list
-- ----------------------------
INSERT INTO `book_list` VALUES (1, 0, '三体', '刘慈欣', '电子科技出版社', '5,4,1,3', '特价图书', '中国科幻巨作，值得期待', 70, 61.00, 53.00, 1, 'http://127.0.0.1/images/book/1.jpg', '2019-02-21 21:35:09', '2019-03-10 20:49:20');
INSERT INTO `book_list` VALUES (2, 0, '流浪地球', '刘慈欣', '北京师范大学出版社', '2', '特价', '中国科幻巨作', 66, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/2.jpg', '2019-02-20 21:35:09', '2019-03-10 15:00:11');
INSERT INTO `book_list` VALUES (6, 0, '三体', '刘慈欣', '清华大学出版社', '1,10', '特价小搜', '中国科幻巨作', 66, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/6.jpg', '2019-02-20 21:35:09', '2019-03-10 15:05:46');
INSERT INTO `book_list` VALUES (7, 0, '三体', '刘慈欣', '北京师范大学出版', '5', '特价小搜', '中国科幻巨作', 66, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/7.jpg', '2019-02-20 21:35:09', '2019-03-10 15:06:00');
INSERT INTO `book_list` VALUES (8, 0, '三体', '刘慈欣', '北京师范大学出版社', '', '特价小搜', '中国科幻巨作', 66, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/8.jpg', '2019-02-20 21:35:09', '2019-03-09 20:08:32');
INSERT INTO `book_list` VALUES (9, 0, '三体', '刘慈欣', '北京师范大学出版社', NULL, '特价小搜', '中国科幻巨作', 66, 55.50, 53.00, 1, NULL, '2019-02-20 21:35:09', '2019-02-20 21:35:09');
INSERT INTO `book_list` VALUES (10, 0, '三体', '刘慈欣', '北京师范大学出版社', '', '特价小搜', '中国科幻巨作', 60, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/10.jpg', '2019-02-20 21:35:09', '2019-03-10 21:12:35');
INSERT INTO `book_list` VALUES (11, 0, '三体', '刘慈欣', '北京师范大学出版社', '', '特价小搜', '中国科幻巨作', 66, 55.50, 53.00, 1, 'http://127.0.0.1/images/book/11.jpg', '2019-02-20 21:35:09', '2019-03-10 15:01:24');
INSERT INTO `book_list` VALUES (143, 0, '水浒传', '吴承恩', '人民出版社', '2,3', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-10 19:12:15', '2019-03-10 20:04:44');
INSERT INTO `book_list` VALUES (144, 0, '水浒传', '吴承恩', '人民出版社', '2', '四大名著', '四大名著经典之作', 5, 40.43, 30.20, 1, 'http://127.0.0.1/images/book/144.jpg', '2019-03-10 19:12:15', '2019-03-10 20:52:56');
INSERT INTO `book_list` VALUES (145, 0, '1', '2', '3', '3,5,8', '1', '1', 0, 213.00, 213.00, 1, '1', '2019-03-10 20:23:30', '2019-03-10 20:23:30');
INSERT INTO `book_list` VALUES (146, 0, '12321', '21312', '3123', '4,6', '12312', '213', 0, 213.00, 213.00, 1, NULL, '2019-03-10 20:26:31', '2019-03-10 20:26:31');
INSERT INTO `book_list` VALUES (147, 0, '123', '13123', '21321', '4,2', '12312', '21321', 2, 23213.00, 12321.00, 1, 'http://127.0.0.1/images/book/147.jpg', '2019-03-10 20:29:54', '2019-03-10 20:53:11');
INSERT INTO `book_list` VALUES (148, 0, '23123', '123123', '21312', '5', '13123', '123', 0, 321321.00, 23213.00, 1, 'http://127.0.0.1/images/book/148.jpg', '2019-03-10 20:30:30', '2019-03-10 20:30:30');
INSERT INTO `book_list` VALUES (149, 0, '23123', '21312', '312312', '3', '312', '12321', 5, 23213.00, 21321.00, 1, 'http://127.0.0.1/images/book/149.jpg', '2019-03-10 20:33:17', '2019-03-10 20:33:17');
INSERT INTO `book_list` VALUES (150, 0, '水浒传', '吴承恩', '人民出版社', '2,3', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, 'http://127.0.0.1/images/book/150.jpg', '2019-03-10 21:13:41', '2019-03-10 21:13:55');
INSERT INTO `book_list` VALUES (151, 0, '水浒传', '吴承恩', '人民出版社', '2', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-10 21:13:41', '2019-03-10 21:13:41');
INSERT INTO `book_list` VALUES (152, 0, '水浒传', '吴承恩', '人民出版社', '2,3', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-11 11:09:19', '2019-03-11 11:09:19');
INSERT INTO `book_list` VALUES (153, 0, '水浒传', '吴承恩', '人民出版社', '2', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-11 11:09:19', '2019-03-11 11:09:19');
INSERT INTO `book_list` VALUES (154, 0, '红楼梦', '吴承恩', '人民出版社', '2,3', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-11 11:29:24', '2019-03-11 11:29:24');
INSERT INTO `book_list` VALUES (155, 0, '水浒传', '吴承恩', '人民出版社', '2', '四大名著', '四大名著经典之作', 18, 40.43, 30.20, 1, 'http://127.0.0.1/images/book/155.jpg', '2019-03-11 11:29:24', '2019-03-11 11:29:43');
INSERT INTO `book_list` VALUES (156, 0, '红楼梦', '吴承恩', '人民出版社', '2,3', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-11 12:18:10', '2019-03-11 12:18:10');
INSERT INTO `book_list` VALUES (157, 0, '水浒传', '吴承恩', '人民出版社', '2', '四大名著', '四大名著经典之作', 12, 40.43, 30.20, 1, NULL, '2019-03-11 12:18:10', '2019-03-11 12:18:10');
INSERT INTO `book_list` VALUES (158, 0, '红楼里', '夏明', '山东出版社', '1,2', '名著', '值得一看', 10, 20.00, 10.00, 0, NULL, '2019-03-11 12:19:17', '2019-03-11 21:13:36');
INSERT INTO `book_list` VALUES (159, 1, '红楼里', '夏明', '山东出版社', '1,3', '名著', '值得一看', 10, 20.00, 10.00, 0, NULL, '2019-03-11 12:19:17', '2019-03-11 12:19:17');

-- ----------------------------
-- Table structure for shop_user
-- ----------------------------
DROP TABLE IF EXISTS `shop_user`;
CREATE TABLE `shop_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pwd` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` int(1) NULL DEFAULT NULL,
  `mobile` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
