/**
 * Data Generator for Testing and Development
 * Generates realistic sample data for the AddValues Solar ERP system
 */

import type { Product, Branch, Inventory, Sale, Partner, Installation, ShortageRequest } from '../types';

// Random data generators
const arabicNames = [
  'محمد السيد', 'أحمد علي', 'فاطمة حسن', 'سارة محمود', 'خالد إبراهيم',
  'نور الدين', 'ليلى عبدالله', 'عمر يوسف', 'مريم أحمد', 'حسن محمد',
  'رانيا عبدالرحمن', 'يوسف حسين', 'هدى علي', 'طارق سعيد', 'نادية محمد'
];

const companyNames = [
  'شركة النور للطاقة', 'مؤسسة الشمس المشرقة', 'الطاقة الخضراء المتحدة',
  'مصنع الأمل للتطوير', 'شركة المستقبل للطاقة', 'البناء الحديث للمقاولات',
  'الطاقة النظيفة للصناعات', 'مصانع النجاح للإنتاج', 'التقدم للتطوير العقاري'
];

const locations = [
  'Cairo - Nasr City', 'Alexandria - Smouha', 'Giza - Dokki', 'Cairo - Maadi',
  'Alexandria - Downtown', 'Mansoura - City Center', 'Tanta - Downtown',
  'Aswan - Corniche', 'October City', 'New Cairo', 'Sheikh Zayed'
];

// Helper functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomNumber(0, daysBack));
  return date.toISOString();
}

// Generate additional products
export function generateAdditionalProducts(): Product[] {
  const products: Product[] = [];
  
  // More chassis variations
  const chassisTypes = ['Premium Shafa', 'Standard Ahmad', 'Heavy Duty Scissors', 'Lightweight Frame'];
  chassisTypes.forEach((name, idx) => {
    products.push({
      id: `prod-chassis-gen-${idx}`,
      name: `${name} Chassis`,
      category: 'factory1_chassis',
      unit: 'piece',
      specifications: {
        dimensions: `${randomNumber(180, 250)}cm x ${randomNumber(90, 120)}cm x ${randomNumber(40, 60)}cm`,
        material: randomItem(['Galvanized Steel', 'Aluminum', 'Stainless Steel']),
        weight_kg: randomNumber(30, 60),
        coating: randomItem(['Powder Coated', 'Hot Dipped', 'Electroplated']),
      },
      cost_price: randomNumber(2000, 3500),
      sell_price: randomNumber(2800, 4500),
      min_sell_price: randomNumber(2400, 4000),
      created_at: randomDate(180),
      updated_at: randomDate(30),
    });
  });

  // More cable variations
  const cableSizes = [2.5, 4, 6, 10, 16, 25];
  const cableMaterials = ['Copper', 'Aluminum'];
  
  cableSizes.forEach((size, idx) => {
    cableMaterials.forEach((material) => {
      products.push({
        id: `prod-cable-gen-dc-${idx}-${material}`,
        name: `DC Cable ${size}mm ${material}`,
        category: 'factory2_cable_dc',
        unit: 'meter',
        specifications: {
          type: 'DC',
          size_mm: size,
          material: material,
          voltage_rating: '1500V',
          temperature_range: '-40°C to +90°C',
          insulation: 'XLPE',
        },
        cost_price: size * (material === 'Copper' ? 6 : 4),
        sell_price: size * (material === 'Copper' ? 8.5 : 5.5),
        min_sell_price: size * (material === 'Copper' ? 7 : 4.8),
        created_at: randomDate(180),
        updated_at: randomDate(30),
      });
    });
  });

  // More solar panels
  const brands = ['Jinko', 'Longi', 'Astrolongy', 'Ulka', 'Risen', 'Trina', 'Canadian Solar'];
  const wattages = [450, 500, 550, 580, 600, 650];
  
  brands.forEach((brand) => {
    const wattage = randomItem(wattages);
    products.push({
      id: `prod-solar-gen-${brand}-${wattage}`,
      name: `${brand} Solar Panel ${wattage}W`,
      category: 'import_solar_panel',
      unit: 'piece',
      brand: brand,
      specifications: {
        wattage: wattage,
        efficiency: `${(20 + Math.random() * 3).toFixed(1)}%`,
        dimensions: '2278mm x 1134mm x 35mm',
        origin: randomItem(['China', 'UAE', 'Germany']),
        serial_prefix: `${brand.substring(0, 3).toUpperCase()}${wattage}`,
        cells: randomItem([144, 156, 182]),
        warranty: randomItem([10, 12, 15, 25]),
      },
      cost_price: wattage * (7 + Math.random() * 2),
      sell_price: wattage * (9 + Math.random() * 2),
      min_sell_price: wattage * (8 + Math.random() * 1.5),
      created_at: randomDate(180),
      updated_at: randomDate(30),
    });
  });

  // More inverters
  const inverterBrands = ['Deye', 'Growatt', 'Huawei', 'SMA', 'Fronius', 'SolarEdge'];
  const powers = [5, 8, 10, 15, 20, 25, 30];
  
  inverterBrands.forEach((brand) => {
    const power = randomItem(powers);
    products.push({
      id: `prod-inv-gen-${brand}-${power}`,
      name: `${brand} Inverter ${power}KW`,
      category: 'partner_inverter',
      unit: 'piece',
      brand: brand,
      specifications: {
        type: randomItem(['Hybrid', 'On-Grid', 'Off-Grid']),
        power_kw: power,
        efficiency: `${(96 + Math.random() * 2.5).toFixed(1)}%`,
        warranty_years: randomItem([5, 10, 15]),
        max_dc_voltage: '1000V',
        mppt_trackers: randomItem([2, 3, 4]),
      },
      cost_price: power * (1200 + Math.random() * 300),
      sell_price: power * (1600 + Math.random() * 400),
      min_sell_price: power * (1400 + Math.random() * 350),
      created_at: randomDate(180),
      updated_at: randomDate(30),
    });
  });

  return products;
}

