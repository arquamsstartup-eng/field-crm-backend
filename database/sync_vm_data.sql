-- ========================================================
-- FIELD CRM COMPLETE DATA PURGE & RESTORE SCRIPT FOR VM
-- Generated at: 2026-10-16T11:19:18.081Z
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Purge and restore table: branches (2 rows)
DELETE FROM `branches`;
ALTER TABLE `branches` AUTO_INCREMENT = 1;
INSERT INTO `branches` (`id`, `name`, `created_at`, `branch_code`, `city`, `manager_id`, `status`) VALUES (3, 'Mumbai HQ', '2026-09-27 23:00:50', 'BR-003', 'Mumbai', NULL, 'Active');
INSERT INTO `branches` (`id`, `name`, `created_at`, `branch_code`, `city`, `manager_id`, `status`) VALUES (4, 'Delhi Branch', '2026-09-27 17:30:57', 'BR-004', 'Delhi', NULL, 'Active');

-- Purge and restore table: departments (3 rows)
DELETE FROM `departments`;
ALTER TABLE `departments` AUTO_INCREMENT = 1;
INSERT INTO `departments` (`id`, `name`, `created_at`, `code`, `status`) VALUES (2, 'Sales', '2026-09-27 23:01:16', 'DEPT-002', 'Active');
INSERT INTO `departments` (`id`, `name`, `created_at`, `code`, `status`) VALUES (3, 'Service', '2026-09-27 17:31:24', 'DEPT-003', 'Active');
INSERT INTO `departments` (`id`, `name`, `created_at`, `code`, `status`) VALUES (4, 'Management', '2026-09-29 22:05:05', 'DEPT-004', 'Active');

-- Purge and restore table: designations (4 rows)
DELETE FROM `designations`;
ALTER TABLE `designations` AUTO_INCREMENT = 1;
INSERT INTO `designations` (`id`, `name`, `created_at`, `code`, `status`) VALUES (1, 'Sales Executive', '2026-09-27 23:01:47', 'DESG-001', 'Active');
INSERT INTO `designations` (`id`, `name`, `created_at`, `code`, `status`) VALUES (3, 'Service Engineer', '2026-09-27 17:32:18', 'DESG-003', 'Active');
INSERT INTO `designations` (`id`, `name`, `created_at`, `code`, `status`) VALUES (4, 'Branch Manager', '2026-09-29 22:09:20', 'DESG-004', 'Active');
INSERT INTO `designations` (`id`, `name`, `created_at`, `code`, `status`) VALUES (5, 'System Administrator', '2026-09-29 22:10:53', 'DESG-005', 'Active');

-- Purge and restore table: grade_fuel_rates (2 rows)
DELETE FROM `grade_fuel_rates`;
ALTER TABLE `grade_fuel_rates` AUTO_INCREMENT = 1;
INSERT INTO `grade_fuel_rates` (`id`, `name`, `created_at`, `rate_per_km`, `code`, `status`) VALUES (1, 'Grade A (Senior Mgmt / SUV)', '2026-09-27 23:03:47', '14.00', 'Grade A', 'Active');
INSERT INTO `grade_fuel_rates` (`id`, `name`, `created_at`, `rate_per_km`, `code`, `status`) VALUES (2, 'Grade B (Mid Executive / Sedan)', '2026-09-27 17:33:59', '11.50', 'Grade B', 'Active');

