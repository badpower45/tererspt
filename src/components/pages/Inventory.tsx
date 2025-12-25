import { useEffect, useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { initializeMockData } from '../../lib/mock-data';
import type { Product, Inventory as InventoryType, Branch } from '../../types';

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeMockData();
    loadData();
  }, []);

  const loadData = () => {
    setInventory(JSON.parse(localStorage.getItem('erp_inventory') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('erp_products') || '[]'));
    setBranches(JSON.parse(localStorage.getItem('erp_branches') || '[]'));
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown';
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || 'Unknown';
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const filteredInventory = inventory.filter(inv => {
    const product = getProduct(inv.product_id);
    const matchesSearch = !searchTerm || 
      getProductName(inv.product_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || inv.branch_id === selectedBranch;
    return matchesSearch && matchesBranch && product;
  });

  const totalInventoryValue = filteredInventory.reduce((sum, inv) => {
    const product = getProduct(inv.product_id);
    return sum + (product ? product.cost_price * inv.quantity : 0);
  }, 0);

  const lowStockCount = filteredInventory.filter(inv => inv.quantity <= inv.min_stock_level).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Track stock levels across all branches</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
              <p className="text-gray-900">{formatCurrency(totalInventoryValue)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-gray-900">{filteredInventory.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-gray-900">{lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Min Level</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((inv) => {
                const product = getProduct(inv.product_id);
                if (!product) return null;
                const isLowStock = inv.quantity <= inv.min_stock_level;
                const value = product.cost_price * inv.quantity;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{getBranchName(inv.branch_id)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{inv.quantity} {product.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{inv.min_stock_level} {product.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{formatCurrency(value)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
