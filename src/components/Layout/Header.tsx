import React, { useState } from 'react';
import { Menu, Sun, Moon, Monitor, Bell, XCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, setTheme, isDark } = useTheme();
  const { user } = useAuth();
  const { notifications, removeNotification } = useNotification();
  const hasNotification = notifications.length > 0;
  const [showNotifications, setShowNotifications] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Welcome back, {user?.fullName}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="appearance-none bg-transparent border-none text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* This approach with absolute positioning might need adjustment based on exact styling */}
            {theme === 'light' && <Sun className="h-5 w-5 text-gray-400 absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none" />}
            {theme === 'dark' && <Moon className="h-5 w-5 text-gray-400 absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none" />}
            {theme === 'system' && <Monitor className="h-5 w-5 text-gray-400 absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none" />}
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {hasNotification && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown/Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-80 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-3 rounded-md ${notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' : notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                          <div className="flex justify-between items-center">
                            <p className={`text-sm ${notification.type === 'error' ? 'text-red-800 dark:text-red-200' : notification.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : notification.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-gray-200'}`}>
                              {notification.message}
                            </p>
                            <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
                                <XCircle className="h-4 w-4"/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
