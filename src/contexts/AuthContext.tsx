import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { getPermissions } from '../lib/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users للتجربة (في الواقع سيتم جلبها من API)
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    full_name: 'محمد السيد',
    email: 'admin@addvalues.com',
    phone: '+20123456789',
    role: 'super_admin',
    password_hash: 'admin123', // في الواقع سيتم تشفيره
    is_active: true,
    can_override_price: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'branch1',
    full_name: 'أحمد علي',
    email: 'branch1@addvalues.com',
    phone: '+20123456790',
    role: 'branch_manager',
    branch_id: 'branch-1',
    password_hash: 'branch123',
    is_active: true,
    can_override_price: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'sales1',
    full_name: 'خالد محمود',
    email: 'sales@addvalues.com',
    phone: '+20123456791',
    role: 'sales_manager',
    password_hash: 'sales123',
    is_active: true,
    can_override_price: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'cashier1',
    full_name: 'فاطمة حسن',
    email: 'cashier@addvalues.com',
    phone: '+20123456792',
    role: 'cashier',
    branch_id: 'branch-1',
    password_hash: 'cashier123',
    is_active: true,
    can_override_price: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    username: 'inventory1',
    full_name: 'سارة أحمد',
    email: 'inventory@addvalues.com',
    phone: '+20123456793',
    role: 'inventory_manager',
    password_hash: 'inventory123',
    is_active: true,
    can_override_price: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    username: 'partner1',
    full_name: 'يوسف إبراهيم',
    email: 'partner@addvalues.com',
    phone: '+20123456794',
    role: 'partner_manager',
    password_hash: 'partner123',
    is_active: true,
    can_override_price: false,
    created_at: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من الجلسة المحفوظة عند تحميل التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // في الواقع سيتم التحقق من API
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password_hash === password && u.is_active
    );

    if (foundUser) {
      const userToSave = {
        ...foundUser,
        last_login: new Date().toISOString(),
      };
      setUser(userToSave);
      localStorage.setItem('auth_user', JSON.stringify(userToSave));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = getPermissions(user.role);
    return permissions[permission as keyof typeof permissions] === true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
