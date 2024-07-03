-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: DopMPT1
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrator` (
  `ID_Administrator` int NOT NULL AUTO_INCREMENT,
  `Surname_admin` varchar(30) NOT NULL,
  `Name_admin` varchar(30) NOT NULL,
  `Middle_admin` varchar(30) DEFAULT NULL,
  `Email_admin` varchar(50) NOT NULL,
  `Password_admin` varchar(300) NOT NULL,
  `Post_ID` int NOT NULL,
  PRIMARY KEY (`ID_Administrator`),
  KEY `FK_Administrator_Post` (`Post_ID`),
  CONSTRAINT `FK_Administrator_Post` FOREIGN KEY (`Post_ID`) REFERENCES `post` (`ID_Post`),
  CONSTRAINT `CHK_Email_Length_Format` CHECK (((length(`Email_admin`) >= 10) and (`Email_admin` like _utf8mb4'%@%.%')))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrator`
--

LOCK TABLES `administrator` WRITE;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` VALUES (1,'Ефремова','Елизавета','Сергеевна','efremova.elizaveta06@gmail.com','L2i0z0a2!@',2),(2,'Коваленко','Анна','Валерьевна','kovalenko23@mail.ru','Pa$$word123',1),(8,'Краснова','sdfsdf','ыва','csdfsdfd@gjfd.com','$2b$10$7Bas9ntn7BP1K.hhVpwFFe.JMhxGwGhw2T.Bgcz4SlqQz3N5RAPWe',1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `ID_Comments` int NOT NULL AUTO_INCREMENT,
  `Theme_ID` int NOT NULL,
  `Comment_Text` varchar(500) NOT NULL,
  `UserFrom_ID` int DEFAULT NULL,
  `AdminFrom_ID` int DEFAULT NULL,
  `CommentTo_ID` int DEFAULT NULL,
  `Date_comment` date NOT NULL,
  `Access` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_Comments`),
  KEY `FK_Comments_Theme` (`Theme_ID`),
  KEY `FK_Comments_UserFrom` (`UserFrom_ID`),
  KEY `FK_Comments_AdminFrom` (`AdminFrom_ID`),
  CONSTRAINT `FK_Comments_AdminFrom` FOREIGN KEY (`AdminFrom_ID`) REFERENCES `administrator` (`ID_Administrator`),
  CONSTRAINT `FK_Comments_Theme` FOREIGN KEY (`Theme_ID`) REFERENCES `theme` (`ID_Theme`),
  CONSTRAINT `FK_Comments_UserFrom` FOREIGN KEY (`UserFrom_ID`) REFERENCES `user` (`ID_User`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,3,'Нет, только для практических',2,NULL,NULL,'2024-03-30','0'),(2,3,'Да, я тоже только для практических использую',1,NULL,1,'2024-03-30','0'),(3,3,'Я редко использую тоже',3,NULL,NULL,'2024-04-29','1');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_statistics` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
	DECLARE count_comms INT;
    DECLARE date_exist bool;
    INSERT INTO Statistics(Count_Comments, DateStatistics, Theme_ID)
    VALUES(1, CURDATE(), NEW.Theme_ID) ON DUPLICATE KEY UPDATE Count_Comments=Count_Comments+1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `ID_Files` int NOT NULL AUTO_INCREMENT,
  `Title_Files` varchar(254) NOT NULL,
  `Path_Files` varchar(254) NOT NULL,
  PRIMARY KEY (`ID_Files`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,'1','files/1.pdf');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filesintheme`
--

