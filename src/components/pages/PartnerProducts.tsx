import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Package, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  GitCompare
} from 'lucide-react';
import type { PartnerProductCatalog, PartnerProductComparison } from '../../types';

// Mock data for partner products
const MOCK_PARTNER_PRODUCTS: PartnerProductCatalog[] = [
  {
    id: 'pp-1',
    partner_id: 'partner-1',
    name: 'Inverter Huawei SUN2000-5KTL',
    category: 'Inverter 5KW',
    sku: 'HW-5KW-001',
    price: 15000,
    bulk_discount: [
      { min_quantity: 5, discount_percentage: 5 },
      { min_quantity: 10, discount_percentage: 10 },
    ],
    specifications: {
      power: '5KW',
      efficiency: '98.6%',
      voltage: '380-440V',
      warranty: '10 years',
    },
    availability: 'in_stock',
    delivery_time_days: 3,
    warranty_months: 120,
    rating: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pp-2',
    partner_id: 'partner-2',
    name: 'Inverter Growatt MIN 5000TL-X',
    category: 'Inverter 5KW',
    sku: 'GW-5KW-002',
    price: 13500,
    bulk_discount: [
      { min_quantity: 3, discount_percentage: 3 },
      { min_quantity: 8, discount_percentage: 8 },
    ],
    specifications: {
      power: '5KW',
      efficiency: '98.4%',
      voltage: '380-440V',
      warranty: '10 years',
    },
    availability: 'in_stock',
    delivery_time_days: 2,
    warranty_months: 120,
    rating: 4.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pp-3',
    partner_id: 'partner-3',
    name: 'Inverter Fronius Primo 5.0-1',
    category: 'Inverter 5KW',
    sku: 'FR-5KW-003',
    price: 18000,
    bulk_discount: [
      { min_quantity: 5, discount_percentage: 7 },
    ],
    specifications: {
      power: '5KW',
      efficiency: '98.1%',
      voltage: '380-440V',
      warranty: '7 years',
    },
    availability: 'on_order',
    delivery_time_days: 7,
    warranty_months: 84,
    rating: 4.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pp-4',
    partner_id: 'partner-4',
    name: 'Inverter Solis 5K-4G',
    category: 'Inverter 5KW',
    sku: 'SL-5KW-004',
    price: 14000,
    bulk_discount: [
      { min_quantity: 4, discount_percentage: 5 },
      { min_quantity: 10, discount_percentage: 12 },
    ],
    specifications: {
      power: '5KW',
      efficiency: '98.5%',
      voltage: '380-440V',
      warranty: '10 years',
    },
    availability: 'in_stock',
    delivery_time_days: 5,
    warranty_months: 120,
    rating: 4.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_PARTNERS = [
  { id: 'partner-1', name: 'شركة الطاقة المتقدمة' },
  { id: 'partner-2', name: 'مؤسسة النور الشمسي' },
  { id: 'partner-3', name: 'شركة الأفق الجديد' },
  { id: 'partner-4', name: 'التكنولوجيا الخضراء' },
];

const AVAILABILITY_LABELS = {
  in_stock: { label: 'متوفر', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  on_order: { label: 'تحت الطلب', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  out_of_stock: { label: 'غير متوفر', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function PartnerProducts() {
  const [products] = useState<PartnerProductCatalog[]>(MOCK_PARTNER_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [comparisonMode, setComparisonMode] = useState(false);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group products by category for comparison
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, PartnerProductCatalog[]>);

  // Get partner name
  const getPartnerName = (partnerId: string) => {
    return MOCK_PARTNERS.find(p => p.id === partnerId)?.name || 'غير محدد';
  };

  // Find best price in category
  const getBestPrice = (category: string) => {
    const categoryProducts = productsByCategory[category] || [];
    return Math.min(...categoryProducts.map(p => p.price));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            إدارة منتجات الشراكات
          </h1>
          <p className="text-gray-600 mt-1">مقارنة وإدارة منتجات الشركاء</p>
        </div>
        <Button 
          onClick={() => setComparisonMode(!comparisonMode)}
          variant={comparisonMode ? 'default' : 'outline'}
          size="lg"
        >
          <GitCompare className="w-5 h-5 mr-2" />
          {comparisonMode ? 'عرض عادي' : 'وضع المقارنة'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المنتجات</p>
                <p className="text-3xl text-gray-900">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">متوفر</p>
                <p className="text-3xl text-gray-900">
                  {products.filter(p => p.availability === 'in_stock').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">الشركاء</p>
                <p className="text-3xl text-gray-900">{MOCK_PARTNERS.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">الفئات</p>
                <p className="text-3xl text-gray-900">{categories.length - 1}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-12"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'الكل' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {comparisonMode ? (
        /* Comparison Mode */
        <div className="space-y-6">
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => {
            const bestPrice = getBestPrice(category);
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category}</span>
                    <Badge variant="secondary">{categoryProducts.length} منتجات</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-4 font-semibold">الشريك</th>
                          <th className="text-right p-4 font-semibold">المنتج</th>
                          <th className="text-right p-4 font-semibold">السعر</th>
                          <th className="text-right p-4 font-semibold">الحالة</th>
                          <th className="text-right p-4 font-semibold">التوصيل</th>
                          <th className="text-right p-4 font-semibold">الضمان</th>
                          <th className="text-right p-4 font-semibold">التقييم</th>
                          <th className="text-right p-4 font-semibold">المواصفات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts
                          .sort((a, b) => a.price - b.price)
                          .map((product, index) => {
                            const availability = AVAILABILITY_LABELS[product.availability];
                            const AvailIcon = availability.icon;
                            const isBestPrice = product.price === bestPrice;
                            
                            return (
                              <tr 
                                key={product.id} 
                                className={`border-b hover:bg-gray-50 ${isBestPrice ? 'bg-green-50' : ''}`}
                              >
                                <td className="p-4">
                                  <p className="font-medium text-sm">{getPartnerName(product.partner_id)}</p>
                                </td>
                                <td className="p-4">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.sku}</p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-blue-600">
                                      {product.price.toLocaleString()} ج.م
                                    </span>
                                    {isBestPrice && (
                                      <Badge variant="default" className="bg-green-600">
                                        أفضل سعر
                                      </Badge>
                                    )}
                                    {index === 0 && !isBestPrice && (
                                      <TrendingUp className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                  {product.bulk_discount && product.bulk_discount.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      خصم {product.bulk_discount[0].discount_percentage}% من {product.bulk_discount[0].min_quantity} قطع
                                    </p>
                                  )}
                                </td>
                                <td className="p-4">
                                  <Badge className={availability.color}>
                                    <AvailIcon className="w-3 h-3 mr-1" />
                                    {availability.label}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1 text-sm">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{product.delivery_time_days} يوم</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm">{product.warranty_months / 12} سنة</span>
                                </td>
                                <td className="p-4">
                                  {product.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{product.rating}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4">
                                  <div className="text-xs space-y-1">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                      <div key={key} className="flex gap-2">
                                        <span className="text-gray-500">{key}:</span>
                                        <span className="font-medium">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const availability = AVAILABILITY_LABELS[product.availability];
            const AvailIcon = availability.icon;
            const bestPrice = getBestPrice(product.category);
            const isBestPrice = product.price === bestPrice;

            return (
              <Card key={product.id} className={`hover:shadow-lg transition-shadow ${isBestPrice ? 'border-2 border-green-500' : ''}`}>
                <CardContent className="p-6">
                  {isBestPrice && (
                    <Badge className="mb-3 bg-green-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      أفضل سعر في الفئة
                    </Badge>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600">{getPartnerName(product.partner_id)}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  <Badge variant="secondary" className="mb-4">{product.category}</Badge>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">السعر:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString()} ج.م
                      </span>
                    </div>

                    {product.bulk_discount && product.bulk_discount.length > 0 && (
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <p className="font-medium mb-1">خصومات الجملة:</p>
                        {product.bulk_discount.map((discount, idx) => (
                          <p key={idx} className="text-gray-700">
                            {discount.discount_percentage}% من {discount.min_quantity} قطعة
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <Badge className={availability.color}>
                        <AvailIcon className="w-3 h-3 mr-1" />
                        {availability.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">التوصيل:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{product.delivery_time_days} يوم</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الضمان:</span>
                      <span>{product.warranty_months / 12} سنة</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 mb-4">
                    <p className="text-sm font-medium mb-2">المواصفات:</p>
                    <div className="space-y-1 text-xs">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    إضافة إلى عرض السعر
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد منتجات مطابقة للبحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
