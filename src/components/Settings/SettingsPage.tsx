import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Store, 
  DollarSign, 
  Printer, 
  Users, 
  Shield,
  Bell,
  Palette,
  Database,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../contexts/ThemeContext';
import { BUSINESS_CONFIG } from '../../constants';

interface BusinessSettings {
  businessName: string;
  businessAddress: string;
  phoneNumbers: string;
  emailAddress: string;
  currency: string;
  posChargeAmount: number;
  taxRate: number;
  lowStockThreshold: number;
}

interface PrinterSettings {
  receiptWidth: number;
  printLogo: boolean;
  printFooter: boolean;
  footerText: string;
}

interface NotificationSettings {
  lowStockAlerts: boolean;
  dailyReports: boolean;
  emailNotifications: boolean;
  soundAlerts: boolean;
}

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'business' | 'printer' | 'notifications' | 'users' | 'data'>('business');
  
  const [businessSettings, setBusinessSettings] = useLocalStorage<BusinessSettings>('businessSettings', {
    businessName: BUSINESS_CONFIG.BUSINESS_NAME,
    businessAddress: BUSINESS_CONFIG.BUSINESS_ADDRESS,
    phoneNumbers: BUSINESS_CONFIG.PHONE_NUMBERS,
    emailAddress: BUSINESS_CONFIG.EMAIL_ADDRESS,
    currency: BUSINESS_CONFIG.CURRENCY,
    posChargeAmount: BUSINESS_CONFIG.POS_CHARGE_AMOUNT,
    taxRate: BUSINESS_CONFIG.TAX_RATE,
    lowStockThreshold: 10
  });

  const [printerSettings, setPrinterSettings] = useLocalStorage<PrinterSettings>('printerSettings', {
    receiptWidth: 80,
    printLogo: true,
    printFooter: true,
    footerText: 'Thank you for your business!'
  });

  const [notificationSettings, setNotificationSettings] = useLocalStorage<NotificationSettings>('notificationSettings', {
    lowStockAlerts: true,
    dailyReports: false,
    emailNotifications: false,
    soundAlerts: true
  });

  const [users] = useLocalStorage('users', []);
  const [products] = useLocalStorage('products', []);
  const [customers] = useLocalStorage('customers', []);
  const [transactions] = useLocalStorage('transactions', []);

  const handleBusinessSettingsChange = (field: keyof BusinessSettings, value: string | number) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrinterSettingsChange = (field: keyof PrinterSettings, value: string | number | boolean) => {
    setPrinterSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationSettingsChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const exportData = () => {
    const data = {
      users,
      products,
      customers,
      transactions,
      businessSettings,
      printerSettings,
      notificationSettings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wumikay-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (window.confirm('This will replace all current data. Are you sure?')) {
          if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
          if (data.products) localStorage.setItem('products', JSON.stringify(data.products));
          if (data.customers) localStorage.setItem('customers', JSON.stringify(data.customers));
          if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
          if (data.businessSettings) setBusinessSettings(data.businessSettings);
          if (data.printerSettings) setPrinterSettings(data.printerSettings);
          if (data.notificationSettings) setNotificationSettings(data.notificationSettings);
          
          alert('Data imported successfully! Please refresh the page.');
        }
      } catch (error) {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('This will permanently delete ALL data including products, customers, transactions, and settings. This action cannot be undone. Are you sure?')) {
      if (window.confirm('Are you absolutely sure? This will reset the entire system.')) {
        localStorage.clear();
        alert('All data has been cleared. The page will now reload.');
        window.location.reload();
      }
    }
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Store },
    { id: 'printer', label: 'Receipt Settings', icon: Printer },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your business settings and preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessSettings.businessName}
                      onChange={(e) => handleBusinessSettingsChange('businessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={businessSettings.emailAddress}
                      onChange={(e) => handleBusinessSettingsChange('emailAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={businessSettings.businessAddress}
                      onChange={(e) => handleBusinessSettingsChange('businessAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Numbers
                    </label>
                    <input
                      type="text"
                      value={businessSettings.phoneNumbers}
                      onChange={(e) => handleBusinessSettingsChange('phoneNumbers', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={businessSettings.currency}
                      onChange={(e) => handleBusinessSettingsChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      POS Charge Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={businessSettings.posChargeAmount}
                      onChange={(e) => handleBusinessSettingsChange('posChargeAmount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={businessSettings.taxRate * 100}
                      onChange={(e) => handleBusinessSettingsChange('taxRate', parseFloat(e.target.value) / 100)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Settings</h3>
                <div className="flex items-center space-x-4">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Printer Settings */}
          {activeTab === 'printer' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Receipt Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Receipt Width (mm)
                    </label>
                    <input
                      type="number"
                      value={printerSettings.receiptWidth}
                      onChange={(e) => handlePrinterSettingsChange('receiptWidth', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="printLogo"
                      checked={printerSettings.printLogo}
                      onChange={(e) => handlePrinterSettingsChange('printLogo', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="printLogo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Print Business Logo on Receipt
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="printFooter"
                      checked={printerSettings.printFooter}
                      onChange={(e) => handlePrinterSettingsChange('printFooter', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="printFooter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Print Footer Message
                    </label>
                  </div>

                  {printerSettings.printFooter && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Footer Text
                      </label>
                      <input
                        type="text"
                        value={printerSettings.footerText}
                        onChange={(e) => handlePrinterSettingsChange('footerText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Alert Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="lowStockAlerts"
                      checked={notificationSettings.lowStockAlerts}
                      onChange={(e) => handleNotificationSettingsChange('lowStockAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="lowStockAlerts" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Low Stock Alerts
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="dailyReports"
                      checked={notificationSettings.dailyReports}
                      onChange={(e) => handleNotificationSettingsChange('dailyReports', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dailyReports" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Sales Reports
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => handleNotificationSettingsChange('emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="soundAlerts"
                      checked={notificationSettings.soundAlerts}
                      onChange={(e) => handleNotificationSettingsChange('soundAlerts', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="soundAlerts" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sound Alerts
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Users</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Current system users ({users.length} total)
                  </p>
                  <div className="space-y-2">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.username} • {user.role}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Backup & Restore</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Export Data</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Download a complete backup of all your data including products, customers, transactions, and settings.
                    </p>
                    <button
                      onClick={exportData}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Backup</span>
                    </button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Import Data</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                      Restore data from a previously exported backup file. This will replace all current data.
                    </p>
                    <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Import Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Database Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customers</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Permanently delete all data from the system. This action cannot be undone.
                </p>
                <button
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};