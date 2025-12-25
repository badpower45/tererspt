# AddValues Solar ERP - Database Schema

## Overview
This document describes the complete database schema for the AddValues Solar ERP system. The design uses a polymorphic approach for products and supports multi-branch operations.

## Core Tables

### 1. Products Table
Stores all product types using a polymorphic design with JSONB specifications.

```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}',
  cost_price DECIMAL(10, 2) NOT NULL,
  sell_price DECIMAL(10, 2) NOT NULL,
  min_sell_price DECIMAL(10, 2) NOT NULL,
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_category CHECK (category IN (
    'factory1_chassis',
    'factory1_panel',
    'factory2_cable_dc',
    'factory2_cable_ac',
    'import_solar_panel',
    'partner_inverter'
  )),
  
  CONSTRAINT chk_unit CHECK (unit IN ('ton', 'piece', 'meter', 'roll')),
  CONSTRAINT chk_prices CHECK (sell_price >= min_sell_price AND min_sell_price >= cost_price)
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_specs ON products USING GIN(specifications);
```

**Category-Specific Specifications:**
- **factory1_chassis**: dimensions, material, weight_kg
- **factory1_panel**: dimensions, material, circuits
- **factory2_cable_dc**: type, size_mm, material, voltage_rating
- **factory2_cable_ac**: type, size_mm, material, voltage_rating
- **import_solar_panel**: wattage, efficiency, dimensions, origin, serial_prefix
- **partner_inverter**: type, power_kw, efficiency, warranty_years

### 2. Branches Table
Manages all company branches including headquarters.

```sql
CREATE TABLE branches (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_hq BOOLEAN DEFAULT FALSE,
  manager_name VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_one_hq UNIQUE (is_hq) WHERE is_hq = TRUE
);

-- Indexes
CREATE INDEX idx_branches_is_hq ON branches(is_hq);
```

### 3. Inventory Table
Tracks stock levels for each product at each branch.

```sql
CREATE TABLE inventory (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  branch_id VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  local_price DECIMAL(10, 2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
  CONSTRAINT uq_inventory_product_branch UNIQUE (product_id, branch_id),
  CONSTRAINT chk_quantity CHECK (quantity >= 0)
);

-- Indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity, min_stock_level) 
  WHERE quantity <= min_stock_level;
```

### 4. Sales Table
Records all sales transactions.

```sql
CREATE TABLE sales (
  id VARCHAR(50) PRIMARY KEY,
  branch_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_tier VARCHAR(20) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  discount DECIMAL(10, 2),
  notes TEXT,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  CONSTRAINT chk_customer_tier CHECK (customer_tier IN ('standard', 'permanent', 'supplier')),
  CONSTRAINT chk_status CHECK (status IN ('pending', 'delivered', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_sales_branch ON sales(branch_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_customer_tier ON sales(customer_tier);
```

### 5. Sale Items Table
Details of items in each sale.

