import { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  Plus, 
  Trash2, 
  Calculator, 
  Save, 
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import type { Partner, Product } from '../../types';

interface BarterItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export function Barter() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  
  // State for transaction
  const [ourItems, setOurItems] = useState<BarterItem[]>([]);
  const [partnerItems, setPartnerItems] = useState<BarterItem[]>([]);
  
  // Temporary inputs
  const [ourProductInput, setOurProductInput] = useState({ id: '', qty: 1 });
  const [partnerProductInput, setPartnerProductInput] = useState({ name: '', price: '', qty: 1 });

  useEffect(() => {
    // Load data
    const storedPartners = localStorage.getItem('erp_partners');
    const storedProducts = localStorage.getItem('erp_products');
    
    if (storedPartners) setPartners(JSON.parse(storedPartners));
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  const addToOurItems = () => {
    if (!ourProductInput.id) return;
    const product = products.find(p => p.id === ourProductInput.id);
    if (!product) return;

    const newItem: BarterItem = {
      id: product.id,
      name: product.name,
      quantity: Number(ourProductInput.qty),
      price: product.sell_price, // Use selling price for barter value
      total: product.sell_price * Number(ourProductInput.qty)
    };

    setOurItems([...ourItems, newItem]);
    setOurProductInput({ id: '', qty: 1 });
  };

  const addToPartnerItems = () => {
    if (!partnerProductInput.name || !partnerProductInput.price) return;

    const newItem: BarterItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: partnerProductInput.name,
      quantity: Number(partnerProductInput.qty),
      price: Number(partnerProductInput.price),
      total: Number(partnerProductInput.price) * Number(partnerProductInput.qty)
    };

    setPartnerItems([...partnerItems, newItem]);
    setPartnerProductInput({ name: '', price: '', qty: 1 });
  };

  const removeItem = (list: 'our' | 'partner', index: number) => {
    if (list === 'our') {
      const newItems = [...ourItems];
      newItems.splice(index, 1);
      setOurItems(newItems);
    } else {
      const newItems = [...partnerItems];
      newItems.splice(index, 1);
      setPartnerItems(newItems);
    }
  };

  // Calculations
  const totalGiven = ourItems.reduce((sum, item) => sum + item.total, 0);
  const totalReceived = partnerItems.reduce((sum, item) => sum + item.total, 0);
  const balance = totalReceived - totalGiven; // Positive: We owe them. Negative: They owe us.

  const handleSaveTransaction = () => {
    if (!selectedPartnerId) {
      toast.error('يرجى اختيار الشريك أولاً');
      return;
    }
    if (ourItems.length === 0 && partnerItems.length === 0) {
      toast.error('لا توجد عناصر في المعاملة');
      return;
    }

    toast.success('تم حفظ عملية التبادل بنجاح');
    // Here logic to save to DB would go
    setOurItems([]);
    setPartnerItems([]);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">نظام التبادل والمقاصة</h1>
          <p className="text-gray-500 mt-1">تسجيل مبادلات البضائع وحساب الفروقات المالية مع الشركاء</p>
        </div>
        
        <div className="w-full md:w-72">
          <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
            <SelectTrigger className="h-11 bg-white border-gray-200 shadow-sm">
              <SelectValue placeholder="اختر الشريك للبدء..." />
            </SelectTrigger>
            <SelectContent>
              {partners.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: What We Give */}
        <Card className="border-t-4 border-t-blue-600 shadow-sm">
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 rotate-45" />
              صادر من مخازننا
            </CardTitle>
            <CardDescription>المنتجات التي سيتم تسليمها للشريك</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2">
              <Select value={ourProductInput.id} onValueChange={(val) => setOurProductInput({...ourProductInput, id: val})}>
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="اختر منتج من المخزون" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.sell_price} ج.م)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="العدد" 
                className="w-20"
                min="1"
                value={ourProductInput.qty}
                onChange={e => setOurProductInput({...ourProductInput, qty: Number(e.target.value)})}
              />
              <Button onClick={addToOurItems} size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden min-h-[200px] bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-center w-20">العدد</TableHead>
                    <TableHead className="text-left">القيمة</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ourItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-left font-bold">{item.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeItem('our', idx)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t font-bold text-gray-700">
              <span>إجمالي الصادر:</span>
              <span className="text-xl text-blue-600">{totalGiven.toLocaleString()} ج.م</span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: What We Receive */}
        <Card className="border-t-4 border-t-emerald-600 shadow-sm">
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 -rotate-45" />
              وارد من الشريك
            </CardTitle>
            <CardDescription>المنتجات التي سنستلمها من الشريك</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="اسم المنتج..." 
                className="flex-1 bg-white"
                value={partnerProductInput.name}
                onChange={e => setPartnerProductInput({...partnerProductInput, name: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="السعر" 
                className="w-24 bg-white"
                value={partnerProductInput.price}
                onChange={e => setPartnerProductInput({...partnerProductInput, price: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="العدد" 
                className="w-20 bg-white"
                min="1"
                value={partnerProductInput.qty}
                onChange={e => setPartnerProductInput({...partnerProductInput, qty: Number(e.target.value)})}
              />
              <Button onClick={addToPartnerItems} size="icon" className="shrink-0 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden min-h-[200px] bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-center w-20">العدد</TableHead>
                    <TableHead className="text-left">القيمة</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-left font-bold">{item.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeItem('partner', idx)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-2 border-t font-bold text-gray-700">
              <span>إجمالي الوارد:</span>
              <span className="text-xl text-emerald-600">{totalReceived.toLocaleString()} ج.م</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Footer */}
      <Card className="bg-slate-900 text-white border-0 shadow-lg mt-8">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-slate-300 font-medium mb-1">صافي المعاملة</p>
                <div className="text-3xl font-black flex items-center gap-3">
                  {Math.abs(balance).toLocaleString()} ج.م
                  <Badge className={`text-base px-3 py-1 ${balance > 0 ? 'bg-red-500 hover:bg-red-600' : balance < 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}`}>
                    {balance > 0 ? 'علينا دفع' : balance < 0 ? 'لهم رصيد لدينا' : 'متوازنة'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none border-white/20 text-black hover:bg-white/10 hover:text-white bg-transparent h-12 px-6">
                <RefreshCw className="w-4 h-4 ml-2" />
                تصفية
              </Button>
              <Button onClick={handleSaveTransaction} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 font-bold shadow-lg shadow-blue-900/50">
                <Save className="w-4 h-4 ml-2" />
                حفظ وترحيل للحسابات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