-- Purge and restore table: users (4 rows)
DELETE FROM `users`;
ALTER TABLE `users` AUTO_INCREMENT = 1;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `branch_id`, `department_id`, `grade_id`, `gender`, `dob`, `joining_date`, `mobile`, `designation_id`, `status`, `emp_code`) VALUES (1, 'Admin', 'admin@gmail.com', 'admin@123', 'ADMIN', '2026-09-23 22:03:18', 3, 4, 1, 'Male', '1899-11-27 18:38:50', '1899-11-27 18:38:50', '', 5, 'Active', 'EMP-001');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `branch_id`, `department_id`, `grade_id`, `gender`, `dob`, `joining_date`, `mobile`, `designation_id`, `status`, `emp_code`) VALUES (2, 'Alfahad', 'alfahad@gmail.com', 'admin', 'SALES_EXEC', '2026-09-24 22:03:20', 4, 2, 2, 'Male', '1899-11-25 18:38:50', '1899-11-25 18:38:50', '12345', 1, 'Active', 'EMP-002');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `branch_id`, `department_id`, `grade_id`, `gender`, `dob`, `joining_date`, `mobile`, `designation_id`, `status`, `emp_code`) VALUES (3, 'Saqlain', 'saqlain@gmail.com', 'admin', 'SERVICE_ENG', '2026-09-27 17:45:47', 3, 3, 2, 'Male', '1899-11-25 18:38:50', '1899-11-25 18:38:50', '', 3, 'Active', 'EMP-003');
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `branch_id`, `department_id`, `grade_id`, `gender`, `dob`, `joining_date`, `mobile`, `designation_id`, `status`, `emp_code`) VALUES (4, 'Noor', 'noor@gmail.com', 'admin', 'MANAGER', '2026-09-29 22:40:40', 4, 4, 2, 'Male', '1997-01-20 18:30:00', '2026-08-31 18:30:00', '987654321', 4, 'Active', 'EMP-004');

