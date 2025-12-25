import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/auth/Login';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/pages/Dashboard';
import { Products } from './components/pages/Products';
import { Inventory } from './components/pages/Inventory';
import { Sales } from './components/pages/Sales';
import { Partners } from './components/pages/Partners';
import { Installations } from './components/pages/Installations';
import { Branches } from './components/pages/Branches';
import { Barter } from './components/pages/Barter';
import { Settings } from './components/pages/Settings';
import { GeneralPOS } from './components/pages/GeneralPOS';
import { PartnerProducts } from './components/pages/PartnerProducts';
import { hasPermission } from './lib/permissions';

export type PageType = 
  | 'dashboard' 
  | 'products' 
  | 'inventory' 
  | 'sales' 
  | 'partners'
  | 'partner-products'
  | 'installations' 
  | 'branches' 
  | 'barter'
  | 'pos'
  | 'settings';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // إذا لم يكن المستخدم مسجل دخول، عرض شاشة تسجيل الدخول
  if (!isAuthenticated) {
    return <Login />;
  }

  // التحقق من الصلاحيات قبل عرض الصفحة
  const canAccessPage = (page: PageType): boolean => {
    if (!user) return false;
    
    const permissionMap: Record<PageType, string> = {
      'dashboard': 'can_view_dashboard',
      'products': 'can_manage_products',
      'inventory': 'can_manage_inventory',
      'sales': 'can_create_sales',
      'partners': 'can_manage_partners',
      'partner-products': 'can_manage_partners',
      'barter': 'can_manage_barter',
      'installations': 'can_manage_installations',
      'branches': 'can_manage_branches',
      'pos': 'can_use_pos',
      'settings': 'can_view_dashboard',
    };

    const requiredPermission = permissionMap[page];
    return requiredPermission ? hasPermission(user.role, requiredPermission as any) : true;
  };

  const renderPage = () => {
    // للكاشير، إظهار POS مباشرة
    if (user?.role === 'cashier') {
      return <GeneralPOS />;
    }

    // التحقق من الصلاحية
    if (!canAccessPage(currentPage)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ليس لديك صلاحية الوصول</h2>
            <p className="text-gray-600">لا تملك الصلاحيات اللازمة لعرض هذه الصفحة</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      case 'partners':
        return <Partners />;
      case 'partner-products':
        return <PartnerProducts />;
      case 'installations':
        return <Installations />;
      case 'branches':
        return <Branches />;
      case 'barter':
        return <Barter />;
      case 'pos':
        return <GeneralPOS />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex" dir="rtl">
      {/* Desktop Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:mr-64' : 'lg:mr-20'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl text-slate-900 truncate">نظام AddValues ERP</h1>
                <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">نظام إدارة الطاقة الشمسية المتكامل</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 hover:bg-slate-50 rounded-lg relative transition-colors group hidden sm:block">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-2 sm:px-3 py-2 rounded-lg border border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm text-slate-900 truncate max-w-[120px]">{user?.full_name}</p>
                  <p className="text-xs text-slate-600 truncate">{user?.branch_id || 'المقر الرئيسي'}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors flex-shrink-0"
                  title="تسجيل الخروج"
                >
                  <span className="text-white text-xs sm:text-sm">{user?.full_name.charAt(0)}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 pb-20 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {user?.role !== 'cashier' && (
        <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;