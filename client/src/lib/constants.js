// Application Constants

// Item Categories
export const ITEM_CATEGORIES = [
  { value: 'clothes', label: 'Clothes', icon: '👕' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'furniture', label: 'Furniture', icon: '🛋️' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'toys', label: 'Toys', icon: '🧸' },
  { value: 'kitchen', label: 'Kitchen Items', icon: '🍴' },
  { value: 'other', label: 'Other', icon: '📦' },
];

// Item Conditions
export const ITEM_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'slightly_used', label: 'Slightly Used' },
];

// User Roles
export const USER_ROLES = [
  { value: 'pending', label: 'Pending Role Selection' },
  { value: 'donor', label: 'Donor' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'ngo', label: 'NGO' },
  { value: 'admin', label: 'Admin' },
];

// User Statuses
export const USER_STATUSES = [
  { value: 'unverified', label: 'Unverified' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'verified', label: 'Verified' },
  { value: 'suspended', label: 'Suspended' },
];

// Item Statuses
export const ITEM_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'delivered', label: 'Delivered' },
];

// Badge Levels
export const BADGE_LEVELS = [
  { 
    value: 'none', 
    label: 'No Badge', 
    color: 'gray',
    description: 'No donations yet' 
  },
  { 
    value: 'bronze', 
    label: 'Bronze Giver', 
    color: 'orange',
    range: '1-4 donations',
    description: 'Start your giving journey' 
  },
  { 
    value: 'silver', 
    label: 'Silver Champion', 
    color: 'gray',
    range: '5-9 donations',
    description: 'Regular contributor' 
  },
  { 
    value: 'gold', 
    label: 'Gold Hero', 
    color: 'yellow',
    range: '10+ donations',
    description: 'Community hero' 
  },
];

// Color mappings for consistent styling
export const STATUS_COLORS = {
  // User status colors
  verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  unverified: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  
  // Item status colors
  available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  claimed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  delivered: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

export const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  donor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  recipient: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  ngo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export const BADGE_COLORS = {
  bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    SELECT_ROLE: '/api/auth/select-role',
  },
  ITEMS: {
    LIST: '/api/items',
    CREATE: '/api/items',
    MY_DONATIONS: '/api/items/my-donations',
    CLAIM: (id) => `/api/items/${id}/claim`,
    DELIVERY_PROOF: (id) => `/api/items/${id}/delivery-proof`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    UPDATE_USER_STATUS: (id) => `/api/admin/users/${id}/status`,
  },
  STATS: '/api/stats',
};

// Application Settings
export const APP_CONFIG = {
  NAME: 'GiveEase',
  DESCRIPTION: 'Simplify Giving, Amplify Impact',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  
  // Badge thresholds
  BADGE_THRESHOLDS: {
    BRONZE: 1,
    SILVER: 5,
    GOLD: 10,
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  
  // Date formats
  DATE_FORMAT: 'MMM dd, yyyy',
  DATETIME_FORMAT: 'MMM dd, yyyy hh:mm a',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please check your permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  INVALID_FILE_TYPE: 'Please select a valid image file (PNG, JPG, GIF).',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You have been successfully logged in.',
  REGISTER_SUCCESS: 'Account created successfully! Please log in to continue.',
  ITEM_CREATED: 'Item added successfully! Your donation is now available for recipients.',
  ITEM_CLAIMED: 'Item claimed successfully! Please arrange for pickup or delivery.',
  STATUS_UPDATED: 'Status updated successfully.',
  DELIVERY_CONFIRMED: 'Delivery confirmed! Thank you for completing this donation.',
};

// Navigation Links
export const NAV_LINKS = [
  { href: '/browse', label: 'Browse Items' },
  { href: '/#how-it-works', label: 'How it Works' },
  { href: '/#impact', label: 'Impact' },
];

// Footer Links
export const FOOTER_LINKS = {
  PLATFORM: [
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/browse', label: 'Browse Items' },
    { href: '/#ngo-partners', label: 'NGO Partners' },
    { href: '/#safety', label: 'Safety & Trust' },
    { href: '/#impact', label: 'Impact Stories' },
  ],
  SUPPORT: [
    { href: '/#help', label: 'Help Center' },
    { href: '/#contact', label: 'Contact Us' },
    { href: '/#privacy', label: 'Privacy Policy' },
    { href: '/#terms', label: 'Terms of Service' },
    { href: '/#guidelines', label: 'Community Guidelines' },
  ],
};

export default {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  USER_ROLES,
  USER_STATUSES,
  ITEM_STATUSES,
  BADGE_LEVELS,
  STATUS_COLORS,
  ROLE_COLORS,
  BADGE_COLORS,
  API_ENDPOINTS,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NAV_LINKS,
  FOOTER_LINKS,
};
