-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: skilllens_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `activity_history`
--

DROP TABLE IF EXISTS `activity_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `resume_id` bigint DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_activity_user` (`user_id`),
  KEY `idx_activity_resume` (`resume_id`),
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKblqmqks1d4xavy3avmhjy8fyx` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_history`
--

LOCK TABLES `activity_history` WRITE;
/*!40000 ALTER TABLE `activity_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_analyses`
--

DROP TABLE IF EXISTS `job_analyses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_analyses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `resume_id` bigint NOT NULL,
  `target_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_description` longtext COLLATE utf8mb4_unicode_ci,
  `matched_skills` longtext COLLATE utf8mb4_unicode_ci,
  `missing_skills` longtext COLLATE utf8mb4_unicode_ci,
  `recommendation` longtext COLLATE utf8mb4_unicode_ci,
  `ats_score` int DEFAULT NULL,
  `technical_questions` longtext COLLATE utf8mb4_unicode_ci,
  `hr_questions` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_analysis_resume` (`resume_id`),
  CONSTRAINT `fk_analysis_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_analyses`
--

LOCK TABLES `job_analyses` WRITE;
/*!40000 ALTER TABLE `job_analyses` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_analyses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumes`
--

DROP TABLE IF EXISTS `resumes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `parsed_text` longtext COLLATE utf8mb4_unicode_ci,
  `ats_score` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_resume_user` (`user_id`),
  CONSTRAINT `fk_resume_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumes`
--

LOCK TABLES `resumes` WRITE;
/*!40000 ALTER TABLE `resumes` DISABLE KEYS */;
INSERT INTO `resumes` VALUES (1,'1786333407404_suryalinked in.pdf','C:\\Users\\surya\\Downloads\\skilllens-ai\\uploads\\1786333407404_suryalinked in.pdf','2026-08-10 09:13:27.410948',NULL,NULL,1),(2,'1786335369450_SuryaResumeMain.pdf_20251215_211745_0000.pdf','C:\\Users\\surya\\Downloads\\skilllens-ai\\uploads\\1786335369450_SuryaResumeMain.pdf_20251215_211745_0000.pdf','2026-08-10 09:46:09.457444',NULL,NULL,3);
/*!40000 ALTER TABLE `resumes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user1','$2a$10$crKWFEWaPMfsbvu5uukte.wt9iUyfHbG3hYcIFY1PcRaSHblnWnw6','USER','2026-08-09 22:20:11.901987'),(2,'admin','$2a$10$WbRB/QGvk6KlQsSWfSwNfOGHegS7M6pFVpk0vgRmn0Io.qSvvDdg6','ADMIN','2026-08-09 22:51:04.070436'),(3,'yser2','$2a$10$8c7t78GBhlH5UNrfy3rUwuxmjhDV6QSN29CDQdWEWoxOGQBvlyrte','USER','2026-08-10 09:12:52.668466');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 10:39:22