// Generate realistic sales
export function generateSales(branches: Branch[], products: Product[], count: number = 50): Sale[] {
  const sales: Sale[] = [];
  
  for (let i = 0; i < count; i++) {
    const branch = randomItem(branches);
    const itemCount = randomNumber(1, 5);
    const items = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = randomItem(products);
      const quantity = randomNumber(1, product.unit === 'meter' ? 100 : 20);
      const unitPrice = product.sell_price * (0.95 + Math.random() * 0.1); // ±5% variance
      const itemTotal = quantity * unitPrice;
      
      items.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: unitPrice,
        total: itemTotal,
        price_override: unitPrice < product.min_sell_price,
      });
      
      total += itemTotal;
    }

    const status = randomNumber(1, 10) > 3 ? 'delivered' : 'pending';
    const createdDate = randomDate(90);
    
    sales.push({
      id: `sale-gen-${i}`,
      branch_id: branch.id,
      customer_name: randomNumber(1, 10) > 3 ? randomItem(arabicNames) : randomItem(companyNames),
      customer_tier: randomItem(['standard', 'permanent', 'supplier']),
      items,
      total_amount: total,
      status,
      discount: randomNumber(1, 10) > 7 ? randomNumber(500, 5000) : undefined,
      notes: randomNumber(1, 10) > 8 ? 'Bulk order - preferential pricing applied' : undefined,
      created_by: randomItem(['Admin User', 'محمد السيد', 'أحمد محمود']),
      created_at: createdDate,
      delivered_at: status === 'delivered' ? new Date(new Date(createdDate).getTime() + randomNumber(1, 7) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });
  }

  return sales;
}

// Generate installations
export function generateInstallations(branches: Branch[], products: Product[], count: number = 20): Installation[] {
  const installations: Installation[] = [];
  const solarPanels = products.filter(p => p.category === 'import_solar_panel');
  const inverters = products.filter(p => p.category === 'partner_inverter');
  const chassis = products.filter(p => p.category === 'factory1_chassis');

  for (let i = 0; i < count; i++) {
    const branch = randomItem(branches);
    const items = [];
    
    // Add solar panels
    const panelProduct = randomItem(solarPanels);
    const panelQty = randomNumber(10, 60);
    items.push({
      product_id: panelProduct.id,
      product_name: panelProduct.name,
      quantity: panelQty,
      unit_price: panelProduct.sell_price,
    });

    // Add inverter
    const inverterProduct = randomItem(inverters);
    const inverterQty = randomNumber(1, 3);
    items.push({
      product_id: inverterProduct.id,
      product_name: inverterProduct.name,
      quantity: inverterQty,
      unit_price: inverterProduct.sell_price,
    });

    // Add chassis
    const chassisProduct = randomItem(chassis);
    const chassisQty = Math.ceil(panelQty / 2);
    items.push({
      product_id: chassisProduct.id,
      product_name: chassisProduct.name,
      quantity: chassisQty,
      unit_price: chassisProduct.sell_price,
    });

    const materialsCost = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const laborCost = randomNumber(20000, 80000);
    const totalCost = materialsCost + laborCost;

    const statusRand = randomNumber(1, 10);
    const status = statusRand > 7 ? 'scheduled' : statusRand > 4 ? 'in_progress' : 'completed';
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + randomNumber(-30, 60));

    installations.push({
      id: `inst-gen-${i}`,
      branch_id: branch.id,
      customer_name: randomNumber(1, 10) > 5 ? randomItem(arabicNames) : randomItem(companyNames),
      customer_contact: `+20 ${randomNumber(100, 199)} ${randomNumber(100, 999)} ${randomNumber(1000, 9999)}`,
      location: randomItem(locations),
      items,
      labor_cost: laborCost,
      total_cost: totalCost,
      status,
      scheduled_date: scheduledDate.toISOString(),
      completed_date: status === 'completed' ? new Date(scheduledDate.getTime() + randomNumber(3, 14) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      notes: randomItem([
        'Standard residential installation',
        'Commercial project with net metering',
        'Off-grid system with battery backup',
        'Roof reinforcement required',
        'Split installation across two buildings',
        undefined,
      ]),
      created_at: randomDate(120),
    });
  }

  return installations;
}

