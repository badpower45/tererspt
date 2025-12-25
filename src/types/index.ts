// Core Entity Types

export type ProductCategory = 
  | 'factory1_chassis' 
  | 'factory1_panel' 
  | 'factory2_cable_dc' 
  | 'factory2_cable_ac'
  | 'import_solar_panel'
  | 'partner_inverter'
  | 'eggs'; // إضافة فئة البيض

export type Unit = 'ton' | 'piece' | 'meter' | 'roll' | 'tray' | 'kg' | 'box';

export type CustomerTier = 'standard' | 'permanent' | 'supplier';

export type SaleStatus = 'pending' | 'delivered' | 'cancelled';

export type InstallationStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type ShortageStatus = 'requested' | 'approved' | 'shipped' | 'received';

// ===== تفاصيل مواصفات المنتجات الشاملة =====

// مواصفات الشاسيهات (Factory 1)
export interface ChassisSpecifications {
  // الأبعاد والوزن
  length_mm: number;
  width_mm: number;
  height_mm: number;
  weight_kg: number;
  
  // المواد والطلاء
  material: 'galvanized_steel' | 'aluminum' | 'stainless_steel';
  coating_type: 'hot_dip_galvanized' | 'electro_galvanized' | 'powder_coated' | 'anodized';
  coating_thickness_microns: number;
  metal_thickness_mm: number;
  
  // المقاومة والمتانة
  wind_resistance_kph: number; // مقاومة الرياح
  snow_load_capacity_kg: number; // تحمل الثلج
  corrosion_resistance_grade: 'C1' | 'C2' | 'C3' | 'C4' | 'C5'; // تصنيف ISO 12944
  safety_factor: number; // معامل الأمان
  
  // التصميم والتركيب
  tilt_angle_degrees: number; // زاوية الميل
  mounting_type: 'ground' | 'rooftop' | 'flat_roof' | 'carport' | 'floating';
  orientation: 'portrait' | 'landscape' | 'adjustable';
  modules_capacity: number; // عدد الألواح التي يحملها
  
  // المعايير والشهادات
  standards_compliance: string[]; // ISO, TUV, etc
  warranty_years: number;
  expected_lifespan_years: number;
  
  // معلومات إضافية
  country_of_origin: string;
  manufacturer_code?: string;
  installation_manual_url?: string;
  technical_drawing_url?: string;
}

// مواصفات الكابلات (Factory 2)
export interface CableSpecifications {
  // الخصائص الكهربائية
  conductor_material: 'copper_ofc' | 'copper_cca' | 'aluminum' | 'tinned_copper';
  conductor_purity_percentage: number; // نقاء النحاس
  cross_section_area_mm2: number; // مساحة المقطع
  conductor_diameter_mm: number; // قطر الموصل
  
  // العزل والغلاف
  insulation_material: 'pvc' | 'xlpe' | 'epr' | 'silicone' | 'rubber';
  insulation_thickness_mm: number;
  outer_sheath_material: 'pvc' | 'lszh' | 'pe';
  outer_diameter_mm: number;
  
  // الأداء الكهربائي
  voltage_rating_v: number; // الجهد المقنن
  max_current_ampere: number; // أقصى تيار
  resistance_per_km_ohm: number; // المقاومة
  temperature_rating_celsius: number; // درجة الحرارة القصوى
  temperature_coefficient: number; // معامل الحرارة
  
  // المعايير والاختبارات
  fire_resistance_class: 'Eca' | 'Dca' | 'Cca' | 'B2ca' | 'B1ca' | 'Aca';
  uv_resistance: boolean;
  water_resistance_rating: 'IP65' | 'IP67' | 'IP68';
  flexibility_grade: 'class_1' | 'class_2' | 'class_5' | 'class_6';
  
  // الاستخدام والتطبيقات
  suitable_for_dc: boolean;
  suitable_for_ac: boolean;
  indoor_use: boolean;
  outdoor_use: boolean;
  underground_use: boolean;
  
  // الطول والتعبئة
  length_per_roll_meters: number;
  min_bending_radius_mm: number;
  
  // المعايير والشهادات
  standards_compliance: string[]; // TUV, CE, IEC
  warranty_years: number;
  expected_lifespan_years: number;
  
  // معلومات إضافية
  color_coding: string;
  country_of_origin: string;
  manufacturer_code?: string;
  datasheet_url?: string;
}

