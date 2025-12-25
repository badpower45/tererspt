import { LayoutDashboard, Package, Warehouse, ShoppingCart, Users, Wrench, Building2, ArrowLeftRight, Settings, ChevronLeft, ChevronRight, ShoppingBag, GitCompare } from 'lucide-react';
import type { PageType } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../lib/permissions';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard' as PageType, label: 'لوحة التحكم', icon: LayoutDashboard, permission: 'can_view_dashboard' },
    { id: 'pos' as PageType, label: 'نقطة البيع', icon: ShoppingBag, permission: 'can_use_pos' },
    { id: 'sales' as PageType, label: 'المبيعات', icon: ShoppingCart, permission: 'can_create_sales' },
    { id: 'products' as PageType, label: 'المنتجات', icon: Package, permission: 'can_manage_products' },
    { id: 'inventory' as PageType, label: 'المخزون', icon: Warehouse, permission: 'can_manage_inventory' },
    { id: 'partners' as PageType, label: 'الشركاء', icon: Users, permission: 'can_manage_partners' },
    { id: 'partner-products' as PageType, label: 'منتجات الشراكات', icon: GitCompare, permission: 'can_manage_partners' },
    { id: 'barter' as PageType, label: 'نظام التبادل', icon: ArrowLeftRight, permission: 'can_manage_barter' },
    { id: 'installations' as PageType, label: 'التركيبات', icon: Wrench, permission: 'can_manage_installations' },
    { id: 'branches' as PageType, label: 'الفروع', icon: Building2, permission: 'can_manage_branches' },
    { id: 'settings' as PageType, label: 'الإعدادات', icon: Settings, permission: null },
  ];

  // فلترة القوائم بناءً على الصلاحيات
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    if (!user) return false;
    return hasPermission(user.role, item.permission as any);
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-30 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
            {isOpen ? (
              <>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs sm:text-base">AV</span>
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm text-slate-900">AddValues</h2>
                    <p className="text-[10px] sm:text-xs text-slate-600">ERP System</p>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="hidden lg:block p-1.5 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggle}
                className="hidden lg:block w-full flex justify-center p-1.5 hover:bg-slate-50 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 sm:py-4">
            <ul className="space-y-1 px-2 sm:px-3">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                      {isOpen && (
                        <span className={`text-xs sm:text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info at Bottom */}
          {isOpen && user && (
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 p-2 sm:p-3 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm text-white">{user.full_name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 truncate">{user.full_name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}