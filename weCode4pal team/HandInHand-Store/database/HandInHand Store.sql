-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: hand_in_hand_store_db
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (3,'?','Women’s Clothing'),(4,'?','Kids & Baby'),(5,'?','Shoes & Footwear'),(6,'?','Bags & Accessories'),(7,'?','Beauty & Personal Care'),(8,'⌚','Watches & Jewelry'),(9,'?','Electronics'),(10,'?','Smartphones & Gadgets'),(11,'?','Home & Kitchen'),(12,'?','Furniture & Decor'),(13,'?','Kitchenware'),(14,'?','Gaming'),(15,'?','Audio & Headphones'),(16,'?','Books & Stationery'),(17,'?','Hobbies & Crafts'),(18,'?️‍♂️','Sports & Outdoors'),(19,'?','Pets'),(20,'?','Best Sellers'),(21,'?','Summer Sale'),(22,'?','Eco-Friendly'),(23,'?','Work Essentials'),(24,'?','Gifts & Occasions'),(26,'?','Men’s Clothing');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(38,2) DEFAULT NULL,
  `charity_id` varchar(255) DEFAULT NULL,
  `charity_name` varchar(255) DEFAULT NULL,
  `donation_date` datetime(6) DEFAULT NULL,
  `percentage` decimal(38,2) DEFAULT NULL,
  `status` enum('FAILED','PENDING','TRANSFERRED') DEFAULT NULL,
  `transfer_date` datetime(6) DEFAULT NULL,
  `buyer_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6v6ajbucpyhcg4b00jhjnhvsv` (`buyer_id`),
  KEY `FKibd9ymncdx734lc0c392h1489` (`order_id`),
  KEY `FKi6r1gkyjkiidq2d31asowa2qj` (`seller_id`),
  CONSTRAINT `FK6v6ajbucpyhcg4b00jhjnhvsv` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKi6r1gkyjkiidq2d31asowa2qj` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKibd9ymncdx734lc0c392h1489` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (5,0.00,NULL,'Default Charity','2025-09-09 13:38:31.763395',0.00,'TRANSFERRED','2025-09-16 01:28:46.948793',15,1,1),(6,2250.00,NULL,'Default Charity','2025-09-09 13:39:08.794037',50.00,'PENDING',NULL,15,105,1),(7,0.00,NULL,'Default Charity','2025-09-09 13:39:38.804689',0.00,'PENDING',NULL,15,106,1),(8,960.00,NULL,'Default Charity','2025-09-09 13:39:45.288787',30.00,'PENDING',NULL,14,107,1),(9,1000.00,NULL,'Default Charity','2025-09-09 13:39:50.024253',50.00,'PENDING',NULL,14,108,1),(10,617.00,NULL,'Default Charity','2025-09-09 13:40:17.387157',50.00,'TRANSFERRED','2025-09-11 16:28:55.920451',1,109,1),(11,629.34,NULL,'Default Charity','2025-09-09 13:40:33.143005',0.51,'TRANSFERRED','2025-09-16 01:28:03.493320',1,110,6);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `donation_percentage` decimal(38,2) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK551losx9j75ss5d6bfsqvijna` (`product_id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  CONSTRAINT `FK551losx9j75ss5d6bfsqvijna` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,0.00,5500.00,2,1,1),(2,0.00,42000.00,1,1,3),(5,50.00,4500.00,1,105,2),(6,0.00,8500.00,1,106,4),(7,30.00,3200.00,1,107,5),(8,50.00,2000.00,1,108,6),(9,50.00,1234.00,1,109,7),(10,51.00,1234.00,1,110,8);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `donation_amount` decimal(38,2) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','PENDING','SHIPPED') DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `buyer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4odf7l3wq1f4up72w6cc0ybqj` (`buyer_id`),
  CONSTRAINT `FK4odf7l3wq1f4up72w6cc0ybqj` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,0.00,'2025-09-07 19:57:11.985554','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',53000.00,'2025-09-09 13:38:31.795469',15),(105,2250.00,'2025-09-09 13:34:43.212604','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',4500.00,'2025-09-09 13:39:08.802033',15),(106,0.00,'2025-09-09 13:35:34.631153','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',8500.00,'2025-09-09 13:39:38.804689',15),(107,960.00,'2025-09-09 13:36:31.812410','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',3200.00,'2025-09-09 13:39:45.296788',14),(108,1000.00,'2025-09-09 13:36:42.664217','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',2000.00,'2025-09-09 13:39:50.040244',14),(109,617.00,'2025-09-09 13:37:24.285479','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',1234.00,'2025-09-09 13:40:17.403154',1),(110,629.34,'2025-09-09 13:37:30.054993','CASH_ON_DELIVERY','PENDING','1680 Main Street, Algiers','CONFIRMED',1234.00,'2025-09-09 13:40:33.143005',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (31,'314048','chaima@example.com','2025-08-24 23:18:37.476310'),(38,'248607','chaima20@gmail.com','2025-09-15 17:53:21.989179');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `donation_percentage` decimal(38,2) DEFAULT NULL,
  `fixed_price` double DEFAULT NULL,
  `price_type` enum('AUCTION','FIXED') DEFAULT NULL,
  `status` enum('AVAILABLE','REMOVED','SOLD') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `seller_id` bigint NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmsvavr0t3lra70gf2ymxdi5te` (`seller_id`),
  CONSTRAINT `FKmsvavr0t3lra70gf2ymxdi5te` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'2025-09-02 21:05:33.316241','High-quality leather handbag, perfect for work and casual outings.',0.10,5500,'FIXED','SOLD','Elegant Leather Handbag',1,NULL),(2,'2025-09-02 21:07:02.216284','Breathable, lightweight running shoes for everyday training.',0.50,4500,'FIXED','SOLD','Men’s Running Shoes',1,NULL),(3,'2025-09-02 21:11:00.854343','6.5-inch display, 128GB storage, great camera quality.',0.00,42000,'FIXED','SOLD','Android Smartphone X200',1,NULL),(4,'2025-09-02 21:15:06.270134','Over-ear headphones with active noise cancellation and 30-hour battery life.',0.00,8500,'FIXED','SOLD','Wireless Noise-Cancelling Headphones',1,NULL),(5,'2025-09-02 21:21:00.375277','Perfect for smoothies, sauces, and soups. Easy to clean.',0.39,3200,'FIXED','SOLD','Multi-Speed Kitchen Blender',1,NULL),(6,'2025-09-06 14:04:09.310117','حقيبة ظهر متينة للمدرسة أو السفر',0.60,2000,'FIXED','SOLD','حقيبة ظهر',1,NULL),(7,'2025-09-06 14:12:00.666118','UV-protection sunglasses',0.63,1234,'FIXED','SOLD','Sunglasses',1,NULL),(8,'2025-09-06 14:13:37.917915','a nice Sweater',0.51,1234,'FIXED','SOLD','Girl Cardigan',6,NULL),(9,'2025-09-09 21:17:56.226500',' High-quality noise-cancelling wireless headphones with long battery life. for gaming',0.10,2500,'FIXED','AVAILABLE','سماعات بلوتوث',15,NULL),(10,'2025-09-11 16:33:56.894350','دراجة هوائية جيدة',0.01,30000,'FIXED','AVAILABLE','دراجة هوائية',1,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `product_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `FKkud35ls1d40wpjb5htpp14q4e` (`category_id`),
  CONSTRAINT `FK2k3smhbruedlcrvu6clued06x` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKkud35ls1d40wpjb5htpp14q4e` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,3),(8,3),(2,5),(6,6),(7,6),(3,10),(5,11),(4,15),(9,15),(10,18);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `is_main` bit(1) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6oo0cvcdtb6qmwsga468uuukk` (`product_id`),
  CONSTRAINT `FK6oo0cvcdtb6qmwsga468uuukk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (8,'https://res.cloudinary.com/damdtnet3/image/upload/v1756848860/products/t99bvsij7ti0vvu35fm1.jpg',_binary '\0',1),(9,'https://res.cloudinary.com/damdtnet3/image/upload/v1757604754/products/oxsbrjnmd3arufbatvng.webp',_binary '\0',10),(11,'https://res.cloudinary.com/damdtnet3/image/upload/v1757974646/products/ptyb2hsrihzt7vtjk3ma.png',_binary '\0',3),(12,'https://res.cloudinary.com/damdtnet3/image/upload/v1757974698/products/ft3cdav2inrezm1njcee.jpg',_binary '\0',4),(13,'https://res.cloudinary.com/damdtnet3/image/upload/v1757974757/products/mugqaaa95xt6x2fyn0ab.avif',_binary '\0',5),(14,'https://res.cloudinary.com/damdtnet3/image/upload/v1757974811/products/qfxfkjlvi4u6osaxg2o0.jpg',_binary '\0',6),(15,'https://res.cloudinary.com/damdtnet3/image/upload/v1757974895/products/povbtll4awqpbmcvu0gu.webp',_binary '\0',7),(16,'https://res.cloudinary.com/damdtnet3/image/upload/v1757975246/products/fdj7rhnn5xpmvkztsgje.jpg',_binary '\0',2),(17,'https://res.cloudinary.com/damdtnet3/image/upload/v1757975354/products/zfnarh9dxosxkstniysp.jpg',_binary '\0',8),(18,'https://res.cloudinary.com/damdtnet3/image/upload/v1757975410/products/pdeyezou6g09bkwbjzzf.jpg',_binary '\0',9);
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `default_donation_percentage` decimal(38,2) DEFAULT NULL,
  `donation_percentage` decimal(38,2) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `status` enum('ACTIVE','BANNED','SUSPENDED') DEFAULT NULL,
  `password_updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alger, Algeria',NULL,'rana@gmail.com','Rana Megh','rana megh 123','+213661234567','2025-09-03 22:23:40.270148',NULL,NULL,NULL,'Love shopping and donating to good causes ❤️',NULL,NULL),(2,'Algeria','2025-08-12 12:00:00.000000','chaima@example.com','Chaima B.','mypassword123','0551234567','2025-08-12 12:00:00.000000',NULL,NULL,NULL,NULL,NULL,NULL),(6,'Algiers','2025-08-12 12:00:00.000000','chaima@gmail.com','chaima','chaima20056','0112233445','2025-09-15 17:53:09.492343',NULL,NULL,'https://res.cloudinary.com/damdtnet3/image/upload/v1757443305/users/fangeefjveloaeojxhcl.avif','',NULL,NULL),(8,NULL,NULL,'chaima123@example.com',NULL,'12345678','0987654321',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,NULL,NULL,'chaimaa.djekhrab@gmail.com',NULL,'1234567890','0987654321',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,NULL,'2025-08-20 22:59:20.174692','chaima112345@example.com',NULL,'1234567890','0987654321','2025-08-20 22:59:20.174692',NULL,NULL,NULL,NULL,NULL,NULL),(12,NULL,'2025-08-23 13:51:46.615071','a@gmail.com',NULL,'mypassword123','0987654321','2025-08-23 13:51:46.615071',NULL,NULL,NULL,NULL,NULL,NULL),(13,NULL,'2025-08-26 18:37:22.550856','test@gmail.com',NULL,'NewPass456','0987654321','2025-09-05 14:54:35.462269',10.00,NULL,'https://res.cloudinary.com/damdtnet3/image/upload/v1756936874/users/j3pdrgogwoxkw7396fm1.avif',NULL,NULL,NULL),(14,NULL,'2025-09-02 22:58:40.896880','zaki@gmail.com',NULL,'zaki zaki 123','0612123456','2025-09-02 22:58:40.896880',10.00,NULL,NULL,NULL,NULL,NULL),(15,NULL,'2025-09-05 19:48:30.515732','anfel@gmail.com',NULL,'anfel123456','0123456780','2025-09-05 19:48:30.515732',10.00,NULL,NULL,NULL,'ACTIVE',NULL),(16,NULL,NULL,'ahmed@example.com','Ahmed Mohammed','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,NULL,NULL,'fatima@example.com','Fatima Ali','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,NULL,NULL,'mohammed@example.com','Mohammed Hassan','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,NULL,NULL,'layla@example.com','Layla Ibrahim','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,NULL,'2025-09-15 17:33:09.466008','chaima20@gmail.com',NULL,'chaima2005','009912345','2025-09-15 17:33:09.466008',10.00,NULL,NULL,NULL,'ACTIVE',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-16 18:32:04
