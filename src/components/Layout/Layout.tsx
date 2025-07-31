import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  // Function to trigger a notification (can be called from other components)
  const triggerNotification = () => {
    setHasNotification(true);
    // Optionally, set a timeout to clear the notification after a few seconds
    setTimeout(() => {
      setHasNotification(false);
    }, 5000); // Notification disappears after 5 seconds
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Removed md:ml-64 from here */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass notification state and trigger function to Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} hasNotification={hasNotification} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {/* We'll need to pass triggerNotification down to components that need to show notifications */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // This is a basic example, a more robust solution would use Context API
              return React.cloneElement(child as React.ReactElement<any>, { triggerNotification });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
};
