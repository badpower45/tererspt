import { useState } from 'react';
import { X } from 'lucide-react';
import type { Product, ProductCategory, Unit } from '../../types';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'factory1_chassis' as ProductCategory,
    unit: product?.unit || 'piece' as Unit,
    brand: product?.brand || '',
    cost_price: product?.cost_price || 0,
    sell_price: product?.sell_price || 0,
    min_sell_price: product?.min_sell_price || 0,
    specifications: product?.specifications || {},
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleAddSpecification = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey]: specValue,
        },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      ...formData,
      created_at: product?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(newProduct);
  };

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'factory1_chassis', label: 'Factory 1 - Chassis' },
    { value: 'factory1_panel', label: 'Factory 1 - Electric Panel' },
    { value: 'factory2_cable_dc', label: 'Factory 2 - DC Cable' },
    { value: 'factory2_cable_ac', label: 'Factory 2 - AC Cable' },
    { value: 'import_solar_panel', label: 'Import - Solar Panel' },
    { value: 'partner_inverter', label: 'Partner - Inverter' },
  ];

  const units: { value: Unit; label: string }[] = [
    { value: 'piece', label: 'Piece' },
    { value: 'ton', label: 'Ton' },
    { value: 'meter', label: 'Meter' },
    { value: 'roll', label: 'Roll' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Cost Price (EGP) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Sell Price (EGP) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sell_price}
                  onChange={(e) => setFormData({ ...formData, sell_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Min Sell Price (EGP) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_sell_price}
                  onChange={(e) => setFormData({ ...formData, min_sell_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Profit Calculation */}
            {formData.sell_price > 0 && formData.cost_price > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit Margin:</span>
                  <span className="text-blue-700">
                    {((formData.sell_price - formData.cost_price) / formData.cost_price * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Profit per Unit:</span>
                  <span className="text-blue-700">
                    {(formData.sell_price - formData.cost_price).toFixed(2)} EGP
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-gray-900 mb-4">Specifications</h3>
            
            {/* Add Specification */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Specification name (e.g., wattage)"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value (e.g., 550W)"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Specifications List */}
            {Object.keys(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="ml-2 text-sm text-gray-900">{String(value)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(key)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
