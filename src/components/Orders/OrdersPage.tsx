import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote,
  Receipt,
  User,
  X
} from 'lucide-react';
import { useProductData } from '../../hooks/useProductData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Customer, Transaction, OrderItem } from '../../types';
import { BUSINESS_CONFIG } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

export const OrdersPage: React.FC = () => {
  const { products } = useProductData();
  const [customers] = useLocalStorage<Customer[]>('customers', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'POS'>('Cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const { user } = useAuth();

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    if (product.quantity <= 0) {
      alert('Product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        alert('Not enough stock available');
        return;
      }
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.quantity) {
      alert('Not enough stock available');
      return;
    }

    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const posCharge = paymentMethod === 'POS' ? BUSINESS_CONFIG.POS_CHARGE_AMOUNT : 0;
  const total = subtotal + posCharge;

  const processOrder = () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: cart,
      subtotal,
      posCharge,
      total,
      paymentMethod,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      createdBy: user?.username || 'Unknown'
    };

    // Save transaction
    setTransactions([...transactions, transaction]);

    // Print receipt (in real app, this would send to printer)
    printReceipt(transaction);

    // Clear cart
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod('Cash');
  };

  const printReceipt = (transaction: Transaction) => {
    const receiptContent = `
      <div style="width: 300px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; margin: 0 auto; padding: 20px;">
        <!-- Business Logo and Header -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${BUSINESS_CONFIG.BUSINESS_NAME}</div>
          <div style="font-size: 10px; margin-bottom: 3px;">${BUSINESS_CONFIG.BUSINESS_ADDRESS}</div>
          <div style="font-size: 10px; margin-bottom: 3px;">Tel: ${BUSINESS_CONFIG.PHONE_NUMBERS}</div>
          <div style="font-size: 10px;">${BUSINESS_CONFIG.EMAIL_ADDRESS}</div>
        </div>

        <!-- Receipt Details -->
        <div style="margin-bottom: 15px; font-size: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Receipt #:</span>
            <span>${transaction.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Date:</span>
            <span>${new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Customer:</span>
            <span>${transaction.customerName}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Cashier:</span>
            <span>${transaction.createdBy}</span>
          </div>
        </div>

        <!-- Items Header -->
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10px;">
            <span style="width: 30px;">Qty</span>
            <span style="flex: 1; text-align: left; padding-left: 5px;">Item</span>
            <span style="width: 60px; text-align: right;">Subtotal</span>
          </div>
        </div>

        <!-- Items List -->
        <div style="margin-bottom: 15px;">
          ${transaction.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 10px;">
              <span style="width: 30px; text-align: center;">${item.quantity}</span>
              <span style="flex: 1; text-align: left; padding-left: 5px; padding-right: 5px;">
                ${item.productName}
                <br>
                <span style="font-size: 9px; color: #666;">@ ${BUSINESS_CONFIG.CURRENCY}${item.price.toLocaleString()}</span>
              </span>
              <span style="width: 60px; text-align: right; font-weight: bold;">${BUSINESS_CONFIG.CURRENCY}${item.total.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>

        <!-- Totals -->
        <div style="border-top: 1px dashed #000; padding-top: 10px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px;">
            <span>Subtotal:</span>
            <span>${BUSINESS_CONFIG.CURRENCY}${transaction.subtotal.toLocaleString()}</span>
          </div>
          ${transaction.posCharge > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px;">
              <span>POS Charge:</span>
              <span>${BUSINESS_CONFIG.CURRENCY}${transaction.posCharge.toLocaleString()}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px;">
            <span>TOTAL:</span>
            <span>${BUSINESS_CONFIG.CURRENCY}${transaction.total.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
            <span>Payment:</span>
            <span>${transaction.paymentMethod}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 2px solid #000; padding-top: 15px; font-size: 10px;">
          <div style="margin-bottom: 10px; font-weight: bold;">Thank you for your business!</div>
          <div style="margin-bottom: 5px;">Visit us again soon</div>
          <div>Powered by WumiKay POS System</div>
        </div>
      </div>
    `;

    // In a real app, this would be sent to a receipt printer
    // For now, we'll show it in a new window with proper styling
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${transaction.id}</title>
            <style>
              body { margin: 0; padding: 0; background: white; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${receiptContent}
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    product.quantity <= 0
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {BUSINESS_CONFIG.CURRENCY}{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${product.quantity <= 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {product.quantity} left
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({cart.length})
          </h2>
        </div>

        <div className="p-4">
          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
              </button>
              {selectedCustomer && (
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {BUSINESS_CONFIG.CURRENCY}{item.price.toLocaleString()} each
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {BUSINESS_CONFIG.CURRENCY}{item.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center justify-center px-3 py-2 border rounded-lg transition-colors ${
                  paymentMethod === 'Cash'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('POS')}
                className={`flex items-center justify-center px-3 py-2 border rounded-lg transition-colors ${
                  paymentMethod === 'POS'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                POS
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{BUSINESS_CONFIG.CURRENCY}{subtotal.toLocaleString()}</span>
              </div>
              {posCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>POS Charge:</span>
                  <span>{BUSINESS_CONFIG.CURRENCY}{posCharge.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span>{BUSINESS_CONFIG.CURRENCY}{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={processOrder}
              disabled={cart.length === 0}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Receipt className="h-5 w-5" />
              <span>Process Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Customer</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setShowCustomerModal(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Walk-in Customer</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">No customer information</div>
                </button>
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerModal(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.phone} • {customer.totalOrders} orders
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};