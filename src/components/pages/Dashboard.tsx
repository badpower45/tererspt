import { useEffect, useState } from 'react';
import { TrendingUp, Package, ShoppingCart, AlertCircle, Wrench, Building2 } from 'lucide-react';
import { initializeMockData } from '../../lib/mock-data';
import type { Product, Inventory, Sale, Installation, ShortageRequest, DashboardStats } from '../../types';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_inventory_value: 0,
    total_sales_today: 0,
    total_sales_month: 0,
    pending_shortages: 0,
    active_installations: 0,
    low_stock_items: 0,
  });

  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Array<{ product: Product; inventory: Inventory }>>([]);

  useEffect(() => {
    initializeMockData();
    calculateStats();
  }, []);

  const calculateStats = () => {
    const products: Product[] = JSON.parse(localStorage.getItem('erp_products') || '[]');
    const inventory: Inventory[] = JSON.parse(localStorage.getItem('erp_inventory') || '[]');
    const sales: Sale[] = JSON.parse(localStorage.getItem('erp_sales') || '[]');
    const installations: Installation[] = JSON.parse(localStorage.getItem('erp_installations') || '[]');
    const shortages: ShortageRequest[] = JSON.parse(localStorage.getItem('erp_shortages') || '[]');

    // Calculate total inventory value
    const totalInventoryValue = inventory.reduce((sum, inv) => {
      const product = products.find(p => p.id === inv.product_id);
      return sum + (product ? product.cost_price * inv.quantity : 0);
    }, 0);

    // Calculate sales for today
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales
      .filter(s => s.created_at.startsWith(today))
      .reduce((sum, s) => sum + s.total_amount, 0);

    // Calculate sales for this month
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthSales = sales
      .filter(s => s.created_at.startsWith(currentMonth))
      .reduce((sum, s) => sum + s.total_amount, 0);

    // Count pending shortages
    const pendingShortages = shortages.filter(s => s.status === 'requested').length;

    // Count active installations
    const activeInstallations = installations.filter(i => i.status === 'in_progress' || i.status === 'scheduled').length;

    // Find low stock items
    const lowStock = inventory.filter(inv => inv.quantity <= inv.min_stock_level);
    const lowStockWithProducts = lowStock.map(inv => {
      const product = products.find(p => p.id === inv.product_id);
      return { product: product!, inventory: inv };
    }).filter(item => item.product);

    setStats({
      total_inventory_value: totalInventoryValue,
      total_sales_today: todaySales,
      total_sales_month: monthSales,
      pending_shortages: pendingShortages,
      active_installations: activeInstallations,
      low_stock_items: lowStock.length,
    });

    // Get recent sales
    const sortedSales = [...sales].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5);
    setRecentSales(sortedSales);

    // Set low stock items
    setLowStockItems(lowStockWithProducts.slice(0, 5));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ icon: Icon, label, value, color, subtitle }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-xs sm:text-sm text-slate-600 mb-1">{label}</p>
        <p className="text-lg sm:text-2xl text-slate-900 mb-1 truncate">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl text-slate-900">لوحة التحكم</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">نظرة عامة على النشاطات والمبيعات</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Package}
          label="قيمة المخزون الإجمالية"
          value={formatCurrency(stats.total_inventory_value)}
          color="bg-slate-900"
          subtitle="في جميع الفروع"
        />
        <StatCard
          icon={ShoppingCart}
          label="مبيعات الشهر"
          value={formatCurrency(stats.total_sales_month)}
          color="bg-green-600"
          subtitle={`اليوم: ${formatCurrency(stats.total_sales_today)}`}
        />
        <StatCard
          icon={TrendingUp}
          label="التركيبات النشطة"
          value={stats.active_installations}
          color="bg-blue-600"
          subtitle="قيد التنفيذ والجدولة"
        />
        <StatCard
          icon={AlertCircle}
          label="منتجات منخفضة المخزون"
          value={stats.low_stock_items}
          color="bg-red-600"
          subtitle="تحت الحد الأدنى"
        />
        <StatCard
          icon={Building2}
          label="طلبات النقص المعلقة"
          value={stats.pending_shortages}
          color="bg-amber-600"
          subtitle="من الفروع"
        />
        <StatCard
          icon={Wrench}
          label="إيرادات التركيبات"
          value={formatCurrency(450000)}
          color="bg-purple-600"
          subtitle="هذا الشهر"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg text-slate-900">المبيعات الأخيرة</h2>
            <button className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">عرض الكل</button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 text-center py-6 sm:py-8">لا توجد مبيعات مسجلة</p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-900 truncate">{sale.customer_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(sale.created_at).toLocaleDateString('ar-EG')} • {sale.items.length} منتجات
                    </p>
                  </div>
                  <div className="text-right mr-3 sm:mr-4 flex-shrink-0">
                    <p className="text-xs sm:text-sm text-slate-900 whitespace-nowrap">{formatCurrency(sale.total_amount)}</p>
                    <span className={`inline-block px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                      sale.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      sale.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {sale.status === 'delivered' ? 'مُسلّم' : sale.status === 'pending' ? 'معلق' : sale.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg text-slate-900">تنبيهات المخزون</h2>
            <button className="text-xs sm:text-sm text-slate-600 hover:text-slate-900">عرض الكل</button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">جميع المخزونات بمستويات جيدة</p>
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.inventory.id} className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-500">
                      الفرع: {item.inventory.branch_id.replace('br-', '').toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right mr-3 sm:mr-4 flex-shrink-0">
                    <p className="text-xs sm:text-sm text-red-700 whitespace-nowrap">{item.inventory.quantity} {item.product.unit}</p>
                    <p className="text-xs text-slate-500">الحد الأدنى: {item.inventory.min_stock_level}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg text-slate-900 mb-4 sm:mb-6">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button className="p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-slate-900">إضافة منتج</p>
          </button>
          <button className="p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-slate-900">بيع جديد</p>
          </button>
          <button className="p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-slate-900">تركيب جديد</p>
          </button>
          <button className="p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-slate-900">عرض الفروع</p>
          </button>
        </div>
      </div>
    </div>
  );
}