DROP TABLE IF EXISTS `filesintheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filesintheme` (
  `ID_FilesInTheme` int NOT NULL AUTO_INCREMENT,
  `Theme_ID` int NOT NULL,
  `Files_ID` int NOT NULL,
  PRIMARY KEY (`ID_FilesInTheme`),
  KEY `FK_FilesInTheme_Theme` (`Theme_ID`),
  KEY `FK_FilesInTheme_Files` (`Files_ID`),
  CONSTRAINT `FK_FilesInTheme_Files` FOREIGN KEY (`Files_ID`) REFERENCES `files` (`ID_Files`),
  CONSTRAINT `FK_FilesInTheme_Theme` FOREIGN KEY (`Theme_ID`) REFERENCES `theme` (`ID_Theme`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filesintheme`
--

LOCK TABLES `filesintheme` WRITE;
/*!40000 ALTER TABLE `filesintheme` DISABLE KEYS */;
INSERT INTO `filesintheme` VALUES (1,2,1);
/*!40000 ALTER TABLE `filesintheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `ID_Post` int NOT NULL AUTO_INCREMENT,
  `Post_name` varchar(50) NOT NULL,
  `Responsibilities` text NOT NULL,
  PRIMARY KEY (`ID_Post`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'Администратор платформы','Обработка жалоб, блокировка пользователей, осуществление поддержки пользователей по вопросам платформы.'),(2,'Администратор','Управление данными платформы.'),(3,'Преподаватель','Публикация методичек, создание обсуждений тем или предметов. '),(4,'Ученик','Скачивание методичек, участие в обсуждениях тем или предметов. Возможность самому опубликовать вопрос для обсуждения');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statistics`
--

DROP TABLE IF EXISTS `statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statistics` (
  `ID_Statistics` int NOT NULL AUTO_INCREMENT,
  `Count_Comments` int DEFAULT NULL,
  `Count_Watch` int DEFAULT NULL,
  `DateStatistics` date NOT NULL,
  `Theme_ID` int NOT NULL,
  PRIMARY KEY (`ID_Statistics`),
  UNIQUE KEY `DateStatistics` (`DateStatistics`,`Theme_ID`),
  KEY `FK_Statistics_Theme` (`Theme_ID`),
  CONSTRAINT `FK_Statistics_Theme` FOREIGN KEY (`Theme_ID`) REFERENCES `theme` (`ID_Theme`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statistics`
--

LOCK TABLES `statistics` WRITE;
/*!40000 ALTER TABLE `statistics` DISABLE KEYS */;
INSERT INTO `statistics` VALUES (1,1,NULL,'2024-03-31',3),(2,1,NULL,'2024-04-01',3),(3,3,NULL,'2024-04-29',3);
/*!40000 ALTER TABLE `statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme`
--

DROP TABLE IF EXISTS `theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme` (
  `ID_Theme` int NOT NULL AUTO_INCREMENT,
  `Title_Theme` varchar(60) NOT NULL,
  `Description_Theme` varchar(2000) NOT NULL,
  `Text_Theme` varchar(2000) DEFAULT NULL,
  `TypeTheme_ID` int NOT NULL,
  `User_ID` int DEFAULT NULL,
  `Admin_ID` int DEFAULT NULL,
  `Access` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_Theme`),
  KEY `TypeTheme_ID` (`TypeTheme_ID`),
  KEY `User_ID` (`User_ID`),
  KEY `Admin_ID` (`Admin_ID`),
  CONSTRAINT `theme_ibfk_1` FOREIGN KEY (`TypeTheme_ID`) REFERENCES `typetheme` (`ID_TypeTheme`),
  CONSTRAINT `theme_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`ID_User`),
  CONSTRAINT `theme_ibfk_3` FOREIGN KEY (`Admin_ID`) REFERENCES `administrator` (`ID_Administrator`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme`
--

LOCK TABLES `theme` WRITE;
/*!40000 ALTER TABLE `theme` DISABLE KEYS */;
INSERT INTO `theme` VALUES (1,'Flutter','Для чего используется знак вопроса с переменными?',NULL,2,2,NULL,'0'),(2,'Обеспечение качества функционирования КС','Краткое руководство',NULL,1,1,NULL,'0'),(3,'Docker','Часто ли вы используете Docker?',NULL,3,3,NULL,'0'),(4,'Flutter','Как правильно использовать Router?',NULL,2,3,NULL,'0');
/*!40000 ALTER TABLE `theme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `typetheme`
--

DROP TABLE IF EXISTS `typetheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typetheme` (
  `ID_TypeTheme` int NOT NULL AUTO_INCREMENT,
  `Title_TypeTheme` varchar(254) NOT NULL,
  PRIMARY KEY (`ID_TypeTheme`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typetheme`
--

LOCK TABLES `typetheme` WRITE;
/*!40000 ALTER TABLE `typetheme` DISABLE KEYS */;
INSERT INTO `typetheme` VALUES (1,'Дисциплина'),(2,'Вопрос'),(3,'Тема для обсуждения');
/*!40000 ALTER TABLE `typetheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `ID_User` int NOT NULL AUTO_INCREMENT,
  `Surname_User` varchar(30) NOT NULL,
  `Name_User` varchar(30) NOT NULL,
  `Middle_User` varchar(30) DEFAULT NULL,
  `Email_User` varchar(50) NOT NULL,
  `Password_User` varchar(20) NOT NULL,
  `Post_ID` int NOT NULL,
  `Access` varchar(1) NOT NULL,
  PRIMARY KEY (`ID_User`),
  KEY `FK_User_Post` (`Post_ID`),
  CONSTRAINT `FK_User_Post` FOREIGN KEY (`Post_ID`) REFERENCES `post` (`ID_Post`),
  CONSTRAINT `CHK_Email_Length_Format_Doc` CHECK (((length(`Email_User`) >= 5) and (`Email_User` like _utf8mb4'%@%.%'))),
  CONSTRAINT `CHK_Password_Complexity_Doc` CHECK ((regexp_like(`Password_User`,_utf8mb4'[A-Z]') and regexp_like(`Password_User`,_utf8mb4'[a-z]') and regexp_like(`Password_User`,_utf8mb4'[0-9]') and regexp_like(`Password_User`,_utf8mb4'[^A-Za-z0-9]'))),
  CONSTRAINT `CHK_Password_Length_Doc` CHECK (((length(`Password_User`) >= 8) and (length(`Password_User`) <= 20)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Никонова','Александра','Николаевна','nikonova14@mail.ru','Pa$$word123',3,'0'),(2,'Петрова','Екатерина','Андреевна','petrov@mail.ru','Pa$$word123',4,'0'),(3,'Смирнова','Мария','Ивановна','smirnov@gmail.com','Pa$$word123',4,'0');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tokens`
--

DROP TABLE IF EXISTS `user_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tokens` (
  `id_token` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `access_token` text,
  `refresh_token` text,
  PRIMARY KEY (`id_token`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `administrator` (`ID_Administrator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tokens`
--

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-01 22:27:00
