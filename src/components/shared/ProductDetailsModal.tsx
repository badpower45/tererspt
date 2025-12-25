import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Package, 
  Zap, 
  Shield, 
  Thermometer, 
  Ruler, 
  FileText,
  Download,
  ExternalLink,
  Award,
  Settings,
  Gauge,
  Battery,
  Wifi,
  Sun
} from 'lucide-react';
import type { 
  Product, 
  ChassisSpecifications, 
  CableSpecifications, 
  SolarPanelSpecifications, 
  InverterSpecifications,
  ElectricalPanelSpecifications 
} from '../../types';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, open, onClose }: ProductDetailsModalProps) {
  if (!product) return null;

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      factory1_chassis: 'شاسيه (مصنع 1)',
      factory1_panel: 'لوحة كهرباء (مصنع 1)',
      factory2_cable_dc: 'كابل DC (مصنع 2)',
      factory2_cable_ac: 'كابل AC (مصنع 2)',
      import_solar_panel: 'لوح شمسي (مستورد)',
      partner_inverter: 'محول/إنفرتر (شريك)',
    };
    return names[category] || category;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{product.name}</DialogTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{getCategoryName(product.category)}</Badge>
                {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
                {product.sku && <Badge variant="secondary">رقم الصنف: {product.sku}</Badge>}
                {product.is_featured && <Badge className="bg-amber-500">منتج مميز</Badge>}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specs">المواصفات</TabsTrigger>
            <TabsTrigger value="pricing">الأسعار</TabsTrigger>
            <TabsTrigger value="docs">المستندات</TabsTrigger>
            <TabsTrigger value="info">معلومات إضافية</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-4 mt-4">
            {product.category === 'factory1_chassis' && (
              <ChassisDetails specs={product.specifications as ChassisSpecifications} />
            )}
            {(product.category === 'factory2_cable_dc' || product.category === 'factory2_cable_ac') && (
              <CableDetails specs={product.specifications as CableSpecifications} />
            )}
            {product.category === 'import_solar_panel' && (
              <SolarPanelDetails specs={product.specifications as SolarPanelSpecifications} />
            )}
            {product.category === 'partner_inverter' && (
              <InverterDetails specs={product.specifications as InverterSpecifications} />
            )}
            {product.category === 'factory1_panel' && (
              <ElectricalPanelDetails specs={product.specifications as ElectricalPanelSpecifications} />
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-4">
            <PricingDetails product={product} />
          </TabsContent>

          <TabsContent value="docs" className="mt-4">
            <DocumentsDetails product={product} />
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <AdditionalInfo product={product} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ChassisDetails({ specs }: { specs: ChassisSpecifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="w-5 h-5" />
            الأبعاد والوزن
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الطول" value={`${specs.length_mm} مم`} />
          <DetailRow label="العرض" value={`${specs.width_mm} مم`} />
          <DetailRow label="الارتفاع" value={`${specs.height_mm} مم`} />
          <DetailRow label="الوزن" value={`${specs.weight_kg} كجم`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5" />
            المواد والطلاء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="المادة" value={getMaterialName(specs.material)} />
          <DetailRow label="نوع الطلاء" value={getCoatingName(specs.coating_type)} />
          <DetailRow label="سمك الطلاء" value={`${specs.coating_thickness_microns} ميكرون`} />
          <DetailRow label="سمك المعدن" value={`${specs.metal_thickness_mm} مم`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            المقاومة والمتانة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مقاومة الرياح" value={`${specs.wind_resistance_kph} كم/س`} />
          <DetailRow label="تحمل الثلج" value={`${specs.snow_load_capacity_kg} كجم`} />
          <DetailRow label="مقاومة التآكل" value={specs.corrosion_resistance_grade} />
          <DetailRow label="معامل الأمان" value={specs.safety_factor.toString()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            التصميم والتركيب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="زاوية الميل" value={`${specs.tilt_angle_degrees}°`} />
          <DetailRow label="نوع التركيب" value={getMountingTypeName(specs.mounting_type)} />
          <DetailRow label="التوجيه" value={getOrientationName(specs.orientation)} />
          <DetailRow label="سعة الألواح" value={`${specs.modules_capacity} لوح`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            الضمان والمعايير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الضمان" value={`${specs.warranty_years} سنة`} />
          <DetailRow label="العمر الافتراضي" value={`${specs.expected_lifespan_years} سنة`} />
          <DetailRow label="بلد المنشأ" value={specs.country_of_origin} />
          {specs.standards_compliance && specs.standards_compliance.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">المعايير:</p>
              <div className="flex flex-wrap gap-1">
                {specs.standards_compliance.map((std, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{std}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CableDetails({ specs }: { specs: CableSpecifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            الخصائص الكهربائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مادة الموصل" value={getConductorMaterialName(specs.conductor_material)} />
          <DetailRow label="نقاء الموصل" value={`${specs.conductor_purity_percentage}%`} />
          <DetailRow label="مساحة المقطع" value={`${specs.cross_section_area_mm2} مم²`} />
          <DetailRow label="قطر الموصل" value={`${specs.conductor_diameter_mm} مم`} />
          <DetailRow label="الجهد المقنن" value={`${specs.voltage_rating_v} فولت`} />
          <DetailRow label="أقصى تيار" value={`${specs.max_current_ampere} أمبير`} />
          <DetailRow label="المقاومة" value={`${specs.resistance_per_km_ohm} أوم/كم`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5" />
            العزل والغلاف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مادة العزل" value={specs.insulation_material.toUpperCase()} />
          <DetailRow label="سمك العزل" value={`${specs.insulation_thickness_mm} مم`} />
          <DetailRow label="مادة الغلاف" value={specs.outer_sheath_material.toUpperCase()} />
          <DetailRow label="القطر الخارجي" value={`${specs.outer_diameter_mm} مم`} />
          <DetailRow label="لون التمييز" value={specs.color_coding} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="w-5 h-5" />
            الأداء والحرارة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="درجة الحرارة" value={`${specs.temperature_rating_celsius}°م`} />
          <DetailRow label="معامل الحرارة" value={specs.temperature_coefficient.toString()} />
          <DetailRow label="مرونة السلك" value={specs.flexibility_grade} />
          <DetailRow label="نصف قطر الانحناء" value={`${specs.min_bending_radius_mm} مم`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            الحماية والمقاومة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مقاومة الحريق" value={specs.fire_resistance_class} />
          <DetailRow label="مقاومة الماء" value={specs.water_resistance_rating} />
          <DetailRow label="مقاومة الأشعة UV" value={specs.uv_resistance ? 'نعم' : 'لا'} />
          <DetailRow label="الاستخدام الداخلي" value={specs.indoor_use ? 'نعم' : 'لا'} />
          <DetailRow label="الاستخدام الخارجي" value={specs.outdoor_use ? 'نعم' : 'لا'} />
          <DetailRow label="الاستخدام تحت الأرض" value={specs.underground_use ? 'نعم' : 'لا'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            التطبيقات والضمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مناسب لـ DC" value={specs.suitable_for_dc ? 'نعم' : 'لا'} />
          <DetailRow label="مناسب لـ AC" value={specs.suitable_for_ac ? 'نعم' : 'لا'} />
          <DetailRow label="الطول/البكرة" value={`${specs.length_per_roll_meters} متر`} />
          <DetailRow label="الضمان" value={`${specs.warranty_years} سنة`} />
          <DetailRow label="العمر الافتراضي" value={`${specs.expected_lifespan_years} سنة`} />
          <DetailRow label="بلد المنشأ" value={specs.country_of_origin} />
        </CardContent>
      </Card>
    </div>
  );
}

function SolarPanelDetails({ specs }: { specs: SolarPanelSpecifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            الخصائص الكهربائية (STC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="القدرة" value={`${specs.power_rating_watts} واط`} highlight />
          <DetailRow label="الجهد عند أقصى قدرة (Vmp)" value={`${specs.voltage_at_max_power_vmp} فولت`} />
          <DetailRow label="التيار عند أقصى قدرة (Imp)" value={`${specs.current_at_max_power_imp} أمبير`} />
          <DetailRow label="جهد الدائرة المفتوحة (Voc)" value={`${specs.open_circuit_voltage_voc} فولت`} />
          <DetailRow label="تيار الدائرة القصيرة (Isc)" value={`${specs.short_circuit_current_isc} أمبير`} />
          <DetailRow label="الكفاءة" value={`${specs.efficiency_percentage}%`} highlight />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="w-5 h-5" />
            خصائص الخلايا
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="نوع الخلية" value={getCellTypeName(specs.cell_type)} />
          <DetailRow label="تكوين الخلايا" value={specs.cell_configuration} />
          <DetailRow label="كفاءة الخلية" value={`${specs.cell_efficiency_percentage}%`} />
          <DetailRow label="ثنائي الوجه" value={specs.bifacial ? 'نعم' : 'لا'} />
          {specs.bifacial && specs.bifaciality_factor_percentage && (
            <DetailRow label="عامل ثنائي الوجه" value={`${specs.bifaciality_factor_percentage}%`} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="w-5 h-5" />
            الأبعاد والوزن
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الطول" value={`${specs.length_mm} مم`} />
          <DetailRow label="العرض" value={`${specs.width_mm} مم`} />
          <DetailRow label="السمك" value={`${specs.thickness_mm} مم`} />
          <DetailRow label="الوزن" value={`${specs.weight_kg} كجم`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="w-5 h-5" />
            الأداء الحراري
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="معامل حرارة القدرة" value={`${specs.temperature_coefficient_pmax}%/°م`} />
          <DetailRow label="معامل حرارة Voc" value={`${specs.temperature_coefficient_voc}%/°م`} />
          <DetailRow label="معامل حرارة Isc" value={`${specs.temperature_coefficient_isc}%/°م`} />
          <DetailRow label="NOCT" value={`${specs.noct_celsius}°م`} />
          <DetailRow label="نطاق التشغيل" value={`${specs.operating_temperature_range_min_celsius} إلى ${specs.operating_temperature_range_max_celsius}°م`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            المتانة والحماية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="مادة الإطار" value={specs.frame_material === 'aluminum' ? 'ألومنيوم' : 'بدون إطار'} />
          <DetailRow label="نوع الزجاج" value={getGlassTypeName(specs.glass_type)} />
          <DetailRow label="سمك الزجاج" value={`${specs.glass_thickness_mm} مم`} />
          <DetailRow label="مقاومة الرياح" value={`${specs.wind_load_resistance_pa} باسكال`} />
          <DetailRow label="مقاومة الثلج" value={`${specs.snow_load_resistance_pa} باسكال`} />
          <DetailRow label="مقاومة البرد" value={`${specs.hail_impact_resistance_mm} مم`} />
          <DetailRow label="عدد الديودات" value={specs.bypass_diodes_count.toString()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            الضمان والشهادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="ضمان المنتج" value={`${specs.warranty_product_years} سنة`} highlight />
          <DetailRow label="ضمان الأداء" value={`${specs.warranty_performance_years} سنة`} highlight />
          <DetailRow label="الأداء بعد 25 سنة" value={`${specs.performance_guarantee_25_years_percentage}%`} />
          <DetailRow label="العلامة التجارية" value={specs.brand} />
          <DetailRow label="رقم الموديل" value={specs.model_number} />
          <DetailRow label="بلد الصنع" value={specs.country_of_manufacture} />
          <DetailRow label="مصدر الاستيراد" value={getImportSourceName(specs.import_source)} />
          {specs.certifications && specs.certifications.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">الشهادات:</p>
              <div className="flex flex-wrap gap-1">
                {specs.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="w-5 h-5" />
            الأداء الطاقي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="أقصى جهد للنظام" value={`${specs.max_system_voltage_v} فولت`} />
          <DetailRow label="تيار الفيوز" value={`${specs.max_series_fuse_rating_a} أمبير`} />
          <DetailRow label="تفاوت القدرة" value={`±${specs.power_tolerance_percentage}%`} />
        </CardContent>
      </Card>
    </div>
  );
}

function InverterDetails({ specs }: { specs: InverterSpecifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            المدخل (DC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="أقصى قدرة DC" value={`${specs.max_dc_power_watts} واط`} highlight />
          <DetailRow label="أقصى جهد DC" value={`${specs.max_dc_voltage_v} فولت`} />
          <DetailRow label="نطاق MPPT" value={`${specs.mppt_voltage_range_min_v} - ${specs.mppt_voltage_range_max_v} فولت`} />
          <DetailRow label="عدد MPPT" value={specs.mppt_trackers_count.toString()} />
          <DetailRow label="Strings لكل MPPT" value={specs.strings_per_mppt.toString()} />
          <DetailRow label="أقصى تيار DC" value={`${specs.max_dc_current_per_mppt_a} أمبير`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            المخرج (AC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="القدرة المقننة AC" value={`${specs.rated_ac_power_watts} واط`} highlight />
          <DetailRow label="أقصى قدرة AC" value={`${specs.max_ac_power_watts} واط`} />
          <DetailRow label="الجهد الاسمي AC" value={`${specs.nominal_ac_voltage_v} فولت`} />
          <DetailRow label="نطاق الجهد AC" value={`${specs.ac_voltage_range_min_v} - ${specs.ac_voltage_range_max_v} فولت`} />
          <DetailRow label="التيار المقنن AC" value={`${specs.rated_ac_current_a} أمبير`} />
          <DetailRow label="التردد" value={`${specs.nominal_frequency_hz} هرتز (${specs.frequency_range_hz})`} />
          <DetailRow label="معامل القدرة" value={specs.power_factor.toString()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="w-5 h-5" />
            الكفاءة والأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الكفاءة القصوى" value={`${specs.max_efficiency_percentage}%`} highlight />
          <DetailRow label="الكفاءة الأوروبية" value={`${specs.european_efficiency_percentage}%`} />
          <DetailRow label="كفاءة MPPT" value={`${specs.mppt_efficiency_percentage}%`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            النوع والتصنيف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="نوع المحول" value={getInverterTypeName(specs.inverter_type)} />
          <DetailRow label="نوع الطور" value={specs.phase_type === 'single_phase' ? 'طور واحد' : 'ثلاثة أطوار'} />
          <DetailRow label="التصميم" value={getTopologyName(specs.topology)} />
          <DetailRow label="نوع العرض" value={getDisplayTypeName(specs.display_type)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            الحماية والأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="تصنيف IP" value={specs.ip_rating} />
          <DetailRow label="حماية DC" value={specs.surge_protection_dc} />
          <DetailRow label="حماية AC" value={specs.surge_protection_ac} />
          <DetailRow label="كشف القوس الكهربائي" value={specs.arc_fault_detection ? 'نعم' : 'لا'} />
          <DetailRow label="مراقبة العزل" value={specs.insulation_monitoring ? 'نعم' : 'لا'} />
          {specs.protection_features && specs.protection_features.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">ميزات الحماية:</p>
              <div className="flex flex-wrap gap-1">
                {specs.protection_features.map((feat, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{feat}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {specs.battery_compatible && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Battery className="w-5 h-5" />
              دعم البطاريات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DetailRow label="متوافق مع البطاريات" value="نعم" highlight />
            {specs.battery_voltage_range_v && (
              <DetailRow label="نطاق جهد البطارية" value={`${specs.battery_voltage_range_v} فولت`} />
            )}
            {specs.max_charge_current_a && (
              <DetailRow label="أقصى تيار شحن" value={`${specs.max_charge_current_a} أمبير`} />
            )}
            {specs.max_discharge_current_a && (
              <DetailRow label="أقصى تيار تفريغ" value={`${specs.max_discharge_current_a} أمبير`} />
            )}
            {specs.battery_type_supported && specs.battery_type_supported.length > 0 && (
              <div className="pt-2">
                <p className="text-sm opacity-70 mb-1">أنواع البطاريات المدعومة:</p>
                <div className="flex flex-wrap gap-1">
                  {specs.battery_type_supported.map((type, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{type}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wifi className="w-5 h-5" />
            الاتصال والمراقبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="منصة المراقبة" value={specs.monitoring_platform} />
          <DetailRow label="متوافق مع المنزل الذكي" value={specs.smart_home_compatible ? 'نعم' : 'لا'} />
          <DetailRow label="API متاح" value={specs.api_available ? 'نعم' : 'لا'} />
          {specs.communication_interfaces && specs.communication_interfaces.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">واجهات الاتصال:</p>
              <div className="flex flex-wrap gap-1">
                {specs.communication_interfaces.map((iface, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{iface}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="w-5 h-5" />
            الأبعاد والتركيب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الارتفاع" value={`${specs.dimensions_h_mm} مم`} />
          <DetailRow label="العرض" value={`${specs.dimensions_w_mm} مم`} />
          <DetailRow label="العمق" value={`${specs.dimensions_d_mm} مم`} />
          <DetailRow label="الوزن" value={`${specs.weight_kg} كجم`} />
          <DetailRow label="نوع التركيب" value={getMountingTypeName(specs.mounting_type)} />
          <DetailRow label="طريقة التبريد" value={getCoolingMethodName(specs.cooling_method)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="w-5 h-5" />
            البيئة التشغيلية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="نطاق التشغيل" value={`${specs.operating_temperature_range_min_celsius} إلى ${specs.operating_temperature_range_max_celsius}°م`} />
          <DetailRow label="نطاق التخزين" value={`${specs.storage_temperature_range_celsius}°م`} />
          <DetailRow label="نطاق الرطوبة" value={`${specs.humidity_range_percentage}%`} />
          <DetailRow label="أقصى ارتفاع" value={`${specs.altitude_max_meters} متر`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            الشريك والضمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الشريك" value={specs.partner_name} />
          <DetailRow label="رقم الموديل" value={specs.model_number} />
          <DetailRow label="بلد الصنع" value={specs.country_of_manufacture} />
          <DetailRow label="الضمان" value={`${specs.warranty_years} سنة`} highlight />
          <DetailRow label="العمر الافتراضي" value={`${specs.expected_lifespan_years} سنة`} />
          {specs.certifications && specs.certifications.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">الشهادات:</p>
              <div className="flex flex-wrap gap-1">
                {specs.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ElectricalPanelDetails({ specs }: { specs: ElectricalPanelSpecifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="w-5 h-5" />
            الأبعاد والنوع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الارتفاع" value={`${specs.height_mm} مم`} />
          <DetailRow label="العرض" value={`${specs.width_mm} مم`} />
          <DetailRow label="العمق" value={`${specs.depth_mm} مم`} />
          <DetailRow label="نوع التركيب" value={getMountingTypeName(specs.mounting_type)} />
          <DetailRow label="نوع الغلاف" value={specs.enclosure_type === 'indoor' ? 'داخلي' : 'خارجي'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5" />
            المواد والحماية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="المادة" value={getPanelMaterialName(specs.material)} />
          <DetailRow label="تصنيف IP" value={specs.ip_rating} />
          <DetailRow label="تصنيف IK" value={specs.ik_rating} />
          <DetailRow label="اللون" value={specs.color} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            الخصائص الكهربائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الجهد المقنن" value={`${specs.rated_voltage_v} فولت`} />
          <DetailRow label="التيار المقنن" value={`${specs.rated_current_a} أمبير`} />
          <DetailRow label="تيار Busbar" value={`${specs.busbar_rating_a} أمبير`} />
          <DetailRow label="قدرة تحمل القصر" value={`${specs.short_circuit_rating_ka} كيلو أمبير`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            المحتويات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="القاطع الرئيسي" value={`${specs.main_breaker_rating_a} أمبير`} />
          <DetailRow label="عدد القواطع" value={specs.circuit_breakers_count.toString()} />
          <DetailRow label="تكوين القواطع" value={specs.circuit_breakers_configuration} />
          <DetailRow label="حماية من الصواعق" value={specs.surge_protection_included ? 'مضمن' : 'غير مضمن'} />
          <DetailRow label="عدادات" value={specs.meters_included ? 'مضمنة' : 'غير مضمنة'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            المعايير والضمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="الضمان" value={`${specs.warranty_years} سنة`} />
          <DetailRow label="قابل للتخصيص" value={specs.customizable ? 'نعم' : 'لا'} />
          <DetailRow label="مقاومة الحريق" value={specs.fire_resistance_class} />
          {specs.standards_compliance && specs.standards_compliance.length > 0 && (
            <div className="pt-2">
              <p className="text-sm opacity-70 mb-1">المعايير:</p>
              <div className="flex flex-wrap gap-1">
                {specs.standards_compliance.map((std, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{std}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PricingDetails({ product }: { product: Product }) {
  const profitMargin = product.sell_price - product.cost_price;
  const profitPercentage = ((profitMargin / product.cost_price) * 100).toFixed(2);
  const minProfitMargin = product.min_sell_price - product.cost_price;
  const minProfitPercentage = ((minProfitMargin / product.cost_price) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">التسعير الأساسي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="opacity-70">سعر التكلفة</span>
            <span className="font-mono">{product.cost_price.toLocaleString()} جنيه</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="opacity-70">سعر البيع المقترح</span>
            <span className="font-mono text-green-600">{product.sell_price.toLocaleString()} جنيه</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="opacity-70">الحد الأدنى للبيع</span>
            <span className="font-mono text-orange-600">{product.min_sell_price.toLocaleString()} جنيه</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">هوامش الربح</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="opacity-70">هامش الربح المقترح</span>
            <div className="text-left">
              <div className="font-mono text-green-600">{profitMargin.toLocaleString()} جنيه</div>
              <div className="text-sm text-green-600">{profitPercentage}%</div>
            </div>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="opacity-70">هامش الربح الأدنى</span>
            <div className="text-left">
              <div className="font-mono text-orange-600">{minProfitMargin.toLocaleString()} جنيه</div>
              <div className="text-sm text-orange-600">{minProfitPercentage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>محاكي التسعير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm opacity-70 mb-2">سيتم إضافة أداة تفاعلية لحساب السعر النهائي بناءً على الكمية والخصومات.</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded">
                <p className="text-xs opacity-70 mb-1">عميل عادي</p>
                <p className="font-mono">{product.sell_price.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded">
                <p className="text-xs opacity-70 mb-1">عميل دائم (-5%)</p>
                <p className="font-mono">{(product.sell_price * 0.95).toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded">
                <p className="text-xs opacity-70 mb-1">مورد (-10%)</p>
                <p className="font-mono">{(product.sell_price * 0.90).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentsDetails({ product }: { product: Product }) {
  const specs = product.specifications as any;
  
  const documents = [
    { name: 'صحيفة البيانات الفنية', url: product.datasheet_url || specs.datasheet_url, icon: FileText },
    { name: 'دليل التركيب', url: product.installation_manual_url || specs.installation_manual_url || specs.technical_drawing_url, icon: Download },
    { name: 'دليل المستخدم', url: specs.user_manual_url, icon: FileText },
    { name: 'تقرير الاختبار', url: specs.test_report_url, icon: FileText },
  ].filter(doc => doc.url);

  return (
    <div className="space-y-4">
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <doc.icon className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs opacity-60">انقر للتحميل أو العرض</p>
              </div>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>لا توجد مستندات متاحة لهذا المنتج</p>
        </div>
      )}

      {product.images && product.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>صور المنتج</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div key={idx} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AdditionalInfo({ product }: { product: Product }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>معلومات عامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailRow label="رقم الص��ف (SKU)" value={product.sku || 'غير محدد'} />
          <DetailRow label="الباركود" value={product.barcode || 'غير محدد'} />
          <DetailRow label="المصنع" value={product.manufacturer || 'غير محدد'} />
          <DetailRow label="المورد" value={product.supplier || 'غير محدد'} />
          <DetailRow label="الحالة" value={product.is_active ? 'نشط' : 'غير نشط'} />
          <DetailRow label="منتج مميز" value={product.is_featured ? 'نعم' : 'لا'} />
          <DetailRow label="تاريخ الإضافة" value={new Date(product.created_at).toLocaleDateString('ar-EG')} />
          <DetailRow label="آخر تحديث" value={new Date(product.updated_at).toLocaleDateString('ar-EG')} />
        </CardContent>
      </Card>

      {product.tags && product.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الوسوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {product.notes && (
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{product.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1">
      <span className="text-sm opacity-70 flex-shrink-0">{label}</span>
      <span className={`text-sm text-left ${highlight ? 'font-semibold text-blue-600' : ''}`}>{value}</span>
    </div>
  );
}

// Helper functions for translations
function getMaterialName(material: string): string {
  const names: Record<string, string> = {
    galvanized_steel: 'فولاذ مجلفن',
    aluminum: 'ألومنيوم',
    stainless_steel: 'فولاذ مقاوم للصدأ',
  };
  return names[material] || material;
}

function getCoatingName(coating: string): string {
  const names: Record<string, string> = {
    hot_dip_galvanized: 'جلفنة بالغمس الساخن',
    electro_galvanized: 'جلفنة كهربائية',
    powder_coated: 'طلاء بالمسحوق',
    anodized: 'أنودة',
  };
  return names[coating] || coating;
}

function getMountingTypeName(type: string): string {
  const names: Record<string, string> = {
    ground: 'أرضي',
    rooftop: 'سطح مائل',
    flat_roof: 'سطح مستوٍ',
    carport: 'مظلة سيارات',
    floating: 'عائم',
    wall: 'حائط',
    floor: 'أرضية',
    pole: 'عمود',
  };
  return names[type] || type;
}

function getOrientationName(orientation: string): string {
  const names: Record<string, string> = {
    portrait: 'عمودي',
    landscape: 'أفقي',
    adjustable: 'قابل للتعديل',
  };
  return names[orientation] || orientation;
}

function getConductorMaterialName(material: string): string {
  const names: Record<string, string> = {
    copper_ofc: 'نحاس OFC',
    copper_cca: 'نحاس CCA',
    aluminum: 'ألومنيوم',
    tinned_copper: 'نحاس مقصدر',
  };
  return names[material] || material;
}

function getCellTypeName(type: string): string {
  const names: Record<string, string> = {
    monocrystalline: 'أحادي البلورة',
    polycrystalline: 'متعدد البلورات',
    thin_film: 'غشاء رقيق',
    perc: 'PERC',
    topcon: 'TOPCon',
    hjt: 'HJT',
  };
  return names[type] || type;
}

function getGlassTypeName(type: string): string {
  const names: Record<string, string> = {
    tempered: 'زجاج مقسى',
    anti_reflective: 'مضاد للانعكاس',
    ar_coated: 'مطلي AR',
  };
  return names[type] || type;
}

function getImportSourceName(source: string): string {
  const names: Record<string, string> = {
    china: 'الصين',
    uae: 'الإمارات',
    other: 'أخرى',
  };
  return names[source] || source;
}

function getInverterTypeName(type: string): string {
  const names: Record<string, string> = {
    string: 'محول خطي',
    micro: 'محول صغير',
    hybrid: 'محول هجين',
    central: 'محول مركزي',
    off_grid: 'منفصل عن الشبكة',
  };
  return names[type] || type;
}

function getTopologyName(topology: string): string {
  const names: Record<string, string> = {
    transformer_less: 'بدون محول',
    hf_transformer: 'محول عالي التردد',
    lf_transformer: 'محول منخفض التردد',
  };
  return names[topology] || topology;
}

function getDisplayTypeName(type: string): string {
  const names: Record<string, string> = {
    lcd: 'شاشة LCD',
    led: 'شاشة LED',
    touch_screen: 'شاشة لمس',
    none: 'بدون شاشة',
  };
  return names[type] || type;
}

function getCoolingMethodName(method: string): string {
  const names: Record<string, string> = {
    natural: 'تبريد طبيعي',
    forced_air: 'تبريد بالهواء القسري',
    liquid: 'تبريد سائل',
  };
  return names[method] || method;
}

function getPanelMaterialName(material: string): string {
  const names: Record<string, string> = {
    steel: 'فولاذ',
    stainless_steel: 'فولاذ مقاوم للصدأ',
    plastic: 'بلاستيك',
    fiberglass: 'فايبرجلاس',
  };
  return names[material] || material;
}
