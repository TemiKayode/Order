import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Clock
} from 'lucide-react';
import { useProductData } from '../../hooks/useProductData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Transaction, Customer } from '../../types';
import { BUSINESS_CONFIG } from '../../constants';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className={`text-xs ${color} mt-1 flex items-center`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')} dark:${color.replace('text-', 'bg-').replace('-600', '-900')}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { products } = useProductData();
  const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [customers] = useLocalStorage<Customer[]>('customers', []);

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayTransactions = transactions.filter(t => 
    new Date(t.createdAt) >= todayStart && t.status === 'Completed'
  );
  
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);

  const recentTransactions = transactions
    .filter(t => t.status === 'Completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to {BUSINESS_CONFIG.BUSINESS_NAME} Order Management System
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 inline mr-1" />
            {format(today, 'MMMM dd, yyyy')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 inline mr-1" />
            {format(today, 'HH:mm')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`${BUSINESS_CONFIG.CURRENCY}${todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          trend="+12.5% from yesterday"
          color="text-green-600"
        />
        <StatCard
          title="Total Products"
          value={products.length.toString()}
          icon={<Package className="h-6 w-6 text-blue-600" />}
          trend={`${lowStockProducts.length} low stock`}
          color="text-blue-600"
        />
        <StatCard
          title="Today's Orders"
          value={todayTransactions.length.toString()}
          icon={<ShoppingCart className="h-6 w-6 text-purple-600" />}
          trend="+8.2% from yesterday"
          color="text-purple-600"
        />
        <StatCard
          title="Total Customers"
          value={customers.length.toString()}
          icon={<Users className="h-6 w-6 text-orange-600" />}
          trend="+5 new this week"
          color="text-orange-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          </div>
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.customerName || 'Walk-in Customer'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {BUSINESS_CONFIG.CURRENCY}{transaction.total.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alert
            </h3>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                All products are well stocked
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        {product.quantity} left
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Min: {product.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};