// مواصفات الألواح الشمسية (Import)
export interface SolarPanelSpecifications {
  // الخصائص الكهربائية (STC - Standard Test Conditions)
  power_rating_watts: number; // القدرة
  voltage_at_max_power_vmp: number;
  current_at_max_power_imp: number;
  open_circuit_voltage_voc: number;
  short_circuit_current_isc: number;
  efficiency_percentage: number;
  
  // خصائص الخلايا
  cell_type: 'monocrystalline' | 'polycrystalline' | 'thin_film' | 'perc' | 'topcon' | 'hjt';
  cell_configuration: string; // مثل "132 Half-Cut Cells"
  cell_efficiency_percentage: number;
  bifacial: boolean; // وجهين
  bifaciality_factor_percentage?: number;
  
  // الأبعاد والوزن
  length_mm: number;
  width_mm: number;
  thickness_mm: number;
  weight_kg: number;
  
  // الأداء تحت الظروف المختلفة
  temperature_coefficient_pmax: number; // %/°C
  temperature_coefficient_voc: number;
  temperature_coefficient_isc: number;
  noct_celsius: number; // Nominal Operating Cell Temperature
  operating_temperature_range_min_celsius: number;
  operating_temperature_range_max_celsius: number;
  
  // المتانة والحماية
  frame_material: 'aluminum' | 'frameless';
  glass_type: 'tempered' | 'anti_reflective' | 'ar_coated';
  glass_thickness_mm: number;
  junction_box_rating: string;
  bypass_diodes_count: number;
  
  // المقاومة والاختبارات
  wind_load_resistance_pa: number;
  snow_load_resistance_pa: number;
  hail_impact_resistance_mm: number; // قطر حبة البرد
  salt_mist_corrosion_test: boolean;
  ammonia_corrosion_test: boolean;
  
  // الشهادات والضمانات
  warranty_product_years: number; // ضمان المنتج
  warranty_performance_years: number; // ضمان الأداء
  performance_guarantee_25_years_percentage: number; // الأداء بعد 25 سنة
  certifications: string[]; // IEC, TUV, UL, CE, etc
  
  // معلومات الاستيراد
  brand: string;
  model_number: string;
  serial_number?: string;
  country_of_manufacture: string;
  import_source: 'china' | 'uae' | 'other';
  
  // الأداء الطاقي
  max_system_voltage_v: number;
  max_series_fuse_rating_a: number;
  power_tolerance_percentage: number; // عادة +/- 5%
  
  // معلومات إضافية
  datasheet_url?: string;
  installation_manual_url?: string;
  test_report_url?: string;
}

// مواصفات المحولات/الإنفرترات (Partners)
export interface InverterSpecifications {
  // الخصائص الكهربائية - المدخل (DC)
  max_dc_power_watts: number;
  max_dc_voltage_v: number;
  mppt_voltage_range_min_v: number;
  mppt_voltage_range_max_v: number;
  mppt_trackers_count: number;
  strings_per_mppt: number;
  max_dc_current_per_mppt_a: number;
  
  // الخصائص الكهربائية - المخرج (AC)
  rated_ac_power_watts: number;
  max_ac_power_watts: number;
  nominal_ac_voltage_v: number;
  ac_voltage_range_min_v: number;
  ac_voltage_range_max_v: number;
  rated_ac_current_a: number;
  nominal_frequency_hz: number;
  frequency_range_hz: string; // "50/60 ±5"
  power_factor: number; // عادة 1 أو قابل للتعديل
  
  // الكفاءة والأداء
  max_efficiency_percentage: number;
  european_efficiency_percentage: number;
  mppt_efficiency_percentage: number;
  
  // النوع والتصنيف
  inverter_type: 'string' | 'micro' | 'hybrid' | 'central' | 'off_grid';
  phase_type: 'single_phase' | 'three_phase';
  topology: 'transformer_less' | 'hf_transformer' | 'lf_transformer';
  
  // الحماية والأمان
  protection_features: string[]; // DC Reverse, Over-voltage, Short-circuit, etc
  ip_rating: 'IP20' | 'IP54' | 'IP65' | 'IP66';
  surge_protection_dc: string; // Type II
  surge_protection_ac: string; // Type II
  arc_fault_detection: boolean;
  insulation_monitoring: boolean;
  
