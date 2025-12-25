import React from 'react';
import { Sale, SaleItem } from '../../types';

interface InvoiceProps {
  sale: Sale;
  branchName: string;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>(({ sale, branchName }, ref) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-[80mm] mx-auto text-center font-cairo print:max-w-full print:w-full">
      {/* Header */}
      <div className="mb-6 border-b-2 border-dashed border-gray-300 pb-4">
        <h1 className="text-2xl font-black mb-2">AddValues Solar</h1>
        <p className="text-sm font-bold text-gray-600 mb-1">{branchName}</p>
        <p className="text-xs text-gray-500">رقم الفاتورة: {sale.id.slice(0, 8)}</p>
        <p className="text-xs text-gray-500">التاريخ: {formatDate(sale.created_at)}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-black">
              <th className="pb-2 font-bold">الصنف</th>
              <th className="pb-2 text-center">الكمية</th>
              <th className="pb-2 text-left">السعر</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2 font-medium">{item.product_name}</td>
                <td className="py-2 text-center">x{item.quantity}</td>
                <td className="py-2 text-left">{(item.total).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-black pt-4 mb-6">
        <div className="flex justify-between mb-1 text-sm">
          <span>المجموع الفرعي:</span>
          <span>{sale.total_amount + (sale.discount || 0)}</span>
        </div>
        {sale.discount && sale.discount > 0 && (
          <div className="flex justify-between mb-1 text-sm text-gray-600">
            <span>الخصم:</span>
            <span>-{sale.discount}</span>
          </div>
        )}
        <div className="flex justify-between mt-2 text-xl font-black border-t border-gray-300 pt-2">
          <span>الإجمالي:</span>
          <span>{sale.total_amount.toLocaleString()} ج.م</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-200 pt-4">
        <p className="mb-1 font-bold">شكراً لثقتكم بـ AddValues</p>
        <p>تطبق الشروط والأحكام</p>
        <p>الرقم الضريبي: 123-456-789</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
