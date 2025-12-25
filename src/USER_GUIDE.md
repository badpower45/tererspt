# AddValues Solar ERP - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Products Management](#products-management)
4. [Inventory Management](#inventory-management)
5. [Sales Management](#sales-management)
6. [Partners Management](#partners-management)
7. [Barter System](#barter-system)
8. [Installations](#installations)
9. [Branch Management](#branch-management)
10. [Settings](#settings)

---

## Getting Started

### System Access
1. Open the application in your web browser
2. The system will automatically load with the Dashboard view
3. Use the sidebar (desktop) or bottom navigation (mobile) to navigate

### Navigation
- **Desktop**: Click items in the left sidebar
- **Mobile**: Use the bottom navigation bar for quick access to main modules
- **Collapse Sidebar**: Click the arrow icon to expand/collapse the sidebar for more workspace

---

## Dashboard

The Dashboard provides a real-time overview of your business operations.

### Key Metrics Cards
1. **Total Inventory Value**: Combined value of all stock across branches
2. **Sales This Month**: Total revenue for the current month
3. **Active Installations**: Projects that are scheduled or in progress
4. **Low Stock Items**: Products below minimum stock level
5. **Pending Shortage Requests**: Requests from branches awaiting approval
6. **Installation Revenue**: Revenue from installation services

### Recent Sales
View the latest 5 sales transactions with:
- Customer name
- Number of items
- Total amount
- Status (Pending/Delivered)

### Low Stock Alerts
Monitor products that need reordering:
- Product name
- Current quantity
- Minimum required quantity
- Branch location

### Quick Actions
Shortcut buttons for common tasks:
- Add Product
- New Sale
- Schedule Installation
- View Branches

---

## Products Management

Manage all products across factories, imports, and partners.

### Product Categories

#### Factory 1 Products
- **Chassis**: Shafa, Ahmed Ramadan, Scissors
  - Specifications: Dimensions, Material, Weight
- **Electric Panels**: Various sizes
  - Specifications: Dimensions, Material, Circuit count

#### Factory 2 Products
- **DC Cables**: Copper/Aluminum
  - Specifications: Size (mm), Material, Voltage rating
- **AC Cables**: Copper/Aluminum
  - Specifications: Size (mm), Material, Voltage rating

#### Imported Products
- **Solar Panels**: Jinko, Longi, Astrolongy, Ulka, Risen
  - Specifications: Wattage, Efficiency, Origin, Serial number

#### Partner Products
- **Inverters**: Various brands and capacities
  - Specifications: Type (Hybrid/On-Grid), Power (kW), Efficiency, Warranty

### Adding a New Product

1. Click **"Add Product"** button
2. Fill in Basic Information:
   - Product Name
   - Category (select appropriate type)
   - Unit of measurement
   - Brand (optional)

3. Set Pricing:
   - **Cost Price**: Your actual cost
   - **Sell Price**: Standard selling price
   - **Min Sell Price**: Minimum allowed price (guardrail)

4. Add Specifications:
   - Click "Add Specification"
   - Enter name and value pairs
   - Examples: "wattage: 550W", "efficiency: 21.2%"

5. Click **"Add Product"** to save

### Editing Products
1. Find the product in the list
2. Click the edit icon (pencil)
3. Modify fields as needed
4. Save changes

### Product Search & Filtering
- **Search**: Type product name or brand
- **Category Filter**: Select specific category to view
- View products in card layout with all details

### Understanding Pricing
- **Cost Price**: What you pay
- **Sell Price**: What you charge
- **Min Sell Price**: Absolute minimum (requires authorization to go lower)
- **Profit Margin**: Automatically calculated percentage

---

## Inventory Management

Track stock levels across all branches in real-time.

### Viewing Inventory

#### Filter Options
1. **Search**: Find products by name
2. **Branch Filter**: View specific branch or all branches
3. **Status**: See low stock items highlighted in red

#### Inventory Table Columns
- **Product**: Name and brand
- **Branch**: Location of stock
- **Quantity**: Current stock level
- **Min Level**: Minimum required quantity
- **Value**: Total value of stock (quantity × cost price)
- **Status**: Health indicator (Low Stock/Healthy)

### Understanding Stock Levels

#### Status Indicators
- 🟢 **Healthy**: Quantity > Minimum level
- 🔴 **Low Stock**: Quantity ≤ Minimum level (action required)

#### Stock Alerts
The system automatically generates alerts when:
- Stock reaches minimum level
- Stock falls below minimum level
- You can view these in the Dashboard

### Branch-Specific Inventory
Each branch maintains its own inventory with:
- Local stock quantities
- Local pricing overrides (if permitted)
- Minimum stock levels per product

---

## Sales Management

Record and track all sales transactions.

### Creating a New Sale

1. Click **"New Sale"** button
2. Enter Customer Information:
   - Customer Name
   - Customer Tier (Standard/Permanent/Supplier)
3. Select Branch
4. Add Products:
   - Search and select products
   - Enter quantities
   - System shows available stock
5. Review Pricing:
   - System applies tier-specific pricing
   - Shows total per item and grand total
6. Apply Discount (optional)
7. Add Notes (optional)
8. Save Sale

### Customer Tiers

#### Standard Customer
- Default pricing
- No special discounts
- Cannot purchase below minimum price

#### Permanent Customer
- Long-term relationship
- May receive volume discounts
- Preferential pricing on select items

#### Supplier Customer
- Special pricing tier
- Negotiated rates
- Bulk purchase benefits

### Price Override Process

If you need to sell below minimum price:
1. Attempt to set price below minimum
2. System prompts for authorization
3. Manager/Admin must approve
4. Enter reason for override
5. Transaction is logged for audit

### Sale Status

#### Pending
- Order received but not yet delivered
- Inventory not yet reduced
- Can be modified or cancelled

#### Delivered
- Order completed and delivered
- Inventory automatically reduced
- Cannot be modified
- Contributes to sales statistics

#### Cancelled
- Order was cancelled
- No inventory impact
- Kept for records

### Viewing Sales History
- **Filter by Branch**: See sales per location
- **Filter by Status**: View pending vs delivered
- **Filter by Date**: Time-based reports
- **Customer Search**: Find sales by customer name

---

## Partners Management

Manage relationships with partner companies and their products.

### Partner Information
- Company Name
- Contact Person
- Email & Phone
- Product Catalog

### Adding a Partner
1. Click **"Add Partner"**
2. Enter company details
3. Add contact information
4. Save partner

### Partner Products
Each partner can supply multiple products with:
- Partner-specific pricing
- Product specifications
- Availability status

### Product Comparison Tool

Compare products from different partners:
1. Click **"Open Comparison Tool"**
2. Select product category
3. View side-by-side comparison:
   - Specifications
   - Pricing
   - Partner information
   - Warranty terms
4. Make informed purchasing decisions

---

## Barter System

Unique feature for exchanging products with partners without monetary transactions.

### Understanding Barter

A barter transaction involves:
- **Items Given**: Products you provide to partner
- **Items Received**: Products you receive from partner
- **Valuation**: Based on cost price and estimated sell value
- **Settlement**: Net difference calculation

### Creating a Barter Transaction

1. Click **"New Exchange"**
2. Select Partner
3. Add Items Given:
   - Select products from your inventory
   - Enter quantities
   - System calculates cost value
4. Add Items Received:
   - Enter products received from partner
   - Enter quantities
   - Enter estimated values
5. Review Settlement Balance:
   - Positive: Partner owes you
   - Negative: You owe partner
   - Zero: Even exchange
6. Add notes and save

### Tracking Barter History
- View all exchange transactions
- Filter by partner
- See settlement balances
- Track value exchanged over time

---

## Installations

Manage solar installation projects from scheduling to completion.

### Installation Workflow

```
Scheduled → In Progress → Completed
```

### Creating Installation Project

1. Click **"New Installation"**
2. Enter Customer Information:
   - Name
   - Contact
   - Location
3. Select Branch handling installation
4. Schedule Date
5. Add Materials:
   - Solar panels
   - Inverters
   - Chassis
   - Cables
   - Other components
6. Enter Labor Cost
7. System calculates Total Cost
8. Add notes and save

### Material Management
- Materials are automatically deducted from branch inventory
- Stock availability is checked in real-time
- Low stock alerts if materials insufficient

### Installation Status

#### Scheduled
- Project planned for future date
- Materials reserved
- Awaiting start

#### In Progress
- Installation currently being performed
- Materials consumed from inventory
- Team on site

#### Completed
- Project finished
- Customer satisfied
- Invoice generated
- Inventory updated

#### Cancelled
- Project cancelled before completion
- Materials returned to inventory
- Notes explain cancellation reason

### Installation Reports
- Filter by status
- Filter by branch
- View revenue from installations
- Track project completion rates

---

## Branch Management

Monitor and manage all branch operations.

### Branch Overview
The system supports:
- **1 Headquarters (HQ)**: Central administration
- **5 Sales Branches**: Regional operations

### Viewing Branch Details

Click on any branch to see:
1. **Branch Information**:
   - Location
   - Manager name
   - Contact details
2. **Performance Metrics**:
   - Total sales
   - Inventory value
   - Stock items count
   - Pending requests
3. **Branch Inventory**:
   - All products at this branch
   - Quantities and status
   - Low stock items

### Shortage Request System

When a branch runs low on stock:

#### From Branch Perspective:
1. Identify low stock items
2. Create shortage request
3. Specify quantity needed
4. Add urgency notes
5. Submit to HQ

#### From HQ Perspective:
1. View pending requests
2. Check HQ inventory availability
3. Approve/Reject request
4. Arrange shipment
5. Track delivery

#### Request Status Flow:
```
Requested → Approved → Shipped → Received
```

### Branch Pricing Override

Branches can set local prices within limits:
- Must stay within min/max bounds set by HQ
- Override logged for audit
- Regional pricing flexibility

---

## Settings

### User Profile
- Update name and email
- Change role (Admin/Manager/Sales/Inventory)
- Update contact information

### Notifications
Configure alerts for:
- **Low Stock Alerts**: When products reach minimum level
- **Sale Notifications**: New sales created
- **Shortage Requests**: Branch requests stock
- **Installation Updates**: Status changes on projects

### Security
- Change password regularly
- Two-factor authentication (future)
- Session management

### System Preferences
- **Currency**: EGP (Egyptian Pound)
- **Date Format**: DD/MM/YYYY or MM/DD/YYYY
- **Language**: English or العربية
- **Time Zone**: Cairo (GMT+2)

### Data Management
- **Export Data**: Download reports and backups
- **Import Data**: Bulk upload products or inventory
- **Backup System**: Regular automated backups

---

## Best Practices

### Daily Operations
1. Check Dashboard every morning
2. Review low stock alerts
3. Process pending sales
4. Update installation status
5. Approve shortage requests

### Weekly Tasks
1. Review inventory levels across branches
2. Analyze sales performance
3. Contact partners for restocking
4. Plan installations for next week
5. Generate weekly reports

### Monthly Tasks
1. Full inventory audit
2. Review pricing strategy
3. Analyze profit margins
4. Partner performance review
5. Staff training updates

---

## Troubleshooting

### Common Issues

#### Problem: Can't find a product
**Solution**: 
- Check category filter
- Try broader search terms
- Verify product was added

#### Problem: Low stock alert not showing
**Solution**:
- Check notification settings
- Verify minimum stock levels set correctly
- Refresh Dashboard

#### Problem: Cannot sell below minimum price
**Solution**:
- This is intentional (guardrail)
- Request manager authorization
- Provide valid business reason
- Transaction will be logged

#### Problem: Branch inventory not updating
**Solution**:
- Check sale status (must be "Delivered")
- Verify branch ID matches
- Refresh inventory view

---

## Support & Contact

For technical support:
- **Email**: support@addvalues.eg
- **Phone**: +20 XXX XXX XXXX
- **Working Hours**: Sunday - Thursday, 9 AM - 5 PM

For training and onboarding:
- **Training Department**: training@addvalues.eg
- **Documentation**: Available in system help section

---

## Keyboard Shortcuts (Future Feature)

- `Ctrl + N`: New Product
- `Ctrl + S`: New Sale
- `Ctrl + I`: New Installation
- `Ctrl + F`: Search
- `Esc`: Close modal/dialog

---

**Last Updated**: December 16, 2024
**Version**: 1.0.0
**System**: AddValues Solar ERP