// Generate shortage requests
export function generateShortageRequests(branches: Branch[], products: Product[], count: number = 15): ShortageRequest[] {
  const requests: ShortageRequest[] = [];
  const nonHqBranches = branches.filter(b => !b.is_hq);

  for (let i = 0; i < count; i++) {
    const branch = randomItem(nonHqBranches);
    const product = randomItem(products);
    const statusRand = randomNumber(1, 10);
    const status = statusRand > 7 ? 'requested' : statusRand > 5 ? 'approved' : statusRand > 3 ? 'shipped' : 'received';
    
    const requestedDate = randomDate(30);
    const approvedDate = ['approved', 'shipped', 'received'].includes(status) 
      ? new Date(new Date(requestedDate).getTime() + randomNumber(1, 3) * 24 * 60 * 60 * 1000).toISOString() 
      : undefined;
    const shippedDate = ['shipped', 'received'].includes(status) && approvedDate
      ? new Date(new Date(approvedDate).getTime() + randomNumber(1, 2) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;
    const receivedDate = status === 'received' && shippedDate
      ? new Date(new Date(shippedDate).getTime() + randomNumber(1, 5) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    requests.push({
      id: `short-gen-${i}`,
      branch_id: branch.id,
      product_id: product.id,
      quantity_requested: product.unit === 'meter' ? randomNumber(100, 1000) : randomNumber(10, 50),
      status,
      notes: randomItem([
        'Urgent: Customer waiting',
        'Regular restocking',
        'Preparation for upcoming project',
        'Stock depleted faster than expected',
        undefined,
      ]),
      requested_at: requestedDate,
      approved_at: approvedDate,
      shipped_at: shippedDate,
      received_at: receivedDate,
    });
  }

  return requests;
}

// Generate additional partners
export function generatePartners(count: number = 4): Partner[] {
  const partners: Partner[] = [];
  const partnerCompanies = [
    'Solar Tech Egypt', 'Green Energy Solutions', 'Power Systems Co.',
    'Inverter Pro Egypt', 'Delta Energy', 'Suntech Traders',
    'Renewable Energy Hub', 'EcoSolar Distribution'
  ];

  for (let i = 0; i < count; i++) {
    partners.push({
      id: `partner-gen-${i}`,
      name: partnerCompanies[i],
      contact_person: randomItem(arabicNames),
      email: `contact@${partnerCompanies[i].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+20 ${randomNumber(100, 199)} ${randomNumber(100, 999)} ${randomNumber(1000, 9999)}`,
      products: [],
      created_at: randomDate(365),
    });
  }

  return partners;
}

// Main function to generate all data
export function generateFullDataset() {
  const existingBranches: Branch[] = JSON.parse(localStorage.getItem('erp_branches') || '[]');
  const existingProducts: Product[] = JSON.parse(localStorage.getItem('erp_products') || '[]');

  // Generate additional data
  const newProducts = generateAdditionalProducts();
  const allProducts = [...existingProducts, ...newProducts];
  
  const newSales = generateSales(existingBranches, allProducts, 50);
  const newInstallations = generateInstallations(existingBranches, allProducts, 20);
  const newShortages = generateShortageRequests(existingBranches, allProducts, 15);
  const newPartners = generatePartners(4);

  // Save to localStorage
  localStorage.setItem('erp_products', JSON.stringify(allProducts));
  localStorage.setItem('erp_sales', JSON.stringify([
    ...JSON.parse(localStorage.getItem('erp_sales') || '[]'),
    ...newSales
  ]));
  localStorage.setItem('erp_installations', JSON.stringify([
    ...JSON.parse(localStorage.getItem('erp_installations') || '[]'),
    ...newInstallations
  ]));
  localStorage.setItem('erp_shortages', JSON.stringify([
    ...JSON.parse(localStorage.getItem('erp_shortages') || '[]'),
    ...newShortages
  ]));
  localStorage.setItem('erp_partners', JSON.stringify([
    ...JSON.parse(localStorage.getItem('erp_partners') || '[]'),
    ...newPartners
  ]));

  console.log('✅ Generated comprehensive test data');
  console.log(`📦 Total Products: ${allProducts.length}`);
  console.log(`💰 Total Sales: ${newSales.length}`);
  console.log(`🔧 Total Installations: ${newInstallations.length}`);
  console.log(`⚠️ Total Shortage Requests: ${newShortages.length}`);
  console.log(`🤝 Total Partners: ${newPartners.length}`);
  
  return {
    products: allProducts,
    sales: newSales,
    installations: newInstallations,
    shortages: newShortages,
    partners: newPartners,
  };
}
