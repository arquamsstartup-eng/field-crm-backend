-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: field_expense_crm
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_types`
--

DROP TABLE IF EXISTS `activity_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `target_role` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_types`
--

LOCK TABLES `activity_types` WRITE;
/*!40000 ALTER TABLE `activity_types` DISABLE KEYS */;
INSERT INTO `activity_types` VALUES (1,'ACT-001','Sales Pitch / Discovery','Sales','Initial client meeting and presentation','Active','2026-09-30 22:24:04'),(2,'ACT-002','Product Live Demonstration','Sales','Live cutting/bending demo','Active','2026-09-30 22:24:04'),(3,'ACT-003','Payment & Proposal Follow-up','Sales','Commercial discussions','Active','2026-09-30 22:24:04'),(4,'ACT-004','Commercial Negotiation & Closing','Sales','Final discount and terms discussion','Active','2026-09-30 22:24:04'),(5,'ACT-005','Machine Commissioning & Installation','Service','On-site machinery erection and wiring','Active','2026-09-30 22:24:04'),(6,'ACT-006','Routine Maintenance / AMC','Service','Preventive maintenance visit','Active','2026-09-30 22:24:04'),(7,'ACT-007','Emergency Breakdown Service','Service','Urgent service call','Active','2026-09-30 22:24:04'),(8,'ACT-008','Customer Operator Training','Service','Operating and safety training','Active','2026-09-30 22:24:04'),(9,'ACT-009','Customer Courtesy / Relationship','All Roles','General relationship visit','Active','2026-09-30 22:24:04');
/*!40000 ALTER TABLE `activity_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `branch_code` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (3,'Mumbai HQ','2026-09-28 10:00:50','BR-003','Mumbai',NULL,'Active'),(4,'Delhi Branch','2026-09-28 10:00:57','BR-004','Delhi',NULL,'Active');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_code` varchar(50) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_code` (`contact_code`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'CONT-001',1,'Morco','HOI','98765','mor@gmail.com',1,'Active','2026-09-30 21:04:24'),(2,'CONT-002',1,'george','CIO','654321','georg@gmail.com',0,'Active','2026-09-30 21:05:40'),(3,'CONT-003',2,'rhody','Head`','+11','',0,'Active','2026-09-30 21:21:21'),(4,'CONT-004',2,'pepper','Ceo','','',1,'Active','2026-09-30 21:21:21'),(5,'CONT-005',1,'franklin','CTO','+2','',0,'Active','2026-09-30 21:27:34');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_code` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `customer_type` varchar(50) DEFAULT 'Prospect',
  `industry_id` int(11) DEFAULT NULL,
  `lead_source_id` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_code` (`customer_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'CUST-001','Inifinix','Prospect',1,3,'www.infinix.com','Active','Mumbai','Maharashtra','11 Lane Blossom Road ','no remark','2026-09-30 17:17:34'),(2,'CUST-002','Stark Industries','Prospect',3,2,'','Active','','','','','2026-09-30 21:21:21');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (2,'Sales','2026-09-28 10:01:16','DEPT-002','Active'),(3,'Service','2026-09-28 10:01:24','DEPT-003','Active'),(4,'Management','2026-09-30 14:35:05','DEPT-004','Active');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designations`
--

DROP TABLE IF EXISTS `designations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `designations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designations`
--

LOCK TABLES `designations` WRITE;
/*!40000 ALTER TABLE `designations` DISABLE KEYS */;
INSERT INTO `designations` VALUES (1,'Sales Executive','2026-09-28 10:01:47','DESG-001','Active'),(3,'Service Engineer','2026-09-28 10:02:18','DESG-003','Active'),(4,'Branch Manager','2026-09-30 14:39:20','DESG-004','Active'),(5,'System Administrator','2026-09-30 14:40:53','DESG-005','Active');
/*!40000 ALTER TABLE `designations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_heads`
--

DROP TABLE IF EXISTS `expense_heads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expense_heads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `receipt_required` varchar(50) DEFAULT 'No Bill',
  `requires_km` varchar(50) DEFAULT 'No',
  `default_rate` decimal(10,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_heads`
--

LOCK TABLES `expense_heads` WRITE;
/*!40000 ALTER TABLE `expense_heads` DISABLE KEYS */;
INSERT INTO `expense_heads` VALUES (1,'EXP-FUEL','Fuel Allowance (Per KM)','No Bill','Yes (Fuel)',11.50,'Active','2026-10-01 05:34:58'),(2,'EXP-HOTEL','Hotel / Lodging Expense','Bill Required','No',0.00,'Active','2026-10-01 05:34:58'),(3,'EXP-FOOD','Daily Food / Meal Allowance','Bill Required','No',0.00,'Active','2026-10-01 05:34:58'),(4,'EXP-TOLL','Highway Toll & Parking','Bill Required','No',0.00,'Active','2026-10-01 05:34:58'),(5,'EXP-CLIENT-ENT','Client Entertainment / Refreshments','Bill Required','No',0.00,'Active','2026-10-01 05:34:58'),(6,'EXP-PUBLIC-TRANS','Public Transit (Cab/Bus/Train)','Bill Required','No',0.00,'Active','2026-10-01 05:34:58'),(7,'EXP-MISC','Miscellaneous Contingency','No Bill','No',0.00,'Active','2026-10-01 05:34:58');
/*!40000 ALTER TABLE `expense_heads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_fuel_rates`
--

DROP TABLE IF EXISTS `grade_fuel_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grade_fuel_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rate_per_km` decimal(10,2) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_fuel_rates`
--

LOCK TABLES `grade_fuel_rates` WRITE;
/*!40000 ALTER TABLE `grade_fuel_rates` DISABLE KEYS */;
INSERT INTO `grade_fuel_rates` VALUES (1,'Grade A (Senior Mgmt / SUV)','2026-09-28 10:03:47',14.00,'Grade A','Active'),(2,'Grade B (Mid Executive / Sedan)','2026-09-28 10:03:59',11.50,'Grade B','Active');
/*!40000 ALTER TABLE `grade_fuel_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `industries`
--

DROP TABLE IF EXISTS `industries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `industries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `industries`
--

LOCK TABLES `industries` WRITE;
/*!40000 ALTER TABLE `industries` DISABLE KEYS */;
INSERT INTO `industries` VALUES (1,'IND-001','Automobile & Auto Components','Active','2026-09-30 16:42:21'),(2,'IND-002','Food Processing & Packaging','Active','2026-09-30 16:42:32'),(3,'IND-003','Industrial Machinery & Equipment','Active','2026-09-30 16:42:46');
/*!40000 ALTER TABLE `industries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_sources`
--

DROP TABLE IF EXISTS `lead_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lead_sources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_sources`
--

LOCK TABLES `lead_sources` WRITE;
/*!40000 ALTER TABLE `lead_sources` DISABLE KEYS */;
INSERT INTO `lead_sources` VALUES (1,'LS-001','Direct Visit','Active','2026-09-30 16:49:41'),(2,'LS-002','Reference','Active','2026-09-30 16:49:53'),(3,'LS-003','Website','Active','2026-09-30 16:50:01'),(4,'LS-004','LinkedIn','Active','2026-09-30 16:50:17');
/*!40000 ALTER TABLE `lead_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opportunities`
--

DROP TABLE IF EXISTS `opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opportunities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opportunity_no` varchar(50) DEFAULT NULL,
  `opportunity_name` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `principal_name` varchar(255) DEFAULT NULL,
  `contact_person_id` int(11) DEFAULT NULL,
  `lead_source` varchar(100) DEFAULT NULL,
  `assigned_salesperson_id` int(11) DEFAULT NULL,
  `stage` varchar(100) DEFAULT 'New Leads',
  `estimated_value` decimal(15,2) DEFAULT 0.00,
  `lead_date` date DEFAULT NULL,
  `expected_closure_date` date DEFAULT NULL,
  `is_new_client` tinyint(1) DEFAULT 0,
  `technical_requirements` text DEFAULT NULL,
  `competitor_brand` varchar(255) DEFAULT NULL,
  `competitor_price` decimal(15,2) DEFAULT NULL,
  `competitor_threat_level` varchar(100) DEFAULT NULL,
  `competitor_strengths` text DEFAULT NULL,
  `competitor_weaknesses` text DEFAULT NULL,
  `win_loss_rationale` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `opportunity_no` (`opportunity_no`),
  KEY `customer_id` (`customer_id`),
  KEY `assigned_salesperson_id` (`assigned_salesperson_id`),
  CONSTRAINT `opportunities_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `opportunities_ibfk_2` FOREIGN KEY (`assigned_salesperson_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opportunities`
--

LOCK TABLES `opportunities` WRITE;
/*!40000 ALTER TABLE `opportunities` DISABLE KEYS */;
INSERT INTO `opportunities` VALUES (1,'OPP-001','Autoparts',1,'Fanuc',1,'Direct Visit',2,'Qualified',2800000.00,'2026-10-02',NULL,0,'etcc','',0.00,'Medium Threat - Active Evaluation by Client','','','','2026-10-02 09:27:49','2026-10-02 09:27:49'),(2,'OPP-002','Test',2,'Amada',4,'Website',4,'Negotiation',4200000.00,'2026-09-30',NULL,0,'','',0.00,'Medium Threat - Active Evaluation by Client','','','','2026-10-02 09:27:59','2026-10-02 09:31:58');
/*!40000 ALTER TABLE `opportunities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opportunity_products`
--

DROP TABLE IF EXISTS `opportunity_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opportunity_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opportunity_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `principal_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_rate` decimal(15,2) DEFAULT NULL,
  `line_total` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `opportunity_id` (`opportunity_id`),
  CONSTRAINT `opportunity_products_ibfk_1` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opportunity_products`
--

LOCK TABLES `opportunity_products` WRITE;
/*!40000 ALTER TABLE `opportunity_products` DISABLE KEYS */;
INSERT INTO `opportunity_products` VALUES (1,1,1,'Fanuc',1,2800000.00,2800000.00),(3,2,1,'Amada',1,4200000.00,4200000.00);
/*!40000 ALTER TABLE `opportunity_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `principals`
--

DROP TABLE IF EXISTS `principals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `principals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `principals`
--

LOCK TABLES `principals` WRITE;
/*!40000 ALTER TABLE `principals` DISABLE KEYS */;
INSERT INTO `principals` VALUES (1,'Amada','2026-10-02 07:27:07','PRIN-001','Japan','Hiroshi Tanaka','htanaka@amada.example.com','+81 463 96 1111','Active'),(2,'DMG Mori','2026-10-02 07:27:07','PRIN-002','Germany / Japan','Stefan Weber','sweber@dmgmori.example.com','+49 5205 74 0','Active'),(3,'Fanuc','2026-10-02 07:27:07','PRIN-003','Japan','Takashi Watanabe','twatanabe@fanuc.example.com','+81 555 84 5555','Active'),(4,'General Machinery','2026-10-02 07:27:07','PRIN-004','India','Suresh Patel','spatel@generalmachinery.example.com','+91 22 2580 1234','Active'),(5,'Haas Automation','2026-10-02 07:27:07','PRIN-005','United States','Robert Miller','rmiller@haascnc.example.com','+1 805 278 1800','Active'),(6,'Mazak','2026-10-02 07:27:07','PRIN-006','Japan','Kenji Sato','ksato@mazak.example.com','+81 587 95 5511','Active'),(7,'Mitsubishi Electric','2026-10-02 07:27:07','PRIN-007','Japan','Daisuke Yamada','dyamada@mitsubishi.example.com','+81 3 3218 2111','Active'),(8,'Siemens','2026-10-02 07:27:07','PRIN-008','Germany','Markus Schmidt','m.schmidt@siemens.example.com','+49 89 636 00','Active');
/*!40000 ALTER TABLE `principals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `principal` varchar(100) DEFAULT NULL,
  `target_role` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `unit_price` decimal(12,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'PRD-001','Hydraulic Press Brake 100T','Trumpf','Sales','Machinery',3500000.00,'Active','2026-09-30 22:24:04'),(2,'PRD-002','CNC Fiber Laser 3kW','Mazak','Sales','Machinery',5800000.00,'Active','2026-09-30 22:24:04'),(3,'PRD-003','CNC Turret Punch Press','Amada','Sales','Machinery',4200000.00,'Active','2026-09-30 22:24:04'),(4,'PRD-004','Hydraulic Shearing 6mm','Haas Automation','Sales','Machinery',1800000.00,'Active','2026-09-30 22:24:04'),(5,'PRD-005','CNC Laser Tube Cutting 2kW','DMG Mori','Sales','Machinery',6500000.00,'Active','2026-09-30 22:24:04'),(6,'PRD-006','Robotic Welding Cell 6-Axis','Fanuc','Sales','Automation',2800000.00,'Active','2026-09-30 22:24:04'),(7,'PRD-007','Fiber Laser Optics & Ceramic Ring Kit','Mazak','Service','Spare Parts',45000.00,'Active','2026-09-30 22:24:04'),(8,'PRD-008','High-Pressure Hydraulic Seal & Valve Kit','Trumpf','Service','Spare Parts',28000.00,'Active','2026-09-30 22:24:04');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_items`
--

DROP TABLE IF EXISTS `quotation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quotation_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT 1,
  `unit_rate` decimal(15,2) DEFAULT 0.00,
  `discount_percent` decimal(5,2) DEFAULT 0.00,
  `net_amount` decimal(15,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_items`
--

LOCK TABLES `quotation_items` WRITE;
/*!40000 ALTER TABLE `quotation_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotation_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_no` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `opportunity_id` int(11) DEFAULT NULL,
  `quote_date` date DEFAULT NULL,
  `validity_days` int(11) DEFAULT 30,
  `status` varchar(50) DEFAULT 'DRAFT',
  `offer_notes` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `subtotal` decimal(15,2) DEFAULT 0.00,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `grand_total` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_no` (`quote_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'SALES_EXEC',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `grade_id` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `emp_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Tony Stark','tony@stark.com','ironman_rocks','ADMIN','2026-09-24 09:03:18',0,0,0,'Male','0000-00-00','0000-00-00','',0,'Active','EMP-001'),(2,'James Rhodes','james@rhodes.com','warmachine_rocks','SALES_EXEC','2026-09-25 14:33:20',0,0,0,'Male','0000-00-00','0000-00-00','',0,'Active','EMP-002'),(3,'Howard Stark','howard@stark.com','howardrocks','MANAGER','2026-09-28 10:15:47',3,4,1,'Male','1899-11-29','1899-11-29','',4,'Active','EMP-003'),(4,'Jon Jones','jonjones@gmail.com','1234','SERVICE_ENG','2026-09-30 15:10:40',3,3,1,'Male','1997-01-24','2026-09-04','987654321',3,'Active','EMP-004');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_expenses`
--

DROP TABLE IF EXISTS `visit_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visit_id` int(11) NOT NULL,
  `expense_head_id` int(11) NOT NULL,
  `start_km` int(11) DEFAULT 0,
  `end_km` int(11) DEFAULT 0,
  `total_km` int(11) DEFAULT 0,
  `fuel_rate` decimal(10,2) DEFAULT 0.00,
  `toll_tax` decimal(10,2) DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `remarks` varchar(255) DEFAULT NULL,
  `receipt_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `visit_id` (`visit_id`),
  CONSTRAINT `visit_expenses_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_expenses`
--

LOCK TABLES `visit_expenses` WRITE;
/*!40000 ALTER TABLE `visit_expenses` DISABLE KEYS */;
INSERT INTO `visit_expenses` VALUES (1,1,1,1,10,9,14.00,20.00,146.00,'',NULL,'2026-10-01 05:50:46'),(2,1,6,0,0,0,14.00,0.00,43.00,'',NULL,'2026-10-01 05:50:46');
/*!40000 ALTER TABLE `visit_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visit_code` varchar(50) DEFAULT NULL,
  `emp_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `activity_type_id` int(11) DEFAULT NULL,
  `principal_id` int(11) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `person_count` int(11) DEFAULT 1,
  `place_from` varchar(150) DEFAULT NULL,
  `place_to` varchar(150) DEFAULT NULL,
  `sales_report_text` text DEFAULT NULL,
  `sales_report_file` varchar(255) DEFAULT NULL,
  `total_claim_amount` decimal(10,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `report_file` varchar(255) DEFAULT NULL,
  `opportunity_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `visit_code` (`visit_code`),
  KEY `emp_id` (`emp_id`),
  KEY `customer_id` (`customer_id`),
  KEY `opportunity_id` (`opportunity_id`),
  CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `users` (`id`),
  CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `visits_ibfk_3` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES (1,'VST-001',1,2,3,8,7,'2026-10-01','00:19:00','23:20:00',2,'mumbbai','banglore','etccc',NULL,189.00,'Submitted','2026-10-01 05:50:46','2026-10-01 05:50:46',NULL,NULL),(2,'VST-002',1,2,4,6,NULL,'2026-10-12','00:00:10','00:00:06',1,'Mumbai','Thane','Etc...',NULL,0.00,'Submitted','2026-10-12 00:39:50','2026-10-12 00:39:50',NULL,NULL);
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-12  6:18:09