```sql
CREATE TABLE sale_items (
  id VARCHAR(50) PRIMARY KEY,
  sale_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  price_override BOOLEAN DEFAULT FALSE,
  
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0)
);

-- Indexes
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

### 6. Partners Table
Manages partner companies.

```sql
CREATE TABLE partners (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_partners_name ON partners(name);
```

### 7. Partner Products Table
Links partners to their products.

```sql
CREATE TABLE partner_products (
  id VARCHAR(50) PRIMARY KEY,
  partner_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  partner_price DECIMAL(10, 2) NOT NULL,
  specifications JSONB,
  
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT uq_partner_product UNIQUE (partner_id, product_id)
);

-- Indexes
CREATE INDEX idx_partner_products_partner ON partner_products(partner_id);
CREATE INDEX idx_partner_products_product ON partner_products(product_id);
```

### 8. Barter Transactions Table
Records exchange transactions with partners.

```sql
CREATE TABLE barter_transactions (
  id VARCHAR(50) PRIMARY KEY,
  partner_id VARCHAR(50) NOT NULL,
  settlement_balance DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (partner_id) REFERENCES partners(id)
);

-- Indexes
CREATE INDEX idx_barter_partner ON barter_transactions(partner_id);
CREATE INDEX idx_barter_created_at ON barter_transactions(created_at);
```

### 9. Barter Items Table
Details of items in barter transactions.

```sql
CREATE TABLE barter_items (
  id VARCHAR(50) PRIMARY KEY,
  barter_transaction_id VARCHAR(50) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  cost_value DECIMAL(10, 2) NOT NULL,
  sell_value DECIMAL(10, 2) NOT NULL,
  
  FOREIGN KEY (barter_transaction_id) REFERENCES barter_transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_direction CHECK (direction IN ('given', 'received'))
);

-- Indexes
CREATE INDEX idx_barter_items_transaction ON barter_items(barter_transaction_id);
```

### 10. Installations Table
Tracks installation projects.

```sql
CREATE TABLE installations (
  id VARCHAR(50) PRIMARY KEY,
  branch_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_contact VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  labor_cost DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  scheduled_date TIMESTAMP NOT NULL,
  completed_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  CONSTRAINT chk_installation_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_installations_branch ON installations(branch_id);
CREATE INDEX idx_installations_status ON installations(status);
CREATE INDEX idx_installations_scheduled_date ON installations(scheduled_date);
```

### 11. Installation Items Table
Materials used in installations.

```sql
CREATE TABLE installation_items (
  id VARCHAR(50) PRIMARY KEY,
  installation_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  
  FOREIGN KEY (installation_id) REFERENCES installations(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_installation_items_installation ON installation_items(installation_id);
```

### 12. Shortage Requests Table
Manages stock requests between branches.

```sql
CREATE TABLE shortage_requests (
  id VARCHAR(50) PRIMARY KEY,
  branch_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity_requested INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'requested',
  notes TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  shipped_at TIMESTAMP,
  received_at TIMESTAMP,
  
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT chk_shortage_status CHECK (status IN ('requested', 'approved', 'shipped', 'received', 'rejected'))
);

-- Indexes
CREATE INDEX idx_shortage_branch ON shortage_requests(branch_id);
CREATE INDEX idx_shortage_product ON shortage_requests(product_id);
CREATE INDEX idx_shortage_status ON shortage_requests(status);
```

### 13. Price Override Log Table
Audit trail for price overrides.

```sql
CREATE TABLE price_override_log (
  id VARCHAR(50) PRIMARY KEY,
  sale_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  override_price DECIMAL(10, 2) NOT NULL,
  authorized_by VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_price_override_sale ON price_override_log(sale_id);
CREATE INDEX idx_price_override_authorized_by ON price_override_log(authorized_by);
CREATE INDEX idx_price_override_created_at ON price_override_log(created_at);
```

### 14. Users Table (Future Implementation)
User authentication and authorization.

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  branch_id VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  CONSTRAINT chk_role CHECK (role IN ('admin', 'manager', 'sales', 'inventory', 'viewer'))
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## Relationships Diagram

```
┌──────────────┐
│   branches   │
└──────┬───────┘
       │
       │ 1:N
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐   ┌──────────────┐
│  inventory   │   │    sales     │
└──────┬───────┘   └──────┬───────┘
       │                  │
       │                  │ 1:N
       │                  ▼
       │           ┌──────────────┐
       │           │  sale_items  │
       │           └──────┬───────┘
       │                  │
       │                  │
       ▼                  ▼
┌──────────────┐   ┌──────────────────┐
│   products   │◄──┤ price_override_  │
└──────┬───────┘   │      log         │
       │           └──────────────────┘
       │
       │ N:M
       ▼
┌──────────────┐
│   partners   │
└──────┬───────┘
       │ 1:N
       ▼
┌──────────────────┐
│ partner_products │
└──────────────────┘
```

## Data Integrity Rules

1. **Cascading Deletes**:
   - Deleting a product cascades to inventory, sale_items, and installation_items
   - Deleting a branch cascades to its inventory and sales
   - Deleting a sale cascades to sale_items

2. **Constraints**:
   - Only one branch can be marked as HQ
   - Sell price must be >= min_sell_price >= cost_price
   - Stock quantity cannot be negative
   - Unique constraint on (product_id, branch_id) in inventory

3. **Triggers** (Future Implementation):
   - Auto-update inventory when sale is delivered
   - Auto-create shortage request when inventory falls below minimum
   - Auto-log price overrides

## Indexes Strategy

- **Primary Keys**: Automatic unique indexes
- **Foreign Keys**: Indexed for join performance
- **Search Columns**: Indexed (category, brand, status, etc.)
- **Date Columns**: Indexed for time-based queries
- **JSONB Columns**: GIN indexes for specification searches

## Sample Queries

### Get Low Stock Items
```sql
SELECT p.name, i.quantity, i.min_stock_level, b.name as branch_name
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN branches b ON i.branch_id = b.id
WHERE i.quantity <= i.min_stock_level;
```

### Calculate Branch Sales Performance
```sql
SELECT b.name, COUNT(s.id) as total_sales, SUM(s.total_amount) as revenue
FROM branches b
LEFT JOIN sales s ON b.id = s.branch_id
WHERE s.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY b.id, b.name
ORDER BY revenue DESC;
```

### Find Products by Specifications
```sql
SELECT * FROM products
WHERE specifications @> '{"wattage": 550}';
```

## Migration Strategy

For production deployment with real backend:

1. **Phase 1**: Create all tables and indexes
2. **Phase 2**: Migrate mock data from localStorage
3. **Phase 3**: Set up triggers and stored procedures
4. **Phase 4**: Implement full-text search
5. **Phase 5**: Add materialized views for reporting

---

**Note**: This schema is designed for PostgreSQL with Drizzle ORM. Adjust data types and constraints as needed for your specific database system.