-- Purge and restore table: expense_heads (7 rows)
DELETE FROM `expense_heads`;
ALTER TABLE `expense_heads` AUTO_INCREMENT = 1;
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (1, 'EXP-FUEL', 'Fuel Allowance (Per KM)', 'No Bill', 'Yes (Fuel)', '11.50', 'Active', '2026-09-30 18:34:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (2, 'EXP-HOTEL', 'Hotel / Lodging Expense', 'Bill Required', 'No', '0.00', 'Active', '2026-09-30 13:04:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (3, 'EXP-FOOD', 'Daily Food / Meal Allowance', 'Bill Required', 'No', '0.00', 'Active', '2026-09-30 13:04:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (4, 'EXP-TOLL', 'Highway Toll & Parking', 'Bill Required', 'No', '0.00', 'Active', '2026-09-30 13:04:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (5, 'EXP-CLIENT-ENT', 'Client Entertainment / Refreshments', 'Bill Required', 'No', '0.00', 'Active', '2026-09-30 13:04:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (6, 'EXP-PUBLIC-TRANS', 'Public Transit (Cab/Bus/Train)', 'Bill Required', 'No', '0.00', 'Active', '2026-09-30 13:04:58');
INSERT INTO `expense_heads` (`id`, `code`, `name`, `receipt_required`, `requires_km`, `default_rate`, `status`, `created_at`) VALUES (7, 'EXP-MISC', 'Miscellaneous Contingency', 'No Bill', 'No', '0.00', 'Active', '2026-09-30 13:04:58');

-- Purge and restore table: activity_types (9 rows)
DELETE FROM `activity_types`;
ALTER TABLE `activity_types` AUTO_INCREMENT = 1;
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (1, 'ACT-001', 'Sales Pitch / Discovery', 'Sales', 'Initial client meeting and presentation', 'Active', '2026-09-30 11:24:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (2, 'ACT-002', 'Product Live Demonstration', 'Sales', 'Live cutting/bending demo', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (3, 'ACT-003', 'Payment & Proposal Follow-up', 'Sales', 'Commercial discussions', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (4, 'ACT-004', 'Commercial Negotiation & Closing', 'Sales', 'Final discount and terms discussion', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (5, 'ACT-005', 'Machine Commissioning & Installation', 'Service', 'On-site machinery erection and wiring', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (6, 'ACT-006', 'Routine Maintenance / AMC', 'Service', 'Preventive maintenance visit', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (7, 'ACT-007', 'Emergency Breakdown Service', 'Service', 'Urgent service call', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (8, 'ACT-008', 'Customer Operator Training', 'Service', 'Operating and safety training', 'Active', '2026-09-30 05:54:04');
INSERT INTO `activity_types` (`id`, `code`, `name`, `target_role`, `description`, `status`, `created_at`) VALUES (9, 'ACT-009', 'Customer Courtesy / Relationship', 'All Roles', 'General relationship visit', 'Active', '2026-09-30 05:54:04');

-- Purge and restore table: industries (3 rows)
DELETE FROM `industries`;
ALTER TABLE `industries` AUTO_INCREMENT = 1;
INSERT INTO `industries` (`id`, `code`, `name`, `status`, `created_at`) VALUES (1, 'IND-001', 'Automobile & Auto Components', 'Active', '2026-09-30 05:42:21');
INSERT INTO `industries` (`id`, `code`, `name`, `status`, `created_at`) VALUES (2, 'IND-002', 'Food Processing & Packaging', 'Active', '2026-09-30 00:12:32');
INSERT INTO `industries` (`id`, `code`, `name`, `status`, `created_at`) VALUES (3, 'IND-003', 'Industrial Machinery & Equipment', 'Active', '2026-09-30 00:12:46');

-- Purge and restore table: lead_sources (4 rows)
DELETE FROM `lead_sources`;
ALTER TABLE `lead_sources` AUTO_INCREMENT = 1;
INSERT INTO `lead_sources` (`id`, `code`, `name`, `status`, `created_at`) VALUES (1, 'LS-001', 'Direct Visit', 'Active', '2026-09-30 05:49:41');
INSERT INTO `lead_sources` (`id`, `code`, `name`, `status`, `created_at`) VALUES (2, 'LS-002', 'Reference', 'Active', '2026-09-30 00:19:53');
INSERT INTO `lead_sources` (`id`, `code`, `name`, `status`, `created_at`) VALUES (3, 'LS-003', 'Website', 'Active', '2026-09-30 00:20:01');
INSERT INTO `lead_sources` (`id`, `code`, `name`, `status`, `created_at`) VALUES (4, 'LS-004', 'LinkedIn', 'Active', '2026-09-30 00:20:17');

-- Purge and restore table: principals (8 rows)
DELETE FROM `principals`;
ALTER TABLE `principals` AUTO_INCREMENT = 1;
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (1, 'Amada', '2026-10-01 20:27:07', 'PRIN-001', 'Japan', 'Hiroshi Tanaka', 'htanaka@amada.example.com', '+81 463 96 1111', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (2, 'DMG Mori', '2026-10-01 14:57:07', 'PRIN-002', 'Germany / Japan', 'Stefan Weber', 'sweber@dmgmori.example.com', '+49 5205 74 0', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (3, 'Fanuc', '2026-10-01 14:57:07', 'PRIN-003', 'Japan', 'Takashi Watanabe', 'twatanabe@fanuc.example.com', '+81 555 84 5555', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (4, 'General Machinery', '2026-10-01 14:57:07', 'PRIN-004', 'India', 'Suresh Patel', 'spatel@generalmachinery.example.com', '+91 22 2580 1234', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (5, 'Haas Automation', '2026-10-01 14:57:07', 'PRIN-005', 'United States', 'Robert Miller', 'rmiller@haascnc.example.com', '+1 805 278 1800', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (6, 'Mazak', '2026-10-01 14:57:07', 'PRIN-006', 'Japan', 'Kenji Sato', 'ksato@mazak.example.com', '+81 587 95 5511', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (7, 'Mitsubishi Electric', '2026-10-01 14:57:07', 'PRIN-007', 'Japan', 'Daisuke Yamada', 'dyamada@mitsubishi.example.com', '+81 3 3218 2111', 'Active');
INSERT INTO `principals` (`id`, `name`, `created_at`, `code`, `country`, `contact_person`, `email`, `phone`, `status`) VALUES (8, 'Siemens', '2026-10-01 14:57:07', 'PRIN-008', 'Germany', 'Markus Schmidt', 'm.schmidt@siemens.example.com', '+49 89 636 00', 'Active');

-- Purge and restore table: products (8 rows)
DELETE FROM `products`;
ALTER TABLE `products` AUTO_INCREMENT = 1;
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (1, 'PRD-001', 'Hydraulic Press Brake 100T', 'Trumpf', 'Sales', 'Machinery', '3500000.00', 'Active', '2026-09-30 11:24:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (2, 'PRD-002', 'CNC Fiber Laser 3kW', 'Mazak', 'Sales', 'Machinery', '5800000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (3, 'PRD-003', 'CNC Turret Punch Press', 'Amada', 'Sales', 'Machinery', '4200000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (4, 'PRD-004', 'Hydraulic Shearing 6mm', 'Haas Automation', 'Sales', 'Machinery', '1800000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (5, 'PRD-005', 'CNC Laser Tube Cutting 2kW', 'DMG Mori', 'Sales', 'Machinery', '6500000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (6, 'PRD-006', 'Robotic Welding Cell 6-Axis', 'Fanuc', 'Sales', 'Automation', '2800000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (7, 'PRD-007', 'Fiber Laser Optics & Ceramic Ring Kit', 'Mazak', 'Service', 'Spare Parts', '45000.00', 'Active', '2026-09-30 05:54:04');
INSERT INTO `products` (`id`, `code`, `name`, `principal`, `target_role`, `category`, `unit_price`, `status`, `created_at`) VALUES (8, 'PRD-008', 'High-Pressure Hydraulic Seal & Valve Kit', 'Trumpf', 'Service', 'Spare Parts', '28000.00', 'Active', '2026-09-30 05:54:04');

-- Purge and restore table: customers (2 rows)
DELETE FROM `customers`;
ALTER TABLE `customers` AUTO_INCREMENT = 1;
INSERT INTO `customers` (`id`, `customer_code`, `name`, `customer_type`, `industry_id`, `lead_source_id`, `website`, `status`, `city`, `state`, `address`, `remarks`, `created_at`) VALUES (1, 'CUST-001', 'Inifinix', 'Prospect', 1, 3, 'www.infinix.com', 'Active', 'Mumbai', 'Maharashtra', '11 Lane Blossom Road ', 'no remark', '2026-09-30 06:17:34');
INSERT INTO `customers` (`id`, `customer_code`, `name`, `customer_type`, `industry_id`, `lead_source_id`, `website`, `status`, `city`, `state`, `address`, `remarks`, `created_at`) VALUES (2, 'CUST-002', 'A to Z Machines', 'Prospect', 3, 2, 'www.atozmachines.com', 'Active', '', '', '', '', '2026-09-30 04:51:21');

-- Purge and restore table: contacts (5 rows)
DELETE FROM `contacts`;
ALTER TABLE `contacts` AUTO_INCREMENT = 1;
INSERT INTO `contacts` (`id`, `contact_code`, `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `status`, `created_at`) VALUES (1, 'CONT-001', 1, 'Morco', 'HOI', '98765', 'mor@gmail.com', 1, 'Active', '2026-09-30 10:04:24');
INSERT INTO `contacts` (`id`, `contact_code`, `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `status`, `created_at`) VALUES (2, 'CONT-002', 1, 'George', 'CIO', '654321', 'georg@gmail.com', 0, 'Active', '2026-09-30 04:35:40');
INSERT INTO `contacts` (`id`, `contact_code`, `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `status`, `created_at`) VALUES (3, 'CONT-003', 2, 'Sabir', 'Head - Execution', '+11', '', 0, 'Active', '2026-09-30 04:51:21');
INSERT INTO `contacts` (`id`, `contact_code`, `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `status`, `created_at`) VALUES (4, 'CONT-004', 2, 'Arbaz', 'Ceo', '', 'arbaz@gmail.com', 1, 'Active', '2026-09-30 04:51:21');
INSERT INTO `contacts` (`id`, `contact_code`, `customer_id`, `name`, `designation`, `mobile`, `email`, `is_primary`, `status`, `created_at`) VALUES (5, 'CONT-005', 1, 'Franklin', 'CTO', '+2', '', 0, 'Active', '2026-09-30 04:57:34');

-- Purge and restore table: opportunities (4 rows)
DELETE FROM `opportunities`;
ALTER TABLE `opportunities` AUTO_INCREMENT = 1;
INSERT INTO `opportunities` (`id`, `opportunity_no`, `opportunity_name`, `customer_id`, `principal_name`, `contact_person_id`, `lead_source`, `assigned_salesperson_id`, `stage`, `estimated_value`, `lead_date`, `expected_closure_date`, `is_new_client`, `technical_requirements`, `competitor_brand`, `competitor_price`, `competitor_threat_level`, `competitor_strengths`, `competitor_weaknesses`, `win_loss_rationale`, `created_at`, `updated_at`) VALUES (1, 'OPP-001', 'Autoparts', 1, 'Fanuc', 1, 'Direct Visit', NULL, 'Won Deals', '2973600.00', '2026-09-30 18:30:00', NULL, 0, 'etcc', '', '0.00', 'Medium Threat - Active Evaluation by Client', '', '', '', '2026-10-01 22:27:49', '2026-10-15 20:39:38');
INSERT INTO `opportunities` (`id`, `opportunity_no`, `opportunity_name`, `customer_id`, `principal_name`, `contact_person_id`, `lead_source`, `assigned_salesperson_id`, `stage`, `estimated_value`, `lead_date`, `expected_closure_date`, `is_new_client`, `technical_requirements`, `competitor_brand`, `competitor_price`, `competitor_threat_level`, `competitor_strengths`, `competitor_weaknesses`, `win_loss_rationale`, `created_at`, `updated_at`) VALUES (2, 'OPP-002', 'Test', 2, 'Amada', 4, 'Website', 4, 'Lost Deals', '4200000.00', '2026-09-27 18:30:00', NULL, 0, '', 'BFW', '2500000.00', 'Medium Threat - Active Evaluation by Client', '', '', '10% lower price', '2026-10-01 16:57:59', '2026-10-15 23:02:13');
INSERT INTO `opportunities` (`id`, `opportunity_no`, `opportunity_name`, `customer_id`, `principal_name`, `contact_person_id`, `lead_source`, `assigned_salesperson_id`, `stage`, `estimated_value`, `lead_date`, `expected_closure_date`, `is_new_client`, `technical_requirements`, `competitor_brand`, `competitor_price`, `competitor_threat_level`, `competitor_strengths`, `competitor_weaknesses`, `win_loss_rationale`, `created_at`, `updated_at`) VALUES (30003, 'OPP-003', 'Motors', 2, 'Mitsubishi Electric', 4, 'Direct Visit', 3, 'Qualified', '2800000.00', '2026-10-11 18:30:00', NULL, 0, '', '', '0.00', 'Medium Threat - Active Evaluation by Client', '', '', '', '2026-10-14 15:22:30', '2026-10-15 23:00:55');
INSERT INTO `opportunities` (`id`, `opportunity_no`, `opportunity_name`, `customer_id`, `principal_name`, `contact_person_id`, `lead_source`, `assigned_salesperson_id`, `stage`, `estimated_value`, `lead_date`, `expected_closure_date`, `is_new_client`, `technical_requirements`, `competitor_brand`, `competitor_price`, `competitor_threat_level`, `competitor_strengths`, `competitor_weaknesses`, `win_loss_rationale`, `created_at`, `updated_at`) VALUES (90003, 'OPP-004', 'Cars Engine', 1, 'Haas Automation', 1, 'Website', 4, 'Proposal Sent', '1800000.00', '2026-10-11 18:30:00', NULL, 0, '', '', '0.00', 'Medium Threat - Active Evaluation by Client', '', '', '', '2026-10-15 23:03:58', '2026-10-15 23:05:09');

-- Purge and restore table: opportunity_products (4 rows)
DELETE FROM `opportunity_products`;
ALTER TABLE `opportunity_products` AUTO_INCREMENT = 1;
INSERT INTO `opportunity_products` (`id`, `opportunity_id`, `product_id`, `principal_name`, `quantity`, `unit_rate`, `line_total`) VALUES (1, 1, 1, 'Fanuc', 1, '2800000.00', '2800000.00');
INSERT INTO `opportunity_products` (`id`, `opportunity_id`, `product_id`, `principal_name`, `quantity`, `unit_rate`, `line_total`) VALUES (3, 2, 1, 'Amada', 1, '4200000.00', '4200000.00');
INSERT INTO `opportunity_products` (`id`, `opportunity_id`, `product_id`, `principal_name`, `quantity`, `unit_rate`, `line_total`) VALUES (90004, 30003, 1, 'Fanuc', 1, '2800000.00', '2800000.00');
INSERT INTO `opportunity_products` (`id`, `opportunity_id`, `product_id`, `principal_name`, `quantity`, `unit_rate`, `line_total`) VALUES (90009, 90003, 1, 'Haas Automation', 1, '1800000.00', '1800000.00');

-- Purge and restore table: quotations (8 rows)
DELETE FROM `quotations`;
ALTER TABLE `quotations` AUTO_INCREMENT = 1;
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (1, 'QT-001 (Rev 0)', 1, 1, 1, '2026-10-13 18:30:00', 30, 'REVISED', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '2520000.00', '280000.00', '453600.00', '2973600.00', '2026-10-14 17:44:58');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (2, 'QT-001 (Rev 1)', 1, 1, 1, '2026-10-11 18:30:00', 30, 'ACCEPTED', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '2520000.00', '280000.00', '453600.00', '2973600.00', '2026-10-14 12:15:04');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (3, 'QT-001 (Rev 2)', 1, 1, 1, '2026-10-11 18:30:00', 30, 'REVISED', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '2520000.00', '280000.00', '453600.00', '2973600.00', '2026-10-14 12:15:10');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (4, 'QT-001 (Rev 3)', 1, 1, 1, '2026-10-11 18:30:00', 30, 'ACCEPTED', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '2520000.00', '280000.00', '453600.00', '2973600.00', '2026-10-14 12:15:20');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (60002, 'QT-002 (Rev 0)', 2, 4, 2, '2026-10-12 18:30:00', 30, 'REJECTED', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '4200000.00', '0.00', '756000.00', '4956000.00', '2026-10-14 15:20:21');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (60003, 'QT-003 (Rev 0)', 1, 1, 1, '2026-10-12 18:30:00', 30, 'DRAFT', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '2800000.00', '0.00', '504000.00', '3304000.00', '2026-10-14 15:20:40');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (60004, 'QT-004 (Rev 0)', 1, 1, 1, '2026-10-12 18:30:00', 30, 'SENT', 'Thank you for your inquiry. We are pleased to quote as follows:', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '5600000.00', '0.00', '1008000.00', '6608000.00', '2026-10-14 15:21:13');
INSERT INTO `quotations` (`id`, `quote_no`, `customer_id`, `contact_id`, `opportunity_id`, `quote_date`, `validity_days`, `status`, `offer_notes`, `terms_conditions`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `created_at`) VALUES (120001, 'QT-005 (Rev 0)', 1, 1, 90003, '2026-10-14 18:30:00', 30, 'SENT', 'Auto-generated from Opportunity OPP-004: Cars Engine', '1. Price Basis: Ex-works manufacturing facility.\n2. Payment: 30% advance, balance against proforma before dispatch.\n3. Taxes: 18% GST Extra as applicable.\n4. Delivery: 4-6 weeks from PO.', '1800000.00', '0.00', '324000.00', '2124000.00', '2026-10-15 23:03:59');

-- Purge and restore table: quotation_items (8 rows)
DELETE FROM `quotation_items`;
ALTER TABLE `quotation_items` AUTO_INCREMENT = 1;
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (1, 1, 'Robotic Welding Cell 6-Axis', 1, '2800000.00', '10.00', '2800000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (30002, 3, 'Robotic Welding Cell 6-Axis', 1, '2800000.00', '10.00', '2520000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (30003, 4, 'Robotic Welding Cell 6-Axis', 1, '2800000.00', '10.00', '2520000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (60001, 60002, 'Hydraulic Press Brake 100T', 1, '4200000.00', '0.00', '4200000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (60002, 60003, 'Hydraulic Press Brake 100T', 1, '2800000.00', '0.00', '2800000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (60003, 60004, 'Hydraulic Press Brake 100T', 1, '2800000.00', '0.00', '2800000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (60004, 60004, 'Robotic Welding Cell 6-Axis', 1, '2800000.00', '0.00', '2800000.00');
INSERT INTO `quotation_items` (`id`, `quotation_id`, `product_name`, `qty`, `unit_rate`, `discount_percent`, `net_amount`) VALUES (120001, 120001, 'Hydraulic Shearing 6mm', 1, '1800000.00', '0.00', '1800000.00');

-- Purge and restore table: visits (4 rows)
DELETE FROM `visits`;
ALTER TABLE `visits` AUTO_INCREMENT = 1;
INSERT INTO `visits` (`id`, `visit_code`, `emp_id`, `customer_id`, `contact_id`, `activity_type_id`, `principal_id`, `visit_date`, `start_time`, `end_time`, `person_count`, `place_from`, `place_to`, `sales_report_text`, `sales_report_file`, `total_claim_amount`, `status`, `created_at`, `updated_at`, `report_file`, `opportunity_id`) VALUES (1, 'VST-001', 1, 2, 3, 8, 7, '2026-09-29 18:30:00', '00:19:00', '23:20:00', 2, 'mumbbai', 'banglore', 'etccc', NULL, '189.00', 'Approved', '2026-09-30 18:50:46', '2026-10-15 23:23:48', NULL, NULL);
INSERT INTO `visits` (`id`, `visit_code`, `emp_id`, `customer_id`, `contact_id`, `activity_type_id`, `principal_id`, `visit_date`, `start_time`, `end_time`, `person_count`, `place_from`, `place_to`, `sales_report_text`, `sales_report_file`, `total_claim_amount`, `status`, `created_at`, `updated_at`, `report_file`, `opportunity_id`) VALUES (2, 'VST-002', 1, 2, 4, 6, NULL, '2026-10-09 18:30:00', '00:00:10', '00:00:06', 1, 'Mumbai', 'Thane', 'Etc...', NULL, '0.00', 'Rejected', '2026-10-11 08:09:50', '2026-10-15 23:23:30', NULL, NULL);
INSERT INTO `visits` (`id`, `visit_code`, `emp_id`, `customer_id`, `contact_id`, `activity_type_id`, `principal_id`, `visit_date`, `start_time`, `end_time`, `person_count`, `place_from`, `place_to`, `sales_report_text`, `sales_report_file`, `total_claim_amount`, `status`, `created_at`, `updated_at`, `report_file`, `opportunity_id`) VALUES (30003, 'VST-003', 4, 1, 1, 8, NULL, '2026-10-10 18:30:00', '00:00:09', '00:00:17', 1, NULL, NULL, '[SERVICE VISIT]\r\nMachine: test (S/N: test)\r\nProblem: test\r\nAction Taken: test\r\n\r\nAdditional Notes: None', NULL, '266.00', 'Submitted', '2026-10-12 13:15:49', '2026-10-12 13:15:49', NULL, NULL);
INSERT INTO `visits` (`id`, `visit_code`, `emp_id`, `customer_id`, `contact_id`, `activity_type_id`, `principal_id`, `visit_date`, `start_time`, `end_time`, `person_count`, `place_from`, `place_to`, `sales_report_text`, `sales_report_file`, `total_claim_amount`, `status`, `created_at`, `updated_at`, `report_file`, `opportunity_id`) VALUES (90003, 'VST-004', 2, 1, 5, 5, 7, '2026-10-14 18:30:00', '11:40:00', '16:40:00', 2, 'mumbai', 'thane', '', NULL, '532.00', 'Submitted', '2026-10-16 00:12:08', '2026-10-16 00:12:08', NULL, NULL);

-- Purge and restore table: visit_expenses (5 rows)
DELETE FROM `visit_expenses`;
ALTER TABLE `visit_expenses` AUTO_INCREMENT = 1;
INSERT INTO `visit_expenses` (`id`, `visit_id`, `expense_head_id`, `start_km`, `end_km`, `total_km`, `fuel_rate`, `toll_tax`, `amount`, `remarks`, `receipt_file`, `created_at`) VALUES (1, 1, 1, 1, 10, 9, '14.00', '20.00', '146.00', '', NULL, '2026-09-30 18:50:46');
INSERT INTO `visit_expenses` (`id`, `visit_id`, `expense_head_id`, `start_km`, `end_km`, `total_km`, `fuel_rate`, `toll_tax`, `amount`, `remarks`, `receipt_file`, `created_at`) VALUES (2, 1, 6, 0, 0, 0, '14.00', '0.00', '43.00', '', NULL, '2026-09-30 13:20:46');
INSERT INTO `visit_expenses` (`id`, `visit_id`, `expense_head_id`, `start_km`, `end_km`, `total_km`, `fuel_rate`, `toll_tax`, `amount`, `remarks`, `receipt_file`, `created_at`) VALUES (30003, 30003, 1, 1, 20, 19, '14.00', '0.00', '266.00', '', NULL, '2026-10-12 13:15:49');
INSERT INTO `visit_expenses` (`id`, `visit_id`, `expense_head_id`, `start_km`, `end_km`, `total_km`, `fuel_rate`, `toll_tax`, `amount`, `remarks`, `receipt_file`, `created_at`) VALUES (90003, 90003, 3, 0, 0, 0, '14.00', '0.00', '300.00', '', NULL, '2026-10-16 00:12:08');
INSERT INTO `visit_expenses` (`id`, `visit_id`, `expense_head_id`, `start_km`, `end_km`, `total_km`, `fuel_rate`, `toll_tax`, `amount`, `remarks`, `receipt_file`, `created_at`) VALUES (90004, 90003, 1, 29, 42, 13, '14.00', '50.00', '232.00', '', NULL, '2026-10-16 00:12:08');

SET FOREIGN_KEY_CHECKS = 1;
