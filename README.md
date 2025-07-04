# WumiKay Ventures - Order Management System

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

### 🛒 **Order Management**
- **Real-time POS System** - Process orders with intuitive cart interface
- **Multiple Payment Methods** - Support for Cash and POS transactions
- **Receipt Generation** - Professional receipt printing with business branding
- **Customer Selection** - Link orders to customer profiles

### 📦 **Inventory Management**
- **Product Catalog** - Comprehensive product database with categories
- **Stock Tracking** - Real-time inventory levels and low stock alerts
- **Bulk Import** - Load products from JSON files
- **Barcode Support** - Product identification and scanning ready

### 👥 **Customer Management**
- **Customer Database** - Store customer information and purchase history
- **Order History** - Track customer transactions and spending patterns
- **Customer Analytics** - Insights into customer behavior and preferences
- **Export/Import** - CSV export for customer data

### 📊 **Reports & Analytics**
- **Sales Reports** - Daily, weekly, monthly sales analysis
- **Product Performance** - Best-selling products and revenue tracking
- **Customer Analytics** - Customer lifetime value and order patterns
- **Export Functionality** - Generate CSV reports for external analysis

### ⚙️ **System Management**
- **User Authentication** - Secure login with role-based access (Admin/Cashier)
- **Business Configuration** - Customizable business settings and branding
- **Data Backup/Restore** - Complete system backup and restore functionality
- **Theme Support** - Light/Dark mode with system preference detection
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🎨 **User Experience**
- **Modern UI/UX** - Clean, professional interface design
- **Dark/Light Mode** - Automatic theme switching based on user preference
- **Offline Capability** - Local storage ensures functionality without internet
- **Print Integration** - Professional receipt printing with business logo

## 🚀 Demo

### Live Demo
- **URL**: [Coming Soon - Deploy to see live demo]
- **Demo Credentials**:
  - **Admin**: `admin` / `admin123`
  - **Cashier**: `cashier` / `cashier123`

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/wumikay-order-management.git

# Navigate to project directory
cd wumikay-order-management

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=Dashboard+Overview)

### Point of Sale Interface
![POS System](https://via.placeholder.com/800x400/059669/ffffff?text=POS+Interface)

### Product Management
![Products](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Product+Management)

### Customer Management
![Customers](https://via.placeholder.com/800x400/dc2626/ffffff?text=Customer+Management)

## 🛠 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Modern web browser

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wumikay-order-management.git
   cd wumikay-order-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Getting Started

1. **Login** with demo credentials:
   - Admin: `admin` / `admin123`
   - Cashier: `cashier` / `cashier123`

2. **Load Sample Data**:
   - Navigate to Products page
   - Click "Load Sample Data" to populate with WumiKay products

3. **Process Your First Order**:
   - Go to Orders page
   - Add products to cart
   - Select payment method
   - Process order and print receipt

### Key Workflows

#### **Processing an Order**
1. Navigate to **Orders** page
2. Search and select products
3. Adjust quantities as needed
4. Select customer (optional)
5. Choose payment method (Cash/POS)
6. Click "Process Order"
7. Print receipt

#### **Managing Inventory**
1. Go to **Products** page
2. Add new products or edit existing ones
3. Monitor stock levels and low stock alerts
4. Use bulk import for large product catalogs

#### **Customer Management**
1. Access **Customers** page
2. Add customer information
3. View purchase history and analytics
4. Export customer data for marketing

#### **Viewing Reports**
1. Open **Reports** page
2. Select date range and report type
3. Analyze sales trends and performance
4. Export data for further analysis

## 📁 Project Structure

```
wumikay-order-management/
├── public/
│   ├── products.json          # Sample product data
│   └── vite.svg              # Vite logo
├── src/
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Products/        # Product management
│   │   ├── Orders/          # Order processing
│   │   ├── Customers/       # Customer management
│   │   ├── Reports/         # Analytics and reports
│   │   ├── Settings/        # Application settings
│   │   └── Layout/          # Layout components
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useProductData.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/           # Application constants
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

## 🔧 Technologies Used

### **Frontend Framework**
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach

### **State Management**
- **React Context API** - Global state management
- **Local Storage** - Client-side data persistence
- **Custom Hooks** - Reusable state logic

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## ⚙️ Configuration

### Business Settings

Update business information in `src/constants/index.ts`:

```typescript
export const BUSINESS_CONFIG = {
  BUSINESS_NAME: "Your Business Name",
  BUSINESS_ADDRESS: "Your Business Address",
  PHONE_NUMBERS: "Your Phone Numbers",
  EMAIL_ADDRESS: "your@email.com",
  CURRENCY: "₦", // or your currency symbol
  POS_CHARGE_AMOUNT: 150.00,
  TAX_RATE: 0.075
};
```

### Theme Configuration

Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your primary colors */ },
      secondary: { /* your secondary colors */ }
    }
  }
}
```

### Product Data

Replace sample products in `public/products.json` with your inventory:

```json
[
  {
    "id": "1",
    "name": "Product Name",
    "description": "Product Description",
    "price": 100.00,
    "quantity": 50,
    "category": "Category",
    "barcode": "BARCODE123",
    "lowStockThreshold": 10
  }
]
```

## 🚀 Deployment

### **Netlify (Recommended)**

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect GitHub repository for automatic deployments

### **Vercel**

```bash
npm install -g vercel
vercel --prod
```

### **GitHub Pages**

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### **Self-Hosted**

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist` folder to your web server
3. Configure web server to serve `index.html` for all routes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

### **Code Style**

- Use ESLint configuration provided
- Follow React functional component patterns
- Use TypeScript interfaces for type safety
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 WumiKay Ventures

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

### **Getting Help**

- **Documentation**: Check this README and inline code comments
- **Issues**: [Create an issue](https://github.com/yourusername/wumikay-order-management/issues) for bugs or feature requests
- **Discussions**: [Join discussions](https://github.com/yourusername/wumikay-order-management/discussions) for questions and ideas

### **Contact Information**
### **Feature Requests**

We're always looking to improve! If you have ideas for new features:

1. Check existing [issues](https://github.com/yourusername/wumikay-order-management/issues) first
2. Create a new issue with the "enhancement" label
3. Describe your use case and proposed solution
4. We'll review and discuss implementation

---

<div align="center">
  <p>Made with ❤️ for WumiKay Ventures</p>
  <p>
    <a href="#-table-of-contents">Back to Top</a> •
    <a href="https://github.com/yourusername/wumikay-order-management/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/wumikay-order-management/issues">Request Feature</a>
  </p>
</div>
