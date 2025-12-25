import { useEffect, useState } from 'react';
import { Plus, Wrench, Clock, CheckCircle, Calendar } from 'lucide-react';
import { initializeMockData } from '../../lib/mock-data';
import type { Installation, Branch } from '../../types';

export function Installations() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    initializeMockData();
    loadData();
  }, []);

  const loadData = () => {
    setInstallations(JSON.parse(localStorage.getItem('erp_installations') || '[]'));
    setBranches(JSON.parse(localStorage.getItem('erp_branches') || '[]'));
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || 'Unknown';
  };

  const scheduled = installations.filter(i => i.status === 'scheduled').length;
  const inProgress = installations.filter(i => i.status === 'in_progress').length;
  const completed = installations.filter(i => i.status === 'completed').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Installation Management</h1>
          <p className="text-gray-600">Track and manage solar installation projects</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Installation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-gray-900">{installations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Scheduled</p>
              <p className="text-gray-900">{scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-gray-900">{inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-gray-900">{completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Installations List */}
      <div className="space-y-4">
        {installations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No installations scheduled yet</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Schedule Installation</span>
            </button>
          </div>
        ) : (
          installations.map((installation) => (
            <div
              key={installation.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-gray-900">{installation.customer_name}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(installation.status)}`}>
                      {installation.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>Branch: {getBranchName(installation.branch_id)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Scheduled: {new Date(installation.scheduled_date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{installation.customer_contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{installation.location}</span>
                    </div>
                  </div>

                  {installation.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">
                      {installation.notes}
                    </p>
                  )}

                  {/* Installation Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Materials:</p>
                    <div className="space-y-2">
                      {installation.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.product_name} x {item.quantity}
                          </span>
                          <span className="text-gray-900">{formatCurrency(item.unit_price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-700">Labor Cost</span>
                        <span className="text-gray-900">{formatCurrency(installation.labor_cost)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-gray-900 mb-4">{formatCurrency(installation.total_cost)}</p>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Import missing icons
import { Building, Phone, MapPin } from 'lucide-react';
