-- Clean Production Database Schema for Field Expense CRM
-- Zero dummy visits, customers, contacts, opportunities, or test employees.
-- Includes only 1 System Admin user + core Master Dropdown configurations.

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

-- 1. activity_types
DROP TABLE IF EXISTS `activity_types`;
CREATE TABLE `activity_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `target_role` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`) VALUES
(1,'ACT-001','Sales Pitch / Discovery','Sales','Initial client meeting and presentation','Active'),
(2,'ACT-002','Product Live Demonstration','Sales','Live product demo','Active'),
(3,'ACT-003','Payment & Proposal Follow-up','Sales','Commercial discussions','Active'),
(4,'ACT-004','Commercial Negotiation & Closing','Sales','Final discount and terms discussion','Active'),
(5,'ACT-005','Machine Commissioning & Installation','Service','On-site installation and setup','Active'),
(6,'ACT-006','Routine Maintenance / AMC','Service','Preventive maintenance visit','Active'),
(7,'ACT-007','Emergency Breakdown Service','Service','Urgent service call','Active'),
(8,'ACT-008','Customer Operator Training','Service','Operating and safety training','Active'),
(9,'ACT-009','Customer Courtesy / Relationship','All Roles','General relationship visit','Active');

-- 2. branches
DROP TABLE IF EXISTS `branches`;
CREATE TABLE `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `branch_code` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `branches` (`id`, `name`, `branch_code`, `city`, `manager_id`, `status`) VALUES
(1,'Head Office','BR-001','Mumbai',NULL,'Active');

-- 3. departments
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `departments` (`id`, `name`, `code`, `status`) VALUES
(1,'Management','DEPT-001','Active'),
(2,'Sales','DEPT-002','Active'),
(3,'Service','DEPT-003','Active');

-- 4. designations
DROP TABLE IF EXISTS `designations`;
CREATE TABLE `designations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `designations` (`id`, `name`, `code`, `status`) VALUES
(1,'System Administrator','DESG-001','Active'),
(2,'Branch Manager','DESG-002','Active'),
(3,'Sales Executive','DESG-003','Active'),
(4,'Service Engineer','DESG-004','Active');

-- 5. expense_heads
DROP TABLE IF EXISTS `expense_heads`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`) VALUES
(1,'EXP-FUEL','Fuel Allowance (Per KM)','No Bill','Yes (Fuel)',14.00,'Active'),
(2,'EXP-HOTEL','Hotel / Lodging Expense','Bill Required','No',0.00,'Active'),
(3,'EXP-FOOD','Daily Food / Meal Allowance','Bill Required','No',0.00,'Active'),
(4,'EXP-TOLL','Highway Toll & Parking','Bill Required','No',0.00,'Active'),
(5,'EXP-CLIENT-ENT','Client Entertainment / Refreshments','Bill Required','No',0.00,'Active'),
(6,'EXP-PUBLIC-TRANS','Public Transit (Cab/Bus/Train)','Bill Required','No',0.00,'Active'),
(7,'EXP-MISC','Miscellaneous Contingency','No Bill','No',0.00,'Active');

-- 6. grade_fuel_rates
DROP TABLE IF EXISTS `grade_fuel_rates`;
CREATE TABLE `grade_fuel_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `rate_per_km` decimal(10,2) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `grade_fuel_rates` (`id`, `name`, `rate_per_km`, `code`, `status`) VALUES
(1,'Grade A (Senior / Four Wheeler)',14.00,'Grade A','Active'),
(2,'Grade B (Executive / Two Wheeler)',11.50,'Grade B','Active');

-- 7. industries
DROP TABLE IF EXISTS `industries`;
CREATE TABLE `industries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 8. lead_sources
DROP TABLE IF EXISTS `lead_sources`;
CREATE TABLE `lead_sources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 9. principals
DROP TABLE IF EXISTS `principals`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 10. products
DROP TABLE IF EXISTS `products`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 11. customers (EMPTY - Clean Production)
DROP TABLE IF EXISTS `customers`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 12. contacts (EMPTY - Clean Production)
DROP TABLE IF EXISTS `contacts`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 13. users (ONLY 1 CLEAN SYSTEM ADMIN USER)
DROP TABLE IF EXISTS `users`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `branch_id`, `department_id`, `grade_id`, `designation_id`, `status`, `emp_code`) VALUES
(1,'System Admin','admin@iqraaittechnology.org','admin@123','ADMIN',1,1,1,1,'Active','ADMIN-001');

-- 14. opportunities (EMPTY - Clean Production)
DROP TABLE IF EXISTS `opportunities`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 15. opportunity_products (EMPTY - Clean Production)
DROP TABLE IF EXISTS `opportunity_products`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 16. quotations & quotation_items (EMPTY - Clean Production)
DROP TABLE IF EXISTS `quotations`;
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

DROP TABLE IF EXISTS `quotation_items`;
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

-- 17. visits (EMPTY - Clean Production)
DROP TABLE IF EXISTS `visits`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 18. visit_expenses (EMPTY - Clean Production)
DROP TABLE IF EXISTS `visit_expenses`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
