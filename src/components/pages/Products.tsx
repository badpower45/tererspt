import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, Eye } from 'lucide-react';
import { initializeMockData } from '../../lib/mock-data';
import type { Product, ProductCategory } from '../../types';
import { ProductDetailsModal } from '../shared/ProductDetailsModal';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    initializeMockData();
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  const loadProducts = () => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem('erp_products') || '[]');
    setProducts(storedProducts);
    setFilteredProducts(storedProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const getCategoryLabel = (category: ProductCategory) => {
    const labels: Record<ProductCategory, string> = {
      factory1_chassis: 'مصنع 1 - هياكل',
      factory1_panel: 'مصنع 1 - ألواح',
      factory2_cable_dc: 'مصنع 2 - كابلات DC',
      factory2_cable_ac: 'مصنع 2 - كابلات AC',
      import_solar_panel: 'مستورد - ألواح شمسية',
      partner_inverter: 'شريك - محولات',
    };
    return labels[category];
  };

  const getCategoryColor = (category: ProductCategory) => {
    const colors: Record<ProductCategory, string> = {
      factory1_chassis: 'bg-slate-100 text-slate-700',
      factory1_panel: 'bg-slate-100 text-slate-700',
      factory2_cable_dc: 'bg-blue-100 text-blue-700',
      factory2_cable_ac: 'bg-blue-100 text-blue-700',
      import_solar_panel: 'bg-green-100 text-green-700',
      partner_inverter: 'bg-amber-100 text-amber-700',
    };
    return colors[category];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-slate-900">إدارة المنتجات</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">إدارة جميع المنتجات من المصانع والمستوردات والشركاء</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>إضافة منتج</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="بحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white text-sm"
            >
              <option value="all">جميع الفئات</option>
              <option value="factory1_chassis">مصنع 1 - هياكل</option>
              <option value="factory1_panel">مصنع 1 - ألواح</option>
              <option value="factory2_cable_dc">مصنع 2 - كابلات DC</option>
              <option value="factory2_cable_ac">مصنع 2 - كابلات AC</option>
              <option value="import_solar_panel">مستورد - ألواح شمسية</option>
              <option value="partner_inverter">شريك - محولات</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 mb-1">إجمالي المنتجات</p>
          <p className="text-xl sm:text-2xl text-slate-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 mb-1">منتجات المصانع</p>
          <p className="text-xl sm:text-2xl text-slate-900">
            {products.filter(p => p.category.startsWith('factory')).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 mb-1">منتجات مستوردة</p>
          <p className="text-xl sm:text-2xl text-slate-900">
            {products.filter(p => p.category.startsWith('import')).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-600 mb-1">منتجات الشركاء</p>
          <p className="text-xl sm:text-2xl text-slate-900">
            {products.filter(p => p.category.startsWith('partner')).length}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-slate-600">لا توجد منتجات</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base text-slate-900 mb-1 truncate">{product.name}</h3>
                  {product.brand && (
                    <p className="text-xs sm:text-sm text-slate-500">{product.brand}</p>
                  )}
                </div>
                <div className="mr-2 flex gap-1.5 sm:gap-2 flex-shrink-0">
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${getCategoryColor(product.category)}`}>
                  {getCategoryLabel(product.category)}
                </span>
              </div>

              {/* Specifications */}
              <div className="mb-4 space-y-2">
                <p className="text-xs text-slate-500">المواصفات:</p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-slate-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">سعر التكلفة:</span>
                  <span className="text-slate-900">{formatCurrency(product.cost_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">سعر البيع:</span>
                  <span className="text-green-700">{formatCurrency(product.sell_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">الحد الأدنى:</span>
                  <span className="text-red-700">{formatCurrency(product.min_sell_price)}</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                  <span className="text-slate-500">هامش الربح:</span>
                  <span className="text-blue-600">
                    {((product.sell_price - product.cost_price) / product.cost_price * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>عرض جميع التفاصيل</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-slate-900">إضافة منتج جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <p className="text-slate-600 text-center py-8">
              سيتم إضافة نموذج إنشاء المنتج هنا مع جميع الحقول المطلوبة.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                إضافة منتج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={showDetailsModal}
        onClose={handleCloseDetails}
      />
    </div>
  );
}