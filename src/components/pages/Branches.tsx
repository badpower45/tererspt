import { useEffect, useState } from 'react';
import { Building2, MapPin, User, Phone, TrendingUp, AlertCircle } from 'lucide-react';
import { initializeMockData } from '../../lib/mock-data';
import type { Branch, Inventory, Sale, ShortageRequest, Product } from '../../types';

export function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [shortages, setShortages] = useState<ShortageRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  useEffect(() => {
    initializeMockData();
    loadData();
  }, []);

  const loadData = () => {
    const loadedBranches = JSON.parse(localStorage.getItem('erp_branches') || '[]');
    setBranches(loadedBranches);
    setInventory(JSON.parse(localStorage.getItem('erp_inventory') || '[]'));
    setSales(JSON.parse(localStorage.getItem('erp_sales') || '[]'));
    setShortages(JSON.parse(localStorage.getItem('erp_shortages') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('erp_products') || '[]'));
    if (loadedBranches.length > 0) {
      setSelectedBranch(loadedBranches[0].id);
    }
  };

  const getBranchStats = (branchId: string) => {
    const branchInventory = inventory.filter(i => i.branch_id === branchId);
    const branchSales = sales.filter(s => s.branch_id === branchId);
    const branchShortages = shortages.filter(s => s.branch_id === branchId && s.status === 'requested');

    const inventoryValue = branchInventory.reduce((sum, inv) => {
      const product = products.find(p => p.id === inv.product_id);
      return sum + (product ? product.cost_price * inv.quantity : 0);
    }, 0);

    const totalSales = branchSales.reduce((sum, s) => sum + s.total_amount, 0);

    return {
      inventoryItems: branchInventory.length,
      inventoryValue,
      totalSales,
      pendingShortages: branchShortages.length,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedBranchData = branches.find(b => b.id === selectedBranch);
  const stats = selectedBranch ? getBranchStats(selectedBranch) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Branch Management</h1>
        <p className="text-gray-600">Monitor and manage all branch operations</p>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => {
          const stats = getBranchStats(branch.id);
          return (
            <div
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all cursor-pointer ${
                selectedBranch === branch.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  branch.is_hq ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                {branch.is_hq && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    HQ
                  </span>
                )}
              </div>

              <h3 className="text-gray-900 mb-1">{branch.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{branch.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{branch.manager_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{branch.contact}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Inventory Items</p>
                  <p className="text-sm text-gray-900">{stats.inventoryItems}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shortages</p>
                  <p className="text-sm text-gray-900">{stats.pendingShortages}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Branch Details */}
      {selectedBranchData && stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">{selectedBranchData.name} - Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
              <p className="text-gray-900">{formatCurrency(stats.totalSales)}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Inventory Value</p>
              </div>
              <p className="text-gray-900">{formatCurrency(stats.inventoryValue)}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Stock Items</p>
              </div>
              <p className="text-gray-900">{stats.inventoryItems}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
              <p className="text-gray-900">{stats.pendingShortages}</p>
            </div>
          </div>

          {/* Branch Inventory */}
          <div className="mt-6">
            <h3 className="text-gray-900 mb-4">Branch Inventory</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Min Level</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory
                    .filter(i => i.branch_id === selectedBranch)
                    .slice(0, 5)
                    .map((inv) => {
                      const product = products.find(p => p.id === inv.product_id);
                      if (!product) return null;
                      const isLow = inv.quantity <= inv.min_stock_level;
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {inv.quantity} {product.unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {inv.min_stock_level} {product.unit}
                          </td>
                          <td className="px-4 py-3">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                <AlertCircle className="w-3 h-3" />
                                Low
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                OK
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
      )}
    </div>
  );
}

import { Package } from 'lucide-react';
