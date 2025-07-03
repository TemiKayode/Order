export const BUSINESS_CONFIG = {
  BUSINESS_NAME: "WumiKay Ventures",
  BUSINESS_ADDRESS: "Beside Enuogbope Hospital, Kobongbogboe, Osogbo, Osun State",
  PHONE_NUMBERS: "08033683156, 07050509775",
  EMAIL_ADDRESS: "Kayodeomowumii@gmail.com",
  LOGO_PATH: "assets/icon.png",
  POS_CHARGE_AMOUNT: 150.00,
  CURRENCY: "₦",
  TAX_RATE: 0.075
};

export const DATA_FILES = {
  PRODUCT_DATA_FILE: "products.json",
  USER_DATA_FILE: "users.json",
  CUSTOMER_DATA_FILE: "customers.json",
  TRANSACTION_DATA_FILE: "transactions.json",
  ACTIVITY_LOG_FILE: "activity_log.json",
  CONFIG_FILE: "config.json"
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  CASHIER: 'Cashier',
  MANAGER: 'Manager'
} as const;

export const PAYMENT_METHODS = {
  CASH: 'Cash',
  POS: 'POS'
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled'
} as const;