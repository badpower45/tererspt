import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Store, 
  Phone, 
  Mail, 
  ExternalLink, 
  Package, 
  MoreHorizontal, 
  Globe,
  Trash2,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Partner, PartnerProduct } from '../../types';

export function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // حالة إضافة منتج جديد للشريك
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    price: '',
    sku: ''
  });

  useEffect(() => {
    // تحميل بيانات تجريبية
    const storedPartners = localStorage.getItem('erp_partners');
    if (storedPartners) {
      setPartners(JSON.parse(storedPartners));
    } else {
      // بيانات وهمية للبدء
      const mockPartners: Partner[] = [
        {
          id: '1',
          name: 'شركة الشمس المتطورة',
          contact_person: 'أحمد محمد',
          email: 'ahmed@sun-tech.com',
          phone: '01001234567',
          created_at: new Date().toISOString(),
          products: [
            { id: 'p1', partner_id: '1', product_id: 'inv-1', partner_price: 15000, specifications: { name: 'Inverter Growatt 5KW' } },
            { id: 'p2', partner_id: '1', product_id: 'pan-1', partner_price: 4500, specifications: { name: 'Solar Panel 550W' } }
          ]
        },
        {
          id: '2',
          name: 'طاقة المستقبل',
          contact_person: 'سارة علي',
          email: 'sara@future-energy.eg',
          phone: '01229876543',
          created_at: new Date().toISOString(),
          products: []
        }
      ];
      setPartners(mockPartners);
      localStorage.setItem('erp_partners', JSON.stringify(mockPartners));
    }
  }, []);

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchWeb = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query + ' solar price egypt')}`, '_blank');
  };

  const handleAddProduct = () => {
    if (!selectedPartner || !newProductForm.name) return;

    const newProduct: PartnerProduct = {
      id: Math.random().toString(36).substr(2, 9),
      partner_id: selectedPartner.id,
      product_id: Math.random().toString(36).substr(2, 9), // Temporary ID
      partner_price: Number(newProductForm.price) || 0,
      specifications: { name: newProductForm.name, sku: newProductForm.sku }
    };

    const updatedPartners = partners.map(p => {
      if (p.id === selectedPartner.id) {
        return { ...p, products: [...p.products, newProduct] };
      }
      return p;
    });

    setPartners(updatedPartners);
    setSelectedPartner({ ...selectedPartner, products: [...selectedPartner.products, newProduct] });
    localStorage.setItem('erp_partners', JSON.stringify(updatedPartners));
    
    setNewProductForm({ name: '', price: '', sku: '' });
    toast.success('تم إضافة المنتج لقائمة الشريك');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">إدارة الشركاء</h1>
          <p className="text-gray-500 mt-1">قاعدة بيانات الموردين وكتالوجات المنتجات الخارجية</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4 ml-2" />
          شريك جديد
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="بحث عن شركة، مورد، أو شخص..." 
          className="pr-10 h-11 bg-white border-gray-200 focus:border-blue-500 rounded-lg shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map(partner => (
          <Card key={partner.id} className="hover:border-blue-300 transition-colors cursor-pointer group shadow-sm" onClick={() => {
            setSelectedPartner(partner);
            setIsDetailOpen(true);
          }}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">{partner.name}</CardTitle>
                  <CardDescription className="text-xs">{partner.contact_person}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                {partner.products.length} منتج
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span dir="ltr">{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{partner.email}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium group-hover:underline">عرض الكتالوج</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl border-b pb-4">
              <Store className="w-6 h-6 text-blue-600" />
              {selectedPartner?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">المسؤول</p>
                <p className="font-bold text-gray-900">{selectedPartner?.contact_person}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">الهاتف</p>
                <p className="font-bold text-gray-900" dir="ltr">{selectedPartner?.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">البريد الإلكتروني</p>
                <p className="font-bold text-gray-900">{selectedPartner?.email}</p>
              </div>
            </div>

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  منتجات الشريك
                </h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="اسم المنتج..." 
                    className="h-9 w-48 text-sm"
                    value={newProductForm.name}
                    onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                  />
                  <Input 
                    placeholder="السعر..." 
                    type="number"
                    className="h-9 w-24 text-sm"
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({...newProductForm, price: e.target.value})}
                  />
                  <Button size="sm" onClick={handleAddProduct} className="h-9 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-right">اسم المنتج</TableHead>
                      <TableHead className="text-right">السعر عند الشريك</TableHead>
                      <TableHead className="text-right">بحث خارجي</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPartner?.products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          لا توجد منتجات مسجلة لهذا الشريك
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedPartner?.products.map((prod, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{prod.specifications.name}</TableCell>
                          <TableCell>{prod.partner_price.toLocaleString()} ج.م</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700 h-8"
                              onClick={() => handleSearchWeb(prod.specifications.name)}
                            >
                              <Globe className="w-4 h-4 ml-1" />
                              بحث النت
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
