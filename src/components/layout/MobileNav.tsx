import { LayoutDashboard, Package, Warehouse, ShoppingCart, ShoppingBag } from 'lucide-react';
import type { PageType } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../lib/permissions';

interface MobileNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const { user } = useAuth();

  const mainItems = [
    { id: 'dashboard' as PageType, label: 'الرئيسية', icon: LayoutDashboard, permission: 'can_view_dashboard' },
    { id: 'pos' as PageType, label: 'نقطة البيع', icon: ShoppingBag, permission: 'can_use_pos' },
    { id: 'sales' as PageType, label: 'المبيعات', icon: ShoppingCart, permission: 'can_create_sales' },
    { id: 'inventory' as PageType, label: 'المخزون', icon: Warehouse, permission: 'can_manage_inventory' },
    { id: 'products' as PageType, label: 'المنتجات', icon: Package, permission: 'can_manage_products' },
  ];

  // فلترة القوائم بناءً على الصلاحيات
  const filteredItems = mainItems.filter(item => {
    if (!user) return false;
    return hasPermission(user.role, item.permission as any);
  }).slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around px-1 py-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-0 flex-1 max-w-[80px] ${
                isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] leading-tight truncate w-full text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}