  // الاتصال والمراقبة
  communication_interfaces: string[]; // WiFi, Ethernet, RS485, 4G
  monitoring_platform: string; // اسم التطبيق أو المنصة
  smart_home_compatible: boolean;
  api_available: boolean;
  
  // البطاريات (للهجين)
  battery_compatible: boolean;
  battery_voltage_range_v?: string;
  max_charge_current_a?: number;
  max_discharge_current_a?: number;
  battery_type_supported?: string[]; // Lead-acid, Li-ion, LFP
  
  // الأبعاد والتركيب
  dimensions_h_mm: number;
  dimensions_w_mm: number;
  dimensions_d_mm: number;
  weight_kg: number;
  mounting_type: 'wall' | 'ground' | 'pole';
  cooling_method: 'natural' | 'forced_air' | 'liquid';
  
  // البيئة التشغيلية
  operating_temperature_range_min_celsius: number;
  operating_temperature_range_max_celsius: number;
  storage_temperature_range_celsius: string;
  humidity_range_percentage: string;
  altitude_max_meters: number;
  
  // المعايير والشهادات
  certifications: string[]; // IEC, VDE, CE, UL, etc
  grid_support_functions: string[]; // Q at Night, Reactive Power, etc
  country_specific_approvals: string[];
  
  // الضمان والعمر الافتراضي
  warranty_years: number;
  expected_lifespan_years: number;
  display_type: 'lcd' | 'led' | 'touch_screen' | 'none';
  
  // معلومات الشريك
  partner_name: string;
  partner_id: string;
  model_number: string;
  country_of_manufacture: string;
  
  // معلومات إضافية
  datasheet_url?: string;
  user_manual_url?: string;
  installation_manual_url?: string;
}

// مواصفات لوحات الكهرباء
export interface ElectricalPanelSpecifications {
  // الأبعاد والنوع
  height_mm: number;
  width_mm: number;
  depth_mm: number;
  mounting_type: 'wall' | 'floor' | 'pole';
  enclosure_type: 'indoor' | 'outdoor';
  
  // التصنيع والمواد
  material: 'steel' | 'stainless_steel' | 'plastic' | 'fiberglass';
  ip_rating: 'IP20' | 'IP44' | 'IP54' | 'IP55' | 'IP65' | 'IP66';
  ik_rating: string; // مقاومة الصدمات
  
  // الخصائص الكهربائية
  rated_voltage_v: number;
  rated_current_a: number;
  busbar_rating_a: number;
  short_circuit_rating_ka: number;
  
  // المحتويات
  main_breaker_rating_a: number;
  circuit_breakers_count: number;
  circuit_breakers_configuration: string; // "4x MCB 63A + 2x MCB 32A"
  surge_protection_included: boolean;
  meters_included: boolean;
  
  // المعايير
  standards_compliance: string[]; // IEC 61439, etc
  fire_resistance_class: string;
  color: string;
  
  // معلومات إضافية
  warranty_years: number;
  customizable: boolean;
  datasheet_url?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: Unit;
  specifications: 
    | ChassisSpecifications 
    | CableSpecifications 
    | SolarPanelSpecifications 
    | InverterSpecifications 
    | ElectricalPanelSpecifications
    | Record<string, any>; // fallback for other types
  cost_price: number;
  sell_price: number;
  min_sell_price: number;
  brand?: string;
  sku?: string; // Stock Keeping Unit
  barcode?: string;
  manufacturer?: string;
  supplier?: string;
  // صور ووثائق
  images?: string[];
  datasheet_url?: string;
  installation_manual_url?: string;
  // تواريخ
  created_at: string;
  updated_at: string;
  // حالة المنتج
  is_active: boolean;
  is_featured: boolean;
  tags?: string[];
  notes?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  is_hq: boolean;
  manager_name: string;
  contact: string;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  min_stock_level: number;
  local_price?: number;
  last_updated: string;
}

export interface Sale {
  id: string;
  branch_id: string;
  customer_name: string;
  customer_tier: CustomerTier;
  items: SaleItem[];
  total_amount: number;
  status: SaleStatus;
  discount?: number;
  notes?: string;
  created_by: string;
  created_at: string;
  delivered_at?: string;
}

export interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  price_override?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  products: PartnerProduct[];
  created_at: string;
}

export interface PartnerProduct {
  id: string;
  partner_id: string;
  product_id: string;
  partner_price: number;
  specifications: Record<string, any>;
}

