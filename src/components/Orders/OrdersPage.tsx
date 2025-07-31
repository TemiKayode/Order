import React, { useState, useEffect } from 'react';
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
  X,
  Edit
} from 'lucide-react';
import { useProductData } from '../../hooks/useProductData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Customer, Transaction, OrderItem, BusinessSettings } from '../../types'; // Import BusinessSettings
import { BUSINESS_CONFIG } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export const OrdersPage: React.FC = () => {
  const { products } = useProductData();
  const [customers] = useLocalStorage<Customer[]>('customers', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'POS'>('Cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReviewOrder, setShowReviewOrder] = useState(false); // New state for review order visibility
  const [amountPaidPos, setAmountPaidPos] = useState<number>(0);
  const [amountPaidCash, setAmountPaidCash] = useState<number>(0);

  const { user } = useAuth();
  const { addNotification } = useNotification();

  // Retrieve business settings from local storage
  const [businessSettings] = useLocalStorage<BusinessSettings>('businessSettings', {
    businessName: BUSINESS_CONFIG.BUSINESS_NAME,
    businessAddress: BUSINESS_CONFIG.BUSINESS_ADDRESS,
    phoneNumbers: BUSINESS_CONFIG.PHONE_NUMBERS,
    emailAddress: BUSINESS_CONFIG.EMAIL_ADDRESS,
    currency: BUSINESS_CONFIG.CURRENCY,
    posChargeAmount: BUSINESS_CONFIG.POS_CHARGE_AMOUNT,
    taxRate: BUSINESS_CONFIG.TAX_RATE,
    lowStockThreshold: 10
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate subtotal and total whenever cart or payment method changes
  const subtotal = cart.reduce((sum, item) => sum + (item.editablePrice ?? item.price) * item.quantity, 0);
  // Use businessSettings.posChargeAmount for POS charge
  const posCharge = paymentMethod === 'POS' ? businessSettings.posChargeAmount : 0;
  const total = subtotal + posCharge;

  const amountLeftToPay = total - (amountPaidPos + amountPaidCash);

  const addToCart = (product: any) => {
    if (product.quantity <= 0) {
      addNotification(`Product "${product.name}" is out of stock`, 'warning');
      return;
    }

    const existingItemIndex = cart.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
      const existingItem = cart[existingItemIndex];
      if (existingItem.quantity >= product.quantity) {
        addNotification(`Not enough stock available for "${product.name}"`, 'warning');
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
        // Recalculate total based on original or editable price
        total: (existingItem.editablePrice ?? existingItem.price) * (existingItem.quantity + 1)
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price // Initial total based on original price
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
      addNotification(`Not enough stock available for this quantity`, 'warning');
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? {
            ...item,
            quantity: newQuantity,
            // Recalculate total based on original or editable price
            total: (item.editablePrice ?? item.price) * newQuantity
          }
        : item
    ));
  };

  const updateEditablePrice = (productId: string, newPrice: number) => {
    setCart(cart.map(item =>
      item.productId === productId
        ? {
            ...item,
            editablePrice: newPrice,
            // Recalculate total based on the new editable price
            total: newPrice * item.quantity
          }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleProcessOrderClick = () => {
    if (cart.length === 0) {
      addNotification('Please add items to cart', 'warning');
      return;
    }
    setShowReviewOrder(true);
  };

  const processOrder = () => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: cart.map(item => ({
         ...item,
         price: item.editablePrice ?? item.price // Save the effective price (edited or original)
      })), // Use the potentially edited price for the transaction record
      subtotal,
      posCharge,
      total,
      paymentMethod,
      amountPaidPos,
      amountPaidCash,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      createdBy: user?.username || 'Unknown'
    };

    // Save transaction
    setTransactions([...transactions, transaction]);

    // Print receipt (in real app, this would send to printer)
    printReceipt(transaction);

    // Clear cart and reset review order state
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod('Cash');
    setAmountPaidPos(0);
    setAmountPaidCash(0);
    setShowReviewOrder(false);
    addNotification('Order processed successfully!', 'success');
  };

  const printReceipt = (transaction: Transaction) => {
    const receiptContent = `
      <div style="width: 300px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; margin: 0 auto; padding: 20px;">
        <!-- Business Logo and Header -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${businessSettings.businessName}</div>
          <div style="font-size: 10px; margin-bottom: 3px;">${businessSettings.businessAddress}</div>
          <div style="font-size: 10px; margin-bottom: 3px;">Tel: ${businessSettings.phoneNumbers}</div>
          <div style="font-size: 10px;">${businessSettings.emailAddress}</div>
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
            <span style="width: 60px; text-align: right;">Price</span>
            <span style="width: 60px; text-align: right;">Total</span>
          </div>
        </div>

        <!-- Items List -->
        <div style="margin-bottom: 15px;">
          ${transaction.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 10px;">
              <span style="width: 30px; text-align: center;">${item.quantity}</span>
              <span style="flex: 1; text-align: left; padding-left: 5px; padding-right: 5px;">${item.productName}</span>
              <span style="width: 60px; text-align: right;">${businessSettings.currency}${(item.editablePrice ?? item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span style="width: 60px; text-align: right; font-weight: bold;">${businessSettings.currency}${item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          `).join('')}
        </div>

        <!-- Totals -->
        <div style="border-top: 1px dashed #000; padding-top: 10px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px;">
            <span>Subtotal:</span>
            <span>${businessSettings.currency}${transaction.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          ${transaction.posCharge > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px;">
              <span>POS Charge:</span>
              <span>${businessSettings.currency}${transaction.posCharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px;">
            <span>TOTAL:</span>
            <span>${businessSettings.currency}${transaction.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
            <span>Payment Method:</span>
            <span>${transaction.paymentMethod}</span>
          </div>
          ${transaction.amountPaidPos > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
              <span>Paid with POS:</span>
              <span>${businessSettings.currency}${transaction.amountPaidPos.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
          ${transaction.amountPaidCash > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
              <span>Paid with Cash:</span>
              <span>${businessSettings.currency}${transaction.amountPaidCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 2px solid #000; padding-top: 15px; font-size: 10px;">
          <div style="margin-bottom: 10px; font-weight: bold;">Thank you for your business!</div>
          <div style="margin-bottom: 5px;">Visit us again soon</div>
          <div>Powered by WumiKay POS System</div>
        </div>
      </div>
    `;

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
                // Close the window after printing (optional)
                // window.close();
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
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {businessSettings.currency}{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                {/* Quantity controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Product Name and Editable Price Input */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                     <span>{businessSettings.currency}</span>
                     <input
                        type="number"
                        step="0.01"
                        value={item.editablePrice ?? item.price} // Use editablePrice if available, otherwise original price
                        onChange={(e) => updateEditablePrice(item.productId, parseFloat(e.target.value))}
                        className="w-20 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                     />
                  </div>
                </div>

                {/* Item Total */}
                <div className="w-16 text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {businessSettings.currency}{item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
                    : 'border-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                <span>{businessSettings.currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {posCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>POS Charge:</span>
                  <span>{businessSettings.currency}{posCharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span>{businessSettings.currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handleProcessOrderClick} // Use the new handler
              disabled={cart.length === 0}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Receipt className="h-5 w-5" />
              <span>Review Order</span>
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

      {/* Review Order Modal */}
      {showReviewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Order</h3>
              <button onClick={() => setShowReviewOrder(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Cart Items in Review */}
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.quantity} x {item.productName}</span>
                    <span>{businessSettings.currency}{(item.editablePrice ?? item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
              {/* Total in Review */}
               <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>Order Total:</span>
                  <span>{businessSettings.currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              {/* Payment Inputs */}
              <div className="space-y-2">
                <div>
                  <label htmlFor="amountPaidPos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid with POS</label>
                  <input
                    type="number"
                    id="amountPaidPos"
                    step="0.01"
                    value={amountPaidPos}
                    onChange={(e) => setAmountPaidPos(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="amountPaidCash" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid with Cash</label>
                  <input
                    type="number"
                    id="amountPaidCash"
                    step="0.01"
                    value={amountPaidCash}
                    onChange={(e) => setAmountPaidCash(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              {/* Amount Left to Pay */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between text-base font-semibold text-red-600 dark:text-red-400">
                  <span>Amount Left to Pay:</span>
                  <span>{businessSettings.currency}{amountLeftToPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={processOrder}
                disabled={amountLeftToPay > 0 || (amountPaidCash + amountPaidPos === 0)}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Receipt className="h-5 w-5" />
                <span>Complete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
