import { useEffect, useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Printer, 
  Eye, 
  MoreHorizontal,
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  FileText, 
  PieChart, 
  BarChart3,
  RefreshCw,
  LayoutDashboard,
  List,
  Shield,
  FileBarChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { initializeMockData } from '../../lib/mock-data';
import type { Sale, Branch, Product } from '../../types';

// --- Types & Interfaces ---

type ViewMode = 'admin' | 'accountant';

// --- Helper Components ---

const StatCard = ({ title, value, subtext, trend, icon: Icon, trendUp }: any) => (
  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white rounded-xl">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight font-numeric">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
        <span className="text-xs text-gray-400">{subtext}</span>
      </div>
    </CardContent>
  </Card>
);

const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// --- Main Component ---

export function Sales() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // View State
  const [viewMode, setViewMode] = useState<ViewMode>('admin'); // Default for demo, usually derived from user.role
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    initializeMockData();
    loadData();
    
    // Auto-set view mode based on role (Simulation)
    if (user?.role === 'accountant' || user?.role === 'cashier') {
      setViewMode('accountant');
      setActiveTab('list');
    } else {
      setViewMode('admin');
      setActiveTab('overview');
    }
  }, [user]);

  const loadData = () => {
    setSales(JSON.parse(localStorage.getItem('erp_sales') || '[]'));
    setBranches(JSON.parse(localStorage.getItem('erp_branches') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('erp_products') || '[]'));
  };

  // --- Derived Data & Analytics ---

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = 
        sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranch === 'all' || sale.branch_id === selectedBranch;
      const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;
      
      let matchesDate = true;
      if (dateRange.from) matchesDate = matchesDate && new Date(sale.created_at) >= new Date(dateRange.from);
      if (dateRange.to) matchesDate = matchesDate && new Date(sale.created_at) <= new Date(dateRange.to);

      return matchesSearch && matchesBranch && matchesStatus && matchesDate;
    });
  }, [sales, searchQuery, selectedBranch, selectedStatus, dateRange]);

  const stats = useMemo(() => {
    const total = filteredSales.reduce((sum, s) => sum + s.total_amount, 0);
    const count = filteredSales.length;
    const average = count > 0 ? total / count : 0;
    return { total, count, average };
  }, [filteredSales]);

  // Chart Data Preparation
  const dailyRevenueData = useMemo(() => {
    const data: Record<string, number> = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      data[date] = (data[date] || 0) + sale.total_amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).slice(-7); // Last 7 days
  }, [filteredSales]);

  const branchPerformanceData = useMemo(() => {
    return branches.map(branch => ({
      name: branch.name,
      value: filteredSales.filter(s => s.branch_id === branch.id).reduce((sum, s) => sum + s.total_amount, 0)
    })).filter(item => item.value > 0);
  }, [filteredSales, branches]);

  const statusDistributionData = useMemo(() => {
    const counts = {
      delivered: filteredSales.filter(s => s.status === 'delivered').length,
      pending: filteredSales.filter(s => s.status === 'pending').length,
      cancelled: filteredSales.filter(s => s.status === 'cancelled').length,
    };
    return [
      { name: 'تم التسليم', value: counts.delivered, color: '#10b981' },
      { name: 'قيد الانتظار', value: counts.pending, color: '#f59e0b' },
      { name: 'ملغي', value: counts.cancelled, color: '#ef4444' },
    ];
  }, [filteredSales]);

  // --- Formatters ---

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      pending: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100',
    };
    const labels: Record<string, string> = {
      delivered: 'تم التسليم',
      pending: 'قيد الانتظار',
      cancelled: 'ملغي',
    };
    return (
      <Badge variant="outline" className={`${styles[status] || ''} border font-bold`}>
        {labels[status] || status}
      </Badge>
    );
  };

  // --- Views ---

  // 1. Overview View (Admin Dashboard)
  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي المبيعات" 
          value={formatCurrency(stats.total)} 
          subtext="مقارنة بالشهر الماضي" 
          trend="+12.5%" 
          trendUp={true}
          icon={DollarSign}
        />
        <StatCard 
          title="عدد العمليات" 
          value={stats.count} 
          subtext="عملية بيع ناجحة" 
          trend="+5.2%" 
          trendUp={true}
          icon={Package}
        />
        <StatCard 
          title="متوسط السلة" 
          value={formatCurrency(stats.average)} 
          subtext="لكل عميل" 
          trend="-2.1%" 
          trendUp={false}
          icon={TrendingUp}
        />
        <StatCard 
          title="العملاء النشطين" 
          value={new Set(filteredSales.map(s => s.customer_name)).size} 
          subtext="عميل هذا الشهر" 
          trend="+8.4%" 
          trendUp={true}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>تحليل الإيرادات</CardTitle>
            <CardDescription>نظرة عامة على المبيعات اليومية لآخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>توزيع الحالات</CardTitle>
            <CardDescription>نسبة اكتمال الطلبات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // 2. Reports View (Comprehensive)
  const renderReports = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              أداء الفروع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchPerformanceData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              أعلى المنتجات مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">الكمية المباعة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Simplified logic for top products */}
                {Object.values(filteredSales.flatMap(s => s.items).reduce((acc: any, item) => {
                  if (!acc[item.product_id]) acc[item.product_id] = { name: item.product_name, qty: 0, total: 0 };
                  acc[item.product_id].qty += item.quantity;
                  acc[item.product_id].total += item.total;
                  return acc;
                }, {})).sort((a: any, b: any) => b.total - a.total).slice(0, 5).map((prod: any, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{prod.name}</TableCell>
                    <TableCell>{prod.qty}</TableCell>
                    <TableCell>{formatCurrency(prod.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>سجل النشاط المالي</CardTitle>
          <CardDescription>تحليل مفصل للإيرادات والخصومات</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="h-[400px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="الإيرادات" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>
    </div>
  );

  // 3. Sales List View (Accountant Friendly)
  const renderList = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="بحث برقم الفاتورة، اسم العميل..." 
            className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
              <SelectValue placeholder="الفرع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفروع</SelectItem>
              {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px] bg-gray-50 border-gray-200">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="delivered">تم التسليم</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[100px] text-right font-bold text-gray-700">رقم الفاتورة</TableHead>
                <TableHead className="text-right font-bold text-gray-700">العميل</TableHead>
                <TableHead className="text-right font-bold text-gray-700">التاريخ</TableHead>
                <TableHead className="text-right font-bold text-gray-700">الفرع</TableHead>
                <TableHead className="text-right font-bold text-gray-700">الحالة</TableHead>
                <TableHead className="text-right font-bold text-gray-700">الإجمالي</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    لا توجد بيانات للعرض
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                    <TableCell className="font-mono text-xs text-gray-500">{sale.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{sale.customer_name}</div>
                      <div className="text-xs text-gray-500">{sale.customer_tier === 'permanent' ? 'عميل دائم' : 'عميل عادي'}</div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{formatDate(sale.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal bg-gray-100 hover:bg-gray-200 text-gray-700">
                        {branches.find(b => b.id === sale.branch_id)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell className="font-bold text-gray-900">{formatCurrency(sale.total_amount)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" /> عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Printer className="w-4 h-4" /> طباعة الفاتورة
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-rose-600">
                            <Shield className="w-4 h-4" /> إلغاء العملية
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50/30 flex justify-between items-center text-xs text-gray-500 font-medium">
          <span>عرض {filteredSales.length} من أصل {sales.length} فاتورة</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>السابق</Button>
            <Button variant="outline" size="sm" disabled>التالي</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-8 min-h-screen bg-gray-50/50">
      {/* Role Switcher (Simulation for UX Demo) */}
      <div className="fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200 flex gap-2 scale-75 origin-top-left opacity-50 hover:opacity-100 transition-opacity">
        <Button 
          variant={viewMode === 'admin' ? 'default' : 'outline'} 
          size="xs" 
          onClick={() => { setViewMode('admin'); setActiveTab('overview'); }}
        >
          Admin View
        </Button>
        <Button 
          variant={viewMode === 'accountant' ? 'default' : 'outline'} 
          size="xs" 
          onClick={() => { setViewMode('accountant'); setActiveTab('list'); }}
        >
          Accountant View
        </Button>
      </div>

      <SectionHeader 
        title="إدارة المبيعات" 
        subtitle={viewMode === 'admin' ? 'لوحة تحكم وتحليلات الأداء الشاملة' : 'سجل الفواتير والعمليات اليومية'}
        action={
          <div className="flex gap-3">
            <Button variant="outline" className="h-10 border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 shadow-md">
              <Plus className="w-4 h-4 ml-2" />
              فاتورة جديدة
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 border border-gray-200 rounded-xl shadow-sm h-12 w-full md:w-auto grid grid-cols-2 md:inline-flex md:grid-cols-none">
          {viewMode === 'admin' && (
            <>
              <TabsTrigger value="overview" className="h-9 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold">
                <LayoutDashboard className="w-4 h-4 ml-2" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="reports" className="h-9 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold">
                <FileBarChart className="w-4 h-4 ml-2" />
                التقارير
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="list" className="h-9 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold">
            <List className="w-4 h-4 ml-2" />
            سجل المبيعات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="focus-visible:outline-none">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="reports" className="focus-visible:outline-none">
          {renderReports()}
        </TabsContent>

        <TabsContent value="list" className="focus-visible:outline-none">
          {renderList()}
        </TabsContent>
      </Tabs>
    </div>
  );
}