import { useState, useEffect, useRef } from 'react';
import { printElement } from '../../lib/print';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Printer, 
  User, 
  MapPin,
  Package,
  History,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { InvoiceTemplate } from '../shared/InvoiceTemplate';
import { toast } from 'sonner';
import type { Product, Sale, SaleItem } from '../../types';

export function GeneralPOS() {
  const { user } = useAuth();
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transaction State
  const [customerName, setCustomerName] = useState('عميل نقدي');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // Print Ref
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    if (invoiceRef.current) {
      printElement(invoiceRef.current, `Invoice-${Date.now()}`);
      toast.success('تم إرسال أمر الطباعة');
    }
  };

  useEffect(() => {
    const storedProducts = localStorage.getItem('erp_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Mock Products if empty
      setProducts([
        { id: '1', name: 'لوح شمسي 550 وات', category: 'factory1_panel', sell_price: 4500, unit: 'piece', specifications: {}, cost_price: 3800, min_sell_price: 4000, created_at: '', updated_at: '' },
        { id: '2', name: 'انفرتر 5 كيلو', category: 'partner_inverter', sell_price: 25000, unit: 'piece', specifications: {}, cost_price: 22000, min_sell_price: 23000, created_at: '', updated_at: '' },
        { id: '3', name: 'كابلات DC 6mm', category: 'factory2_cable_dc', sell_price: 25, unit: 'meter', specifications: {}, cost_price: 18, min_sell_price: 20, created_at: '', updated_at: '' },
      ]);
    }
  }, []);

  // Filter Products
  const filteredProducts = products.filter(p => 
    (selectedCategory === 'all' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unit_price }
            : item
        );
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.sell_price,
        total: product.sell_price
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.unit_price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      branch_id: user?.branch_id || 'MAIN_BRANCH',
      customer_name: customerName,
      customer_tier: 'standard',
      items: cart,
      total_amount: totalAmount,
      status: 'delivered',
      created_by: user?.username || 'user',
      created_at: new Date().toISOString(),
      delivered_at: new Date().toISOString()
    };

    // Save to LocalStorage (Mock DB)
    const existingSales = JSON.parse(localStorage.getItem('erp_sales') || '[]');
    localStorage.setItem('erp_sales', JSON.stringify([newSale, ...existingSales]));

    setLastSale(newSale);
    setCart([]);
    setCustomerName('عميل نقدي');
    toast.success('تم تسجيل العملية بنجاح');
    
    // Auto print trigger could go here
    setTimeout(() => {
        // Optional: automatically prompt print
        // handlePrint();
    }, 500);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-3 sm:gap-4 animate-fade-in">
      
      {/* LEFT SIDE: Product Catalog */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
        {/* Top Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl text-gray-900">نظام الفرع</h1>
              <p className="text-xs text-gray-500 truncate">نقطة بيع وإصدار فواتير - {user?.branch_id || 'الفرع الرئيسي'}</p>
            </div>
          </div>
          
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-all h-10 sm:h-11 text-sm"
              placeholder="بحث سريع عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'} 
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 whitespace-nowrap ${selectedCategory === 'all' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-white'}`}
          >
            الكل
          </Button>
          <Button 
            variant={selectedCategory === 'factory1_panel' ? 'default' : 'outline'} 
            onClick={() => setSelectedCategory('factory1_panel')}
            className={`rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 whitespace-nowrap ${selectedCategory === 'factory1_panel' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-white'}`}
          >
            ألواح شمسية
          </Button>
          <Button 
            variant={selectedCategory === 'partner_inverter' ? 'default' : 'outline'} 
            onClick={() => setSelectedCategory('partner_inverter')}
            className={`rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 whitespace-nowrap ${selectedCategory === 'partner_inverter' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-white'}`}
          >
            إنفرترات
          </Button>
          <Button 
            variant={selectedCategory === 'eggs' ? 'default' : 'outline'} 
            onClick={() => setSelectedCategory('eggs')}
            className={`rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 whitespace-nowrap ${selectedCategory === 'eggs' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-white'}`}
          >
            منتجات أخرى
          </Button>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pb-2">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group overflow-hidden border-gray-200"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative">
                 <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-300 group-hover:scale-110 transition-transform" />
                 <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-white/90 backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs text-gray-600 shadow-sm">
                   {product.sell_price.toLocaleString()} ج.م
                 </div>
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="text-gray-900 line-clamp-2 text-xs sm:text-sm h-8 sm:h-10">{product.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">متاح في المخزون</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Cart & Checkout */}
      <div className="w-full lg:w-[380px] xl:w-[400px] flex flex-col gap-3 sm:gap-4 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 fixed bottom-0 left-0 right-0 lg:relative z-10 shadow-2xl lg:shadow-none rounded-t-2xl lg:rounded-none max-h-[70vh] lg:max-h-none">
        
        {/* Customer Info */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-600">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            بيانات العميل
          </div>
          <Input 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-white border-gray-200 h-9 sm:h-10 text-sm"
            placeholder="اسم العميل..."
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 opacity-50 py-8">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16" />
              <p className="text-sm">السلة فارغة</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white border border-gray-100 rounded-lg sm:rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-xs sm:text-sm truncate">{item.product_name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{item.unit_price.toLocaleString()} ج.م / وحدة</p>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 rounded-lg p-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 rounded-md hover:bg-white shadow-sm" onClick={() => updateQuantity(item.product_id, -1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs sm:text-sm w-4 sm:w-5 text-center">{item.quantity}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 rounded-md hover:bg-white shadow-sm" onClick={() => updateQuantity(item.product_id, 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-left min-w-[50px] sm:min-w-[60px]">
                  <p className="text-blue-600 text-xs sm:text-sm">{item.total.toLocaleString()}</p>
                </div>
                
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500 h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" onClick={() => removeFromCart(item.product_id)}>
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals */}
        <div className="p-3 sm:p-4 bg-gray-900 text-white mt-auto rounded-t-xl sm:rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <span className="text-gray-400 text-xs sm:text-sm">الإجمالي النهائي</span>
            <span className="text-xl sm:text-2xl lg:text-3xl tracking-tight">{totalAmount.toLocaleString()} <span className="text-sm sm:text-base lg:text-lg text-gray-500 font-normal">ج.م</span></span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {lastSale ? (
              <>
                 <Button onClick={handlePrint} className="col-span-1 bg-white text-black hover:bg-gray-100 h-10 sm:h-12 text-xs sm:text-sm">
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  طباعة الفاتورة
                </Button>
                <Button onClick={() => setLastSale(null)} variant="outline" className="col-span-1 border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 text-xs sm:text-sm">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  عملية جديدة
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 h-10 sm:h-12 text-xs sm:text-sm">
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  دفع شبكة
                </Button>
                <Button onClick={handleCheckout} disabled={cart.length === 0} className="bg-blue-600 hover:bg-blue-500 text-white h-10 sm:h-12 shadow-lg shadow-blue-900/50 text-xs sm:text-sm">
                  <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  دفع كاش
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Invisible Print Component */}
      <div className="hidden">
        {lastSale && (
          <InvoiceTemplate 
            ref={invoiceRef} 
            sale={lastSale} 
            branchName={user?.branch_id || 'الفرع الرئيسي'} 
          />
        )}
      </div>

    </div>
  );
}