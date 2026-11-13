-- ========================================================
-- FIELD CRM: POSTGRESQL SCHEMA DDL
-- Generated for PostgreSQL 14+ / 16+ / 18+
-- ========================================================

-- Trigger function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. branches
DROP TABLE IF EXISTS branches CASCADE;
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    branch_code VARCHAR(50) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    manager_id INTEGER DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 2. departments
DROP TABLE IF EXISTS departments CASCADE;
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    code VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 3. designations
DROP TABLE IF EXISTS designations CASCADE;
CREATE TABLE designations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    code VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 4. grade_fuel_rates
DROP TABLE IF EXISTS grade_fuel_rates CASCADE;
CREATE TABLE grade_fuel_rates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rate_per_km NUMERIC(10,2) DEFAULT NULL,
    code VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 5. users
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'SALES_EXEC',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    branch_id INTEGER DEFAULT NULL REFERENCES branches(id) ON DELETE SET NULL,
    department_id INTEGER DEFAULT NULL REFERENCES departments(id) ON DELETE SET NULL,
    grade_id INTEGER DEFAULT NULL REFERENCES grade_fuel_rates(id) ON DELETE SET NULL,
    gender VARCHAR(10) DEFAULT NULL,
    dob DATE DEFAULT NULL,
    joining_date DATE DEFAULT NULL,
    mobile VARCHAR(20) DEFAULT NULL,
    designation_id INTEGER DEFAULT NULL REFERENCES designations(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active',
    emp_code VARCHAR(50) DEFAULT NULL
);

-- 6. expense_heads
DROP TABLE IF EXISTS expense_heads CASCADE;
CREATE TABLE expense_heads (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    receipt_required VARCHAR(50) DEFAULT 'No Bill',
    requires_km VARCHAR(50) DEFAULT 'No',
    default_rate NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. activity_types
DROP TABLE IF EXISTS activity_types CASCADE;
CREATE TABLE activity_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) DEFAULT NULL,
    name VARCHAR(150) NOT NULL,
    target_role VARCHAR(50) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. industries
DROP TABLE IF EXISTS industries CASCADE;
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. lead_sources
DROP TABLE IF EXISTS lead_sources CASCADE;
CREATE TABLE lead_sources (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. principals
DROP TABLE IF EXISTS principals CASCADE;
CREATE TABLE principals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    code VARCHAR(50) UNIQUE DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    contact_person VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 11. products
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) DEFAULT NULL,
    name VARCHAR(150) NOT NULL,
    principal VARCHAR(100) DEFAULT NULL,
    target_role VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT NULL,
    unit_price NUMERIC(12,2) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. customers
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'Prospect',
    industry_id INTEGER DEFAULT NULL REFERENCES industries(id) ON DELETE SET NULL,
    lead_source_id INTEGER DEFAULT NULL REFERENCES lead_sources(id) ON DELETE SET NULL,
    website VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. contacts
DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    contact_code VARCHAR(50) UNIQUE DEFAULT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) DEFAULT NULL,
    mobile VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    is_primary SMALLINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. opportunities
DROP TABLE IF EXISTS opportunities CASCADE;
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    opportunity_no VARCHAR(50) UNIQUE DEFAULT NULL,
    opportunity_name VARCHAR(255) DEFAULT NULL,
    customer_id INTEGER DEFAULT NULL REFERENCES customers(id) ON DELETE SET NULL,
    principal_name VARCHAR(255) DEFAULT NULL,
    contact_person_id INTEGER DEFAULT NULL,
    lead_source VARCHAR(100) DEFAULT NULL,
    assigned_salesperson_id INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
    stage VARCHAR(100) DEFAULT 'New Leads',
    estimated_value NUMERIC(15,2) DEFAULT 0.00,
    lead_date DATE DEFAULT NULL,
    expected_closure_date DATE DEFAULT NULL,
    is_new_client SMALLINT DEFAULT 0,
    technical_requirements TEXT DEFAULT NULL,
    competitor_brand VARCHAR(255) DEFAULT NULL,
    competitor_price NUMERIC(15,2) DEFAULT NULL,
    competitor_threat_level VARCHAR(100) DEFAULT NULL,
    competitor_strengths TEXT DEFAULT NULL,
    competitor_weaknesses TEXT DEFAULT NULL,
    win_loss_rationale TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_opportunities_modtime
BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 15. opportunity_products
DROP TABLE IF EXISTS opportunity_products CASCADE;
CREATE TABLE opportunity_products (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER DEFAULT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    product_id INTEGER DEFAULT NULL,
    principal_name VARCHAR(255) DEFAULT NULL,
    quantity INTEGER DEFAULT 1,
    unit_rate NUMERIC(15,2) DEFAULT NULL,
    line_total NUMERIC(15,2) DEFAULT NULL
);

-- 16. quotations
DROP TABLE IF EXISTS quotations CASCADE;
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quote_no VARCHAR(255) UNIQUE DEFAULT NULL,
    customer_id INTEGER DEFAULT NULL REFERENCES customers(id) ON DELETE SET NULL,
    contact_id INTEGER DEFAULT NULL,
    opportunity_id INTEGER DEFAULT NULL REFERENCES opportunities(id) ON DELETE SET NULL,
    quote_date DATE DEFAULT NULL,
    validity_days INTEGER DEFAULT 30,
    status VARCHAR(50) DEFAULT 'DRAFT',
    offer_notes TEXT DEFAULT NULL,
    terms_conditions TEXT DEFAULT NULL,
    subtotal NUMERIC(15,2) DEFAULT 0.00,
    discount_amount NUMERIC(15,2) DEFAULT 0.00,
    tax_amount NUMERIC(15,2) DEFAULT 0.00,
    grand_total NUMERIC(15,2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. quotation_items
DROP TABLE IF EXISTS quotation_items CASCADE;
CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER DEFAULT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_name VARCHAR(255) DEFAULT NULL,
    qty INTEGER DEFAULT 1,
    unit_rate NUMERIC(15,2) DEFAULT 0.00,
    discount_percent NUMERIC(5,2) DEFAULT 0.00,
    net_amount NUMERIC(15,2) DEFAULT 0.00
);

-- 18. visits
DROP TABLE IF EXISTS visits CASCADE;
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    visit_code VARCHAR(50) UNIQUE DEFAULT NULL,
    emp_id INTEGER NOT NULL REFERENCES users(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    contact_id INTEGER DEFAULT NULL,
    activity_type_id INTEGER DEFAULT NULL,
    principal_id INTEGER DEFAULT NULL,
    visit_date DATE NOT NULL,
    start_time TIME DEFAULT NULL,
    end_time TIME DEFAULT NULL,
    person_count INTEGER DEFAULT 1,
    place_from VARCHAR(150) DEFAULT NULL,
    place_to VARCHAR(150) DEFAULT NULL,
    sales_report_text TEXT DEFAULT NULL,
    sales_report_file VARCHAR(255) DEFAULT NULL,
    total_claim_amount NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_file VARCHAR(255) DEFAULT NULL,
    opportunity_id INTEGER DEFAULT NULL REFERENCES opportunities(id) ON DELETE SET NULL
);

CREATE TRIGGER update_visits_modtime
BEFORE UPDATE ON visits
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 19. visit_expenses
DROP TABLE IF EXISTS visit_expenses CASCADE;
CREATE TABLE visit_expenses (
    id SERIAL PRIMARY KEY,
    visit_id INTEGER NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    expense_head_id INTEGER NOT NULL REFERENCES expense_heads(id),
    start_km INTEGER DEFAULT 0,
    end_km INTEGER DEFAULT 0,
    total_km INTEGER DEFAULT 0,
    fuel_rate NUMERIC(10,2) DEFAULT 0.00,
    toll_tax NUMERIC(10,2) DEFAULT 0.00,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    remarks VARCHAR(255) DEFAULT NULL,
    receipt_file VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