export interface BarterTransaction {
  id: string;
  partner_id: string;
  items_given: BarterItem[];
  items_received: BarterItem[];
  settlement_balance: number;
  notes?: string;
  created_at: string;
}

export interface BarterItem {
  product_id: string;
  product_name: string;
  quantity: number;
  cost_value: number;
  sell_value: number;
}

export interface Installation {
  id: string;
  branch_id: string;
  customer_name: string;
  customer_contact: string;
  location: string;
  items: InstallationItem[];
  labor_cost: number;
  total_cost: number;
  status: InstallationStatus;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
}

export interface InstallationItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface ShortageRequest {
  id: string;
  branch_id: string;
  product_id: string;
  quantity_requested: number;
  status: ShortageStatus;
  notes?: string;
  requested_at: string;
  approved_at?: string;
  shipped_at?: string;
  received_at?: string;
}

export interface PriceOverrideLog {
  id: string;
  sale_id: string;
  product_id: string;
  original_price: number;
  override_price: number;
  authorized_by: string;
  reason: string;
  created_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  total_inventory_value: number;
  total_sales_today: number;
  total_sales_month: number;
  pending_shortages: number;
  active_installations: number;
  low_stock_items: number;
}

// User Management and Roles
export type UserRole = 
  | 'super_admin'      // صلاحيات كاملة على كل شيء
  | 'branch_manager'   // إدارة الفرع الخاص به
  | 'sales_manager'    // إدارة المبيعات والتسعير
  | 'inventory_manager' // إدارة المخزون والمنتجات
  | 'cashier'          // نقطة البيع فقط (POS)
  | 'partner_manager'  // إدارة الشركاء والمقارنات
  | 'installer';       // إدارة التركيبات

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch_id?: string; // null للـ HQ
  password_hash: string; // في الواقع سيتم تشفيره
  is_active: boolean;
  can_override_price: boolean; // صلاحية تجاوز الحد الأدنى للسعر
  created_at: string;
  last_login?: string;
}

export interface Permission {
  role: UserRole;
  can_view_dashboard: boolean;
  can_manage_products: boolean;
  can_manage_inventory: boolean;
  can_create_sales: boolean;
  can_override_prices: boolean;
  can_manage_partners: boolean;
  can_manage_barter: boolean;
  can_manage_installations: boolean;
  can_manage_branches: boolean;
  can_view_reports: boolean;
  can_manage_users: boolean;
  can_approve_shortages: boolean;
  can_use_pos: boolean;
}

// Eggs POS System
export type EggSize = 'small' | 'medium' | 'large' | 'extra_large' | 'jumbo';
export type EggType = 'white' | 'brown' | 'organic' | 'free_range';

export interface EggProduct {
  id: string;
  name: string;
  type: EggType;
  size: EggSize;
  quantity_per_tray: number; // عدد البيض في الطبق (عادة 30)
  cost_per_tray: number;
  sell_price_per_tray: number;
  sell_price_per_piece: number;
  barcode?: string;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export interface EggInventory {
  id: string;
  egg_product_id: string;
  branch_id: string;
  trays_in_stock: number;
  pieces_in_stock: number; // قطع فردية
  min_stock_trays: number;
  last_restocked: string;
}

export interface EggSale {
  id: string;
  branch_id: string;
  cashier_id: string;
  customer_name?: string;
  items: EggSaleItem[];
  total_amount: number;
  payment_method: 'cash' | 'card' | 'transfer';
  discount?: number;
  created_at: string;
}

export interface EggSaleItem {
  egg_product_id: string;
  product_name: string;
  trays: number;
  pieces: number; // قطع فردية
  unit_price_tray: number;
  unit_price_piece: number;
  total: number;
}

// Enhanced Partner Product Management
export interface PartnerProductComparison {
  product_category: string; // مثل "Inverter 5KW"
  partners: {
    partner_id: string;
    partner_name: string;
    product_id: string;
    price: number;
    specifications: Record<string, any>;
    availability: 'in_stock' | 'on_order' | 'out_of_stock';
    delivery_time_days: number;
    warranty_months: number;
    rating?: number;
  }[];
}

export interface PartnerProductCatalog {
  id: string;
  partner_id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  bulk_discount?: {
    min_quantity: number;
    discount_percentage: number;
  }[];
  specifications: Record<string, any>;
  images?: string[];
  availability: 'in_stock' | 'on_order' | 'out_of_stock';
  delivery_time_days: number;
  warranty_months: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}